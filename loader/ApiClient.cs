using System.Net;
using System.Net.Http.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace Chroma.Loader;

public sealed record Account(string Username, string Email, string Plan, string Status, string? EndsAt);
public sealed record Visual(string Name, string Slug, string Version, string MinecraftVersion, string Description);
public sealed record Release(string Version, string MinecraftVersion, string FileName, string? DownloadUrl, string ReleaseNotes);
public sealed record ClientVersion(string Version, string MinecraftVersion, string FileName, string? DownloadUrl, string ReleaseNotes)
{
    public string? Id { get; init; }
}

/// <summary>
/// Client for the Chroma website's PostgreSQL-backed session API.
/// The website authenticates with an HttpOnly session cookie, not a Supabase JWT.
/// </summary>
public sealed class ChromaApiClient
{
    public const string WebsiteUrl = "https://chroma-client-pozetiv.vercel.app";
    private readonly CookieContainer cookies = new();
    private readonly HttpClient http;
    private readonly object cookieLock = new();
    private string? sessionToken;

    public ChromaApiClient()
    {
        var handler = new HttpClientHandler { CookieContainer = cookies, UseCookies = true, AutomaticDecompression = DecompressionMethods.All };
        http = new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(25) };
        http.DefaultRequestHeaders.Accept.ParseAdd("application/json");
    }

    public async Task<Account> LoginAsync(string email, string password, bool remember, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new InvalidOperationException("Введите email.");
        if (string.IsNullOrWhiteSpace(password)) throw new InvalidOperationException("Введите пароль.");
        var result = await SendAsync(HttpMethod.Post, "/api/auth/login", new { email = email.Trim(), password, remember }, ct, allowUnauthorizedRetry: false);
        if (!result.IsSuccessStatusCode) throw ApiError(result.StatusCode, await result.Content.ReadAsStringAsync(ct), "Вход не выполнен.");
        RememberSession(remember);
        return await GetAccountAsync(ct);
    }

    public async Task<string> RegisterAsync(string username, string email, string password, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(username)) throw new InvalidOperationException("Введите имя пользователя.");
        if (string.IsNullOrWhiteSpace(email)) throw new InvalidOperationException("Введите email.");
        if (string.IsNullOrWhiteSpace(password) || password.Length < 6) throw new InvalidOperationException("Пароль должен содержать минимум 6 символов.");
        var result = await SendAsync(HttpMethod.Post, "/api/auth/register", new { username = username.Trim(), email = email.Trim(), password, confirmPassword = password, remember = true, lang = "ru" }, ct, allowUnauthorizedRetry: false);
        if (!result.IsSuccessStatusCode) throw ApiError(result.StatusCode, await result.Content.ReadAsStringAsync(ct), "Регистрация не выполнена.");
        RememberSession(true);
        return "Аккаунт создан. Dashboard открыт.";
    }

    public async Task<Account?> RestoreAsync(CancellationToken ct = default)
    {
        LoadSession();
        if (string.IsNullOrWhiteSpace(sessionToken)) return null;
        try { return await GetAccountAsync(ct); }
        catch (SessionExpiredException) { ClearSession(); return null; }
    }

    public async Task<Account> GetAccountAsync(CancellationToken ct = default)
    {
        using var response = await SendAsync(HttpMethod.Get, "/api/me", null, ct, allowUnauthorizedRetry: false);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (response.StatusCode == HttpStatusCode.Unauthorized) { ClearSession(); throw new SessionExpiredException(); }
        if (!response.IsSuccessStatusCode) throw ApiError(response.StatusCode, body, "Не удалось загрузить аккаунт.");
        using var json = JsonDocument.Parse(body);
        var user = json.RootElement.GetProperty("user");
        var sub = user.TryGetProperty("subscription", out var s) ? s : default;
        var plan = sub.ValueKind == JsonValueKind.Object && sub.TryGetProperty("plan", out var p) ? p.GetString() ?? "FREE" : "FREE";
        var ends = sub.ValueKind == JsonValueKind.Object && sub.TryGetProperty("expiresAt", out var e) && e.ValueKind != JsonValueKind.Null ? e.GetString() : null;
        var username = user.TryGetProperty("username", out var n) ? n.GetString() : null;
        var email = user.TryGetProperty("email", out var m) ? m.GetString() : null;
        var active = ends is null || (DateTimeOffset.TryParse(ends, out var date) && date > DateTimeOffset.UtcNow);
        return new Account(username ?? email ?? "Пользователь Chroma", email ?? "", active ? plan.Replace('_', '+') : "FREE", active ? "АКТИВНА" : "FREE", active ? ends : null);
    }

    public async Task<IReadOnlyList<Visual>> GetVisualsAsync(CancellationToken ct = default)
    {
        var versions = await GetAvailableVersionsAsync(ct);
        return versions.Select(v => new Visual(v.FileName, v.Version.ToLowerInvariant(), v.Version, v.MinecraftVersion, v.ReleaseNotes)).ToArray();
    }

    public async Task<Release?> GetLatestReleaseAsync(CancellationToken ct = default)
    {
        var versions = await GetAvailableVersionsAsync(ct);
        var latest = versions.FirstOrDefault();
        return latest is null ? null : new Release(latest.Version, latest.MinecraftVersion, latest.FileName, latest.DownloadUrl, latest.ReleaseNotes);
    }

    public async Task<IReadOnlyList<ClientVersion>> GetAvailableVersionsAsync(CancellationToken ct = default)
    {
        using var response = await SendAsync(HttpMethod.Get, "/api/versions", null, ct, allowUnauthorizedRetry: false);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (response.StatusCode == HttpStatusCode.Unauthorized) { ClearSession(); throw new SessionExpiredException(); }
        if (!response.IsSuccessStatusCode) throw ApiError(response.StatusCode, body, "Не удалось получить версии клиента.");
        using var json = JsonDocument.Parse(body);
        if (!json.RootElement.TryGetProperty("versions", out var items)) return Array.Empty<ClientVersion>();
        return items.EnumerateArray().Select(item => new ClientVersion(
            item.TryGetProperty("tag", out var tag) ? tag.GetString() ?? "—" : "—",
            "Minecraft",
            item.TryGetProperty("downloadUrl", out var url) ? url.GetString() : null,
            item.TryGetProperty("downloadUrl", out var file) ? file.GetString() ?? "" : "",
            item.TryGetProperty("description", out var notes) ? notes.GetString() ?? "" : "")
        { Id = item.TryGetProperty("id", out var id) ? id.GetString() : null }).ToArray();
    }

    public async Task<(string Url, string Version)> RequestDownloadAsync(string? versionId, CancellationToken ct = default)
    {
        using var response = await SendAsync(HttpMethod.Post, "/api/download", versionId is null ? null : new { versionId }, ct, allowUnauthorizedRetry: false);
        var body = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode) throw ApiError(response.StatusCode, body, "Не удалось начать скачивание.");
        using var json = JsonDocument.Parse(body);
        return (json.RootElement.GetProperty("url").GetString() ?? "#", json.RootElement.GetProperty("version").GetString() ?? "—");
    }

    public void Logout()
    {
        try { http.PostAsync($"{WebsiteUrl}/api/auth/logout", null).GetAwaiter().GetResult(); } catch { }
        ClearSession();
    }

    private async Task<HttpResponseMessage> SendAsync(HttpMethod method, string path, object? payload, CancellationToken ct, bool allowUnauthorizedRetry)
    {
        EnsureSessionCookie();
        using var request = new HttpRequestMessage(method, $"{WebsiteUrl}{path}");
        if (payload is not null) request.Content = JsonContent.Create(payload);
        var response = await http.SendAsync(request, ct);
        if (response.StatusCode == HttpStatusCode.Unauthorized && allowUnauthorizedRetry)
        {
            response.Dispose(); ClearSession(); throw new SessionExpiredException();
        }
        return response;
    }

    private void EnsureSessionCookie()
    {
        if (string.IsNullOrWhiteSpace(sessionToken)) return;
        lock (cookieLock) cookies.SetCookies(new Uri(WebsiteUrl), $"chroma_session={sessionToken}; path=/");
    }

    private void RememberSession(bool remember)
    {
        sessionToken = cookies.GetCookies(new Uri(WebsiteUrl))["chroma_session"]?.Value;
        if (remember && !string.IsNullOrWhiteSpace(sessionToken)) SessionStore.Save(sessionToken);
        else if (!remember) SessionStore.Clear();
    }

    private void LoadSession()
    {
        sessionToken = SessionStore.Load();
        if (!string.IsNullOrWhiteSpace(sessionToken)) EnsureSessionCookie();
    }

    private void ClearSession() { sessionToken = null; SessionStore.Clear(); }

    private static Exception ApiError(HttpStatusCode status, string body, string fallback) => status switch
    {
        HttpStatusCode.Unauthorized => new SessionExpiredException(),
        HttpStatusCode.Forbidden => new InvalidOperationException("Доступ запрещён."),
        HttpStatusCode.NotFound => new InvalidOperationException("Сервис Chroma временно недоступен."),
        (HttpStatusCode)429 => new InvalidOperationException("Слишком много запросов. Попробуйте позже."),
        _ when (int)status >= 500 => new InvalidOperationException("Ошибка базы или сервера Chroma."),
        _ when body.Contains("invalidCredentials", StringComparison.OrdinalIgnoreCase) => new InvalidOperationException("Неверный email или пароль."),
        _ when body.Contains("databaseUnavailable", StringComparison.OrdinalIgnoreCase) => new InvalidOperationException("База данных временно недоступна."),
        _ => new InvalidOperationException(fallback)
    };
}

public sealed class SessionExpiredException : InvalidOperationException
{
    public SessionExpiredException() : base("Сессия истекла. Войдите снова.") { }
}

internal static class SessionStore
{
    private static readonly string FilePath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Chroma", "website-session.bin");
    public static void Save(string value) { Directory.CreateDirectory(Path.GetDirectoryName(FilePath)!); File.WriteAllBytes(FilePath, ProtectedData.Protect(Encoding.UTF8.GetBytes(value), null, DataProtectionScope.CurrentUser)); }
    public static string? Load() { try { return Encoding.UTF8.GetString(ProtectedData.Unprotect(File.ReadAllBytes(FilePath), null, DataProtectionScope.CurrentUser)); } catch { return null; } }
    public static void Clear() { try { if (File.Exists(FilePath)) File.Delete(FilePath); } catch { } }
}
