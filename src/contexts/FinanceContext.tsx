import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { transactionStorage } from '@/lib/storage';

export type TransactionType = 'income' | 'expense' | 'investment';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

interface FinanceContextType {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  getTotalIncome: () => number;
  getTotalExpenses: () => number;
  getTotalInvestments: () => number;
  getBalance: () => number;
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Salary', type: 'income', icon: '💼', color: 'hsl(217, 91%, 50%)' },
  { id: '2', name: 'Freelance', type: 'income', icon: '💻', color: 'hsl(199, 89%, 48%)' },
  { id: '3', name: 'Gifts', type: 'income', icon: '🎁', color: 'hsl(186, 80%, 45%)' },
  { id: '4', name: 'Food & Dining', type: 'expense', icon: '🍔', color: 'hsl(0, 72%, 51%)' },
  { id: '5', name: 'Shopping', type: 'expense', icon: '🛍️', color: 'hsl(250, 60%, 55%)' },
  { id: '6', name: 'Transport', type: 'expense', icon: '🚗', color: 'hsl(38, 92%, 50%)' },
  { id: '7', name: 'Entertainment', type: 'expense', icon: '🎬', color: 'hsl(280, 70%, 55%)' },
  { id: '8', name: 'Bills', type: 'expense', icon: '📄', color: 'hsl(217, 60%, 50%)' },
  { id: '9', name: 'Health', type: 'expense', icon: '💊', color: 'hsl(340, 70%, 55%)' },
  { id: '10', name: 'Stocks', type: 'investment', icon: '📈', color: 'hsl(217, 91%, 50%)' },
  { id: '11', name: 'Crypto', type: 'investment', icon: '₿', color: 'hsl(38, 92%, 50%)' },
  { id: '12', name: 'Mutual Funds', type: 'investment', icon: '📊', color: 'hsl(199, 89%, 48%)' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Load transactions for current user when user changes
  useEffect(() => {
    if (user?.email) {
      const userTransactions = transactionStorage.getTransactions(user.email);
      setTransactions(userTransactions);
    } else {
      // Clear transactions when logged out
      setTransactions([]);
    }
  }, [user?.email]);

  // Persist transactions whenever they change (for current user)
  useEffect(() => {
    if (user?.email && transactions.length >= 0) {
      transactionStorage.setTransactions(user.email, transactions);
    }
  }, [transactions, user?.email]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    if (!user?.email) {
      console.warn('Cannot add transaction: user not logged in');
      return;
    }
    const newTransaction = {
      ...transaction,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    if (!user?.email) {
      console.warn('Cannot delete transaction: user not logged in');
      return;
    }
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    if (!user?.email) {
      console.warn('Cannot update transaction: user not logged in');
      return;
    }
    setTransactions(prev =>
      prev.map(t => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const getTotalIncome = () =>
    transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

  const getTotalExpenses = () =>
    transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

  const getTotalInvestments = () =>
    transactions
      .filter(t => t.type === 'investment')
      .reduce((sum, t) => sum + t.amount, 0);

  const getBalance = () => getTotalIncome() - getTotalExpenses() - getTotalInvestments();

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      addTransaction,
      deleteTransaction,
      updateTransaction,
      addCategory,
      getTotalIncome,
      getTotalExpenses,
      getTotalInvestments,
      getBalance,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
