# Creating a Job (Employer)
### Function: create_job(job_id, payment_amount, escrow_address)

Web Interface:

- Employer fills out a form with:

- Job ID (unique identifier) -> u64

- Payment amount (in Aleo credits) -> u64 [remember 1 aleo credit = 1000000u64 microcredit]

- Selects escrow account (could be auto-filled with their wallet) -> program address

What Happens:

- The contract validates the payment amount is positive

- Creates a job record with status "Open"

- Transfers funds from employer to contract escrow

- Stores the job details on-chain

User Experience:

- Employer sees a confirmation screen

- Their wallet prompts to approve the fund transfer

- After confirmation, job appears in "Open Jobs" list

# Accepting a Job (Freelancer)
### Function: accept_job(job_id)

Web Interface:

- Freelancer browses open jobs

- Clicks "Accept" on a job listing

- Confirms the action in their wallet

What Happens:

- Contract verifies job is open

- Updates job record with freelancer's address

- Changes status to "In Progress"

User Experience:

- Job moves from "Open" to "My Jobs" section

- Both parties can now communicate through the platform

# Completing a Job (Freelancer)
### Function: complete_job(job_id)

Web Interface:

- Freelancer clicks "Mark as Complete"

- Confirms the action

- Optionally submits deliverables through the interface

What Happens:

- Contract verifies caller is the assigned freelancer

- Updates job status to "Completed"

User Experience:

- Job moves to "Pending Payment" state

- Employer receives notification to release funds

# Releasing Payment (Employer)
### Function: release_payment(job_id, freelancer, amount)

Web Interface:

- Employer sees completed jobs

- Clicks "Release Payment"

- Confirms amount and recipient (auto-filled)

- Approves transaction in wallet

What Happens:

- Funds are transferred from escrow to freelancer

- Escrow balances are updated

Job status changes to "Paid"

accept job -> job_id(u64)
complete job -> job_id(u64)
