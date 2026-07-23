import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

export default function LeaveRequests() {

  const [requests, setRequests] = useState([
    {
      id: 1,
      student: "Hemang Jindal",
      date: "18 Jul 2026",
      reason: "Medical Appointment",
      status: "Pending",
    },
    {
      id: 2,
      student: "Aarav Sharma",
      date: "20 Jul 2026",
      reason: "Family Function",
      status: "Approved",
    },
    {
      id: 3,
      student: "Priya Singh",
      date: "22 Jul 2026",
      reason: "Personal",
      status: "Pending",
    },
  ]);

  function updateStatus(id: number, status: string) {
    setRequests(
      requests.map((request) =>
        request.id === id
          ? { ...request, status }
          : request
      )
    );
  }

  return (

    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">
            Leave Requests
          </h1>

          <div className="space-y-3">

            {requests.map((request) => (

              <div
                key={request.id}
                className="bg-white rounded-xl shadow-sm p-4"
              >

                <h3 className="font-semibold">
                  {request.student}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {request.date}
                </p>

                <p className="mt-2">
                  {request.reason}
                </p>

                {request.status === "Pending" ? (

                  <div className="flex gap-2 mt-4">

                    <button
                      onClick={() =>
                        updateStatus(
                          request.id,
                          "Approved"
                        )
                      }
                      className="flex-1 bg-emerald-600 text-white rounded-lg py-2"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          request.id,
                          "Rejected"
                        )
                      }
                      className="flex-1 bg-red-500 text-white rounded-lg py-2"
                    >
                      Reject
                    </button>

                  </div>

                ) : (

                  <div className="mt-4">

                    <span
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        request.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {request.status}
                    </span>

                  </div>

                )}

              </div>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>

  );
}