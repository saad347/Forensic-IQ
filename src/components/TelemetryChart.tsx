import { useState } from 'react';
import { SensorEvidence } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity, Radio, ChevronRight } from 'lucide-react';

interface TelemetryChartProps {
  data: SensorEvidence;
}

export default function TelemetryChart({ data }: TelemetryChartProps) {
  const [showThreshold, setShowThreshold] = useState(true);

  // Calculate some basic stats from dataPoints
  const values = data.dataPoints.map(dp => dp.value);
  const maxVal = Math.max(...values);
  const avgVal = parseFloat((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2));

  // Determine standard safe threshold line depending on chart context
  let thresholdValue = avgVal * 1.5;
  if (data.chartTitle.includes('Temperature')) {
    thresholdValue = 540; // Turbine Stage 2 max
  } else if (data.chartTitle.includes('Chloride')) {
    thresholdValue = 50; // Welded pipe maximum safe chloride
  } else if (data.chartTitle.includes('Pressure')) {
    thresholdValue = 1800; // Superheater maximum safe pressure
  } else if (data.chartTitle.includes('Contaminants')) {
    thresholdValue = 15; // Gearbox maximum safe silica
  } else if (data.chartTitle.includes('Vibration')) {
    thresholdValue = 4.5; // Shaft maximum safe vibration velocity
  }

  return (
    <div className="border border-[#121212] bg-[#FFFFFF] p-5 shadow-none" id="telemetry-chart">
      {/* Header block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-3 border-b border-[#121212] gap-2">
        <div className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-red-600 animate-pulse" />
          <span className="font-serif italic text-base text-[#121212]">
            Operational Telemetry Analyzer
          </span>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1.5 cursor-pointer text-[#121212]/80 font-mono text-[10px] font-bold uppercase tracking-wider">
            <input
              type="checkbox"
              checked={showThreshold}
              onChange={() => setShowThreshold(!showThreshold)}
              className="border-[#121212] text-[#121212] focus:ring-[#121212] h-3.5 w-3.5"
              id="threshold-toggle"
            />
            <span>Critical Threshold</span>
          </label>
          <div className="flex items-center space-x-1 text-[#121212]/40 font-mono text-[9px] font-bold tracking-wider">
            <Radio className="h-3.5 w-3.5 text-red-600" />
            <span>STREAM LOG</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* The Live Chart */}
        <div className="lg:col-span-3 bg-white p-3 border border-[#121212]/20 min-h-[260px]">
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.dataPoints}
                margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#121212" strokeOpacity={0.1} />
                <XAxis 
                  dataKey="time" 
                  stroke="#121212" 
                  fontSize={9}
                  tickLine={true} 
                />
                <YAxis 
                  stroke="#121212" 
                  fontSize={9} 
                  tickLine={true}
                  label={{ value: `${data.yAxisLabel} (${data.unit})`, angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '9px', fill: '#121212', fontFamily: 'monospace' } }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: 'none', color: '#F9F7F2', fontSize: '11px', borderRadius: '0px' }}
                  labelStyle={{ fontWeight: 'bold', color: '#ef4444' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  name={data.chartTitle}
                  stroke="#121212" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  dot={{ r: 3, stroke: '#121212', strokeWidth: 1, fill: '#ef4444' }}
                />
                {/* Secondary line if any (like process temperature in nitrogen bolt case) */}
                {data.dataPoints[0] && ('Line Temp' in data.dataPoints[0]) && (
                  <Line 
                    type="monotone" 
                    dataKey="Line Temp" 
                    name="Pipeline Process Temp"
                    stroke="#b91c1c" 
                    strokeWidth={1.5} 
                    dot={{ r: 2 }}
                  />
                )}
                {data.dataPoints[0] && ('Iron' in data.dataPoints[0]) && (
                  <Line 
                    type="monotone" 
                    dataKey="Iron" 
                    name="Iron Particle Concentration (PPM)"
                    stroke="#dc2626" 
                    strokeWidth={1.5} 
                    dot={{ r: 2 }}
                  />
                )}
                {showThreshold && (
                  <ReferenceLine 
                    y={thresholdValue} 
                    stroke="#dc2626" 
                    strokeDasharray="4 4" 
                    label={{ value: 'CRITICAL LIMIT', fill: '#dc2626', fontSize: 8, position: 'insideBottomRight', fontWeight: 'bold' }} 
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick telemetry statistics card */}
        <div className="flex flex-col justify-between p-4 bg-[#F1EFE9] border border-[#121212]/20">
          <div className="space-y-4">
            <span className="text-[9px] font-mono font-bold text-[#121212]/50 uppercase tracking-widest block">
              Signal Calculations
            </span>
            
            {/* Max value */}
            <div className="flex justify-between items-center py-2 border-b border-[#121212]/15">
              <span className="text-xs text-[#121212]/70 font-serif italic">Maximum Peak</span>
              <span className="font-mono text-xs font-bold text-red-600">
                {maxVal} {data.unit}
              </span>
            </div>

            {/* Average value */}
            <div className="flex justify-between items-center py-2 border-b border-[#121212]/15">
              <span className="text-xs text-[#121212]/70 font-serif italic">Operating Average</span>
              <span className="font-mono text-xs font-bold text-[#121212]">
                {avgVal} {data.unit}
              </span>
            </div>

            {/* Threshold check */}
            <div className="flex justify-between items-center py-2">
              <span className="text-xs text-[#121212]/70 font-serif italic">Compliance</span>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border uppercase ${
                maxVal > thresholdValue 
                  ? 'bg-red-50 text-red-800 border-red-300' 
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300'
              }`}>
                {maxVal > thresholdValue ? 'EXCEEDED' : 'COMPLIANT'}
              </span>
            </div>
          </div>

          <div className="mt-4 bg-[#FFFFFF] p-3 border border-[#121212]/15 text-xs text-[#121212]/80 space-y-1.5 shadow-none">
            <div className="font-mono font-bold text-[9px] text-[#121212]/70 uppercase tracking-wider flex items-center gap-1">
              <ChevronRight className="h-3 w-3 text-red-600" />
              <span>Diagnostic Analysis</span>
            </div>
            <p className="text-[10px] leading-relaxed text-[#121212]/70 font-serif italic">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
