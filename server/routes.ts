import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertVehicleSchema, 
  insertServiceBookingSchema, 
  insertAvailabilitySchema,
  insertInspectionSchema,
  insertEmergencyProfileSchema,
  insertEmergencyIncidentSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

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

  const httpServer = createServer(app);
  return httpServer;
}
