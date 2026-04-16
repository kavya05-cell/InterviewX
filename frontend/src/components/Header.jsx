import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu } from 'lucide-react';
import { Button } from './ui/Button';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="border-b border-glass bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* LEFT: Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer min-w-fit"
          onClick={() => navigate('/')}
        >
          <div className="bg-primary/20 p-1.5 rounded-lg text-primary">
            <Cpu size={24} />
          </div>
          <span className="font-bold text-xl whitespace-nowrap">
            InterviewX
          </span>
        </div>

        {/* CENTER: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button onClick={() => navigate('/')}>Home</button>
          <button onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button onClick={() => navigate('/records')}>Records</button>
          <button onClick={() => navigate('/about')}>About</button>
          <button onClick={() => navigate('/contact')}>Contact</button>
        </nav>

        {/* RIGHT: User */}
        <div className="flex items-center gap-4 min-w-fit">
          <span className="text-sm text-gray-300 hidden sm:block">
            Kavya Rajput
          </span>

          <Button variant="ghost" size="sm">
            Log Out
          </Button>

          <div className="w-8 h-8 rounded-full bg-primary-gradient border border-glass flex items-center justify-center font-bold text-xs text-white">
            JD
          </div>
        </div>

      </div>
    </header>
  );
}