import React, { useEffect, useState } from "react";
import { Eye, LockKeyhole, Save, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user/me");
        setUser(response.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
                  value={loading ? "Loading..." : user?.fullName || ""}
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
                  value={loading ? "Loading..." : user?.email || ""}
                />
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted">
                  Department
                </label>
                <input
                  className="cursor-not-allowed rounded-lg border border-line bg-bg-soft px-4 py-2.5 text-sm text-muted"
                  readOnly
                  type="text"
                  value={loading ? "Loading..." : user?.department || ""}
                />
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
              {user?.role === "STAFF" && user?.mustChangePass ? (
                <>
                  <p className="text-sm text-secondary">
                    Complete your initial password setup before proceeding.
                  </p>
                  <button
                    onClick={() => navigate("/password-change")}
                    className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-soft"
                    type="button"
                  >
                    Complete Initial Password Setup
                  </button>
                </>
              ) : (
                <p className="text-sm text-secondary">
                  Password changes are managed by your IT administrator after the initial setup.
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Settings;
