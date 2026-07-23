import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import AttendanceOverviewCard from "../../components/AttendanceOverviewCard";
import AttendanceCalendar from "../../components/AttendanceCalendar";
import AttendanceHistory from "../../components/AttendanceHistory";

export default function Attendance() {
  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <AttendanceOverviewCard />

        <AttendanceCalendar />

        <AttendanceHistory />

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}