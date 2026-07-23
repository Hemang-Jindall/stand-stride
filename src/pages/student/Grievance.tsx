import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import RaiseGrievanceCard from "../../components/RaiseGrievanceCard";
import PreviousGrievances from "../../components/PreviousGrievances";
import EmergencyContactCard from "../../components/EmergencyContactCard";

export default function Grievance() {
  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <RaiseGrievanceCard />

        <PreviousGrievances />

        <EmergencyContactCard />

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}