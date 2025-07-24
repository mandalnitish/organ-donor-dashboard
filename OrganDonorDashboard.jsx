import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Bell } from "lucide-react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false });

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DB_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_MSG_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function OrganDonorDashboard() {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [notification, setNotification] = useState("");
  const [recipientLocation, setRecipientLocation] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    const gpsRef = ref(db, "transport/organ123/gps");
    const notifRef = ref(db, "transport/organ123/alert");
    const recipientRef = ref(db, "recipients/recipient001/location");

    const gpsUnsub = onValue(gpsRef, (snap) => {
      const data = snap.val();
      if (data?.lat && data?.lng) setLocation({ lat: data.lat, lng: data.lng });
    });

    const notifUnsub = onValue(notifRef, (snap) => {
      const msg = snap.val();
      if (msg) setNotification(msg);
    });

    const recUnsub = onValue(recipientRef, (snap) => {
      const data = snap.val();
      if (data?.lat && data?.lng) setRecipientLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      gpsUnsub();
      notifUnsub();
      recUnsub();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-2">
      <div className="mb-4">
        <label htmlFor="lang" className="mr-2 font-medium">{t("select_language")}:</label>
        <select id="lang" onChange={(e) => i18n.changeLanguage(e.target.value)} className="border rounded p-1">
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="gu">ગુજરાતી</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-bold">{t("live_transport")}</h2>
          <LeafletMap marker={location} label={t("organ_transport")} />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-bold">{t("recipient_location")}</h2>
          <LeafletMap marker={recipientLocation} label={t("recipient")} />
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-600">
            <Bell className="w-5 h-5 animate-bounce" />
            <p className="text-lg font-semibold">{notification}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
