import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import BookingFlow from '@/components/booking/booking-flow';

const BookService = () => {
  const params = useParams();
  const [location, setLocation] = useLocation();
  
  // If no vehicle ID is provided, redirect to vehicles page
  useEffect(() => {
    if (!params.vehicleId && location === "/book-service") {
      setLocation("/vehicles");
    }
  }, [params.vehicleId, location, setLocation]);
  
  return (
    <div>
      <BookingFlow />
    </div>
  );
};

export default BookService;
