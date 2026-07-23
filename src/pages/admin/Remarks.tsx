import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import {
  FileText,
  Plus,
} from "lucide-react";

export default function Remarks() {

  const [newRemark, setNewRemark] = useState("");

  const [remarks, setRemarks] = useState([
    "Excellent communication skills.",
    "Very punctual during internship.",
    "Needs improvement in documentation.",
  ]);

  function addRemark() {

    if (newRemark.trim() === "") return;

    setRemarks([
      newRemark,
      ...remarks,
    ]);

    setNewRemark("");

  }

  return (

    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-5">

            <FileText
              size={22}
              className="text-emerald-600"
            />

            <h1 className="text-2xl font-bold">
              Remarks
            </h1>

          </div>

          <textarea
            value={newRemark}
            onChange={(e) =>
              setNewRemark(e.target.value)
            }
            placeholder="Add a remark..."
            className="w-full h-32 border border-slate-300 rounded-xl p-4 resize-none outline-none focus:border-emerald-600"
          />

          <button
            onClick={addRemark}
            className="mt-4 w-full bg-emerald-600 text-white rounded-xl py-3 flex items-center justify-center gap-2"
          >

            <Plus size={18} />

            Add Remark

          </button>

        </section>

        <section className="mx-5 mt-5 bg-white rounded-xl shadow-sm p-5">

          <h2 className="font-semibold mb-4">
            Previous Remarks
          </h2>

          <div className="space-y-3">

            {remarks.map((remark, index) => (

              <div
                key={index}
                className="border rounded-xl p-3"
              >

                {remark}

              </div>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>

  );
}