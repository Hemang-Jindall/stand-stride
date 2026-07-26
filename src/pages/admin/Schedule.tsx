import {
  useCallback,
  useEffect,
  useState,
} from "react";

import MobileLayout from "../../layouts/MobileLayout";
import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import api from "../../api/api";

import {
  CalendarDays,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Clock,
  X,
} from "lucide-react";

interface Batch {
  id: string;
  name: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  location: string | null;
  batchId: string;

  batch: {
    id: string;
    name: string;
  };
}

interface ScheduleForm {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  batchId: string;
}

const emptyForm: ScheduleForm = {
  title: "",
  description: "",
  date: "",
  startTime: "",
  endTime: "",
  location: "",
  batchId: "",
};

export default function AdminSchedule() {
  const [items, setItems] = useState<
    ScheduleItem[]
  >([]);

  const [batches, setBatches] = useState<
    Batch[]
  >([]);

  const [form, setForm] =
    useState<ScheduleForm>(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // LOAD SCHEDULE + BATCHES
  // =========================

  const loadData = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "You are not logged in."
          );

          return;
        }

        const headers = {
          Authorization:
            `Bearer ${token}`,
        };

        const [
          scheduleResponse,
          batchesResponse,
        ] = await Promise.all([
          api.get(
            "/schedule",
            {
              headers,
            }
          ),

          api.get(
            "/batches",
            {
              headers,
            }
          ),
        ]);

        setItems(
          scheduleResponse.data
        );

        setBatches(
          batchesResponse.data
        );
      } catch (error) {
        console.error(
          "LOAD ADMIN SCHEDULE ERROR:",
          error
        );

        setError(
          "Failed to load schedule."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // FORM HELPERS
  // =========================

  function updateForm(
    field: keyof ScheduleForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);

    setForm(emptyForm);

    setError("");

    setShowForm(true);
  }

  function openEditForm(
    item: ScheduleItem
  ) {
    setEditingId(item.id);

    setForm({
      title: item.title,

      description:
        item.description ?? "",

      date:
        item.date.split("T")[0],

      startTime:
        item.startTime,

      endTime:
        item.endTime,

      location:
        item.location ?? "",

      batchId:
        item.batchId,
    });

    setError("");

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);

    setEditingId(null);

    setForm(emptyForm);
  }

  // =========================
  // CREATE / UPDATE
  // =========================

  async function saveScheduleItem() {
    if (!form.title.trim()) {
      setError(
        "Session title is required."
      );

      return;
    }

    if (!form.batchId) {
      setError(
        "Please select a batch."
      );

      return;
    }

    if (!form.date) {
      setError(
        "Date is required."
      );

      return;
    }

    if (
      !form.startTime ||
      !form.endTime
    ) {
      setError(
        "Start and end time are required."
      );

      return;
    }

    if (
      form.endTime <=
      form.startTime
    ) {
      setError(
        "End time must be after start time."
      );

      return;
    }

    try {
      setSaving(true);

      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in."
        );

        return;
      }

      const config = {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      };

      const payload = {
        title:
          form.title.trim(),

        description:
          form.description.trim(),

        date:
          form.date,

        startTime:
          form.startTime,

        endTime:
          form.endTime,

        location:
          form.location.trim(),

        batchId:
          form.batchId,
      };

      if (editingId) {
        await api.put(
          `/schedule/${editingId}`,
          payload,
          config
        );
      } else {
        await api.post(
          "/schedule",
          payload,
          config
        );
      }

      closeForm();

      await loadData();
    } catch (error: any) {
      console.error(
        "SAVE SCHEDULE ERROR:",
        error
      );

      setError(
        error.response?.data
          ?.message ??
          "Failed to save schedule item."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETE
  // =========================

  async function deleteScheduleItem(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this session?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        setError(
          "You are not logged in."
        );

        return;
      }

      await api.delete(
        `/schedule/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setItems((current) =>
        current.filter(
          (item) =>
            item.id !== id
        )
      );
    } catch (error: any) {
      console.error(
        "DELETE SCHEDULE ERROR:",
        error
      );

      setError(
        error.response?.data
          ?.message ??
          "Failed to delete schedule item."
      );
    }
  }

  // =========================
  // DATE FORMATTER
  // =========================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 overflow-y-auto">
        <section className="mx-5">

          {/* PAGE HEADER */}

          <div className="flex items-center justify-between mb-5">

            <div className="flex items-center gap-2">

              <CalendarDays
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold">
                Schedule
              </h1>

            </div>

            <button
              type="button"
              onClick={
                openCreateForm
              }
              className="bg-emerald-600 text-white rounded-lg px-3 py-2 flex items-center gap-2"
            >
              <Plus size={18} />

              Add
            </button>

          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4">
              {error}
            </div>
          )}

          {/* CREATE / EDIT FORM */}

          {showForm && (
            <div className="bg-white rounded-xl shadow-sm p-4 mb-5">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-semibold">
                  {editingId
                    ? "Edit Session"
                    : "Add Session"}
                </h2>

                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  className="p-1"
                >
                  <X
                    size={20}
                    className="text-slate-500"
                  />
                </button>

              </div>

              <div className="space-y-3">

                {/* BATCH */}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Batch
                  </label>

                  <select
                    value={
                      form.batchId
                    }
                    onChange={(e) =>
                      updateForm(
                        "batchId",
                        e.target.value
                      )
                    }
                    className="mt-1 w-full border rounded-lg p-3 bg-white"
                  >
                    <option value="">
                      Select Batch
                    </option>

                    {batches.map(
                      (batch) => (
                        <option
                          key={
                            batch.id
                          }
                          value={
                            batch.id
                          }
                        >
                          {
                            batch.name
                          }
                        </option>
                      )
                    )}

                  </select>
                </div>

                {/* TITLE */}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Session Title
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Orientation"
                    value={
                      form.title
                    }
                    onChange={(e) =>
                      updateForm(
                        "title",
                        e.target.value
                      )
                    }
                    className="mt-1 w-full border rounded-lg p-3"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Description
                  </label>

                  <textarea
                    placeholder="Session details..."
                    value={
                      form.description
                    }
                    onChange={(e) =>
                      updateForm(
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="mt-1 w-full border rounded-lg p-3 resize-none"
                  />
                </div>

                {/* DATE */}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Date
                  </label>

                  <input
                    type="date"
                    value={
                      form.date
                    }
                    onChange={(e) =>
                      updateForm(
                        "date",
                        e.target.value
                      )
                    }
                    className="mt-1 w-full border rounded-lg p-3"
                  />
                </div>

                {/* TIMES */}

                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      Start Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.startTime
                      }
                      onChange={(e) =>
                        updateForm(
                          "startTime",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full border rounded-lg p-3"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-600">
                      End Time
                    </label>

                    <input
                      type="time"
                      value={
                        form.endTime
                      }
                      onChange={(e) =>
                        updateForm(
                          "endTime",
                          e.target.value
                        )
                      }
                      className="mt-1 w-full border rounded-lg p-3"
                    />
                  </div>

                </div>

                {/* LOCATION */}

                <div>
                  <label className="text-sm font-medium text-slate-600">
                    Location
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Training Hall"
                    value={
                      form.location
                    }
                    onChange={(e) =>
                      updateForm(
                        "location",
                        e.target.value
                      )
                    }
                    className="mt-1 w-full border rounded-lg p-3"
                  />
                </div>

                {/* SAVE */}

                <button
                  type="button"
                  disabled={saving}
                  onClick={
                    saveScheduleItem
                  }
                  className="w-full bg-emerald-600 text-white rounded-lg py-3 font-medium disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Session"}
                </button>

              </div>

            </div>
          )}

          {/* LOADING */}

          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
              Loading schedule...
            </div>
          )}

          {/* EMPTY STATE */}

          {!loading &&
            items.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">
                No schedule items yet.
              </div>
            )}

          {/* SCHEDULE LIST */}

          {!loading &&
            items.length > 0 && (
              <div className="space-y-3">

                {items.map(
                  (item) => (
                    <div
                      key={
                        item.id
                      }
                      className="bg-white rounded-xl shadow-sm p-4"
                    >

                      {/* TITLE */}

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h2 className="font-semibold text-lg">
                            {
                              item.title
                            }
                          </h2>

                          <span className="inline-block mt-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            {
                              item
                                .batch
                                .name
                            }
                          </span>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                item
                              )
                            }
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteScheduleItem(
                                item.id
                              )
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="mt-4 space-y-2 text-sm text-slate-600">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={16}
                          />

                          <span>
                            {formatDate(
                              item.date
                            )}
                          </span>

                        </div>

                        <div className="flex items-center gap-2">

                          <Clock
                            size={16}
                          />

                          <span>
                            {
                              item.startTime
                            }
                            {" – "}
                            {
                              item.endTime
                            }
                          </span>

                        </div>

                        {item.location && (
                          <div className="flex items-center gap-2">

                            <MapPin
                              size={16}
                            />

                            <span>
                              {
                                item.location
                              }
                            </span>

                          </div>
                        )}

                      </div>

                      {/* DESCRIPTION */}

                      {item.description && (
                        <p className="mt-3 text-sm text-slate-500">
                          {
                            item.description
                          }
                        </p>
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