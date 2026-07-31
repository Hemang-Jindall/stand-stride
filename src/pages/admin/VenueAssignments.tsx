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
  MapPinned,
  MapPin,
  Plus,
  Users,
  X,
} from "lucide-react";

// =========================
// Types
// =========================

interface Venue {
  id: string;
  name: string;
  address: string | null;

  _count?: {
    batches: number;
  };
}

interface Batch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venueId: string | null;

  venue: {
    id: string;
    name: string;
    address: string | null;
  } | null;

  _count?: {
    students: number;
  };
}

// =========================
// Component
// =========================

export default function VenueAssignments() {
  const navigate =
    useNavigate();

  const [venues, setVenues] =
    useState<Venue[]>([]);

  const [batches, setBatches] =
    useState<Batch[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    savingBatchId,
    setSavingBatchId,
  ] = useState<
    string | null
  >(null);

  const [
    showAddVenue,
    setShowAddVenue,
  ] = useState(false);

  const [
    creatingVenue,
    setCreatingVenue,
  ] = useState(false);

  const [
    venueForm,
    setVenueForm,
  ] = useState({
    name: "",
    address: "",
  });

  // =========================
  // Permissions
  // =========================

  const canViewVenues =
    hasPermission(
      "VIEW_VENUES"
    );

  const canAssignVenues =
    hasPermission(
      "ASSIGN_VENUES"
    );

  const canCreateVenues =
    hasPermission(
      "CREATE_VENUES"
    );

  // =========================
  // Clear Session
  // =========================

  const clearSession =
    useCallback(() => {
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "admin"
      );

      localStorage.removeItem(
        "student"
      );

      localStorage.removeItem(
        "role"
      );

      localStorage.removeItem(
        "adminRole"
      );

      navigate(
        "/login",
        {
          replace: true,
        }
      );
    }, [navigate]);

  // =========================
  // Auth Headers
  // =========================

  const getAuthHeaders =
    useCallback(() => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        clearSession();

        return null;
      }

      return {
        Authorization:
          `Bearer ${token}`,
      };
    }, [clearSession]);

  // =========================
  // Load Data
  // =========================

  const loadData =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "token"
          );

        const role =
          localStorage.getItem(
            "role"
          );

        if (
          !token ||
          role !== "admin"
        ) {
          clearSession();

          return;
        }

        if (!canViewVenues) {
          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        const headers = {
          Authorization:
            `Bearer ${token}`,
        };

        const [
          batchesResponse,
          venuesResponse,
        ] = await Promise.all([
          api.get(
            "/batches",
            {
              headers,
            }
          ),

          api.get(
            "/batches/venues",
            {
              headers,
            }
          ),
        ]);

        setBatches(
          batchesResponse.data
        );

        setVenues(
          venuesResponse.data
        );
      } catch (error: any) {
        console.error(
          "LOAD VENUE ASSIGNMENTS ERROR:",
          error
        );

        if (
          error.response?.status ===
          401
        ) {
          clearSession();

          return;
        }

        if (
          error.response?.status ===
          403
        ) {
          navigate(
            "/admin/dashboard",
            {
              replace: true,
            }
          );

          return;
        }

        setError(
          error.response?.data
            ?.message ??
            "Failed to load venue assignments."
        );
      } finally {
        setLoading(false);
      }
    }, [
      canViewVenues,
      clearSession,
      navigate,
    ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // =========================
  // Create Venue
  // =========================

  async function createVenue() {
    if (!canCreateVenues) {
      setError(
        "You do not have permission to create venues."
      );

      return;
    }

    if (
      !venueForm.name.trim()
    ) {
      setError(
        "Venue name is required."
      );

      return;
    }

    try {
      setCreatingVenue(true);
      setError("");

      const headers =
        getAuthHeaders();

      if (!headers) {
        return;
      }

      await api.post(
        "/batches/venues",
        {
          name:
            venueForm.name.trim(),

          address:
            venueForm.address
              .trim() ||
            null,
        },
        {
          headers,
        }
      );

      setVenueForm({
        name: "",
        address: "",
      });

      setShowAddVenue(false);

      await loadData();
    } catch (error: any) {
      console.error(
        "CREATE VENUE ERROR:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        clearSession();

        return;
      }

      if (
        error.response?.status ===
        403
      ) {
        setError(
          "You do not have permission to create venues."
        );

        return;
      }

      setError(
        error.response?.data
          ?.message ??
          "Failed to create venue."
      );
    } finally {
      setCreatingVenue(false);
    }
  }

  // =========================
  // Update Batch Venue
  // =========================

  async function updateVenue(
    batchId: string,
    venueId: string
  ) {
    if (!canAssignVenues) {
      setError(
        "You do not have permission to assign venues."
      );

      return;
    }

    if (!venueId) {
      return;
    }

    try {
      setSavingBatchId(
        batchId
      );

      setError("");

      const headers =
        getAuthHeaders();

      if (!headers) {
        return;
      }

      await api.put(
        `/batches/${batchId}/venue`,
        {
          venueId,
        },
        {
          headers,
        }
      );

      await loadData();
    } catch (error: any) {
      console.error(
        "UPDATE VENUE ERROR:",
        error
      );

      if (
        error.response?.status ===
        401
      ) {
        clearSession();

        return;
      }

      if (
        error.response?.status ===
        403
      ) {
        setError(
          "You do not have permission to assign venues."
        );

        return;
      }

      setError(
        error.response?.data
          ?.message ??
          "Failed to update venue."
      );
    } finally {
      setSavingBatchId(null);
    }
  }

  // =========================
  // Date
  // =========================

  function formatDate(
    date: string
  ) {
    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
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

          {/* =========================
              Heading
          ========================= */}

          <div className="flex items-center justify-between gap-3 mb-5">

            <div className="flex items-center gap-2">

              <MapPinned
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold">
                Venue Assignment
              </h1>

            </div>

            {/* Only ADMIN currently has
                CREATE_VENUES */}

            {canCreateVenues && (

              <button
                type="button"
                onClick={() => {
                  setError("");

                  setShowAddVenue(
                    true
                  );
                }}
                className="bg-emerald-600 text-white rounded-lg p-2"
                title="Add venue"
              >

                <Plus size={20} />

              </button>

            )}

          </div>

          {/* =========================
              Error
          ========================= */}

          {error && (

            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-4">

              {error}

            </div>

          )}

          {/* =========================
              Add Venue
          ========================= */}

          {showAddVenue &&
            canCreateVenues && (

            <div className="bg-white rounded-xl shadow-sm p-4 mb-5">

              <div className="flex items-center justify-between mb-4">

                <h2 className="font-semibold text-lg">
                  Add Venue
                </h2>

                <button
                  type="button"
                  disabled={
                    creatingVenue
                  }
                  onClick={() => {
                    setShowAddVenue(
                      false
                    );

                    setVenueForm({
                      name: "",
                      address: "",
                    });

                    setError("");
                  }}
                  className="text-slate-500 disabled:opacity-50"
                >

                  <X size={20} />

                </button>

              </div>

              <div className="space-y-3">

                {/* Venue Name */}

                <input
                  type="text"
                  placeholder="Venue name"
                  value={
                    venueForm.name
                  }
                  disabled={
                    creatingVenue
                  }
                  onChange={(e) =>
                    setVenueForm(
                      (current) => ({
                        ...current,

                        name:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-emerald-600 disabled:bg-slate-100"
                />

                {/* Address */}

                <textarea
                  placeholder="Address (optional)"
                  value={
                    venueForm.address
                  }
                  disabled={
                    creatingVenue
                  }
                  onChange={(e) =>
                    setVenueForm(
                      (current) => ({
                        ...current,

                        address:
                          e.target
                            .value,
                      })
                    )
                  }
                  className="w-full border rounded-lg p-3 outline-none focus:border-emerald-600 resize-none disabled:bg-slate-100"
                  rows={3}
                />

                {/* Create */}

                <button
                  type="button"
                  onClick={
                    createVenue
                  }
                  disabled={
                    creatingVenue
                  }
                  className="w-full bg-emerald-600 text-white rounded-lg py-3 disabled:opacity-50"
                >

                  {creatingVenue
                    ? "Adding..."
                    : "Add Venue"}

                </button>

              </div>

            </div>

          )}

          {/* =========================
              Loading
          ========================= */}

          {loading && (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center text-slate-500">

              Loading venue assignments...

            </div>

          )}

          {/* =========================
              No Venues
          ========================= */}

          {!loading &&
            venues.length === 0 && (

            <div className="bg-amber-50 text-amber-700 rounded-xl p-4 mb-4">

              {canCreateVenues
                ? "No venues found. Add a venue before assigning batches."
                : "No venues have been created yet."}

            </div>

          )}

          {/* =========================
              No Batches
          ========================= */}

          {!loading &&
            batches.length === 0 && (

            <div className="bg-white rounded-xl shadow-sm p-8 text-center">

              <MapPinned
                size={32}
                className="mx-auto text-slate-400"
              />

              <p className="font-medium mt-3">
                No batches found
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Create a batch before assigning venues.
              </p>

            </div>

          )}

          {/* =========================
              Batches
          ========================= */}

          {!loading &&
            batches.length > 0 && (

            <div className="space-y-3">

              {batches.map(
                (batch) => (

                  <div
                    key={
                      batch.id
                    }
                    className="bg-white rounded-xl shadow-sm p-4"
                  >

                    {/* Batch */}

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h2 className="font-semibold text-lg">
                          {batch.name}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">

                          {formatDate(
                            batch.startDate
                          )}

                          {" – "}

                          {formatDate(
                            batch.endDate
                          )}

                        </p>

                      </div>

                      {batch._count && (

                        <div className="flex items-center gap-1 text-sm text-slate-500">

                          <Users
                            size={16}
                          />

                          <span>
                            {
                              batch
                                ._count
                                .students
                            }
                          </span>

                        </div>

                      )}

                    </div>

                    {/* =========================
                        Current Venue
                    ========================= */}

                    <div className="flex items-start gap-2 mt-4 bg-slate-50 rounded-lg p-3">

                      <MapPin
                        size={18}
                        className="text-emerald-600 mt-0.5 shrink-0"
                      />

                      <div>

                        <p className="text-xs text-slate-500">
                          Current Venue
                        </p>

                        <p className="font-medium">

                          {batch.venue
                            ?.name ??
                            "Not assigned"}

                        </p>

                        {batch.venue
                          ?.address && (

                          <p className="text-xs text-slate-500 mt-1">

                            {
                              batch
                                .venue
                                .address
                            }

                          </p>

                        )}

                      </div>

                    </div>

                    {/* =========================
                        Assignment
                    ========================= */}

                    <div className="mt-4">

                      <label className="text-sm text-slate-500">
                        Venue Assignment
                      </label>

                      {canAssignVenues ? (

                        <select
                          value={
                            batch.venueId ??
                            ""
                          }
                          disabled={
                            savingBatchId ===
                              batch.id ||
                            venues.length ===
                              0
                          }
                          onChange={(e) =>
                            updateVenue(
                              batch.id,
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-3 mt-1 bg-white disabled:opacity-50"
                        >

                          {!batch.venueId && (

                            <option
                              value=""
                              disabled
                            >
                              Select venue
                            </option>

                          )}

                          {venues.length ===
                            0 && (

                            <option value="">
                              No venues available
                            </option>

                          )}

                          {venues.map(
                            (venue) => (

                              <option
                                key={
                                  venue.id
                                }
                                value={
                                  venue.id
                                }
                              >

                                {
                                  venue.name
                                }

                              </option>

                            )
                          )}

                        </select>

                      ) : (

                        <div className="w-full border border-slate-200 rounded-lg p-3 mt-1 bg-slate-50 text-slate-700">

                          {batch.venue
                            ?.name ??
                            "Not assigned"}

                        </div>

                      )}

                      {savingBatchId ===
                        batch.id && (

                        <p className="text-xs text-slate-500 mt-2">
                          Saving...
                        </p>

                      )}

                    </div>

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