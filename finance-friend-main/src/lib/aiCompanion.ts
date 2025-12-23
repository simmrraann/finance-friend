import { Transaction, TransactionType } from '@/contexts/FinanceContext';
import { Character } from '@/contexts/AuthContext';
import { formatCurrencyINR } from './utils';

export interface FinancialAnalysis {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  balance: number;
  spendingRatio: number; // expenses / income (0-1+)
  savingsRate: number; // (income - expenses) / income
  topSpendingCategory: { name: string; amount: number } | null;
  recentTrend: 'improving' | 'declining' | 'stable' | 'unknown';
  isOverspending: boolean;
  lifestyleInflation: boolean;
}

export interface CompanionMessage {
  greeting: string;
  tip: string;
  weeklyInsight: string;
  tags: string[];
}

/**
 * Analyzes user's financial data to generate insights
 */
export function analyzeFinancialData(transactions: Transaction[]): FinancialAnalysis {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses - totalInvestments;
  const spendingRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0;
  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;

  // Find top spending category
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topSpendingCategory = Object.entries(categorySpending)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)[0] || null;

  // Analyze trends: compare recent transactions (last 30%) vs older ones
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const recentCount = Math.max(1, Math.floor(sortedTransactions.length * 0.3));
  const recentTransactions = sortedTransactions.slice(0, recentCount);
  const olderTransactions = sortedTransactions.slice(recentCount);

  const recentIncome = recentTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const recentExpenses = recentTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const olderIncome = olderTransactions.length > 0
    ? olderTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
    : recentIncome;
  const olderExpenses = olderTransactions.length > 0
    ? olderTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
    : recentExpenses;

  let recentTrend: 'improving' | 'declining' | 'stable' | 'unknown' = 'unknown';
  let lifestyleInflation = false;

  if (olderIncome > 0 && olderExpenses > 0) {
    const recentSavingsRate = recentIncome > 0 ? (recentIncome - recentExpenses) / recentIncome : 0;
    const olderSavingsRate = olderIncome > 0 ? (olderIncome - olderExpenses) / olderIncome : 0;
    
    if (recentSavingsRate > olderSavingsRate + 0.05) {
      recentTrend = 'improving';
    } else if (recentSavingsRate < olderSavingsRate - 0.05) {
      recentTrend = 'declining';
    } else {
      recentTrend = 'stable';
    }

    // Lifestyle inflation: income increased but expenses increased proportionally or more
    const incomeGrowth = (recentIncome - olderIncome) / olderIncome;
    const expenseGrowth = (recentExpenses - olderExpenses) / olderExpenses;
    lifestyleInflation = incomeGrowth > 0 && expenseGrowth > incomeGrowth * 0.8;
  }

  const isOverspending = totalExpenses > totalIncome;

  return {
    totalIncome,
    totalExpenses,
    totalInvestments,
    balance,
    spendingRatio,
    savingsRate,
    topSpendingCategory,
    recentTrend,
    isOverspending,
    lifestyleInflation,
  };
}

/**
 * Generates data-driven AI companion messages based on financial analysis
 */
export function generateCompanionMessage(
  analysis: FinancialAnalysis,
  character: Character,
  firstName: string
): CompanionMessage {
  const { 
    totalIncome, 
    totalExpenses, 
    balance, 
    spendingRatio, 
    savingsRate,
    topSpendingCategory,
    recentTrend,
    isOverspending,
    lifestyleInflation,
  } = analysis;

  const tags: string[] = [];
  let greeting = '';
  let tip = '';
  let weeklyInsight = '';

  // Handle case when user has no transactions yet
  if (totalIncome === 0 && totalExpenses === 0) {
    switch (character) {
      case 'spark':
        greeting = `Let's get started, ${firstName}! 🔥`;
        tip = `Start tracking your income and expenses to unlock personalized insights!`;
        weeklyInsight = `Add your first transaction to begin your financial journey. Track every rupee — awareness is the first step to financial freedom!`;
        tags.push('Getting started');
        return { greeting, tip, weeklyInsight, tags };
      case 'zen':
        greeting = `Welcome, ${firstName} 🌿`;
        tip = `Begin by adding your income and expenses. We'll help you understand your patterns.`;
        weeklyInsight = `Start tracking your finances today. Add your first income and expense entries, and we'll provide insights based on your actual data.`;
        tags.push('Getting started');
        return { greeting, tip, weeklyInsight, tags };
      case 'sage':
        greeting = `Ready to analyze, ${firstName} 📊`;
        tip = `No data yet. Add transactions to generate financial insights and recommendations.`;
        weeklyInsight = `To provide accurate analysis, please add your income and expense transactions. Once you have data, I'll analyze your spending patterns, savings rate, and provide actionable recommendations.`;
        tags.push('Getting started');
        return { greeting, tip, weeklyInsight, tags };
      default:
        greeting = `Welcome, ${firstName} 🌿`;
        tip = `Let's start tracking your finances together.`;
        weeklyInsight = `Begin by adding your income and expenses. We'll analyze your patterns and provide insights.`;
        tags.push('Getting started');
        return { greeting, tip, weeklyInsight, tags };
    }
  }

  // Determine tags based on analysis
  if (isOverspending) {
    tags.push('Overspending');
  } else if (savingsRate > 0.2) {
    tags.push('Strong savings');
  } else if (savingsRate > 0.1) {
    tags.push('Moderate savings');
  } else {
    tags.push('Low savings');
  }

  if (recentTrend === 'improving') {
    tags.push('Trending up');
  } else if (recentTrend === 'declining') {
    tags.push('Needs attention');
  }

  if (lifestyleInflation) {
    tags.push('Lifestyle inflation');
  }

  // Character-specific message generation
  switch (character) {
    case 'spark':
      // Energetic but honest
      if (isOverspending) {
        greeting = `Hey ${firstName}, we need to talk 🔥`;
        tip = `You're spending ${formatCurrencyINR(totalExpenses - totalIncome)} more than you earn. This isn't sustainable — let's fix this together!`;
        weeklyInsight = `Your expenses (${formatCurrencyINR(totalExpenses)}) exceed your income (${formatCurrencyINR(totalIncome)}) by ${formatCurrencyINR(totalExpenses - totalIncome)}. ${topSpendingCategory ? `Your biggest expense is ${topSpendingCategory.name} at ${formatCurrencyINR(topSpendingCategory.amount)}.` : ''} Start by cutting non-essential spending this week. You've got this! 💪`;
      } else if (lifestyleInflation) {
        greeting = `Good progress, ${firstName} ⚡`;
        tip = `Your income grew, but your spending grew even faster. That's lifestyle inflation — let's keep it in check!`;
        weeklyInsight = `While your income increased, your expenses rose proportionally. Your savings rate is ${(savingsRate * 100).toFixed(1)}%. ${topSpendingCategory ? `Watch out for ${topSpendingCategory.name} spending.` : ''} Try to save at least 20% of each income increase. Small changes compound!`;
      } else if (recentTrend === 'improving' && savingsRate > 0.15) {
        greeting = `You're crushing it, ${firstName}! 🔥`;
        tip = `Your savings rate is ${(savingsRate * 100).toFixed(1)}% — that's solid! Keep this momentum going!`;
        weeklyInsight = `Your financial habits are improving! You're saving ${formatCurrencyINR(balance)} and your spending ratio is ${(spendingRatio * 100).toFixed(1)}%. ${topSpendingCategory ? `Your top spending category is ${topSpendingCategory.name}.` : ''} Consistency is key — keep tracking every transaction!`;
      } else if (savingsRate > 0.1) {
        greeting = `Keep pushing, ${firstName} ⚡`;
        tip = `You're saving ${(savingsRate * 100).toFixed(1)}% — good start! Aim for 20% to build real wealth.`;
        weeklyInsight = `Your balance is ${formatCurrencyINR(balance)} with a ${(savingsRate * 100).toFixed(1)}% savings rate. ${topSpendingCategory ? `${topSpendingCategory.name} is your biggest expense at ${formatCurrencyINR(topSpendingCategory.amount)}.` : ''} Consider reviewing subscriptions or cutting one non-essential expense this week.`;
      } else {
        greeting = `Let's level up, ${firstName} 🔥`;
        tip = `Your savings rate is ${(savingsRate * 100).toFixed(1)}% — we can do better. Every rupee counts!`;
        weeklyInsight = `You're spending ${(spendingRatio * 100).toFixed(1)}% of your income. ${topSpendingCategory ? `Your top expense is ${topSpendingCategory.name} (${formatCurrencyINR(topSpendingCategory.amount)}).` : ''} Try to save at least 10% this month. Track every expense — awareness is the first step to change!`;
      }
      break;

    case 'zen':
      // Calm, supportive, gentle but honest
      if (isOverspending) {
        greeting = `Take a breath, ${firstName} 🌿`;
        tip = `You're spending more than you earn. Let's pause and create a plan together — no judgment, just clarity.`;
        weeklyInsight = `Your expenses (${formatCurrencyINR(totalExpenses)}) are ${formatCurrencyINR(totalExpenses - totalIncome)} higher than your income (${formatCurrencyINR(totalIncome)}). ${topSpendingCategory ? `Focus on reducing ${topSpendingCategory.name} spending first.` : ''} Start small: review your last week's expenses and identify one area to cut back. Financial wellness is a journey.`;
      } else if (lifestyleInflation) {
        greeting = `Noticing some patterns, ${firstName} 🌿`;
        tip = `As your income grows, your spending is growing too. That's natural, but let's be mindful about it.`;
        weeklyInsight = `Your income increased, but expenses rose alongside it. Your current savings rate is ${(savingsRate * 100).toFixed(1)}%. ${topSpendingCategory ? `Consider if ${topSpendingCategory.name} expenses are truly necessary.` : ''} Try the "save first" approach: set aside 20% before spending. Small shifts create big changes over time.`;
      } else if (recentTrend === 'improving' && savingsRate > 0.15) {
        greeting = `You're doing well, ${firstName} 🌿`;
        tip = `Your savings rate of ${(savingsRate * 100).toFixed(1)}% shows good financial discipline. Keep nurturing these habits.`;
        weeklyInsight = `Your balance is ${formatCurrencyINR(balance)} and you're saving ${(savingsRate * 100).toFixed(1)}% of your income. ${topSpendingCategory ? `Your spending is balanced, with ${topSpendingCategory.name} as your main category.` : ''} This consistency will compound over time. Remember: progress, not perfection.`;
      } else if (savingsRate > 0.1) {
        greeting = `Steady progress, ${firstName} 🌿`;
        tip = `You're saving ${(savingsRate * 100).toFixed(1)}% — that's a solid foundation. Consider gradually increasing it.`;
        weeklyInsight = `Your current balance is ${formatCurrencyINR(balance)} with a ${(savingsRate * 100).toFixed(1)}% savings rate. ${topSpendingCategory ? `Your largest expense category is ${topSpendingCategory.name}.` : ''} Review your spending mindfully this week. What brings value? What can be reduced?`;
      } else {
        greeting = `Let's find balance, ${firstName} 🌿`;
        tip = `Your savings rate is ${(savingsRate * 100).toFixed(1)}% — there's room to grow. Small, consistent changes work best.`;
        weeklyInsight = `You're spending ${(spendingRatio * 100).toFixed(1)}% of your income. ${topSpendingCategory ? `Your top spending category is ${topSpendingCategory.name} at ${formatCurrencyINR(topSpendingCategory.amount)}.` : ''} Start by tracking every expense this week. Awareness creates change. Aim for a 10% savings rate as your first milestone.`;
      }
      break;

    case 'sage':
      // Analytical, data-focused, direct but supportive
      if (isOverspending) {
        greeting = `Analysis complete, ${firstName} 📊`;
        tip = `Data shows you're overspending by ${formatCurrencyINR(totalExpenses - totalIncome)}. This is unsustainable — let's create a plan.`;
        weeklyInsight = `Financial analysis: Income ${formatCurrencyINR(totalIncome)}, Expenses ${formatCurrencyINR(totalExpenses)}, Deficit ${formatCurrencyINR(totalExpenses - totalIncome)}. Spending ratio: ${(spendingRatio * 100).toFixed(1)}%. ${topSpendingCategory ? `Top category: ${topSpendingCategory.name} (${formatCurrencyINR(topSpendingCategory.amount)}, ${((topSpendingCategory.amount / totalExpenses) * 100).toFixed(1)}% of expenses).` : ''} Recommendation: Reduce expenses by at least ${formatCurrencyINR((totalExpenses - totalIncome) * 1.1)} to break even, then aim for 20% savings rate.`;
      } else if (lifestyleInflation) {
        greeting = `Pattern detected, ${firstName} 📊`;
        tip = `Income growth: positive. Expense growth: exceeds income growth. This is lifestyle inflation — address it now.`;
        weeklyInsight = `Analysis: Savings rate ${(savingsRate * 100).toFixed(1)}%, Spending ratio ${(spendingRatio * 100).toFixed(1)}%. ${topSpendingCategory ? `Category breakdown shows ${topSpendingCategory.name} as ${((topSpendingCategory.amount / totalExpenses) * 100).toFixed(1)}% of expenses.` : ''} Recommendation: Cap spending growth at 50% of income growth. If income rises 10%, limit spending increase to 5%. This preserves savings rate.`;
      } else if (recentTrend === 'improving' && savingsRate > 0.15) {
        greeting = `Metrics look strong, ${firstName} 📊`;
        tip = `Savings rate: ${(savingsRate * 100).toFixed(1)}%. Balance: ${formatCurrencyINR(balance)}. Trend: Improving. Maintain this trajectory.`;
        weeklyInsight = `Financial metrics: Balance ${formatCurrencyINR(balance)}, Savings rate ${(savingsRate * 100).toFixed(1)}%, Spending ratio ${(spendingRatio * 100).toFixed(1)}%. ${topSpendingCategory ? `Category analysis: ${topSpendingCategory.name} represents ${((topSpendingCategory.amount / totalExpenses) * 100).toFixed(1)}% of expenses.` : ''} Your financial discipline is showing results. Continue tracking and aim to maintain or improve this savings rate.`;
      } else if (savingsRate > 0.1) {
        greeting = `Reviewing your data, ${firstName} 📊`;
        tip = `Current savings rate: ${(savingsRate * 100).toFixed(1)}%. Target: 20%. Gap analysis shows room for improvement.`;
        weeklyInsight = `Metrics: Balance ${formatCurrencyINR(balance)}, Savings rate ${(savingsRate * 100).toFixed(1)}%, Spending ${(spendingRatio * 100).toFixed(1)}% of income. ${topSpendingCategory ? `Top expense category: ${topSpendingCategory.name} (${formatCurrencyINR(topSpendingCategory.amount)}).` : ''} Analysis: To reach 20% savings rate, reduce expenses by ${formatCurrencyINR(totalIncome * 0.2 - balance)} or increase income proportionally. Review category spending for optimization opportunities.`;
      } else {
        greeting = `Data analysis, ${firstName} 📊`;
        tip = `Savings rate: ${(savingsRate * 100).toFixed(1)}%. This is below recommended 20%. Action required.`;
        weeklyInsight = `Financial overview: Income ${formatCurrencyINR(totalIncome)}, Expenses ${formatCurrencyINR(totalExpenses)}, Balance ${formatCurrencyINR(balance)}. Spending ratio: ${(spendingRatio * 100).toFixed(1)}%. ${topSpendingCategory ? `Category breakdown: ${topSpendingCategory.name} accounts for ${((topSpendingCategory.amount / totalExpenses) * 100).toFixed(1)}% of total expenses (${formatCurrencyINR(topSpendingCategory.amount)}).` : ''} Recommendation: Reduce spending by ${formatCurrencyINR(totalExpenses * 0.1)} to achieve 10% savings rate. Focus on top spending categories. Track every transaction for accurate analysis.`;
      }
      break;

    default:
      // Fallback for zen if character is null
      greeting = `Welcome, ${firstName} 🌿`;
      tip = `Let's start tracking your finances together.`;
      weeklyInsight = `Begin by adding your income and expenses. We'll analyze your patterns and provide insights.`;
  }

  return {
    greeting,
    tip,
    weeklyInsight,
    tags,
  };
}

