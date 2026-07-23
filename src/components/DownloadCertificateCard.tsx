import { useState } from "react";
import { Download } from "lucide-react";

export default function DownloadCertificateCard() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);

    setTimeout(() => {
      setDownloaded(false);
    }, 2500);
  };

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">

        <Download
          size={18}
          className="text-emerald-600"
        />

        <h2 className="text-lg font-semibold">
          Download Certificate
        </h2>

      </div>

      <p className="text-sm text-slate-500 mb-4">
        Your certificate will be available after all
        internship requirements have been completed.
      </p>

      <button
        onClick={handleDownload}
        className="w-full bg-emerald-600 text-white rounded-lg py-2.5 font-medium hover:bg-emerald-700 transition"
      >
        Download Certificate
      </button>

      {downloaded && (
        <div className="mt-4 rounded-lg bg-green-100 border border-green-300 p-3">
          <p className="text-green-700 text-sm font-medium">
            ✅ Certificate downloaded successfully.
          </p>
        </div>
      )}

    </section>
  );
}