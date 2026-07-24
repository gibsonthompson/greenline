import { createContact } from "@/app/admin/actions";

export default function NewContactPage() {
  return (
    <div className="max-w-xl">
      <h1 className="h2">Add contact</h1>
      <form action={createContact} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="mb-1 block font-medium">
              First name
            </label>
            <input id="first_name" name="first_name" className="field" required />
          </div>
          <div>
            <label htmlFor="last_name" className="mb-1 block font-medium">
              Last name
            </label>
            <input id="last_name" name="last_name" className="field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="phone" className="mb-1 block font-medium">
              Phone
            </label>
            <input id="phone" name="phone" type="tel" className="field" />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block font-medium">
              Email
            </label>
            <input id="email" name="email" type="email" className="field" />
          </div>
        </div>
        <div>
          <label htmlFor="address_line" className="mb-1 block font-medium">
            Address
          </label>
          <input id="address_line" name="address_line" className="field" />
        </div>
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <div>
            <label htmlFor="city" className="mb-1 block font-medium">
              City
            </label>
            <input id="city" name="city" className="field" />
          </div>
          <div>
            <label htmlFor="zip" className="mb-1 block font-medium">
              ZIP
            </label>
            <input id="zip" name="zip" className="field" inputMode="numeric" maxLength={5} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="contact_type" className="mb-1 block font-medium">
              Type
            </label>
            <select id="contact_type" name="contact_type" className="field" defaultValue="residential">
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="property-manager">Property manager</option>
            </select>
          </div>
          <div>
            <label htmlFor="source" className="mb-1 block font-medium">
              Source
            </label>
            <select id="source" name="source" className="field" defaultValue="referral">
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="google">Google</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="walk-up">Walk-up</option>
            </select>
          </div>
        </div>
        <fieldset className="flex items-end gap-4">
          <label className="flex items-center gap-2 pb-3 font-medium">
            <input type="checkbox" name="is_recurring" className="h-5 w-5 accent-green" />
            Recurring
          </label>
          <div className="flex-1">
            <label htmlFor="cadence" className="mb-1 block font-medium">
              Cadence
            </label>
            <select id="cadence" name="cadence" className="field" defaultValue="">
              <option value="">None</option>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Every other week</option>
              <option value="monthly">Monthly</option>
              <option value="seasonal">Seasonal</option>
              <option value="one-time">One time</option>
            </select>
          </div>
        </fieldset>
        <div>
          <label htmlFor="notes" className="mb-1 block font-medium">
            Notes
          </label>
          <textarea id="notes" name="notes" className="field min-h-[96px]" />
        </div>
        <button type="submit" className="btn btn-p">
          Save contact
        </button>
      </form>
    </div>
  );
}