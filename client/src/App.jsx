import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Search, Sparkles, ExternalLink, CheckCircle2,
  ArrowRight, Layers, Terminal, Zap, Bookmark,
  Trash2, Clock, Download, Cpu, Activity, Globe
} from 'lucide-react';
import { cn } from './lib/utils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PRESET_PROMPTS = [
  "Payment gateway bug fix",
  "Prep Q4 marketing launch strategy",
  "Onboard new frontend engineer",
  "Prepare database migration notes"
];

// 21st.dev Spring Animation Variants
const springTransition = { type: "spring", stiffness: 300, damping: 25 };

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [workspace, setWorkspace] = useState(null);
  const [savedWorkspaces, setSavedWorkspaces] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('contextshift_saved');
    if (saved) {
      try {
        setSavedWorkspaces(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved workspaces:", e);
      }
    }
  }, []);

  const saveToStorage = (updatedList) => {
    setSavedWorkspaces(updatedList);
    localStorage.setItem('contextshift_saved', JSON.stringify(updatedList));
  };

  const handlePrepWorkspace = async (e, customPrompt = null) => {
    if (e) e.preventDefault();
    const query = customPrompt || prompt;
    if (!query.trim()) return;

    setLoading(true);
    setWorkspace(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/workspace/prep`, { prompt: query });
      if (response.data.success) {
        setWorkspace(response.data.data);
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to backend server or generate AI context.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCurrentWorkspace = () => {
    if (!workspace) return;
    const isAlreadySaved = savedWorkspaces.some((item) => item.taskTitle === workspace.taskTitle);
    if (isAlreadySaved) return;

    const updated = [workspace, ...savedWorkspaces];
    saveToStorage(updated);
  };

  const handleDeleteWorkspace = (titleToDelete) => {
    const updated = savedWorkspaces.filter((item) => item.taskTitle !== titleToDelete);
    saveToStorage(updated);
  };

  const handleLaunchAll = () => {
    if (workspace?.resources && workspace.resources.length > 0) {
      workspace.resources.forEach((res) => {
        window.open(res.url, '_blank', 'noopener,noreferrer');
      });
    }
  };

  const handleExportMarkdown = () => {
    if (!workspace) return;
    const mdContent = `# ${workspace.taskTitle}\n\n` +
      `## Briefing\n${workspace.summaryBullets?.map((b) => `- ${b}`).join('\n')}\n\n` +
      `## Prepared Assets\n${workspace.resources?.map((r) => `- [${r.title}](${r.url}) (${r.type}):${r.snippet}`).join('\n')}`;

    const blob = new Blob([mdContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workspace.taskTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_context.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-start p-6 pt-16 font-sans relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* 21st.dev Dynamic Gradient Mesh & Dot Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Glowing Orbs */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[300px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        className="text-center max-w-xl mb-8 relative z-10"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800/80 text-indigo-400 text-xs font-medium mb-5 backdrop-blur-xl shadow-[0_0_20px_rgba(99,102,241,0.2)] cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">
            ContextShift AI v2.0
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
        </motion.div>

        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-sm">
          Shift Workspaces <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            In Milliseconds
          </span>
        </h1>
        <p className="text-slate-400 text-sm font-normal leading-relaxed max-w-md mx-auto">
          Type your active objective. Generative AI orchestration builds your exact context, PRs, and documentation instantly.
        </p>
      </motion.div>

      {/* 21st.dev Animated Input Command Bar */}
      <motion.form
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...springTransition, delay: 0.1 }}
        onSubmit={(e) => handlePrepWorkspace(e)}
        className="w-full max-w-2xl mb-4 relative z-10"
      >
        <div className="relative flex items-center bg-slate-900/70 backdrop-blur-2xl border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500/80 focus-within:ring-4 focus-within:ring-indigo-500/10 shadow-2xl transition-all group">
          <Search className="w-5 h-5 text-slate-500 ml-3 mr-2 shrink-0 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Prep workspace for payment gateway bug fix..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none text-sm py-2 px-1 font-medium"
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="bg-slate-100 hover:bg-white text-slate-950 px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50 shrink-0 shadow-lg transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Cpu className="w-4 h-4 animate-spin text-slate-900" /> Synthesizing...
              </span>
            ) : (
              <>
                <span>Shift Context</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>

      {/* Quick Presets Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mb-8 relative z-10"
      >
        <span className="text-xs font-mono text-slate-500 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-400" /> Presets:
        </span>
        {PRESET_PROMPTS.map((preset, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setPrompt(preset);
              handlePrepWorkspace(null, preset);
            }}
            className="text-xs bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 text-slate-300 hover:text-white px-3.5 py-1.5 rounded-lg backdrop-blur-md transition-all shadow-sm"
          >
            {preset}
          </motion.button>
        ))}
      </motion.div>

      {/* Saved Workspaces Component */}
      <AnimatePresence>
        {savedWorkspaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-2xl p-4 mb-8 relative z-10 shadow-xl"
          >
            <div className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5 px-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Saved Context Snapshots ({savedWorkspaces.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {savedWorkspaces.map((saved, idx) => (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs cursor-pointer transition-all",
                    workspace?.taskTitle === saved.taskTitle
                      ? "bg-indigo-600/20 border-indigo-500/80 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.25)]"
                      : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                  )}
                  onClick={() => setWorkspace(saved)}
                >
                  <span className="font-medium truncate max-w-[180px]">{saved.taskTitle}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteWorkspace(saved.taskTitle);
                    }}
                    className="text-slate-500 hover:text-rose-400 transition-colors ml-1 p-0.5 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Workspace Showcase Card (21st.dev Glass Card Style) */}
      <AnimatePresence mode="wait">
        {workspace && (
          <motion.div
            key={workspace.taskTitle}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={springTransition}
            className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800 rounded-3xl p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative z-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-5 mb-6 gap-4">
              <div>
                <span className="text-[10px] font-mono font-medium text-indigo-400 uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  Active Context
                </span>
                <h2 className="text-2xl font-bold text-white mt-2 tracking-tight">{workspace.taskTitle}</h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleExportMarkdown}
                  className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" /> Export MD
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveCurrentWorkspace}
                  className="bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Bookmark className="w-3.5 h-3.5 text-indigo-400" /> Save
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(16,185,129,0.35)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunchAll}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch All ({workspace.resources?.length || 0})
                </motion.button>
              </div>
            </div>

            {/* Briefing Section */}
            <div className="mb-6 bg-slate-950/60 rounded-2xl p-5 border border-slate-800/80 shadow-inner">
              <h3 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" /> Executive Briefing
              </h3>
              <ul className="space-y-2.5">
                {workspace.summaryBullets?.map((bullet, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    className="text-sm text-slate-300 flex items-start gap-3 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Prepared Assets Section */}
            <div>
              <h3 className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" /> Orchestrated Workspace Links
              </h3>
              <div className="space-y-3">
                {workspace.resources?.map((res, index) => (
                  <motion.a
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + (0.07 * index) }}
                    whileHover={{ scale: 1.015, x: 4, borderColor: "rgba(99,102,241,0.5)" }}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.12)] transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {res.type}
                        </span>
                        <h4 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                          {res.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">{res.snippet}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-3 mt-1 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}