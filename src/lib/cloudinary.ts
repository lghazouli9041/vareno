import { v2 as cloudinary } from "cloudinary";
import { getEnv } from "@/lib/env";

let configured = false;

function ensureCloudinary() {
  if (configured) return true;
  try {
    const env = getEnv();
    if (
      !env.CLOUDINARY_CLOUD_NAME ||
      !env.CLOUDINARY_API_KEY ||
      !env.CLOUDINARY_API_SECRET
    ) {
      return false;
    }
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
    return true;
  } catch {
    return false;
  }
}

export function isCloudinaryConfigured() {
  return ensureCloudinary();
}

/** Responsive delivery URL with Cloudinary transforms when configured. */
export function optimizedImageUrl(
  url: string,
  options?: { width?: number; quality?: string },
): string {
  if (!url.includes("res.cloudinary.com")) return url;
  const width = options?.width ?? 1200;
  const quality = options?.quality ?? "auto";
  return url.replace(
    "/upload/",
    `/upload/f_auto,q_${quality},w_${width},c_fill/`,
  );
}

export async function uploadImageBuffer(input: {
  buffer: Buffer;
  folder?: string;
  publicId?: string;
}): Promise<{ url: string; publicId: string; width: number; height: number }> {
  if (!ensureCloudinary()) {
    throw new Error("Cloudinary is not configured");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: input.folder ?? "vareno/products",
        public_id: input.publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width ?? 1200,
          height: result.height ?? 1500,
        });
      },
    );
    stream.end(input.buffer);
  });
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!ensureCloudinary()) {
    throw new Error("Cloudinary is not configured");
  }
  await cloudinary.uploader.destroy(publicId);
}
