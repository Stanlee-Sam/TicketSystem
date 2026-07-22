import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Info,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import Sidebar from "../../Components/Sidebar";

// Validation schema
const validationSchema = Yup.object({
  fullName: Yup.string().trim().required("Full name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  department: Yup.string().trim(),
  role: Yup.string()
    .trim()
    .oneOf(["staff", "it_admin"], "Please select a role")
    .required("Role is required"),
  password: Yup.string()
    .trim()
    .min(6, "Password must be at least 6 characters")
    .required("Temporary password is required"),
});

const CreateUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch departments on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get("http://localhost:5000/department");
        setDepartments(response.data);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      department: "",
      role: "staff",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setIsSubmitting(true);
        const payload = {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role,
          mustChangePass: true,
          isActive: true,
        };
        if (values.department) {
          payload.department = values.department;
        }
        await axios.post("http://localhost:5000/user/create", payload);
        toast.success("User created successfully!");
        resetForm();
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to create user";
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
        setIsSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="flex p-10 min-h-screen items-center justify-center px-4 py-12 lg:pl-80 xl:pl-72">
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
            <form
              className="space-y-5 p-6"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-muted"
                    htmlFor="fullName"
                  >
                    Full Name
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="fullName"
                    name="fullName"
                    placeholder="Dr. Sarah Jenkins"
                    type="text"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.fullName && formik.errors.fullName && (
                    <p className="text-xs font-medium text-danger">
                      {formik.errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className="block text-xs font-bold uppercase tracking-wider text-muted"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="email"
                    name="email"
                    placeholder="s.jenkins@medtechsystems.org"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs font-medium text-danger">
                      {formik.errors.email}
                    </p>
                  )}
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
                  id="department"
                  name="department"
                  value={formik.values.department}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option disabled value="">
                    Select assigned department
                  </option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {formik.touched.department && formik.errors.department && (
                  <p className="text-xs font-medium text-danger">
                    {formik.errors.department}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                  System Access Role
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-row gap-2 cursor-pointer items-center rounded-lg border border-line-strong p-4 transition-colors hover:bg-bg-soft has-[:checked]:border-primary has-[:checked]:bg-brand-soft">
                    <input
                      className="h-4 w-4 border-line-strong text-primary focus:ring-primary"
                      name="role"
                      type="radio"
                      value="staff"
                      checked={formik.values.role === "staff"}
                      onChange={formik.handleChange}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-semibold text-text">
                        Staff
                      </span>
                      <span className="block text-sm text-secondary">
                        Standard ticket submission & portal access.
                      </span>
                    </div>
                  </label>

                  <label className="flex flex-row gap-2 cursor-pointer items-center rounded-lg border border-line-strong p-4 transition-colors hover:bg-bg-soft has-[:checked]:border-primary has-[:checked]:bg-brand-soft">
                    <input
                      className="h-4 w-4 border-line-strong text-primary focus:ring-primary"
                      name="role"
                      type="radio"
                      value="it_admin"
                      checked={formik.values.role === "it_admin"}
                      onChange={formik.handleChange}
                    />
                    <div className="ml-3">
                      <span className="block text-sm font-semibold text-text">
                        IT Admin
                      </span>
                      <span className="block text-sm text-secondary">
                        Full system configuration & management.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  className="block text-xs font-bold uppercase tracking-wider text-muted"
                  htmlFor="password"
                >
                  Temporary Password
                </label>
                <div className="relative">
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 pr-12 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    id="password"
                    name="password"
                    placeholder="Temporary password"
                    type={showPassword ? "text" : "password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted transition-colors hover:text-primary"
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs font-medium text-danger">
                    {formik.errors.password}
                  </p>
                )}
                <p className="flex items-center gap-1 text-sm text-secondary">
                  <Info className="h-4 w-4" />
                  User will be required to change password on first login.
                </p>
              </div>

              <div className="pt-2">
                {formik.errors.general && (
                  <div className="flex items-start gap-3 rounded-lg border-l-4 border-danger bg-danger-soft p-4 text-danger-dark">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                      <p className="font-semibold">Validation Error</p>
                      <p className="text-sm">{formik.errors.general}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-line bg-card-soft p-6 sm:flex-row-reverse">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <ClipLoader size={20} />
                  ) : (
                    <>
                      Create User Account
                      <UserPlus className="h-5 w-5" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="rounded-lg border border-primary bg-transparent px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateUser;
