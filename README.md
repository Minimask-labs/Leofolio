 
### Leofolio: Privacy-Preserving Freelancer Platform

Leofolio is a privacy-first freelancer platform built on Aleo blockchain technology. It enables freelancers to store their credentials, work history, and payment information privately while allowing them to selectively share verifiable proofs with potential employers through zero-knowledge proofs.

## 🌟 Features

### For Freelancers

- **Private Credential Management**: Store educational and professional credentials securely
- **Work History Privacy**: Maintain a private record of your professional experience
- **Zero-Knowledge Proofs**: Generate verifiable proofs without revealing sensitive information
- **Secure Payments**: Receive payments privately through blockchain technology
- **Professional Devfolio**: Showcase your skills with privacy controls
- **Project Management**: Track and manage client projects efficiently

### For Employers

- **Verified Talent**: Find freelancers with cryptographically verified credentials
- **Project Management**: Create, assign, and track projects with ease
- **Secure Payments**: Process invoices with privacy-preserving technology
- **Team Collaboration**: Communicate and collaborate securely
- **Performance Analytics**: Generate detailed project reports and analytics

## 🚀 Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Blockchain**: Aleo (privacy-focused blockchain)
- **Authentication**: Wallet-based authentication
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Context API
- **Styling**: Tailwind CSS with custom theming

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- An Aleo-compatible wallet (e.g., [Leo Wallet](https://leo.app/))

## 🔧 Installation

1. Clone the repository:

```bash
git clone https://github.com/Minimask-labs/Leofolio.git
cd Leofolio
````

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```plaintext
Leofolio/
├── app/                  # Next.js app directory
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── ...               # Other pages
├── components/           # React components
│   └── ...               # components
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Global styles
├── types/                # TypeScript type definitions
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies
```

## 🖥️ Usage

### For Freelancers

1. **Sign Up**: Connect your wallet and create a freelancer account
2. **Add Credentials**: Securely store your educational and professional credentials
3. **Build Your Profile**: Create your professional Devfolio
4. **Generate Proofs**: Create zero-knowledge proofs to verify your credentials without revealing sensitive data
5. **Find Projects**: Browse available projects and apply with your verified credentials
6. **Manage Projects**: Track progress, communicate with clients, and receive payments

### For Employers

1. **Sign Up**: Connect your wallet and create an employer account
2. **Find Talent**: Browse the directory of verified freelancers
3. **Create Projects**: Define project requirements, milestones, and deadlines
4. **Hire Freelancers**: Verify credentials and hire talent
5. **Manage Projects**: Track progress, communicate with team members, and process payments
6. **Generate Reports**: Create detailed project reports and analytics

## 💼 Job Lifecycle on Aleo

Leofolio enables a secure and transparent job process powered by Aleo smart contracts.

### 1. Creating a Job (Employer)

**Function:** `create_job(job_id, payment_amount, escrow_address)`

**Web Interface:**

* Employer fills a form with:

  * Job ID (`u64`)
  * Payment amount in Aleo credits (`u64`)
  * Escrow address (`address`)

**What Happens:**

* Validates that payment is positive
* Creates a job record with status `Open`
* Transfers funds to contract escrow
* Stores job details on-chain

**User Experience:**

* Wallet prompts to approve transaction
* Confirmation shown
* Job appears in **Open Jobs**

---

### 2. Accepting a Job (Freelancer)

**Function:** `accept_job(job_id)`

**Web Interface:**

* Freelancer clicks **Accept** on job listing
* Confirms via wallet

**What Happens:**

* Contract verifies job is `Open`
* Assigns freelancer's address
* Updates status to `In Progress`

**User Experience:**

* Job appears under **My Jobs**
* Communication tools enabled

---

### 3. Completing a Job (Freelancer)

**Function:** `complete_job(job_id)`

**Web Interface:**

* Freelancer clicks **Mark as Complete**
* Optionally uploads deliverables
* Confirms via wallet

**What Happens:**

* Verifies caller is the assigned freelancer
* Updates status to `Completed`

**User Experience:**

* Job moves to **Pending Payment**
* Employer is notified

---

### 4. Releasing Payment (Employer)

**Function:** `release_payment(job_id, freelancer, amount)`

**Web Interface:**

* Employer reviews job
* Clicks **Release Payment**
* Confirms recipient and amount
* Approves in wallet

**What Happens:**

* Funds transferred from escrow to freelancer
* Updates status to `Paid`

**User Experience:**

* Payment confirmation displayed
* Job marked as completed


## 🔒 Privacy Features

Leofolio leverages Aleo's blockchain technology to provide:

* **Zero-Knowledge Proofs**: Verify credentials without revealing the underlying data
* **Private Transactions**: Process payments with privacy-preserving technology
* **Encrypted Storage**: Secure storage of sensitive information
* **Selective Disclosure**: Control what information is shared and with whom
* **Verifiable Credentials**: Cryptographically verify the authenticity of credentials

## 🤝 Contributing

We welcome contributions to Leofolio! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

* [Website](https://leofolio.minimasklabs.xyz/)
 * [Aleo Blockchain](https://aleo.org)
 
## 📧 Contact

* **Project Lead**: Kufre-abasi Bassey - [@KufreabasiBass1](https://x.com/KufreabasiBass1) - [kufreabasibassey3@gmail.com](kufreabasibassey3@gmail.com)
* **Project Website**: [https://leofolio.minimasklabs.xyz/](https://leofolio.minimasklabs.xyz/)

---

Built with ❤️ on [Aleo](https://aleo.org)
