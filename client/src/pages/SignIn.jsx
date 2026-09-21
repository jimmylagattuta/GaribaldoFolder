import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { apiRequest } from "../lib/api";

import topLeaves from "../assets/leaves-top.png";
import bottomLeaves from "../assets/leaves-bottom.png";

function SignIn() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};

    if (!login.trim()) {
      errors.login = "Enter your username or email.";
    }

    if (!password) {
      errors.password = "Enter your password.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormError("");
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({
          login: login.trim(),
          password,
          remember_me: rememberMe,
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 404) {
          setFieldErrors({
            login:
              "We couldn't find an account with that username or email.",
          });

          return;
        }

        if (response.status === 401) {
          const errorCode =
            data.code || data.error_code;

          if (errorCode === "USER_NOT_FOUND") {
            setFieldErrors({
              login:
                "We couldn't find an account with that username or email.",
            });

            return;
          }

          if (errorCode === "INVALID_PASSWORD") {
            setFieldErrors({
              password: "That password is incorrect.",
            });

            return;
          }

          setFormError(
            data.error ||
              data.message ||
              "The username/email or password you entered is incorrect."
          );

          return;
        }

        if (response.status === 422) {
          if (data.errors) {
            const errors = {};

            if (data.errors.login) {
              errors.login = Array.isArray(
                data.errors.login
              )
                ? data.errors.login[0]
                : data.errors.login;
            }

            if (data.errors.password) {
              errors.password = Array.isArray(
                data.errors.password
              )
                ? data.errors.password[0]
                : data.errors.password;
            }

            if (Object.keys(errors).length > 0) {
              setFieldErrors(errors);
              return;
            }
          }

          setFormError(
            data.error ||
              data.message ||
              "Please check your information and try again."
          );

          return;
        }

        if (response.status >= 500) {
          setFormError(
            "Something went wrong on our side. Please try again in a moment."
          );

          return;
        }

        setFormError(
          data.error ||
            data.message ||
            "Unable to sign in. Please try again."
        );

        return;
      }

      if (!data.token) {
        setFormError(
          "The server responded, but no login token was returned."
        );

        return;
      }

      if (rememberMe) {
        localStorage.setItem(
          "authToken",
          data.token
        );

        if (data.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        sessionStorage.removeItem(
          "authToken"
        );
        sessionStorage.removeItem("user");
      } else {
        sessionStorage.setItem(
          "authToken",
          data.token
        );

        if (data.user) {
          sessionStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
        }

        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }

      /*
       * Mobile Safari can retain the scroll position created
       * while the keyboard is open. Blur the active field first
       * so the keyboard closes before navigating.
       */
      if (
        document.activeElement instanceof
        HTMLElement
      ) {
        document.activeElement.blur();
      }

      /*
       * Reset immediately before navigation.
       */
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "auto",
      });

      /*
       * Replace the sign-in page with Home so Back does not
       * immediately return the user to the completed login form.
       */
      navigate("/", {
        replace: true,
      });

      /*
       * Reset again after React renders the new route.
       * The small delayed reset specifically helps iOS Safari
       * after its keyboard / visual viewport finishes collapsing.
       */
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      });

      window.setTimeout(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "auto",
        });
      }, 100);
    } catch (error) {
      console.error(
        "Sign in request failed:",
        error
      );

      setFormError(
        "We couldn't connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginChange = (event) => {
    setLogin(event.target.value);

    if (fieldErrors.login) {
      setFieldErrors((current) => ({
        ...current,
        login: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);

    if (fieldErrors.password) {
      setFieldErrors((current) => ({
        ...current,
        password: "",
      }));
    }

    if (formError) {
      setFormError("");
    }
  };

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-8 md:px-6 md:py-14">
      <div className="relative overflow-hidden rounded-3xl bg-[#fffdf8] shadow-lg">
        <img
          src={topLeaves}
          alt=""
          aria-hidden="true"
          className="pointer-events-none mx-auto max-h-[180px] w-[88%] select-none object-contain object-top"
        />

        <div className="relative z-10 px-7 pb-6 pt-2 md:px-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-800">
              Garibaldo&apos;s Nursery
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-stone-900">
              Sign In
            </h1>

            <p className="mt-3 text-stone-600">
              Welcome back. Sign in to your
              account.
            </p>
          </div>

          <form
            className="mt-7 space-y-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {formError && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              >
                {formError}
              </div>
            )}

            <div>
              <label
                htmlFor="login"
                className="mb-2 block text-sm font-semibold text-stone-700"
              >
                Username or Email
              </label>

              <input
                id="login"
                name="login"
                type="text"
                autoComplete="username"
                placeholder="Username or email"
                value={login}
                onChange={handleLoginChange}
                aria-invalid={Boolean(
                  fieldErrors.login
                )}
                aria-describedby={
                  fieldErrors.login
                    ? "login-error"
                    : undefined
                }
                className={`w-full rounded-xl border bg-white px-4 py-3.5 text-stone-900 outline-none transition placeholder:text-stone-400 focus:ring-2 ${
                  fieldErrors.login
                    ? "border-red-500 focus:border-red-600 focus:ring-red-500/10"
                    : "border-stone-300 focus:border-red-800 focus:ring-red-800/10"
                }`}
              />

              {fieldErrors.login && (
                <p
                  id="login-error"
                  className="mt-2 text-sm font-medium text-red-700"
                >
                  {fieldErrors.login}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-stone-700"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={
                    handlePasswordChange
                  }
                  aria-invalid={Boolean(
                    fieldErrors.password
                  )}
                  aria-describedby={
                    fieldErrors.password
                      ? "password-error"
                      : undefined
                  }
                  className={`w-full rounded-xl border bg-white px-4 py-3.5 pr-12 text-stone-900 outline-none transition placeholder:text-stone-400 focus:ring-2 ${
                    fieldErrors.password
                      ? "border-red-500 focus:border-red-600 focus:ring-red-500/10"
                      : "border-stone-300 focus:border-red-800 focus:ring-red-800/10"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-2 text-stone-500 transition hover:bg-stone-100 hover:text-red-800"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOffIcon />
                  ) : (
                    <EyeIcon />
                  )}
                </button>
              </div>

              {fieldErrors.password && (
                <p
                  id="password-error"
                  className="mt-2 text-sm font-medium text-red-700"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-stone-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) =>
                    setRememberMe(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-stone-300 accent-red-800"
                />

                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-red-800 transition hover:text-red-950"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-red-800 px-5 py-3.5 font-semibold text-white shadow-sm transition duration-200 hover:bg-red-900 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-red-800 transition hover:text-red-950"
            >
              Create Account
            </Link>
          </p>
        </div>

        <img
          src={bottomLeaves}
          alt=""
          aria-hidden="true"
          className="pointer-events-none mx-auto mt-1 w-[92%] select-none object-contain"
        />

        <div className="pb-6 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-stone-500">
            Growing a brighter tomorrow
          </p>

          <div className="mx-auto mt-3 h-px w-10 bg-stone-400" />
        </div>
      </div>
    </section>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M2.5 12C4.8 7.8 8 5.5 12 5.5C16 5.5 19.2 7.8 21.5 12C19.2 16.2 16 18.5 12 18.5C8 18.5 4.8 16.2 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M10.7 5.6C11.1 5.53 11.53 5.5 12 5.5C16 5.5 19.2 7.8 21.5 12C20.67 13.52 19.72 14.78 18.63 15.78M14.4 18.08C13.64 18.36 12.84 18.5 12 18.5C8 18.5 4.8 16.2 2.5 12C3.28 10.57 4.17 9.37 5.18 8.42"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.88 9.88C9.33 10.43 9 11.18 9 12C9 13.66 10.34 15 12 15C12.82 15 13.57 14.67 14.12 14.12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default SignIn;