import AccountControls from "@/components/admin/AccountControls";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="max-w-xl">
      <h1 className="h2">Settings</h1>

      <h2 className="h3 mt-8">Access</h2>
      <p className="mt-2 text-mute-l">
        Change the PIN used to reach this admin, or sign out on this device. Changing the PIN
        needs the current one. Five wrong sign-in attempts lock access for 15 minutes.
      </p>
      <AccountControls />
    </div>
  );
}
