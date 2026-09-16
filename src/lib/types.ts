export type Lang = "en" | "ru";

export type Role = "USER" | "MODERATOR" | "ADMIN" | "OWNER";

export type Plan = "FREE" | "BASE" | "PREMIUM" | "PREMIUM_BETA";

export type Duration = 1 | 3 | 6;

export type AuthUser = {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
  subscription: {
    plan: Plan;
    expiresAt: string | null;
  };
  settings: {
    language: Lang;
    theme: string;
    animations: boolean;
    uiSounds: boolean;
    background: string;
    notifications: boolean;
  };
};
