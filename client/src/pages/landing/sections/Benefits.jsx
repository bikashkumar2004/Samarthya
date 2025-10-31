import { benefits } from "../../constants";
import Heading from "./Heading";
import Section from "./Section";
import Arrow from "../../../assets/svg/Arrow";
import { GradientLight } from "../design/Benefits";
import ClipPath from "../../../assets/svg/ClipPath";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Phone, BarChart3, MessageSquare, Zap, Clock, Users } from 'lucide-react';

const Benefits = () => {
  return (
    <Section id="features">
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
    </Section>
  );
};

export default Benefits;
