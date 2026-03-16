import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const categories = await prisma.categories.findMany();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const category = await prisma.categories.create({ data: { name } });
  return NextResponse.json(category);
}
