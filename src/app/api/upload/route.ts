import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadImage, cloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Debug cloudinary config
    const conf = cloudinary.config();
    console.log("Cloudinary Config:", {
      cloud_name: conf.cloud_name,
      api_key: conf.api_key ? "Set" : "Missing",
      api_secret: conf.api_secret ? "Set" : "Missing",
    });

    // Upload using centralized cloudinary helper
    const result = await uploadImage(buffer);

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: 1080,
      height: 1080,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
