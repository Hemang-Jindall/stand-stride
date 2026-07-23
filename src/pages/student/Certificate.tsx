import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import CertificateOverviewCard from "../../components/CertificateOverviewCard";
import CertificatePreviewCard from "../../components/CertificatePreviewCard";
import DownloadCertificateCard from "../../components/DownloadCertificateCard";

export default function Certificate() {
  return (
    <MobileLayout>
      <Header />

      <main className="flex-1 py-4 space-y-4 overflow-y-auto">

        <CertificateOverviewCard />

        <CertificatePreviewCard />

        <DownloadCertificateCard />

      </main>

      <BottomNavigation />
    </MobileLayout>
  );
}