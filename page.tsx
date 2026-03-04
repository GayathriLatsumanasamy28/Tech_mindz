"use client";
import { useState, useRef } from 'react';
import { 
  CheckCircle2, Circle, Download, Target, Briefcase, 
  PlayCircle, FileText, MessageSquare, AlertCircle, ChevronRight, Loader2, UploadCloud
} from 'lucide-react';

export default function KaiPlatform() {
  const [currentView, setCurrentView] = useState('form');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // 1. INPUT FORM DATA
  const [profile, setProfile] = useState({
    year: 2027,
    branch: 'Computer Science',
    role: 'Software Engineer',
    skills: 'Java, AI, Microsoft Azure',
    hours: 15
  });

  // 2. DYNAMIC STATE (These start empty and get filled by the AI)
  const [tasks, setTasks] = useState<any[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState({ company: 'Loading...', project: 'Loading...' });

  // 3. THE MAGIC: Calling your new AI Backend
  const generateDynamicContent = async () => {
    setIsGenerating(true);
    
    try {
      // This talks to the app/api/roadmap/route.ts file you just made
      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      
      const data = await response.json();

      // Put the AI's data into our frontend state
      setTasks(data.tasks.map((t: any) => ({ ...t, done: false })));
      setQuestions(data.questions);
      setRecommendation(data.recommendation);
      
      // Move to the dashboard
      setCurrentView('dashboard');
    } catch (error) {
      alert("Failed to connect to Kai's AI engine. Is your Gemini API key in .env.local?");
    } finally {
      setIsGenerating(false);
    }
  };

  // CHECKLIST LOGIC
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };
  const completedTasks = tasks.filter(t => t.done).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // MOCK INTERVIEW LOGIC
  const [interviewStep, setInterviewStep] = useState(0);
  const [interviewAnswer, setInterviewAnswer] = useState('');
  const [interviewScore, setInterviewScore] = useState(0);

  const handleInterviewSubmit = () => {
    if (interviewStep < questions.length - 1) {
      setInterviewStep(interviewStep + 1);
      setInterviewAnswer('');
    } else {
      setInterviewScore(Math.floor(Math.random() * (95 - 75 + 1)) + 75); // Random score
      setCurrentView('dashboard');
    }
  };

  // ATS STATE
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = (e: any) => {
    if (e.target.files[0]) {
      setIsScanning(true);
      setTimeout(() => {
        setAtsScore(58); // Simulating a <60 score for demo purposes
        setIsScanning(false);
      }, 2000);
    }
  };

  // DOWNLOAD PDF
const downloadCard = async () => {
    // 1. Explicitly get the element
    const element = document.getElementById('readiness-card');
    
    // 2. Add a NULL CHECK (This fixes the Vercel Build Error)
    if (!element) {
      alert("Card element not found");
      return;
    }

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const options = {
        margin: 0.5,
        filename: `Kai_Readiness_${profile.role}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      // 3. Now we are certain 'element' is not null
      html2pdf().set(options).from(element).save();
    } catch (err) {
      console.error("PDF Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">K</div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Kai</h1>
        </div>
        {currentView !== 'form' && (
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Class of {profile.year} • {profile.role} Track
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        
        {/* ================= VIEW 1: THE SMART INPUT FORM ================= */}
        {currentView === 'form' && (
          <div className="max-w-2xl mx-auto bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-800 mb-2">Build Your Kai Roadmap</h2>
              <p className="text-slate-500">Stop guessing. Get your personalized, day-by-day placement strategy.</p>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Graduation Year</label>
                  <input type="number" value={profile.year} onChange={e => setProfile({...profile, year: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Branch</label>
                  <input type="text" value={profile.branch} onChange={e => setProfile({...profile, branch: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Target Role</label>
                <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Data Analyst, UX Designer" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Current Skills (Comma Separated)</label>
                <input type="text" value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Python, Figma, React" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Hours available per week</label>
                <input type="number" value={profile.hours} onChange={e => setProfile({...profile, hours: Number(e.target.value)})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              {/* THIS BUTTON NOW CALLS THE AI */}
              <button 
                onClick={generateDynamicContent} 
                disabled={isGenerating}
                className="w-full mt-4 bg-blue-600 text-white font-black text-lg py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isGenerating ? <><Loader2 className="w-5 h-5 animate-spin"/> Generating AI Roadmap...</> : <>Generate My Roadmap <ChevronRight className="w-5 h-5"/></>}
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: THE DASHBOARD ================= */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: 7-Day Plan & ATS */}
            <div className="lg:col-span-8 space-y-8">
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Your 7-Day Action Plan</h2>
                    <p className="text-slate-500">Tailored for {profile.role} • {profile.hours} hrs/week</p>
                  </div>
                  
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="text-blue-500 transition-all duration-1000 ease-out" strokeDasharray={`${progressPercent}, 100`} strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute text-lg font-bold text-slate-700">{progressPercent}%</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {tasks.map((task: any) => (
                    <div key={task.id} className={`flex flex-col p-4 rounded-xl border-2 transition-all ${task.done ? 'bg-slate-50 border-slate-100' : 'bg-white border-blue-50 hover:border-blue-200'}`}>
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => toggleTask(task.id)}>
                          {task.done ? <CheckCircle2 className="w-7 h-7 text-green-500" /> : <Circle className="w-7 h-7 text-slate-300" />}
                          <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{task.day}</span>
                            <p className={`font-semibold text-lg ${task.done ? "line-through text-slate-400" : "text-slate-800"}`}>{task.text}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {task.link && <a href={task.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-200"><FileText className="w-4 h-4"/> Docs</a>}
                          {task.yt && <a href={task.yt} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100"><PlayCircle className="w-4 h-4"/> Watch</a>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ATS Checker UI */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-black text-slate-800 mb-4">ATS Resume Checker</h2>
                {!atsScore && !isScanning ? (
                  <label className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 block cursor-pointer hover:bg-slate-100 transition-colors">
                    <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2"/>
                    <p className="text-slate-600 font-medium mb-2">Click to Upload Resume PDF</p>
                  </label>
                ) : isScanning ? (
                   <div className="border-2 border-slate-200 rounded-xl p-8 text-center bg-slate-50 flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                      <p className="font-bold text-slate-700">Scanning Resume...</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                      <div className="text-4xl font-black text-orange-600">{atsScore}%</div>
                      <div>
                        <h3 className="font-bold text-orange-800">Needs Improvement</h3>
                        <p className="text-sm text-orange-600">Your score is below 60%. Recruiters likely won't see your resume.</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <h4 className="font-bold mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-red-500"/> Kai Formatting Tips</h4>
                      <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">
                        <li>Include exactly these keywords from your profile: "{profile.skills}".</li>
                        <li>Add your expected graduation year ({profile.year}) clearly at the top.</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: AI Recommendations & Readiness Card */}
            <div className="lg:col-span-4 space-y-8">
              
              <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-black text-indigo-900 mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5"/> Kai Smart Matches</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-xs font-bold text-indigo-500 uppercase">Target Company</span>
                    {/* THIS IS LOADED BY AI */}
                    <h4 className="font-bold text-slate-800 mt-1">{recommendation.company}</h4>
                    <p className="text-sm text-slate-600 mt-1">Strong match based on your {profile.role} interest.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <span className="text-xs font-bold text-green-500 uppercase">Project Recommendation</span>
                    {/* THIS IS LOADED BY AI */}
                    <h4 className="font-bold text-slate-800 mt-1">{recommendation.project}</h4>
                  </div>
                </div>
              </div>

              <button onClick={() => setCurrentView('interview')} className="w-full bg-slate-800 text-white p-6 rounded-2xl shadow-lg hover:bg-slate-900 transition flex items-center justify-between group">
                <div className="text-left">
                  <h3 className="font-black text-lg">Take Mock Interview</h3>
                  <p className="text-slate-300 text-sm mt-1">Practice role-based questions</p>
                </div>
                <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform"/>
              </button>

              <div>
                <div id="readiness-card" className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden mb-4">
                  <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                  <h4 className="text-slate-400 font-semibold tracking-widest text-xs uppercase mb-1">Kai Readiness Card</h4>
                  <h2 className="text-2xl font-black mb-6">{profile.role} Track</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-slate-400 text-sm">Action Score</p>
                      <p className="text-4xl font-black text-green-400">{progressPercent}<span className="text-lg text-slate-500">/100</span></p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Interview Score</p>
                      <p className={`text-3xl font-black ${interviewScore > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                        {interviewScore > 0 ? `${interviewScore}/100` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-slate-700 pt-4 text-sm font-mono text-slate-300 break-words">
                    Skills: {profile.skills}
                  </div>
                </div>
                <button onClick={downloadCard} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-md flex justify-center items-center gap-2 transition-colors">
                  <Download className="w-5 h-5"/> Share Card to WhatsApp
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= VIEW 3: MOCK INTERVIEW ================= */}
        {currentView === 'interview' && (
          <div className="max-w-3xl mx-auto mt-10">
            <button onClick={() => setCurrentView('dashboard')} className="text-slate-500 font-semibold mb-6 hover:text-slate-800">← Back to Dashboard</button>
            <div className="bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
              <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h2 className="text-2xl font-black">Kai Mock Interview</h2>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                  Question {interviewStep + 1} of {questions.length}
                </span>
              </div>
              
              {/* THIS QUESTION IS LOADED BY AI */}
              <h3 className="text-xl font-semibold text-slate-800 mb-6 leading-relaxed">
                {questions[interviewStep]}
              </h3>
              
              <textarea 
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Type your answer here..."
                value={interviewAnswer}
                onChange={(e) => setInterviewAnswer(e.target.value)}
              />
              
              <button 
                onClick={handleInterviewSubmit} 
                disabled={!interviewAnswer.trim()}
                className="w-full bg-slate-800 text-white py-4 rounded-xl font-bold text-lg hover:bg-slate-900 disabled:opacity-50 transition-all"
              >
                {interviewStep < questions.length - 1 ? 'Submit Answer & Next Question' : 'Finish & Evaluate Score'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
