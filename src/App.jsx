import { useState, useEffect } from 'react'
import Summary from './Summary'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import Charts from './Charts'
import Navbar from './components/Navbar'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { BarChart2, Table2 } from 'lucide-react'

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary",        amount: 5000, type: "income",  category: "salary",        date: "2025-01-01" },
    { id: 2, description: "Rent",          amount: 1200, type: "expense", category: "housing",       date: "2025-01-02" },
    { id: 3, description: "Groceries",     amount: 150,  type: "expense", category: "food",          date: "2025-01-03" },
    { id: 4, description: "Freelance Work",amount: 800,  type: "income",  category: "salary",        date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95,   type: "expense", category: "utilities",     date: "2025-01-06" },
    { id: 6, description: "Dinner Out",    amount: 65,   type: "expense", category: "food",          date: "2025-01-07" },
    { id: 7, description: "Gas",           amount: 45,   type: "expense", category: "transport",     date: "2025-01-08" },
    { id: 8, description: "Netflix",       amount: 15,   type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [activeTab,   setActiveTab]   = useState("dashboard");
  const [dashView,    setDashView]    = useState("table");    // "table" | "charts"

  const [isDark, setIsDark] = useState(
    () =>
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleAdd = (transaction) => {
    setTransactions([...transactions, transaction]);
    setActiveTab("dashboard");
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleDark={() => setIsDark(prev => !prev)}
      />
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "dashboard" ? (
          <>
            <Summary transactions={transactions} />

            {/* Table / Charts toggle */}
            <div className="flex items-center gap-1 mb-4">
              <Button
                variant={dashView === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setDashView("table")}
                className="gap-1.5"
              >
                <Table2 className="h-4 w-4" />
                Table
              </Button>
              <Button
                variant={dashView === "charts" ? "default" : "outline"}
                size="sm"
                onClick={() => setDashView("charts")}
                className="gap-1.5"
              >
                <BarChart2 className="h-4 w-4" />
                Charts
              </Button>
            </div>

            {dashView === "table" ? (
              <TransactionList transactions={transactions} onDelete={handleDelete} />
            ) : (
              <Charts transactions={transactions} />
            )}
          </>
        ) : (
          <div className="max-w-xl mx-auto">
            <TransactionForm onAdd={handleAdd} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App
