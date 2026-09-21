function DeleteProductModal({
  product,
  isOpen,
  isDeleting,
  onCancel,
  onConfirm,
}) {
  if (!isOpen || !product) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close delete confirmation"
        onClick={isDeleting ? undefined : onCancel}
        className="absolute inset-0 bg-stone-950/50 backdrop-blur-[3px]"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-[30px] border border-red-900/10 bg-[#fffdf8] shadow-2xl"
      >
        {/* Top accent */}
        <div className="h-2 bg-red-800" />

        <div className="p-7 md:p-8">
          {/* Icon */}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-800">
            <TrashIcon />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-red-800">
            Delete Product
          </p>

          <h2
            id="delete-product-title"
            className="mt-2 text-2xl font-semibold text-stone-900"
          >
            Are you sure?
          </h2>

          <p className="mt-4 leading-7 text-stone-600">
            You&apos;re about to permanently delete{" "}
            <span className="font-semibold text-stone-900">
              {product.name}
            </span>
            .
          </p>

          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-4">
            <div className="flex gap-3">
              <div className="mt-0.5 shrink-0 text-red-800">
                <WarningIcon />
              </div>

              <p className="text-sm leading-6 text-red-900">
                This will remove the product from the nursery catalog and
                permanently delete its associated Cloudinary image.
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-stone-500">
            This action cannot be undone.
          </p>

          {/* Actions */}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="rounded-full border border-stone-300 bg-white px-6 py-3 font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Keep Product
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-full bg-red-800 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-red-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <TrashSmallIcon />
                  Delete Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-7 w-7"
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

function TrashSmallIcon() {
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
      />

      <path
        d="M7 7L8 20H16L17 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M12 3L21 20H3L12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M12 9V14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

export default DeleteProductModal;