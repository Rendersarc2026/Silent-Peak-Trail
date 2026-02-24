import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const idInt = parseInt(id);
  if (isNaN(idInt)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: idInt },
      data: body
    });
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const idInt = parseInt(id);
  if (isNaN(idInt)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await prisma.enquiry.update({
      where: { id: idInt },
      data: { isActive: false }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Not found or delete failed" }, { status: 404 });
  }
}
