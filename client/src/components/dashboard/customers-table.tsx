import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Customer, User } from '@shared/schema';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, formatCurrency } from '@/lib/format';

interface CustomersTableProps {
  providerId: number;
}

const CustomersTable = ({ providerId }: CustomersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  
  // Fetch customers
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: [`/api/customers/${providerId}`],
  });
  
  // Fetch users for customer info
  const { data: users } = useQuery<User[]>({
    queryKey: [`/api/users`],
  });
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold">Top Customers by Revenue</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Sort customers by total spent
  const sortedCustomers = [...(customers || [])].sort((a, b) => b.totalSpent - a.totalSpent);
  
  // Paginate
  const startIndex = (currentPage - 1) * pageSize;
  const pagedCustomers = sortedCustomers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil((sortedCustomers?.length || 0) / pageSize);
  
  // User lookup helper
  const getUserInfo = (userId: number) => {
    return users?.find(u => u.id === userId);
  };
  
  // Pagination handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const getInitials = (name?: string) => {
    if (!name) return '--';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold">Top Customers by Revenue</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Customer ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Last Order
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Total Spent
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-light uppercase tracking-wider">
                Orders
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pagedCustomers.map((customer) => {
              const user = getUserInfo(customer.userId);
              const initials = getInitials(user?.fullName);
              
              return (
                <tr key={customer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">
                    {customer.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                          <span>{initials}</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-dark">
                          {user?.fullName || 'Unknown User'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {customer.lastOrderDate 
                      ? formatDate(customer.lastOrderDate) 
                      : 'N/A'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-light">
                    {user?.email || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-dark">
                    {formatCurrency(customer.totalSpent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral">
                    {customer.orders}
                  </td>
                </tr>
              );
            })}
            
            {pagedCustomers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <button 
          className={`text-sm ${
            currentPage > 1 ? 'text-primary' : 'text-neutral-light cursor-not-allowed'
          }`}
          onClick={goToPreviousPage}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <div className="flex items-center">
          <span className="mx-2 text-sm text-neutral-light">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>
        <button 
          className={`text-sm ${
            currentPage < totalPages ? 'text-primary font-medium' : 'text-neutral-light cursor-not-allowed'
          }`}
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomersTable;
