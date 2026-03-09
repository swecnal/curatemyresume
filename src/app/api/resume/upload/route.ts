import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { parseResume } from "@/lib/claude";
import { extractResumeText } from "@/lib/parse-resume";
import { randomUUID } from "crypto";

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

    // Parse resume with Claude to extract structured profile
    const parsedProfile = await parseResume(rawText);

    // Generate a resume ID
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
        // Continue without storage — the resume text is what matters
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
