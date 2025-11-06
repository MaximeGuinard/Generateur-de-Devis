
import React from 'react';

const SERVICES = [
  { id: 'refonte', label: 'Refonte' },
  { id: 'développement', label: 'Développement' },
  { id: 'hébergement', label: 'Hébergement' },
  { id: 'maintenance', label: 'Maintenance' },
];

interface ServiceSelectorProps {
  selectedServices: string[];
  onSelectionChange: (serviceId: string) => void;
  onClearSelection: () => void;
}

const ServiceSelector: React.FC<ServiceSelectorProps> = ({ selectedServices, onSelectionChange, onClearSelection }) => {
  return (
    <div className="bg-[#1a3638] p-4 rounded-lg mb-8 relative">
      {selectedServices.length > 0 && (
        <button 
          onClick={onClearSelection}
          className="absolute top-3 right-3 text-[#abd8d8]/60 hover:text-white transition-colors z-10 p-1"
          aria-label="Désélectionner tout"
          title="Désélectionner tout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
      <p className="text-sm font-medium text-center text-[#abd8d8] mb-3">Sélectionnez les types de prestations :</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SERVICES.map(service => {
          const isSelected = selectedServices.includes(service.id);
          return (
            <button
              key={service.id}
              onClick={() => onSelectionChange(service.id)}
              className={`w-full text-center font-semibold py-3 px-4 rounded-lg transition-all duration-200 ease-in-out border-2
                ${isSelected
                  ? 'bg-[#abd8d8] text-[#12272b] border-[#abd8d8]'
                  : 'bg-transparent text-white border-[#abd8d8]/30 hover:bg-[#abd8d8]/10 hover:border-[#abd8d8]/60'
                }
              `}
            >
              {service.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;