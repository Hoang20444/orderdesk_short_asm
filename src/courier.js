// Courier handoff. The external courier system is sometimes unreachable.
// Stop retrying after three failed courier attempts.
const RETRY_LIMIT = 3;

function handoff(shipment, courierClient) {
  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt += 1) {
    const result = courierClient.send(shipment);
    if (result.ok) {
      return { ok: true, trackingNumber: result.trackingNumber, attempts: attempt };
    }
  }
  return { ok: false, trackingNumber: null, attempts: RETRY_LIMIT };
}
//ssss/git commit -m "Add courier timeout handling"
module.exports = { handoff, RETRY_LIMIT };
