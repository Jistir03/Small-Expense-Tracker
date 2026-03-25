import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from './lib/supabase'
import Summary from './Summary'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import Charts from './Charts'
import Navbar from './components/Navbar'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { BarChart2, Table2 } from 'lucide-react'

function App() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTab, setActiveTab]       = useState("dashboard");
  const [dashView,  setDashView]        = useState("table");

  const [isDark, setIsDark] = useState(
    () =>
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  // Dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Load transactions from Supabase on mount
  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      if (error) {
        toast.error('Failed to load transactions', { description: error.message });
      } else {
        setTransactions(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleAdd = async (transaction) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        description: transaction.description,
        amount:      transaction.amount,
        type:        transaction.type,
        category:    transaction.category,
        date:        transaction.date,
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add transaction', { description: error.message });
      return;
    }

    setTransactions(prev => [data, ...prev]);
    setActiveTab("dashboard");
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete transaction', { description: error.message });
      return;
    }

    setTransactions(prev => prev.filter(t => t.id !== id));
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

            {loading ? (
              <p className="text-muted-foreground text-sm text-center py-12">
                Loading transactions…
              </p>
            ) : dashView === "table" ? (
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
