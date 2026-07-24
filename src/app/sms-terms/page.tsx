import type { Metadata } from "next";
import { SITE } from "@/data/site";

export const metadata: Metadata = {
  title: "SMS Terms",
  alternates: { canonical: "/sms-terms" },
};

export default function SmsTermsPage() {
  return (
    <article>
      <header className="dark">
        <div className="mx-auto max-w-[1340px] px-[clamp(1.1rem,4.2vw,4rem)] pb-10 pt-[clamp(8.5rem,13vw,10.5rem)]">
          <div className="rule" />
          <div className="kicker">Legal</div>
          <h1 className="h1 mt-2 max-w-[18ch] text-white">SMS Terms And Conditions</h1>
          <p className="t-sm mt-3 text-mute-d">Last updated July 2026</p>
        </div>
      </header>

      <div className="prose-gl mx-auto max-w-[72ch] px-[clamp(1.1rem,4.2vw,4rem)] py-14">
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
    </article>
  );
}
