import credits.aleo;

program escrow_contract10.aleo {
    // On-chain storage mappings
    mapping escrow_accounts: address => u64;  // Tracks escrow balances per user
    mapping job_escrow: u64 => u64;           // Tracks escrowed amounts per job
    
    // Job structure
    struct Job {
        job_id: u64,
        employer: address,
        freelancer: address,
        payment_amount: u64,
        status: u8    // 0 = Open, 1 = In Progress, 2 = Completed, 3 = Disputed
    }
    
    // Storage mapping for jobs
    mapping jobs: u64 => Job;
    
    /* Job Creation with Escrow */
    async transition create_job(
        job_id: u64,
        payment_amount: u64,
        escrow_address: address,
    ) -> (Job, Future) {
        // Validate payment amount
        assert(payment_amount > 0u64);
        
        let employer: address = self.caller;
        
        // Create job object
        let job: Job = Job {
            job_id: job_id,
            employer: employer,
            freelancer: aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,  // Empty placeholder
            payment_amount: payment_amount,
            status: 0u8
        };

        // Transfer funds from employer to contract escrow
        let future: Future = credits.aleo/transfer_public_as_signer(escrow_address, payment_amount);
        
        return (job, finalize_create_job(job_id, employer, payment_amount, future));
    }
    
    async function finalize_create_job(
        job_id: u64,
        employer: address,
        payment_amount: u64,
        f: Future
    ) {
        // Complete the transfer
        f.await();
        
        // Verify the transfer was successful
        let current_balance: u64 = Mapping::get_or_use(escrow_accounts, employer, 0u64);
        Mapping::set(escrow_accounts, employer, current_balance + payment_amount);
        
        // Store the job
        Mapping::set(jobs, job_id, Job {
            job_id: job_id,
            employer: employer,
            freelancer: aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,
            payment_amount: payment_amount,
            status: 0u8
        });
        
        // Track job-specific escrow
        Mapping::set(job_escrow, job_id, payment_amount);
    }
    
    /* Accept Job */
    async transition accept_job(
        job_id: u64
    ) -> Future {
        let freelancer: address = self.caller;
        
        return finalize_accept_job(job_id, freelancer);
    }
    
    async function finalize_accept_job(
        job_id: u64,
        freelancer: address
    ) {
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify job is open and hasn't been accepted yet
        assert(job.status == 0u8);
        assert(job.freelancer == aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc);
        
        // Update job with freelancer
        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            freelancer: freelancer,
            payment_amount: job.payment_amount,
            status: 1u8  // In Progress
        });
    }
    
    /* Complete Job */
    async transition complete_job(
        job_id: u64
    ) -> Future {
        let freelancer: address = self.caller;
        
        return finalize_complete_job(job_id, freelancer);
    }
    
    async function finalize_complete_job(
        job_id: u64,
        freelancer: address
    ) {
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify caller is the freelancer and job is in progress
        assert(job.freelancer == freelancer);
        assert(job.status == 1u8);
        
        // Mark job as completed
        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            freelancer: job.freelancer,
            payment_amount: job.payment_amount,
            status: 2u8  // Completed
        });
    }
    
    /* Release Payment */
    async transition release_payment(
        job_id: u64,
        freelancer: address,
        amount: u64,
    ) -> Future {
        // Employer releases payment
        let employer: address = self.caller;
    
        let future: Future = credits.aleo/transfer_public(freelancer, amount);
        
        return finalize_release_payment(future, job_id, employer, freelancer, amount);
    }
    
    
    async function finalize_release_payment(
        f: Future,
        job_id: u64,
        employer: address,
        freelancer: address,
        amount: u64
    ) {
        // Complete the transfer
        f.await();
        
        // Update escrow balances
        let employer_balance: u64 = Mapping::get(escrow_accounts, employer);
        Mapping::set(escrow_accounts, employer, employer_balance - amount);
        
        // Clear job escrow
        Mapping::set(job_escrow, job_id, 0u64);
        
        // Mark job as paid (optional)
        let job: Job = Mapping::get(jobs, job_id);
    
        // Verify job is completed
        assert(job.status == 2u8);

        //check amount matches
        assert(job.payment_amount == amount);

        //check job id matches 
        assert(job.job_id == job_id);

        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            freelancer: job.freelancer,
            payment_amount: job.payment_amount,
            status: 4u8  // Paid (new status)
        });
    }
    
    /* Dispute Job */
    async transition dispute_job(
        job_id: u64
    ) -> Future {
        let caller: address = self.caller;
        return finalize_dispute_job(job_id, caller);
    }
    
    async function finalize_dispute_job(
        job_id: u64,
        caller: address
    ) {
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify caller is either employer or freelancer
        assert(job.employer == caller || job.freelancer == caller);
        
        // Verify job is in progress
        assert(job.status == 1u8);
        
        // Mark job as disputed
        Mapping::set(jobs, job_id, Job {
            job_id: job.job_id,
            employer: job.employer,
            freelancer: job.freelancer,
            payment_amount: job.payment_amount,
            status: 3u8  // Disputed
        });
    }
    
    /* Resolve Dispute */
    async transition resolve_dispute(
        job_id: u64,
        to_employer: bool
    ) -> Future {
        // This would typically be called by an arbitrator in a real system
        // For simplicity, we'll allow either party to resolve
        let caller: address = self.caller;

        return finalize_resolve_dispute(job_id, caller, to_employer);
    }
    
    async function finalize_resolve_dispute(
        job_id: u64,
        caller: address,
        to_employer: bool,
       
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify job is disputed
        assert(job.status == 3u8);
        
        // Verify caller is employer or freelancer (simplification - would be an arbitrator in reality)
        assert(job.employer == caller || job.freelancer == caller);
        
        // Get escrow amount
        let escrow_amount: u64 = Mapping::get(job_escrow, job_id);
        
        if to_employer {
            // Refund to employer
            let employer_balance: u64 = Mapping::get_or_use(escrow_accounts, job.employer, 0u64);
            Mapping::set(escrow_accounts, job.employer, employer_balance + escrow_amount);
        } else {
            // Pay freelancer
            let freelancer_balance: u64 = Mapping::get_or_use(escrow_accounts, job.freelancer, 0u64);
            Mapping::set(escrow_accounts, job.freelancer, freelancer_balance + escrow_amount);
        }
        
        // Clear escrow
        Mapping::set(job_escrow, job_id, 0u64);
    }
    
    /* View Functions */
    async transition get_job(job_id: u64) -> Future {
        return finalize_get_job(job_id);
    }
    
    async function finalize_get_job(job_id: u64) {
        let job: Job = Mapping::get(jobs, job_id);
    }
    
    async transition get_escrow_balance(user: address) -> Future {
        return finalize_get_escrow_balance(user);
    }
    
    async function finalize_get_escrow_balance(user: address) {
        let balance: u64 = Mapping::get_or_use(escrow_accounts, user, 0u64);
    }
}
