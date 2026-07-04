import React, { useState } from "react";
import Hero from "../assets/hero.png";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-8 font-body">
      <div className="flex w-full max-w-6xl overflow-hidden rounded-xl bg-card shadow-xl lg:min-h-[680px]">
        <section className="relative hidden flex-1 flex-col gap-8 overflow-hidden bg-card-soft p-8 lg:flex">
          <div className="z-10 flex max-w-md flex-col gap-4">
            <h1 className="font-heading text-3xl font-extrabold text-primary">
              Welcome to Clinical Systems Support
            </h1>
            <p className="text-lg leading-relaxed text-secondary">
              Access the Wama Hospital IT Ticketing Hub. Please sign in to
              manage high-priority system requests and technical documentation.
            </p>
          </div>
          <div className="mt-auto flex min-h-0 flex-1 items-end justify-center">
            <img
              alt="Clinical support staff using the hospital ticketing system"
              className="h-full max-h-[440px] w-full rounded-lg object-cover object-center"
              src={Hero}
            />
          </div>
        </section>

        <section className="flex flex-1 items-center justify-center bg-card p-6 sm:p-10">
          <div className="flex w-full max-w-md flex-col gap-6">
            <div className="flex flex-col items-center gap-3">
              <img
                alt="Wama Hospital Logo"
                className="h-[60px] w-auto"
                src="https://lh3.googleusercontent.com/aida/AP1WRLuRviZ64_O0sr1vcxRDUaalAR075OFV7r7xoftzU7rDQY-r1asnTFcskOpy3pYnuZGjalUp0izRq0Z2uuL0Zf-P6LgDe8VBa3Kuj5XuNT6la3iH3IiVh3W9kft8j_qmkQ1e8MJ0enNbm990ri2mte0uVcK494GbDM4RlxrRjTP9wMYi00uGScZ3rAyPUt0Dygq-MR74m5E6LLwVep46YTSjiBZe9Zq2PB6Y7phxdMRvB36M4EZwgaPCokPT"
              />
              <div className="h-1 w-12 rounded-full bg-primary" />
            </div>

            <div className="text-center">
              <h2 className="font-heading text-xl font-semibold text-text">
                Staff Secure Login
              </h2>
              <p className="text-sm text-muted">
                Authorized personnel access only.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-muted"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle"
                    aria-hidden="true"
                  />
                  <input
                    autoComplete="email"
                    className="w-full rounded-lg border border-line bg-card py-3 pl-10 pr-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="email"
                    name="email"
                    placeholder="staff@wamahospital.org"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-muted"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-subtle"
                    aria-hidden="true"
                  />
                  <input
                    autoComplete="current-password"
                    className="w-full rounded-lg border border-line bg-card py-3 pl-10 pr-12 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    aria-label="Toggle password visibility"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle transition-colors hover:text-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 py-1">
                <label className="group flex cursor-pointer items-center gap-2">
                  <input
                    className="h-4 w-4 cursor-pointer rounded border-line text-primary transition-all focus:ring-primary focus:ring-offset-0"
                    type="checkbox"
                  />
                  <span className="text-sm text-muted transition-colors group-hover:text-text">
                    Remember me
                  </span>
                </label>
                <a
                  className="text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-soft"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-4 text-xs font-semibold uppercase tracking-wider text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-[0.98]"
                type="submit"
              >
                <span>Sign In</span>
                <LogIn className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
