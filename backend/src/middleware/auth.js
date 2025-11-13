// src/middleware/auth.js
import { createClerkClient } from "@clerk/clerk-sdk-node";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// Reads Bearer token from Authorization header and verifies with Clerk
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: "No auth token" });

    const session = await clerk.sessions.verifySession({ sessionId: token }).catch(() => null);

    // If using Clerk Frontend API tokens instead of sessionId, you can do:
    // const { userId } = await clerk.verifyToken(token);

    if (!session) return res.status(401).json({ error: "Invalid session" });

    const user = await clerk.users.getUser(session.userId);
    req.auth = {
      clerkUserId: user.id,
      email: user.emailAddresses?.[0]?.emailAddress,
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    };
    next();
  } catch (e) {
    return res.status(401).json({ error: "Auth failed" });
  }
}
