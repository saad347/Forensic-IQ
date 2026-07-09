import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, GraduationCap, Download, CheckCircle, Award, Settings, ShieldAlert, BarChart3 } from 'lucide-react';

interface StudentRecord {
  id: string;
  name: string;
  casesCompleted: number;
  avgScore: number;
  pointsSpent: number;
  status: 'Complete' | 'In Progress' | 'Not Started';
}

export default function InstructorPanel() {
  const [rigorousMode, setRigorousMode] = useState(false);
  const [selectedCase, setSelectedCase] = useState('all');

  // Hardcoded roster of students representing class analytics for Dr. Farah
  const [students, setStudents] = useState<StudentRecord[]>([
    { id: 'st1', name: 'Ayesha Bashir', casesCompleted: 3, avgScore: 92, pointsSpent: 35, status: 'Complete' },
    { id: 'st2', name: 'Saad Hassan', casesCompleted: 3, avgScore: 88, pointsSpent: 40, status: 'Complete' },
    { id: 'st3', name: 'Fatima Malik', casesCompleted: 2, avgScore: 82, pointsSpent: 50, status: 'In Progress' },
    { id: 'st4', name: 'Ali Noman', casesCompleted: 1, avgScore: 70, pointsSpent: 55, status: 'In Progress' },
    { id: 'st5', name: 'Zainab Qureshi', casesCompleted: 3, avgScore: 96, pointsSpent: 30, status: 'Complete' },
    { id: 'st6', name: 'Omar Farooq', casesCompleted: 0, avgScore: 0, pointsSpent: 0, status: 'Not Started' }
  ]);

  // Chart data representing distribution of grades in Dr. Farah's ME-402 Lab section
  const gradeDistributionData = [
    { grade: 'A (90-100)', students: 3 },
    { grade: 'B (80-89)', students: 1 },
    { grade: 'C (70-79)', students: 1 },
    { grade: 'D (50-69)', students: 0 },
    { grade: 'F (<50)', students: 1 }
  ];

  // CSV Grade export simulation
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Student Name,Completed Cases,Average Score,Points Spent,Status\n';
    students.forEach((s) => {
      csvContent += `"${s.name}",${s.casesCompleted},${s.avgScore},${s.pointsSpent},"${s.status}"\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ME-402_Failure_Forensics_Grades.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in" id="instructor-dashboard-view">
      
      {/* Demo Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700">
              Demo data — connect a class roster to see real students
            </p>
          </div>
        </div>
      </div>

      {/* Roster & Analytics Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-[#121212] gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-[#121212]/60 block mb-1">
            UET FACULTY RECORDS
          </span>
          <h2 className="font-serif italic text-3xl lg:text-4xl text-[#121212] tracking-tight flex items-center space-x-2.5 font-normal">
            <GraduationCap className="h-7 w-7 text-red-600" />
            <span>Dr. Farah's Instructor Console</span>
          </h2>
          <p className="text-xs text-[#121212]/70 mt-1.5 font-mono uppercase tracking-wider">
            Section: ME-402 Failure Analysis & Prevention Lab • University of Engineering & Technology (UET)
          </p>
        </div>

        {/* Global Class Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-5 py-3 bg-[#121212] hover:bg-[#121212]/90 text-white text-xs font-bold uppercase tracking-[0.25em] flex items-center space-x-1.5 border border-[#121212] transition-all cursor-pointer"
            id="export-grades-btn"
          >
            <Download className="h-4 w-4 text-[#F9F7F2]" />
            <span>Export Gradebook CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5" id="instructor-stats-cards">
        <div className="bg-[#FFFFFF] border border-[#121212] p-5 flex items-center space-x-4">
          <div className="p-3 bg-[#F1EFE9] text-[#121212] border border-[#121212]/20">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#121212]/50 block uppercase tracking-wider font-bold">Class Roster</span>
            <span className="text-lg font-serif italic font-bold text-[#121212]">6 Active Students</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#121212] p-5 flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#121212]/50 block uppercase tracking-wider font-bold">Lab Completion Rate</span>
            <span className="text-lg font-serif italic font-bold text-[#121212]">83.3% Complete</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#121212] p-5 flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-800 border border-red-300">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#121212]/50 block uppercase tracking-wider font-bold">Class Average Score</span>
            <span className="text-lg font-serif italic font-bold text-[#121212]">85.6 / 100</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] border border-[#121212] p-5 flex items-center space-x-4">
          <div className={`p-3 border transition-all ${rigorousMode ? 'bg-red-600 text-white border-red-700' : 'bg-[#F1EFE9] text-[#121212] border-[#121212]/20'}`}>
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono text-[#121212]/50 block uppercase tracking-wider font-bold">Strict Grading Protocol</span>
            <span className="text-lg font-serif italic font-bold text-[#121212]">
              {rigorousMode ? 'RIGOROUS ACTIVE' : 'STANDARD'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 columns: Student Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#121212]/15">
            <h3 className="font-serif italic text-xl text-[#121212]">
              Student Lab Submissions
            </h3>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="text-xs border border-[#121212] bg-[#FFFFFF] px-3 py-1.5 text-[#121212] font-mono uppercase font-bold"
              id="instructor-case-filter"
            >
              <option value="all">All Assignments</option>
              <option value="shaft">Bending Fatigue Shaft</option>
              <option value="bolt">Cryo Bolt Fracture</option>
              <option value="turbine">Supercritical Steam Blade</option>
            </select>
          </div>

          <div className="border border-[#121212] overflow-hidden bg-[#FFFFFF]">
            <table className="w-full divide-y divide-[#121212] text-xs">
              <thead className="bg-[#F1EFE9]">
                <tr className="text-left font-mono text-[9px] text-[#121212]/70 uppercase font-bold tracking-wider">
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5 text-center">Cases Completed</th>
                  <th className="px-4 py-3.5 text-center">Avg Lab Score</th>
                  <th className="px-4 py-3.5 text-center">Avg Points Spent</th>
                  <th className="px-4 py-3.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#121212]/15 bg-white">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-[#F1EFE9]/25 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-[#121212]">{student.name}</td>
                    <td className="px-4 py-3.5 text-center font-mono text-[#121212]/80">{student.casesCompleted}</td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-red-600">
                      {student.avgScore > 0 ? `${student.avgScore}%` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono text-[#121212]/60">
                      {student.pointsSpent > 0 ? `${student.pointsSpent} pts` : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`px-2 py-0.5 border font-mono font-bold text-[9px] uppercase ${
                        student.status === 'Complete'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-600'
                          : student.status === 'In Progress'
                            ? 'bg-amber-50 text-amber-800 border-amber-600'
                            : 'bg-[#F1EFE9]/50 text-[#121212]/40 border-dashed border-[#121212]/20'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Charts & Settings */}
        <div className="space-y-8">
          {/* Chart representing score bounds */}
          <div className="border border-[#121212] bg-[#FFFFFF] p-5 space-y-4">
            <h4 className="font-serif italic text-lg text-[#121212] flex items-center gap-1.5 pb-2 border-b border-[#121212]/10">
              <BarChart3 className="h-4 w-4 text-red-600" />
              <span>Section Score Distribution</span>
            </h4>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e2db" />
                  <XAxis dataKey="grade" stroke="#121212" fontSize={8} tickLine={false} />
                  <YAxis stroke="#121212" fontSize={8} allowDecimals={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#121212', border: 'none', color: '#fff', fontSize: '10px', fontFamily: 'monospace' }} />
                  <Bar dataKey="students" fill="#DC2626" shape={(props: any) => {
                    const { x, y, width, height } = props;
                    return <rect x={x} y={y} width={width} height={height} fill="#121212" stroke="#DC2626" strokeWidth={1} />;
                  }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Instructor Controls & Strict Grading */}
          <div className="border border-[#121212] bg-[#F1EFE9] p-6 space-y-4">
            <h4 className="font-serif italic text-lg text-[#121212] flex items-center gap-1.5 pb-2 border-b border-[#121212]/15">
              <ShieldAlert className="h-4 w-4 text-red-600" />
              <span>Lab Control Center</span>
            </h4>
            <p className="text-xs text-[#121212]/80 leading-relaxed font-sans">
              Configure parameters for current active student profiles. Modifications affect all assignments loaded during student sessions.
            </p>

            <div className="space-y-4 pt-3 border-t border-[#121212]/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#121212] block font-mono uppercase tracking-wider">Rigorous Lab Mode</span>
                  <p className="text-[10px] text-[#121212]/60 mt-1 leading-normal">Increase case ambiguity rating and double red-herring point penalties.</p>
                </div>
                <button
                  onClick={() => setRigorousMode(!rigorousMode)}
                  className={`w-12 h-6 border-2 border-[#121212] p-0.5 transition-colors cursor-pointer ${
                    rigorousMode ? 'bg-red-600' : 'bg-[#FFFFFF]'
                  }`}
                  id="rigorous-mode-toggle"
                >
                  <div
                    className={`w-4 h-4 border border-[#121212] transform transition-transform bg-[#121212] ${
                      rigorousMode ? 'translate-x-5 bg-white' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
