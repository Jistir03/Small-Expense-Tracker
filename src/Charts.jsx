import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./components/ui/chart"

const CATEGORY_COLORS = {
  food:          "var(--color-chart-2)",
  housing:       "var(--color-chart-1)",
  utilities:     "var(--color-chart-3)",
  transport:     "var(--color-chart-4)",
  entertainment: "var(--color-chart-5)",
  salary:        "var(--color-chart-1)",
  other:         "var(--color-chart-3)",
}

function Charts({ transactions }) {
  // --- Donut: expense breakdown by category ---
  const expenseByCategory = Object.entries(
    transactions
      .filter(t => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})
  )
    .map(([category, amount]) => ({ category, amount }))
    .filter(d => d.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const donutConfig = Object.fromEntries(
    expenseByCategory.map((d, i) => [
      d.category,
      {
        label: d.category.charAt(0).toUpperCase() + d.category.slice(1),
        color: `var(--color-chart-${(i % 5) + 1})`,
      },
    ])
  )

  // --- Bar: income vs expenses by category ---
  const allCategories = [...new Set(transactions.map(t => t.category))]
  const barData = allCategories
    .map(cat => ({
      category: cat.charAt(0).toUpperCase() + cat.slice(1),
      income: transactions
        .filter(t => t.category === cat && t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
      expense: transactions
        .filter(t => t.category === cat && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    }))
    .filter(d => d.income > 0 || d.expense > 0)

  const barConfig = {
    income:  { label: "Income",   color: "var(--color-chart-1)" },
    expense: { label: "Expenses", color: "var(--color-chart-5)" },
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Donut – expense breakdown */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Expense Breakdown</CardTitle>
          <CardDescription className="text-xs">By category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={donutConfig} className="aspect-video">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="category"
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                }
              />
              <Pie
                data={expenseByCategory}
                dataKey="amount"
                nameKey="category"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {expenseByCategory.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={`var(--color-chart-${(index % 5) + 1})`}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="category" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bar – income vs expenses per category */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Income vs Expenses</CardTitle>
          <CardDescription className="text-xs">By category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={barConfig} className="aspect-video">
            <BarChart data={barData} barCategoryGap="30%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                tickFormatter={(v) => `$${v}`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => `$${value.toLocaleString()}`}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income"  fill="var(--color-chart-1)" radius={[4,4,0,0]} />
              <Bar dataKey="expense" fill="var(--color-chart-5)" radius={[4,4,0,0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Charts
