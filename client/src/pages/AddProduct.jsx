import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../lib/api";
import { uploadProductImage } from "../lib/cloudinary";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    active: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError("Please choose a valid image file.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError("");
  };

  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Enter a product name.";
    }

    if (!formData.category) {
      errors.category = "Select a category.";
    }

    if (formData.price === "") {
      errors.price = "Enter a price.";
    } else if (
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      errors.price = "Enter a valid price.";
    }

    if (
      formData.quantity !== "" &&
      (
        Number.isNaN(Number(formData.quantity)) ||
        Number(formData.quantity) < 0 ||
        !Number.isInteger(Number(formData.quantity))
      )
    ) {
      errors.quantity = "Enter a valid whole-number quantity.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setUploadStatus("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    let uploadedImage = {
      imageUrl: null,
      publicId: null,
    };

    try {
      /*
       * STEP 1:
       * Upload the image directly to Cloudinary.
       */
      if (imageFile) {
        setUploadStatus("Uploading photo...");

        uploadedImage = await uploadProductImage(imageFile);
      }

      /*
       * STEP 2:
       * Save the product in Rails with the Cloudinary references.
       */
      setUploadStatus("Saving product...");

      const response = await apiRequest("/products", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category,
          price: Number(formData.price),
          quantity:
            formData.quantity === ""
              ? 0
              : Number(formData.quantity),
          description: formData.description.trim(),
          active: formData.active,
          image_url: uploadedImage.imageUrl,
          image_public_id: uploadedImage.publicId,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          setFormError(
            "Your session has expired. Please sign in again."
          );

          return;
        }

        if (response.status === 403) {
          setFormError(
            "Administrator access is required to add products."
          );

          return;
        }

        if (response.status === 422 && data.errors) {
          const errors = {};

          Object.entries(data.errors).forEach(
            ([field, messages]) => {
              errors[field] = Array.isArray(messages)
                ? messages[0]
                : messages;
            }
          );

          setFieldErrors(errors);

          setFormError(
            "Please check the highlighted product information."
          );

          return;
        }

        setFormError(
          data.error ||
            data.message ||
            "The product could not be saved. Please try again."
        );

        return;
      }

      setUploadStatus("Product saved.");

      /*
       * Active products immediately appear in the public shop.
       * Inactive products return to the admin dashboard.
       */
      if (formData.active) {
        navigate("/shop");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Add product failed:", error);

      setFormError(
        error.message ||
          "Something went wrong while adding the product."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-110px)] bg-[#f7f2e8] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Back link */}
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-red-800"
        >
          <ArrowLeftIcon />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="relative overflow-hidden rounded-[32px] border border-red-900/10 bg-[#fffdf8] px-6 py-8 shadow-sm md:px-10 md:py-10">
          <img
            src={topLeaves}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[-70px] top-[-90px] w-[350px] select-none opacity-30"
          />

          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-800">
              Product Management
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              Add a Product
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
              Add a plant or nursery product to Garibaldo&apos;s online
              catalog.
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="relative mt-8 overflow-hidden rounded-[32px] border border-red-900/10 bg-white p-6 shadow-sm md:p-10"
        >
          <img
            src={bottomLeaves}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-140px] right-[-80px] w-[450px] select-none opacity-[0.08]"
          />

          {formError && (
            <div
              role="alert"
              className="relative z-10 mb-7 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800"
            >
              {formError}
            </div>
          )}

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Main fields */}
            <div className="space-y-6">
              <FieldGroup
                label="Product Name"
                htmlFor="name"
                required
                error={fieldErrors.name}
              >
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Example: Narrow-leaf Milkweed"
                  disabled={isSubmitting}
                  className={getInputClasses(fieldErrors.name)}
                />
              </FieldGroup>

              <div className="grid gap-6 sm:grid-cols-2">
                <FieldGroup
                  label="Category"
                  htmlFor="category"
                  required
                  error={fieldErrors.category}
                >
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={getInputClasses(fieldErrors.category)}
                  >
                    <option value="">Select category</option>
                    <option value="Plants">Plants</option>
                    <option value="Trees">Trees</option>
                    <option value="Shrubs">Shrubs</option>
                    <option value="Succulents">Succulents</option>
                    <option value="Flowers">Flowers</option>
                    <option value="Soil & Fertilizer">
                      Soil & Fertilizer
                    </option>
                    <option value="Garden Supplies">
                      Garden Supplies
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </FieldGroup>

                <FieldGroup
                  label="Quantity Available"
                  htmlFor="quantity"
                  error={fieldErrors.quantity}
                >
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    disabled={isSubmitting}
                    className={getInputClasses(fieldErrors.quantity)}
                  />
                </FieldGroup>
              </div>

              <FieldGroup
                label="Price"
                htmlFor="price"
                required
                error={fieldErrors.price}
              >
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-stone-500">
                    $
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    className={`${getInputClasses(
                      fieldErrors.price
                    )} pl-8`}
                  />
                </div>
              </FieldGroup>

              <FieldGroup
                label="Description"
                htmlFor="description"
                error={fieldErrors.description}
              >
                <textarea
                  id="description"
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell customers about this product, growing conditions, size, care, or anything else they should know."
                  disabled={isSubmitting}
                  className={`${getInputClasses(
                    fieldErrors.description
                  )} resize-none`}
                />
              </FieldGroup>

              {/* Visibility */}
              <div className="rounded-2xl border border-stone-200 bg-[#fffdf8] p-5">
                <label className="flex cursor-pointer items-start gap-4">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="mt-1 h-5 w-5 accent-red-800"
                  />

                  <div>
                    <p className="font-semibold text-stone-900">
                      Show this product in the shop
                    </p>

                    <p className="mt-1 text-sm leading-6 text-stone-500">
                      Turn this off if you want to save the product without
                      displaying it to customers yet.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Image section */}
            <div>
              <p className="mb-2 text-sm font-semibold text-stone-700">
                Product Photo
              </p>

              <label
                className={`group flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed border-stone-300 bg-[#faf7f0] transition ${
                  isSubmitting
                    ? "cursor-not-allowed opacity-70"
                    : "cursor-pointer hover:border-red-800/40 hover:bg-red-50/30"
                }`}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="px-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-800 shadow-sm">
                      <ImageIcon />
                    </div>

                    <p className="mt-4 font-semibold text-stone-800">
                      Add product photo
                    </p>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      Tap or click to choose an image.
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                  className="hidden"
                />
              </label>

              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isSubmitting}
                  className="mt-3 w-full text-center text-sm font-semibold text-red-800 transition hover:text-red-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Remove photo
                </button>
              )}

              {imageFile && (
                <div className="mt-4 rounded-xl bg-[#f7f2e8] px-4 py-3">
                  <p className="truncate text-sm font-medium text-stone-700">
                    {imageFile.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {formatFileSize(imageFile.size)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="relative z-10 mt-10 border-t border-stone-200 pt-7">
            {uploadStatus && (
              <div className="mb-5 flex items-center justify-end gap-2 text-sm font-medium text-stone-600">
                {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-red-800" />
                )}

                {uploadStatus}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/admin"
                className={`inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3.5 font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 ${
                  isSubmitting
                    ? "pointer-events-none opacity-50"
                    : ""
                }`}
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex min-w-[170px] items-center justify-center gap-3 rounded-full bg-red-800 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save Product
                    <ArrowIcon />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

function FieldGroup({
  label,
  htmlFor,
  required = false,
  error,
  children,
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-stone-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-800">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function getInputClasses(error) {
  return `w-full rounded-xl border bg-white px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 disabled:cursor-not-allowed disabled:bg-stone-50 disabled:opacity-70 focus:ring-2 ${
    error
      ? "border-red-500 focus:border-red-600 focus:ring-red-500/10"
      : "border-stone-300 focus:border-red-800 focus:ring-red-800/10"
  }`;
}

function formatFileSize(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ImageIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="9"
        cy="9"
        r="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4 17L9 12L12.5 15.5L15 13L20 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M5 12H19M14 7L19 12L14 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M19 12H5M10 7L5 12L10 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default AddProduct;