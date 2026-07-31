import {
  Mail,
  Phone,
  IdCard,
  GraduationCap,
  MapPin,
} from "lucide-react";

import type {
  StudentProfile,
} from "../pages/student/Profile";

interface Props {
  student: StudentProfile;
}

export default function PersonalInformationCard({
  student,
}: Props) {
  return (
    <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

      <h2 className="text-lg font-semibold mb-5">
        Personal Information
      </h2>

      <div className="space-y-5">

        <div className="flex items-center gap-3">

          <IdCard
            size={18}
            className="text-emerald-600"
          />

          <div>
            <p className="text-xs text-slate-500">
              Student ID
            </p>

            <p className="font-medium">
              {student.rollNumber}
            </p>
          </div>

        </div>

        <div className="flex items-center gap-3">

          <Mail
            size={18}
            className="text-emerald-600"
          />

          <div className="min-w-0">

            <p className="text-xs text-slate-500">
              Email
            </p>

            <p className="font-medium break-all">
              {student.email}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <Phone
            size={18}
            className="text-emerald-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Phone
            </p>

            <p className="font-medium">
              {student.phone ??
                "Not provided"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <GraduationCap
            size={18}
            className="text-emerald-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Batch
            </p>

            <p className="font-medium">
              {student.batch?.name ??
                "Not assigned"}
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <MapPin
            size={18}
            className="text-emerald-600"
          />

          <div>

            <p className="text-xs text-slate-500">
              Venue
            </p>

            <p className="font-medium">
              {student.batch?.venue
                ?.name ??
                "Not assigned"}
            </p>

            {student.batch?.venue
              ?.address && (
              <p className="text-sm text-slate-500">
                {
                  student.batch
                    .venue.address
                }
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}