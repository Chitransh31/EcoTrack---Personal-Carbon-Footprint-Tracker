import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

function generateId() {
  return crypto.randomUUID();
}

// ──────────────────────────────────────────────
// NextAuth.js Required Tables
// ──────────────────────────────────────────────

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  hashedPassword: text("hashed_password"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const accounts = sqliteTable("accounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = sqliteTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

// ──────────────────────────────────────────────
// Application Tables
// ──────────────────────────────────────────────

export const activities = sqliteTable("activities", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(), // "transport" | "energy" | "food"
  activityType: text("activity_type").notNull(), // e.g., "car", "electricity", "meat"
  quantity: integer("quantity").notNull(),
  unit: text("unit").notNull(), // "km", "kWh", "servings"
  co2e: integer("co2e").notNull(), // grams of CO2e
  date: text("date").notNull(), // "YYYY-MM-DD"
  notes: text("notes"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date()
  ),
});

export const emissionFactors = sqliteTable("emission_factors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => generateId()),
  category: text("category").notNull(),
  activityType: text("activity_type").notNull(),
  factor: integer("factor").notNull(), // grams CO2e per unit
  unit: text("unit").notNull(),
  source: text("source"),
});
