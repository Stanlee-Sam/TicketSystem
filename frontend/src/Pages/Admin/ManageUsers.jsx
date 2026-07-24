import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Pencil,
  Trash2,
  User,
  Mail,
  X,
  Save,
  Shield,
  Building,
  Lock,
} from "lucide-react";
import Sidebar from "../../Components/Sidebar";
import EmptyState from "../../Components/EmptyState";
import { HashLoader } from "react-spinners";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit fields state
  const [editFullName, setEditFullName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDepartmentName, setEditDepartmentName] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/user");
      setUsers(response.data);
    } catch (error) {
      const status = error.response?.status;
      console.error("Failed to fetch users", { status, data: error.response?.data });
      if (status === 401) {
        toast.error("Unauthorized — please sign in as an admin");
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/department");
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUsers();
      await fetchDepartments();
    };
    init();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFullName(user.fullName || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "STAFF");
    setEditDepartmentName(user.department?.name || "");
    setEditPassword(""); // Blank initially, only update if admin enters a value
  };

  const handleUpdateUser = async () => {
    if (!editFullName.trim() || !editEmail.trim()) {
      toast.error("Full Name and Email are required");
      return;
    }

    try {
      const payload = {
        fullName: editFullName,
        email: editEmail,
        role: editRole,
        department: editDepartmentName || null,
      };

      if (editPassword.trim() !== "") {
        payload.password = editPassword;
      }

      await axios.put(`http://localhost:5000/api/user/${editingUser.id}`, payload);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/user/${userId}`);
      toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-5 p-10 overflow-y-auto bg-bg lg:pl-80 xl:pl-72">
        <div className="flex flex-col gap-2 py-3">
          <h1 className="text-3xl font-bold text-text">User Administration</h1>
          <p className="text-secondary">
            Manage hospital staff accounts, roles, departments, and credentials.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-line bg-card shadow-sm">
          {loading ? (
            <div className="flex items-center justify-center h-[50dvh]">
              <HashLoader color="#003c90" />
            </div>
          ) : users.length === 0 ? (
            <EmptyState
              title="No users found"
              description="There are no users in the system yet. Create a new user account to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="border-b border-line bg-card-soft">
                  <tr>
                    {["Full Name", "Email", "Role", "Department", "Actions"].map((heading) => (
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
                  {users.map((user) => (
                    <tr className="transition-colors hover:bg-bg-soft" key={user.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <User className="text-primary h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-text">
                            {user.fullName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text">
                        <div className="flex items-center gap-2 text-muted">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${
                            user.role === "IT_ADMIN"
                              ? "bg-danger-soft text-danger-dark border border-danger/20"
                              : "bg-primary-soft text-primary border border-primary/20"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-subtle" />
                          <span>{user.department?.name || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(user)}
                            className="p-2 rounded-lg text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 rounded-lg text-danger hover:bg-danger/5 transition-colors cursor-pointer"
                            title="Delete User"
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

        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-lg border border-line bg-card shadow-2xl">
              <header className="flex items-start justify-between gap-4 border-b border-line bg-card-soft px-5 py-4">
                <div>
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-primary">
                    ID: {editingUser.id.substring(0, 8)}...
                  </span>
                  <h2 className="text-xl font-bold text-text">Edit User Profile</h2>
                </div>
                <button
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-card-muted hover:text-danger"
                  onClick={() => setEditingUser(null)}
                  type="button"
                >
                  <X className="h-5 w-5" />
                </button>
              </header>

              <div className="space-y-4 p-5 overflow-y-auto max-h-[70vh]">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Full Name
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Email Address
                  </label>
                  <input
                    className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Role
                  </label>
                  <div className="relative">
                    <select
                      className="h-11 w-full appearance-none rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                    >
                      <option value="STAFF">Staff (STAFF)</option>
                      <option value="IT_ADMIN">IT Administrator (IT_ADMIN)</option>
                    </select>
                    <Shield className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Department
                  </label>
                  <div className="relative">
                    <select
                      className="h-11 w-full appearance-none rounded-lg border border-line-strong bg-card px-4 text-sm text-text transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                      value={editDepartmentName}
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                    >
                      <option value="">No Department / N/A</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                    <Building className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-line">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted">
                    Change Password
                  </label>
                  <div className="relative">
                    <input
                      className="h-11 w-full rounded-lg border border-line-strong bg-card px-4 pr-10 text-sm text-text transition-all placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-brand-soft"
                      type="password"
                      placeholder="Enter new password (leave blank to keep current)"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                    />
                    <Lock className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
                  </div>
                </div>
              </div>

              <footer className="flex justify-end gap-3 border-t border-line bg-card-soft px-5 py-4">
                <button
                  className="rounded-lg border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 cursor-pointer"
                  onClick={() => setEditingUser(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateUser}
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-soft active:scale-95 cursor-pointer"
                  type="button"
                >
                  <Save className="h-5 w-5" />
                  Save Changes
                </button>
              </footer>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageUsers;