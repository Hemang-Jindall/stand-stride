import MobileLayout from "../../layouts/MobileLayout";

import Header from "../../components/Header";
import BottomNavigation from "../../components/BottomNavigation";

import {
  Phone,
  Mail,
  User,
} from "lucide-react";

const contacts = [
  {
    name: "Academic Coordinator",
    phone: "+91 98765 43210",
    email: "coordinator@standstride.org",
  },
  {
    name: "Program Manager",
    phone: "+91 98765 12345",
    email: "manager@standstride.org",
  },
  {
    name: "Support Desk",
    phone: "+91 1800 123 456",
    email: "support@standstride.org",
  },
];

export default function SOPContacts() {
  return (
    <MobileLayout>

      <Header />

      <main className="flex-1 py-4">

        <section className="mx-5 bg-white rounded-xl shadow-sm p-4">

          <h2 className="text-xl font-semibold mb-5">
            SOP Contacts
          </h2>

          <div className="space-y-5">

            {contacts.map((contact) => (

              <div
                key={contact.name}
                className="border-b pb-4 last:border-none"
              >

                <div className="flex items-center gap-2 mb-2">

                  <User
                    size={18}
                    className="text-emerald-600"
                  />

                  <span className="font-medium">
                    {contact.name}
                  </span>

                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600">

                  <Phone size={16} />

                  {contact.phone}

                </div>

                <div className="flex items-center gap-2 text-sm text-slate-600 mt-2">

                  <Mail size={16} />

                  {contact.email}

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

      <BottomNavigation />

    </MobileLayout>
  );
}