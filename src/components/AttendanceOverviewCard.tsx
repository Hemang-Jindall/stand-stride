import { useState } from "react";

import {
  ClipboardCheck,
  CheckCircle,
  XCircle,
  CalendarX,
} from "lucide-react";

import LeaveRequestModal from "./LeaveRequestModal";

export default function AttendanceOverviewCard() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

        <div className="flex items-center gap-2 mb-4">

          <ClipboardCheck
            size={18}
            className="text-emerald-600"
          />

          <h2 className="text-lg font-semibold">
            Attendance Overview
          </h2>

        </div>

        <div className="flex items-end justify-between mb-5">

          <div>

            <p className="text-4xl font-bold text-slate-900">
              96%
            </p>

            <p className="text-sm text-slate-500">
              Overall Attendance
            </p>

          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 transition"
          >
            Request Leave
          </button>

        </div>

        <div className="grid grid-cols-3 gap-3">

          <div className="bg-emerald-50 rounded-xl p-3 text-center">

            <CheckCircle
              size={18}
              className="mx-auto text-emerald-600 mb-1"
            />

            <p className="font-bold">
              24
            </p>

            <p className="text-xs text-slate-500">
              Present
            </p>

          </div>

          <div className="bg-red-50 rounded-xl p-3 text-center">

            <XCircle
              size={18}
              className="mx-auto text-red-500 mb-1"
            />

            <p className="font-bold">
              1
            </p>

            <p className="text-xs text-slate-500">
              Absent
            </p>

          </div>

          <div className="bg-yellow-50 rounded-xl p-3 text-center">

            <CalendarX
              size={18}
              className="mx-auto text-yellow-500 mb-1"
            />

            <p className="font-bold">
              0
            </p>

            <p className="text-xs text-slate-500">
              Leave
            </p>

          </div>

        </div>

      </section>

      <LeaveRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}