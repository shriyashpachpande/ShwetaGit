// //---------------------------main file-----------------------------



// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { requireAuth } from '@clerk/express';

// // Existing routers
// import reportRoutes from './routes/report.js';
// import policyRoutes from './routes/policy.js';
// import analyzeRoutes from './routes/analyze.js';
// import chatRouter from './routes/chat.js';
// import uploadRoutes from './routes/uploadRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import multiReportRoutes from './routes/multi-report-route.js';
// import multiPolicyRoutes from './routes/multi-policy-route.js';
// import multiAnalyzeRoutes from './routes/multi-analyze-route.js';
// import medicalAnalysisRoutes from './routes/medicalAnalysisRoutes.js';
// import subscriptionRoutes from './routes/subscription.js';
// import { connectDB } from './utils/db.js';

// // NEW: Admin analytics
// import adminAuth from './middleware/adminAuth.js';
// import analyticsRoutes from './routes/analytics.routes.js';
// import ensureIndexes from './indexes.js';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // Core middleware
// app.use(cors({ origin: 'http://localhost:5173', allowedHeaders: ['Content-Type','Authorization'] }));
// app.use(express.json({ limit: '10mb' }));

// // Static uploads
// const uploadsPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
// app.use('/uploads', express.static(uploadsPath));

// // Connect MongoDB and ensure indexes
// connectDB()
//     .then(async () => {
//         console.log('MongoDB connected');
//         if (ensureIndexes) {
//             await ensureIndexes();
//             console.log('Indexes ensured');
//         }
//     })
//     .catch(err => console.error('MongoDB connection error', err));

// // Public/regular API routes (unchanged)
// app.use('/api/report', reportRoutes);
// app.use('/api/policy', policyRoutes);
// app.use('/api/analyze', analyzeRoutes);
// app.use('/api/chat', chatRouter);
// app.use('/api/multi-report', multiReportRoutes);
// app.use('/api/multi-policy', multiPolicyRoutes);
// app.use('/api/multi-analyze', multiAnalyzeRoutes);
// app.use('/api/medical-ana', medicalAnalysisRoutes);
// app.use('/api', uploadRoutes);
// app.use('/api', chatRoutes);

// // Clerk-protected
// app.use('/api/subscription', requireAuth(), subscriptionRoutes);

// // NEW: Admin-only analytics namespace (Basic Auth)
// app.use('/admin', adminAuth);
// app.use('/admin/analytics', analyticsRoutes);

// // Health
// app.get('/health', (_req, res) => res.json({ ok: true }));

// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Server running on port ${ port }`));















//----------------------------------------File save and run this not main file-----------------------------------
//----------------------------------------File save and run this not main file-----------------------------------
//----------------------------------------File save and run this not main file-----------------------------------
//----------------------------------------File save and run this not main file-----------------------------------




import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '@clerk/express';

// Existing routers
import reportRoutes from './routes/report.js';
import policyRoutes from './routes/policy.js';
import analyzeRoutes from './routes/analyze.js';
import chatRouter from './routes/chat.js';
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import multiReportRoutes from './routes/multi-report-route.js';
import multiPolicyRoutes from './routes/multi-policy-route.js';
import multiAnalyzeRoutes from './routes/multi-analyze-route.js';
import medicalAnalysisRoutes from './routes/medicalAnalysisRoutes.js';
import subscriptionRoutes from './routes/subscription.js';
import { connectDB } from './utils/db.js';

// NEW: Admin analytics
import adminAuth from './middleware/adminAuth.js';
import analyticsRoutes from './routes/analytics.routes.js';
import ensureIndexes from './indexes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



const allowedOrigins = [
  "http://localhost:5173",              // Local dev
  "https://sih-health.vercel.app",
  "https://docbotlcausesense.vercel.app"// Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Static uploads
const uploadsPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Connect MongoDB and ensure indexes
connectDB()
    .then(async () => {
        console.log('MongoDB connected');
        if (ensureIndexes) {
            await ensureIndexes();
            console.log('Indexes ensured');
        }
    })
    .catch(err => console.error('MongoDB connection error', err));

// Public/regular API routes (unchanged)
app.use('/api/report', reportRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/analyze', analyzeRoutes);
app.use('/api/chat', chatRouter);
app.use('/api/multi-report', multiReportRoutes);
app.use('/api/multi-policy', multiPolicyRoutes);
app.use('/api/multi-analyze', multiAnalyzeRoutes);
app.use('/api/medical-ana', medicalAnalysisRoutes);
app.use('/api', uploadRoutes);
app.use('/api', chatRoutes);

// Clerk-protected
app.use('/api/subscription', requireAuth(), subscriptionRoutes);

// NEW: Admin-only analytics namespace (Basic Auth)
app.use('/admin', adminAuth);
app.use('/admin/analytics', analyticsRoutes);







//govertmentsceeh added herer
import govtSchemesRoute from "./routes/govtSchemes.route.js";
app.use("/api/govt-schemes", govtSchemesRoute);
//end herer






// Health
app.get('/health', (_req, res) => res.json({ ok: true }));
// ------------------ CONTACT ROUTE ------------------ //
app.post("/api/contact", async (req, res) => {
  const { user_name, user_email, message } = req.body;

  if (!user_name || !user_email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Send email via EmailJS REST API
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: { user_name, user_email, message },
      }),
    });

    if (response.ok) {
      return res.json({ success: true, message: "Message sent successfully ✅" });
    } else {
      const errorData = await response.json();
      return res.status(500).json({ error: "Failed to send message", details: errorData });
    }
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${ port }`));




































// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import dotenv from 'dotenv';


// dotenv.config();
// const app = express();
// app.use(cors({ origin: 'http://localhost:5173' }));
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI);

// import govtSchemesRoute from "./routes/govtSchemes.route.js";
// app.use("/api/govt-schemes", govtSchemesRoute);



// app.listen(5000, () => {
//   console.log('Server running on http://localhost:5000');
// });































//------------------------merger code



// // backend/server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Clerk (protect subscription endpoints)
// import { requireAuth } from '@clerk/express';

// // Routers (de-duplicated)
// import reportRoutes from './routes/report.js';
// import policyRoutes from './routes/policy.js';
// import analyzeRoutes from './routes/analyze.js';
// import chatRouter from './routes/chat.js';
// import uploadRoutes from './routes/uploadRoutes.js';
// import chatRoutes from './routes/chatRoutes.js';
// import multiReportRoutes from './routes/multi-report-route.js';
// import multiPolicyRoutes from './routes/multi-policy-route.js';
// import multiAnalyzeRoutes from './routes/multi-analyze-route.js';

// // Payments and subscriptions
// import paymentRoutes from './routes/payment.js';             // from 2nd snippet
// import subscriptionRoutes from './routes/subscription.js';   // from 1st snippet

// // Analytics
// // Choose ONE analytics router; prefer the newer split: admin namespace + analyticsRoutes
// // If your project uses two different files, keep both imports and mount accordingly.
// import analyticsRoutes from './routes/analytics.routes.js';  // from 1st snippet (admin namespace)
// import analyticsApiRoutes from './routes/analytics.js';      // from 2nd snippet (public api analytics, optional)

// // Admin auth + indexes utilities
// import adminAuth from './middleware/adminAuth.js';           // from 1st snippet
// import ensureIndexes from './indexes.js';                    // from 1st snippet

// // Optional centralized DB connector (preferred)
// import { connectDB } from './utils/db.js';                   // from 1st snippet

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// // CORS and body parser
// app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', allowedHeaders: ['Content-Type','Authorization'] }));
// app.use(express.json({ limit: '10mb' }));

// // Static uploads
// const uploadsPath = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');
// app.use('/uploads', express.static(uploadsPath));

// // ---------- Database connection ----------
// const runDb = async () => {
//   if (typeof connectDB === 'function') {
//     // Use your shared util if present
//     await connectDB();
//     console.log('MongoDB connected');
//   } else {
//     // Fallback to direct mongoose connection if connectDB not implemented
//     await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
//     console.log('MongoDB connected (direct)');
//   }
//   if (ensureIndexes) {
//     await ensureIndexes();
//     console.log('Indexes ensured');
//   }
// };

// runDb().catch(err => console.error('MongoDB connection error', err));

// // ---------- Routes ----------
// // Core feature routes
// app.use('/api/report', reportRoutes);
// app.use('/api/policy', policyRoutes);
// app.use('/api/analyze', analyzeRoutes);
// app.use('/api/chat', chatRouter);

// // Multi routes
// app.use('/api/multi-report', multiReportRoutes);
// app.use('/api/multi-policy', multiPolicyRoutes);
// app.use('/api/multi-analyze', multiAnalyzeRoutes);

// // Upload + extra chat routes
// app.use('/api', uploadRoutes);
// app.use('/api', chatRoutes);

// // Payments (public) and Subscriptions (Clerk-protected)
// if (paymentRoutes) app.use('/api/payment', paymentRoutes); // optional if present
// if (subscriptionRoutes) app.use('/api/subscription', requireAuth(), subscriptionRoutes); // Clerk protect

// // Public analytics API (optional, keep only if you actually use it)
// if (analyticsApiRoutes) app.use('/api/analytics', analyticsApiRoutes);

// // Admin-only analytics namespace
// // Basic admin auth middleware boundary, then mount admin analytics router
// app.use('/admin', adminAuth);
// if (analyticsRoutes) app.use('/admin/analytics', analyticsRoutes);

// // Contact endpoint (from 2nd snippet)
// app.post('/api/contact', async (req, res) => {
//   const { user_name, user_email, message } = req.body;
//   if (!user_name || !user_email || !message) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }
//   try {
//     const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         service_id: process.env.EMAILJS_SERVICE_ID,
//         template_id: process.env.EMAILJS_TEMPLATE_ID,
//         user_id: process.env.EMAILJS_PUBLIC_KEY,
//         template_params: { user_name, user_email, message },
//       }),
//     });
//     if (response.ok) {
//       return res.json({ success: true, message: 'Message sent successfully ✅' });
//     } else {
//       const errorData = await response.json().catch(() => ({}));
//       return res.status(500).json({ error: 'Failed to send message', details: errorData });
//     }
//   } catch (err) {
//     console.error('Error sending email:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // Health check
// app.get('/health', (_req, res) => res.json({ ok: true }));

// // ---------- Server start ----------
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
