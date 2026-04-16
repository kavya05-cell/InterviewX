import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { ArrowRight, Code, Mic, ShieldAlert, Cpu } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="z-10 max-w-4xl px-6 text-center space-y-8 mt-24">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-glow">
          AI That Interviews <span className="text-transparent bg-clip-text bg-primary-gradient">You</span> on Your Own Projects
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Upload your GitHub repository. Have a real-time voice conversation with our AI. Get instant, actionable feedback to ace your technical interviews.
        </p>
        
        <div className="flex items-center justify-center gap-4 pt-6">
          <Button size="lg" onClick={() => navigate('/auth')} className="h-14 px-8 text-lg rounded-full">
            Start Interview <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/dashboard')} className="h-14 px-8 text-lg rounded-full">
            View Dashboard
          </Button>
        </div>
      </div>

      {/* Features / How it works */}
      <div className="z-10 max-w-6xl w-full px-6 py-32 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Code className="h-8 w-8 text-primary" />}
          title="1. Sync Your Code"
          description="We analyze your GitHub repsitory to understand your tech stack, architecture, and complexity."
        />
        <FeatureCard 
          icon={<Mic className="h-8 w-8 text-primary" />}
          title="2. Voice Session"
          description="Engage in a live, low-latency duplex audio session just like a real engineering manager call."
        />
        <FeatureCard 
          icon={<Cpu className="h-8 w-8 text-primary" />}
          title="3. Deep Evaluation"
          description="Get scored on clarity, technical depth, correctness, and confidence with our LLM reasoning engine."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-card/50 border border-glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4 hover:bg-card/80 transition-colors">
      <div className="p-4 bg-primary/10 rounded-full mb-2">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
