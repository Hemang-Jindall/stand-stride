import {
  FileText,
  BadgeCheck,
  Download,
} from "lucide-react";

export default function DocumentsCard() {
  const documents = [
    {
      name: "Offer Letter",
      status: "Available",
    },
    {
      name: "Attendance Report",
      status: "Available",
    },
    {
      name: "Internship Certificate",
      status: "Locked",
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex items-center gap-2 mb-5">

        <FileText
          size={18}
          className="text-emerald-600"
        />

        <h2 className="font-semibold text-slate-800">
          Documents
        </h2>

      </div>

      <div className="space-y-4">

        {documents.map((document) => (
          <div
            key={document.name}
            className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-none last:pb-0"
          >

            <div className="flex items-center gap-3">

              <BadgeCheck
                size={18}
                className="text-emerald-600"
              />

              <div>
                <p className="font-medium">
                  {document.name}
                </p>

                <p className="text-sm text-slate-500">
                  {document.status}
                </p>
              </div>

            </div>

            <button
              className="text-emerald-600 hover:text-emerald-700"
            >
              <Download size={18} />
            </button>

          </div>
        ))}

      </div>

    </section>
  );
}