
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import type { UserData, Holding, Transaction, User, MarketItem } from '@/lib/types';
import { ALL_MARKET_ITEMS } from '@/lib/constants';

type Theme = 'dark' | 'light';

interface AppContextType {
  userData: UserData | null;
  isAuthenticated: boolean;
  theme: Theme;
  toggleTheme: () => void;
  login: (name: string, isNewUser: boolean) => Promise<boolean>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
  buyStock: (ticker: string, quantity: number, price: number) => Promise<boolean>;
  sellStock: (ticker: string, quantity: number, price: number) => Promise<boolean>;
  addMoney: (amount: number) => Promise<void>;
  getItemByTicker: (ticker: string) => MarketItem | undefined;
  addToWatchlist: (ticker: string) => Promise<void>;
  removeFromWatchlist: (ticker: string) => Promise<void>;
  isInWatchlist: (ticker: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  
  useEffect(() => {
    const storedTheme = localStorage.getItem('stockflow-theme') as Theme | null;
    const initialTheme = storedTheme || 'dark';
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('stockflow-theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
        return newTheme;
    });
  };
  
  const fetchUserData = useCallback(async (username: string) => {
    try {
      const response = await fetch(`/api/user/${username}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserData(null);
        localStorage.removeItem('stockflow-username');
      }
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setIsAuthenticated(false);
      setUserData(null);
    }
  }, []);
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('stockflow-username');
    if (storedUsername) {
      fetchUserData(storedUsername);
    }
  }, [fetchUserData]);

  const login = async (name: string, isNewUser: boolean): Promise<boolean> => {
    if (isNewUser) {
        const response = await fetch(`/api/user/${name}`, { method: 'POST' });
        if (response.ok) {
            const newUser = await response.json();
            setUserData(newUser);
            setIsAuthenticated(true);
            localStorage.setItem('stockflow-username', name);
            return true;
        } else {
             const data = await response.json();
             console.error("Signup failed:", data.message);
             return false;
        }
    } else {
        // Existing user login
        try {
            const response = await fetch(`/api/user/${name}`);
            if (response.ok) {
                const data = await response.json();
                setUserData(data);
                setIsAuthenticated(true);
                localStorage.setItem('stockflow-username', name);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    }
  };

  const logout = () => {
    setUserData(null);
    setIsAuthenticated(false);
    localStorage.removeItem('stockflow-username');
  };

  const updateUserData = async (updatedData: Partial<UserData>) => {
      if (!userData) return;
      
      const response = await fetch(`/api/user/${userData.user.name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
          throw new Error('Failed to update user data');
      }
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (userData) {
      const updatedUser = { ...userData.user, avatar: avatarUrl };
      setUserData({ ...userData, user: updatedUser });
      await updateUserData({ user: updatedUser });
    }
  };
  
  const createTransaction = (
    type: 'buy' | 'sell' | 'deposit',
    amount: number,
    ticker?: string,
    quantity?: number,
    price?: number
  ): Transaction => ({
    id: new Date().toISOString() + Math.random(),
    type,
    amount,
    ticker,
    quantity,
    price,
    date: new Date().toISOString(),
  });

  const buyStock = async (ticker: string, quantity: number, price: number): Promise<boolean> => {
    if (!userData) return false;
    const cost = quantity * price;
    if (userData.wallet < cost) {
      return false;
    }

    const newHoldings = [...userData.holdings];
    const holdingIndex = newHoldings.findIndex(h => h.ticker === ticker);

    if (holdingIndex > -1) {
      const existingHolding = newHoldings[holdingIndex];
      const totalQuantity = existingHolding.quantity + quantity;
      const totalCost = (existingHolding.avgBuyPrice * existingHolding.quantity) + cost;
      existingHolding.avgBuyPrice = totalCost / totalQuantity;
      existingHolding.quantity = totalQuantity;
    } else {
      newHoldings.push({ ticker, quantity, avgBuyPrice: price });
    }
    
    const transaction = createTransaction('buy', cost, ticker, quantity, price);
    const newWallet = userData.wallet - cost;
    const newTransactions = [transaction, ...userData.transactions];

    const updatedState = { ...userData, wallet: newWallet, holdings: newHoldings, transactions: newTransactions };
    setUserData(updatedState);
    await updateUserData({ wallet: newWallet, holdings: newHoldings, transactions: newTransactions });
    
    return true;
  };

  const sellStock = async (ticker: string, quantity: number, price: number): Promise<boolean> => {
    if (!userData) return false;
    
    const holdingIndex = userData.holdings.findIndex(h => h.ticker === ticker);
    if (holdingIndex === -1 || userData.holdings[holdingIndex].quantity < quantity) {
      return false;
    }

    const newHoldings = [...userData.holdings];
    const earning = quantity * price;

    newHoldings[holdingIndex].quantity -= quantity;
    if (newHoldings[holdingIndex].quantity === 0) {
      newHoldings.splice(holdingIndex, 1);
    }
    
    const transaction = createTransaction('sell', earning, ticker, quantity, price);
    const newWallet = userData.wallet + earning;
    const newTransactions = [transaction, ...userData.transactions];

    const updatedState = { ...userData, wallet: newWallet, holdings: newHoldings, transactions: newTransactions };
    setUserData(updatedState);
    await updateUserData({ wallet: newWallet, holdings: newHoldings, transactions: newTransactions });

    return true;
  };

  const addMoney = async (amount: number) => {
    if (userData && amount > 0) {
      const transaction = createTransaction('deposit', amount);
      const newWallet = userData.wallet + amount;
      const newTransactions = [transaction, ...userData.transactions];
      
      const updatedState = { ...userData, wallet: newWallet, transactions: newTransactions };
      setUserData(updatedState);
      await updateUserData({ wallet: newWallet, transactions: newTransactions });
    }
  };
  
  const getItemByTicker = (ticker: string): MarketItem | undefined => {
    return ALL_MARKET_ITEMS.find(item => item.ticker === ticker);
  };
  
  const isInWatchlist = (ticker: string): boolean => {
    return userData?.watchlist.includes(ticker) ?? false;
  }

  const addToWatchlist = async (ticker: string) => {
    if (userData && !isInWatchlist(ticker)) {
      const newWatchlist = [...userData.watchlist, ticker];
      setUserData({
        ...userData,
        watchlist: newWatchlist,
      });
      await updateUserData({ watchlist: newWatchlist });
    }
  };

  const removeFromWatchlist = async (ticker: string) => {
    if (userData && isInWatchlist(ticker)) {
      const newWatchlist = userData.watchlist.filter(t => t !== ticker);
      setUserData({
        ...userData,
        watchlist: newWatchlist,
      });
      await updateUserData({ watchlist: newWatchlist });
    }
  };

  return (
    <AppContext.Provider value={{ userData, isAuthenticated, theme, toggleTheme, login, logout, updateAvatar, buyStock, sellStock, addMoney, getItemByTicker, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
