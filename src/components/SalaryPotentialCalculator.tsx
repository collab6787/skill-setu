import React, { useState, useMemo } from 'react';
import { SkillTrend } from '../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Sparkles,
  Layers,
  ArrowUpRight,
  Check,
  Plus,
  RotateCcw,
  Info,
  Briefcase,
  Award,
  Zap
} from 'lucide-react';

interface SalaryPotentialCalculatorProps {
  skillTrends: SkillTrend[];
  onSelectForJobSimulator?: (skillName: string) => void;
  initialSelectedSkillNames?: string[];
}

interface PresetStack {
  id: string;
  name: string;
  badge: string;
  skillNames: string[];
  description: string;
}

export const SalaryPotentialCalculator: React.FC<SalaryPotentialCalculatorProps> = ({
  skillTrends,
  onSelectForJobSimulator,
  initialSelectedSkillNames = ['Python', 'FastAPI', 'Docker']
}) => {
  // Preset industry-aligned skill combinations
  const presets: PresetStack[] = [
    {
      id: 'genai-stack',
      name: 'GenAI & Agent Architect',
      badge: 'High Scarcity',
      skillNames: ['Python', 'LLM & Generative AI Engineering', 'FastAPI'],
      description: 'Autonomous RAG pipelines, fine-tuned agent orchestration, and async APIs.'
    },
    {
      id: 'mlops-stack',
      name: 'MLOps & Cloud Specialist',
      badge: 'Enterprise Demand',
      skillNames: ['Python', 'Machine Learning', 'Docker', 'Kubernetes'],
      description: 'Scalable model deployment, container orchestration, and inference clusters.'
    },
    {
      id: 'fullstack-modern',
      name: 'Modern Full-Stack Tech',
      badge: 'Broadest Openings',
      skillNames: ['React.js', 'FastAPI', 'PostgreSQL / SQL', 'Docker'],
      description: 'End-to-end component engineering, RESTful microservices, and containerized DBs.'
    },
    {
      id: 'data-ai',
      name: 'Applied Data & Analytics',
      badge: 'High Momentum',
      skillNames: ['Python', 'Pandas & NumPy', 'Machine Learning', 'PostgreSQL / SQL'],
      description: 'Tabular data munging, statistical modeling, and relational data warehousing.'
    }
  ];

  // Selected skills state
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(() => {
    const initialIds = skillTrends
      .filter(st => initialSelectedSkillNames.includes(st.skillName))
      .map(st => st.skillId);
    return initialIds.length > 0 ? initialIds : [skillTrends[0]?.skillId || 'sk-python'];
  });

  // Chart view mode: 'comparison' (Baseline vs Individual vs Combo) or 'roles' (Top target roles unlocked)
  const [chartViewMode, setChartViewMode] = useState<'comparison' | 'roles'>('comparison');

  // Selected skill objects
  const selectedSkills = useMemo(() => {
    return skillTrends.filter(st => selectedSkillIds.includes(st.skillId));
  }, [skillTrends, selectedSkillIds]);

  // Toggle a skill in selection
  const toggleSkill = (skillId: string) => {
    setSelectedSkillIds(prev => {
      if (prev.includes(skillId)) {
        // Keep at least one skill selected for meaningful calculations
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== skillId);
      } else {
        return [...prev, skillId];
      }
    });
  };

  // Apply a preset combination
  const applyPreset = (preset: PresetStack) => {
    const matchedIds = skillTrends
      .filter(st => preset.skillNames.includes(st.skillName))
      .map(st => st.skillId);
    if (matchedIds.length > 0) {
      setSelectedSkillIds(matchedIds);
    }
  };

  // Reset to default
  const handleReset = () => {
    const defaultIds = skillTrends
      .filter(st => ['Python', 'FastAPI', 'Docker'].includes(st.skillName))
      .map(st => st.skillId);
    setSelectedSkillIds(defaultIds.length > 0 ? defaultIds : [skillTrends[0]?.skillId || 'sk-python']);
  };

  // --- Historical Trend Salary Modeling Engine ---
  const calculationResults = useMemo(() => {
    // 1. National IT Campus Base Anchor (in ₹ Lakhs Per Annum)
    const BASE_ENTRY_AVG = 4.8;
    const BASE_EXP_AVG = 12.5;

    if (selectedSkills.length === 0) {
      return {
        entryAvg: BASE_ENTRY_AVG,
        entryMin: 4.2,
        entryMax: 5.5,
        expAvg: BASE_EXP_AVG,
        expMin: 10.5,
        expMax: 14.5,
        growthPercentage: Math.round(((BASE_EXP_AVG - BASE_ENTRY_AVG) / BASE_ENTRY_AVG) * 100),
        avgAnnualGrowthRate: 8.0,
        synergyMultiplier: 1.0,
        categoryCount: 1,
        unlockedRoles: ['Junior Software Engineer', 'QA / Support Specialist']
      };
    }

    // 2. Average Historical Growth Rate from time series
    const avgGrowthRate =
      selectedSkills.reduce((acc, s) => acc + s.growthRate, 0) / selectedSkills.length;

    // 3. Average Predicted Demand Score (0-100)
    const avgPredictedDemand =
      selectedSkills.reduce((acc, s) => acc + (s.predictedNextDemand || 70), 0) /
      selectedSkills.length;

    // 4. Historical Trajectory Delta (change between earliest historical year and 2027)
    const avgTrajectoryDelta =
      selectedSkills.reduce((acc, s) => {
        const first = s.historicalData[0]?.demandScore || 50;
        const last = s.predictedNextDemand || s.historicalData[s.historicalData.length - 1]?.demandScore || 70;
        return acc + (last - first);
      }, 0) / selectedSkills.length;

    // 5. Cross-domain Category Synergy Bonus
    // When a student combines skills across multiple domains (e.g. AI + DevOps + Backend),
    // enterprise teams pay a compounding premium for end-to-end technical independence.
    const distinctCategories = Array.from(new Set(selectedSkills.map(s => s.category)));
    const categoryCount = distinctCategories.length;
    let synergyMultiplier = 1.0;
    if (categoryCount === 2) synergyMultiplier = 1.16; // +16% cross-domain synergy
    else if (categoryCount >= 3) synergyMultiplier = 1.28; // +28% polyglot architect premium

    // Skill count depth bonus (up to 4 skills)
    const stackDepthBonus = 1 + Math.min(selectedSkills.length - 1, 3) * 0.04;

    // 6. Compute Entry-Level Pay Scale (0 - 2 Yrs Experience)
    // Scaled by market demand score and positive growth momentum
    const demandIndexFactor = (avgPredictedDemand / 65); // 1.0 at 65 demand score, up to 1.52 for 99 score
    const growthMomentumFactor = 1 + (avgGrowthRate / 100) * 0.7; // scaled impact of annual growth
    const entryMultiplier = Math.max(0.75, demandIndexFactor * growthMomentumFactor * synergyMultiplier * stackDepthBonus);

    const calculatedEntryAvg = Number((BASE_ENTRY_AVG * entryMultiplier).toFixed(1));
    const calculatedEntryMin = Number((calculatedEntryAvg * 0.86).toFixed(1));
    const calculatedEntryMax = Number((calculatedEntryAvg * 1.18).toFixed(1));

    // 7. Compute Experienced Pay Scale (4 - 7 Yrs Experience)
    // Compounded by sustained industry adoption, leadership value of booming technologies
    const expGrowthMultiplier = Math.max(
      0.7,
      (avgPredictedDemand / 60) * Math.pow(1 + Math.max(-0.2, avgGrowthRate / 100), 1.2) * (synergyMultiplier * 1.1) * stackDepthBonus
    );

    const calculatedExpAvg = Number((BASE_EXP_AVG * expGrowthMultiplier).toFixed(1));
    const calculatedExpMin = Number((calculatedExpAvg * 0.88).toFixed(1));
    const calculatedExpMax = Number((calculatedExpAvg * 1.22).toFixed(1));

    // 8. Overall Salary Growth Trajectory (%)
    const growthPercentage = Math.round(((calculatedExpAvg - calculatedEntryAvg) / calculatedEntryAvg) * 100);

    // 9. Collect Unlocked Top Target Roles
    const roleCounts: Record<string, number> = {};
    selectedSkills.forEach(s => {
      s.topRoles?.forEach(role => {
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
    });
    const sortedRoles = Object.keys(roleCounts).sort((a, b) => roleCounts[b] - roleCounts[a]);
    const unlockedRoles = sortedRoles.slice(0, 4);

    return {
      entryAvg: calculatedEntryAvg,
      entryMin: calculatedEntryMin,
      entryMax: calculatedEntryMax,
      expAvg: calculatedExpAvg,
      expMin: calculatedExpMin,
      expMax: calculatedExpMax,
      growthPercentage,
      avgAnnualGrowthRate: Number(avgGrowthRate.toFixed(1)),
      synergyMultiplier: Number(synergyMultiplier.toFixed(2)),
      categoryCount,
      unlockedRoles: unlockedRoles.length > 0 ? unlockedRoles : ['Full Stack Software Engineer', 'Cloud AI Developer']
    };
  }, [selectedSkills]);

  // --- Generate Bar Chart Dataset ---
  const chartData = useMemo(() => {
    if (chartViewMode === 'comparison') {
      // Comparison View: Baseline vs Individual Top Skills vs Selected Combination
      const data: Array<{
        name: string;
        fullName: string;
        entryPay: number;
        expPay: number;
        isCombo?: boolean;
        isBaseline?: boolean;
      }> = [
        {
          name: 'Baseline',
          fullName: 'Traditional IT Graduate',
          entryPay: 4.8,
          expPay: 12.5,
          isBaseline: true
        }
      ];

      // Add single skill baselines for up to 3 selected skills
      selectedSkills.slice(0, 3).forEach(skill => {
        const demandFactor = (skill.predictedNextDemand || 70) / 65;
        const growthFactor = 1 + (skill.growthRate / 100) * 0.6;
        const singleEntry = Number((4.8 * Math.max(0.7, demandFactor * growthFactor)).toFixed(1));
        const singleExp = Number((12.5 * Math.max(0.7, (skill.predictedNextDemand / 60) * (1 + skill.growthRate / 100))).toFixed(1));

        data.push({
          name: skill.skillName.length > 12 ? `${skill.skillName.slice(0, 10)}...` : skill.skillName,
          fullName: `${skill.skillName} (Single Skill)`,
          entryPay: singleEntry,
          expPay: singleExp
        });
      });

      // Add the combined skill stack (with synergy and compounding)
      data.push({
        name: `Combo (${selectedSkills.length})`,
        fullName: `Your Selected Stack (${selectedSkills.map(s => s.skillName).join(' + ')})`,
        entryPay: calculationResults.entryAvg,
        expPay: calculationResults.expAvg,
        isCombo: true
      });

      return data;
    } else {
      // Roles View: Pay scale distribution across top unlocked enterprise roles
      return calculationResults.unlockedRoles.map((role, idx) => {
        // Staggered role salary tiers
        const roleMultiplier = 1 + (idx === 0 ? 0.12 : idx === 1 ? 0.05 : -0.05 * idx);
        const roleEntry = Number((calculationResults.entryAvg * roleMultiplier).toFixed(1));
        const roleExp = Number((calculationResults.expAvg * roleMultiplier).toFixed(1));

        return {
          name: role.length > 14 ? `${role.slice(0, 13)}...` : role,
          fullName: role,
          entryPay: roleEntry,
          expPay: roleExp,
          isCombo: true
        };
      });
    }
  }, [chartViewMode, selectedSkills, calculationResults]);

  // Primary top role to suggest for job simulation
  const primaryRole = calculationResults.unlockedRoles[0] || 'AI/ML Engineer';

  return (
    <div
      id="salary-potential-calculator"
      className="crextio-card p-6 border-slate-200/90 shadow-sm relative overflow-hidden"
    >
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-2xs">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Salary Potential Calculator
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Trend-Weighted Index
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Estimates potential compensation and career growth using 2023–2027 market demand curves, historical growth rates, and cross-domain synergy multipliers.
          </p>
        </div>

        {/* Reset & Quick Simulator Action */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors focus:outline-hidden cursor-pointer"
            title="Reset to default selection"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          {onSelectForJobSimulator && (
            <button
              type="button"
              onClick={() => onSelectForJobSimulator(selectedSkills[0]?.skillName || 'Python')}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all focus:outline-hidden cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Role</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Combinations Pills */}
      <div className="pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
            Recommended Skill Combinations (High Market Leverage)
          </span>
          <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
            Click a preset stack to evaluate historical trajectory
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map(preset => {
            const isFullySelected =
              preset.skillNames.length === selectedSkills.length &&
              preset.skillNames.every(name => selectedSkills.some(s => s.skillName === name));

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`p-3 rounded-2xl text-left border transition-all relative group cursor-pointer focus:outline-hidden ${
                  isFullySelected
                    ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs ring-2 ring-emerald-500/10'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-extrabold text-xs text-slate-900 truncate">
                    {preset.name}
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 shrink-0">
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                  {preset.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {preset.skillNames.map(sn => (
                    <span
                      key={sn}
                      className="px-1.5 py-0.5 rounded-md bg-slate-100/90 text-slate-600 text-[9px] font-bold"
                    >
                      {sn}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Skill Selector (Multi-Select Chips) */}
      <div className="py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              Select Specific Skills in Combination
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {selectedSkillIds.length} Selected
            </span>
          </div>
          <span className="text-[10px] text-slate-400">
            {calculationResults.categoryCount} Domain {calculationResults.categoryCount > 1 ? 'Categories' : 'Category'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {skillTrends.map(skill => {
            const isSelected = selectedSkillIds.includes(skill.skillId);
            return (
              <button
                key={skill.skillId}
                type="button"
                onClick={() => toggleSkill(skill.skillId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer focus:outline-hidden ${
                  isSelected
                    ? 'bg-[#071f1a] text-white shadow-xs scale-102 ring-2 ring-emerald-900/20'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
                <span>{skill.skillName}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-md font-extrabold ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-300'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  +{skill.growthRate}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Metric 1: Entry-Level Pay Scale */}
        <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-teal-800">
              Entry-Level Scale
            </span>
            <span className="text-[9px] font-bold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-md">
              0–2 Yrs
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ₹{calculationResults.entryMin} – ₹{calculationResults.entryMax} <span className="text-xs font-bold text-slate-600">LPA</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Median: <strong className="text-teal-800 font-extrabold">₹{calculationResults.entryAvg} LPA</strong> (vs ₹4.8 Baseline)
          </div>
        </div>

        {/* Metric 2: Experienced Pay Scale */}
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-700">
              Experienced Scale
            </span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-md">
              4–7 Yrs
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            ₹{calculationResults.expMin} – ₹{calculationResults.expMax} <span className="text-xs font-bold text-slate-600">LPA</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            Median: <strong className="text-emerald-700 font-extrabold">₹{calculationResults.expAvg} LPA</strong> (vs ₹12.5 Baseline)
          </div>
        </div>

        {/* Metric 3: Estimated Potential Growth */}
        <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-700">
              Potential Growth
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight">
            +{calculationResults.growthPercentage}%
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            <strong className="text-indigo-700 font-extrabold">
              {(calculationResults.expAvg / Math.max(0.1, calculationResults.entryAvg)).toFixed(1)}x
            </strong> career advancement multiplier
          </div>
        </div>

        {/* Metric 4: Cross-Domain Synergy Multiplier */}
        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-800">
              Synergy Multiplier
            </span>
            <Layers className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-950 tracking-tight">
            {calculationResults.synergyMultiplier}x
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">
            {calculationResults.categoryCount > 1
              ? `+${Math.round((calculationResults.synergyMultiplier - 1) * 100)}% cross-domain premium`
              : 'Single domain specialization'}
          </div>
        </div>
      </div>

      {/* Main Bar Chart Visualizer */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <span>Pay Scale Comparison: Entry-Level vs Experienced Pay Scales</span>
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Visualizing baseline pay versus your selected skill combination trajectory across enterprise career milestones.
            </p>
          </div>

          {/* Chart View Mode Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-center">
            <button
              type="button"
              onClick={() => setChartViewMode('comparison')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all focus:outline-hidden ${
                chartViewMode === 'comparison'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stack Comparison
            </button>
            <button
              type="button"
              onClick={() => setChartViewMode('roles')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all focus:outline-hidden ${
                chartViewMode === 'roles'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unlocked Roles
            </button>
          </div>
        </div>

        {/* Recharts Simple Bar Chart */}
        <div className="w-full h-72 sm:h-80 bg-slate-50/60 p-3 sm:p-4 rounded-2xl border border-slate-200/60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: -10, bottom: 20 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                fontWeight={600}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                unit=" LPA"
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.15)]}
              />
              <Tooltip
                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                }}
                formatter={(value: any, name: any) => [
                  `₹${value} LPA`,
                  name === 'entryPay' ? 'Entry-Level Pay Scale (0-2 Yrs)' : 'Experienced Pay Scale (4-7 Yrs)'
                ]}
                labelFormatter={(label: any, payload: any) => {
                  const item = payload?.[0]?.payload;
                  return item?.fullName || label;
                }}
              />
              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 700 }}
                formatter={(value) => {
                  return value === 'entryPay' ? (
                    <span className="text-blue-700 font-bold mr-3">Entry-Level Pay Scale (0–2 Yrs)</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">Experienced Pay Scale (4–7 Yrs)</span>
                  );
                }}
              />
              {/* Bar 1: Entry-Level Pay Scale (Blue) */}
              <Bar
                dataKey="entryPay"
                name="entryPay"
                fill="#2563eb"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-entry-${index}`}
                    fill={entry.isCombo ? '#2563eb' : entry.isBaseline ? '#94a3b8' : '#3b82f6'}
                  />
                ))}
              </Bar>

              {/* Bar 2: Experienced Pay Scale (Emerald) */}
              <Bar
                dataKey="expPay"
                name="expPay"
                fill="#059669"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-exp-${index}`}
                    fill={entry.isCombo ? '#059669' : entry.isBaseline ? '#64748b' : '#10b981'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Explainability Breakdown Footer */}
        <div className="mt-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Historical Trend Methodology:</span>{' '}
              Calculated by indexing 5-year regression data (2023–2027). The selected combination features an average annual historical momentum of{' '}
              <strong className="text-emerald-700">+{calculationResults.avgAnnualGrowthRate}%</strong> across{' '}
              <strong className="text-slate-900">{selectedSkills.length} skills</strong>, delivering an estimated{' '}
              <strong className="text-blue-700">
                ₹{calculationResults.entryAvg} LPA
              </strong>{' '}
              entry baseline and unlocking advanced roles like <span className="font-bold text-slate-900">{primaryRole}</span>.
            </div>
          </div>

          {onSelectForJobSimulator && (
            <button
              type="button"
              onClick={() => onSelectForJobSimulator(selectedSkills[0]?.skillName || 'Python')}
              className="inline-flex items-center gap-1 text-xs font-extrabold text-blue-600 hover:text-blue-800 shrink-0 self-end sm:self-center group cursor-pointer"
            >
              <span>Test in Job Simulator</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
