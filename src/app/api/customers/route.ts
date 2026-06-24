import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, email, phone, preferredCategory, segment, totalSpend, totalOrders } = body;

    // Validation
    if (!name || !email || !phone || !preferredCategory || !segment) {
      return NextResponse.json(
        { error: "Name, email, phone, preferred category, and segment are required." },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const existing = await Customer.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: `Customer with email ${email} already exists.` },
        { status: 400 }
      );
    }

    const now = new Date();
    const newCustomer = new Customer({
      name,
      email,
      phone,
      preferredCategory,
      segment,
      totalSpend: Number(totalSpend) || 0,
      totalOrders: Number(totalOrders) || 0,
      firstPurchaseDate: now,
      lastPurchaseDate: now,
    });

    await newCustomer.save();

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer", details: error.message },
      { status: 500 }
    );
  }
}
