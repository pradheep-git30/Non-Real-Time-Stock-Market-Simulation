export interface Stock {
  id: string;
  ticker: string;
  name: string;
  domain: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  high52w: number;
  low52w: number;
  category: 'Tech' | 'Health' | 'Finance' | 'Energy' | 'Consumer' | 'Auto' | 'Materials' | 'Infra';
  type: 'Stock';
  day_chart_data: { price: number }[];
}

export interface Etf {
  id: string;
  ticker: string;
  name:string;
  domain: string;
  price: number;
  change: number;
  changePercent: number;
  category: 'Index' | 'Commodity' | 'Sector' | 'Thematic' | 'International';
  type: 'ETF';
  day_chart_data: { price: number }[];
}

export type MarketItem = Stock | Etf;

export interface Holding {
  ticker: string;
  quantity: number;
  avgBuyPrice: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'deposit';
  ticker?: string;
  quantity?: number;
  price?: number;
  amount: number;
  date: string;
}

export interface User {
  name: string;
  avatar: string; // This will now store a data URI for the generated image
}

export interface UserData {
  user: User;
  wallet: number;
  holdings: Holding[];
  transactions: Transaction[];
  watchlist: string[];
}
