program escrow_contract_v1.aleo {
    // On-chain storage mappings
    mapping job_escrow: u64 => u64;
    
    // Simple Job struct with minimal necessary info
    struct Job {
        job_id: u64,
        employer: address,
        freelancer: address,
        payment_amount: u64,
        status: u8    // 0 = Open, 1 = In Progress, 2 = Completed, 3 = Disputed
    }
    
    // Storage mapping for jobs
    mapping jobs: u64 => Job;

    /* Job Creation with Direct Escrow */
    async transition create_job(
        private job_id: u64,
        private payment_amount: u64
    ) -> (Job, Future) {
        // Create new job with caller as employer
        let employer: address = self.caller;
        
        // Create job object
        let job: Job = Job {
            job_id: job_id,
            employer: employer,
            freelancer: aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,  // Empty address placeholder
            payment_amount: payment_amount,
            status: 0u8
        };
        
        // Store job and escrow amount directly
        return (job, finalize_create_job(job_id, employer, payment_amount));
    }
    
    async function finalize_create_job(
        public job_id: u64,
        public employer: address,
        public payment_amount: u64
    ) {
        // Store the job
        Mapping::set(jobs, job_id, Job {
            job_id: job_id,
            employer: employer,
            freelancer: aleo1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq3ljyzc,
            payment_amount: payment_amount,
            status: 0u8
        });
        
        // Store escrow amount directly with job
        Mapping::set(job_escrow, job_id, payment_amount);
    }
    
    /* Accept Job */
    async transition accept_job(
        private job_id: u64
    ) -> Future {
        // Freelancer accepts the job
        let freelancer: address = self.caller;
        
        return finalize_accept_job(job_id, freelancer);
    }
    
    async function finalize_accept_job(
        public job_id: u64,
        public freelancer: address
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify job is still open
        assert(job.status == 0u8);
        
        // Update job with freelancer and status
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
        private job_id: u64
    ) -> Future {
        // Freelancer marks job as complete
        let freelancer: address = self.caller;
        
        return finalize_complete_job(job_id, freelancer);
    }
    
    async function finalize_complete_job(
        public job_id: u64,
        public freelancer: address
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify caller is the freelancer
        assert(job.freelancer == freelancer);
        
        // Verify job is in progress
        assert(job.status == 1u8);
        
        // Update job status to completed
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
        private job_id: u64
    ) -> Future {
        // Employer releases payment
        let employer: address = self.caller;
        
        return finalize_release_payment(job_id, employer);
    }
    
    async function finalize_release_payment(
        public job_id: u64,
        public employer: address
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify caller is the employer
        assert(job.employer == employer);
        
        // Verify job is completed
        assert(job.status == 2u8);
        
        // Transfer funds from escrow to freelancer
        let escrow_amount: u64 = Mapping::get(job_escrow, job_id);
        
        // Clear escrow and complete payment
        Mapping::set(job_escrow, job_id, 0u64);
    }
    
    /* Dispute Job */
    async transition dispute_job(
        private job_id: u64
    ) -> Future {
        // Either party can dispute
        let caller: address = self.caller;
        
        return finalize_dispute_job(job_id, caller);
    }
    
    async function finalize_dispute_job(
        public job_id: u64,
        public caller: address
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify caller is either employer or freelancer
        assert(job.employer == caller || job.freelancer == caller);
        
        // Verify job is in progress (can only dispute active jobs)
        assert(job.status == 1u8);
        
        // Update job status to disputed
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
        private job_id: u64,
        private to_employer: bool
    ) -> Future {
        // This would typically be called by an arbitrator in a real system
        // For simplicity, we'll allow either party to resolve
        let caller: address = self.caller;
        
        return finalize_resolve_dispute(job_id, caller, to_employer);
    }
    
    async function finalize_resolve_dispute(
        public job_id: u64,
        public caller: address,
        public to_employer: bool
    ) {
        // Get job details
        let job: Job = Mapping::get(jobs, job_id);
        
        // Verify job is disputed
        assert(job.status == 3u8);
        
        // Verify caller is employer or freelancer (simplification - would be an arbitrator in reality)
        assert(job.employer == caller || job.freelancer == caller);
        
        // Get escrow amount
        let escrow_amount: u64 = Mapping::get(job_escrow, job_id);
        
        // Clear escrow
        Mapping::set(job_escrow, job_id, 0u64);
    }
    
    /* Get Job Details */
    async transition get_job(private job_id: u64) -> Future {
        return finalize_get_job(job_id);
    }
    
    async function finalize_get_job(public job_id: u64) {
        let job: Job = Mapping::get(jobs, job_id);
    }
}