
export interface DetailedService {
  id: string;
  ref: string;
  name: string;
  unit: 'Réunion' | 'Forfait' | 'Journée' | '1/2 journée' | 'Forfait annuel';
  quantity: number;
  active: boolean;
  price?: number;
}

export interface Phase {
  id: string;
  title: string;
  items: DetailedService[];
  subtitle?: string;
}

export interface QuoteData {
  clientName: string;
  projectName: string;
  quoteNumber: string;
  date: string;
  phases: Phase[];
}