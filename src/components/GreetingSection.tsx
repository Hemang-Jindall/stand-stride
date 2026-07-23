import { students } from "../data/students";
export default function GreetingSection() {
  return (
    <section className="mx-5">

      <p className="text-sm text-slate-500">
        Good Morning 👋
      </p>

      <h1 className="text-2xl font-bold">
        {students[0]?.name}
      </h1>

    </section>
  );
}