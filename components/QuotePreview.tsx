
import React, { useMemo } from 'react';
import type { QuoteData } from '../types';
import { DAILY_RATE, VAT_RATE, getUnitPrice, formatCurrency, getDurationInDays } from '../constants';

interface QuotePreviewProps {
  quoteData: QuoteData;
}

const QuotePreview: React.FC<QuotePreviewProps> = ({ quoteData }) => {
  
  const { subTotal, vatAmount, total } = useMemo(() => {
    let currentSubTotal = 0;
    quoteData.phases.forEach(phase => {
      phase.items.forEach(item => {
        if (item.active && item.quantity > 0) {
          currentSubTotal += item.quantity * getUnitPrice(item);
        }
      });
    });
    const currentVatAmount = currentSubTotal * VAT_RATE;
    const currentTotal = currentSubTotal + currentVatAmount;
    return { subTotal: currentSubTotal, vatAmount: currentVatAmount, total: currentTotal };
  }, [quoteData.phases]);
  
  const hasActiveItems = useMemo(() => quoteData.phases.some(p => p.items.some(i => i.active && i.quantity > 0)), [quoteData.phases]);


  return (
    <div className="bg-white text-gray-900 rounded-lg shadow-lg">
      <div id="quote-preview-content" className="p-8">
        <header className="flex justify-between items-start pb-6 border-b-2 border-gray-100">
          <div>
            <img src="https://devsource.fr/wp-content/uploads/2025/07/DS_logo_petit_cercle_noeffect.png" alt="Devsource Logo" className="h-16 w-auto" />
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-semibold">Devsource</p>
              <p>196 Avenue du Général de Gaulle</p>
              <p>94500 CHAMPIGNY-SUR-MARNE</p>
              <p>hello@devsource.fr</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold text-[#1a3638]">DEVIS</h1>
            <p className="text-gray-500">{quoteData.quoteNumber}</p>
            <p className="mt-2 text-sm">Date: {quoteData.date}</p>
          </div>
        </header>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase">Destinataire</h2>
          <div className="mt-2 text-[#1a3638]">
            <p className="font-bold">{quoteData.clientName || 'Nom du client'}</p>
            <p>{quoteData.projectName || 'Nom du projet'}</p>
          </div>
        </section>

        <section className="mt-10">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 font-semibold text-gray-600 w-12">Réf.</th>
                <th className="p-3 font-semibold text-gray-600">Prestation</th>
                <th className="p-3 font-semibold text-gray-600 text-center">Jour(s)</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Prix unitaire</th>
                <th className="p-3 font-semibold text-gray-600 text-center">TVA %</th>
                <th className="p-3 font-semibold text-gray-600 text-right">Total HT</th>
              </tr>
            </thead>
            <tbody>
              {!hasActiveItems && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Aucune prestation sélectionnée.
                  </td>
                </tr>
              )}
              {quoteData.phases.map(phase => {
                const activeItems = phase.items.filter(item => item.active && item.quantity > 0);
                if (activeItems.length === 0) return null;

                const phaseTotal = activeItems.reduce((acc, item) => acc + (item.quantity * getUnitPrice(item)), 0);
                const phaseTotalDays = activeItems.reduce((acc, item) => {
                    const days = getDurationInDays(item);
                    return acc + (days || 0);
                }, 0);

                return (
                  <React.Fragment key={phase.id}>
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-2 font-bold text-[#12272b]">
                        {phase.title}
                        {phase.subtitle && <span className="ml-2 font-normal text-xs text-gray-500">({phase.subtitle})</span>}
                      </td>
                    </tr>
                    {activeItems.map(item => {
                      const duration = getDurationInDays(item);
                      return (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="p-3 font-mono text-xs text-gray-800">{item.ref}</td>
                        <td className="p-3 text-[#12272b]">{item.name}</td>
                        <td className="p-3 text-center text-gray-800">{duration !== null ? duration : '–'}</td>
                        <td className="p-3 text-right text-gray-800">{formatCurrency(getUnitPrice(item))}</td>
                        <td className="p-3 text-center text-gray-800">{(VAT_RATE * 100).toFixed(0)}%</td>
                        <td className="p-3 text-right font-medium text-gray-800">{formatCurrency(item.quantity * getUnitPrice(item))}</td>
                      </tr>
                    )})}
                     <tr className="bg-gray-50">
                        <td colSpan={2} className="p-2 text-right font-semibold text-gray-800">Total {phase.title}</td>
                        <td className="p-2 text-center font-semibold text-gray-800">{phaseTotalDays > 0 ? `${phaseTotalDays.toLocaleString('fr-FR')} jour${phaseTotalDays > 1 ? 's' : ''}` : '–'}</td>
                        <td colSpan={3} className="p-2 text-right font-bold text-gray-800">{formatCurrency(phaseTotal)}</td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="mt-10 flex justify-end">
          <div className="w-full max-w-xs">
            <div className="space-y-2 text-[#1a3638]">
              <div className="flex justify-between">
                <span>Sous-total HT</span>
                <span>{formatCurrency(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({(VAT_RATE * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(vatAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
                <span>Total TTC</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t text-xs text-gray-500">
          <p className="font-semibold">Note :</p>
          <p>Ce devis est une estimation basée sur les informations fournies et peut être sujet à modification. Taux journalier de référence : {formatCurrency(DAILY_RATE)}. Devis valable 30 jours.</p>
        </footer>
      </div>
    </div>
  );
};

export default QuotePreview;
