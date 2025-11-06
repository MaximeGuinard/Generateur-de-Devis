
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import QuoteForm from './components/QuoteForm';
import QuotePreview from './components/QuotePreview';
import HistoryList from './components/HistoryList';
import ExportButtons from './components/ExportButtons';
import ServiceSelector from './components/ServiceSelector';
import type { QuoteData, DetailedService } from './types';
import { SERVICES_TEMPLATE, getUnitPrice, VAT_RATE } from './constants';

declare var html2canvas: any;
declare var XLSX: any;

const OTHER_TOOLS = [
  { name: "Générateur Devis SEO", url: "https://generateur-idee-seo-ldtf.bolt.host/" },
  { name: "Vérificateur Hébergement Web", url: "https://verificateur-heberge-pimr.bolt.host/" },
  { name: "Plateforme de Netlinking", url: "https://plateforme-de-netlin-nb5b.bolt.host/" },
  { name: "Matrice Édito SEO", url: "https://matrice-dito-seo-7x9w.bolt.host/" },
  { name: "Monitoring Ranking Mots-Clés", url: "https://monitoring-mot-cle-s-njjo.bolt.host/" },
  { name: "Cocon Générateur", url: "https://cocon-generateur-i33o.bolt.host/" },
  { name: "Guide Mot-Clé SEO", url: "https://guide-mot-cle-seo-hcyv.bolt.host/" },
  { name: "Convertisseur de Texte", url: "https://maxime-guinard.fr/tool/convertisseur-texte/" },
  { name: "Générateur d'Article SEO", url: "https://auto-blog-v1-easygrowth.netlify.app/" },
  { name: "Couleurs / Géotag / Mots-clés / Hn", url: "https://couleurs-g-otag-mots-zbor.bolt.host/" },
  { name: "Bulk Mot-Clé Générateur", url: "https://bulk-mot-cle-generat-mtk5.bolt.host/" },
  { name: "Brief / Hn / Détecteur / Article", url: "https://outil-brief-hn-detec-2siq.bolt.host/" },
  { name: "Générateur de contenu", url: "https://contenu-creation-xl2v.bolt.host/" },
];


const App: React.FC = () => {
  const getNewQuote = (): QuoteData => {
    const now = new Date();
    const quoteNumber = `DS-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
    return {
      clientName: '',
      projectName: '',
      quoteNumber,
      date: new Date().toLocaleDateString('fr-FR'),
      phases: JSON.parse(JSON.stringify(SERVICES_TEMPLATE)), // Deep copy to avoid mutation
    };
  };

  const [quoteData, setQuoteData] = useState<QuoteData>(getNewQuote());
  const [history, setHistory] = useState<QuoteData[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(['refonte']);

   useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('quoteHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  const handleDataChange = (field: keyof Omit<QuoteData, 'phases'>, value: any) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (phaseId: string, itemId: string, newValues: Partial<DetailedService>) => {
    setQuoteData(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              items: phase.items.map(item =>
                item.id === itemId ? { ...item, ...newValues } : item
              ),
            }
          : phase
      ),
    }));
  };
  
    const handleAddItem = (phaseId: string) => {
    const newItem: DetailedService = {
      id: `custom-${Date.now()}`,
      ref: 'C-X',
      name: 'Nouvelle prestation personnalisée',
      unit: 'Journée',
      quantity: 1,
      active: true,
    };
    setQuoteData(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, items: [...phase.items, newItem] }
          : phase
      ),
    }));
  };

  const handleDeleteItem = (phaseId: string, itemId: string) => {
    setQuoteData(prev => ({
      ...prev,
      phases: prev.phases.map(phase =>
        phase.id === phaseId
          ? { ...phase, items: phase.items.filter(item => item.id !== itemId) }
          : phase
      ),
    }));
  };


  const handleServiceSelectionChange = (serviceId: string) => {
    setSelectedServices(prev => {
        const isSelected = prev.includes(serviceId);
        if (isSelected) {
            return prev.filter(id => id !== serviceId);
        } else {
            return [...prev, serviceId];
        }
    });
  };
  
  const handleClearServiceSelection = () => {
    setSelectedServices([]);
  };

  const handleAddToHistory = () => {
    if (!quoteData.clientName || !quoteData.projectName) {
      alert('Veuillez renseigner le nom du client et du projet avant de continuer.');
      return false;
    }
    const newHistory = [quoteData, ...history.filter(h => h.quoteNumber !== quoteData.quoteNumber)];
    setHistory(newHistory);
    localStorage.setItem('quoteHistory', JSON.stringify(newHistory));
    return true;
  };

  const handleLoadQuote = (quoteToLoad: QuoteData) => {
    setQuoteData(quoteToLoad);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleClearHistory = () => {
    if(window.confirm('Êtes-vous sûr de vouloir supprimer tout l\'historique ?')) {
      setHistory([]);
      localStorage.removeItem('quoteHistory');
    }
  }

  const handleDownloadJpg = () => {
    if (!handleAddToHistory()) return;
    const quoteElement = document.getElementById('quote-preview-content');
    if (quoteElement) {
      html2canvas(quoteElement, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = `DEVIS ${quoteData.clientName.toUpperCase()} X DEVSOURCE.jpg`;
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
      });
    }
  };

  const activeItems = useMemo(() => {
    return quoteData.phases.flatMap(phase => 
        phase.items.filter(item => item.active && item.quantity > 0).map(item => ({...item, phaseTitle: phase.title}))
    );
  }, [quoteData.phases]);

  const handleExportExcel = () => {
    if (!handleAddToHistory()) return;
    
    const wb = XLSX.utils.book_new();
    const data: any[][] = [];

    // Header
    data.push([`${quoteData.projectName || 'PROJET'} - DÉTAIL QUANTITATIF ESTIMATIF (DQE)`]);
    data.push([]); // Spacer

    let subTotal = 0;

    // Phases
    quoteData.phases.forEach(phase => {
        const phaseItems = phase.items.filter(item => item.active && item.quantity > 0);
        if (phaseItems.length === 0) return;

        data.push([phase.title]);
        data.push(['', 'PRESTATIONS', 'UNITÉ', 'QUANTITÉ ESTIMÉE', 'PRIX UNITAIRE HT', 'COÛT TOTAL HT']);
        let phaseTotal = 0;

        phaseItems.forEach(item => {
            const unitPrice = getUnitPrice(item);
            const totalHt = item.quantity * unitPrice;
            phaseTotal += totalHt;
            data.push([item.ref, item.name, item.unit, item.quantity, unitPrice, totalHt]);
        });

        data.push(['', '', '', '', 'TOTAL', phaseTotal]);
        data.push([]); // Spacer
        subTotal += phaseTotal;
    });

    // Totals
    const vatAmount = subTotal * VAT_RATE;
    const total = subTotal + vatAmount;
    data.push([]);
    data.push(['', '', '', '', 'TOTAL HT', subTotal]);
    data.push(['', '', '', '', `TVA (${VAT_RATE * 100}%)`, vatAmount]);
    data.push(['', '', '', '', 'TOTAL TTC', total]);

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Devis');
    XLSX.writeFile(wb, `DEVIS ${quoteData.clientName.toUpperCase()} X DEVSOURCE.xlsx`);
  };

  return (
    <div className="min-h-screen bg-[#12272b] text-[#ffffff]">
      <Header />
      <main className="p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Générateur de Devis</h1>
          <p className="text-center text-[#abd8d8] mb-6">Créez et visualisez vos devis rapidement.</p>
          
          <ServiceSelector 
            selectedServices={selectedServices}
            onSelectionChange={handleServiceSelectionChange}
            onClearSelection={handleClearServiceSelection}
          />

          <div className="mb-8">
            <ExportButtons 
              onDownloadJpg={handleDownloadJpg}
              onExportExcel={handleExportExcel}
              hasActiveItems={activeItems.length > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuoteForm
              quoteData={quoteData}
              onDataChange={handleDataChange}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
              onDeleteItem={handleDeleteItem}
              selectedServices={selectedServices}
            />
            <QuotePreview quoteData={quoteData} />
          </div>

          <HistoryList 
            history={history} 
            onLoadQuote={handleLoadQuote} 
            onClearHistory={handleClearHistory} 
          />

        </div>
      </main>
      <footer className="text-center p-4 sm:p-6 md:p-8 text-sm text-[#abd8d8]/50">
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 border-t border-[#abd8d8]/10 pt-8">
                <h3 className="text-lg font-bold text-[#abd8d8] mb-4">Nos autres outils :</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-left">
                    {OTHER_TOOLS.map(tool => (
                        <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#f1fd0d] transition-colors">
                            {tool.name}
                        </a>
                    ))}
                </div>
            </div>
            <p>&copy; {new Date().getFullYear()} Devsource. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;