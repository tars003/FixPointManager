import { 
  users, User, InsertUser,
  vehicles, Vehicle, InsertVehicle,
  serviceProviders, ServiceProvider, InsertServiceProvider,
  serviceBookings, ServiceBooking, InsertServiceBooking,
  availability, Availability, InsertAvailability,
  inspections, Inspection, InsertInspection,
  customers, Customer, InsertCustomer
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Vehicles
  getVehicle(id: number): Promise<Vehicle | undefined>;
  getVehiclesByUserId(userId: number): Promise<Vehicle[]>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Service Providers
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  getNearbyServiceProviders(latitude: string, longitude: string, radius: number): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  
  // Service Bookings
  getServiceBooking(id: number): Promise<ServiceBooking | undefined>;
  getServiceBookingsByUserId(userId: number): Promise<ServiceBooking[]>;
  getServiceBookingsByVehicleId(vehicleId: number): Promise<ServiceBooking[]>;
  getServiceBookingsByProviderId(providerId: number): Promise<ServiceBooking[]>;
  createServiceBooking(booking: InsertServiceBooking): Promise<ServiceBooking>;
  updateServiceBooking(id: number, booking: Partial<InsertServiceBooking>): Promise<ServiceBooking | undefined>;
  
  // Availability
  getAvailabilityByProviderId(providerId: number): Promise<Availability[]>;
  createAvailability(availability: InsertAvailability): Promise<Availability>;
  updateAvailability(id: number, availability: Partial<InsertAvailability>): Promise<Availability | undefined>;
  deleteAvailability(id: number): Promise<boolean>;
  
  // Inspections
  getInspection(id: number): Promise<Inspection | undefined>;
  getInspectionsByVehicleId(vehicleId: number): Promise<Inspection[]>;
  createInspection(inspection: InsertInspection): Promise<Inspection>;
  
  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomersByProviderId(providerId: number): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private vehicles: Map<number, Vehicle>;
  private serviceProviders: Map<number, ServiceProvider>;
  private serviceBookings: Map<number, ServiceBooking>;
  private availabilities: Map<number, Availability>;
  private inspections: Map<number, Inspection>;
  private customers: Map<number, Customer>;
  
  private userIdCounter: number;
  private vehicleIdCounter: number;
  private providerIdCounter: number;
  private bookingIdCounter: number;
  private availabilityIdCounter: number;
  private inspectionIdCounter: number;
  private customerIdCounter: number;

  constructor() {
    this.users = new Map();
    this.vehicles = new Map();
    this.serviceProviders = new Map();
    this.serviceBookings = new Map();
    this.availabilities = new Map();
    this.inspections = new Map();
    this.customers = new Map();
    
    this.userIdCounter = 1;
    this.vehicleIdCounter = 1;
    this.providerIdCounter = 1;
    this.bookingIdCounter = 1;
    this.availabilityIdCounter = 1;
    this.inspectionIdCounter = 1;
    this.customerIdCounter = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "demo",
      password: "password",
      fullName: "John Doe",
      email: "john.doe@example.com",
      initials: "JD",
      role: "user"
    };
    this.createUser(demoUser);
    
    // Create service provider
    const provider: InsertServiceProvider = {
      name: "Quick Fix Auto Service",
      address: "123 Service Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94105",
      phone: "415-555-1234",
      email: "service@quickfix.com",
      website: "https://quickfix.com",
      latitude: "37.7749",
      longitude: "-122.4194",
      services: ["Oil Change", "Tire Rotation", "Brake Service", "Engine Repair"],
      rating: 4
    };
    this.createServiceProvider(provider);
    
    // Add availability for the service provider
    const availabilities = [
      { providerId: 1, dayOfWeek: 1, startTime: "09:00", endTime: "17:00" },
      { providerId: 1, dayOfWeek: 2, startTime: "09:00", endTime: "17:00" },
      { providerId: 1, dayOfWeek: 3, startTime: "09:00", endTime: "17:00" },
      { providerId: 1, dayOfWeek: 4, startTime: "09:00", endTime: "17:00" },
      { providerId: 1, dayOfWeek: 5, startTime: "09:00", endTime: "17:00" },
    ];
    
    availabilities.forEach(avail => this.createAvailability(avail));
  }

  // User Methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Vehicle Methods
  async getVehicle(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehiclesByUserId(userId: number): Promise<Vehicle[]> {
    return Array.from(this.vehicles.values()).filter(
      (vehicle) => vehicle.userId === userId
    );
  }

  async createVehicle(insertVehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleIdCounter++;
    const createdAt = new Date();
    const vehicle: Vehicle = { ...insertVehicle, id, createdAt };
    this.vehicles.set(id, vehicle);
    return vehicle;
  }

  async updateVehicle(id: number, updateData: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) return undefined;
    
    const updatedVehicle = { ...vehicle, ...updateData };
    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    return this.vehicles.delete(id);
  }

  // Service Provider Methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values());
  }

  async getNearbyServiceProviders(latitude: string, longitude: string, radius: number): Promise<ServiceProvider[]> {
    // In a real implementation, we would use a spatial database or external API
    // For this demo, we'll just return all providers
    return Array.from(this.serviceProviders.values());
  }

  async createServiceProvider(insertProvider: InsertServiceProvider): Promise<ServiceProvider> {
    const id = this.providerIdCounter++;
    const createdAt = new Date();
    const provider: ServiceProvider = { ...insertProvider, id, createdAt };
    this.serviceProviders.set(id, provider);
    return provider;
  }

  // Service Booking Methods
  async getServiceBooking(id: number): Promise<ServiceBooking | undefined> {
    return this.serviceBookings.get(id);
  }

  async getServiceBookingsByUserId(userId: number): Promise<ServiceBooking[]> {
    return Array.from(this.serviceBookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }

  async getServiceBookingsByVehicleId(vehicleId: number): Promise<ServiceBooking[]> {
    return Array.from(this.serviceBookings.values()).filter(
      (booking) => booking.vehicleId === vehicleId
    );
  }

  async getServiceBookingsByProviderId(providerId: number): Promise<ServiceBooking[]> {
    return Array.from(this.serviceBookings.values()).filter(
      (booking) => booking.providerId === providerId
    );
  }

  async createServiceBooking(insertBooking: InsertServiceBooking): Promise<ServiceBooking> {
    const id = this.bookingIdCounter++;
    const createdAt = new Date();
    const booking: ServiceBooking = { ...insertBooking, id, createdAt };
    this.serviceBookings.set(id, booking);
    return booking;
  }

  async updateServiceBooking(id: number, updateData: Partial<InsertServiceBooking>): Promise<ServiceBooking | undefined> {
    const booking = this.serviceBookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking = { ...booking, ...updateData };
    this.serviceBookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Availability Methods
  async getAvailabilityByProviderId(providerId: number): Promise<Availability[]> {
    return Array.from(this.availabilities.values()).filter(
      (avail) => avail.providerId === providerId
    );
  }

  async createAvailability(insertAvailability: InsertAvailability): Promise<Availability> {
    const id = this.availabilityIdCounter++;
    const createdAt = new Date();
    const availability: Availability = { ...insertAvailability, id, createdAt };
    this.availabilities.set(id, availability);
    return availability;
  }

  async updateAvailability(id: number, updateData: Partial<InsertAvailability>): Promise<Availability | undefined> {
    const availability = this.availabilities.get(id);
    if (!availability) return undefined;
    
    const updatedAvailability = { ...availability, ...updateData };
    this.availabilities.set(id, updatedAvailability);
    return updatedAvailability;
  }

  async deleteAvailability(id: number): Promise<boolean> {
    return this.availabilities.delete(id);
  }

  // Inspection Methods
  async getInspection(id: number): Promise<Inspection | undefined> {
    return this.inspections.get(id);
  }

  async getInspectionsByVehicleId(vehicleId: number): Promise<Inspection[]> {
    return Array.from(this.inspections.values()).filter(
      (inspection) => inspection.vehicleId === vehicleId
    );
  }

  async createInspection(insertInspection: InsertInspection): Promise<Inspection> {
    const id = this.inspectionIdCounter++;
    const createdAt = new Date();
    const inspection: Inspection = { ...insertInspection, id, createdAt };
    this.inspections.set(id, inspection);
    return inspection;
  }

  // Customer Methods
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomersByProviderId(providerId: number): Promise<Customer[]> {
    return Array.from(this.customers.values()).filter(
      (customer) => customer.providerId === providerId
    );
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const createdAt = new Date();
    const customer: Customer = { ...insertCustomer, id, createdAt };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: number, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;
    
    const updatedCustomer = { ...customer, ...updateData };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }
}

export const storage = new MemStorage();
