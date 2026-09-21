import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { apiRequest } from "../lib/api";
import { uploadProductImage } from "../lib/cloudinary";
import DeleteProductModal from "../components/DeleteProductModal";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
    active: true,
    image_url: "",
    image_public_id: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [statusMessage, setStatusMessage] =
    useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await apiRequest(
          `/products/${id}`
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.error ||
              data.message ||
              "Product not found."
          );
        }

        const product = data.product;

        setFormData({
          name: product.name || "",
          category: product.category || "",
          price: product.price ?? "",
          quantity: product.quantity ?? "",
          description: product.description || "",
          active: Boolean(product.active),
          image_url: product.image_url || "",
          image_public_id:
            product.image_public_id || "",
        });

        if (product.image_url) {
          setImagePreview(product.image_url);
        }
      } catch (error) {
        console.error(
          "Unable to load product:",
          error
        );

        setFormError(
          error.message ||
            "The product could not be loaded."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }

    setFormError("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFormError(
        "Please choose a valid image file."
      );

      return;
    }

    if (
      imagePreview &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(
      URL.createObjectURL(file)
    );

    setFormError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name =
        "Enter a product name.";
    }

    if (!formData.category) {
      errors.category =
        "Select a category.";
    }

    if (
      formData.price === "" ||
      Number.isNaN(Number(formData.price)) ||
      Number(formData.price) < 0
    ) {
      errors.price =
        "Enter a valid price.";
    }

    if (
      formData.quantity !== "" &&
      (
        Number.isNaN(
          Number(formData.quantity)
        ) ||
        Number(formData.quantity) < 0 ||
        !Number.isInteger(
          Number(formData.quantity)
        )
      )
    ) {
      errors.quantity =
        "Enter a valid whole-number quantity.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setStatusMessage("");

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl =
        formData.image_url;

      let imagePublicId =
        formData.image_public_id;

      if (imageFile) {
        setStatusMessage(
          "Uploading new photo..."
        );

        const uploaded =
          await uploadProductImage(
            imageFile
          );

        imageUrl =
          uploaded.imageUrl;

        imagePublicId =
          uploaded.publicId;
      }

      setStatusMessage(
        "Saving changes..."
      );

      const response =
        await apiRequest(
          `/products/${id}`,
          {
            method: "PATCH",

            body: JSON.stringify({
              name:
                formData.name.trim(),

              category:
                formData.category,

              price:
                Number(formData.price),

              quantity:
                formData.quantity === ""
                  ? 0
                  : Number(
                      formData.quantity
                    ),

              description:
                formData.description.trim(),

              active:
                formData.active,

              image_url:
                imageUrl,

              image_public_id:
                imagePublicId,
            }),
          }
        );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (
          response.status === 422 &&
          data.errors
        ) {
          const errors = {};

          Object.entries(
            data.errors
          ).forEach(
            ([field, messages]) => {
              errors[field] =
                Array.isArray(messages)
                  ? messages[0]
                  : messages;
            }
          );

          setFieldErrors(errors);
        }

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Administrator access is required to edit products."
          );
        }

        throw new Error(
          data.error ||
            data.message ||
            "The product could not be updated."
        );
      }

      navigate("/shop");
    } catch (error) {
      console.error(
        "Update failed:",
        error
      );

      setFormError(
        error.message ||
          "The product could not be updated."
      );
    } finally {
      setIsSubmitting(false);
      setStatusMessage("");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setFormError("");

    try {
      const response =
        await apiRequest(
          `/products/${id}`,
          {
            method: "DELETE",
          }
        );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please sign in again."
          );
        }

        if (response.status === 403) {
          throw new Error(
            "Administrator access is required to delete products."
          );
        }

        throw new Error(
          data.error ||
            data.message ||
            "The product could not be deleted."
        );
      }

      navigate("/shop");
    } catch (error) {
      console.error(
        "Delete failed:",
        error
      );

      setFormError(
        error.message ||
          "The product could not be deleted."
      );

      setDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-[calc(100vh-110px)] bg-[#f7f2e8] px-4 py-16">
        <div className="flex justify-center">
          <div className="flex items-center gap-3 text-stone-500">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-red-800" />

            Loading product...
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-[calc(100vh-110px)] bg-[#f7f2e8] px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/shop"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-stone-600 transition hover:text-red-800"
          >
            ← Back to Shop
          </Link>

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
                Edit Product
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600 md:text-lg">
                Update product information,
                inventory, photo, or shop
                visibility.
              </p>
            </div>
          </div>

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
              <div className="space-y-6">
                <FieldGroup
                  label="Product Name"
                  required
                  error={fieldErrors.name}
                >
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={
                      isSubmitting ||
                      isDeleting
                    }
                    className={getInputClasses(
                      fieldErrors.name
                    )}
                  />
                </FieldGroup>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FieldGroup
                    label="Category"
                    required
                    error={
                      fieldErrors.category
                    }
                  >
                    <select
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting ||
                        isDeleting
                      }
                      className={getInputClasses(
                        fieldErrors.category
                      )}
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="Plants">
                        Plants
                      </option>

                      <option value="Trees">
                        Trees
                      </option>

                      <option value="Shrubs">
                        Shrubs
                      </option>

                      <option value="Succulents">
                        Succulents
                      </option>

                      <option value="Flowers">
                        Flowers
                      </option>

                      <option value="Soil & Fertilizer">
                        Soil & Fertilizer
                      </option>

                      <option value="Garden Supplies">
                        Garden Supplies
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>
                  </FieldGroup>

                  <FieldGroup
                    label="Quantity Available"
                    error={
                      fieldErrors.quantity
                    }
                  >
                    <input
                      name="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={
                        formData.quantity
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting ||
                        isDeleting
                      }
                      className={getInputClasses(
                        fieldErrors.quantity
                      )}
                    />
                  </FieldGroup>
                </div>

                <FieldGroup
                  label="Price"
                  required
                  error={fieldErrors.price}
                >
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500">
                      $
                    </span>

                    <input
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={
                        formData.price
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting ||
                        isDeleting
                      }
                      className={`${getInputClasses(
                        fieldErrors.price
                      )} pl-8`}
                    />
                  </div>
                </FieldGroup>

                <FieldGroup
                  label="Description"
                >
                  <textarea
                    name="description"
                    rows="6"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      isSubmitting ||
                      isDeleting
                    }
                    className={`${getInputClasses()} resize-none`}
                  />
                </FieldGroup>

                <div className="rounded-2xl border border-stone-200 bg-[#fffdf8] p-5">
                  <label className="flex cursor-pointer items-start gap-4">
                    <input
                      type="checkbox"
                      name="active"
                      checked={
                        formData.active
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        isSubmitting ||
                        isDeleting
                      }
                      className="mt-1 h-5 w-5 accent-red-800"
                    />

                    <div>
                      <p className="font-semibold text-stone-900">
                        Show this product
                        in the shop
                      </p>

                      <p className="mt-1 text-sm leading-6 text-stone-500">
                        Turn this off to
                        hide the product
                        without deleting it.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Product photo */}
              <div>
                <p className="mb-2 text-sm font-semibold text-stone-700">
                  Product Photo
                </p>

                <label
                  className={`flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[28px] border-2 border-dashed border-stone-300 bg-[#faf7f0] transition ${
                    isSubmitting ||
                    isDeleting
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-red-800/40 hover:bg-red-50/30"
                  }`}
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={
                        formData.name ||
                        "Product"
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="px-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-red-800 shadow-sm">
                        <ImageIcon />
                      </div>

                      <p className="mt-4 font-semibold text-stone-800">
                        Choose a photo
                      </p>

                      <p className="mt-2 text-sm leading-6 text-stone-500">
                        Take a new photo or
                        select one from your
                        device.
                      </p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageChange
                    }
                    disabled={
                      isSubmitting ||
                      isDeleting
                    }
                    className="hidden"
                  />
                </label>

                {imageFile && (
                  <div className="mt-4 rounded-xl bg-[#f7f2e8] px-4 py-3">
                    <p className="truncate text-sm font-medium text-stone-700">
                      {imageFile.name}
                    </p>

                    <p className="mt-1 text-xs text-stone-500">
                      New photo selected
                    </p>
                  </div>
                )}
              </div>
            </div>

            {statusMessage && (
              <div className="relative z-10 mt-6 flex items-center justify-end gap-2 text-sm font-medium text-stone-600">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-300 border-t-red-800" />

                {statusMessage}
              </div>
            )}

            <div className="relative z-10 mt-10 flex flex-col gap-3 border-t border-stone-200 pt-7 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() =>
                  setDeleteModalOpen(true)
                }
                disabled={
                  isDeleting ||
                  isSubmitting
                }
                className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3.5 font-semibold text-red-800 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <TrashIcon />
                Delete Product
              </button>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className={`rounded-full border border-stone-300 bg-white px-6 py-3.5 text-center font-semibold text-stone-700 transition hover:bg-stone-50 ${
                    isSubmitting ||
                    isDeleting
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    isDeleting
                  }
                  className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-red-800 px-7 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      <DeleteProductModal
        product={{
          id,
          name:
            formData.name ||
            "this product",
        }}
        isOpen={deleteModalOpen}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setDeleteModalOpen(false);
          }
        }}
        onConfirm={handleDelete}
      />
    </>
  );
}

function FieldGroup({
  label,
  required = false,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-stone-700">
        {label}

        {required && (
          <span className="ml-1 text-red-800">
            *
          </span>
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

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M5 7H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 7V5H15V7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M7 7L8 20H16L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M10 11V16M14 11V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default EditProduct;