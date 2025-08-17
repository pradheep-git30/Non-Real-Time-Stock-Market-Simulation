import type { Stock, Etf } from './types';

const generateChartData = (base: number) => {
  let data = [];
  let value = base;
  // A simple pseudo-random generator to ensure server and client have the same initial data
  const pseudoRandom = (seed: number) => {
      let x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
  };
  for (let i = 0; i < 30; i++) {
    // Increased volatility for more noticeable chart lines
    value += value * (pseudoRandom(base + i) - 0.49) * 0.1;
    // Set tighter bounds to prevent extreme flat lines at min/max
    value = Math.max(value, base * 0.95);
    value = Math.min(value, base * 1.05);
    data.push({ price: parseFloat(value.toFixed(2)) });
  }
  return data;
};


export const STOCKS: Stock[] = [
  { id: '1', ticker: 'RELIANCE', name: 'Reliance Industries', domain: 'ril.com', price: 2950.50, change: 30.25, changePercent: 1.04, marketCap: 20e12, high52w: 3100, low52w: 2200, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(2950.50) },
  { id: '2', ticker: 'TCS', name: 'Tata Consultancy', domain: 'tcs.com', price: 3850.75, change: -15.50, changePercent: -0.40, marketCap: 14e12, high52w: 4200, low52w: 3000, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(3850.75) },
  { id: '3', ticker: 'HDFCBANK', name: 'HDFC Bank', domain: 'hdfcbank.com', price: 1530.00, change: 5.80, changePercent: 0.38, marketCap: 11.5e12, high52w: 1750, low52w: 1350, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1530.00) },
  { id: '4', ticker: 'INFY', name: 'Infosys', domain: 'infosys.com', price: 1620.40, change: 22.10, changePercent: 1.38, marketCap: 6.7e12, high52w: 1800, low52w: 1250, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(1620.40) },
  { id: '5', ticker: 'ICICIBANK', name: 'ICICI Bank', domain: 'icicibank.com', price: 1105.90, change: -8.75, changePercent: -0.78, marketCap: 7.7e12, high52w: 1200, low52w: 850, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1105.90) },
  { id: '6', ticker: 'HINDUNILVR', name: 'Hindustan Unilever', domain: 'hul.co.in', price: 2340.10, change: 18.00, changePercent: 0.77, marketCap: 5.5e12, high52w: 2700, low52w: 2200, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(2340.10) },
  { id: '7', ticker: 'SBIN', name: 'State Bank of India', domain: 'sbi.co.in', price: 830.25, change: 12.50, changePercent: 1.53, marketCap: 7.4e12, high52w: 900, low52w: 550, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(830.25) },
  { id: '8', ticker: 'BHARTIARTL', name: 'Bharti Airtel', domain: 'airtel.in', price: 1395.00, change: -5.00, changePercent: -0.36, marketCap: 8.3e12, high52w: 1450, low52w: 800, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(1395.00) },
  { id: '9', ticker: 'ITC', name: 'ITC Ltd.', domain: 'itcportal.com', price: 430.80, change: 2.10, changePercent: 0.49, marketCap: 5.3e12, high52w: 500, low52w: 380, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(430.80) },
  { id: '10', ticker: 'LICI', name: 'Life Insurance Corp', domain: 'licindia.in', price: 980.00, change: 15.60, changePercent: 1.62, marketCap: 6.2e12, high52w: 1100, low52w: 750, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(980.00) },
  { id: '11', ticker: 'KOTAKBANK', name: 'Kotak Mahindra Bank', domain: 'kotak.com', price: 1775.30, change: -20.00, changePercent: -1.11, marketCap: 3.5e12, high52w: 2000, low52w: 1600, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1775.30) },
  { id: '12', ticker: 'HCLTECH', name: 'HCL Technologies', domain: 'hcltech.com', price: 1440.00, change: 8.90, changePercent: 0.62, marketCap: 3.9e12, high52w: 1650, low52w: 1000, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(1440.00) },
  { id: '13', ticker: 'TATAMOTORS', name: 'Tata Motors', domain: 'tatamotors.com', price: 975.50, change: 25.10, changePercent: 2.64, marketCap: 3.2e12, high52w: 1050, low52w: 450, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(975.50) },
  { id: '14', ticker: 'MARUTI', name: 'Maruti Suzuki India', domain: 'marutisuzuki.com', price: 12500.00, change: -110.00, changePercent: -0.87, marketCap: 4.1e12, high52w: 13000, low52w: 8000, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(12500.00) },
  { id: '15', ticker: 'SUNPHARMA', name: 'Sun Pharmaceutical', domain: 'sunpharma.com', price: 1625.00, change: 35.70, changePercent: 2.25, marketCap: 3.9e12, high52w: 1700, low52w: 950, category: 'Health', type: 'Stock', day_chart_data: generateChartData(1625.00) },
  { id: '16', ticker: 'WIPRO', name: 'Wipro Ltd.', domain: 'wipro.com', price: 490.20, change: 3.00, changePercent: 0.62, marketCap: 2.5e12, high52w: 550, low52w: 380, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(490.20) },
  { id: '17', ticker: 'ADANIENT', name: 'Adani Enterprises', domain: 'adani.com', price: 3250.00, change: 80.00, changePercent: 2.52, marketCap: 3.7e12, high52w: 3800, low52w: 1500, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(3250.00) },
  { id: '18', ticker: 'AXISBANK', name: 'Axis Bank', domain: 'axisbank.com', price: 1220.80, change: -12.40, changePercent: -1.01, marketCap: 3.7e12, high52w: 1300, low52w: 850, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1220.80) },
  { id: '19', ticker: 'BAJFINANCE', name: 'Bajaj Finance', domain: 'bajajfinserv.in', price: 7100.00, change: 150.00, changePercent: 2.16, marketCap: 4.4e12, high52w: 8200, low52w: 6000, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(7100.00) },
  { id: '20', ticker: 'ASIANPAINT', name: 'Asian Paints', domain: 'asianpaints.com', price: 2880.20, change: -25.00, changePercent: -0.86, marketCap: 2.7e12, high52w: 3500, low52w: 2700, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(2880.20) },
  { id: '21', ticker: 'NTPC', name: 'NTPC Ltd.', domain: 'ntpc.co.in', price: 360.50, change: 4.80, changePercent: 1.35, marketCap: 3.5e12, high52w: 400, low52w: 160, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(360.50) },
  { id: '22', ticker: 'JSWSTEEL', name: 'JSW Steel', domain: 'jsw.in', price: 935.00, change: 12.15, changePercent: 1.32, marketCap: 2.3e12, high52w: 1000, low52w: 650, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(935.00) },
  { id: '23', ticker: 'POWERGRID', name: 'Power Grid Corp', domain: 'powergrid.in', price: 325.00, change: 7.90, changePercent: 2.49, marketCap: 3e12, high52w: 350, low52w: 180, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(325.00) },
  { id: '24', ticker: 'ULTRACEMCO', name: 'UltraTech Cement', domain: 'ultratechcement.com', price: 10800.00, change: -200.00, changePercent: -1.82, marketCap: 3.1e12, high52w: 11500, low52w: 7000, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(10800.00) },
  { id: '25', ticker: 'ONGC', name: 'ONGC', domain: 'ongcindia.com', price: 270.00, change: 3.50, changePercent: 1.31, marketCap: 3.4e12, high52w: 300, low52w: 150, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(270.00) },
  { id: '26', ticker: 'NESTLEIND', name: 'Nestle India', domain: 'nestle.in', price: 2550.00, change: -12.00, changePercent: -0.47, marketCap: 2.4e12, high52w: 2700, low52w: 2100, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(2550.00) },
  { id: '27', ticker: 'COALINDIA', name: 'Coal India', domain: 'coalindia.in', price: 475.00, change: 8.20, changePercent: 1.76, marketCap: 2.9e12, high52w: 500, low52w: 220, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(475.00) },
  { id: '28', ticker: 'IOC', name: 'Indian Oil Corp.', domain: 'iocl.com', price: 165.70, change: 2.50, changePercent: 1.53, marketCap: 2.3e12, high52w: 190, low52w: 85, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(165.70) },
  { id: '29', ticker: 'DRREDDY', name: 'Dr. Reddy\'s Labs', domain: 'drreddys.com', price: 6200.00, change: -45.00, changePercent: -0.72, marketCap: 1e12, high52w: 6500, low52w: 4200, category: 'Health', type: 'Stock', day_chart_data: generateChartData(6200.00) },
  { id: '30', ticker: 'CIPLA', name: 'Cipla', domain: 'cipla.com', price: 1530.50, change: 18.90, changePercent: 1.25, marketCap: 1.2e12, high52w: 1600, low52w: 900, category: 'Health', type: 'Stock', day_chart_data: generateChartData(1530.50) },
  { id: '31', ticker: 'ZOMATO', name: 'Zomato Ltd', domain: 'zomato.com', price: 190.20, change: 5.50, changePercent: 2.98, marketCap: 1.7e12, high52w: 210, low52w: 50, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(190.20) },
  { id: '32', ticker: 'PAYTM', name: 'One97 Communications', domain: 'paytm.com', price: 410.00, change: -10.80, changePercent: -2.57, marketCap: 0.26e12, high52w: 900, low52w: 300, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(410.00) },
  { id: '38', ticker: 'LT', name: 'Larsen & Toubro', domain: 'larsentoubro.com', price: 3590.00, change: 45.00, changePercent: 1.27, marketCap: 4.95e12, high52w: 3948, low52w: 2136, category: 'Infra', type: 'Stock', day_chart_data: generateChartData(3590.00) },
  { id: '39', ticker: 'BAJAJFINSV', name: 'Bajaj Finserv', domain: 'bajajfinserv.in', price: 1585.00, change: 20.00, changePercent: 1.28, marketCap: 2.52e12, high52w: 1741, low52w: 1292, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1585.00) },
  { id: '40', ticker: 'M&M', name: 'Mahindra & Mahindra', domain: 'mahindra.com', price: 2915.00, change: 30.00, changePercent: 1.04, marketCap: 3.62e12, high52w: 3013, low52w: 1243, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(2915.00) },
  { id: '41', ticker: 'TITAN', name: 'Titan Company', domain: 'titancompany.in', price: 3410.00, change: -15.00, changePercent: -0.44, marketCap: 3.03e12, high52w: 3885, low52w: 2882, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(3410.00) },
  { id: '42', ticker: 'HINDALCO', name: 'Hindalco Industries', domain: 'hindalco.com', price: 685.00, change: 10.00, changePercent: 1.48, marketCap: 1.54e12, high52w: 714, low52w: 381, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(685.00) },
  { id: '43', ticker: 'TECHM', name: 'Tech Mahindra', domain: 'techmahindra.com', price: 1400.00, change: 5.00, changePercent: 0.36, marketCap: 1.37e12, high52w: 1449, low52w: 987, category: 'Tech', type: 'Stock', day_chart_data: generateChartData(1400.00) },
  { id: '44', ticker: 'BRITANNIA', name: 'Britannia Industries', domain: 'britannia.co.in', price: 5320.00, change: 25.00, changePercent: 0.47, marketCap: 1.28e12, high52w: 5725, low52w: 4341, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(5320.00) },
  { id: '45', ticker: 'INDUSINDBK', name: 'IndusInd Bank', domain: 'indusind.com', price: 1490.00, change: -10.00, changePercent: -0.67, marketCap: 1.16e12, high52w: 1694, low52w: 1067, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1490.00) },
  { id: '46', ticker: 'GRASIM', name: 'Grasim Industries', domain: 'grasim.com', price: 2510.00, change: 30.00, changePercent: 1.21, marketCap: 1.66e12, high52w: 2530, low52w: 1568, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(2510.00) },
  { id: '47', ticker: 'ADANIPORTS', name: 'Adani Ports', domain: 'adaniports.com', price: 1450.00, change: 20.00, changePercent: 1.40, marketCap: 3.13e12, high52w: 1621, low52w: 659, category: 'Infra', type: 'Stock', day_chart_data: generateChartData(1450.00) },
  { id: '48', ticker: 'EICHERMOT', name: 'Eicher Motors', domain: 'eichermotors.com', price: 4780.00, change: -20.00, changePercent: -0.42, marketCap: 1.31e12, high52w: 5198, low52w: 3156, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(4780.00) },
  { id: '49', ticker: 'SBILIFE', name: 'SBI Life Insurance', domain: 'sbilife.co.in', price: 1450.00, change: 10.00, changePercent: 0.69, marketCap: 1.45e12, high52w: 1569, low52w: 1202, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(1450.00) },
  { id: '50', ticker: 'BPCL', name: 'Bharat Petroleum', domain: 'bharatpetroleum.in', price: 305.00, change: 5.00, changePercent: 1.67, marketCap: 1.32e12, high52w: 687, low52w: 300, category: 'Energy', type: 'Stock', day_chart_data: generateChartData(305.00) },
  { id: '51', ticker: 'HDFCLIFE', name: 'HDFC Life Insurance', domain: 'hdfclife.com', price: 580.00, change: -3.00, changePercent: -0.51, marketCap: 1.25e12, high52w: 710, low52w: 510, category: 'Finance', type: 'Stock', day_chart_data: generateChartData(580.00) },
  { id: '52', ticker: 'DIVISLAB', name: 'Divi\'s Laboratories', domain: 'divislabs.com', price: 4520.00, change: 50.00, changePercent: 1.12, marketCap: 1.2e12, high52w: 4610, low52w: 3290, category: 'Health', type: 'Stock', day_chart_data: generateChartData(4520.00) },
  { id: '53', ticker: 'TATACONSUM', name: 'Tata Consumer Products', domain: 'tataconsumer.com', price: 1100.00, change: -8.00, changePercent: -0.72, marketCap: 1.04e12, high52w: 1269, low52w: 792, category: 'Consumer', type: 'Stock', day_chart_data: generateChartData(1100.00) },
  { id: '54', ticker: 'APOLLOHOSP', name: 'Apollo Hospitals', domain: 'apollohospitals.com', price: 6200.00, change: 30.00, changePercent: 0.49, marketCap: 0.89e12, high52w: 6874, low52w: 4552, category: 'Health', type: 'Stock', day_chart_data: generateChartData(6200.00) },
  { id: '55', ticker: 'UPL', name: 'UPL Ltd.', domain: 'upl-ltd.com', price: 570.00, change: 12.00, changePercent: 2.15, marketCap: 0.43e12, high52w: 748, low52w: 446, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(570.00) },
  { id: '56', ticker: 'HEROMOTOCO', name: 'Hero MotoCorp', domain: 'heromotocorp.com', price: 5500.00, change: -50.00, changePercent: -0.90, marketCap: 1.1e12, high52w: 5900, low52w: 2850, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(5500.00) },
  { id: '57', ticker: 'SHREECEM', name: 'Shree Cement', domain: 'shreecement.com', price: 27100.00, change: 200.00, changePercent: 0.74, marketCap: 0.98e12, high52w: 30438, low52w: 22611, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(27100.00) },
  { id: '58', ticker: 'BAJAJ-AUTO', name: 'Bajaj Auto', domain: 'bajajauto.com', price: 9650.00, change: -100.00, changePercent: -1.03, marketCap: 2.7e12, high52w: 10037, low52w: 4541, category: 'Auto', type: 'Stock', day_chart_data: generateChartData(9650.00) },
  { id: '59', ticker: 'TATASTEEL', name: 'Tata Steel', domain: 'tatasteel.com', price: 175.00, change: 3.00, changePercent: 1.74, marketCap: 2.18e12, high52w: 184, low52w: 108, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(175.00) },
  { id: '60', ticker: 'PIDILITIND', name: 'Pidilite Industries', domain: 'pidilite.com', price: 3120.00, change: 10.00, changePercent: 0.32, marketCap: 1.59e12, high52w: 3177, low52w: 2284, category: 'Materials', type: 'Stock', day_chart_data: generateChartData(3120.00) }
];


export const ETFS: Etf[] = [
  { id: '33', ticker: 'NIFTYBEES', name: 'Nifty 50 ETF', domain: 'nipponindiaim.com', price: 250.50, change: 1.80, changePercent: 0.72, category: 'Index', type: 'ETF', day_chart_data: generateChartData(250.50) },
  { id: '34', ticker: 'BANKBEES', name: 'Nifty Bank ETF', domain: 'nipponindiaim.com', price: 450.70, change: 3.10, changePercent: 0.69, category: 'Sector', type: 'ETF', day_chart_data: generateChartData(450.70) },
  { id: '35', ticker: 'GOLDBEES', name: 'Gold ETF', domain: 'nipponindiaim.com', price: 62.00, change: 0.50, changePercent: 0.81, category: 'Commodity', type: 'ETF', day_chart_data: generateChartData(62.00) },
  { id: '36', ticker: 'ITBEES', name: 'Nifty IT ETF', domain: 'nipponindiaim.com', price: 36.80, change: -0.40, changePercent: -1.08, category: 'Sector', type: 'ETF', day_chart_data: generateChartData(36.80) },
  { id: '37', ticker: 'SILVERBEES', name: 'Silver ETF', domain: 'nipponindiaim.com', price: 92.30, change: 1.50, changePercent: 1.65, category: 'Commodity', type: 'ETF', day_chart_data: generateChartData(92.30) },
  { id: '61', ticker: 'PHARMABEES', name: 'Nifty Pharma ETF', domain: 'nipponindiaim.com', price: 20.40, change: 0.30, changePercent: 1.49, category: 'Sector', type: 'ETF', day_chart_data: generateChartData(20.40) },
  { id: '62', ticker: 'CPSEETF', name: 'CPSE ETF', domain: 'nipponindiaim.com', price: 93.80, change: 2.10, changePercent: 2.29, category: 'Thematic', type: 'ETF', day_chart_data: generateChartData(93.80) },
  { id: '63', ticker: 'MON100', name: 'Motilal Oswal Nasdaq 100 ETF', domain: 'motilaloswalmf.com', price: 165.20, change: -1.50, changePercent: -0.90, category: 'International', type: 'ETF', day_chart_data: generateChartData(165.20) }
];


export const ALL_MARKET_ITEMS = [...STOCKS, ...ETFS];
