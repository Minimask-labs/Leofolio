program zk_privacy_escrow.aleo;

struct Credential:
    owner_id as address;
    credential_hash as field;
    issuer as address;
    expiration as u32;

struct Job:
    job_id as u64;
    employer as address;
    payment_amount as u64;
    escrow as field;
    status as u8;
    required_credential as field;

struct Application:
    job_id as u64;
    freelancer as address;
    credential_proof as field;
    bid_amount as u64;
    accepted as boolean;

struct WorkSubmission:
    job_id as u64;
    proof_of_work as field;
    submission_hash as field;

mapping escrow_accounts:
    key as address.public;
    value as u64.public;

mapping job_escrow:
    key as u64.public;
    value as u64.public;

mapping owner_credentials:
    key as address.public;
    value as Credential.public;

mapping jobs:
    key as u64.public;
    value as Job.public;

mapping applications:
    key as u64.public;
    value as Application.public;

mapping work_submissions:
    key as u64.public;
    value as WorkSubmission.public;

function issue_credential:
    input r0 as address.public;
    input r1 as field.private;
    input r2 as u32.private;
    hash.bhp256 r1 into r3 as field;
    cast r0 r3 self.caller r2 into r4 as Credential;
    async issue_credential r0 r4 into r5;
    output r4 as Credential.private;
    output r5 as zk_privacy_escrow.aleo/issue_credential.future;

finalize issue_credential:
    input r0 as address.public;
    input r1 as Credential.public;
    gt r1.expiration block.height into r2;
    assert.eq r2 true;
    set r1 into owner_credentials[r0];

function post_job:
    input r0 as u64.private;
    input r1 as u64.private;
    input r2 as field.private;
    hash.bhp256 r1 into r3 as field;
    async post_job r0 self.caller r1 r3 r2 into r4;
    output r4 as zk_privacy_escrow.aleo/post_job.future;

finalize post_job:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as u64.public;
    input r3 as field.public;
    input r4 as field.public;
    cast r0 r1 r2 r3 0u8 r4 into r5 as Job;
    set r5 into jobs[r0];
    get.or_use escrow_accounts[r1] 0u64 into r6;
    gte r6 r2 into r7;
    assert.eq r7 true;
    sub r6 r2 into r8;
    set r8 into escrow_accounts[r1];
    set r2 into job_escrow[r0];

function apply_for_job:
    input r0 as u64.public;
    input r1 as field.private;
    input r2 as u64.private;
    is.neq r2 0u64 into r3;
    assert.eq r3 true;
    async apply_for_job r0 r1 self.caller r2 into r4;
    output r4 as zk_privacy_escrow.aleo/apply_for_job.future;

finalize apply_for_job:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as address.public;
    input r3 as u64.public;
    cast r0 r2 0u64 0field 0u8 0field into r4 as Job;
    get.or_use jobs[r0] r4 into r5;
    is.eq r5.status 0u8 into r6;
    assert.eq r6 true;
    lte r3 r5.payment_amount into r7;
    assert.eq r7 true;
    cast r0 r2 r1 r3 false into r8 as Application;
    set r8 into applications[r0];

function accept_freelancer:
    input r0 as u64.private;
    input r1 as address.private;
    async accept_freelancer r0 r1 into r2;
    output r2 as zk_privacy_escrow.aleo/accept_freelancer.future;

finalize accept_freelancer:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 r1 0u64 0field 0u8 0field into r2 as Job;
    get.or_use jobs[r0] r2 into r3;
    is.eq r3.employer r3.employer into r4;
    assert.eq r4 true;
    is.eq r3.status 0u8 into r5;
    assert.eq r5 true;
    cast r3.job_id r3.employer r3.payment_amount r3.escrow 1u8 r3.required_credential into r6 as Job;
    set r6 into jobs[r0];
    cast r0 r1 0field 0u64 false into r7 as Application;
    get.or_use applications[r0] r7 into r8;
    cast r8.job_id r8.freelancer r8.credential_proof r8.bid_amount true into r9 as Application;
    set r9 into applications[r0];

function submit_work:
    input r0 as u64.private;
    input r1 as field.private;
    input r2 as field.private;
    async submit_work r0 r1 r2 self.caller into r3;
    output r3 as zk_privacy_escrow.aleo/submit_work.future;

finalize submit_work:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as address.public;
    cast r0 r3 0field 0u64 false into r4 as Application;
    get.or_use applications[r0] r4 into r5;
    assert.eq r5.accepted true;
    cast r0 r1 r2 into r6 as WorkSubmission;
    set r6 into work_submissions[r0];
    cast r0 r3 0u64 0field 0u8 0field into r7 as Job;
    get.or_use jobs[r0] r7 into r8;
    is.eq r8.status 1u8 into r9;
    assert.eq r9 true;
    cast r8.job_id r8.employer r8.payment_amount r8.escrow 2u8 r8.required_credential into r10 as Job;
    set r10 into jobs[r0];

function release_payment:
    input r0 as u64.private;
    async release_payment r0 self.caller into r1;
    output r1 as zk_privacy_escrow.aleo/release_payment.future;

finalize release_payment:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 r1 0u64 0field 0u8 0field into r2 as Job;
    get.or_use jobs[r0] r2 into r3;
    is.eq r3.employer r1 into r4;
    assert.eq r4 true;
    is.eq r3.status 2u8 into r5;
    assert.eq r5 true;
    cast r0 r1 0field 0u64 false into r6 as Application;
    get.or_use applications[r0] r6 into r7;
    get.or_use job_escrow[r0] 0u64 into r8;
    get.or_use escrow_accounts[r7.freelancer] 0u64 into r9;
    add r9 r8 into r10;
    set r10 into escrow_accounts[r7.freelancer];
    set 0u64 into job_escrow[r0];

function dispute_job:
    input r0 as u64.private;
    async dispute_job r0 self.caller into r1;
    output r1 as zk_privacy_escrow.aleo/dispute_job.future;

finalize dispute_job:
    input r0 as u64.public;
    input r1 as address.public;
    cast r0 r1 0u64 0field 0u8 0field into r2 as Job;
    get.or_use jobs[r0] r2 into r3;
    cast r0 r1 0field 0u64 false into r4 as Application;
    get.or_use applications[r0] r4 into r5;
    is.eq r3.employer r1 into r6;
    is.eq r5.freelancer r1 into r7;
    or r6 r7 into r8;
    assert.eq r8 true;
    is.eq r3.status 1u8 into r9;
    assert.eq r9 true;
    cast r3.job_id r3.employer r3.payment_amount r3.escrow 3u8 r3.required_credential into r10 as Job;
    set r10 into jobs[r0];

function refund_employer:
    input r0 as u64.private;
    async refund_employer r0 self.caller into r1;
    output r1 as zk_privacy_escrow.aleo/refund_employer.future;

finalize refund_employer:
    input r0 as u64.public;
    input r1 as address.public;
    get.or_use job_escrow[r0] 0u64 into r2;
    get.or_use escrow_accounts[r1] 0u64 into r3;
    cast r0 r1 0u64 0field 0u8 0field into r4 as Job;
    get.or_use jobs[r0] r4 into r5;
    is.eq r5.status 3u8 into r6;
    assert.eq r6 true;
    add r3 r2 into r7;
    set r7 into escrow_accounts[r1];
    set 0u64 into job_escrow[r0];
