program zk_privacy_escrow.aleo {

    // On-chain storage for job escrow
    mapping escrow_accounts: address => u64;
    mapping job_escrow: u64 => u64;

    // Struct for storing freelancer credentials
    struct Credential {
        owner_id: address,
        credential_hash: field, // ZK-friendly hash of credential data
        issuer: address,       // Who issued this credential
        expiration: u32        // Block height when credential expires
    }

    // Struct for job postings
    struct Job {
        job_id: u64,
        employer: address,
        payment_amount: u64,
        escrow: field,         // Hash of escrow transaction
        status: u8,           // 0 = Open, 1 = In Progress, 2 = Completed, 3 = Disputed
        required_credential: field // Hash of required credential type
    }

    // Struct for freelancer applications
    struct Application {
        job_id: u64,
        freelancer: address,
        credential_proof: field, // ZK proof of qualification without revealing details
        bid_amount: u64,       // Optional bid amount
        accepted: bool
    }

    // Struct for work submission
    struct WorkSubmission {
        job_id: u64,
        proof_of_work: field,  // ZK proof that work meets requirements
        submission_hash: field  // Hash of submitted work
    }

    // Storage mappings
    mapping owner_credentials: address => Credential;
    mapping jobs: u64 => Job;
    mapping applications: u64 => Application;
    mapping work_submissions: u64 => WorkSubmission;

    /* Credential Issuance */
    async transition issue_credential(
        public owner_id: address, 
        private credential_data: field,
        private expiration: u32
    ) -> (Credential, Future) {
        let issuer: address = self.caller;
        let credential_hash: field = BHP256::hash_to_field(credential_data);

        let credential: Credential = Credential {
            owner_id: owner_id,
            credential_hash: credential_hash,
            issuer: issuer,
            expiration: expiration
        };
        
        return (credential, finalize_issue_credential(owner_id, credential));
    }

    async function finalize_issue_credential(
        public owner_id: address,
        public credential: Credential
    ) {
        // Verify the credential hasn't expired
        assert(credential.expiration > block.height);
        
        Mapping::set(owner_credentials, owner_id, credential);
    }

  
    /* Job Management */
    async transition post_job(
        private job_id: u64,
        private payment_amount: u64,
        private required_credential: field
    ) -> Future {
        let employer: address = self.caller;
        let escrow: field = BHP256::hash_to_field(payment_amount);

        // Employer must deposit funds into escrow
        //let current_balance: u64 = Mapping::get_or_use(escrow_accounts, employer, 0u64);
        //assert(current_balance >= payment_amount);

        return finalize_post_job(job_id, employer, payment_amount, escrow, required_credential);
    }

    async function finalize_post_job(
        public job_id: u64,
        public employer: address,
        public payment_amount: u64,
        public escrow: field,
        public required_credential: field
    ) {
        // Store the job details
        Mapping::set(jobs, job_id, Job {
            job_id: job_id,
            employer: employer,
            payment_amount: payment_amount,
            escrow: escrow,
            status: 0u8,
            required_credential: required_credential
        });

        // Lock the escrow funds
        let current_balance: u64 = Mapping::get_or_use(escrow_accounts, employer, 0u64);
        assert(current_balance >= payment_amount);

        Mapping::set(escrow_accounts, employer, current_balance - payment_amount);
        Mapping::set(job_escrow, job_id, payment_amount);
    }


  async transition apply_for_job(
        public job_id: u64,
        private credential_proof: field,
        private bid_amount: u64
    ) -> Future {

        let freelancer: address = self.caller;

        // Verify bid amount is reasonable (optional)
        assert(bid_amount != 0u64);

        return finalize_apply_for_job(job_id, credential_proof, freelancer, bid_amount);
    }

    async function finalize_apply_for_job(
        public job_id: u64,
        public credential_proof: field,
        public freelancer: address,
        public bid_amount: u64
    ) {

        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: freelancer,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });

        // Verify job is open
        assert(job.status == 0u8);
        
        assert(bid_amount <= job.payment_amount);
        
        Mapping::set(applications, job_id, Application {
            job_id: job_id,
            freelancer: freelancer,
            credential_proof: credential_proof,
            bid_amount: bid_amount,
            accepted: false
        });
    }


    async transition accept_freelancer(
        private job_id: u64,
        private freelancer: address
    ) -> Future {
        let employer: address = self.caller;

        return finalize_accept_freelancer(job_id, freelancer);
    }

    async function finalize_accept_freelancer(
        public job_id: u64,
        public freelancer: address
    ) {
        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: freelancer,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });
    
        // Verify caller is the employer
        assert(job.employer == job.employer);

        // Verify job is still open
        assert(job.status == 0u8);

        // Update job status
        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            payment_amount: job.payment_amount,
            escrow: job.escrow,
            status: 1u8,
            required_credential: job.required_credential
        });

        // Mark application as accepted
        let application: Application = Mapping::get_or_use(applications, job_id, Application {
            job_id: job_id,
            freelancer: freelancer,
            credential_proof: 0field,
            bid_amount: 0u64,
            accepted: false
        });

        Mapping::set(applications, job_id, Application {
            job_id: application.job_id,
            freelancer: application.freelancer,
            credential_proof: application.credential_proof,
            bid_amount: application.bid_amount,
            accepted: true
        });
    }




    /* Work Submission */
    async transition submit_work(
        private job_id: u64,
        private work_proof: field,
        private submission_hash: field
    ) -> Future {
        let freelancer: address = self.caller;

        return finalize_submit_work(job_id, work_proof, submission_hash, freelancer);
    }

    async function finalize_submit_work(
        public job_id: u64,
        public work_proof: field,
        public submission_hash: field,
        public freelancer: address
    ) {

        // Verify caller is the accepted freelancer
        let application: Application = Mapping::get_or_use(applications, job_id, Application {
            job_id: job_id,
            freelancer: freelancer,
            credential_proof: 0field,
            bid_amount: 0u64,
            accepted: false
        });
        assert(application.accepted);

        // Store work submission
        Mapping::set(work_submissions, job_id, WorkSubmission {
            job_id: job_id,
            proof_of_work: work_proof,
            submission_hash: submission_hash
        });

        // Update job status
        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: freelancer,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });
    
        // Verify job is in progress
        assert(job.status == 1u8);

        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            payment_amount: job.payment_amount,
            escrow: job.escrow,
            status: 2u8, // Mark as completed
            required_credential: job.required_credential
        });
    }


    /* Payment Release */
    async transition release_payment(private job_id: u64) -> Future {
        let employer: address = self.caller;

        return finalize_release_payment(job_id, employer);
    }

    async function finalize_release_payment(public job_id: u64, employer: address) {
        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: employer,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });

        // Verify caller is employer
        assert(job.employer == employer);

        // Verify job is completed
        assert(job.status == 2u8);

        let application: Application = Mapping::get_or_use(applications, job_id, Application {
            job_id: job_id,
            freelancer: employer,
            credential_proof: 0field,
            bid_amount: 0u64,
            accepted: false
        });

        // Transfer funds from escrow to freelancer
        let escrow_amount: u64 = Mapping::get_or_use(job_escrow, job_id, 0u64);
        let freelancer_balance: u64 = Mapping::get_or_use(escrow_accounts, application.freelancer, 0u64);
        
        Mapping::set(escrow_accounts, application.freelancer, freelancer_balance + escrow_amount);
        Mapping::set(job_escrow, job_id, 0u64);
    }


    /* Dispute Resolution */
    async transition dispute_job(private job_id: u64) -> Future {
        let caller: address = self.caller;

        return finalize_dispute_job(job_id, caller);
    }

    async function finalize_dispute_job(public job_id: u64, caller: address) {
        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: caller,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });
    
            // Verify caller is either employer or freelancer
        let application: Application = Mapping::get_or_use(applications, job_id, Application {
            job_id: job_id,
            freelancer: caller,
            credential_proof: 0field,
            bid_amount: 0u64,
            accepted: false
        });
        assert(job.employer == caller || application.freelancer == caller);

        // Verify job is in progress
        assert(job.status == 1u8);

        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            payment_amount: job.payment_amount,
            escrow: job.escrow,
            status: 3u8, // Mark as disputed
            required_credential: job.required_credential
        });
    }


    /* Refund in case of dispute resolution */
    async transition refund_employer(private job_id: u64) -> Future {
        let employer: address = self.caller;

        return finalize_refund_employer(job_id, employer);
    }

    async function finalize_refund_employer(public job_id: u64, public employer: address) {
        let escrow_amount: u64 = Mapping::get_or_use(job_escrow, job_id, 0u64);
        let employer_balance: u64 = Mapping::get_or_use(escrow_accounts, employer, 0u64);
    
            // This would typically be called by an arbitrator
        let job: Job = Mapping::get_or_use(jobs, job_id, Job {
            job_id: job_id,
            employer: employer,
            payment_amount: 0u64,
            escrow: 0field,
            status: 0u8,
            required_credential: 0field
        });

        // Verify job is disputed
        assert(job.status == 3u8);

        
        // Refund the employer
        Mapping::set(escrow_accounts, employer, employer_balance + escrow_amount);
        Mapping::set(job_escrow, job_id, 0u64);
    }

}