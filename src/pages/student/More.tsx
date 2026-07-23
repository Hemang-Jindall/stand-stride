import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  BadgeCheck,
  TriangleAlert,
  Bell,
  Settings,
  Phone,
  Info,
  ChevronRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function More() {
  const navigate = useNavigate();

  const items = [
    {
      icon: <BadgeCheck size={18} className="text-emerald-600" />,
      title: "Certificate",
      route: "/certificate",
    },
    {
      icon: <TriangleAlert size={18} className="text-red-500" />,
      title: "Grievance",
      route: "/grievance",
    },
    {
      icon: <Bell size={18} className="text-blue-500" />,
      title: "Notifications",
      route: "/notifications",
    },
    {
      icon: <Settings size={18} className="text-slate-600" />,
      title: "Settings",
      route: "/settings",
    },
    {
      icon: <Phone size={18} className="text-emerald-600" />,
      title: "SOP Contacts",
      route: "/contacts",
    },
    {
      icon: <Phone size={18} className="text-red-500" />,
      title: "Emergency Support",
      route: "/emergency",
    },
    {
      icon: <Info size={18} className="text-blue-500" />,
      title: "About Internship",
      route: "/about",
    },
  ];

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <h2 className="text-xl font-semibold mb-5">
            More
          </h2>

          <div className="space-y-2">

            {items.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.route)}
                className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-slate-400"
                />
              </button>
            ))}

          </div>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}