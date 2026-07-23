import { useState } from "react";

import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import AdminBottomNavigation from "../../components/AdminBottomNavigation";

import { students } from "../../data/students";
import { masterData } from "../../data/masterData";
import { venueAssignments } from "../../data/venueAssignments";

export default function VenueAssignments() {

  const venues = masterData.filter(
    item => item.role === "Venue"
  );

  const [assignments, setAssignments] =
    useState(venueAssignments);

  function updateVenue(
    studentId: number,
    venueId: number
  ) {

    setAssignments(

      assignments.map((assignment) =>

        assignment.studentId === studentId
          ? {
              ...assignment,
              venueId,
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

            Venue Assignment

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

                    value={assignment?.venueId}

                    onChange={(e) =>

                      updateVenue(
                        student.id,
                        Number(e.target.value)
                      )

                    }

                    className="w-full border rounded-lg p-2"

                  >

                    {venues.map((venue) => (

                      <option
                        key={venue.id}
                        value={venue.id}
                      >

                        {venue.name}

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