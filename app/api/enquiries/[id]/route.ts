import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Enquiry from "@/lib/models/Enquiry";
import mongoose from "mongoose";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await dbConnect();
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );
    return NextResponse.json(enquiry);
  } catch (error) {
    return NextResponse.json({ error: "Not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await getSession()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  try {
    await dbConnect();
    await Enquiry.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Not found or delete failed" }, { status: 404 });
  }
}
