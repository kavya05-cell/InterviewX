import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../Header';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, ChevronRight, AlertTriangle, Lightbulb } from 'lucide-react';

export default function EvaluationReport() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ FIX: define first
  const reportData = location.state?.reportData || {};

  const score = reportData.overall || 0;

  const clarity = reportData.clarity || 0;
  const depth = reportData.depth || 0;
  const correctness = reportData.correctness || 0;
  const confidence = reportData.confidence || 0;

  const strengths = reportData.strengths || [];
  const weaknesses = reportData.weaknesses || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8 pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-4 border-b border-glass">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Performance Report</h1>
            <p className="text-gray-400">
              Repository: <span className="text-primary font-medium">
                {reportData.repo || "N/A"}
              </span>
            </p>
          </div>

          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Score Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Overall Score */}
          <Card className="flex flex-col items-center justify-center py-10 md:col-span-1">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-glass" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - score / 100)}`}
                  className="text-primary"
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{score}</span>
                <span className="text-sm text-gray-400">/100</span>
              </div>
            </div>

            <h3 className="mt-6 text-xl font-bold">Interview Summary</h3>
            <p className="text-sm text-gray-400 mt-2 px-6 text-center">
              {reportData.feedback || "No feedback available"}
            </p>
          </Card>

          {/* Metrics */}
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <MetricCard title="Technical Depth" score={depth} color="text-yellow-400" bg="bg-yellow-400" />
            <MetricCard title="Clarity" score={clarity} color="text-green-400" bg="bg-green-400" />
            <MetricCard title="Correctness" score={correctness} color="text-primary" bg="bg-primary" />
            <MetricCard title="Confidence" score={confidence} color="text-blue-400" bg="bg-blue-400" />
          </div>

        </div>

        {/* Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Weak Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={20} /> Weak Areas
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {weaknesses.length === 0 ? (
                <p className="text-gray-400 text-sm">No major weaknesses detected</p>
              ) : (
                weaknesses.map((w, i) => (
                  <FeedbackItem key={i} title={w} details="" />
                ))
              )}
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <Lightbulb size={20} /> Key Strengths
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {strengths.length === 0 ? (
                <p className="text-gray-400 text-sm">No strengths recorded</p>
              ) : (
                strengths.map((s, i) => (
                  <FeedbackItem
                    key={i}
                    icon={<CheckCircle2 className="w-5 h-5 text-green-400" />}
                    title={s}
                    details=""
                  />
                ))
              )}
            </CardContent>
          </Card>

        </div>

      </main>
    </div>
  );
}

function MetricCard({ title, score, color, bg }) {
  return (
    <Card className="p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <span className="font-semibold text-gray-300">{title}</span>
        <span className={`font-bold text-2xl ${color}`}>{score}</span>
      </div>

      <div className="w-full bg-background rounded-full h-2.5 outline outline-1 outline-glass">
        <div
          className={`h-2.5 rounded-full ${bg}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </Card>
  );
}

function FeedbackItem({ title, details, icon }) {
  return (
    <div className="flex gap-3 items-start">
      {icon || <ChevronRight className="w-5 h-5 text-gray-500 mt-0.5" />}
      <div>
        <h4 className="font-bold text-white text-sm">{title}</h4>
        {details && <p className="text-gray-400 text-sm mt-1">{details}</p>}
      </div>
    </div>
  );
}