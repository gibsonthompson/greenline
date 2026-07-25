import AccountControls from "@/components/admin/AccountControls";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div>
      <div className="gladmin-page-header">
        <div><h1>Settings</h1></div>
      </div>

      <div className="gladmin-card" style={{ maxWidth: 640 }}>
        <div className="gladmin-card-header"><h2>Access</h2></div>
        <div className="gladmin-card-body padded">
          <p style={{ color: "var(--a-mute)", marginBottom: 16, maxWidth: "60ch" }}>
            Change the PIN used to reach this admin, or sign out on this device. Changing the PIN
            needs the current one. Five wrong sign-in attempts lock access for 15 minutes.
          </p>
          <AccountControls />
        </div>
      </div>
    </div>
  );
}
