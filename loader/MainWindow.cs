using Avalonia;
using Avalonia.Controls;
using Avalonia.Controls.Primitives;
using Avalonia.Layout;
using Avalonia.Media;
using Avalonia.Media.Imaging;
using Avalonia.Platform;
using System.Diagnostics;
using System.IO;

namespace Chroma.Loader;

public sealed class MainWindow : Window
{
    private readonly ChromaApiClient api = new();
    private readonly Grid authLayer = new();
    private readonly Grid appLayer = new() { IsVisible = false };
    private readonly StackPanel pageHost = new();
    private readonly TextBlock status = new() { Text = "READY" };
    private readonly TextBlock error = new();
    private readonly TextBox username = Field("Никнейм");
    private readonly TextBox email = Field("email@example.com");
    private readonly TextBox password = Field("Пароль", true);
    private readonly CheckBox remember = new() { Content = "Запомнить сессию", IsChecked = true };
    private readonly TextBlock accountName = new();
    private readonly TextBlock accountPlan = new();
    private readonly TextBlock accountExpiry = new();
    private readonly TextBlock accountVersion = new();
    private readonly TextBlock deviceStatus = new();
    private IReadOnlyList<ClientVersion> versions = Array.Empty<ClientVersion>();
    private Account? account;
    private bool registration;

    public MainWindow()
    {
        Title = "CHROMA CLIENT"; Width = 1280; Height = 800; MinWidth = 1100; MinHeight = 700;
        WindowStartupLocation = WindowStartupLocation.CenterScreen;
        Background = Brush("#0B0D10");
        var root = new Grid(); root.Children.Add(Backdrop()); root.Children.Add(authLayer); root.Children.Add(appLayer);
        Content = root; BuildAuth(); Opened += async (_, _) => await RestoreAsync();
    }

    private Control Backdrop()
    {
        var grid = new Grid { Background = Brush("#0B0D10") };
        try { grid.Children.Add(new Image { Source = Asset("background-02.jpg"), Stretch = Stretch.UniformToFill, Opacity = .10 }); } catch { }
        grid.Children.Add(new Border { Background = new LinearGradientBrush { StartPoint = new RelativePoint(0, 0, RelativeUnit.Relative), EndPoint = new RelativePoint(1, 1, RelativeUnit.Relative), GradientStops = { new GradientStop(Color.Parse("#0B0D10F5"), 0), new GradientStop(Color.Parse("#101318E8"), .6), new GradientStop(Color.Parse("#0B0D10FA"), 1) } } });
        return grid;
    }

    private void BuildAuth()
    {
        var layout = new Grid { Width = 960, ColumnDefinitions = new ColumnDefinitions("1.15*,.85*"), HorizontalAlignment = HorizontalAlignment.Center, VerticalAlignment = VerticalAlignment.Center };
        var intro = new StackPanel { Spacing = 14, Margin = new Thickness(0, 0, 72, 0), VerticalAlignment = VerticalAlignment.Center };
        intro.Children.Add(Logo(104)); intro.Children.Add(new TextBlock { Text = "CHROMA", FontSize = 42, FontWeight = FontWeight.Bold, Foreground = Brushes.White, LetterSpacing = 2 });
        intro.Children.Add(new TextBlock { Text = "VISUAL MINECRAFT CLIENT", FontSize = 12, FontWeight = FontWeight.Bold, Foreground = Brush("#B7FF3C"), LetterSpacing = 1.4 });
        intro.Children.Add(new TextBlock { Text = "Твой Minecraft.\nТвой стиль.", FontSize = 30, FontWeight = FontWeight.SemiBold, Foreground = Brush("#F2F4F7"), LineHeight = 36 });
        intro.Children.Add(new TextBlock { Text = "Единый доступ к клиенту, визуалам и подписке. Сервер всегда остаётся источником истины.", FontSize = 14, Foreground = Brush("#8D96A3"), TextWrapping = TextWrapping.Wrap, LineHeight = 21 });
        layout.Children.Add(intro);
        var card = new Border { Background = Brush("#14181EF8"), BorderBrush = Brush("#242A32"), BorderThickness = new Thickness(1), CornerRadius = new CornerRadius(16), Padding = new Thickness(30), Child = AuthForm() };
        Grid.SetColumn(card, 1); layout.Children.Add(card); authLayer.Children.Add(layout);
    }

    private Control AuthForm()
    {
        var form = new StackPanel { Spacing = 9 };
        var title = new TextBlock { Text = "Вход в Chroma", FontSize = 25, FontWeight = FontWeight.SemiBold, Foreground = Brush("#F2F4F7") };
        var hint = new TextBlock { Text = "Используй тот же аккаунт, что и на сайте.", Foreground = Brush("#8D96A3"), Margin = new Thickness(0, 0, 0, 12) };
        form.Children.Add(new TextBlock { Text = "CHROMA ACCOUNT", Foreground = Brush("#B7FF3C"), FontSize = 10, FontWeight = FontWeight.Bold }); form.Children.Add(title); form.Children.Add(hint);
        form.Children.Add(email); form.Children.Add(username); username.IsVisible = false; form.Children.Add(password); form.Children.Add(remember);
        var submit = AccentButton("ВОЙТИ  →", 46); submit.Click += async (_, _) => { submit.IsEnabled = false; try { if (registration) await RegisterAsync(); else await LoginAsync(); } finally { submit.IsEnabled = true; } }; form.Children.Add(submit);
        var toggle = new Button { Content = "Нет аккаунта? Создать аккаунт", Background = Brushes.Transparent, BorderBrush = Brushes.Transparent, Foreground = Brush("#B7FF3C"), HorizontalContentAlignment = HorizontalAlignment.Left };
        toggle.Click += (_, _) => { registration = !registration; username.IsVisible = registration; title.Text = registration ? "Создать аккаунт" : "Вход в Chroma"; submit.Content = registration ? "СОЗДАТЬ АККАУНТ  →" : "ВОЙТИ  →"; toggle.Content = registration ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Создать аккаунт"; error.Text = ""; }; form.Children.Add(toggle);
        error.Foreground = Brush("#FF5C68"); error.TextWrapping = TextWrapping.Wrap; form.Children.Add(error); return form;
    }

    private Control BuildWorkspace()
    {
        var root = new Grid { ColumnDefinitions = new ColumnDefinitions("230,*") }; root.Children.Add(Sidebar());
        var body = new Grid { RowDefinitions = new RowDefinitions("Auto,*"), Margin = new Thickness(30, 24, 30, 24) };
        var header = new DockPanel { LastChildFill = true, Margin = new Thickness(0, 0, 0, 20) };
        header.Children.Add(new StackPanel { Spacing = 3, Children = { new TextBlock { Text = "CHROMA CONTROL CENTER", Foreground = Brush("#B7FF3C"), FontSize = 10, FontWeight = FontWeight.Bold }, new TextBlock { Text = "HOME", FontSize = 25, FontWeight = FontWeight.SemiBold, Foreground = Brush("#F2F4F7") } } });
        status.Foreground = Brush("#B7FF3C"); status.HorizontalAlignment = HorizontalAlignment.Right; status.VerticalAlignment = VerticalAlignment.Center; DockPanel.SetDock(status, Dock.Right); header.Children.Add(status); body.Children.Add(header);
        var scroll = new ScrollViewer { Content = pageHost, VerticalScrollBarVisibility = ScrollBarVisibility.Auto, HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled }; Grid.SetRow(scroll, 1); body.Children.Add(scroll); Grid.SetColumn(body, 1); root.Children.Add(body); return root;
    }

    private Control Sidebar()
    {
        var panel = new Border { Background = Brush("#101318F5"), BorderBrush = Brush("#242A32"), BorderThickness = new Thickness(0, 0, 1, 0), Padding = new Thickness(18) };
        var stack = new StackPanel { Spacing = 6 }; stack.Children.Add(new TextBlock { Text = "CHROMA", FontSize = 23, FontWeight = FontWeight.Bold, Foreground = Brushes.White }); stack.Children.Add(new TextBlock { Text = "CLIENT LAUNCHER", FontSize = 9, Foreground = Brush("#5E6672"), Margin = new Thickness(0, -3, 0, 18) });
        Nav(stack, "⌂", "HOME", "Home"); Nav(stack, "◇", "CLIENT", "Client"); Nav(stack, "◈", "ACCOUNT", "Account"); Nav(stack, "⚙", "SETTINGS", "Settings");
        stack.Children.Add(new Border { Height = 260 }); var logout = new Button { Content = "ВЫЙТИ", Height = 40, Background = Brush("#181D24"), BorderBrush = Brush("#242A32"), Foreground = Brush("#8D96A3") }; logout.Click += (_, _) => Logout(); stack.Children.Add(logout); panel.Child = stack; return panel;
    }

    private void Nav(StackPanel stack, string icon, string label, string page) { var row = new StackPanel { Orientation = Orientation.Horizontal, Spacing = 12, Children = { new TextBlock { Text = icon, Foreground = Brush("#B7FF3C"), FontSize = 16 }, new TextBlock { Text = label, Foreground = Brush("#D8DDE5"), VerticalAlignment = VerticalAlignment.Center } } }; var b = new Button { Content = row, Height = 42, HorizontalContentAlignment = HorizontalAlignment.Left, Background = Brushes.Transparent, BorderBrush = Brushes.Transparent }; b.Click += (_, _) => Navigate(page); stack.Children.Add(b); }

    private void Navigate(string page) { pageHost.Children.Clear(); pageHost.Children.Add(page == "Home" ? HomePage() : page == "Client" ? ClientPage() : page == "Account" ? AccountPage() : SettingsPage()); }
    private Control HomePage() { var grid = new Grid { RowDefinitions = new RowDefinitions("Auto,Auto,Auto"), ColumnDefinitions = new ColumnDefinitions("1.2*,.8*") }; var hero = Card(new StackPanel { Spacing = 10, Children = { new TextBlock { Text = "CHROMA / ONLINE", Foreground = Brush("#B7FF3C"), FontSize = 10, FontWeight = FontWeight.Bold }, new TextBlock { Text = $"С возвращением, {accountName.Text}", FontSize = 29, FontWeight = FontWeight.SemiBold, Foreground = Brush("#F2F4F7") }, new TextBlock { Text = "Управляй доступом, устройством и версиями клиента.", Foreground = Brush("#8D96A3"), FontSize = 14 }, Pill("SERVER SYNC") } }); Grid.SetColumnSpan(hero, 2); grid.Children.Add(hero); var sub = Card(new StackPanel { Spacing = 8, Children = { LabelValue("ПОДПИСКА", accountPlan.Text), LabelValue("ОКОНЧАНИЕ", accountExpiry.Text) } }); Grid.SetRow(sub, 1); grid.Children.Add(sub); var client = Card(new StackPanel { Spacing = 8, Children = { LabelValue("CLIENT", accountVersion.Text), LabelValue("СТАТУС", deviceStatus.Text) } }); Grid.SetRow(client, 1); Grid.SetColumn(client, 1); grid.Children.Add(client); var play = AccentButton("ОТКРЫТЬ CLIENT  →", 46); play.Click += (_, _) => Navigate("Client"); var launch = Card(new StackPanel { Spacing = 10, Children = { new TextBlock { Text = "READY TO LAUNCH", Foreground = Brush("#B7FF3C"), FontSize = 10, FontWeight = FontWeight.Bold }, play } }); Grid.SetRow(launch, 2); Grid.SetColumnSpan(launch, 2); grid.Children.Add(launch); return grid; }
    private Control ClientPage()
    {
        var stack = new StackPanel { Spacing = 12 };
        stack.Children.Add(new TextBlock { Text = "ДОСТУПНЫЕ ВЕРСИИ", FontSize = 24, FontWeight = FontWeight.SemiBold, Foreground = Brush("#F2F4F7") });
        foreach (var v in versions)
        {
            var release = new StackPanel { Spacing = 5 };
            release.Children.Add(new TextBlock { Text = v.Version, FontSize = 18, Foreground = Brush("#F2F4F7") });
            release.Children.Add(new TextBlock { Text = $"Minecraft {v.MinecraftVersion}", Foreground = Brush("#8D96A3") });
            release.Children.Add(new TextBlock { Text = v.ReleaseNotes, Foreground = Brush("#5E6672"), TextWrapping = TextWrapping.Wrap });
            var download = new Button { Content = "СКАЧАТЬ ВЕРСИЮ", Height = 36, Background = Brush("#1D2818"), BorderBrush = Brush("#4B6726"), Foreground = Brush("#B7FF3C") };
            download.Click += async (_, _) => await DownloadVersionAsync(v, download);
            release.Children.Add(download);
            stack.Children.Add(Card(release));
        }
        return stack;
    }

    private Control AccountPage()
    {
        return Card(new StackPanel { Spacing = 10, Children = { new TextBlock { Text = "ACCOUNT", FontSize = 24, Foreground = Brush("#F2F4F7") }, LabelValue("USERNAME", accountName.Text), LabelValue("EMAIL", account?.Email), LabelValue("SUBSCRIPTION", accountPlan.Text) } });
    }

    private Control SettingsPage()
    {
        return Card(new StackPanel { Spacing = 12, Children = { new TextBlock { Text = "SETTINGS", FontSize = 24, Foreground = Brush("#F2F4F7") }, new CheckBox { Content = "Автоматические обновления", IsChecked = true }, new TextBlock { Text = "Данные сессии хранятся локально в защищённом хранилище Windows.", Foreground = Brush("#8D96A3"), TextWrapping = TextWrapping.Wrap } } });
    }

    private async Task RestoreAsync() { try { status.Text = "CONNECTING..."; var a = await api.RestoreAsync(); if (a is not null) await ShowAsync(a); else status.Text = "READY"; } catch { status.Text = "READY"; } }
    private async Task LoginAsync() { error.Text = ""; try { status.Text = "CONNECTING..."; await ShowAsync(await api.LoginAsync(email.Text?.Trim() ?? "", password.Text ?? "", remember.IsChecked == true)); } catch (Exception ex) { error.Text = ex.Message; status.Text = "READY"; } }
    private async Task RegisterAsync() { error.Text = ""; try { status.Text = "CREATING ACCOUNT..."; error.Text = await api.RegisterAsync(username.Text?.Trim() ?? "", email.Text?.Trim() ?? "", password.Text ?? ""); status.Text = "READY"; } catch (Exception ex) { error.Text = ex.Message; status.Text = "READY"; } }
    private async Task ShowAsync(Account a) { account = a; accountName.Text = a.Username; accountPlan.Text = a.Plan; accountExpiry.Text = a.EndsAt ?? "FREE / без срока"; status.Text = "SYNCING..."; versions = await api.GetAvailableVersionsAsync(); accountVersion.Text = versions.FirstOrDefault()?.Version ?? "—"; deviceStatus.Text = "CONNECTED"; authLayer.IsVisible = false; appLayer.IsVisible = true; appLayer.Children.Clear(); appLayer.Children.Add(BuildWorkspace()); Navigate("Home"); status.Text = "● CONNECTED"; }
    private void Logout() { api.Logout(); account = null; appLayer.IsVisible = false; authLayer.IsVisible = true; password.Text = ""; status.Text = "READY"; }
    private async Task DownloadVersionAsync(ClientVersion version, Button button)
    {
        try
        {
            button.IsEnabled = false; status.Text = "ЗАГРУЗКА...";
            var result = await api.RequestDownloadAsync(version.Id);
            if (!string.IsNullOrWhiteSpace(result.Url) && result.Url != "#" && Uri.TryCreate(result.Url, UriKind.Absolute, out var uri))
                Process.Start(new ProcessStartInfo(uri.ToString()) { UseShellExecute = true });
            else error.Text = "Для этой версии администратор ещё не указал ссылку на файл.";
            status.Text = "● CONNECTED";
        }
        catch (Exception ex) { error.Text = ex.Message; status.Text = "● CONNECTED"; }
        finally { button.IsEnabled = true; }
    }

    private static TextBox Field(string watermark, bool password = false) => new() { Watermark = watermark, Height = 42, Background = Brush("#181D24"), BorderBrush = Brush("#242A32"), Foreground = Brush("#F2F4F7"), PasswordChar = password ? '•' : '\0' };
    private static Border Card(Control child) => new() { Background = Brush("#14181E"), BorderBrush = Brush("#242A32"), BorderThickness = new Thickness(1), CornerRadius = new CornerRadius(12), Padding = new Thickness(20), Margin = new Thickness(0, 0, 0, 12), Child = child };
    private static Border Pill(string text) => new() { Background = Brush("#1D2818"), BorderBrush = Brush("#4B6726"), BorderThickness = new Thickness(1), CornerRadius = new CornerRadius(7), Padding = new Thickness(10, 6), Child = new TextBlock { Text = text, Foreground = Brush("#B7FF3C"), FontSize = 10, FontWeight = FontWeight.Bold } };
    private static Button AccentButton(string text, double height) => new() { Content = text, Height = height, Background = Brush("#B7FF3C"), Foreground = Brush("#0B0D10"), FontWeight = FontWeight.Bold, HorizontalContentAlignment = HorizontalAlignment.Center };
    private static StackPanel LabelValue(string label, string? value) => new() { Spacing = 4, Children = { new TextBlock { Text = label, Foreground = Brush("#5E6672"), FontSize = 10 }, new TextBlock { Text = value ?? "—", Foreground = Brush("#F2F4F7"), FontSize = 17, FontWeight = FontWeight.SemiBold } } };
    private static Control Logo(double size) { try { return new Image { Source = Asset("chroma-visuals-logo.png"), Width = size, Height = size, Stretch = Stretch.Uniform }; } catch { return new Border { Width = size, Height = size, Background = Brush("#B7FF3C"), CornerRadius = new CornerRadius(18) }; } }
    private static Bitmap Asset(string name) => new Bitmap(AssetLoader.Open(new Uri($"avares://Chroma.Loader/Assets/{name}")));
    private static SolidColorBrush Brush(string hex) => new(Color.Parse(hex));
}
