"use client";

import { useEffect, useState } from "react";
import Card from "../components/molecules/Card";
import Alert from "../components/atoms/Alert";

type Expense = {
  id: number;
  name: string;
  amount: number;
  categoryId: number;
  createdAt: string;
  category: { id: number; name: string };
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/expenses");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setExpenses(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes dépenses</h1>
          <p className="text-gray-500 mt-1">Liste de vos dépenses</p>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        <Card
          title={
            <>
              Liste des dépenses{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({expenses.length})
              </span>
            </>
          }
        >
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Chargement...
            </div>
          ) : expenses.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Aucune dépense pour l&apos;instant.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {expenses.map((exp) => (
                <li
                  key={exp.id}
                  className="py-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {exp.name}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {exp.category.name}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {exp.amount.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
