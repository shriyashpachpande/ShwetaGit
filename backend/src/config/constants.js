export const ALLOWED_REPORT_TYPES = [
    'application/pdf',
    'text/plain',
    'image/png',
    'image/jpeg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const MAX_REPORTS = Number(process.env.MAX_REPORTS || 5);
export const MIN_REPORTS = 2;

export const UPLOAD_SUBFOLDERS = {
    reports: 'uploads/multi-report',
    policy: 'uploads/multi-policy',
};

export const SIMILARITY_THRESHOLD = 0.75;
