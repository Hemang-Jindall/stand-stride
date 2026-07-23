import { useState } from "react";
import {
  TriangleAlert,
  Building2,
  BookOpen,
  Users,
  CircleAlert,
} from "lucide-react";

export default function RaiseGrievanceCard() {
  const [category, setCategory] = useState("Infrastructure");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    {
      name: "Infrastructure",
      icon: <Building2 size={22} />,
    },
    {
      name: "Training",
      icon: <BookOpen size={22} />,
    },
    {
      name: "Mentor",
      icon: <Users size={22} />,
    },
    {
      name: "Other",
      icon: <CircleAlert size={22} />,
    },
  ];

  const handleSubmit = () => {
    if (description.trim() === "") return;

    setSubmitted(true);
    setDescription("");

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <div className="flex items-center gap-2 mb-4">

        <TriangleAlert
          size={18}
          className="text-red-500"
        />

        <h2 className="text-lg font-semibold">
          Raise Grievance
        </h2>

      </div>

      <h3 className="text-sm font-medium text-slate-600 mb-3">
        Choose Category
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-5">

        {categories.map((item) => (
          <button
            key={item.name}
            onClick={() => setCategory(item.name)}
            className={`rounded-xl border p-4 flex flex-col items-center gap-2 transition ${
              category === item.name
                ? "border-emerald-600 bg-emerald-50 text-emerald-600"
                : "border-slate-200 hover:border-emerald-300"
            }`}
          >
            {item.icon}

            <span className="text-sm font-medium">
              {item.name}
            </span>
          </button>
        ))}

      </div>

      <textarea
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={`Describe your ${category.toLowerCase()} issue...`}
        className="w-full border border-slate-300 rounded-lg p-3 resize-none mb-4"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-red-600 text-white rounded-lg py-3 font-medium hover:bg-red-700 transition"
      >
        Submit Grievance
      </button>

      {submitted && (
        <div className="mt-4 rounded-lg bg-green-100 border border-green-300 p-3">
          <p className="text-green-700 text-sm font-medium">
            ✅ Your grievance has been submitted successfully.
          </p>
        </div>
      )}

    </section>
  );
}