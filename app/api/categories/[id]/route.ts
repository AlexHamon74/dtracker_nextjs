import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const category = await prisma.categories.findUnique({
      where: { id },
      include: { expenses: true },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la catégorie" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const categoryId = parseInt(id);

    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Le nom de la catégorie est requis" },
        { status: 400 }
      );
    }

    const category = await prisma.categories.update({
      where: { id: categoryId },
      data: { name: name.trim() },
    });

    return NextResponse.json(category);
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la catégorie" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const categoryId = parseInt(id);

    await prisma.categories.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Catégorie supprimée" });

  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Catégorie introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}