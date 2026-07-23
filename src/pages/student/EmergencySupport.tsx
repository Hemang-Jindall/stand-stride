import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Phone,
  Ambulance,
  ShieldAlert,
} from "lucide-react";

export default function EmergencySupport() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-5">

            <ShieldAlert
              size={20}
              className="text-red-500"
            />

            <h2 className="text-xl font-semibold">
              Emergency Support
            </h2>

          </div>

          <div className="space-y-4">

            <div className="rounded-xl border p-4">

              <h3 className="font-semibold">
                Emergency Helpline
              </h3>

              <div className="flex items-center gap-2 mt-2">

                <Phone size={18} />

                <span>1800-123-456</span>

              </div>

            </div>

            <div className="rounded-xl border p-4">

              <h3 className="font-semibold">
                Ambulance
              </h3>

              <div className="flex items-center gap-2 mt-2">

                <Ambulance size={18} />

                <span>108</span>

              </div>

            </div>

            <div className="rounded-xl border p-4">

              <h3 className="font-semibold">
                Program Coordinator
              </h3>

              <div className="flex items-center gap-2 mt-2">

                <Phone size={18} />

                <span>+91 98765 43210</span>

              </div>

            </div>

          </div>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}