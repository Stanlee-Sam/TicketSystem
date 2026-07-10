import React from "react";
import { AlertCircle, Eye, Info, ShieldCheck, UserPlus } from "lucide-react";
import Sidebar from "../../Components/Sidebar";

const CreateUser = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex p-10  min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="font-heading text-3xl font-bold text-text">
              Create New Staff Account
            </h1>
            <p className="mt-2 text-sm text-secondary">
              Initialize a new secure profile for medical staff or IT
              administrators. All fields are required for HIPAA compliance.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-line bg-card shadow-sm">
            <div className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-muted"
                    htmlFor="full-name"
                  >
                    Full Name
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="full-name"
                    placeholder="Dr. Sarah Jenkins"
                    type="text"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-muted"
                    htmlFor="email"
                  >
                    Institutional Email
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="email"
                    placeholder="s.jenkins@medtechsystems.org"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-muted"
                  htmlFor="department"
                >
                  Department
                </label>
                <select
                  className="h-11 w-full appearance-none rounded-lg border border-line-strong bg-card bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23737784%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat px-4 pr-10 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                  defaultValue=""
                  id="department"
                >
                  <option disabled value="">
                    Select assigned department
                  </option>
                  <option>Emergency Radiology</option>
                  <option>Information Technology</option>
                  <option>Health Informatics</option>
                  <option>Cardiology Unit B</option>
                  <option>Administration</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                  System Access Role
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-row gap-2 cursor-pointer items-center rounded-lg border border-line-strong p-4 transition-colors hover:bg-bg-soft has-[:checked]:border-primary has-[:checked]:bg-brand-soft">
                    <input
                      className="h-4 w-4 border-line-strong text-primary focus:ring-primary"
                      defaultChecked
                      name="role"
                      type="radio"
                      value="staff"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-semibold text-text">
                        Staff
                      </span>
                      <span className="block text-sm text-secondary">
                        Standard ticket submission &amp; portal access.
                      </span>
                    </div>
                  </label>

                  <label className="flex flex-row gap-2 cursor-pointer items-center rounded-lg border border-line-strong p-4 transition-colors hover:bg-bg-soft has-[:checked]:border-primary has-[:checked]:bg-brand-soft">
                    <input
                      className="h-4 w-4 border-line-strong text-primary focus:ring-primary"
                      name="role"
                      type="radio"
                      value="it_admin"
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-semibold text-text">
                        IT Admin
                      </span>
                      <span className="block text-sm text-secondary">
                        Full system configuration &amp; management.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-muted"
                  htmlFor="temp-password"
                >
                  Temporary Password
                </label>
                <div className="relative">
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 pr-12 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="temp-password"
                    placeholder="Temporary password"
                    type="password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-primary"
                    id="togglePassword"
                    type="button"
                  >
                    <Eye className="h-5 w-5" id="eyeIcon" />
                  </button>
                </div>
                <p className="flex items-center gap-1 text-sm text-secondary">
                  <Info className="h-4 w-4" />
                  User will be required to change password on first login.
                </p>
              </div>

              <div className="pt-2">
                <div
                  className="hidden items-start gap-3 rounded-lg border-l-4 border-danger bg-danger-soft p-4 text-danger-dark"
                  id="errorBanner"
                >
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <p className="font-semibold">Validation Error</p>
                    <p className="text-sm">
                      Please ensure the Institutional Email is a valid
                      @medtechsystems.org domain.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-line bg-card-soft p-6 sm:flex-row-reverse">
              <button className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-95">
                Create User Account
                <UserPlus className="h-5 w-5" />
              </button>
              <button className="rounded-lg border border-primary bg-transparent px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
