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
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  licensePlate: text("license_plate").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").default("petrol").notNull(), // petrol, diesel, electric, hybrid, cng, hydrogen, solar
  vehicleType: text("vehicle_type").default("car").notNull(), // car, bike, scooter, truck, commercial
  vin: text("vin"),
  purchaseDate: timestamp("purchase_date"),
  imageUrl: text("image_url"),
  lastService: timestamp("last_service"),
  nextService: timestamp("next_service"),
  status: text("status").default("active").notNull(),
  documents: jsonb("documents").default({}).notNull(), // Store document references/metadata
  healthScore: integer("health_score").default(100), // 0-100 health rating
  estimatedValue: integer("estimated_value"), // Current estimated market value
  features: text("features").array(),
  goals: jsonb("goals").default({}), // User-defined goals for this vehicle
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertVehicleSchema = createInsertSchema(vehicles).pick({
  userId: true,
  name: true,
  make: true,
  model: true,
  year: true,
  licensePlate: true,
  mileage: true,
  fuelType: true,
  vehicleType: true,
  vin: true,
  purchaseDate: true,
  imageUrl: true,
  lastService: true,
  nextService: true,
  status: true,
  documents: true,
  healthScore: true,
  estimatedValue: true,
  features: true,
  goals: true,
});

// Service Provider schema
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
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
  supportedVehicleTypes: text("supported_vehicle_types").array().default(['car']).notNull(),
  supportedFuelTypes: text("supported_fuel_types").array().default(['petrol', 'diesel']).notNull(),
  amenities: text("amenities").array(),
  operatingHours: jsonb("operating_hours").default({}),
  images: text("images").array(),
  logoUrl: text("logo_url"),
  isVerified: boolean("is_verified").default(false),
  isPremium: boolean("is_premium").default(false),
  acceptsOnlineBooking: boolean("accepts_online_booking").default(true),
  acceptsEmergencyService: boolean("accepts_emergency_service").default(false),
  turnaroundTimeHours: integer("turnaround_time_hours"),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  averagePrice: integer("average_price"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).pick({
  name: true,
  description: true,
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
  supportedVehicleTypes: true,
  supportedFuelTypes: true,
  amenities: true,
  operatingHours: true,
  images: true,
  logoUrl: true,
  isVerified: true,
  isPremium: true,
  acceptsOnlineBooking: true,
  acceptsEmergencyService: true,
  turnaroundTimeHours: true,
  rating: true,
  reviewCount: true,
  averagePrice: true,
  tags: true,
});

// Service Booking schema
export const serviceBookings = pgTable("service_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  providerId: integer("provider_id").notNull(),
  serviceType: text("service_type").notNull(),
  serviceDetails: jsonb("service_details").default({}), // Additional service information
  scheduledDate: timestamp("scheduled_date").notNull(),
  estimatedCompletionTime: timestamp("estimated_completion_time"),
  pickupRequested: boolean("pickup_requested").default(false),
  pickupAddress: text("pickup_address"),
  pickupTime: timestamp("pickup_time"),
  dropOffRequested: boolean("drop_off_requested").default(false),
  dropOffAddress: text("drop_off_address"),
  dropOffTime: timestamp("drop_off_time"),
  totalCost: integer("total_cost"),
  costBreakdown: jsonb("cost_breakdown").default({}),
  paidAmount: integer("paid_amount").default(0),
  paymentStatus: text("payment_status").default("unpaid").notNull(),
  paymentMethod: text("payment_method"),
  notes: text("notes"),
  status: text("status").default("pending").notNull(), // pending, confirmed, in-progress, completed, cancelled
  customerFeedback: text("customer_feedback"),
  customerRating: integer("customer_rating"),
  priorityLevel: text("priority_level").default("normal"), // low, normal, high, emergency
  assignedTechnician: integer("assigned_technician"),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertServiceBookingSchema = createInsertSchema(serviceBookings).pick({
  userId: true,
  vehicleId: true,
  providerId: true,
  serviceType: true,
  serviceDetails: true,
  scheduledDate: true,
  estimatedCompletionTime: true,
  pickupRequested: true,
  pickupAddress: true,
  pickupTime: true,
  dropOffRequested: true,
  dropOffAddress: true,
  dropOffTime: true,
  totalCost: true,
  costBreakdown: true,
  paidAmount: true,
  paymentStatus: true,
  paymentMethod: true,
  notes: true,
  status: true,
  customerFeedback: true,
  customerRating: true,
  priorityLevel: true,
  assignedTechnician: true,
  notificationsEnabled: true,
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
  technicianId: integer("technician_id"),
  inspectionDate: timestamp("inspection_date").notNull(),
  inspectionType: text("inspection_type").default("standard").notNull(), // standard, comprehensive, pre-purchase, etc.
  mileageAtInspection: integer("mileage_at_inspection"),
  details: jsonb("details").notNull(), // Inspection findings by system (engine, brakes, etc.)
  overallScore: integer("overall_score"), // 0-100 vehicle health score
  recommendations: jsonb("recommendations").default([]),
  criticalIssues: jsonb("critical_issues").default([]),
  estimatedRepairCosts: integer("estimated_repair_costs"),
  photos: text("photos").array(), // Photo documentation of inspection
  videoRecording: text("video_recording"), // URL to inspection video if applicable
  userNotes: text("user_notes"), // Notes added by the vehicle owner
  technicianNotes: text("technician_notes"), // Notes added by the technician
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDate: timestamp("follow_up_date"),
  status: text("status").default("completed").notNull(), // scheduled, in-progress, completed, cancelled
  signedByTechnician: boolean("signed_by_technician").default(false),
  signedByCustomer: boolean("signed_by_customer").default(false),
  reportShared: boolean("report_shared").default(false),
  reportGeneratedURL: text("report_generated_url"), // URL to download full report
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertInspectionSchema = createInsertSchema(inspections).pick({
  vehicleId: true,
  providerId: true,
  technicianId: true,
  inspectionDate: true,
  inspectionType: true,
  mileageAtInspection: true,
  details: true,
  overallScore: true,
  recommendations: true,
  criticalIssues: true,
  estimatedRepairCosts: true,
  photos: true,
  videoRecording: true,
  userNotes: true,
  technicianNotes: true,
  followUpRequired: true,
  followUpDate: true,
  status: true,
  signedByTechnician: true,
  signedByCustomer: true,
  reportShared: true,
  reportGeneratedURL: true,
});

// Customer record for service providers
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull(),
  userId: integer("user_id").notNull(),
  customerType: text("customer_type").default("individual").notNull(), // individual, fleet, corporate
  customerNotes: text("customer_notes"),
  primaryVehicleId: integer("primary_vehicle_id"),
  totalSpent: integer("total_spent").default(0).notNull(),
  lastOrderDate: timestamp("last_order_date"),
  orders: integer("orders").default(0).notNull(),
  loyaltyPoints: integer("loyalty_points").default(0),
  loyaltyTier: text("loyalty_tier").default("standard"), // standard, silver, gold, platinum
  averageRating: integer("average_rating"),
  preferredContactMethod: text("preferred_contact_method").default("email"), // email, phone, sms
  preferredDays: text("preferred_days").array(), // Days of week preferred for service
  preferredTechnician: integer("preferred_technician"),
  communicationPreferences: jsonb("communication_preferences").default({}),
  paymentPreferences: jsonb("payment_preferences").default({}),
  accountBalance: integer("account_balance").default(0), // For prepaid services or credits
  status: text("status").default("active"), // active, inactive, blocked
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).pick({
  providerId: true,
  userId: true,
  customerType: true,
  customerNotes: true,
  primaryVehicleId: true,
  totalSpent: true,
  lastOrderDate: true,
  orders: true,
  loyaltyPoints: true,
  loyaltyTier: true,
  averageRating: true,
  preferredContactMethod: true,
  preferredDays: true,
  preferredTechnician: true,
  communicationPreferences: true,
  paymentPreferences: true,
  accountBalance: true,
  status: true,
});

// FixPoint Card schema
export const fixpointCards = pgTable("fixpoint_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardNumber: text("card_number").notNull().unique(),
  cardStatus: text("card_status").default("active").notNull(), // active, blocked, expired
  cardType: text("card_type").default("standard").notNull(), // standard, premium, platinum
  expiryDate: timestamp("expiry_date").notNull(),
  balance: integer("balance").default(0).notNull(),
  rewardPoints: integer("reward_points").default(0).notNull(),
  pinEnabled: boolean("pin_enabled").default(false),
  isVirtual: boolean("is_virtual").default(true),
  cardHolderName: text("card_holder_name").notNull(),
  linkedVehicleIds: integer("linked_vehicle_ids").array(),
  transactionLimit: integer("transaction_limit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFixpointCardSchema = createInsertSchema(fixpointCards).pick({
  userId: true,
  cardNumber: true,
  cardStatus: true,
  cardType: true,
  expiryDate: true,
  balance: true,
  rewardPoints: true,
  pinEnabled: true,
  isVirtual: true,
  cardHolderName: true,
  linkedVehicleIds: true,
  transactionLimit: true,
});

// Card Transactions schema
export const cardTransactions = pgTable("card_transactions", {
  id: serial("id").primaryKey(),
  cardId: integer("card_id").notNull(),
  amount: integer("amount").notNull(),
  transactionType: text("transaction_type").notNull(), // payment, refund, reward, top-up
  merchantName: text("merchant_name"),
  merchantCategory: text("merchant_category"),
  description: text("description"),
  status: text("status").default("completed").notNull(), // pending, completed, failed, reversed
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  location: text("location"),
  rewardPointsEarned: integer("reward_points_earned").default(0),
  referenceNumber: text("reference_number"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCardTransactionSchema = createInsertSchema(cardTransactions).pick({
  cardId: true,
  amount: true,
  transactionType: true,
  merchantName: true,
  merchantCategory: true,
  description: true,
  status: true,
  transactionDate: true,
  location: true,
  rewardPointsEarned: true,
  referenceNumber: true,
});

// FasTag schema
export const fastags = pgTable("fastags", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  tagId: text("tag_id").notNull().unique(),
  tagStatus: text("tag_status").default("active").notNull(), // active, inactive, blacklisted
  balance: integer("balance").default(0).notNull(),
  lastRechargeDate: timestamp("last_recharge_date"),
  lastRechargeAmount: integer("last_recharge_amount"),
  expiryDate: timestamp("expiry_date"),
  isAutoRechargeEnabled: boolean("is_auto_recharge_enabled").default(false),
  autoRechargeThreshold: integer("auto_recharge_threshold"),
  autoRechargeAmount: integer("auto_recharge_amount"),
  kycVerified: boolean("kyc_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFastagSchema = createInsertSchema(fastags).pick({
  userId: true,
  vehicleId: true,
  tagId: true,
  tagStatus: true,
  balance: true,
  lastRechargeDate: true,
  lastRechargeAmount: true,
  expiryDate: true,
  isAutoRechargeEnabled: true,
  autoRechargeThreshold: true,
  autoRechargeAmount: true,
  kycVerified: true,
});

// Toll Transactions schema
export const tollTransactions = pgTable("toll_transactions", {
  id: serial("id").primaryKey(),
  fastagId: integer("fastag_id").notNull(),
  vehicleId: integer("vehicle_id").notNull(),
  tollName: text("toll_name").notNull(),
  tollLocation: text("toll_location"),
  amount: integer("amount").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  status: text("status").default("completed").notNull(), // pending, completed, failed
  receiptNumber: text("receipt_number"),
  journeyType: text("journey_type"), // one-way, return
  vehicleClass: text("vehicle_class"), // car, truck, etc.
  laneNumber: text("lane_number"),
  discountApplied: integer("discount_applied").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTollTransactionSchema = createInsertSchema(tollTransactions).pick({
  fastagId: true,
  vehicleId: true,
  tollName: true,
  tollLocation: true,
  amount: true,
  transactionDate: true,
  status: true,
  receiptNumber: true,
  journeyType: true,
  vehicleClass: true,
  laneNumber: true,
  discountApplied: true,
});

// Marketplace Products schema
export const marketplaceProducts = pgTable("marketplace_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  discountPrice: integer("discount_price"),
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  brand: text("brand").notNull(),
  images: text("images").array(),
  rating: integer("rating").default(0),
  reviewCount: integer("review_count").default(0),
  stockQuantity: integer("stock_quantity").default(0),
  isFeatured: boolean("is_featured").default(false),
  compatibleVehicles: jsonb("compatible_vehicles").default([]),
  specifications: jsonb("specifications").default({}),
  warrantyInMonths: integer("warranty_in_months"),
  returnPolicyInDays: integer("return_policy_in_days"),
  vendorId: integer("vendor_id"),
  status: text("status").default("active").notNull(), // active, out-of-stock, discontinued
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMarketplaceProductSchema = createInsertSchema(marketplaceProducts).pick({
  name: true,
  description: true,
  price: true,
  discountPrice: true,
  category: true,
  subCategory: true,
  brand: true,
  images: true,
  rating: true,
  reviewCount: true,
  stockQuantity: true,
  isFeatured: true,
  compatibleVehicles: true,
  specifications: true,
  warrantyInMonths: true,
  returnPolicyInDays: true,
  vendorId: true,
  status: true,
});

// Learning Content schema
export const learningContent = pgTable("learning_content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  contentType: text("content_type").notNull(), // article, video, quiz, course, infographic
  category: text("category").notNull(),
  subCategory: text("sub_category"),
  tags: text("tags").array(),
  authorId: integer("author_id"),
  featuredImage: text("featured_image"),
  contentUrl: text("content_url"),
  contentBody: text("content_body"),
  durationMinutes: integer("duration_minutes"),
  difficultyLevel: text("difficulty_level"), // beginner, intermediate, advanced
  prerequisites: text("prerequisites").array(),
  isFeatured: boolean("is_featured").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  status: text("status").default("published").notNull(), // draft, published, archived
  publishDate: timestamp("publish_date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertLearningContentSchema = createInsertSchema(learningContent).pick({
  title: true,
  description: true,
  contentType: true,
  category: true,
  subCategory: true,
  tags: true,
  authorId: true,
  featuredImage: true,
  contentUrl: true,
  contentBody: true,
  durationMinutes: true,
  difficultyLevel: true,
  prerequisites: true,
  isFeatured: true,
  status: true,
  publishDate: true,
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

export type FixpointCard = typeof fixpointCards.$inferSelect;
export type InsertFixpointCard = z.infer<typeof insertFixpointCardSchema>;

export type CardTransaction = typeof cardTransactions.$inferSelect;
export type InsertCardTransaction = z.infer<typeof insertCardTransactionSchema>;

export type Fastag = typeof fastags.$inferSelect;
export type InsertFastag = z.infer<typeof insertFastagSchema>;

export type TollTransaction = typeof tollTransactions.$inferSelect;
export type InsertTollTransaction = z.infer<typeof insertTollTransactionSchema>;

export type MarketplaceProduct = typeof marketplaceProducts.$inferSelect;
export type InsertMarketplaceProduct = z.infer<typeof insertMarketplaceProductSchema>;

export type LearningContent = typeof learningContent.$inferSelect;
export type InsertLearningContent = z.infer<typeof insertLearningContentSchema>;
