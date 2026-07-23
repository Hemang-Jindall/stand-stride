import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import { masterData } from "../../data/masterData";

import {
  Database,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

export default function MasterData() {

  const [records, setRecords] = useState(masterData);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [form, setForm] = useState({
    role: "",
    name: "",
    whatsapp: "",
    center: "",
    purpose: "",
  });

  function deleteRecord(id: number) {

    setRecords(
      records.filter(record => record.id !== id)
    );

  }

  function startEdit(id: number) {

    const record = records.find(
      item => item.id === id
    );

    if (!record) return;

    setEditingId(id);

    setForm({
      role: record.role,
      name: record.name,
      whatsapp: record.whatsapp,
      center: record.center,
      purpose: record.purpose,
    });

  }

  function saveRecord() {

    if (editingId === -1) {

      const newRecord = {

        id: Date.now(),

        ...form,

        links: {
          map: "",
          form: "",
          drive: "",
        },

      };

      setRecords([...records, newRecord]);

    }

    else {

      setRecords(

        records.map(record =>

          record.id === editingId

            ? {
                ...record,
                ...form,
              }

            : record

        )

      );

    }

    setEditingId(null);

    setForm({
      role: "",
      name: "",
      whatsapp: "",
      center: "",
      purpose: "",
    });

  }

  return (

    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <div className="flex justify-between items-center mb-5">

            <div className="flex items-center gap-2">

              <Database
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold">
                Master Data
              </h1>

            </div>

            <button

              onClick={() => {

                setEditingId(-1);

                setForm({
                  role: "",
                  name: "",
                  whatsapp: "",
                  center: "",
                  purpose: "",
                });

              }}

              className="bg-emerald-600 text-white rounded-lg px-3 py-2 flex items-center gap-2"
            >

              <Plus size={18} />

              Add

            </button>

          </div>

          {editingId !== null && (

            <div className="bg-white rounded-xl shadow-sm p-4 mb-5 space-y-3">

              <input

                placeholder="Role"

                value={form.role}

                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value,
                  })
                }

                className="w-full border rounded-lg p-2"

              />

              <input

                placeholder="Name"

                value={form.name}

                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }

                className="w-full border rounded-lg p-2"

              />

              <input

                placeholder="WhatsApp"

                value={form.whatsapp}

                onChange={(e) =>
                  setForm({
                    ...form,
                    whatsapp: e.target.value,
                  })
                }

                className="w-full border rounded-lg p-2"

              />

              <input

                placeholder="Center"

                value={form.center}

                onChange={(e) =>
                  setForm({
                    ...form,
                    center: e.target.value,
                  })
                }

                className="w-full border rounded-lg p-2"

              />

              <input

                placeholder="Purpose"

                value={form.purpose}

                onChange={(e) =>
                  setForm({
                    ...form,
                    purpose: e.target.value,
                  })
                }

                className="w-full border rounded-lg p-2"

              />

              <div className="flex gap-2">

                <button

                  onClick={saveRecord}

                  className="flex-1 bg-emerald-600 text-white rounded-lg py-2"

                >

                  Save

                </button>

                <button

                  onClick={() => setEditingId(null)}

                  className="flex-1 border rounded-lg py-2"

                >

                  Cancel

                </button>

              </div>

            </div>

          )}

          <div className="space-y-3">

            {records.map((record) => (

              <div

                key={record.id}

                className="bg-white rounded-xl shadow-sm p-4"

              >

                <div className="flex justify-between">

                  <div>

                    <h2 className="font-semibold">

                      {record.name}

                    </h2>

                    <p className="text-sm text-slate-500">

                      {record.role}

                    </p>

                  </div>

                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">

                    {record.center}

                  </span>

                </div>

                <div className="mt-3 text-sm space-y-1">

                  <p>

                    <strong>WhatsApp:</strong>{" "}

                    {record.whatsapp}

                  </p>

                  <p>

                    <strong>Purpose:</strong>{" "}

                    {record.purpose}

                  </p>

                </div>

                <div className="flex gap-2 mt-4">

                  <button

                    onClick={() =>
                      startEdit(record.id)
                    }

                    className="flex-1 border rounded-lg py-2 flex justify-center items-center gap-2"

                  >

                    <Pencil size={16} />

                    Edit

                  </button>

                  <button

                    onClick={() =>
                      deleteRecord(record.id)
                    }

                    className="flex-1 bg-red-500 text-white rounded-lg py-2 flex justify-center items-center gap-2"

                  >

                    <Trash2 size={16} />

                    Delete

                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>

  );

}