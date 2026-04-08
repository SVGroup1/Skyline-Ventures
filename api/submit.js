export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    return res.status(500).json({ error: 'Missing Airtable credentials' });
  }

  try {
    const body = req.body;

    const fields = {
      'Business Name':              body.bizName || '',
      'Owner Name':                 body.ownerName || '',
      'Phone':                      body.phone || '',
      'Email':                      body.email || '',
      'Address':                    body.address || '',
      'Years in Operation':         body.yearsOp ? parseFloat(body.yearsOp) : null,
      'Owner Role':                 body.opType || '',
      'Reason for Selling':         body.sellReason || '',
      'Annual Revenue':             body.annualRev ? parseFloat(body.annualRev) : null,
      'Revenue Source':             body.revSrc || '',
      'Payment Systems':            body.paymentSystems || '',
      'Monthly Rent':               body.monthlyRent ? parseFloat(body.monthlyRent) : null,
      'Monthly Utilities':          body.monthlyUtil ? parseFloat(body.monthlyUtil) : null,
      'Monthly Labor':              body.monthlyLabor ? parseFloat(body.monthlyLabor) : null,
      'Lease Years Remaining':      body.leaseYrs ? parseFloat(body.leaseYrs) : null,
      'Lease Options':              body.leaseOpts || '',
      'Rent Escalation':            body.rentEsc || '',
      'Number of Washers':          body.numWashers ? parseFloat(body.numWashers) : null,
      'Number of Dryers':           body.numDryers ? parseFloat(body.numDryers) : null,
      'Machine Age (avg years)':    body.machineAge ? parseFloat(body.machineAge) : null,
      'Machine Ownership':          body.machineOwn || '',
      'Last Equipment Refresh':     body.lastRefresh || '',
      'Equipment Condition':        body.equipCond || '',
      'Asking Price':               body.askingPrice ? parseFloat(body.askingPrice) : null,
      'Seller Financing':           body.sellerFin || '',
      'Timeline':                   body.timeline || '',
      'Seller Notes':               body.notes || '',
      'Stage Status':               'Pending Review',
      'Submission Date':            new Date().toISOString().split('T')[0],
    };

    // Remove null fields so Airtable doesn't complain
    Object.keys(fields).forEach(k => {
      if (fields[k] === null || fields[k] === '') delete fields[k];
    });

    const response = await fetch(
      `https://api.airtable.com/v0/${baseId}/Submissions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fields }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Airtable error:', err);
      return res.status(500).json({ error: 'Failed to save to Airtable', detail: err });
    }

    const result = await response.json();
    return res.status(200).json({ success: true, id: result.id });

  } catch (err) {
    console.error('Submit error:', err);
    return res.status(500).json({ error: err.message });
  }
}
