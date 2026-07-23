import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  Bell,
  Send,
} from "lucide-react";

import { useState } from "react";

export default function AdminNotifications() {

  const [message, setMessage] = useState("");

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-5">

            <Bell
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Notifications
            </h1>

          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a notification for all interns..."
            className="w-full h-40 rounded-xl border border-slate-300 p-4 resize-none outline-none focus:border-emerald-600"
          />

          <button
            className="mt-5 w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
          >

            <Send size={18} />

            Send Notification

          </button>

        </section>

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">

          <h2 className="font-semibold mb-4">
            Recently Sent
          </h2>

          <div className="space-y-3">

            <div className="border rounded-lg p-3">

              <p className="font-medium">
                NGO Visit Tomorrow
              </p>

              <p className="text-sm text-slate-500">
                Sent to all interns
              </p>

            </div>

            <div className="border rounded-lg p-3">

              <p className="font-medium">
                Attendance Deadline
              </p>

              <p className="text-sm text-slate-500">
                Sent to Batch B2
              </p>

            </div>

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}