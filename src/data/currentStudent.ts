import { students } from "./students";
import { mentorAssignments } from "./mentorAssignments";
import { venueAssignments } from "./venueAssignments";
import { masterData } from "./masterData";

const student = students[0];

const mentorAssignment = mentorAssignments.find(
  item => item.studentId === student.id
);

const venueAssignment = venueAssignments.find(
  item => item.studentId === student.id
);

const mentor = masterData.find(
  item =>
    item.id === mentorAssignment?.mentorId &&
    item.role === "Mentor"
);

const venue = masterData.find(
  item =>
    item.id === venueAssignment?.venueId &&
    item.role === "Venue"
);

const facilitator = masterData.find(
  item => item.role === "Facilitator"
);

export const currentStudent = {
  student,
  mentor,
  venue,
  facilitator,
};