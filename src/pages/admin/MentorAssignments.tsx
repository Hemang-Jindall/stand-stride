import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import { students } from "../../data/students";
import { masterData } from "../../data/masterData";
import { mentorAssignments } from "../../data/mentorAssignments";

export default function MentorAssignments() {

  const mentors = masterData.filter(
    person => person.role === "Mentor"
  );

  const [assignments, setAssignments] =
    useState(mentorAssignments);

  function updateMentor(
    studentId: number,
    mentorId: number
  ) {

    setAssignments(

      assignments.map((assignment) =>

        assignment.studentId === studentId
          ? {
              ...assignment,
              mentorId,
            }
          : assignment

      )

    );

  }

  return (

    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 overflow-y-auto">

        <section className="mx-5">

          <h1 className="text-2xl font-bold mb-5">

            Mentor Assignment

          </h1>

          <div className="space-y-3">

            {students.map((student) => {

              const assignment =
                assignments.find(

                  item =>
                    item.studentId === student.id

                );

              return (

                <div
                  key={student.id}
                  className="bg-white rounded-xl shadow-sm p-4"
                >

                  <h2 className="font-semibold">

                    {student.name}

                  </h2>

                  <p className="text-sm text-slate-500 mb-4">

                    {student.batch}

                  </p>

                  <select

                    value={assignment?.mentorId}

                    onChange={(e) =>

                      updateMentor(
                        student.id,
                        Number(e.target.value)
                      )

                    }

                    className="w-full border rounded-lg p-2"

                  >

                    {mentors.map((mentor) => (

                      <option
                        key={mentor.id}
                        value={mentor.id}
                      >

                        {mentor.name}

                      </option>

                    ))}

                  </select>

                </div>

              );

            })}

          </div>

        </section>

      </main>

      <AdminBottomNavigation />

    </MobileLayout>

  );

}