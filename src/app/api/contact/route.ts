import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY ?? '';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message, captchaToken } = body as {
      name: string;
      email: string;
      message: string;
      captchaToken: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 },
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification is required.' },
        { status: 400 },
      );
    }

    // Verify reCAPTCHA token with Google
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: captchaToken,
      }),
    });

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 },
      );
    }

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('cmr_contact_messages')
      .insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

    if (dbError) {
      console.error('Contact form DB error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save message. Please try again.' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    );
  }
}
