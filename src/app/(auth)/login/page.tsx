"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { loginSchema, type LoginFormValues } from "@/lib/validators/login.schema";
import { useLogin } from "@/hooks/use-login";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onError: (error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status;
          const responseData = error.response?.data;

          if (status === 401) {
            // Invalid credentials — show inline error
            setError("root", {
              message: "Invalid email or password",
            });
          } else if (status === 400) {
            // Validation errors — map to field-level errors
            const messages = responseData?.message;
            if (Array.isArray(messages)) {
              messages.forEach(
                (err: { field?: string; message?: string } | string) => {
                  if (typeof err === "object" && err.field) {
                    const field = err.field as keyof LoginFormValues;
                    setError(field, { message: err.message ?? "Invalid value" });
                  }
                }
              );
            } else {
              setError("root", {
                message:
                  typeof messages === "string"
                    ? messages
                    : "Validation failed",
              });
            }
          } else {
            setError("root", {
              message: "An unexpected error occurred. Please try again.",
            });
          }
        }
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Admin Sign In
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          School Management System
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
          {/* Root / server error */}
          {errors.root && (
            <div
              role="alert"
              className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
            >
              {errors.root.message}
            </div>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={!!errors.email}
              {...register("email")}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-describedby={errors.password ? "password-error" : undefined}
              aria-invalid={!!errors.password}
              {...register("password")}
              className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500 ${
                errors.password
                  ? "border-red-400 bg-red-50"
                  : "border-gray-300 bg-white"
              }`}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
