import { useNavigate } from "react-router-dom";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  CircleCheck,
  Clock3,
} from "lucide-react";

export default function AdminGrievances() {

  const navigate = useNavigate();

  const grievances = [
    {
      student: "Hemang Jindal",
      category: "Infrastructure",
      status: "Pending",
      resolved: false,
    },
    {
      student: "Aarav Sharma",
      category: "Mentor",
      status: "Resolved",
      resolved: true,
    },
    {
      student: "Priya Singh",
      category: "Training",
      status: "Pending",
      resolved: false,
    },
  ];

  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">
            Grievances
          </h1>

          <div className="space-y-3">

            {grievances.map((item) => (

              <div
                key={item.student + item.category}
                className="bg-white rounded-xl shadow-sm p-4"
              >

                <div className="flex justify-between items-start">

                  <div>

                    <h3 className="font-semibold">
                      {item.student}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {item.category}
                    </p>

                  </div>

                  <div className="flex items-center gap-2">

                    {item.resolved ? (

                      <CircleCheck
                        size={18}
                        className="text-emerald-600"
                      />

                    ) : (

                      <Clock3
                        size={18}
                        className="text-yellow-500"
                      />

                    )}

                    <span className="text-sm">
                      {item.status}
                    </span>

                  </div>

                </div>

                <button
                  onClick={() =>
                    navigate("/admin/grievance-details")
                  }
                  className="mt-4 w-full rounded-lg bg-emerald-600 text-white py-2"
                >
                  View Details
                </button>

              </div>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>
  );
}