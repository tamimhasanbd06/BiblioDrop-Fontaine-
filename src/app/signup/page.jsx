"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiUsers,
  FiArrowRight,
  FiBookOpen,
  FiAlertCircle,
  FiCheckCircle,
  FiShield,
  FiTruck,
  FiStar,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    photo: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.email.includes("@")) return "Please provide a valid email";
    if (!formData.password) return "Password is required";

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match";
    }

    if (!["user", "librarian"].includes(formData.role)) {
      return "Please select a valid role";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        image: formData.photo.trim() || undefined,

        // This requires `role` to be added in auth.js user.additionalFields
        role: formData.role,

        // After successful signup
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Registration failed. Please try again.");
        return;
      }

      setSuccess("Account created successfully.");

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError("");
      setSuccess("");
      setGoogleLoading(true);

      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        errorCallbackURL: "/signup",
      });

      if (error) {
        setError(error.message || "Google sign up failed. Please try again.");
        return;
      }

      // Usually Better Auth redirects automatically for social login.
    } catch (err) {
      setError(err?.message || "Google sign up failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-600/25 blur-[110px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-indigo-600/25 blur-[120px] sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.16),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.2),rgba(15,23,42,1))]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-120px)] max-w-[1240px] items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] xl:gap-12">
        <div className="order-2 lg:order-1">
          <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300 sm:text-xs">
              <FiBookOpen />
              Join BiblioDrop
            </div>

            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl xl:text-6xl">
              Your local library,{" "}
              <span className="bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                delivered.
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base lg:mx-0">
              Create an account to browse books, request doorstep delivery, or
              become a librarian and manage your own book inventory.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <FeatureCard
                icon={<FiBookOpen />}
                title="Readers"
                text="Browse, request delivery, and track your reading history."
              />

              <FeatureCard
                icon={<FiTruck />}
                title="Librarians"
                text="Add books, manage inventory, and update delivery status."
              />

              <FeatureCard
                icon={<FiShield />}
                title="Secure Auth"
                text="Better Auth email/password and Google login connected."
              />
            </div>

            <div className="mt-8 hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/20 backdrop-blur-xl lg:block">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-300">
                  <FiStar />
                </div>

                <div>
                  <h3 className="font-black text-white">
                    Requirement Matched
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Manual signup supports Reader and Librarian. Google signup
                    creates Reader/User account only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-xl lg:order-2">
          <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-blue-950/40 backdrop-blur-2xl sm:rounded-[2.2rem] sm:p-6 md:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl text-white shadow-lg shadow-blue-700/25 sm:h-16 sm:w-16 sm:text-3xl">
                <FiUser />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl">
                Create Account
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
                Register manually as Reader or Librarian. Google signup creates
                Reader/User account only.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading}
              className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-white px-5 text-sm font-black text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
            >
              <GoogleIcon />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="mt-3 rounded-2xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-center text-[11px] leading-5 text-blue-200 sm:text-xs sm:leading-6">
              Google sign up will create a{" "}
              <span className="font-black text-white">Reader/User</span>{" "}
              account only. To become a{" "}
              <span className="font-black text-white">Librarian</span>, please
              register manually using the form below.
            </p>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500 sm:text-xs">
                Manual Signup
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  icon={<FiUser />}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <InputField
                  icon={<FiImage />}
                  type="text"
                  name="photo"
                  placeholder="Photo URL"
                  value={formData.photo}
                  onChange={handleChange}
                />
              </div>

              <InputField
                icon={<FiMail />}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <div className="relative">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="min-h-12 w-full rounded-full border border-white/10 bg-slate-900/80 pl-11 pr-5 text-sm font-semibold text-white outline-none transition focus:border-blue-400"
                >
                  <option value="user">Reader / User</option>
                  <option value="librarian">Librarian / Provider</option>
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  icon={<FiLock />}
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <InputField
                  icon={<FiLock />}
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && (
                <AlertBox type="error" icon={<FiAlertCircle />} text={error} />
              )}

              {success && (
                <AlertBox
                  type="success"
                  icon={<FiCheckCircle />}
                  text={success}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 px-6 text-sm font-black text-white shadow-lg shadow-blue-700/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-700/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account"}
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/signin"
                className="font-black text-blue-300 transition hover:text-blue-200"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function InputField({
  icon,
  type,
  name,
  placeholder,
  value,
  onChange,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
        {icon}
      </span>

      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`min-h-12 w-full rounded-full border border-white/10 bg-slate-900/80 pl-11 ${
          isPassword ? "pr-12" : "pr-5"
        } text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400`}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-300"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left backdrop-blur-xl transition hover:border-blue-400/30 hover:bg-white/[0.07]">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-xl text-blue-300">
        {icon}
      </div>

      <h3 className="text-sm font-black text-white">{title}</h3>

      <p className="mt-2 text-xs leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function AlertBox({ type, icon, text }) {
  const classes =
    type === "error"
      ? "border-red-400/20 bg-red-500/10 text-red-300"
      : "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${classes}`}
    >
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p>{text}</p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.223 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.153 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.197l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.565l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}