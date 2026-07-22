import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  Building,
  X,
  Save,
  Plus,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import EmptyState from "../../Components/EmptyState";
import { HashLoader } from "react-spinners";

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Edit/Create fields state
  const [editName, setEditName] = useState("");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/department");
      setDepartments(response.data);
    } catch (error) {
      toast.error("Failed to load departments");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleEditClick = (department) => {
    setEditingDepartment(department);
    setEditName(department.name || "");
    setIsCreating(false);
  };

  const handleCreateClick = () => {
    setEditingDepartment(null);
    setEditName("");
    setIsCreating(true);
  };

  const handleSaveDepartment = async () => {
    if (!editName.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      if (isCreating) {
        await axios.post("http://localhost:5000/department", {
          name: editName,
        });
        toast.success("Department created successfully!");
      } else {
        await axios.put(`http://localhost:5000/department/${editingDepartment.id}`, {
          name: editName,
        });
        toast.success("Department updated successfully!");
      }
      setEditingDepartment(null);
      setIsCreating(false);
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save department");
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (!window.confirm("Are you sure you want to delete this department? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/department/${departmentId}`);
      toast.success("Department deleted successfully!");
      fetchDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete department");
    }
  };

  const closeModal = () => {
    setEditingDepartment(null);
    setIsCreating(false);
    setEditName("");
  };

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-5 p-10 overflow-y-auto bg-bg lg:pl-80 xl:pl-72">
        <div className="flex flex-col gap-2 py-3 md:flex-row md:justify-between md:items-end">
          <div>
            <h1 className="text-3xl font-bold text-text">Department Administration</h1>
            <p className="text-secondary">
              Manage hospital departments and organizational units.
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary-soft hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            Add Department
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-[50dvh]">
              <HashLoader color="#003c90" />
            </div>
          ) : departments.length === 0 ? (
            <EmptyState
              title="No departments found"
              description="There are no departments in the system yet. Create a new department to get started."
              actionLabel="Add Department"
              onAction={handleCreateClick}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-line bg-card-soft">
                  <tr>
                    {["Department Name", "Actions"].map((heading) => (
                      <th
                        className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-muted ${
                          heading === "Actions" ? "text-right" : ""
                        }`}
                        key={heading}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {departments.map((department) => (
                    <tr className="transition-colors hover:bg-bg-soft" key={department.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Building className="text-primary h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold text-text">
                            {department.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(department)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                            title="Edit Department"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department.id)}
                            className="p-2 rounded-lg text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                            title="Delete Department"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(editingDepartment || isCreating) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-card shadow-2xl">
              <header className="flex items-start justify-between gap-4 border-b border-line bg-card-soft px-5 py-4">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary">
                    {isCreating ? "New Department" : `ID: ${editingDepartment?.id?.substring(0, 8)}...`}
                  </span>
                  <h2 className="text-xl font-bold text-text">
                    {isCreating ? "Create Department" : "Edit Department"}
                  </h2>
                </div>
                <button
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-card-muted hover:text-danger"
                  onClick={closeModal}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="space-y-4 p-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Department Name
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g., Cardiology, Emergency Room, Pharmacy"
                  />
                </div>
              </div>

              <footer className="flex justify-end gap-3 border-t border-line bg-card-soft px-5 py-4">
                <button
                  className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 cursor-pointer"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveDepartment}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95 cursor-pointer"
                  type="button"
                >
                  <Save className="h-5 w-5" />
                  {isCreating ? "Create Department" : "Save Changes"}
                </button>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageDepartments;
