import { Moon, Sun, LayoutDashboard, PlusCircle } from "lucide-react"
import { Button } from "./ui/button"

function Navbar({ activeTab, setActiveTab, isDark, toggleDark }) {
  return (
    <nav className="sticky top-0 z-10 border-b bg-card">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-bold text-primary mr-4 text-base tracking-tight">
            Finance Tracker
          </span>
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("dashboard")}
            className="gap-1.5"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "add" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("add")}
            className="gap-1.5"
          >
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle theme">
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
