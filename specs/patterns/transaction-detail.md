# Transaction detail

**Figma:** Card transactions `9640:34528`, Transfer details `7961:112407`  
**Implementation:** `TransactionDetailScreen`, `transactionDetailContent.ts`, `DetailNotice`

## Shared chrome

- Summary (`_Transactions / Summary New`): category mark, amount (struck when returned/declined), `{Status} · {detail date}`
- Optional `DetailNotice` under the summary (warning / danger / neutral)
- Sticky footer actions from the view model (`dispute`, `get_help`, `download_receipt`) — stubs until backends exist

## Card payment

- Rows: Paid with, optional Charged on, copyable Transaction ID, optional amount rows, Merchant
- Optional sections: Currency, Fee details, Related payment, Dispute, Cashback
- Status comes from `listStatus` first, then kind; refund pending must not render as Refunded
- Pending uses Get help; settled completed uses Dispute

## Transfer

- Phases: completed, processing, delayed, returned
- Processing / delayed / returned: Get help only; completed outbound: Download receipt + Get help + Send again
- Returned may include You sent / Returned to you blocks

## Payout

- Sender + Transfer details; Completed · date; Get help
