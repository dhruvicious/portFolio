import { RubiksCube } from "@/components/rubiks-cube";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DevPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-8 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <h1 className="text-xl font-medium text-slate-300">Development Sandbox</h1>
      </div>
      
      <div className="w-full max-w-5xl flex-1 flex flex-col items-center justify-center">
        <RubiksCube />
      </div>
    </div>
  );
}
