import dotenv from "dotenv";
dotenv.config();

const b64 = (s) => Buffer.from(s, "utf8").toString("base64");
const ADMIN_USER = process.env.ANALYTICS_ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ANALYTICS_ADMIN_PASS || "admin";

// Correct interpolation with backticks
const EXPECTED = "Basic " + Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`, "utf8").toString("base64");

export default function adminAuth(req, res, next) {
    const auth = req.headers["authorization"] || "";
    if (auth === EXPECTED) return next();
    res.setHeader("WWW-Authenticate", 'Basic realm="Admin"');
    return res.status(401).json({ error: "Unauthorized" });
}
