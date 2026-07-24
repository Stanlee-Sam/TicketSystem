import React, { useRef } from "react";
import { ChevronDown, UploadCloud } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Navbar from "../../Components/Navbar";
import { toast } from "sonner";
import axios from "axios";

const validationSchema = Yup.object({
  title: Yup.string().required("Ticket title is required"),
  category: Yup.string().required("Category is required"),
  priority: Yup.string().required("Priority is required"),
  description: Yup.string().required("Description is required"),
  images: Yup.array()
    .max(5, "You can upload up to 5 images")
    .test("fileSize", "Each image must be 10MB or less", (files = []) =>
      files.every((file) => file.size <= 10 * 1024 * 1024)
    )
    .test("fileType", "Only JPG, PNG, and GIF images are allowed", (files = []) =>
      files.every((file) =>
        ["image/jpeg", "image/png", "image/gif"].includes(file.type)
      )
    ),
});

const RaiseTicket = () => {
  const fileInputRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      priority: "",
      description: "",
      images: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const formData = new FormData();

        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("priority", values.priority);
        formData.append("category", values.category);

        values.images.forEach((file) => {
          formData.append(`images`, file);
        });

        const response = await axios.post("http://localhost:5000/ticket", formData);
        toast.success("Ticket submitted successfully!");
        resetForm();

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

      } catch (error) {
        toast.error(error.response?.data.message || "Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div>
      <Navbar />
      <main className="flex min-h-screen items-start justify-center bg-bg px-4 py-10 font-body mt-9">
        <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-line bg-card shadow-sm">
          <div className="border-b border-line bg-card-soft px-6 py-6">
            <h1 className="font-heading text-xl font-semibold text-text">
              Submit a New Support Ticket
            </h1>
            <p className="mt-2 text-sm text-muted">
              Provide details about your technical issue to help our IT team
              assist you.
            </p>
          </div>

          <form
            className="space-y-6 p-6"
            id="support-ticket-form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="ticket-title"
              >
                Ticket Title
              </label>
              <input
                className="w-full rounded-lg border border-line-strong bg-card px-4 py-3 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                id="ticket-title"
                name="title"
                placeholder="Briefly describe the issue, e.g. VPN connection failed"
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError formik={formik} name="title" />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <SelectField
                id="category"
                label="Category"
                name="category"
                options={[
                  ["software", "Software"],
                  ["hardware", "Hardware"],
                  ["network", "Network"],
                  ["printer", "Printer"],
                  ["email", "Email"],
                  ["other", "Other"],
                ]}
                formik={formik}
                placeholder="Select category"
              />
              <SelectField
                id="priority"
                label="Priority"
                name="priority"
                options={[
                  ["low", "Low"],
                  ["medium", "Medium"],
                  ["high", "High"],
                  ["critical", "Critical"],
                ]}
                formik={formik}
                placeholder="Select priority"
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="description"
              >
                Issue Description
              </label>
              <textarea
                className="min-h-36 w-full resize-none rounded-lg border border-line-strong bg-card px-4 py-3 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                id="description"
                name="description"
                placeholder="Provide details about the error, including what steps led to it and any error codes displayed."
                rows={6}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError formik={formik} name="description" />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-muted"
                htmlFor="file-input"
              >
                Upload Supporting Images
              </label>
              <label
                className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line-strong bg-bg-soft p-8 text-center transition-all hover:border-primary hover:bg-brand-soft"
                htmlFor="file-input"
              >
                <UploadCloud
                  className="h-10 w-10 text-muted transition-colors group-hover:text-primary"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-muted">
                  Click or drag files to upload
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
                  Supported formats: JPG, PNG, GIF. Max 10MB.
                </span>
                <input
                  accept="image/*"
                  className="hidden"
                  id="file-input"
                  multiple
                  name="images"
                  onBlur={() => formik.setFieldTouched("images", true)}
                  onChange={(event) => {
                    formik.setFieldValue(
                      "images",
                      Array.from(event.currentTarget.files)
                    );
                  }}
                  ref={fileInputRef}
                  type="file"
                />
              </label>
              {formik.values.images.length > 0 && (
                <ul className="space-y-1 text-sm text-muted">
                  {formik.values.images.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>
                      {file.name}
                    </li>
                  ))}
                </ul>
              )}
              <FieldError formik={formik} name="images" />
            </div>

            <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
              <button
                className="w-full rounded-lg bg-primary px-10 py-3 text-xs font-semibold uppercase tracking-wider text-on-primary shadow-sm transition-all hover:bg-primary-soft active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                disabled={formik.isSubmitting}
                type="submit"
              >
                {formik.isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
              <button
                className="w-full rounded-lg border border-primary px-10 py-3 text-xs font-semibold uppercase tracking-wider text-primary transition-all hover:bg-brand-soft active:scale-95 sm:w-auto"
                onClick={() => {
                  formik.resetForm();
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                type="button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

const SelectField = ({ formik, id, label, name, options, placeholder }) => (
  <div className="space-y-2">
    <label
      className="text-xs font-semibold uppercase tracking-wider text-muted"
      htmlFor={id}
    >
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full appearance-none rounded-lg border border-line-strong bg-card px-4 py-3 pr-10 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
        id={id}
        name={name}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        value={formik.values[name]}
      >
        <option disabled value="">
          {placeholder}
        </option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
        aria-hidden="true"
      />
    </div>
    <FieldError formik={formik} name={name} />
  </div>
);

const FieldError = ({ formik, name }) => {
  if (!formik.touched[name] || !formik.errors[name]) {
    return null;
  }

  return <p className="text-xs font-medium text-danger">{formik.errors[name]}</p>;
};

export default RaiseTicket;
