import {
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Save,
  ShieldCheck,
} from "lucide-react";
import React, { useMemo, useState } from "react";

const Password = () => {
  const [values, setValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [visible, setVisible] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const requirements = useMemo(
    () => [
      {
        label: "8+ characters required",
        met: values.newPassword.length >= 8,
      },
      {
        label: "Uppercase & lowercase letters",
        met:
          /[a-z]/.test(values.newPassword) &&
          /[A-Z]/.test(values.newPassword),
      },
      {
        label: "One special character (!@#$%^&*)",
        met: /[!@#$%^&*]/.test(values.newPassword),
      },
      {
        label: "At least one numerical digit",
        met: /\d/.test(values.newPassword),
      },
    ],
    [values.newPassword]
  );

  const strength = requirements.filter((requirement) => requirement.met).length;
  const strengthLabels = ["-", "Weak", "Fair", "Good", "Strong"];
  const passwordsMatch =
    values.confirmPassword.length === 0 ||
    values.newPassword === values.confirmPassword;
  const canSubmit =
    values.currentPassword.length > 0 && strength === 4 && passwordsMatch;

  const updateValue = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const toggleVisibility = (field) => {
    setVisible((current) => ({ ...current, [field]: !current[field] }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-4 py-8 font-body">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-3 rounded-lg border border-line bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h1 className="font-heading text-[18px] font-bold text-text">
              Security Update: Change Your Password
            </h1>
            <p className="text-[12px] leading-relaxed text-muted">
              As this is your first time logging in, please set a new secure
              password for your account to ensure HIPAA compliance and system
              security.
            </p>
          </div>

          <form className="space-y-2" id="passwordForm" onSubmit={handleSubmit}>
            <PasswordField
              autoComplete="current-password"
              icon={KeyRound}
              id="current-password"
              label="Current Password"
              name="currentPassword"
              onChange={updateValue}
              onToggle={() => toggleVisibility("currentPassword")}
              placeholder="Enter current password"
              value={values.currentPassword}
              visible={visible.currentPassword}
            />

            <PasswordField
              autoComplete="new-password"
              icon={Lock}
              id="new-password"
              label="New Password"
              name="newPassword"
              onChange={updateValue}
              onToggle={() => toggleVisibility("newPassword")}
              placeholder="At least 8 characters"
              value={values.newPassword}
              visible={visible.newPassword}
            />

            <div className="mt-2">
              <div className="mb-1 flex gap-1">
                {[1, 2, 3, 4].map((segment) => (
                  <div
                    className={`h-1.5 flex-1 rounded-full ${
                      strength >= segment ? "bg-brand" : "bg-card-muted"
                    }`}
                    key={segment}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted">
                  Password Strength
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-subtle">
                  {strengthLabels[strength]}
                </span>
              </div>
            </div>

            <PasswordField
              autoComplete="new-password"
              error={!passwordsMatch}
              icon={ShieldCheck}
              id="confirm-password"
              label="Confirm New Password"
              name="confirmPassword"
              onChange={updateValue}
              onToggle={() => toggleVisibility("confirmPassword")}
              placeholder="Re-enter new password"
              value={values.confirmPassword}
              visible={visible.confirmPassword}
            />
            {!passwordsMatch && (
              <p className="text-xs font-medium text-danger">
                New password and confirmation do not match.
              </p>
            )}

            <div className="rounded-lg border border-line bg-bg-soft p-4">
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Security Requirements
              </h4>
              <ul className="space-y-2">
                {requirements.map((requirement) => (
                  <li
                    className={`flex items-center gap-2 text-[12px] transition-colors ${
                      requirement.met ? "text-success" : "text-subtle"
                    }`}
                    key={requirement.label}
                  >
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    {requirement.label}
                  </li>
                ))}
              </ul>
            </div>

            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold uppercase tracking-widest text-on-primary shadow-sm transition-all hover:bg-primary-soft disabled:cursor-not-allowed disabled:opacity-60"
              disabled={!canSubmit}
              type="submit"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              Save New Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

const PasswordField = ({
  autoComplete,
  error = false,
  icon: Icon,
  id,
  label,
  name,
  onChange,
  onToggle,
  placeholder,
  value,
  visible,
}) => (
  <div className="space-y-2">
    <label className="text-[12px] font-semibold text-text" htmlFor={id}>
      {label}
    </label>
    <div
      className={`relative flex h-11 items-center overflow-hidden rounded-lg border bg-card transition-all focus-within:ring-2 ${
        error
          ? "border-danger focus-within:border-danger focus-within:ring-danger-soft"
          : "border-line-strong focus-within:border-brand focus-within:ring-brand-soft"
      }`}
    >
      <Icon className="mx-3 h-4 w-4 text-subtle" aria-hidden="true" />
      <input
        autoComplete={autoComplete}
        className="w-full border-none bg-transparent px-0 text-sm text-text outline-none placeholder:text-subtle"
        id={id}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={visible ? "text" : "password"}
        value={value}
      />
      <button
        aria-label={`Toggle ${label.toLowerCase()} visibility`}
        className="px-3 text-subtle transition-colors hover:text-brand"
        onClick={onToggle}
        type="button"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

export default Password;
