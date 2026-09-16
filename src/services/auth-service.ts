export class AuthService {
  static async logout() {
    await fetch("/api/auth/logout", { method: "POST" });
  }
}
