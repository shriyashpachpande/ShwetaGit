export function adminAuth(req, res, next) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken === process.env.ADMIN_TOKEN) {
    return next();
  }
  return res.status(403).json({ error: 'Unauthorized' });
}
