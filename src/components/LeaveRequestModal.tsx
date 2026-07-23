import { useState } from "react";

interface LeaveRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LeaveRequestModal({
  open,
  onClose,
}: LeaveRequestModalProps) {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (!date || reason.trim() === "") return;

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setDate("");
      setReason("");
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-xl w-11/12 max-w-sm p-5">

        {!submitted ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Request Leave
            </h2>

            <div className="space-y-4">

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border rounded-lg p-2.5"
              />

              <textarea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for leave..."
                className="w-full border rounded-lg p-3 resize-none"
              />

            </div>

            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
              >
                Submit
              </button>

            </div>
          </>
        ) : (
          <div className="text-center py-6">

            <div className="text-5xl mb-3">
              ✅
            </div>

            <h2 className="text-lg font-semibold text-emerald-600">
              Leave Request Submitted
            </h2>

            <p className="text-sm text-slate-500 mt-2">
              Your mentor will review your request shortly.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}