import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Shield,
  Lock,
  Eye,
  Database,
} from "lucide-react";

export default function Privacy() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-5">

            <Shield
              size={20}
              className="text-emerald-600"
            />

            <h2 className="text-xl font-semibold">
              Privacy
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex gap-3">

              <Lock
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Secure Login
                </p>

                <p className="text-sm text-slate-500">
                  Your account is protected using secure authentication.
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <Eye
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Data Visibility
                </p>

                <p className="text-sm text-slate-500">
                  Only authorized mentors and administrators can view your records.
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <Database
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Data Storage
                </p>

                <p className="text-sm text-slate-500">
                  Attendance, certificates, and internship progress are stored securely.
                </p>

              </div>

            </div>

          </div>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}