import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, phone, address, city, state, zip } = body;

    // Required field validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "First name, last name, email, and password are required." },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }
    if (password.length > 40) {
      return NextResponse.json(
        { error: "Password must be 40 characters or fewer." },
        { status: 400 },
      );
    }
    if (!/\d/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one number." },
        { status: 400 },
      );
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain at least one symbol." },
        { status: 400 },
      );
    }

    // Check for existing user
    const { data: existingUser } = await supabase
      .from("cmr_users")
      .select("id, password_hash, provider")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (existingUser) {
      if (existingUser.password_hash) {
        return NextResponse.json(
          { error: "An account with this email already exists. Sign in instead." },
          { status: 409 },
        );
      }
      // OAuth user trying to create credentials account
      return NextResponse.json(
        {
          error: `This email is registered via ${existingUser.provider ?? "OAuth"}. Sign in with your existing provider.`,
        },
        { status: 409 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert new user
    const { error: insertError } = await supabase.from("cmr_users").insert({
      email: email.trim().toLowerCase(),
      name: `${firstName.trim()} ${lastName.trim()}`,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      password_hash: passwordHash,
      phone: phone?.trim() || null,
      address_line1: address?.trim() || null,
      city: city?.trim() || null,
      state: state?.trim() || null,
      zip: zip?.trim() || null,
      provider: "credentials",
      tier: "free",
      curations_this_month: 0,
      current_period_start: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Signup insert error:", insertError);
      return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
