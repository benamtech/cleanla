export type OrganizationInput = {
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  street_address: string;
  website_url: string | null;
  business_category: string;
  description: string;
};

const REQUIRED_FIELDS = [
  "name",
  "contact_name",
  "contact_email",
  "contact_phone",
  "street_address",
  "business_category",
  "description",
] as const;

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function cleanOptional(value: unknown): string | null {
  const cleaned = clean(value);
  return cleaned.length > 0 ? cleaned : null;
}

export function parseOrganizationInput(body: unknown):
  | { ok: true; data: OrganizationInput }
  | { ok: false; error: string; status: number } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "INVALID_BODY", status: 400 };
  }

  const record = body as Record<string, unknown>;
  for (const field of REQUIRED_FIELDS) {
    if (clean(record[field]).length < 2) {
      return { ok: false, error: `${field.toUpperCase()}_REQUIRED`, status: 400 };
    }
  }

  const contactEmail = clean(record.contact_email).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, error: "CONTACT_EMAIL_INVALID", status: 400 };
  }

  return {
    ok: true,
    data: {
      name: clean(record.name),
      contact_name: clean(record.contact_name),
      contact_email: contactEmail,
      contact_phone: clean(record.contact_phone),
      street_address: clean(record.street_address),
      website_url: cleanOptional(record.website_url),
      business_category: clean(record.business_category),
      description: clean(record.description),
    },
  };
}

export function isApprovedStatusAction(action: unknown): action is "approved" | "rejected" {
  return action === "approved" || action === "rejected";
}
