import { UserProfile } from '../types';
import { Shield, Award, User, RefreshCw } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  onChangeRole: (role: 'student' | 'engineer' | 'instructor') => void;
  onResetProgress: () => void;
}

export default function Navbar({ user, onChangeRole, onResetProgress }: NavbarProps) {
  return (
    <header className="border-b-2 border-[#121212] bg-[#F1EFE9] sticky top-0 z-50 select-none" id="forensiq-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-[#121212] text-white p-2 border border-[#121212] flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#F9F7F2] stroke-[1.5]" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
              <span className="font-serif italic text-2xl tracking-tight text-[#121212]">
                Forensi<span className="font-sans font-extrabold not-italic text-red-600">Q</span>
              </span>
              <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-[#121212]/60">
                v1.0 MVP Lab Simulator
              </span>
            </div>
          </div>

          {/* Center Info: Case Catalog Metrics */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 border border-[#121212] bg-[#F9F7F2] text-xs font-bold tracking-wider font-mono text-[#121212]">
              <span>CATALOG: 100+ INDUSTRIAL CASES</span>
            </div>
            <div className="text-[10px] text-[#121212]/50 font-mono tracking-widest uppercase">
              UET SECURE
            </div>
          </div>

          {/* User Profile / Actions */}
          <div className="flex items-center space-x-4">
            {/* Score Badge */}
            <div className="flex items-center space-x-1.5 bg-[#F9F7F2] border border-[#121212] px-3 py-1 text-[#121212]">
              <Award className="h-4 w-4 text-red-600" />
              <span className="text-xs font-mono font-bold tracking-wider">{user.totalScore} PTS</span>
            </div>

            {/* Reset Stats */}
            <button
              onClick={onResetProgress}
              className="p-1.5 text-[#121212]/60 hover:text-red-600 border border-transparent hover:border-[#121212] transition-all bg-transparent"
              title="Reset Simulator State"
              id="reset-simulator-btn"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
