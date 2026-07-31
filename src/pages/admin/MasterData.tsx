import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  hasPermission,
} from "../../utils/permissions";

import {
  Database,
  Plus,
  Pencil,
  Trash2,
  LoaderCircle,
} from "lucide-react";

// =========================
// Types
// =========================

interface MasterDataRecord {
  id: string;
  role: string;
  name: string;
  whatsapp: string | null;
  center: string | null;
  purpose: string | null;
  mapUrl: string | null;
  formUrl: string | null;
  driveUrl: string | null;
  mentorId: string | null;
}

interface MasterDataForm {
  role: string;
  name: string;
  whatsapp: string;
  center: string;
  purpose: string;
}

// =========================
// Empty Form
// =========================

const emptyForm: MasterDataForm = {
  role: "",
  name: "",
  whatsapp: "",
  center: "",
  purpose: "",
};

// =========================
// Component
// =========================

export default function MasterData() {
  const navigate =
    useNavigate();

  const [records, setRecords] =
    useState<
      MasterDataRecord[]
    >([]);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [adding, setAdding] =
    useState(false);

  const [form, setForm] =
    useState<MasterDataForm>(
      emptyForm
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<
      string | null
    >(null);

  const [error, setError] =
    useState("");

  // =========================
  // Permissions
  // =========================

  const canManageMasterData =
    hasPermission(
      "MANAGE_MASTER_DATA"
    );

  // =========================
  // Auth Header
  // =========================

  const getAuthHeaders =
    useCallback(() => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate(
          "/login",
          {
            replace: true,
          }
        );

        return null;
      }

      return {
        Authorization:
          `Bearer ${token}`,
      };
    }, [navigate]);

  // =========================
  // Load Master Data
  // =========================

  const loadRecords =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const headers =
          getAuthHeaders();

        if (!headers) {
          return;
        }

        const response =
          await api.get<
            MasterDataRecord[]
          >(
            "/master-data",
            {
              headers,
            }
          );

        setRecords(
          response.data
        );
      } catch (error: any) {
        console.error(
          "LOAD MASTER DATA ERROR:",
          error
        );

        if (
          error.response
            ?.status === 401
        ) {
          localStorage.removeItem(
            "token"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        setError(
          error.response?.data
            ?.message ??
            "Failed to load master data."
        );
      } finally {
        setLoading(false);
      }
    }, [
      getAuthHeaders,
      navigate,
    ]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  // =========================
  // Start Add
  // =========================

  function startAdd() {
    if (
      !canManageMasterData
    ) {
      return;
    }

    setAdding(true);
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setError("");
  }

  // =========================
  // Start Edit
  // =========================

  function startEdit(
    record: MasterDataRecord
  ) {
    if (
      !canManageMasterData
    ) {
      return;
    }

    setAdding(false);

    setEditingId(
      record.id
    );

    setError("");

    setForm({
      role:
        record.role,

      name:
        record.name,

      whatsapp:
        record.whatsapp ??
        "",

      center:
        record.center ??
        "",

      purpose:
        record.purpose ??
        "",
    });
  }

  // =========================
  // Cancel Form
  // =========================

  function cancelForm() {
    setAdding(false);

    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setError("");
  }

  // =========================
  // Save Record
  // =========================

  async function saveRecord() {
    if (
      !canManageMasterData
    ) {
      return;
    }

    if (
      !form.role.trim() ||
      !form.name.trim()
    ) {
      setError(
        "Role and name are required."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      const headers =
        getAuthHeaders();

      if (!headers) {
        return;
      }

      const payload = {
        role:
          form.role.trim(),

        name:
          form.name.trim(),

        whatsapp:
          form.whatsapp
            .trim(),

        center:
          form.center
            .trim(),

        purpose:
          form.purpose
            .trim(),
      };

      if (adding) {
        await api.post(
          "/master-data",
          payload,
          {
            headers,
          }
        );
      } else if (
        editingId
      ) {
        await api.put(
          `/master-data/${editingId}`,
          payload,
          {
            headers,
          }
        );
      } else {
        return;
      }

      setAdding(false);

      setEditingId(
        null
      );

      setForm({
        ...emptyForm,
      });

      await loadRecords();
    } catch (error: any) {
      console.error(
        "SAVE MASTER DATA ERROR:",
        error
      );

      setError(
        error.response?.data
          ?.message ??
          "Failed to save record."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // Delete Record
  // =========================

  async function deleteRecord(
    id: string
  ) {
    if (
      !canManageMasterData
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this record?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const headers =
        getAuthHeaders();

      if (!headers) {
        return;
      }

      await api.delete(
        `/master-data/${id}`,
        {
          headers,
        }
      );

      setRecords(
        (current) =>
          current.filter(
            (record) =>
              record.id !==
              id
          )
      );

      if (
        editingId === id
      ) {
        cancelForm();
      }
    } catch (error: any) {
      console.error(
        "DELETE MASTER DATA ERROR:",
        error
      );

      setError(
        error.response?.data
          ?.message ??
          "Failed to delete record."
      );
    } finally {
      setDeletingId(
        null
      );
    }
  }

  // =========================
  // Form State
  // =========================

  const formOpen =
    canManageMasterData &&
    (
      adding ||
      editingId !== null
    );

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          {/* =========================
              Header
          ========================= */}

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-2">

              <Database
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold">
                Master Data
              </h1>

            </div>

            {/* Add only for users with
                MANAGE_MASTER_DATA */}

            {canManageMasterData && (

              <button
                type="button"
                onClick={
                  startAdd
                }
                disabled={
                  saving ||
                  deletingId !==
                    null
                }
                className="bg-emerald-600 text-white rounded-lg px-3 py-2 flex items-center gap-2 disabled:opacity-50"
              >

                <Plus
                  size={18}
                />

                Add

              </button>

            )}

          </div>

          {/* =========================
              Error
          ========================= */}

          {error && (

            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">

              {error}

            </div>

          )}

          {/* =========================
              Add / Edit Form
          ========================= */}

          {formOpen && (

            <div className="bg-white rounded-xl shadow-sm p-4 mb-5 space-y-3">

              <h2 className="font-semibold">

                {adding
                  ? "Add Record"
                  : "Edit Record"}

              </h2>

              {/* Role */}

              <select
                value={
                  form.role
                }
                disabled={saving}
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,

                      role:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border rounded-lg p-2 bg-white disabled:opacity-50"
              >

                <option value="">
                  Select Role
                </option>

                <option value="Mentor">
                  Mentor
                </option>

                <option value="Facilitator">
                  Facilitator
                </option>

                <option value="Venue">
                  Venue
                </option>

              </select>

              {/* Name */}

              <input
                type="text"
                placeholder="Name"
                value={
                  form.name
                }
                disabled={saving}
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,

                      name:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border rounded-lg p-2 disabled:bg-slate-100"
              />

              {/* WhatsApp */}

              <input
                type="tel"
                placeholder="WhatsApp"
                value={
                  form.whatsapp
                }
                disabled={saving}
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,

                      whatsapp:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border rounded-lg p-2 disabled:bg-slate-100"
              />

              {/* Center */}

              <input
                type="text"
                placeholder="Center"
                value={
                  form.center
                }
                disabled={saving}
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,

                      center:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border rounded-lg p-2 disabled:bg-slate-100"
              />

              {/* Purpose */}

              <input
                type="text"
                placeholder="Purpose"
                value={
                  form.purpose
                }
                disabled={saving}
                onChange={(e) =>
                  setForm(
                    (current) => ({
                      ...current,

                      purpose:
                        e.target
                          .value,
                    })
                  )
                }
                className="w-full border rounded-lg p-2 disabled:bg-slate-100"
              />

              {/* Buttons */}

              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={
                    saveRecord
                  }
                  disabled={saving}
                  className="flex-1 bg-emerald-600 text-white rounded-lg py-2 disabled:opacity-50"
                >

                  {saving
                    ? "Saving..."
                    : "Save"}

                </button>

                <button
                  type="button"
                  onClick={
                    cancelForm
                  }
                  disabled={saving}
                  className="flex-1 border rounded-lg py-2 disabled:opacity-50"
                >

                  Cancel

                </button>

              </div>

            </div>

          )}

          {/* =========================
              Loading
          ========================= */}

          {loading && (

            <div className="bg-white rounded-xl shadow-sm p-8 flex items-center justify-center gap-2 text-slate-500">

              <LoaderCircle
                size={20}
                className="animate-spin"
              />

              Loading...

            </div>

          )}

          {/* =========================
              Empty
          ========================= */}

          {!loading &&
            records.length ===
              0 && (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">

              No master data records yet.

            </div>

          )}

          {/* =========================
              Records
          ========================= */}

          {!loading && (

            <div className="space-y-3">

              {records.map(
                (record) => (

                  <div
                    key={
                      record.id
                    }
                    className="bg-white rounded-xl shadow-sm p-4"
                  >

                    {/* Basic Info */}

                    <div>

                      <h2 className="font-semibold">
                        {
                          record.name
                        }
                      </h2>

                      <p className="text-sm text-slate-500">
                        {
                          record.role
                        }
                      </p>

                    </div>

                    {/* Details */}

                    <div className="mt-3 text-sm space-y-1">

                      {record.whatsapp && (

                        <p>

                          <strong>
                            WhatsApp:
                          </strong>{" "}

                          {
                            record.whatsapp
                          }

                        </p>

                      )}

                      {record.center && (

                        <p>

                          <strong>
                            Center:
                          </strong>{" "}

                          {
                            record.center
                          }

                        </p>

                      )}

                      {record.purpose && (

                        <p>

                          <strong>
                            Purpose:
                          </strong>{" "}

                          {
                            record.purpose
                          }

                        </p>

                      )}

                    </div>

                    {/* =========================
                        Management Controls
                    ========================= */}

                    {canManageMasterData && (

                      <div className="flex gap-2 mt-4">

                        {/* Edit */}

                        <button
                          type="button"
                          disabled={
                            saving ||
                            deletingId !==
                              null
                          }
                          onClick={() =>
                            startEdit(
                              record
                            )
                          }
                          className="flex-1 border rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
                        >

                          <Pencil
                            size={16}
                          />

                          Edit

                        </button>

                        {/* Delete */}

                        <button
                          type="button"
                          disabled={
                            saving ||
                            deletingId !==
                              null
                          }
                          onClick={() =>
                            deleteRecord(
                              record.id
                            )
                          }
                          className="flex-1 bg-red-500 text-white rounded-lg py-2 flex justify-center items-center gap-2 disabled:opacity-50"
                        >

                          {deletingId ===
                          record.id ? (

                            <LoaderCircle
                              size={16}
                              className="animate-spin"
                            />

                          ) : (

                            <Trash2
                              size={16}
                            />

                          )}

                          {deletingId ===
                          record.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

                      </div>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}