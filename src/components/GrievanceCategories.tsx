import {
  CircleAlert,
  Building2,
  BookOpen,
  Users,
} from "lucide-react";

export default function GrievanceCategories() {
  const categories = [
    {
      icon: <Building2 size={20} className="text-emerald-600" />,
      title: "Infrastructure",
    },
    {
      icon: <BookOpen size={20} className="text-emerald-600" />,
      title: "Training",
    },
    {
      icon: <Users size={20} className="text-emerald-600" />,
      title: "Mentor",
    },
    {
      icon: <CircleAlert size={20} className="text-emerald-600" />,
      title: "Other",
    },
  ];

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <h2 className="font-semibold text-slate-800 mb-5">
        Categories
      </h2>

      <div className="grid grid-cols-2 gap-4">

        {categories.map((category) => (
          <button
            key={category.title}
            className="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-3 hover:border-emerald-500 transition"
          >
            {category.icon}

            <span className="font-medium">
              {category.title}
            </span>

          </button>
        ))}

      </div>

    </section>
  );
}