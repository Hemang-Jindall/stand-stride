import { Bell } from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();

  return (
    <header className="relative flex items-center justify-center px-4 py-3 bg-white shadow-sm">

      <div className="text-center">

        <h1 className="text-base font-bold text-emerald-600">
          Stand & Stride
        </h1>

        <p className="text-[11px] text-slate-500">
          Junior Internship
        </p>

      </div>

      <button
        onClick={() => navigate("/notifications")}
        className="absolute right-4"
      >

        <Bell
          size={20}
          className="text-slate-700"
        />

      </button>

    </header>
  );
}