export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    token: process.env.AIRTABLE_TOKEN || '',
    baseId: process.env.AIRTABLE_BASE_ID || '',
  });
}
