'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Shield, Star, Code, Lock, Globe, ArrowRight } from 'lucide-react';
import { useRouter, redirect } from 'next/navigation';

export function LandingPage() {
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="border-b border-blue-100 sticky top-0 bg-white/80 backdrop-blur-sm z-30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Leofolio</h1>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                Features
              </a>
              <a
                href="#freelancers"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                Freelancers
              </a>
              <a
                href="#projects"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                Projects
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-500 transition-colors"
              >
                About
              </a>
            </nav>
            <Button
              onClick={handleGetStarted}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-600">
            Privacy-Preserving Freelancer Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Connect with verified freelancers and clients while maintaining
            privacy through zero-knowledge proofs on Aleo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            >
              Join as Freelancer
            </Button>
            <Button
              onClick={handleGetStarted}
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 transition-colors"
            >
              Hire Talent
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Choose Leofolio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow bg-blue-50/50">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Privacy-First
              </h3>
              <p className="text-gray-600">
                Your credentials and work history remain private while still
                being verifiable through zero-knowledge proofs.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow bg-blue-50/50">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Code className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Developer Portfolios
              </h3>
              <p className="text-gray-600">
                Showcase your skills and achievements with our customizable
                developer portfolios.
              </p>
            </div>
            <div className="text-center p-8 rounded-2xl hover:shadow-lg transition-shadow bg-blue-50/50">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">
                Global Opportunities
              </h3>
              <p className="text-gray-600">
                Connect with clients and freelancers worldwide with secure,
                private payments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Freelancers */}
      <section id="freelancers" className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Top Freelancers
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Our platform features top talent with verified credentials and
            proven track records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredFreelancers.map((freelancer) => (
              <Card
                key={freelancer.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-blue-100"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-28 w-28 mb-6">
                      <AvatarFallback className="text-3xl bg-blue-100 text-blue-500">
                        {freelancer.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {freelancer.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{freelancer.title}</p>
                    <div className="flex items-center mt-3">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="ml-2 font-medium text-gray-900">
                        {freelancer.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {freelancer.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="bg-blue-50 text-blue-500"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-500 transition-colors"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleGetStarted}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 transition-colors"
            >
              Explore All Freelancers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            Featured Projects
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Discover exciting projects that are looking for talented
            freelancers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card
                key={project.id}
                className="overflow-hidden hover:shadow-lg transition-shadow bg-white border-blue-100"
              >
                <CardContent className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                      {project.title}
                    </h3>
                    <p className="text-blue-500 text-sm font-medium mb-3">
                      {project.company}
                    </p>
                    <p className="text-gray-600">{project.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="bg-blue-50 text-blue-500 border-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-end">
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              onClick={handleGetStarted}
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 transition-colors"
            >
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-20 bg-gradient-to-b from-blue-500 to-blue-600"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 text-white">
              About Leofolio
            </h2>
            <p className="text-blue-50 mb-8 text-lg">
              Leofolio is built on Aleo's privacy-preserving blockchain
              technology, enabling freelancers and clients to connect, verify
              credentials, and transact without compromising sensitive
              information.
            </p>
            <p className="text-blue-50 mb-12 text-lg">
              Our mission is to create a trustless freelancing ecosystem where
              privacy and security are paramount, while still enabling
              verifiable credentials and reputation building.
            </p>
            <Button
              onClick={handleGetStarted}
              className="bg-white text-blue-500 hover:bg-blue-50 transition-colors"
            >
              Join the Community
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-600 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-12 md:mb-0">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="h-8 w-8 text-blue-500" />
                <h3 className="text-2xl font-bold text-gray-900">Leofolio</h3>
              </div>
              <p className="max-w-xs text-gray-500">
                Privacy-preserving freelancer platform built on Aleo blockchain
                technology.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-gray-900 font-medium mb-6 text-lg">
                  Platform
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      How it Works
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-6 text-lg">
                  Resources
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Tutorials
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-6 text-lg">
                  Connect
                </h4>
                <ul className="space-y-4">
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      Discord
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-blue-500 transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} Leofolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
