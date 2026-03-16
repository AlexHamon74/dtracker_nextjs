"use client";

import { useEffect, useState } from "react";
import Button from "../components/atoms/Button";
import Input from "../components/atoms/Input";
import Alert from "../components/atoms/Alert";
import Card from "../components/molecules/Card";

type Category = {
  id: number;
  name: string;
  _count?: { expenses: number };
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Create category form
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Create expense form
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategoryId, setExpenseCategoryId] = useState<number | "">("");
  const [creatingExpense, setCreatingExpense] = useState(false);

  // Edit category
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [updating, setUpdating] = useState(false);

  // Delete
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setCategories(data);
      if (data.length > 0 && expenseCategoryId === "") {
        setExpenseCategoryId(data[0].id);
      }
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
      });
      const contentType = res.headers.get("content-type") ?? "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : null;
      if (!res.ok) {
        throw new Error(data?.error ?? `Erreur (${res.status})`);
      }
      setNewName("");
      await fetchCategories();
      showSuccess("Catégorie créée avec succès !");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = expenseName.trim();
    const amount = Number(expenseAmount);
    const categoryId = expenseCategoryId === "" ? 0 : expenseCategoryId;
    if (!name || Number.isNaN(amount) || amount < 0 || !categoryId) {
      showError("Nom, montant positif et catégorie requis.");
      return;
    }
    setCreatingExpense(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount, categoryId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? `Erreur (${res.status})`);
      setExpenseName("");
      setExpenseAmount("");
      if (categories.length > 0) setExpenseCategoryId(categories[0].id);
      showSuccess("Dépense créée avec succès !");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setCreatingExpense(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEditingId(null);
      await fetchCategories();
      showSuccess("Catégorie mise à jour !");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await fetchCategories();
      showSuccess("Catégorie supprimée !");
    } catch (err: unknown) {
      showError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Catégories et dépenses
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez vos catégories et créez des dépenses
          </p>
        </div>

        {(error || success) && (
          <div className="mb-4">
            {error && <Alert variant="error">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
          </div>
        )}

        {/* Create expense */}
        <Card title="Créer une dépense" className="mb-6">
          <form onSubmit={handleCreateExpense} className="flex flex-col gap-4">
            <Input
              label="Nom"
              type="text"
              value={expenseName}
              onChange={(e) => setExpenseName(e.target.value)}
              placeholder="Nom de la dépense..."
              disabled={creatingExpense}
            />
            <Input
              label="Montant (€)"
              type="number"
              step="0.01"
              min="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              placeholder="0.00"
              disabled={creatingExpense}
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                value={expenseCategoryId}
                onChange={(e) =>
                  setExpenseCategoryId(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                disabled={creatingExpense || categories.length === 0}
              >
                {categories.length === 0 ? (
                  <option value="">Aucune catégorie</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <Button
              type="submit"
              disabled={
                creatingExpense ||
                !expenseName.trim() ||
                !expenseAmount ||
                Number(expenseAmount) < 0 ||
                categories.length === 0
              }
            >
              {creatingExpense ? "Création..." : "Ajouter la dépense"}
            </Button>
          </form>
        </Card>

        {/* Create category */}
        <Card title="Nouvelle catégorie" className="mb-6">
          <form onSubmit={handleCreateCategory} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom de la catégorie..."
                disabled={creating}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={creating || !newName.trim()}>
                {creating ? "Création..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </Card>

        {/* Categories list */}
        <Card
          title={
            <>
              Liste des catégories{" "}
              <span className="text-gray-400 font-normal text-sm">
                ({categories.length})
              </span>
            </>
          }
        >
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Chargement...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-sm">
              Aucune catégorie pour l&apos;instant.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 -mx-6">
              {categories.map((cat) => (
                <li key={cat.id} className="px-6 py-4 flex items-center gap-4">
                  {editingId === cat.id ? (
                    <div className="flex flex-1 items-center gap-3">
                      <Input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleUpdate(cat.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 border-blue-400"
                        disabled={updating}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdate(cat.id)}
                        disabled={updating || !editName.trim()}
                        className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        {updating ? "..." : "Enregistrer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800">
                          {cat.name}
                        </span>
                        {cat._count !== undefined && (
                          <span className="ml-2 text-xs text-gray-400">
                            {cat._count.expenses} dépense
                            {cat._count.expenses !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(cat)}
                          className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(cat.id)}
                          disabled={deletingId === cat.id}
                          className="text-sm text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                          {deletingId === cat.id ? "..." : "Supprimer"}
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
