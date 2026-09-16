import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "MODERATOR", "ADMIN", "OWNER"]);
export const planEnum = pgEnum("plan", ["FREE", "BASE", "PREMIUM", "PREMIUM_BETA"]);
export const languageEnum = pgEnum("language", ["en", "ru"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 32 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("USER"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  token: varchar("token", { length: 128 }).primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  plan: planEnum("plan").notNull().default("FREE"),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const userSettings = pgTable("user_settings", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  language: languageEnum("language").notNull().default("en"),
  theme: varchar("theme", { length: 20 }).notNull().default("dark"),
  animations: boolean("animations").notNull().default(true),
  uiSounds: boolean("ui_sounds").notNull().default(false),
  background: varchar("background", { length: 40 }).notNull().default("minecraft"),
  notifications: boolean("notifications").notNull().default(true),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const planPrices = pgTable("plan_prices", {
  id: uuid("id").defaultRandom().primaryKey(),
  plan: planEnum("plan").notNull(),
  durationMonths: integer("duration_months").notNull(),
  priceRub: varchar("price_rub", { length: 30 }),
  purchaseUrl: text("purchase_url"),
  isActive: boolean("is_active").notNull().default(true),
});

export const clientVersions = pgTable("client_versions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 40 }).notNull(),
  tag: varchar("tag", { length: 20 }).notNull(),
  description: text("description").notNull(),
  downloadUrl: text("download_url").notNull(),
  isLatest: boolean("is_latest").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subscriptionKeys = pgTable("subscription_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  plan: planEnum("plan").notNull(),
  durationMonths: integer("duration_months").notNull(),
  activationLimit: integer("activation_limit").notNull().default(1),
  activationCount: integer("activation_count").notNull().default(0),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdByUserId: uuid("created_by_user_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const keyActivations = pgTable("key_activations", {
  id: uuid("id").defaultRandom().primaryKey(),
  keyId: uuid("key_id")
    .notNull()
    .references(() => subscriptionKeys.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  activatedAt: timestamp("activated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const downloadEvents = pgTable("download_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  versionId: uuid("version_id").references(() => clientVersions.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
