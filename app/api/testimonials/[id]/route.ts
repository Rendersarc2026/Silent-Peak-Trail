import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.review.update({
    where: { id: parseInt(id) },
    data: {
      ...(body.name && { name: body.name, initial: body.name[0].toUpperCase() }),
      ...(body.place !== undefined && { place: body.place }),
      ...(body.packageName !== undefined && { packageName: body.packageName }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.message !== undefined && { message: body.message }),
      ...(body.isApproved !== undefined && { isApproved: body.isApproved }),
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await prisma.review.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ ok: true });
}
