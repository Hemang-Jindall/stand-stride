import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

interface Batch {
  id: string;
  name: string;
}

export default function AddStudent() {
  const navigate = useNavigate();

  const [batches, setBatches] = useState<Batch[]>([]);

  const [rollNumber, setRollNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [batchId, setBatchId] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================
  // LOAD BATCHES
  // =========================

  useEffect(() => {
    async function loadBatches() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await api.get("/batches", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBatches(response.data);

        if (response.data.length > 0) {
          setBatchId(response.data[0].id);
        }
      } catch (error) {
        console.error("LOAD BATCHES ERROR:", error);

        setError("Failed to load batches.");
      }
    }

    loadBatches();
  }, [navigate]);

  // =========================
  // CREATE STUDENT
  // =========================

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      await api.post(
        "/students",
        {
          rollNumber: rollNumber.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password,
          batchId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/admin/students");
    } catch (error: any) {
      console.error("CREATE STUDENT ERROR:", error);

      setError(
        error.response?.data?.message ??
          "Failed to create student."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">
          <h1 className="text-2xl font-bold mb-4">
            Add Student
          </h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-5 space-y-4"
          >
            {/* Roll Number */}

            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={(e) =>
                setRollNumber(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* First Name */}

            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) =>
                setFirstName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* Last Name */}

            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) =>
                setLastName(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* Email */}

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* Phone */}

            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* Password */}

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-emerald-500"
            />

            {/* Batch */}

            <select
              value={batchId}
              onChange={(e) =>
                setBatchId(e.target.value)
              }
              required
              className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-emerald-500"
            >
              {batches.length === 0 ? (
                <option value="">
                  No batches available
                </option>
              ) : (
                batches.map((batch) => (
                  <option
                    key={batch.id}
                    value={batch.id}
                  >
                    {batch.name}
                  </option>
                ))
              )}
            </select>

            {/* Error */}

            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Submit */}

            <button
              type="submit"
              disabled={
                loading ||
                !batchId ||
                password.length < 6
              }
              className="w-full bg-emerald-600 text-white rounded-xl py-3 font-semibold disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Add Student"}
            </button>
          </form>
        </section>
      </main>

      <AdminBottomNavigation />
    </MobileLayout>
  );
}