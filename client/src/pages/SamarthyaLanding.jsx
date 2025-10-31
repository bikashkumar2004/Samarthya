'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Phone, BarChart3, MessageSquare, Zap, Clock, Users } from 'lucide-react';

export default function SamarthyaLanding() {
  const [activeTab, setActiveTab] = useState('problem');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Samarthya
          </div>
          <div className="flex gap-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Pricing</Button>
            <Button variant="default">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-8">
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <Badge variant="outline" className="mx-auto">
            <Zap className="w-3 h-3 mr-1" /> Intelligent CRM for Government Services
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Stop Calling.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start Converting.
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI that autonomously calls 10,000+ students, understands their concerns in Odia, Hindi & English, and updates tickets—without lifting a finger.
          </p>

          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="gap-2">
              Start Free Trial <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" /> Watch Demo
            </Button>
          </div>

          <div className="flex items-center justify-center gap-8 text-sm text-slate-600 pt-4">
            <div>✓ 14-day free trial</div>
            <div>✓ No credit card required</div>
            <div>✓ Setup in 10 minutes</div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 py-8 px-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">70%</div>
            <p className="text-sm text-slate-600">Less Manual Work</p>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <p className="text-sm text-slate-600">AI Availability</p>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-sm text-slate-600">Languages Supported</p>
          </div>
          <div className="text-center border-l border-slate-200">
            <div className="text-2xl font-bold text-purple-600">10,000+</div>
            <p className="text-sm text-slate-600">Calls/Day</p>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">
              The Problem Today
            </h2>
            <p className="text-lg text-slate-600">Government helplines are drowning—and students are frustrated</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Problem Cards */}
            <Card className="p-8 border-red-200 bg-red-50/50 hover:shadow-lg transition-shadow">
              <Phone className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Manual Calling Doesn't Scale</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Your team spends 6 hours/day calling students about reminders. Yet 40% never pick up.
              </p>
              <div className="mt-4 text-2xl font-bold text-red-600">40% Dropout Rate</div>
            </Card>

            <Card className="p-8 border-orange-200 bg-orange-50/50 hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">Students Call 10 Times</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Merit lists released, 5-person helpline receives 500 calls in 2 hours. Complete chaos.
              </p>
              <div className="mt-4 text-2xl font-bold text-orange-600">500 Calls/2 Hours</div>
            </Card>

            <Card className="p-8 border-yellow-200 bg-yellow-50/50 hover:shadow-lg transition-shadow">
              <BarChart3 className="w-8 h-8 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold mb-3">44% Revenue Loss</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Deadlines pass, verifications delay, applications rejected. Everyone loses.
              </p>
              <div className="mt-4 text-2xl font-bold text-yellow-600">₹4.4 Cr Lost/Year</div>
            </Card>
          </div>

          {/* Solution Section */}
          <div className="mt-20 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold">
                The Solution
              </h2>
              <p className="text-lg text-slate-600">Meet Samarthya: The AI that does the calling, listening & resolving</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Solution Cards */}
              <Card className="p-8 border-blue-200 bg-blue-50/50 hover:shadow-lg transition-shadow">
                <Phone className="w-8 h-8 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">AI Voice Agent</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Calls in Odia, Hindi & English</li>
                  <li>✓ Understands natural speech</li>
                  <li>✓ Detects frustration & escalates</li>
                  <li>✓ Answers questions in real-time</li>
                </ul>
              </Card>

              <Card className="p-8 border-purple-200 bg-purple-50/50 hover:shadow-lg transition-shadow">
                <BarChart3 className="w-8 h-8 text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Unified Dashboard</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ All channels in one place</li>
                  <li>✓ Real-time call transcripts</li>
                  <li>✓ Auto-ticket creation</li>
                  <li>✓ Team performance tracking</li>
                </ul>
              </Card>

              <Card className="p-8 border-green-200 bg-green-50/50 hover:shadow-lg transition-shadow">
                <Clock className="w-8 h-8 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-3">Sentiment Analytics</h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>✓ Real-time sentiment detection</li>
                  <li>✓ Predict churn & intervene</li>
                  <li>✓ 87% accuracy in emotions</li>
                  <li>✓ Identify frustrated students</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-white rounded-3xl">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="text-lg text-slate-600">From setup to success in 3 steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 1, title: 'Import Contacts', desc: 'Upload CSV from SAMS or connect via API', icon: '📥' },
              { step: 2, title: 'Configure AI', desc: 'Customize message in Odia/Hindi/English', icon: '✏️' },
              { step: 3, title: 'Launch & Monitor', desc: 'AI makes 1,000 calls while you relax', icon: '🚀' },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-12 h-12 rounded-full text-white flex items-center justify-center text-2xl font-bold">
                  {item.step}
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </div>
                {item.step < 3 && (
                  <ChevronRight className="absolute -right-4 top-5 w-6 h-6 text-slate-300 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Why Samarthya vs. Hiring 10 More Agents?</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="text-center p-4 font-semibold text-red-600">10 More Agents</th>
                <th className="text-center p-4 font-semibold text-green-600">Samarthya AI</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Monthly Cost', agents: '₹2,50,000', samarthya: '₹49,999' },
                { feature: 'Availability', agents: '8h/day, 5 days/week', samarthya: '24/7/365' },
                { feature: 'Languages', agents: '1-2 per agent', samarthya: 'Odia, Hindi, English' },
                { feature: 'Call Capacity', agents: '~500 calls/day', samarthya: '10,000+ calls/day' },
                { feature: 'Sick Days', agents: '10 days/agent/year', samarthya: 'Never' },
              ].map((row) => (
                <tr key={row.feature} className="border-b border-slate-100">
                  <td className="p-4 font-medium">{row.feature}</td>
                  <td className="p-4 text-center text-slate-600">{row.agents}</td>
                  <td className="p-4 text-center font-semibold text-green-600">{row.samarthya}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center">
          <Button size="lg">Calculate Your ROI Savings →</Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Trusted by Government Institutions</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              quote: "We reduced helpline load by 70% during admission season. Game-changer!",
              author: "Operations Head",
              company: "SAMS Odisha"
            },
            {
              quote: "Samarthya detected frustrated students before complaints. Resolution time: 48h → 6h",
              author: "Manager",
              company: "State Scholarship Portal"
            },
            {
              quote: "Simple to use, powerful results. Even non-tech agents set it up in 10 minutes.",
              author: "Administrator",
              company: "e-District Services"
            }
          ].map((testimonial, idx) => (
            <Card key={idx} className="p-8 border-slate-200 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-slate-600">{testimonial.company}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="text-lg text-slate-600">No hidden fees. No per-agent charges.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter',
              price: '₹19,999',
              features: ['1,000 AI calls/month', '5 agent seats', 'SMS, WhatsApp, Email', 'Basic analytics']
            },
            {
              name: 'Professional',
              price: '₹49,999',
              features: ['Unlimited AI calls', '20 agent seats', 'All channels', 'Advanced analytics'],
              popular: true
            },
            {
              name: 'Enterprise',
              price: 'Custom',
              features: ['Unlimited everything', 'Dedicated manager', 'Custom integrations', 'On-premise option']
            }
          ].map((plan, idx) => (
            <Card
              key={idx}
              className={`p-8 relative transition-all ${
                plan.popular
                  ? 'border-2 border-blue-600 shadow-lg scale-105'
                  : 'border border-slate-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600">Most Popular</Badge>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-6">{plan.price}<span className="text-sm text-slate-600">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                    <span className="text-green-600">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                Start Free Trial
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-slate-600">💯 14-Day Free Trial. No Credit Card. Cancel Anytime.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Does Samarthya replace our helpline agents?',
              a: 'No! Samarthya handles repetitive tasks so your agents focus on complex issues. Think of it as a super-powered assistant.'
            },
            {
              q: 'How accurate is the AI in Odia?',
              a: 'Our AI achieves 94% accuracy in Odia (trained on 10,000+ hours). Hindi & English: 97%+'
            },
            {
              q: 'What if a query is too complex?',
              a: 'Samarthya detects confusion and escalates to human agents with full context automatically.'
            },
            {
              q: 'Can we integrate with SAMS portal?',
              a: 'Yes! API integrations available, or simply upload CSV daily. Both work seamlessly.'
            }
          ].map((faq, idx) => (
            <Card key={idx} className="p-6 border-slate-200 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm">{faq.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center space-y-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl text-white p-12">
        <h2 className="text-4xl font-bold">Ready to 10X Your Citizen Engagement?</h2>
        <p className="text-lg opacity-90">Join 50+ government institutions handling 100,000+ calls monthly with Samarthya</p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" variant="secondary" className="gap-2">
            Start Free Trial <ChevronRight className="w-4 h-4" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 text-white border-white hover:bg-white/10">
            Schedule Demo
          </Button>
        </div>
        <p className="text-sm opacity-75">⏰ Limited Time: First 10 institutions get 3 months at 50% off</p>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About Us</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Email</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>© 2025 Samarthya. Built with ❤️ for Odisha's Digital Future. Proudly Made in India 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
