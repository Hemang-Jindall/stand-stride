export default function AttendanceCalendar() {
  const days = [
    "P", "P", "P", "A", "P", "P", "P",
    "P", "P", "P", "P", "L", "P",
    "P", "P", "P", "P", "P", "P", "P",
    "P", "P", "P", "P", "P", "P", "P",
    "P", "P", "P",
  ];

  const getColor = (status: string) => {
    if (status === "P") return "bg-emerald-500 text-white";
    if (status === "A") return "bg-red-500 text-white";
    return "bg-yellow-400 text-white";
  };

  return (
    <section className="mx-5 bg-white rounded-2xl shadow-sm p-5">

      <div className="flex justify-between items-center mb-5">

        <h2 className="font-semibold text-slate-800">
          July Attendance
        </h2>

        <span className="text-sm text-slate-500">
          2026
        </span>

      </div>

      <div className="grid grid-cols-7 gap-2">

        {days.map((status, index) => (
          <div
            key={index}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-semibold ${getColor(status)}`}
          >
            {index + 1}
          </div>
        ))}

      </div>

      <div className="flex justify-around mt-6 text-sm">

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          Present
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          Absent
        </div>

        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          Leave
        </div>

      </div>

    </section>
  );
}