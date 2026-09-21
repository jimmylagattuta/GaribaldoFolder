import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { apiRequest } from "../lib/api";
import DeleteProductModal from "../components/DeleteProductModal";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function getStoredUser() {
  const storedUser =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
}

function normalizeSearchValue(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenSearchValues(value) {
  if (value === null || value === undefined) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(flattenSearchValues);
  }

  if (typeof value === "object") {
    return Object.values(value).flatMap(flattenSearchValues);
  }

  if (typeof value === "boolean") {
    return value
      ? [
          "true",
          "active",
          "visible",
          "shown",
          "available",
        ]
      : [
          "false",
          "inactive",
          "hidden",
          "draft",
        ];
  }

  return [String(value)];
}

function buildSearchIndex(product) {
  const extraSearchTerms = [];

  if (product.price != null) {
    const numericPrice = Number(product.price);

    if (!Number.isNaN(numericPrice)) {
      extraSearchTerms.push(
        numericPrice.toString(),
        numericPrice.toFixed(2),
        `$${numericPrice.toFixed(2)}`
      );
    }
  }

  if (product.quantity != null) {
    extraSearchTerms.push(
      String(product.quantity),
      `${product.quantity} available`,
      `${product.quantity} in stock`
    );
  }

  return normalizeSearchValue(
    [
      ...flattenSearchValues(product),
      ...extraSearchTerms,
    ].join(" ")
  );
}

function Shop() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [productToDelete, setProductToDelete] =
    useState(null);

  const [deletingId, setDeletingId] =
    useState(null);

  const [shopError, setShopError] =
    useState("");

  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response =
          await apiRequest("/products");

        if (!response.ok) {
          setProducts([]);

          setShopError(
            "We couldn't load the shop right now. Please try again."
          );

          return;
        }

        const data = await response.json();

        const productList =
          Array.isArray(data)
            ? data
            : data.products || [];

        setProducts(productList);
      } catch (error) {
        console.error(
          "Unable to load products:",
          error
        );

        setProducts([]);

        setShopError(
          "We couldn't load the shop right now. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedQuery =
      normalizeSearchValue(searchQuery);

    if (!normalizedQuery) {
      return products;
    }

    const terms = normalizedQuery
      .split(" ")
      .filter(Boolean);

    return products.filter((product) => {
      const searchIndex =
        buildSearchIndex(product);

      return terms.every((term) =>
        searchIndex.includes(term)
      );
    });
  }, [products, searchQuery]);

  const handleDeleteRequest = (product) => {
    setShopError("");
    setProductToDelete(product);
  };

  const handleDeleteCancel = () => {
    if (deletingId) {
      return;
    }

    setProductToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) {
      return;
    }

    const product = productToDelete;

    setShopError("");
    setDeletingId(product.id);

    try {
      const response = await apiRequest(
        `/products/${product.id}`,
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
        throw new Error(
          data.error ||
            data.message ||
            "The product could not be deleted."
        );
      }

      setProducts((current) =>
        current.filter(
          (currentProduct) =>
            currentProduct.id !== product.id
        )
      );

      setProductToDelete(null);
    } catch (error) {
      console.error(
        "Delete product failed:",
        error
      );

      setShopError(
        error.message ||
          "The product could not be deleted."
      );

      setProductToDelete(null);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <section className="min-h-[calc(100vh-110px)] bg-[#f7f2e8] px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-[1400px]">
          {/* Page heading */}
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-800">
              Garibaldo&apos;s Nursery
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              Shop
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              Browse plants, nursery products,
              and gardening essentials from
              Garibaldo&apos;s Nursery.
            </p>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="mt-14 flex justify-center">
              <div className="flex items-center gap-3 text-stone-500">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-stone-300 border-t-red-800" />

                <span className="text-sm font-medium">
                  Checking the nursery...
                </span>
              </div>
            </div>
          )}

          {/* Error */}
          {!isLoading && shopError && (
            <div className="mx-auto mt-8 max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-medium text-red-800">
              {shopError}
            </div>
          )}

          {/* Empty shop */}
          {!isLoading &&
            products.length === 0 && (
              <div className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[32px] border border-red-900/10 bg-[#fffdf8] px-6 py-12 text-center shadow-sm md:px-14 md:py-16">
                <img
                  src={topLeaves}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute right-[-70px] top-[-90px] w-[330px] select-none opacity-25"
                />

                <img
                  src={bottomLeaves}
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[-115px] left-[-55px] w-[360px] select-none opacity-20"
                />

                <div className="relative z-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-800 text-white shadow-sm">
                    <PlantIcon />
                  </div>

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-red-800">
                    Garibaldo&apos;s Nursery
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold text-stone-900 md:text-4xl">
                    Our online shop is growing.
                  </h2>

                  <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-stone-600 md:text-lg">
                    We&apos;re adding plants,
                    nursery products, pricing, and
                    availability now.
                  </p>

                  <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-stone-600 md:text-lg">
                    Check back soon — or visit us
                    in person.
                  </p>

                  <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    {isAdmin && (
                      <Link
                        to="/admin/products/new"
                        className="inline-flex items-center justify-center rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md"
                      >
                        Add Product
                      </Link>
                    )}

                    {!isAdmin && (
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-red-800 px-6 py-3.5 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md"
                      >
                        Contact Us
                      </Link>
                    )}

                    <Link
                      to="/about"
                      className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-6 py-3.5 font-semibold text-stone-700 transition hover:border-red-800/30 hover:text-red-800"
                    >
                      About the Nursery
                    </Link>
                  </div>
                </div>
              </div>
            )}

          {/* Search */}
          {!isLoading &&
            products.length > 0 && (
              <>
                <div className="mx-auto mt-10 max-w-3xl">
                  <div className="relative">
                    <div className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone-400">
                      <SearchIcon />
                    </div>

                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(
                          event.target.value
                        )
                      }
                      placeholder="Search plants, categories, descriptions, prices..."
                      className="w-full rounded-full border border-stone-300 bg-white py-4 pl-14 pr-14 text-base text-stone-900 shadow-sm outline-none transition placeholder:text-stone-400 focus:border-red-800 focus:ring-2 focus:ring-red-800/10"
                    />

                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() =>
                          setSearchQuery("")
                        }
                        className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-red-800"
                        aria-label="Clear search"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-2">
                    <p className="text-sm text-stone-500">
                      {searchQuery.trim() ? (
                        <>
                          {
                            filteredProducts.length
                          }{" "}
                          {filteredProducts.length ===
                          1
                            ? "result"
                            : "results"}
                        </>
                      ) : (
                        <>
                          {products.length}{" "}
                          {products.length === 1
                            ? "product"
                            : "products"}
                        </>
                      )}
                    </p>

                    {isAdmin && (
                      <Link
                        to="/admin/products/new"
                        className="text-sm font-semibold text-red-800 transition hover:text-red-950"
                      >
                        + Add Product
                      </Link>
                    )}
                  </div>
                </div>

                {/* No search results */}
                {filteredProducts.length ===
                  0 && (
                  <div className="mx-auto mt-12 max-w-2xl rounded-[28px] border border-red-900/10 bg-[#fffdf8] px-6 py-10 text-center shadow-sm">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f2e8] text-red-800">
                      <SearchIcon />
                    </div>

                    <h2 className="mt-5 text-2xl font-semibold text-stone-900">
                      No matches found
                    </h2>

                    <p className="mt-3 leading-7 text-stone-600">
                      We couldn&apos;t find
                      anything matching{" "}
                      <span className="font-semibold text-stone-800">
                        &ldquo;
                        {searchQuery}
                        &rdquo;
                      </span>
                      .
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setSearchQuery("")
                      }
                      className="mt-6 rounded-full bg-red-800 px-6 py-3 font-semibold text-white transition hover:bg-red-900"
                    >
                      Clear Search
                    </button>
                  </div>
                )}

                {/* Product grid */}
                {filteredProducts.length >
                  0 && (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map(
                      (product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          isAdmin={isAdmin}
                          deleting={
                            deletingId ===
                            product.id
                          }
                          onDelete={() =>
                            handleDeleteRequest(
                              product
                            )
                          }
                        />
                      )
                    )}
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      <DeleteProductModal
        product={productToDelete}
        isOpen={Boolean(productToDelete)}
        isDeleting={Boolean(deletingId)}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}

function ProductCard({
  product,
  isAdmin,
  deleting,
  onDelete,
}) {
  return (
    <article className="relative overflow-hidden rounded-[28px] border border-red-900/10 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Admin status badge */}
      {isAdmin && !product.active && (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-stone-900/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur-sm">
          Hidden
        </div>
      )}

      <div className="aspect-square bg-[#eee8dc]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-red-800/35">
            <PlantIcon />
          </div>
        )}
      </div>

      <div className="p-5">
        {product.category && (
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-800">
            {product.category}
          </p>
        )}

        <h2 className="mt-2 text-xl font-semibold text-stone-900">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            {product.price != null && (
              <p className="text-lg font-semibold text-stone-900">
                $
                {Number(
                  product.price
                ).toFixed(2)}
              </p>
            )}

            {product.quantity != null && (
              <p className="mt-1 text-xs text-stone-500">
                {Number(
                  product.quantity
                ) > 0
                  ? `${product.quantity} available`
                  : "Currently out of stock"}
              </p>
            )}
          </div>
        </div>

        {/* Admin controls */}
        {isAdmin && (
          <div className="mt-5 grid grid-cols-2 gap-2 border-t border-stone-200 pt-4">
            <Link
              to={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-red-800/30 hover:text-red-800"
            >
              <EditIcon />
              Edit
            </Link>

            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-800" />
                  Deleting
                </>
              ) : (
                <>
                  <TrashIcon />
                  Delete
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 16L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        d="M4 20L8.5 19L19 8.5L15.5 5L5 15.5L4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M13.5 7L17 10.5"
        stroke="currentColor"
        strokeWidth="1.8"
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

function PlantIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path
        d="M12 21V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M12 13C8 13 5 10.5 5 7C9 7 12 9 12 13Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 10C12 6.5 15 4 19 4C19 7.5 16 10 12 10Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default Shop;