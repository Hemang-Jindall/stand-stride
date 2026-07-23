import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import GreetingSection from "../../components/GreetingSection";
import StudentSummaryCard from "../../components/StudentSummaryCard";
import InternshipProgressCard from "../../components/InternshipProgressCard";
import QuickActions from "../../components/QuickActions";

export default function Dashboard() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <GreetingSection />

        <StudentSummaryCard />

        <InternshipProgressCard />

        <QuickActions />

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}