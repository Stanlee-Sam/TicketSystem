import React from "react";
import { Eye, LockKeyhole, Save, User } from "lucide-react";
import Navbar from "../../Components/Navbar";

const Settings = () => {
  return (
    <div className="min-h-screen bg-bg ">
      <Navbar />
      <main className="flex min-h-screen justify-center px-4 py-12 mt-9">
        <div className="flex w-full max-w-2xl flex-col gap-5">
          <div className="mb-1">
            <h1 className="mb-2 font-heading text-3xl font-bold text-text">
              Account Settings
            </h1>
            <p className="text-sm text-secondary">
              Manage your institutional profile and security credentials.
            </p>
          </div>

          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
            <div className="border-b border-line bg-card-soft p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                <User className="h-5 w-5" />
                Profile Information
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Full Name
                </label>
                <input
                  className="cursor-not-allowed rounded-lg border border-line bg-bg-soft px-4 py-2.5 text-sm text-muted"
                  readOnly
                  type="text"
                  value="Dr. Sarah Jenkins"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Institutional Email
                </label>
                <input
                  className="cursor-not-allowed rounded-lg border border-line bg-bg-soft px-4 py-2.5 text-sm text-muted"
                  readOnly
                  type="email"
                  value="s.jenkins@wama-hospital.org"
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Department
                </label>
                <select className="rounded-lg border border-line-strong bg-card px-4 py-2.5 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft">
                  <option>Information Technology</option>
                  <option>Emergency Medicine</option>
                  <option>Cardiology</option>
                  <option>Nursing Administration</option>
                  <option>Radiology</option>
                </select>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
            <div className="border-b border-line bg-card-soft p-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
                <LockKeyhole className="h-5 w-5" />
                Password Management
              </h2>
            </div>

            <div className="flex flex-col gap-5 p-5">
              <div className="grid grid-cols-1 gap-4">
                <PasswordField id="current-pass" label="Current Password" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <PasswordField id="new-pass" label="New Password" />
                  <PasswordField id="confirm-pass" label="Confirm New Password" />
                </div>
              </div>
            </div>
          </section>

          <div className="mt-2 flex flex-col-reverse items-center justify-end gap-4 md:flex-row">
            <button className="w-full rounded-lg border border-primary px-8 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 active:scale-95 md:w-auto">
              Cancel
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-95 md:w-auto">
              <Save className="h-5 w-5" />
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

const PasswordField = ({ id, label }) => (
  <div className="flex flex-col gap-2">
    <label
      className="text-xs font-bold uppercase tracking-wider text-muted"
      htmlFor={id}
    >
      {label}
    </label>
    <div className="relative">
      <input
        className="w-full rounded-lg border border-line-strong bg-card px-4 py-2.5 pr-12 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
        id={id}
        placeholder="Temporary password"
        type="password"
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-primary"
        type="button"
      >
        <Eye className="h-5 w-5" />
      </button>
    </div>
  </div>
);

export default Settings;
