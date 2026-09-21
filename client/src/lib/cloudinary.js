import { apiRequest } from "./api";

export async function uploadProductImage(file) {
  const signatureResponse = await apiRequest(
    "/uploads/signature",
    {
      method: "POST",
    }
  );

  if (!signatureResponse.ok) {
    let errorData = {};

    try {
      errorData = await signatureResponse.json();
    } catch {
      errorData = {};
    }

    throw new Error(
      errorData.error ||
        errorData.message ||
        "Unable to authorize image upload."
    );
  }

  const {
    timestamp,
    signature,
    api_key,
    cloud_name,
    folder,
  } = await signatureResponse.json();

  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(
      data?.error?.message ||
        "The image could not be uploaded."
    );
  }

  return {
    imageUrl: data.secure_url,
    publicId: data.public_id,
  };
}