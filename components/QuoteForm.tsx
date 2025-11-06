
import React, { useMemo } from 'react';
import type { QuoteData, DetailedService } from '../types';
import { UNIT_OPTIONS } from '../constants';

interface QuoteFormProps {
  quoteData: QuoteData;
  onDataChange: (field: keyof Omit<QuoteData, 'phases'>, value: any) => void;
  onItemChange: (phaseId: string, itemId: string, newValues: Partial<DetailedService>) => void;
  onAddItem: (phaseId: string) => void;
  onDeleteItem: (phaseId: string, itemId: string) => void;
  selectedServices: string[];
}

const InputField: React.FC<{ label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder?: string }> = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-[#abd8d8] mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[#1a3638] border border-[#abd8d8]/30 rounded-md p-2 text-white focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none transition-all"
    />
  </div>
);

const QuoteForm: React.FC<QuoteFormProps> = ({ quoteData, onDataChange, onItemChange, onAddItem, onDeleteItem, selectedServices }) => {

  const phasesToShow = useMemo(() => {
    return quoteData.phases.filter(phase => selectedServices.includes(phase.id));
  }, [selectedServices, quoteData.phases]);

  return (
    <div className="bg-[#1a3638] p-6 rounded-lg shadow-lg h-fit sticky top-24">
      <h2 className="text-2xl font-bold mb-6 text-[#f1fd0d]">Détails du Devis</h2>
      <div className="space-y-4">
        <InputField 
          label="Nom du client" 
          placeholder="Ex: Entreprise SARL"
          value={quoteData.clientName}
          onChange={(e) => onDataChange('clientName', e.target.value)}
        />
        <InputField 
          label="Nom du projet" 
          placeholder="Ex: Refonte du site vitrine"
          value={quoteData.projectName}
          onChange={(e) => onDataChange('projectName', e.target.value)}
        />

        <div className="pt-4 space-y-6">
           {phasesToShow.length === 0 && (
             <div className="text-center py-8 px-4 bg-[#12272b] rounded-lg">
                <p className="text-[#abd8d8]">Veuillez sélectionner au moins un type de prestation ci-dessus pour commencer à configurer votre devis.</p>
             </div>
          )}
          {phasesToShow.map(phase => (
            <div key={phase.id}>
              <h3 className="text-lg font-semibold text-[#abd8d8] mb-3">
                {phase.title}
                {phase.subtitle && <span className="text-sm font-normal text-[#abd8d8]/70 ml-2">({phase.subtitle})</span>}
              </h3>
              <div className="space-y-3">
                {phase.items.map(item => {
                  const isCustom = item.id.startsWith('custom-');
                  return (
                  <div key={item.id} className={`bg-[#12272b] p-3 rounded-md border border-transparent ${isCustom ? 'border-[#f1fd0d]/30' : 'hover:border-[#abd8d8]/20'} transition-all text-sm`}>
                    
                    {isCustom ? (
                      <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={item.ref}
                              onChange={(e) => onItemChange(phase.id, item.id, { ref: e.target.value })}
                              placeholder="Réf."
                              className="w-20 bg-[#1a3638] border border-[#abd8d8]/30 rounded-md py-1 px-2 text-white focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none"
                            />
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => onItemChange(phase.id, item.id, { name: e.target.value })}
                              placeholder="Nom de la prestation"
                              className="flex-1 bg-[#1a3638] border border-[#abd8d8]/30 rounded-md py-1 px-2 text-white focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none"
                            />
                             <button onClick={() => onDeleteItem(phase.id, item.id)} className="text-red-400 hover:text-red-300 p-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                             </button>
                          </div>
                          <div className="flex items-center gap-2">
                             <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={item.quantity}
                              onChange={(e) => onItemChange(phase.id, item.id, { quantity: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-[#1a3638] border border-[#abd8d8]/30 rounded-md py-1 px-2 text-white text-right focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none"
                            />
                            <select 
                               value={item.unit} 
                               onChange={(e) => onItemChange(phase.id, item.id, { unit: e.target.value as DetailedService['unit'] })}
                               className="flex-1 bg-[#1a3638] border border-[#abd8d8]/30 rounded-md py-1 px-2 text-white focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none"
                            >
                               {UNIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-1 pr-4">
                          <input
                            type="checkbox"
                            id={`service-${item.id}`}
                            checked={item.active}
                            onChange={(e) => onItemChange(phase.id, item.id, { active: e.target.checked })}
                            className="h-4 w-4 rounded bg-[#1a3638] border-[#abd8d8]/50 text-[#f1fd0d] focus:ring-[#f1fd0d] cursor-pointer"
                          />
                          <label htmlFor={`service-${item.id}`} className="ml-3 text-white cursor-pointer">
                            <span className="font-mono text-xs text-[#abd8d8]">{item.ref}</span> {item.name}
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={item.quantity}
                              onChange={(e) => onItemChange(phase.id, item.id, { quantity: parseFloat(e.target.value) || 0 })}
                              className="w-20 bg-[#1a3638] border border-[#abd8d8]/30 rounded-md py-1 px-2 text-white text-right focus:ring-2 focus:ring-[#f1fd0d] focus:border-[#f1fd0d] outline-none disabled:opacity-50"
                              disabled={!item.active}
                            />
                            <span className="text-xs text-[#abd8d8] w-16 text-left">{item.unit}</span>
                          </div>
                      </div>
                    )}
                  </div>
                )})}
              </div>
              <div className="mt-3">
                  <button 
                    onClick={() => onAddItem(phase.id)}
                    className="w-full text-center text-sm font-semibold text-[#abd8d8] bg-[#12272b] hover:bg-[#1f3a3e] py-2 px-4 rounded-md transition-colors"
                  >
                    + Ajouter une prestation
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteForm;