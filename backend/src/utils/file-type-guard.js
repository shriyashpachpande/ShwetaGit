import { ALLOWED_REPORT_TYPES } from '../config/constants.js';

export const isAllowedReportMime = (m) => ALLOWED_REPORT_TYPES.includes(m);