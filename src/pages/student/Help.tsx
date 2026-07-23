import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  CircleHelp,
  Mail,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function Help() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <div className="flex items-center gap-2 mb-5">

            <CircleHelp
              size={20}
              className="text-emerald-600"
            />

            <h2 className="text-xl font-semibold">
              Help & Support
            </h2>

          </div>

          <div className="space-y-5">

            <div className="flex gap-3">

              <Phone
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Helpline
                </p>

                <p className="text-sm text-slate-500">
                  +91 1800-123-456
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <Mail
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Email
                </p>

                <p className="text-sm text-slate-500">
                  support@standstride.org
                </p>

              </div>

            </div>

            <div className="flex gap-3">

              <MessageCircle
                size={18}
                className="text-emerald-600 mt-1"
              />

              <div>

                <p className="font-medium">
                  Office Hours
                </p>

                <p className="text-sm text-slate-500">
                  Monday - Friday
                  <br />
                  9:00 AM - 5:00 PM
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