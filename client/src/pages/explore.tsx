import { useQuery } from '@tanstack/react-query';
import VehicleExplorer from '@/components/explore/vehicle-explorer';

// Sample vehicle types - in a real app this would be fetched from API
const sampleVehicles = [
  {
    id: 1,
    name: "Tesla Model 3",
    manufacturer: "Tesla",
    model: "Model 3",
    year: 2023,
    price: 42990,
    fuelType: "Electric",
    transmission: "Automatic",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3",
    category: "sedan",
    features: ["Autopilot", "15\" Touchscreen", "360° Cameras", "Wireless Charging"]
  },
  {
    id: 2,
    name: "Ford Mustang Mach-E",
    manufacturer: "Ford",
    model: "Mustang Mach-E",
    year: 2023,
    price: 48995,
    fuelType: "Electric",
    transmission: "Automatic",
    imageUrl: "https://images.unsplash.com/photo-1658911563043-df83858a92cb?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3",
    category: "suv",
    features: ["SYNC 4A", "Co-Pilot360", "Bang & Olufsen Sound", "Panoramic Roof"]
  },
  {
    id: 3,
    name: "Toyota Camry",
    manufacturer: "Toyota",
    model: "Camry",
    year: 2022,
    price: 25945,
    fuelType: "Hybrid",
    transmission: "Automatic",
    imageUrl: "https://images.unsplash.com/photo-1621007947181-d0e0b7342782?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3",
    category: "sedan",
    features: ["Toyota Safety Sense", "Apple CarPlay", "Android Auto", "9\" Touchscreen"]
  },
  {
    id: 4,
    name: "Honda CR-V",
    manufacturer: "Honda",
    model: "CR-V",
    year: 2023,
    price: 32355,
    fuelType: "Hybrid",
    transmission: "CVT",
    imageUrl: "https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?auto=format&fit=crop&q=80&w=2071&ixlib=rb-4.0.3",
    category: "suv",
    features: ["Honda Sensing", "Wireless CarPlay", "Hands-free Tailgate", "Hill Descent Control"]
  },
  {
    id: 5,
    name: "Chevrolet Silverado",
    manufacturer: "Chevrolet",
    model: "Silverado",
    year: 2023,
    price: 36300,
    fuelType: "Gasoline",
    transmission: "Automatic",
    imageUrl: "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3",
    category: "truck",
    features: ["Multi-Flex Tailgate", "Trailer Camera", "4G LTE Wi-Fi", "Super Cruise"]
  },
  {
    id: 6,
    name: "BMW X5",
    manufacturer: "BMW",
    model: "X5",
    year: 2023,
    price: 65200,
    fuelType: "Hybrid",
    transmission: "Automatic",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
    category: "luxury",
    features: ["BMW iDrive 8", "Driving Assistant Pro", "Panoramic Sky Lounge", "Harman Kardon Audio"]
  }
];

const Explore = () => {
  // In a real app, we would fetch this data from API
  // For demo purposes, we'll use our sample data
  const { data: vehicles, isLoading, isError } = useQuery({
    queryKey: ['/api/vehicles/explore'],
    queryFn: () => Promise.resolve(sampleVehicles)
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="flex justify-end">
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="h-72 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Error Loading Vehicles</h3>
          <p className="text-neutral-light mb-4">We couldn't load the vehicle data. Please try again later.</p>
          <button 
            className="bg-primary text-white px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {vehicles && <VehicleExplorer vehicles={vehicles} />}
    </div>
  );
};

export default Explore;
