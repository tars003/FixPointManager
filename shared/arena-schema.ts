import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";
// Import types from schema but rename them to avoid conflicts
import { 
  CustomizationProject as DbCustomizationProject, 
  VehicleModel as DbVehicleModel, 
  CustomizationPart as DbCustomizationPart 
} from "./schema";

// Shared type definitions for Arena customization platform
export type VehicleCategory = 'two-wheeler' | 'three-wheeler' | 'four-wheeler' | 'special' | 'heavy-vehicle';
export type CustomizationCategory = 'exterior' | 'interior' | 'performance' | 'wheels' | 'lighting';
export type CustomizationSubcategory = 'paint' | 'body' | 'wrap' | 'decals' | 'lights' | 'grille' | 'spoiler' | 
  'seats' | 'dashboard' | 'upholstery' | 'steering' | 'engine' | 'suspension' | 'exhaust' | 'brakes' | 
  'tires' | 'rims' | 'headlights' | 'taillights' | 'fog-lights' | 'accent-lights';

// Enhanced zod schema for vehicle model validation
export const vehicleModelSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  manufacturer: z.string().min(2, { message: "Manufacturer is required" }),
  category: z.enum(['two-wheeler', 'three-wheeler', 'four-wheeler', 'special', 'heavy-vehicle']),
  subcategory: z.string().min(2),
  year: z.number().min(1900).max(2100),
  modelCode: z.string().min(1),
  thumbnailUrl: z.string().url().optional(),
  modelUrl: z.string().url().optional(), 
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  basePrice: z.number().min(0).optional(),
  colors: z.array(z.object({
    id: z.string(),
    name: z.string(),
    hex: z.string(),
    type: z.enum(['standard', 'metallic', 'matte', 'special']),
    price: z.number().min(0)
  })).optional(),
  isActive: z.boolean().optional(),
  popularity: z.number().min(0).optional(),
});

// Enhanced zod schema for customization part validation
export const customizationPartSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  category: z.enum(['exterior', 'interior', 'performance', 'wheels', 'lighting']),
  subcategory: z.string().min(2),
  vehicleCategories: z.array(z.enum(['two-wheeler', 'three-wheeler', 'four-wheeler', 'special', 'heavy-vehicle'])),
  compatibleModels: z.array(z.string()).optional(),
  thumbnailUrl: z.string().url().optional(),
  modelUrl: z.string().url().optional(),
  price: z.number().min(0).optional(),
  currency: z.string().default('INR'),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  installationDifficulty: z.number().min(1).max(5).optional(),
  popularity: z.number().min(0).optional(),
  dimensions: z.object({
    width: z.number(),
    height: z.number(),
    depth: z.number(),
  }).optional(),
  weight: z.number().optional(),
  material: z.string().optional(),
  manufacturerWarranty: z.number().optional(), // in months
});

// Enhanced zod schema for customization project validation
export const customizationProjectSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  description: z.string().optional(),
  userId: z.number(),
  vehicleId: z.number(),
  thumbnailUrl: z.string().url().optional(),
  customizations: z.record(z.any()).default({}),
  status: z.enum(['draft', 'in-progress', 'completed']).default('draft'),
  visibility: z.enum(['private', 'public', 'shared']).default('private'),
  totalPoints: z.number().min(0).optional(),
  basePrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  selectedParts: z.array(z.object({
    partId: z.number(),
    position: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    }).optional(),
    rotation: z.object({
      x: z.number(),
      y: z.number(),
      z: z.number(),
    }).optional(),
    scale: z.number().optional(),
    color: z.string().optional(),
    notes: z.string().optional(),
    addedAt: z.date().optional(),
  })).optional(),
  sharingKey: z.string().optional(),
  lastRenderedImageUrl: z.string().url().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Types for the 3D visualization system
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface Transform {
  position: Vector3;
  rotation: Quaternion;
  scale: Vector3;
}

export interface CustomizationPartInstance {
  id: string;
  partId: number;
  transform: Transform;
  materialOverrides?: Record<string, any>;
  color?: string;
  visibility?: boolean;
  metadata?: Record<string, any>;
}

export interface VehicleConfiguration {
  baseVehicleId: number;
  baseColor: string;
  parts: CustomizationPartInstance[];
  environment?: string;
  cameraPosition?: Vector3;
  lighting?: Record<string, any>;
}

// Project history and collaboration types
export interface ProjectHistoryEntry {
  id: string;
  timestamp: Date;
  userId: number;
  userName: string;
  action: 'add' | 'remove' | 'modify' | 'undo' | 'redo';
  partId?: number;
  partName?: string;
  before?: any;
  after?: any;
}

export interface ProjectChangeEvent {
  projectId: number;
  userId: number;
  timestamp: Date;
  changes: any;
  cursorPosition?: Vector3;
}

export interface ProjectCollaborationStatus {
  projectId: number;
  activeUsers: Array<{
    userId: number;
    userName: string;
    cursorPosition?: Vector3;
    lastActive: Date;
    role: 'owner' | 'editor' | 'viewer';
  }>;
  lastSaved?: Date;
}

// User Customization Preferences
export interface UserPreferences {
  userId: number;
  defaultEnvironment?: string;
  cameraControls?: 'orbital' | 'first-person' | 'cinematic';
  showPrices?: boolean;
  qualityLevel?: 'low' | 'medium' | 'high' | 'ultra';
  favoriteCategories?: CustomizationCategory[];
  recentSearches?: string[];
  recentlyViewedParts?: number[];
  savedColorSchemes?: Array<{
    name: string;
    colors: Record<string, string>;
  }>;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}

// Order and checkout schemas
export const orderStatusEnum = z.enum([
  'created', 
  'payment_pending', 
  'payment_failed', 
  'payment_completed', 
  'processing', 
  'ready_for_pickup', 
  'shipped', 
  'delivered', 
  'cancelled', 
  'refunded'
]);

export const orderItemSchema = z.object({
  id: z.number().optional(),
  orderId: z.number().optional(),
  itemType: z.enum(['vehicle', 'part', 'service']),
  itemId: z.number(),
  name: z.string(),
  description: z.string().optional(),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
  currency: z.string().default('INR'),
  thumbnailUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional(),
});

export const orderSchema = z.object({
  id: z.number().optional(),
  userId: z.number(),
  projectId: z.number().optional(),
  orderNumber: z.string().optional(),
  status: orderStatusEnum.default('created'),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  shipping: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  totalAmount: z.number().min(0),
  currency: z.string().default('INR'),
  paymentMethod: z.string().optional(),
  paymentId: z.string().optional(),
  shippingAddress: z.object({
    name: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  billingAddressSameAsShipping: z.boolean().default(true),
  billingAddress: z.object({
    name: z.string().optional(),
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
  estimatedDeliveryDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  items: z.array(orderItemSchema).optional(),
});

// A condensed schema for payment intents
export const paymentIntentSchema = z.object({
  id: z.string().optional(),
  orderId: z.number(),
  clientSecret: z.string().optional(),
  amount: z.number().min(0),
  currency: z.string().default('INR'),
  status: z.enum(['created', 'processing', 'succeeded', 'failed', 'cancelled']).default('created'),
  paymentMethod: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Export types for use in components
export type ProjectData = z.infer<typeof customizationProjectSchema>;
export type VehicleModelData = z.infer<typeof vehicleModelSchema>;
export type CustomizationPartData = z.infer<typeof customizationPartSchema>;
export type CustomizationProject = z.infer<typeof customizationProjectSchema>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type PaymentIntent = z.infer<typeof paymentIntentSchema>;