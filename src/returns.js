// Returns handling for OrderDesk and refund approval.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('A return must cover at least one line');
  }

  const orderAgeDays =
    (Date.now() - new Date(order.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);

  const RETURN_WINDOW_DAYS = 30;

  if (orderAgeDays > RETURN_WINDOW_DAYS) {
    throw new Error('Returns outside 30 days are not allowed');
  }

  // Keep both rules: the return-window policy applies to the whole order,
  // while final-clearance filtering applies only to the requested lines.
  const returnLines = lines.filter((line) => !line.finalClearance);

  if (returnLines.length === 0) {
    throw new Error('Final-clearance items cannot be returned');
  }

  return {
    orderId: order.id,
    lines: returnLines,
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId) {
  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
  };
}

module.exports = { openReturn, approve };