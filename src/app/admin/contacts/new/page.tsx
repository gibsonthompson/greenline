import Link from "next/link";
import { createContact } from "@/app/admin/actions";

export default function NewContactPage() {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="gladmin-crumb">
        <Link href="/admin/contacts">Customers</Link> / Add
      </nav>

      <div className="gladmin-page-header">
        <div><h1>Add Customer</h1></div>
      </div>

      <div className="gladmin-card" style={{ maxWidth: 680 }}>
        <div className="gladmin-card-body padded">
          <form action={createContact} className="gladmin-form">
            <div className="gladmin-form-row two">
              <div>
                <label htmlFor="first_name" className="gladmin-label">First Name</label>
                <input id="first_name" name="first_name" className="gladmin-input" required />
              </div>
              <div>
                <label htmlFor="last_name" className="gladmin-label">Last Name</label>
                <input id="last_name" name="last_name" className="gladmin-input" />
              </div>
            </div>

            <div className="gladmin-form-row two">
              <div>
                <label htmlFor="phone" className="gladmin-label">Phone</label>
                <input id="phone" name="phone" type="tel" className="gladmin-input" />
              </div>
              <div>
                <label htmlFor="email" className="gladmin-label">Email</label>
                <input id="email" name="email" type="email" className="gladmin-input" />
              </div>
            </div>

            <div>
              <label htmlFor="address_line" className="gladmin-label">Address</label>
              <input id="address_line" name="address_line" className="gladmin-input" />
            </div>

            <div className="gladmin-form-row two">
              <div>
                <label htmlFor="city" className="gladmin-label">City</label>
                <input id="city" name="city" className="gladmin-input" />
              </div>
              <div>
                <label htmlFor="zip" className="gladmin-label">ZIP</label>
                <input id="zip" name="zip" className="gladmin-input" inputMode="numeric" maxLength={5} />
              </div>
            </div>

            <div className="gladmin-form-row two">
              <div>
                <label htmlFor="contact_type" className="gladmin-label">Type</label>
                <select id="contact_type" name="contact_type" className="gladmin-select" defaultValue="residential">
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="property-manager">Property Manager</option>
                </select>
              </div>
              <div>
                <label htmlFor="source" className="gladmin-label">Source</label>
                <select id="source" name="source" className="gladmin-select" defaultValue="referral">
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="google">Google</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="walk-up">Walk-Up</option>
                </select>
              </div>
            </div>

            <div className="gladmin-form-row two" style={{ alignItems: "end" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, paddingBottom: 9 }}>
                <input type="checkbox" name="is_recurring" style={{ width: 18, height: 18 }} />
                Recurring customer
              </label>
              <div>
                <label htmlFor="cadence" className="gladmin-label">Cadence</label>
                <select id="cadence" name="cadence" className="gladmin-select" defaultValue="">
                  <option value="">None</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every Other Week</option>
                  <option value="monthly">Monthly</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="one-time">One Time</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="gladmin-label">Notes</label>
              <textarea id="notes" name="notes" className="gladmin-textarea" />
            </div>

            <div>
              <button type="submit" className="gladmin-btn">Save Customer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
