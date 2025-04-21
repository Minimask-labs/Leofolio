'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Star, Code, Lock, Globe, ArrowRight } from 'lucide-react';
import { useRouter, redirect } from 'next/navigation';


export function LandingPage( ) {
    const router = useRouter();
  const handleGetStarted = () => {
    router.push('/auth');
  };  
  // Mock data for featured freelancers
  const featuredFreelancers = [
    {
      id: 1,
      name: 'Alex Morgan',
      title: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'GraphQL'],
      rating: 4.9,
      image: null
    },
    {
      id: 2,
      name: 'Jamie Chen',
      title: 'UI/UX Designer',
      skills: ['Figma', 'Adobe XD', 'User Research'],
      rating: 4.8,
      image: null
    },
    {
      id: 3,
      name: 'Sam Wilson',
      title: 'DevOps Engineer',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      rating: 4.7,
      image: null
    }
  ];

  // Mock data for featured projects
  const featuredProjects = [
    {
      id: 1,
      title: 'Decentralized Finance Dashboard',
      description: 'A privacy-focused dashboard for DeFi applications',
      skills: ['React', 'Solidity', 'Zero-knowledge proofs'],
      company: 'DeFi Innovations'
    },
    {
      id: 2,
      title: 'Cross-Border Payment System',
      description: 'Secure and private international payment solution',
      skills: ['Blockchain', 'Cryptography', 'API Development'],
      company: 'Global Payments Inc.'
    },
    {
      id: 3,
      title: 'Identity Verification Platform',
      description: 'Zero-knowledge credential verification system',
      skills: ['Privacy Tech', 'Blockchain', 'Web3'],
      company: 'Identity Secure'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b sticky top-0 bg-emerald-600 z-30 ">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-[#121212]" />
            <h1 className="text-2xl font-bold">Leofolio</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-slate-100 hover:text-black">
                Features
              </a>
              <a
                href="#freelancers"
                className="text-slate-100 hover:text-black"
              >
                Freelancers
              </a>
              <a href="#projects" className="text-slate-100 hover:text-black">
                Projects
              </a>
              <a href="#about" className="text-slate-100 hover:text-black">
                About
              </a>
            </nav>
            <Button
              onClick={handleGetStarted}
              className="border-emerald-600 text-emerald-700 hover:text-[#121212] bg-[#121212] hover:bg-emerald-100"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="dark:bg-gradient-to-b dark:from-emerald-600 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Privacy-Preserving{' '}
            <span className="text-[#121212]">Freelancer Platform</span>
          </h1>
          <p className="text-xl text-slate-100 max-w-3xl mx-auto mb-10">
            Connect with verified freelancers and clients while maintaining
            privacy through zero-knowledge proofs on Aleo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Join as Freelancer
            </Button>
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:text-[#121212] bg-[#121212] hover:bg-emerald-100"
            >
              Hire Talent
            </Button>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Leofolio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy-First</h3>
              <p className="text-slate-600">
                Your credentials and work history remain private while still
                being verifiable through zero-knowledge proofs.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Developer Portfolios
              </h3>
              <p className="text-slate-600">
                Showcase your skills and achievements with our customizable
                developer portfolios.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Global Opportunities
              </h3>
              <p className="text-slate-600">
                Connect with clients and freelancers worldwide with secure,
                private payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section id="freelancers" className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Top Freelancers
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Our platform features top talent with verified credentials and
            proven track records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredFreelancers.map((freelancer) => (
              <Card key={freelancer.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-4">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarFallback className="text-2xl bg-emerald-100 text-emerald-800">
                        {freelancer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">{freelancer.name}</h3>
                    <p className="text-slate-600">{freelancer.title}</p>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="ml-1 font-medium">
                        {freelancer.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {freelancer.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-600 text-emerald-700 hover:text-[#121212] bg-[#121212] hover:bg-emerald-100"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={handleGetStarted}
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:text-[#121212] bg-[#121212] hover:bg-emerald-100"
            >
              Explore All Freelancers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 ">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">
            Featured Projects
          </h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
            Discover exciting projects that are looking for talented
            freelancers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-2">
                      {project.company}
                    </p>
                    <p className="text-slate-700">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={handleGetStarted}
              variant="outline"
              className="border-blue-600 text-blue-700 hover:bg-blue-50"
            >
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">About Leofolio</h2>
            <p className="text-slate-300 mb-8">
              Leofolio is built on Aleo's privacy-preserving blockchain
              technology, enabling freelancers and clients to connect, verify
              credentials, and transact without compromising sensitive
              information.
            </p>
            <p className="text-slate-300 mb-8">
              Our mission is to create a trustless freelancing ecosystem where
              privacy and security are paramount, while still enabling
              verifiable credentials and reputation building.
            </p>
            <Button
              onClick={handleGetStarted}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Join the Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#121212] text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-emerald-400" />
                <h3 className="text-xl font-bold text-white">Leofolio</h3>
              </div>
              <p className="max-w-xs text-slate-400">
                Privacy-preserving freelancer platform built on Aleo blockchain
                technology.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-white font-medium mb-4">Platform</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Tutorials
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-emerald-400">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-700 mt-12 pt-8 text-center text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} Leofolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
