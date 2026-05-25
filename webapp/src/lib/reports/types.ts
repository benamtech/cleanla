export type Report = {
  id: string;
  photo_url: string;
  lat: number;
  lng: number;
  description: string;
  email_optional: string | null;
  neighborhood: string | null;
  created_at: string;
};

export type ReportInput = {
  photoFile: File;
  lat: number;
  lng: number;
  description: string;
  email_optional?: string;
};

export type SubmitResult =
  | { ok: true; id: string }
  | { ok: false; error: string };
