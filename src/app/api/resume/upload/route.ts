import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { parseResume } from "@/lib/claude";
import type { UserTier } from "@/lib/claude";
import { extractResumeText } from "@/lib/parse-resume";
import { randomUUID } from "crypto";
import { canAccess } from "@/lib/tier-features";

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const contentType = request.headers.get("content-type") ?? "";

    let rawText: string;
    let fileName: string | null = null;
    let fileBuffer: Buffer | null = null;
    let mimeType: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();

      const file = formData.get("file") as File | null;
      const textInput = formData.get("text") as string | null;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        fileBuffer = Buffer.from(arrayBuffer);
        mimeType = file.type;
        fileName = file.name;
        rawText = await extractResumeText(fileBuffer, mimeType);
      } else if (textInput && textInput.trim().length > 0) {
        rawText = textInput.trim();
      } else {
        return NextResponse.json(
          { error: "No file or text provided" },
          { status: 400 }
        );
      }
    } else {
      // Handle JSON body with text
      const body = await request.json();
      if (!body.text || body.text.trim().length === 0) {
        return NextResponse.json(
          { error: "No resume text provided" },
          { status: 400 }
        );
      }
      rawText = body.text.trim();
    }

    const tier = (session.user.tier ?? "free") as UserTier;

    // Parse resume with Claude to extract structured profile
    const parsedProfile = await parseResume(rawText, tier);
    const shouldStore = canAccess(tier, "resumeStorage");

    // For non-storage tiers (Free, Job Hunting): return parsed data without persisting
    if (!shouldStore) {
      return NextResponse.json({
        rawText,
        parsedProfile,
        fileName: fileName ?? "pasted-text",
        ephemeral: true,
      });
    }

    // For Beast tier: persist to DB + Storage as before
    const resumeId = randomUUID();

    // Upload original file to Supabase Storage if we have one
    let storageUrl: string | null = null;
    if (fileBuffer && fileName) {
      const storagePath = `${userId}/${resumeId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("cmr-resumes")
        .upload(storagePath, fileBuffer, {
          contentType: mimeType ?? "application/octet-stream",
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
      } else {
        const { data: publicUrl } = supabase.storage
          .from("cmr-resumes")
          .getPublicUrl(storagePath);
        storageUrl = publicUrl.publicUrl;
      }
    }

    // Deactivate any existing active resumes for this user
    const { error: deactivateError } = await supabase
      .from("cmr_resumes")
      .update({ is_active: false })
      .eq("user_id", userId)
      .eq("is_active", true);

    if (deactivateError) {
      console.error("Error deactivating old resumes:", deactivateError);
    }

    // Insert the new resume record
    const { data: newResume, error: insertError } = await supabase
      .from("cmr_resumes")
      .insert({
        id: resumeId,
        user_id: userId,
        raw_text: rawText,
        parsed_profile: parsedProfile,
        file_name: fileName,
        file_url: storageUrl,
        is_active: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting resume:", insertError);
      return NextResponse.json(
        { error: "Failed to save resume" },
        { status: 500 }
      );
    }

    return NextResponse.json(newResume);
  } catch (error) {
    console.error("Resume upload error:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.cmr_user_id;
    const tier = session.user.tier ?? "free";
    const shouldStore = canAccess(tier, "resumeStorage");

    // Non-storage tiers have no stored resumes
    if (!shouldStore) {
      return NextResponse.json({
        hasResume: false,
        ephemeralMode: true,
        activeResume: null,
        history: [],
      });
    }

    // Fetch active resume
    const { data: activeResume } = await supabase
      .from("cmr_resumes")
      .select("id, file_name, parsed_profile, created_at, is_active")
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

    // Fetch resume history
    const { data: history } = await supabase
      .from("cmr_resumes")
      .select("id, file_name, created_at, is_active")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    const profileSummary = activeResume?.parsed_profile
      ? `${(activeResume.parsed_profile as any).name ?? ""} — ${(activeResume.parsed_profile as any).current_title ?? ""}`
      : null;

    return NextResponse.json({
      hasResume: !!activeResume,
      activeResume: activeResume
        ? {
            id: activeResume.id,
            fileName: activeResume.file_name,
            profileSummary,
            createdAt: activeResume.created_at,
          }
        : null,
      history: (history ?? []).map((r: any) => ({
        id: r.id,
        fileName: r.file_name,
        createdAt: r.created_at,
        isActive: r.is_active,
      })),
    });
  } catch (error) {
    console.error("Resume fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
