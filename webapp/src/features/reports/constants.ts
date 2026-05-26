export const VERIFY_RADIUS_M = 50;
export const MAX_GPS_ACCURACY_M = 100;
export const MAX_UPLOAD_AGE_MIN = 10;

export const REPORT_SEVERITIES = [1, 2, 3, 4, 5] as const;

// Description is OPTIONAL — the 3-tap report flow needs to ship with just
// photo + auto-location + default category. A required description would
// be a fourth tap (typing). Cap stays at 500 to protect the DB.
export const REPORT_DESCRIPTION_MIN_LENGTH = 0;
export const REPORT_DESCRIPTION_MAX_LENGTH = 500;

// Defaults for the 3-tap flow — overridable in the confirm view.
export const REPORT_DEFAULT_CATEGORY = "trash" as const;
export const REPORT_DEFAULT_SEVERITY = 3 as const;
