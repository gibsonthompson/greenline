import type { Metadata } from "next";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "SMS Terms",
  alternates: { canonical: "/sms-terms" },
};

export default function SmsTermsPage() {
  return (
    <div className="prose-gl mx-auto max-w-[72ch] px-5 py-16 md:px-0">
      <h1 className="t-display-lg">SMS terms and conditions</h1>
      <p className="t-body-sm text-ink-60">Last updated July 2026</p>
      <p>
        By checking the SMS consent box on our estimate form, you agree to receive text messages
        from {SITE.name} about your estimate request and any service you schedule with us. This
        is customer-care messaging, not marketing: messages include estimate confirmations,
        pricing follow-ups, scheduling, and service updates.
      </p>
      <h2>Frequency, rates, and opting out</h2>
      <p>
        Message frequency varies with your request and service. Message and data rates may apply
        depending on your carrier plan. Reply STOP at any time to opt out and you will receive no
        further messages. Reply HELP for help, or call {SITE.phoneDisplay}.
      </p>
      <h2>Your number</h2>
      <p>
        Consent is not a condition of purchase. Your phone number is used for the communication
        described here and is never sold or shared for marketing by third parties. See our{" "}
        <a href="/privacy">privacy policy</a> for details.
      </p>
    </div>
  );
}
