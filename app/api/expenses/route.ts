import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const expenses = await prisma.expenses.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(expenses);
  } catch (error) {
    console.error("GET /api/expenses error", error);
    return jsonError("Erreur lors du chargement des dépenses", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const amount = typeof body?.amount === "number" ? body.amount : Number(body?.amount);
    const categoryId = typeof body?.categoryId === "number" ? body.categoryId : parseInt(body?.categoryId, 10);

    if (!name) {
      return jsonError("Le nom de la dépense est requis", 400);
    }
    if (Number.isNaN(amount) || amount < 0) {
      return jsonError("Le montant doit être un nombre positif", 400);
    }
    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return jsonError("Une catégorie valide est requise", 400);
    }

    const expense = await prisma.expenses.create({
      data: { name, amount, categoryId },
      include: { category: true },
    });
    return NextResponse.json(expense);
  } catch (error) {
    console.error("POST /api/expenses error", error);
    return jsonError("Erreur lors de la création de la dépense", 500);
  }
}
