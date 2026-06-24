import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(
  imageBuffer: Buffer,
  options?: {
    folder?: string;
    publicId?: string;
    width?: number;
    height?: number;
  }
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      resource_type: "image" as const,
    };
    
    if (options?.folder) {
      uploadOptions.folder = options.folder;
    }

    if (options?.publicId) uploadOptions.public_id = options.publicId;
    if (options?.width || options?.height) {
      uploadOptions.transformation = [
        {
          width: options?.width,
          height: options?.height,
          crop: "fill",
          gravity: "center",
        },
      ];
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result from Cloudinary"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(imageBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export { cloudinary };
