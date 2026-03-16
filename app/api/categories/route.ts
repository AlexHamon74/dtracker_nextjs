import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  try {
    const categories = await prisma.categories.findMany();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error", error);
    return jsonError("Erreur lors du chargement des catégories", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    if (!name) {
      return jsonError("Le nom de la catégorie est requis", 400);
    }

    const category = await prisma.categories.create({ data: { name } });
    return NextResponse.json(category);
  } catch (error) {
    console.error("POST /api/categories error", error);
    return jsonError("Erreur lors de la création de la catégorie", 500);
  }
}
