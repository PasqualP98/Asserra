
import { Asset, AssetType, FinancialGoal } from './types';

export const INITIAL_ASSETS: Asset[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    type: AssetType.STOCK,
    quantity: 15,
    purchasePrice: 150.25,
    currentPrice: 189.43,
    currency: 'USD',
    lastUpdated: '2023-11-20'
  },
  {
    id: '2',
    name: 'S&P 500 ETF',
    symbol: 'VOO',
    type: AssetType.ETF,
    quantity: 50,
    purchasePrice: 380.00,
    currentPrice: 425.12,
    currency: 'USD',
    lastUpdated: '2023-11-20'
  },
  {
    id: '3',
    name: 'Bitcoin',
    symbol: 'BTC',
    type: AssetType.CRYPTO,
    quantity: 0.45,
    purchasePrice: 28000,
    currentPrice: 43200,
    currency: 'USD',
    lastUpdated: '2023-11-20'
  },
  {
    id: '4',
    name: 'Mietwohnung Berlin',
    type: AssetType.REAL_ESTATE,
    quantity: 1,
    purchasePrice: 350000,
    currentPrice: 385000,
    currency: 'EUR',
    lastUpdated: '2023-10-01'
  },
  {
    id: '5',
    name: 'Hypothekendarlehen',
    type: AssetType.DEBT,
    quantity: 1,
    purchasePrice: 280000,
    currentPrice: 265000,
    currency: 'EUR',
    lastUpdated: '2023-11-01'
  }
];

export const INITIAL_GOALS: FinancialGoal[] = [
  {
    id: 'g1',
    name: 'Notgroschen',
    targetAmount: 20000,
    currentAmount: 12500,
    deadline: '2024-12-31',
    category: 'Safety'
  },
  {
    id: 'g2',
    name: 'Haus-Anzahlung',
    targetAmount: 100000,
    currentAmount: 45000,
    deadline: '2026-06-30',
    category: 'Estate'
  }
];
