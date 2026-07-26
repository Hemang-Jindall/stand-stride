import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import StudentProfileCard from "../../components/StudentProfileCard";
import PersonalInformationCard from "../../components/PersonalInfoCard";
import MentorCard from "../../components/MentorCard";

export default function Profile() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <StudentProfileCard />

        <PersonalInformationCard />

        <MentorCard />

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}