// import express from "express";
// import Report from "../models/Report.js";
// import Analysis from "../models/Analysis.js";

// const router = express.Router();

// function parseRange(q) {
//     const to = q.to ? new Date(q.to) : new Date();
//     const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 24 * 3600 * 1000);
//     return { from, to };
// }

// function latestAnalysisLookup() {
//     return [
//         {
//             $lookup: {
//                 from: "analyses",
//                 let: { rid: "$_id" },
//                 pipeline: [
//                     { $match: { $expr: { $eq: ["$reportId", "$$rid"] } } },
//                     { $sort: { createdAt: -1 } },
//                     { $limit: 1 },
//                     { $project: { decision: 1, clauseRef: 1, resultJson: 1, createdAt: 1 } }
//                 ],
//                 as: "analysis"
//             }
//         },
//         { $addFields: { analysis: { $first: "$analysis" } } }
//     ];
// }

// router.get("/kpis", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const now = new Date();
//         const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//         const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

//         const [rangeTotal, thisMonth, lastMonth, coverageAgg] = await Promise.all([
//             Report.countDocuments({ createdAt: { $gte: from, $lte: to } }),
//             Report.countDocuments({ createdAt: { $gte: thisMonthStart, $lte: now } }),
//             Report.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
//             Report.aggregate([
//                 { $match: { createdAt: { $gte: from, $lte: to } } },
//                 ...latestAnalysisLookup(),
//                 {
//                     $facet: {
//                         total: [{ $count: "c" }],
//                         covered: [{ $match: { "analysis.decision": "✅ Covered" } }, { $count: "c" }]
//                     }
//                 },
//                 {
//                     $project: {
//                         total: { $ifNull: [{ $arrayElemAt: ["$total.c", 0] }, 0] },
//                         covered: { $ifNull: [{ $arrayElemAt: ["$covered.c", 0] }, 0] }
//                     }
//                 }
//             ])
//         ]);

//         const coverage = coverageAgg || { total: 0, covered: 0 };
//         const notCovered = Math.max(coverage.total - coverage.covered, 0);
//         const coverageSuccessPercent = coverage.total ? Math.round((coverage.covered / coverage.total) * 100) : 0;

//         return res.json({
//             ok: true,
//             kpis: {
//                 totalReports: rangeTotal,
//                 thisMonthReports: thisMonth,
//                 lastMonthReports: lastMonth,
//                 coverageSuccessPercent,
//                 coveredCount: coverage.covered,
//                 notCoveredCount: notCovered
//             }
//         });
//     } catch (e) {
//         return res.status(500).json({ error: "kpis_failed", details: e.message });
//     }
// });

// router.get("/top-diagnoses", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const limit = Math.max(1, Math.min(parseInt(req.query.limit || "5", 10), 20));
//         const rows = await Report.aggregate([
//             { $match: { createdAt: { $gte: from, $lte: to } } },
//             { $group: { _id: { $toLower: { $ifNull: ["$diagnosis", "unknown"] } }, value: { $sum: 1 } } },
//             { $sort: { value: -1 } },
//             { $limit: limit },
//             { $project: { _id: 0, label: "$_id", value: 1 } }
//         ]);
//         return res.json({ ok: true, data: rows });
//     } catch (e) {
//         return res.status(500).json({ error: "top_diagnoses_failed", details: e.message });
//     }
// });

// router.get("/reports-trend", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const bucket = (req.query.bucket || "day").toLowerCase();
//         const rows = await Report.aggregate([
//             { $match: { createdAt: { $gte: from, $lte: to } } },
//             { $group: { _id: { t: { $dateTrunc: { date: "$createdAt", unit: bucket } } }, count: { $sum: 1 } } },
//             { $sort: { "_id.t": 1 } },
//             { $project: { _id: 0, date: "$_id.t", count: 1 } }
//         ]);
//         const labels = rows.map((r) => r.date);
//         const series = [{ name: "Reports", data: rows.map((r) => r.count) }];
//         return res.json({ ok: true, labels, series });
//     } catch (e) {
//         return res.status(500).json({ error: "trend_failed", details: e.message });
//     }
// });

// router.get("/coverage-split", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const rows = await Report.aggregate([
//             { $match: { createdAt: { $gte: from, $lte: to } } },
//             ...latestAnalysisLookup(),
//             {
//                 $group: {
//                     _id: { covered: { $cond: [{ $eq: ["$analysis.decision", "✅ Covered"] }, "covered", "notCovered"] } },
//                     value: { $sum: 1 }
//                 }
//             },
//             { $project: { _id: 0, label: "$_id.covered", value: 1 } }
//         ]);
//         let covered = 0,
//             notCovered = 0;
//         rows.forEach((r) => (r.label === "covered" ? (covered = r.value) : (notCovered = r.value)));
//         return res.json({
//             ok: true,
//             covered,
//             notCovered,
//             coverageSuccessPercent: covered + notCovered > 0 ? Math.round((covered / (covered + notCovered)) * 100) : 0
//         });
//     } catch (e) {
//         return res.status(500).json({ error: "coverage_split_failed", details: e.message });
//     }
// });

// export default router;






















































// "use strict";

// import express from "express";
// import Report from "../models/Report.js";
// import Analysis from "../models/Analysis.js";

// const router = express.Router();

// function parseRange(q) {
//     const to = q.to ? new Date(q.to) : new Date();
//     const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 24 * 3600 * 1000);
//     return { from, to };
// }

// // Latest analysis per report join
// function latestAnalysisLookup() {
//     return [
//         {
//             $lookup: {
//                 from: "analyses",
//                 let: { rid: "$_id" },
//                 pipeline: [
//                     { $match: { $expr: { $eq: ["$reportId", "$$rid"] } } },
//                     { $sort: { createdAt: -1 } },
//                     { $limit: 1 },
//                     { $project: { decision: 1, clauseRef: 1, resultJson: 1, createdAt: 1 } }
//                 ],
//                 as: "analysis"
//             }
//         },
//         { $addFields: { analysis: { $first: "$analysis" } } }
//     ];
// }

// // Normalize decision into "covered"/"notCovered"
// function decisionNormalizationStage() {
//     return {
//         $addFields: {
//             _dec: {
//                 $cond: [
//                     { $in: ["$analysis.decision", ["✅ Covered", "Covered", "covered", "COVERED"]] },
//                     "covered",
//                     "notCovered"
//                 ]
//             }
//         }
//     };
// }

// // KPIs
// router.get("/kpis", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const now = new Date();
//         const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
//         const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//         const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
//         const [rangeTotal, thisMonth, lastMonth, coveredCount] = await Promise.all([
//             Report.countDocuments({ createdAt: { $gte: from, $lte: to } }),
//             Report.countDocuments({ createdAt: thisMonthStart ? { $gte: thisMonthStart, $lte: now } : {} }),
//             Report.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
//             Analysis.aggregate([
//                 { $sort: { createdAt: -1 } },
//                 { $group: { _id: "$reportId", latest: { $first: "$$ROOT" } } },
//                 { $lookup: { from: "reports", localField: "_id", foreignField: "_id", as: "rep" } },
//                 { $unwind: "$rep" },
//                 { $match: { "rep.createdAt": { $gte: from, $lte: to } } },
//                 { $match: { "latest.decision": { $in: ["✅ Covered", "Covered", "covered", "COVERED"] } } },
//                 { $count: "c" }
//             ])
//         ]);

//         const covered = Array.isArray(coveredCount) && coveredCount?.c ? coveredCount.c : 0;
//         const notCovered = Math.max(rangeTotal - covered, 0);
//         const coverageSuccessPercent = rangeTotal ? Math.round((covered / rangeTotal) * 100) : 0;

//         return res.json({
//             ok: true, kpis: {
//                 totalReports: rangeTotal,
//                 thisMonthReports: thisMonth,
//                 lastMonthReports: lastMonth,
//                 coverageSuccessPercent,
//                 coveredCount: covered,
//                 notCoveredCount: notCovered
//             }
//         });
//     } catch (e) {
//         return res.status(500).json({ error: "kpis_failed", details: e.message });
//     }
// });

// // Top Diagnoses
// router.get("/top-diagnoses", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const limit = Math.max(1, Math.min(parseInt(req.query.limit || "5", 10), 20));
//         const rows = await Report.aggregate([
//             { $match: { createdAt: { $gte: from, $lte: to } } },
//             { $group: { _id: { $toLower: { $ifNull: ["$diagnosis", "unknown"] } }, value: { $sum: 1 } } },
//             { $sort: { value: -1 } },
//             { $limit: limit },
//             { $project: { _id: 0, label: "$_id", value: 1 } }
//         ]);
//         return res.json({ ok: true, data: rows });
//     } catch (e) {
//         return res.status(500).json({ error: "top_diagnoses_failed", details: e.message });
//     }
// });

// // Reports Trend
// router.get("/reports-trend", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const bucket = (req.query.bucket || "day").toLowerCase();
//         const rows = await Report.aggregate([
//             { $match: { createdAt: { $gte: from, $lte: to } } },
//             { $group: { _id: { t: { $dateTrunc: { date: "$createdAt", unit: bucket } } }, count: { $sum: 1 } } },
//             { $sort: { "_id.t": 1 } },
//             { $project: { _id: 0, date: "$_id.t", count: 1 } }
//         ]);
//         const labels = rows.map((r) => r.date);
//         const series = [{ name: "Reports", data: rows.map((r) => r.count) }];
//         return res.json({ ok: true, labels, series });
//     } catch (e) {
//         return res.status(500).json({ error: "trend_failed", details: e.message });
//     }
// });

// // Coverage Splitrouter.get("/coverage-split", async (req, res) => {
// router.get("/coverage-split", async (req, res) => {
//     try {
//         const { from, to } = parseRange(req.query);
//         const rows = await Analysis.aggregate([
//             { $sort: { createdAt: -1 } },
//             { $group: { _id: "$reportId", latest: { $first: "$$ROOT" } } },
//             {
//                 $lookup: {
//                     from: "reports",
//                     localField: "_id",
//                     foreignField: "_id",
//                     as: "rep"
//                 }
//             },
//             { $unwind: "$rep" },
//             { $match: { "rep.createdAt": { $gte: from, $lte: to } } },
//             {
//                 $addFields: {
//                     _dec: {
//                         $cond: [
//                             { $in: ["$latest.decision", ["✅ Covered", "Covered", "covered", "COVERED"]] },
//                             "covered",
//                             "notCovered"
//                         ]
//                     }
//                 }
//             },
//             { $group: { _id: "$_dec", value: { $sum: 1 } } },
//             { $project: { _id: 0, label: "$_id", value: 1 } }
//         ]);
//         let covered = 0, notCovered = 0;
//         rows.forEach(r => { if (r.label === "covered") covered = r.value; if (r.label === "notCovered") notCovered = r.value; });

//         return res.json({
//             ok: true,
//             covered,
//             notCovered,
//             coverageSuccessPercent: covered + notCovered > 0 ? Math.round((covered / (covered + notCovered)) * 100) : 0
//         });
//     } catch (e) {
//         return res.status(500).json({ error: "coverage_split_failed", details: e.message });
//     }
// });




// export default router;
























"use strict";

import express from "express";
import Report from "../models/Report.js";
import Analysis from "../models/Analysis.js";

const router = express.Router();

// Parse date range from query
function parseRange(q) {
    const to = q.to ? new Date(q.to) : new Date();
    const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 24 * 3600 * 1000);
    return { from, to };
}

// Latest analysis per report (Reports→Analyses lookup) - kept for reference use in other endpoints if needed
function latestAnalysisLookup() {
    return [
        {
            $lookup: {
                from: "analyses",
                let: { rid: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: ["$reportId", "$$rid"] } } },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                    { $project: { decision: 1, clauseRef: 1, resultJson: 1, createdAt: 1 } }
                ],
                as: "analysis"
            }
        },
        { $addFields: { analysis: { $first: "$analysis" } } }
    ];
}

// Normalize decision into a canonical flag
function decisionNormalizationStageAnalysisLatest() {
    return {
        $addFields: {
            _dec: {
                $cond: [
                    { $in: ["$latest.decision", ["✅ Covered", "Covered", "covered", "COVERED"]] },
                    "covered",
                    "notCovered"
                ]
            }
        }
    };
}

// KPIs (analyses-first for coverage metrics + reports counts for totals)
router.get("/kpis", async (req, res) => {
    try {
        const { from, to } = parseRange(req.query);
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const [rangeTotal, thisMonth, lastMonth, coveredCountAgg] = await Promise.all([
            Report.countDocuments({ createdAt: { $gte: from, $lte: to } }),
            Report.countDocuments({ createdAt: { $gte: thisMonthStart, $lte: now } }),
            Report.countDocuments({ createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd } }),
            Analysis.aggregate([
                { $sort: { createdAt: -1 } },
                { $group: { _id: "$reportId", latest: { $first: "$$ROOT" } } },
                {
                    $lookup: {
                        from: "reports",
                        localField: "_id",
                        foreignField: "_id",
                        as: "rep"
                    }
                },
                { $unwind: "$rep" },
                { $match: { "rep.createdAt": { $gte: from, $lte: to } } },
                { $match: { "latest.decision": { $in: ["✅ Covered", "Covered", "covered", "COVERED"] } } },
                { $count: "c" }
            ])
        ]);[2][1]

       const coveredCount = Array.isArray(coveredCountAgg) && coveredCountAgg?.c ? coveredCountAgg.c : 0;
       console.log('KPIs coveredCountAgg:', coveredCountAgg);
        const notCoveredCount = Math.max(rangeTotal - coveredCount, 0);[1]
        const coverageSuccessPercent = rangeTotal ? Math.round((coveredCount / rangeTotal) * 100) : 0;[1]

        return res.json({
            ok: true,
            kpis: {
                totalReports: rangeTotal,
                thisMonthReports: thisMonth,
                lastMonthReports: lastMonth,
                coverageSuccessPercent,
                coveredCount: coveredCount,
                notCoveredCount: notCoveredCount
            }
        });[1]
    } catch (e) {
        return res.status(500).json({ error: "kpis_failed", details: e.message });
    }
});

// Top Diagnoses (reports-based)
router.get("/top-diagnoses", async (req, res) => {
    try {
        const { from, to } = parseRange(req.query);
        const limit = Math.max(1, Math.min(parseInt(req.query.limit || "5", 10), 20));
        const rows = await Report.aggregate([
            { $match: { createdAt: { $gte: from, $lte: to } } },
            { $group: { _id: { $toLower: { $ifNull: ["$diagnosis", "unknown"] } }, value: { $sum: 1 } } },
            { $sort: { value: -1 } },
            { $limit: limit },
            { $project: { _id: 0, label: "$_id", value: 1 } }
        ]);
        return res.json({ ok: true, data: rows });
    } catch (e) {
        return res.status(500).json({ error: "top_diagnoses_failed", details: e.message });
    }
});

// Reports Trend (reports-based)
router.get("/reports-trend", async (req, res) => {
    try {
        const { from, to } = parseRange(req.query);
        const bucket = (req.query.bucket || "day").toLowerCase();
        const rows = await Report.aggregate([
            { $match: { createdAt: { $gte: from, $lte: to } } },
            { $group: { _id: { t: { $dateTrunc: { date: "$createdAt", unit: bucket } } }, count: { $sum: 1 } } },
            { $sort: { "_id.t": 1 } },
            { $project: { _id: 0, date: "$_id.t", count: 1 } }
        ]);
        const labels = rows.map((r) => r.date);
        const series = [{ name: "Reports", data: rows.map((r) => r.count) }];
        return res.json({ ok: true, labels, series });
    } catch (e) {
        return res.status(500).json({ error: "trend_failed", details: e.message });
    }
});

// Coverage Split (analyses-first, consistent with KPIs)
router.get("/coverage-split", async (req, res) => {
    try {
        const { from, to } = parseRange(req.query);
        const rows = await Analysis.aggregate([
            { $sort: { createdAt: -1 } },
            { $group: { _id: "$reportId", latest: { $first: "$$ROOT" } } },
            {
                $lookup: {
                    from: "reports",
                    localField: "_id",
                    foreignField: "_id",
                    as: "rep"
                }
            },
            { $unwind: "$rep" },
            { $match: { "rep.createdAt": { $gte: from, $lte: to } } },
            decisionNormalizationStageAnalysisLatest(),
            { $group: { _id: "$_dec", value: { $sum: 1 } } },
            { $project: { _id: 0, label: "$_id", value: 1 } }
        ]);[2][1]

        let covered = 0, notCovered = 0;[1]
        rows.forEach((r) => {
            if (r.label === "covered") covered = r.value;
            if (r.label === "notCovered") notCovered = r.value;
        });[1]

        return res.json({
            ok: true,
            covered,
            notCovered,
            coverageSuccessPercent: covered + notCovered > 0 ? Math.round((covered / (covered + notCovered)) * 100) : 0
        });[1]
    } catch (e) {
        return res.status(500).json({ error: "coverage_split_failed", details: e.message });
    }
});

export default router;