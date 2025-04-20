import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  initials: text("initials").notNull(),
  role: text("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  initials: true,
  role: true,
});

// Vehicle schema
export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull(),
  mileage: integer("mileage").notNull(),
  imageUrl: text("image_url"),
  lastService: timestamp("last_service"),
  nextService: timestamp("next_service"),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  userId: true,
  name: true,
  model: true,
  year: true,
  licensePlate: true,
  mileage: true,
  imageUrl: true,
  lastService: true,
  nextService: true,
  status: true,
});

// Service Provider schema
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  services: text("services").array().notNull(),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).pick({
  name: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  phone: true,
  email: true,
  website: true,
  latitude: true,
  longitude: true,
  services: true,
  rating: true,
});

// Service Booking schema
export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  providerId: integer("provider_id").notNull(),
  serviceType: text("service_type").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  notes: text("notes"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertServiceBookingSchema = createInsertSchema(serviceBookings).pick({
  userId: true,
  vehicleId: true,
  providerId: true,
  serviceType: true,
  scheduledDate: true,
  notes: true,
  status: true,
});

// Service Provider Availability schema
export const availability = pgTable("availability", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: text("start_time").notNull(), // Store as "HH:MM" format
  endTime: text("end_time").notNull(), // Store as "HH:MM" format
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAvailabilitySchema = createInsertSchema(availability).pick({
  providerId: true,
  dayOfWeek: true,
  startTime: true,
  endTime: true,
});

// Vehicle Inspection schema
export const inspections = pgTable("inspections", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").notNull(),
  providerId: integer("provider_id").notNull(),
  inspectionDate: timestamp("inspection_date").notNull(),
  details: jsonb("details").notNull(),
  status: text("status").default("completed").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInspectionSchema = createInsertSchema(inspections).pick({
  vehicleId: true,
  providerId: true,
  inspectionDate: true,
  details: true,
  status: true,
});

// Customer record for service providers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  userId: integer("user_id").notNull(),
  totalSpent: integer("total_spent").default(0).notNull(),
  lastOrderDate: timestamp("last_order_date"),
  orders: integer("orders").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  providerId: true,
  userId: true,
  totalSpent: true,
  lastOrderDate: true,
  orders: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Vehicle = typeof vehicles.$inferSelect;
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;

export type ServiceBooking = typeof serviceBookings.$inferSelect;
export type InsertServiceBooking = z.infer<typeof insertServiceBookingSchema>;

export type Availability = typeof availability.$inferSelect;
export type InsertAvailability = z.infer<typeof insertAvailabilitySchema>;

export type Inspection = typeof inspections.$inferSelect;
export type InsertInspection = z.infer<typeof insertInspectionSchema>;

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
