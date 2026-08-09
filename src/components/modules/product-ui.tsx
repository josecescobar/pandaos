import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Bot,
  Database,
  FolderKanban,
  LayoutGrid,
  MessageSquarePlus,
  Puzzle,
  Search,
  Sparkles,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tableRows = [
  { product: "Baseball Cap", brand: "Brand D", category: "Accessories", price: "$30", units: 28, revenue: "$840", discount: "8%" },
  { product: "Sneakers", brand: "Brand C", category: "Footwear", price: "$25", units: 22, revenue: "$550", discount: "6.8%" },
  { product: "Jacket", brand: "Brand E", category: "Clothing", price: "$30", units: 16, revenue: "$520", discount: "3%" },
  { product: "Women's Jeans", brand: "Brand B", category: "Clothing", price: "$25", units: 20, revenue: "$500", discount: "2%" },
  { product: "Men's T-shirt", brand: "Brand A", category: "Clothing", price: "$20", units: 18, revenue: "$360", discount: "3%" },
  { product: "Dress Shirt", brand: "Brand I", category: "Clothing", price: "$45", units: 4, revenue: "$180", discount: "15%" },
];

const chartData = [
  { name: "Baseball Cap", value: 840 },
  { name: "Sneakers", value: 550 },
  { name: "Jacket", value: 520 },
  { name: "Women's Jeans", value: 500 },
  { name: "Men's T-shirt", value: 360 },
  { name: "Dress Shirt", value: 180 },
  { name: "Backpack", value: 160 },
  { name: "Women's Dress", value: 140 },
];

const sql = `SELECT
  p.product_name,
  ROUND(SUM(t.total_amount), 2) AS total_revenue
FROM retail.products p
JOIN retail.transactions t
  ON p.product_id = t.product_id
GROUP BY p.product_name
ORDER BY total_revenue DESC
LIMIT 10`;

export function ProductUi({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--color-border-strong)] bg-[#eef1f6] shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#f7f8fb] px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-2 text-xs font-medium text-slate-500">
          PandaOS · Retail Analytics
        </div>
      </div>

      <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-[200px_1fr_280px]">
        <aside className="hidden border-r border-black/5 bg-white p-3 lg:block">
          <div className="mb-4 flex items-center gap-2 px-2 text-sm font-semibold text-slate-800">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[10px] text-white">
              P
            </span>
            PandaOS
          </div>
          <nav className="space-y-0.5 text-[13px] text-slate-600">
            {[
              [MessageSquarePlus, "New Chat"],
              [FolderKanban, "New Project"],
              [Bot, "Agents"],
              [Sparkles, "Skills"],
              [LayoutGrid, "Apps"],
              [Puzzle, "Integrations"],
            ].map(([Icon, label]) => (
              <div
                key={label as string}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label as string}
              </div>
            ))}
          </nav>
          <div className="mt-5 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Recents
          </div>
          <div className="mt-2 space-y-1 px-2 text-[12px] text-slate-500">
            <div className="truncate rounded-md bg-blue-50 px-2 py-1.5 text-blue-700">
              Dataset Questions for Database…
            </div>
            <div className="truncate px-2 py-1">Quarterly Revenue…</div>
            <div className="truncate px-2 py-1">Pipeline standup brief…</div>
          </div>
          <div className="mt-5 px-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Projects
          </div>
          <div className="mt-2 space-y-1 px-2 text-[12px]">
            <div className="text-emerald-600">horizon-health</div>
            <div className="font-medium text-slate-800">Retail Analytics</div>
            <div className="text-violet-600">northstar-ops</div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col bg-[#f8f9fc]">
          <div className="flex items-center gap-2 border-b border-black/5 px-4 py-2 text-xs text-slate-500">
            <Database className="h-3.5 w-3.5" />
            Retail Analytics
          </div>
          <div className="flex-1 space-y-4 overflow-auto p-4">
            <div className="ml-auto max-w-[90%] rounded-full bg-white px-4 py-2 text-sm text-slate-700 shadow-sm ring-1 ring-black/5">
              Show me the top 10 products by revenue, broken down by brand and
              category
            </div>

            <div className="rounded-[var(--radius-lg)] bg-white p-4 shadow-sm ring-1 ring-black/5">
              <div className="mb-3 text-sm font-semibold text-slate-800">
                Top 10 Products by Revenue
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="py-2 pr-2 font-medium">#</th>
                      <th className="py-2 pr-2 font-medium">Product</th>
                      <th className="py-2 pr-2 font-medium">Brand</th>
                      <th className="py-2 pr-2 font-medium">Category</th>
                      <th className="py-2 pr-2 font-medium">Unit Price</th>
                      <th className="py-2 pr-2 font-medium">Units</th>
                      <th className="py-2 pr-2 font-medium">Revenue</th>
                      <th className="py-2 font-medium">Avg Discount</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {tableRows.map((r, i) => (
                      <tr key={r.product} className="border-b border-slate-50">
                        <td className="py-1.5 pr-2 text-slate-400">{i + 1}</td>
                        <td className="py-1.5 pr-2 font-medium">{r.product}</td>
                        <td className="py-1.5 pr-2">{r.brand}</td>
                        <td className="py-1.5 pr-2">{r.category}</td>
                        <td className="py-1.5 pr-2">{r.price}</td>
                        <td className="py-1.5 pr-2">{r.units}</td>
                        <td className="py-1.5 pr-2">{r.revenue}</td>
                        <td className="py-1.5">{r.discount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-[var(--radius-md)] bg-slate-50 p-3 text-[12px] leading-relaxed text-slate-600">
                <div className="mb-1 font-semibold text-slate-800">
                  What stands out:
                </div>
                <ul className="list-disc space-y-1 pl-4">
                  <li>
                    Baseball Cap is the runaway #1 — $840 revenue, nearly 50% more
                    than #2.
                  </li>
                  <li>
                    Clear two-tier split — the top 5 each have 10+ transactions.
                  </li>
                  <li>Clothing dominates with 5 of the top 10 spots.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-black/5 bg-white p-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400">
              <Search className="h-3.5 w-3.5" />
              Type your message or / for commands…
              <span className="ml-auto flex items-center gap-2 text-slate-500">
                <Wrench className="h-3.5 w-3.5" />
                Agent
              </span>
            </div>
          </div>
        </section>

        <aside className="hidden border-l border-black/5 bg-white lg:flex lg:flex-col">
          <div className="flex items-center gap-2 border-b border-black/5 px-4 py-2 text-xs font-medium text-slate-600">
            <Database className="h-3.5 w-3.5" />
            Database
          </div>
          <div className="flex gap-3 border-b border-black/5 px-4 py-2 text-[11px] text-slate-400">
            <span>Explorer</span>
            <span className="font-semibold text-blue-600">Query</span>
            <span>History</span>
          </div>
          <pre className="flex-1 overflow-auto bg-[#f4f7ff] p-3 font-mono text-[10px] leading-relaxed text-slate-700">
            {sql}
          </pre>
          <div className="border-t border-black/5 p-3">
            <div className="mb-2 text-[11px] font-medium text-slate-500">
              Top 10 Products by Revenue
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Bar dataKey="value" fill="#7c6cf0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
