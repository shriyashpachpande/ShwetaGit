import Report from "./models/Report.js";
import Analysis from "./models/Analysis.js";

export default async function ensureIndexes() {
    await Report.collection.createIndex({ createdAt: -1 });
    await Report.collection.createIndex({ diagnosis: 1 });
    await Analysis.collection.createIndex({ reportId: 1, createdAt: -1 });
}