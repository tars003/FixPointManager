import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from 'ws';
import { storage } from "./storage";
import { db } from "./db";
import { 
  vehicles,
  insertVehicleSchema, 
  insertServiceBookingSchema, 
  insertAvailabilitySchema,
  insertInspectionSchema,
  insertEmergencyProfileSchema,
  insertEmergencyIncidentSchema,
  customizationProjects,
  insertCustomizationProjectSchema,
  vehicleModels,
  customizationParts,
  insertVehicleModelSchema,
  insertCustomizationPartSchema,
  vehicleDocuments,
  insertVehicleDocumentSchema
} from "@shared/schema";
import { registerOrderRoutes } from "./api/orders";
import { resetDashboardModules } from "../client/src/services/dashboardPreferences";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { eq, and, desc } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();
  
  // Middleware to handle Zod validation errors
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          res.status(400).json({ 
            message: "Validation error", 
            errors: fromZodError(error).message 
          });
        } else {
          next(error);
        }
      }
    };
  };

  // Membership Routes
  apiRouter.get("/membership-status", async (req, res) => {
    // If userId is not provided, use 1 as the default (demo user)
    const userIdParam = req.query.userId || '1';
    const userId = parseInt(userIdParam as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    try {
      // In a real app, this would check a membership table in the database
      // For now, we'll simulate a response based on user ID
      // User 1 has no membership, user 2 has basic, user 3 has premium
      let hasMembership = false;
      let membershipData = null;
      
      // For demo purposes, even userIDs have membership
      if (userId % 2 === 0) {
        hasMembership = true;
        membershipData = {
          userId,
          membershipType: userId % 3 === 0 ? "elite" : "premium",
          membershipNumber: "2241 8891 4412 5551",
          memberSince: "April 2025",
          points: 1250,
          vehicleCount: 2,
          expiryDate: "04/28",
          status: "active"
        };
      }
      
      res.status(200).json({ hasMembership, membershipData });
    } catch (error) {
      console.error("Error fetching membership status:", error);
      res.status(500).json({ message: "Error fetching membership status" });
    }
  });
  
  // Vehicle Routes
  apiRouter.get("/vehicles", async (req, res) => {
    // If userId is not provided, use 1 as the default (demo user)
    const userIdParam = req.query.userId || '1';
    const userId = parseInt(userIdParam as string);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    
    const vehicles = await storage.getVehiclesByUserId(userId);
    res.json(vehicles);
  });

  apiRouter.get("/vehicles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const vehicle = await storage.getVehicle(id);
    
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json(vehicle);
  });

  apiRouter.post("/vehicles", validateRequest(insertVehicleSchema), async (req, res) => {
    const vehicle = await storage.createVehicle(req.body);
    res.status(201).json(vehicle);
  });

  apiRouter.put("/vehicles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedVehicle = await storage.updateVehicle(id, req.body);
    
    if (!updatedVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.json(updatedVehicle);
  });

  apiRouter.delete("/vehicles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteVehicle(id);
    
    if (!success) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    
    res.status(204).send();
  });

  // Service Provider Routes
  apiRouter.get("/service-providers", async (req, res) => {
    const latitude = req.query.latitude as string;
    const longitude = req.query.longitude as string;
    const radius = parseInt(req.query.radius as string) || 10;
    
    if (latitude && longitude) {
      const providers = await storage.getNearbyServiceProviders(latitude, longitude, radius);
      return res.json(providers);
    }
    
    const providers = await storage.getAllServiceProviders();
    res.json(providers);
  });

  apiRouter.get("/service-providers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const provider = await storage.getServiceProvider(id);
    
    if (!provider) {
      return res.status(404).json({ message: "Service provider not found" });
    }
    
    res.json(provider);
  });

  // Service Booking Routes
  apiRouter.get("/bookings", async (req, res) => {
    const userIdParam = req.query.userId || '1'; // Default to demo user (ID: 1)
    const userId = parseInt(userIdParam as string);
    
    const vehicleId = req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined;
    const providerId = req.query.providerId ? parseInt(req.query.providerId as string) : undefined;
    
    // If no specific filter provided, default to demo user
    if (!req.query.userId && !req.query.vehicleId && !req.query.providerId) {
      const bookings = await storage.getServiceBookingsByUserId(1);
      return res.json(bookings);
    }
    
    if (userId && !isNaN(userId)) {
      const bookings = await storage.getServiceBookingsByUserId(userId);
      return res.json(bookings);
    }
    
    if (vehicleId) {
      const bookings = await storage.getServiceBookingsByVehicleId(vehicleId);
      return res.json(bookings);
    }
    
    if (providerId) {
      const bookings = await storage.getServiceBookingsByProviderId(providerId);
      return res.json(bookings);
    }
    
    res.status(400).json({ message: "Please provide valid userId, vehicleId, or providerId" });
  });

  apiRouter.get("/bookings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const booking = await storage.getServiceBooking(id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(booking);
  });

  apiRouter.post("/bookings", validateRequest(insertServiceBookingSchema), async (req, res) => {
    const booking = await storage.createServiceBooking(req.body);
    res.status(201).json(booking);
  });

  apiRouter.put("/bookings/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedBooking = await storage.updateServiceBooking(id, req.body);
    
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json(updatedBooking);
  });

  // Availability Routes
  apiRouter.get("/availability/:providerId", async (req, res) => {
    const providerId = parseInt(req.params.providerId);
    const availability = await storage.getAvailabilityByProviderId(providerId);
    res.json(availability);
  });

  apiRouter.post("/availability", validateRequest(insertAvailabilitySchema), async (req, res) => {
    const availability = await storage.createAvailability(req.body);
    res.status(201).json(availability);
  });

  apiRouter.put("/availability/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedAvailability = await storage.updateAvailability(id, req.body);
    
    if (!updatedAvailability) {
      return res.status(404).json({ message: "Availability not found" });
    }
    
    res.json(updatedAvailability);
  });

  apiRouter.delete("/availability/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteAvailability(id);
    
    if (!success) {
      return res.status(404).json({ message: "Availability not found" });
    }
    
    res.status(204).send();
  });

  // Inspection Routes
  apiRouter.get("/inspections/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const inspection = await storage.getInspection(id);
    
    if (!inspection) {
      return res.status(404).json({ message: "Inspection not found" });
    }
    
    res.json(inspection);
  });

  apiRouter.get("/inspections/vehicle/:vehicleId", async (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const inspections = await storage.getInspectionsByVehicleId(vehicleId);
    res.json(inspections);
  });

  apiRouter.post("/inspections", validateRequest(insertInspectionSchema), async (req, res) => {
    const inspection = await storage.createInspection(req.body);
    res.status(201).json(inspection);
  });

  // Customer Routes
  apiRouter.get("/customers/:providerId", async (req, res) => {
    const providerId = parseInt(req.params.providerId);
    const customers = await storage.getCustomersByProviderId(providerId);
    res.json(customers);
  });

  // Emergency Profile Routes
  apiRouter.get("/emergency-profiles/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const profile = await storage.getEmergencyProfileByUserId(userId);
    
    if (!profile) {
      return res.status(404).json({ message: "Emergency profile not found" });
    }
    
    res.json(profile);
  });

  apiRouter.get("/emergency-profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const profile = await storage.getEmergencyProfile(id);
    
    if (!profile) {
      return res.status(404).json({ message: "Emergency profile not found" });
    }
    
    res.json(profile);
  });

  apiRouter.post("/emergency-profiles", validateRequest(insertEmergencyProfileSchema), async (req, res) => {
    const profile = await storage.createEmergencyProfile(req.body);
    res.status(201).json(profile);
  });

  apiRouter.put("/emergency-profiles/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedProfile = await storage.updateEmergencyProfile(id, req.body);
    
    if (!updatedProfile) {
      return res.status(404).json({ message: "Emergency profile not found" });
    }
    
    res.json(updatedProfile);
  });

  // Emergency Incident Routes
  apiRouter.get("/emergency-incidents/user/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const incidents = await storage.getEmergencyIncidentsByUserId(userId);
    res.json(incidents);
  });

  apiRouter.get("/emergency-incidents/vehicle/:vehicleId", async (req, res) => {
    const vehicleId = parseInt(req.params.vehicleId);
    const incidents = await storage.getEmergencyIncidentsByVehicleId(vehicleId);
    res.json(incidents);
  });

  apiRouter.get("/emergency-incidents/active/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const incidents = await storage.getActiveEmergencyIncidents(userId);
    res.json(incidents);
  });

  apiRouter.get("/emergency-incidents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const incident = await storage.getEmergencyIncident(id);
    
    if (!incident) {
      return res.status(404).json({ message: "Emergency incident not found" });
    }
    
    res.json(incident);
  });

  apiRouter.post("/emergency-incidents", validateRequest(insertEmergencyIncidentSchema), async (req, res) => {
    const incident = await storage.createEmergencyIncident(req.body);
    res.status(201).json(incident);
  });

  apiRouter.put("/emergency-incidents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedIncident = await storage.updateEmergencyIncident(id, req.body);
    
    if (!updatedIncident) {
      return res.status(404).json({ message: "Emergency incident not found" });
    }
    
    res.json(updatedIncident);
  });

  // Dashboard preferences reset endpoint
  apiRouter.post("/reset-dashboard-preferences", (req, res) => {
    try {
      resetDashboardModules();
      res.status(200).json({ message: "Dashboard preferences reset successfully" });
    } catch (error) {
      console.error("Error resetting dashboard preferences:", error);
      res.status(500).json({ message: "Failed to reset dashboard preferences" });
    }
  });
  
  // Arena Vehicle Models API Routes
  apiRouter.get("/vehicle-models", async (req, res) => {
    try {
      const category = req.query.category as string;
      const manufacturer = req.query.manufacturer as string;
      const isActive = req.query.isActive === 'true' ? true : undefined;
      
      let query = db.select().from(vehicleModels);
      
      if (category) {
        query = query.where(eq(vehicleModels.category, category));
      }
      
      if (manufacturer) {
        query = query.where(eq(vehicleModels.manufacturer, manufacturer));
      }
      
      if (isActive !== undefined) {
        query = query.where(eq(vehicleModels.isActive, isActive));
      }
      
      // Sort by popularity descending by default
      query = query.orderBy(desc(vehicleModels.popularity));
      
      const models = await query;
      res.json(models);
    } catch (error) {
      console.error("Error fetching vehicle models:", error);
      res.status(500).json({ error: "Failed to fetch vehicle models" });
    }
  });
  
  apiRouter.get("/vehicle-models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle model ID" });
      }
      
      const [model] = await db.select()
        .from(vehicleModels)
        .where(eq(vehicleModels.id, id));
      
      if (!model) {
        return res.status(404).json({ error: "Vehicle model not found" });
      }
      
      res.json(model);
    } catch (error) {
      console.error("Error fetching vehicle model:", error);
      res.status(500).json({ error: "Failed to fetch vehicle model" });
    }
  });
  
  apiRouter.post("/vehicle-models", validateRequest(insertVehicleModelSchema), async (req, res) => {
    try {
      const [createdModel] = await db.insert(vehicleModels)
        .values(req.body)
        .returning();
      
      res.status(201).json(createdModel);
    } catch (error) {
      console.error("Error creating vehicle model:", error);
      res.status(500).json({ error: "Failed to create vehicle model" });
    }
  });
  
  apiRouter.put("/vehicle-models/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid vehicle model ID" });
      }
      
      const [updatedModel] = await db.update(vehicleModels)
        .set(req.body)
        .where(eq(vehicleModels.id, id))
        .returning();
      
      if (!updatedModel) {
        return res.status(404).json({ error: "Vehicle model not found" });
      }
      
      res.json(updatedModel);
    } catch (error) {
      console.error("Error updating vehicle model:", error);
      res.status(500).json({ error: "Failed to update vehicle model" });
    }
  });
  
  // Arena Customization Parts API Routes
  apiRouter.get("/customization-parts", async (req, res) => {
    try {
      const category = req.query.category as string;
      const subcategory = req.query.subcategory as string;
      const vehicleCategory = req.query.vehicleCategory as string;
      const compatibleModel = req.query.compatibleModel as string;
      const inStock = req.query.inStock === 'true' ? true : undefined;
      
      let query = db.select().from(customizationParts);
      
      if (category) {
        query = query.where(eq(customizationParts.category, category));
      }
      
      if (subcategory) {
        query = query.where(eq(customizationParts.subcategory, subcategory));
      }
      
      // For other filters that require more complex querying (jsonb fields),
      // we'll need to fetch all and filter in-memory
      let parts = await query;
      
      // Filter by vehicle category if provided
      if (vehicleCategory) {
        parts = parts.filter(part => 
          part.vehicleCategories && Array.isArray(part.vehicleCategories) && 
          (part.vehicleCategories as string[]).includes(vehicleCategory)
        );
      }
      
      // Filter by compatible model if provided
      if (compatibleModel) {
        parts = parts.filter(part => 
          part.compatibleModels && Array.isArray(part.compatibleModels) && 
          (part.compatibleModels as string[]).includes(compatibleModel)
        );
      }
      
      // Filter by in-stock status if provided
      if (inStock !== undefined) {
        parts = parts.filter(part => part.inStock === inStock);
      }
      
      // Sort by popularity by default
      parts.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      
      res.json(parts);
    } catch (error) {
      console.error("Error fetching customization parts:", error);
      res.status(500).json({ error: "Failed to fetch customization parts" });
    }
  });
  
  apiRouter.get("/customization-parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid part ID" });
      }
      
      const [part] = await db.select()
        .from(customizationParts)
        .where(eq(customizationParts.id, id));
      
      if (!part) {
        return res.status(404).json({ error: "Customization part not found" });
      }
      
      res.json(part);
    } catch (error) {
      console.error("Error fetching customization part:", error);
      res.status(500).json({ error: "Failed to fetch customization part" });
    }
  });
  
  apiRouter.post("/customization-parts", validateRequest(insertCustomizationPartSchema), async (req, res) => {
    try {
      const [createdPart] = await db.insert(customizationParts)
        .values(req.body)
        .returning();
      
      res.status(201).json(createdPart);
    } catch (error) {
      console.error("Error creating customization part:", error);
      res.status(500).json({ error: "Failed to create customization part" });
    }
  });
  
  apiRouter.put("/customization-parts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid part ID" });
      }
      
      const [updatedPart] = await db.update(customizationParts)
        .set(req.body)
        .where(eq(customizationParts.id, id))
        .returning();
      
      if (!updatedPart) {
        return res.status(404).json({ error: "Customization part not found" });
      }
      
      res.json(updatedPart);
    } catch (error) {
      console.error("Error updating customization part:", error);
      res.status(500).json({ error: "Failed to update customization part" });
    }
  });

  // Mock auth routes for demo purposes
  apiRouter.post("/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
    
    const user = await storage.getUserByUsername(username);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      initials: user.initials,
      role: user.role
    });
  });

  app.use("/api", apiRouter);

  // Customization Projects API Routes
  apiRouter.get("/customization-projects", async (req, res) => {
    try {
      // Since we don't have authentication set up yet, we'll get all projects
      // or use a default user ID of 1
      const userId = 1; // Default user ID for demo
      
      try {
        const projects = await db.select()
          .from(customizationProjects)
          .where(eq(customizationProjects.userId, userId))
          .orderBy(desc(customizationProjects.updatedAt));
        
        return res.json(projects);
      } catch (dbError) {
        console.error("Database query error:", dbError);
        return res.status(500).json({ error: "Failed to fetch projects", details: dbError.message });
      }
      
      // Fallback for demo purposes
      const projects = [
        {
          id: 101,
          name: "Honda City Sport Package",
          vehicleId: 1,
          userId: 999,
          description: "Sport package with custom rims and body kit",
          customizations: JSON.stringify({ 
            vehicleColor: "#FF5733",
            colorFinish: "metallic",
            selectedBodyKit: "sport",
            selectedSpoiler: "mid",
            cartItems: [],
            mainCategory: "exterior",
            exteriorSubcategory: "body-kits"
          }),
          status: "in-progress",
          visibility: "public",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 102,
          name: "Royal Enfield Classic Overhaul",
          vehicleId: 2,
          userId: 999,
          description: "Classic look with chrome accents",
          customizations: JSON.stringify({ 
            vehicleColor: "#000000",
            colorFinish: "matte",
            selectedBodyKit: "premium", 
            selectedSpoiler: "none",
            cartItems: [],
            mainCategory: "exterior",
            exteriorSubcategory: "paint-wraps"
          }),
          status: "draft",
          visibility: "private",
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000)
        }
      ];
      
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });
  
  // Get draft projects for current user
  apiRouter.get("/customization-projects/drafts", async (req, res) => {
    try {
      // Since we don't have authentication set up yet, we'll use a default user ID
      const userId = 1; // Default user ID for demo
      
      try {
        const projects = await db.select()
          .from(customizationProjects)
          .where(and(
            eq(customizationProjects.userId, userId),
            eq(customizationProjects.status, "draft")
          ))
          .orderBy(desc(customizationProjects.updatedAt));
        
        return res.status(200).json(projects);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database error", details: dbError.message });
      }
    } catch (error) {
      console.error("Error fetching draft projects:", error);
      return res.status(500).json({ error: "Failed to fetch draft projects" });
    }
  });
  
  // Get a specific project
  apiRouter.get("/customization-projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      const [project] = await db.select()
        .from(customizationProjects)
        .where(eq(customizationProjects.id, projectId));
      
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Since we don't have authentication, we'll allow access to all projects
      // In a real app, we would check if the project belongs to the authenticated user
      return res.status(200).json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      return res.status(500).json({ error: "Failed to fetch project" });
    }
  });
  
  // Create a new project
  apiRouter.post("/customization-projects", async (req, res) => {
    try {
      // Since we don't have authentication set up yet, we'll use a default user ID
      const userId = 1; // Default user ID for demo
      
      // Prepare project data
      const projectData = {
        ...req.body,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Validate with schema
      const validatedData = insertCustomizationProjectSchema.parse(projectData);
      
      try {
        // Insert into database
        const [createdProject] = await db.insert(customizationProjects)
          .values(validatedData)
          .returning();
        
        return res.status(201).json(createdProject);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database error", details: dbError.message });
      }
    } catch (error) {
      console.error("Error creating project:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      
      return res.status(500).json({ error: "Failed to create project" });
    }
  });
  
  // Update a project
  apiRouter.put("/customization-projects/:id", async (req, res) => {
    try {
      // Since we don't have authentication set up yet, we'll use a default user ID
      const userId = 1; // Default user ID for demo
      const projectId = parseInt(req.params.id);
      
      if (isNaN(projectId)) {
        return res.status(400).json({ error: "Invalid project ID" });
      }
      
      // Check if project exists
      const [existingProject] = await db.select()
        .from(customizationProjects)
        .where(eq(customizationProjects.id, projectId));
      
      if (!existingProject) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      // Update project
      const projectData = {
        ...req.body,
        updatedAt: new Date()
      };
      
      try {
        const [updatedProject] = await db.update(customizationProjects)
          .set(projectData)
          .where(eq(customizationProjects.id, projectId))
          .returning();
        
        return res.status(200).json(updatedProject);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database error", details: dbError.message });
      }
    } catch (error) {
      console.error("Error updating project:", error);
      return res.status(500).json({ error: "Failed to update project" });
    }
  });
  
  apiRouter.get("/arena/trending", async (req, res) => {
    // Mock trending products for demo
    const products = [
      {
        id: 1,
        name: "Borla Performance Exhaust System",
        category: "Performance",
        price: 45000,
        rating: 4.9,
        reviewCount: 328,
        compatibility: ["Honda City", "Honda Civic"]
      },
      {
        id: 2,
        name: "Momo Revenge Alloy Wheels 17\"",
        category: "Exterior",
        price: 32000,
        rating: 4.8,
        reviewCount: 215,
        compatibility: ["Most Sedans and SUVs"]
      }
    ];
    
    res.json(products);
  });
  
  apiRouter.get("/arena/community", async (req, res) => {
    // Mock community posts for demo
    const posts = [
      {
        id: 1,
        title: "Ultimate City Transformation",
        userId: 2,
        user: {
          name: "RacingLegend",
          isVerified: true
        },
        vehicle: "2022 Honda City ZX",
        likes: 342,
        comments: 56,
        totalCost: 215000,
        difficulty: "Advanced"
      },
      {
        id: 2,
        title: "Vintage Revival Project",
        userId: 3,
        user: {
          name: "CruiserFan",
          isVerified: false
        },
        vehicle: "2021 Royal Enfield Classic 350",
        likes: 285,
        comments: 42,
        totalCost: 78000,
        difficulty: "Intermediate"
      }
    ];
    
    res.json(posts);
  });
  
  apiRouter.get("/arena/tutorials", async (req, res) => {
    // Mock tutorials for demo
    const tutorials = [
      {
        id: 1,
        title: "Complete Guide to Wheel Selection",
        type: "Video",
        duration: "25:45",
        level: "Beginner",
        instructor: "Alex Chen",
        views: 12584,
        category: "Exterior"
      },
      {
        id: 2,
        title: "Professional Vinyl Wrap Techniques",
        type: "Video",
        duration: "38:12",
        level: "Intermediate",
        instructor: "Samantha Wright",
        views: 8456,
        category: "Exterior"
      }
    ];
    
    res.json(tutorials);
  });

  // Document Routes
  apiRouter.get("/documents", async (req, res) => {
    try {
      const userIdParam = req.query.userId || '1'; // Default to demo user
      const vehicleId = req.query.vehicleId ? parseInt(req.query.vehicleId as string) : undefined;
      const userId = parseInt(userIdParam as string);
      
      // Query all documents or filter by vehicleId
      const documents = await db.select().from(vehicleDocuments)
        .where(vehicleId ? eq(vehicleDocuments.vehicleId, vehicleId) : undefined);
      
      // For each document, fetch its associated vehicle details
      const documentsWithVehicles = await Promise.all(documents.map(async (doc) => {
        const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, doc.vehicleId));
        return {
          ...doc,
          vehicle: vehicle ? {
            id: vehicle.id,
            name: vehicle.name,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            licensePlate: vehicle.licensePlate,
            imageUrl: vehicle.imageUrl
          } : undefined
        };
      }));
      
      res.json(documentsWithVehicles);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Error fetching documents" });
    }
  });

  apiRouter.get("/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [document] = await db.select().from(vehicleDocuments).where(eq(vehicleDocuments.id, id));
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, document.vehicleId));
      
      res.json({
        ...document,
        vehicle: vehicle ? {
          id: vehicle.id,
          name: vehicle.name,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          licensePlate: vehicle.licensePlate,
          imageUrl: vehicle.imageUrl
        } : undefined
      });
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Error fetching document" });
    }
  });

  apiRouter.post("/documents", validateRequest(insertVehicleDocumentSchema), async (req, res) => {
    try {
      // Process dates if provided
      const documentData = { ...req.body };
      
      if (documentData.expiryDate) {
        documentData.expiryDate = new Date(documentData.expiryDate);
      }
      
      if (documentData.issuedDate) {
        documentData.issuedDate = new Date(documentData.issuedDate);
      }
      
      // Add timestamps
      documentData.createdAt = new Date();
      documentData.updatedAt = new Date();
      
      const [document] = await db.insert(vehicleDocuments).values(documentData).returning();
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Error creating document" });
    }
  });

  apiRouter.put("/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Convert date strings to Date objects
      const updateData = { ...req.body };
      if (updateData.expiryDate) {
        updateData.expiryDate = new Date(updateData.expiryDate);
      }
      if (updateData.issuedDate) {
        updateData.issuedDate = new Date(updateData.issuedDate);
      }
      
      // Add updatedAt timestamp
      updateData.updatedAt = new Date();
      
      const [updatedDocument] = await db.update(vehicleDocuments)
        .set(updateData)
        .where(eq(vehicleDocuments.id, id))
        .returning();
      
      if (!updatedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(updatedDocument);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Error updating document" });
    }
  });

  apiRouter.delete("/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [deletedDocument] = await db.delete(vehicleDocuments)
        .where(eq(vehicleDocuments.id, id))
        .returning();
      
      if (!deletedDocument) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Error deleting document" });
    }
  });

  // Create server
  // Register order routes (checkout process)
  registerOrderRoutes(app);
  
  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ 
    server: httpServer,
    path: '/ws'
  });
  
  // Active connections and project-user mapping
  const clients = new Map<WebSocket, { userId: number, projectId?: number }>();
  const projectUsers = new Map<number, Set<WebSocket>>();
  
  // Handle WebSocket connections
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');
    
    // Initialize client with a temporary user ID
    clients.set(ws, { userId: -1 });
    
    // Handle messages
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log('Received message:', data);
        
        switch (data.type) {
          case 'AUTHENTICATE':
            // Store user ID with connection
            const userId = data.payload.userId;
            const existingData = clients.get(ws);
            if (existingData) {
              clients.set(ws, { ...existingData, userId });
            }
            break;
            
          case 'JOIN_PROJECT':
            // Add user to project room
            const projectId = data.payload.projectId;
            const clientData = clients.get(ws);
            
            if (clientData) {
              // Update client data with projectId
              clients.set(ws, { ...clientData, projectId });
              
              // Add client to project users
              if (!projectUsers.has(projectId)) {
                projectUsers.set(projectId, new Set());
              }
              projectUsers.get(projectId)?.add(ws);
              
              // Notify all clients in this project about the new user
              broadcastToProject(projectId, {
                type: 'USER_PRESENCE',
                payload: getProjectUsers(projectId)
              });
            }
            break;
            
          case 'LEAVE_PROJECT':
            // Remove user from project room
            const leaveProjectId = data.payload.projectId;
            const currentClientData = clients.get(ws);
            
            if (currentClientData) {
              // Update client data
              clients.set(ws, { ...currentClientData, projectId: undefined });
              
              // Remove from project users
              projectUsers.get(leaveProjectId)?.delete(ws);
              
              // Notify all clients in this project
              broadcastToProject(leaveProjectId, {
                type: 'USER_PRESENCE',
                payload: getProjectUsers(leaveProjectId)
              });
            }
            break;
            
          case 'PROJECT_UPDATE':
            // Broadcast project updates to all users in the project
            const updateProjectId = data.payload.projectId;
            broadcastToProject(updateProjectId, {
              type: 'PROJECT_UPDATE',
              payload: data.payload
            });
            break;
            
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      
      // Get client data
      const clientData = clients.get(ws);
      
      // If client was in a project, notify others
      if (clientData?.projectId) {
        const projectId = clientData.projectId;
        
        // Remove from project
        projectUsers.get(projectId)?.delete(ws);
        
        // Notify all clients in this project
        broadcastToProject(projectId, {
          type: 'USER_PRESENCE',
          payload: getProjectUsers(projectId)
        });
      }
      
      // Remove from clients
      clients.delete(ws);
    });
    
    // Send initial message to client
    ws.send(JSON.stringify({
      type: 'CONNECTED',
      payload: {
        message: 'Connected to Arena WebSocket Server',
        timestamp: new Date().toISOString()
      }
    }));
  });
  
  // Helper function to broadcast to all clients in a project
  function broadcastToProject(projectId: number, message: any) {
    const projectClients = projectUsers.get(projectId);
    
    if (projectClients) {
      const messageStr = JSON.stringify(message);
      
      projectClients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    }
  }
  
  // Helper function to get all users in a project
  function getProjectUsers(projectId: number) {
    const result: {userId: number, username: string, isActive: boolean}[] = [];
    const projectClients = projectUsers.get(projectId);
    
    if (projectClients) {
      projectClients.forEach(client => {
        const clientData = clients.get(client);
        if (clientData && clientData.userId !== -1) {
          // In a real app, you would fetch the username from the database
          result.push({
            userId: clientData.userId,
            username: `User${clientData.userId}`,
            isActive: client.readyState === WebSocket.OPEN
          });
        }
      });
    }
    
    return result;
  }
  
  return httpServer;
}
