import type { Metadata } from "next";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="prose-gl mx-auto max-w-[72ch] px-5 py-16 md:px-0">
      <h1 className="t-display-lg">Privacy policy</h1>
      <p className="t-body-sm text-ink-60">Last updated July 2026</p>
      <h2>What we collect</h2>
      <p>
        When you request an estimate we collect what you give us: your name, phone number, email
        if you provide it, the property address, the services you selected, your notes, and any
        photos you upload. We also record standard technical details such as your browser type
        and referring page.
      </p>
      <h2>Photos</h2>
      <p>
        Photos you upload are resized and re-encoded in your browser before upload, which removes
        embedded metadata including GPS location. Photos are stored privately, are used only to
        prepare your estimate and perform the work, and are never made public without your
        permission.
      </p>
      <h2>How we use your information</h2>
      <p>
        To respond to your request, prepare quotes, schedule and perform work, and communicate
        with you about it. If you consented to text messages, we text you about your estimate and
        service. We do not sell your information, and we do not share it with third parties except
        the service providers that run this site (hosting, database, and messaging), who process
        it only on our behalf.
      </p>
      <h2>Retention and your choices</h2>
      <p>
        We keep records of estimates and jobs for our business records. You can ask us to delete
        your information at any time by calling {SITE.phoneDisplay} or emailing {SITE.email}, and
        we will honor it unless a record is required for legal or accounting reasons.
      </p>
      <h2>Contact</h2>
      <p>
        {SITE.name}, {SITE.phoneDisplay}, {SITE.email}.
      </p>
    </div>
  );
}
