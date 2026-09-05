// uploadToCloud.ts
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET;

export async function uploadToCloud(fileOrUrl: File | string | null) {
  if (!fileOrUrl) {
    return { success: false, error: "No file provided", url: null, publicId: null };
  }

  // Case 1: Existing image string (e.g. initial URL from DB) -> nothing to upload
  if (typeof fileOrUrl === "string") {
    return { success: true, url: fileOrUrl, publicId: null, error: null };
  }

  // Case 2: New File instance selected via ImagePicker
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return {
      success: false,
      error: "Missing Cloudinary configuration",
      url: null,
      publicId: null,
    };
  }

  try {
    const formData = new FormData();
    formData.append("file", fileOrUrl);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(30000),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || `Upload failed (${response.status})`);
    }

    return {
      success: true,
      url: data.secure_url as string,
      publicId: data.public_id as string,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      url: null,
      publicId: null,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}