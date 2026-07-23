import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import TodaySessionCard from "../../components/TodaySessionCard";
import DailyTimeline from "../../components/DailyTimeline";
import WeeklySchedule from "../../components/WeeklySchedule";

export default function Schedule() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <TodaySessionCard />

        <DailyTimeline />

        <WeeklySchedule />

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}