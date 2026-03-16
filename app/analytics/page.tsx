"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Expense = {
  id: number;
  name: string;
  amount: number;
  categoryId: number;
  createdAt: string;
  category: { id: number; name: string };
};

function aggregateByCategory(expenses: Expense[]): { label: string; total: number }[] {
  const byCategory = new Map<string, number>();
  for (const e of expenses) {
    const name = e.category.name;
    byCategory.set(name, (byCategory.get(name) ?? 0) + e.amount);
  }
  return Array.from(byCategory.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total);
}

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchExpenses() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/expenses");
        if (!res.ok) throw new Error("Erreur lors du chargement des dépenses");
        const data = await res.json();
        if (!cancelled) setExpenses(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchExpenses();
    return () => { cancelled = true; };
  }, []);

  const chartData = useMemo(() => {
    const aggregated = aggregateByCategory(expenses);
    return {
      labels: aggregated.map((a) => a.label),
      datasets: [
        {
          label: "Total par catégorie (€)",
          data: aggregated.map((a) => Math.round(a.total * 100) / 100),
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          borderRadius: 8,
        },
      ],
    };
  }, [expenses]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Dépenses par catégorie (données en base)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => value + " €",
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-1">Analytics</h1>
        <p className="text-gray-600 max-w-xl">
          Graphique des dépenses agrégées par catégorie, à partir des données en base.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        {loading ? (
          <div className="h-80 flex items-center justify-center text-gray-400 text-sm">
            Chargement…
          </div>
        ) : expenses.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
            Aucune dépense en base. Ajoutez des dépenses dans Catégories pour voir le graphique.
          </div>
        ) : chartData.labels.length === 0 ? (
          <div className="h-80 flex items-center justify-center text-gray-500 text-sm">
            Aucune catégorie associée aux dépenses.
          </div>
        ) : (
          <div className="h-80">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
