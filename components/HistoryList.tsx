
import React, { useMemo } from 'react';
import type { QuoteData } from '../types';
import { getUnitPrice, VAT_RATE, formatCurrency } from '../constants';

interface HistoryListProps {
  history: QuoteData[];
  onLoadQuote: (quote: QuoteData) => void;
  onClearHistory: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onLoadQuote, onClearHistory }) => {
  if (history.length === 0) {
    return null;
  }
  
  const calculateTotal = (quote: QuoteData) => {
    const subTotal = quote.phases.reduce((acc, phase) => {
        return acc + phase.items.reduce((itemAcc, item) => {
            if (item.active && item.quantity > 0) {
                return itemAcc + item.quantity * getUnitPrice(item);
            }
            return itemAcc;
        }, 0);
    }, 0);
    return subTotal * (1 + VAT_RATE);
  };

  return (
    <div className="mt-12 bg-[#1a3638] p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-[#f1fd0d]">Historique des devis</h2>
        <button 
          onClick={onClearHistory}
          className="text-sm text-[#abd8d8] hover:text-red-400 transition-colors"
        >
          Vider l'historique
        </button>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {history.map(quote => (
          <div 
            key={quote.quoteNumber}
            className="bg-[#12272b] p-4 rounded-md flex items-center justify-between hover:bg-[#1f3a3e] transition-colors"
          >
            <div>
              <p className="font-bold text-white">{quote.clientName} - <span className="font-medium">{quote.projectName}</span></p>
              <p className="text-sm text-[#abd8d8]">
                {quote.date} &bull; {quote.quoteNumber} &bull; <span className="font-semibold">{formatCurrency(calculateTotal(quote))}</span>
              </p>
            </div>
            <button
              onClick={() => onLoadQuote(quote)}
              className="bg-[#abd8d8] text-[#12272b] font-bold py-1 px-3 text-sm rounded-md hover:bg-opacity-80 transition-opacity"
            >
              Charger
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;
