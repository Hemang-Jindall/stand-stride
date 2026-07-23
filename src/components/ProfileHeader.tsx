import { UserCircle2 } from "lucide-react";

export default function ProfileHeader() {
  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-6">

      <div className="flex flex-col items-center">

        <UserCircle2
          size={80}
          className="text-emerald-600"
        />

        <h1 className="text-2xl font-bold mt-4">
          Hemang
        </h1>

        <p className="text-slate-500 mt-1">
          Junior Intern
        </p>

        <span className="mt-4 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
          Batch B2
        </span>

      </div>

    </section>
  );
}