import type { DetailedService, Phase } from './types';

export const DAILY_RATE = 500;
export const VAT_RATE = 0.20; // 20%

export const UNIT_OPTIONS: DetailedService['unit'][] = ['Journée', '1/2 journée', 'Réunion', 'Forfait', 'Forfait annuel'];


export const getUnitPrice = (item: DetailedService): number => {
    if (item.price !== undefined) {
        return item.price;
    }
    switch(item.unit) {
        case 'Journée': 
            return DAILY_RATE;
        case '1/2 journée': 
            return DAILY_RATE / 2;
        case 'Réunion':
            return DAILY_RATE / 4; 
        case 'Forfait':
        case 'Forfait annuel':
            return DAILY_RATE;
        default: 
            return 0;
    }
}

export const getDurationInDays = (item: DetailedService): number | null => {
    switch(item.unit) {
        case 'Journée':
        case 'Forfait':
            return item.quantity;
        case '1/2 journée': 
            return item.quantity * 0.5;
        case 'Réunion':
            return item.quantity * 0.25;
        case 'Forfait annuel':
            return null;
        default: 
            return 0;
    }
}

export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const SERVICES_TEMPLATE: Phase[] = [
  {
    id: 'refonte',
    title: 'PHASE 1 - REFONTE',
    items: [
      { id: '1.1', ref: '1.1', name: 'Réunion de lancement, réunion de projet', unit: 'Réunion', quantity: 4, active: false },
      { id: '1.2', ref: '1.2', name: 'Audit de la page d\'accueil du site internet et recommandations stratégiques, éditoriales et graphiques', unit: 'Forfait', quantity: 1, active: false },
      { id: '1.3', ref: '1.3', name: 'Gestion de projet, conseil, stratégie', unit: 'Journée', quantity: 3, active: false },
      { id: '1.4', ref: '1.4', name: 'Conception fonctionnelle', unit: 'Journée', quantity: 3, active: false },
      { id: '1.5', ref: '1.5', name: 'Conception et réalisation graphique', unit: 'Journée', quantity: 4, active: false },
    ]
  },
  {
    id: 'développement',
    title: 'PHASE 2 - DÉVELOPPEMENT',
    items: [
      { id: '2.1', ref: '2.1', name: 'Développements', unit: 'Journée', quantity: 4, active: false },
      { id: '2.2', ref: '2.2', name: 'Intégration, migration, tests, correction des bugs et mise en ligne', unit: 'Journée', quantity: 2, active: false },
    ]
  },
  {
    id: 'hébergement',
    title: 'PHASE 3 - HÉBERGEMENT',
    subtitle: 'pendant 1 ans',
    items: [
      { id: '3.1', ref: '3.1', name: 'Hébergement web', unit: 'Forfait annuel', quantity: 1, active: false, price: 200 },
      { id: '3.2', ref: '3.2', name: 'Infogérance du site', unit: 'Forfait annuel', quantity: 1, active: false },
      { id: '3.3', ref: '3.3', name: 'Prise en charge du nom de domaine', unit: 'Forfait annuel', quantity: 1, active: false, price: 50 },
    ]
  },
  {
    id: 'maintenance',
    title: 'PHASE 4 - MAINTENANCE ANNUELLE',
    items: [
      { id: '4.1', ref: '4.1', name: 'Reprise de l\'administration du site internet', unit: 'Forfait', quantity: 1, active: false },
      { id: '4.2', ref: '4.2', name: 'Audit et mise à niveau technique du site (mise à jour de la version WordPress et des extensions, correctifs)', unit: 'Forfait annuel', quantity: 1, active: false },
      { id: '4.3', ref: '4.3', name: 'Formation du personnel à l\'intégration et à la modification des contenus', unit: '1/2 journée', quantity: 2, active: false },
      { id: '4.4', ref: '4.4', name: 'Mise à jour éditoriale (publication de contenus à hauteur de 5 publications d\'articles + 5 publications)', unit: 'Forfait annuel', quantity: 1, active: false },
      { id: '4.5', ref: '4.5', name: 'Suivi statistique (rapport envoyé chaque début de mois)', unit: 'Forfait annuel', quantity: 1, active: false },
      { id: '4.6', ref: '4.6', name: 'Maintenance corrective (modification du site)', unit: '1/2 journée', quantity: 4, active: false },
      { id: '4.7', ref: '4.7', name: 'Audit environnemental du site et propositions de correctifs si nécessaire pour obtention d\'un label "site vert"', unit: 'Forfait', quantity: 1, active: false },
      { id: '4.8', ref: '4.8', name: 'Audit SEO (référencement naturel) du site et propositions de correctifs si nécessaire', unit: 'Forfait', quantity: 1, active: false },
    ]
  }
];