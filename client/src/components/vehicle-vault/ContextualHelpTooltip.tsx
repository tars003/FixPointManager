import { Info, HelpCircle, AlertCircle, Gavel, Shield, FileText as FileTextIcon } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TipType = 
  'purchase' | 
  'ownership' | 
  'storage' | 
  'maintenance' | 
  'commercial' | 
  'lease' | 
  'sale' | 
  'outOfService' | 
  'nonOperational' |
  'document' | 
  'insurance' | 
  'tax' | 
  'pollution' |
  'commercialFleet' |
  'leasedOut' |
  'forSale' |
  'sold' |
  'impound' |
  'legal' |
  'stolen' |
  'scrapped' |
  'totaled';

interface ContextualHelpTooltipProps {
  tipType: TipType;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'info' | 'help' | 'alert';
}

const ContextualHelpTooltip = ({
  tipType,
  size = 'sm',
  variant = 'help',
}: ContextualHelpTooltipProps) => {
  
  const getIcon = () => {
    const sizeMap = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6'
    };
    
    const iconSize = sizeMap[size];
    
    switch (variant) {
      case 'info':
        return <Info className={`${iconSize} text-blue-500`} />;
      case 'alert':
        return <AlertCircle className={`${iconSize} text-amber-500`} />;
      case 'help':
      default:
        return <HelpCircle className={`${iconSize} text-indigo-500`} />;
    }
  };
  
  const getTipContent = (type: TipType) => {
    switch (type) {
      case 'purchase':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Purchase Documentation</h4>
            <p className="text-xs mt-1">Keep your purchase invoice, payment receipts, and delivery notes safe. These are critical for warranty claims and insurance.</p>
          </div>
        );
        
      case 'ownership':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Ownership Transfer</h4>
            <p className="text-xs mt-1">Form 29/30, NOC from RTO, and previous owner details are required for a legal ownership transfer. Always verify chassis/engine numbers match with documents.</p>
          </div>
        );
        
      case 'storage':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Storage Tips</h4>
            <p className="text-xs mt-1">For long-term storage, disconnect the battery, use a breathable cover, and maintain tire pressure. Consider a climate-controlled facility for premium vehicles.</p>
          </div>
        );
        
      case 'maintenance':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Maintenance Records</h4>
            <p className="text-xs mt-1">Regular maintenance records increase resale value. Keep service history, parts replacement details, and warranty claims organized by date.</p>
          </div>
        );
        
      case 'commercial':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Commercial Vehicle Regulations</h4>
            <p className="text-xs mt-1">Commercial permits, fitness certificates, and driver logs are legally required. Ensure proper documentation to avoid penalties.</p>
          </div>
        );
        
      case 'lease':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Lease Agreements</h4>
            <p className="text-xs mt-1">Verify mileage limits, maintenance responsibilities, and end-of-lease conditions. Document the vehicle condition thoroughly before leasing out.</p>
          </div>
        );
        
      case 'sale':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Selling Guidelines</h4>
            <p className="text-xs mt-1">Ensure all pending challans are cleared, NOC from financier obtained (if applicable), and prepare Form 29/30 for ownership transfer.</p>
          </div>
        );
        
      case 'outOfService':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Out of Service Vehicles</h4>
            <p className="text-xs mt-1">For vehicles temporarily decommissioned, file a non-use declaration with RTO to avoid tax liabilities. Keep insurance active to cover theft or damage.</p>
          </div>
        );
        
      case 'nonOperational':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Non-Operational Status</h4>
            <p className="text-xs mt-1">Vehicles with major mechanical failures require official non-operational status declaration with RTO. This suspends certain tax obligations while maintaining legal ownership.</p>
          </div>
        );
        
      case 'document':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Important Documents</h4>
            <p className="text-xs mt-1">Always keep RC, insurance, PUC, and tax receipts in the vehicle. Digital copies in DigiLocker are legally valid in India.</p>
          </div>
        );
        
      case 'insurance':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Insurance Guidelines</h4>
            <p className="text-xs mt-1">Third-party insurance is mandatory by law. Comprehensive policies offer better protection. Set renewal reminders 30 days before expiry.</p>
          </div>
        );
        
      case 'tax':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Vehicle Taxation</h4>
            <p className="text-xs mt-1">Road tax varies by state and vehicle type. Electric vehicles enjoy tax benefits in most states. Lifetime tax is typically paid once during registration.</p>
          </div>
        );
        
      case 'pollution':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">PUC Certificate</h4>
            <p className="text-xs mt-1">Pollution Under Control (PUC) certificates are mandatory. Validity ranges from 6 months to 1 year depending on vehicle age and type.</p>
          </div>
        );
        
      case 'commercialFleet':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Commercial Fleet Management</h4>
            <p className="text-xs mt-1">Commercial vehicles require special permits, driver logs, and regular fitness certifications. GPS tracking and route optimization can reduce operating costs significantly.</p>
          </div>
        );
        
      case 'leasedOut':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Leased Vehicle Management</h4>
            <p className="text-xs mt-1">Keep detailed documentation of lease terms, maintenance responsibilities, mileage restrictions, and payment schedules. Regular inspection reports help prevent disputes at lease-end.</p>
          </div>
        );
        
      case 'forSale':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Vehicle For Sale</h4>
            <p className="text-xs mt-1">When selling a vehicle, prepare complete service history, ownership documents, and NOC from financier (if applicable). High-quality photos and transparent disclosure of conditions speed up the sale process.</p>
          </div>
        );
        
      case 'sold':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Vehicle Transfer Process</h4>
            <p className="text-xs mt-1">After selling a vehicle, the RC transfer process requires Form 29/30, PUC certificate, insurance transfer, and payment receipts. Track the transfer status to ensure legal compliance.</p>
          </div>
        );
        
      case 'impound':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Impounded Vehicle Management</h4>
            <p className="text-xs mt-1">When a vehicle is impounded, collect all case documentation including impound notice, violation records, and release requirements. Pay any pending fines and complete legal formalities for vehicle release.</p>
          </div>
        );
        
      case 'legal':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Legal Hold Information</h4>
            <p className="text-xs mt-1">Vehicles under legal hold cannot be sold, transferred or significantly modified. Maintain all court documents, legal notices, and case information in organized manner for quick reference during proceedings.</p>
          </div>
        );
        
      case 'stolen':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Stolen Vehicle Procedures</h4>
            <p className="text-xs mt-1">File an FIR immediately at the nearest police station. Notify your insurance company within 24 hours. Provide all vehicle documents including RC, insurance, and previous service records to authorities to aid recovery.</p>
          </div>
        );
        
      case 'scrapped':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Vehicle Scrapping Guidelines</h4>
            <p className="text-xs mt-1">Ensure proper deregistration with RTO before scrapping. Obtain a "Certificate of Deposit" from authorized vehicle scrapping facility. This certificate is required for tax benefits and as proof of proper disposal for insurance closure.</p>
          </div>
        );
        
      case 'totaled':
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Totaled Vehicle Procedures</h4>
            <p className="text-xs mt-1">When a vehicle is declared a total loss by insurance, ensure you receive a "Total Loss Certificate". This document is crucial for claiming tax refunds, canceling RC, and closing insurance. Keep all documentation of the damage assessment.</p>
          </div>
        );
        
      default:
        return (
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm">Vehicle Information</h4>
            <p className="text-xs mt-1">Proper documentation and regular maintenance are key to maintaining your vehicle's value and legal compliance.</p>
          </div>
        );
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button className="inline-flex items-center ml-1.5 focus:outline-none" aria-label={`Help for ${tipType}`}>
            {getIcon()}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 p-3 rounded-lg">
          {getTipContent(tipType)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextualHelpTooltip;