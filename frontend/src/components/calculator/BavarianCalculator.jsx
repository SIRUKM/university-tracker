import { useState, useMemo } from "react";
import {
  Calculator,
  GraduationCap,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Check,
  Scale,
  Award,
} from "lucide-react";

// Common international grading scale presets
const SCALE_PRESETS = [
  {
    id: "india-10",
    name: "🇮🇳 India (10-Point CGPA)",
    description: "Most Indian Central & State Universities (Min pass 4.0)",
    maxScore: "10.0",
    minPassScore: "4.0",
    defaultScore: "8.2",
    step: "0.01",
  },
  {
    id: "india-10-pass5",
    name: "🇮🇳 India (10-Point, Min Pass 5.0)",
    description: "Autonomous colleges, VTU, Mumbai Univ, etc.",
    maxScore: "10.0",
    minPassScore: "5.0",
    defaultScore: "8.2",
    step: "0.01",
  },
  {
    id: "india-percent",
    name: "🇮🇳 India (Percentage %)",
    description: "Traditional marks out of 100% (Min pass 40% or 50%)",
    maxScore: "100.0",
    minPassScore: "40.0",
    defaultScore: "75.0",
    step: "0.1",
  },
  {
    id: "us-4",
    name: "🇺🇸 US / Canada (4.0 GPA)",
    description: "4.0 scale with minimum passing grade 2.0 (C grade)",
    maxScore: "4.0",
    minPassScore: "2.0",
    defaultScore: "3.4",
    step: "0.01",
  },
  {
    id: "custom",
    name: "🌐 Custom Grading Scale",
    description: "Enter your own university's maximum and minimum pass score",
    maxScore: "",
    minPassScore: "",
    defaultScore: "",
    step: "any",
  },
];

export default function BavarianCalculator({ onNavigateToDashboard }) {
  const [selectedPresetId, setSelectedPresetId] = useState("india-10");
  const [maxScore, setMaxScore] = useState("10.0");
  const [minPassScore, setMinPassScore] = useState("4.0");
  const [myScore, setMyScore] = useState("8.2");
  const [copied, setCopied] = useState(false);

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    if (preset.id !== "custom") {
      setMaxScore(preset.maxScore);
      setMinPassScore(preset.minPassScore);
      if (preset.defaultScore) setMyScore(preset.defaultScore);
    }
  };

  // Modified Bavarian Formula calculation
  const calculationResult = useMemo(() => {
    const nMax = parseFloat(maxScore);
    const nMin = parseFloat(minPassScore);
    const nScore = parseFloat(myScore);

    if (isNaN(nMax) || isNaN(nMin) || isNaN(nScore)) {
      return { error: "Please enter valid numerical scores." };
    }

    if (nMax <= nMin) {
      return { error: "Maximum score must be strictly greater than minimum passing score." };
    }

    if (nScore > nMax) {
      return { error: `Your score cannot exceed the maximum score (${nMax}).` };
    }

    if (nScore < nMin) {
      return {
        error: `Your score is below the minimum passing grade (${nMin}). In Germany, this is considered a fail (> 4.0).`,
        isFailing: true,
      };
    }

    // Official Modified Bavarian Formula:
    // German Grade = 1 + 3 * ((Nmax - Nd) / (Nmax - Nmin))
    const rawGermanGrade = 1 + 3 * ((nMax - nScore) / (nMax - nMin));
    const roundedGrade = Math.round(rawGermanGrade * 10) / 10;
    const preciseGrade = rawGermanGrade.toFixed(2);

    // Determine German Academic Classification
    let classification = {
      label: "Sehr Gut",
      english: "Excellent",
      color: "text-emerald-700 bg-emerald-50 border-emerald-300",
      description: "Exceptional performance! You have very high chances for TU9 and competitive Master's programs.",
      icon: Award,
    };

    if (rawGermanGrade > 1.5 && rawGermanGrade <= 2.5) {
      classification = {
        label: "Gut",
        english: "Good",
        color: "text-blue-700 bg-blue-50 border-blue-300",
        description: "Meets or exceeds eligibility for almost all German public universities.",
        icon: CheckCircle2,
      };
    } else if (rawGermanGrade > 2.5 && rawGermanGrade <= 3.0) {
      classification = {
        label: "Befriedigend",
        english: "Satisfactory",
        color: "text-amber-700 bg-amber-50 border-amber-300",
        description: "Eligible for universities with non-restricted (NC-frei) admissions and Universities of Applied Sciences.",
        icon: Info,
      };
    } else if (rawGermanGrade > 3.0 && rawGermanGrade <= 4.0) {
      classification = {
        label: "Ausreichend",
        english: "Sufficient / Pass",
        color: "text-orange-700 bg-orange-50 border-orange-300",
        description: "Meets the minimum passing threshold in Germany. Target open-admission programs or private institutions.",
        icon: AlertTriangle,
      };
    } else if (rawGermanGrade > 4.0) {
      classification = {
        label: "Nicht Ausreichend",
        english: "Fail",
        color: "text-red-700 bg-red-50 border-red-300",
        description: "Below German passing requirements.",
        icon: AlertTriangle,
      };
    }

    return {
      raw: rawGermanGrade,
      rounded: roundedGrade.toFixed(1),
      precise: preciseGrade,
      classification,
      stepByStep: {
        numerator: (nMax - nScore).toFixed(2),
        denominator: (nMax - nMin).toFixed(2),
        fraction: ((nMax - nScore) / (nMax - nMin)).toFixed(4),
      },
    };
  }, [maxScore, minPassScore, myScore]);

  const handleCopy = () => {
    if (!calculationResult.rounded) return;
    const textToCopy = `My German Grade: ${calculationResult.rounded} (${calculationResult.classification.label} - ${calculationResult.classification.english}) converted via UniTracker Bavarian Formula Calculator (unitracker.live/grade-calculator)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    handleSelectPreset(SCALE_PRESETS[0]);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-2">
      
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
          <Calculator className="h-3.5 w-3.5" />
          <span>Official German Conversion Tool</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Modified Bavarian Formula Calculator
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Convert your international CGPA or percentage into the official German grading scale (1.0 – 4.0) used by Uni-Assist and German public universities.
        </p>
      </div>

      {/* Main Calculator Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
          
          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5" />
              <span>Select Your Country / Grading System</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SCALE_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-black bg-gray-900 text-white shadow-xs"
                        : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.name}</div>
                    <div
                      className={`text-[11px] mt-0.5 truncate ${
                        isSelected ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {preset.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 space-y-4">
            
            {/* Input 1: Your Score (Nd) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <span>Your Score / CGPA (N<sub className="font-semibold">d</sub>)</span>
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-gray-400">Your final or current score</span>
              </div>
              <input
                type="number"
                step="any"
                value={myScore}
                onChange={(e) => {
                  setMyScore(e.target.value);
                  setSelectedPresetId("custom");
                }}
                placeholder="e.g. 8.45 or 76.5"
                className="w-full p-3 bg-gray-50/70 border border-gray-200 rounded-xl text-base font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
              />
            </div>

            {/* Input 2 & 3: Max and Min Pass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <span>Maximum Score (N<sub className="font-semibold">max</sub>)</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={maxScore}
                  onChange={(e) => {
                    setMaxScore(e.target.value);
                    setSelectedPresetId("custom");
                  }}
                  placeholder="e.g. 10.0 or 100"
                  className="w-full p-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <span className="text-[11px] text-gray-500 block">Maximum possible grade in your scale</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-800 flex items-center gap-1">
                  <span>Minimum Passing Score (N<sub className="font-semibold">min</sub>)</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="any"
                  value={minPassScore}
                  onChange={(e) => {
                    setMinPassScore(e.target.value);
                    setSelectedPresetId("custom");
                  }}
                  placeholder="e.g. 4.0 or 40"
                  className="w-full p-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <span className="text-[11px] text-gray-500 block">Lowest grade required to pass (not zero!)</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-gray-500 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset to Indian 10-Point default</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Result Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-b from-gray-900 to-black text-white rounded-2xl p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Converted German Grade
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800">
                Scale: 1.0 (Best) – 4.0 (Pass)
              </span>
            </div>

            {calculationResult.error ? (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs leading-relaxed space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span>Calculation Alert</span>
                </div>
                <p>{calculationResult.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Score Number Display */}
                <div className="flex items-baseline space-x-3">
                  <div className="text-5xl font-extrabold tracking-tight text-white">
                    {calculationResult.rounded}
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    (Exact: {calculationResult.precise})
                  </div>
                </div>

                {/* Classification Badge */}
                <div className={`p-3 rounded-xl border flex items-start space-x-2.5 ${calculationResult.classification.color}`}>
                  <Award className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider">
                      {calculationResult.classification.label} • {calculationResult.classification.english}
                    </div>
                    <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                      {calculationResult.classification.description}
                    </p>
                  </div>
                </div>

                {/* Visual Progress Bar (1.0 is far right/green, 4.0 is far left) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold">
                    <span>1.0 (Best)</span>
                    <span>2.0</span>
                    <span>3.0</span>
                    <span>4.0 (Pass)</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-400 h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${Math.max(
                          5,
                          Math.min(
                            100,
                            100 - ((parseFloat(calculationResult.rounded) - 1.0) / 3.0) * 100
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex-1 bg-white hover:bg-gray-100 text-black text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        <span>Copied to Clipboard!</span>
                      </>
                    ) : (
                      <>
                        <span>Share / Copy Result</span>
                      </>
                    )}
                  </button>

                  {onNavigateToDashboard && (
                    <button
                      type="button"
                      onClick={onNavigateToDashboard}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer"
                      title="Return to UniTracker Dashboard"
                    >
                      <span>Dashboard</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Formula Breakdown Box */}
          {!calculationResult.error && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-xs space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                <span>Formula Math Breakdown</span>
              </div>
              <div className="font-mono text-[11px] bg-gray-50 p-2.5 rounded-lg text-gray-700 leading-relaxed border border-gray-100">
                German Grade = 1 + 3 × ({maxScore} - {myScore}) / ({maxScore} - {minPassScore})
                <br />
                = 1 + 3 × ({calculationResult.stepByStep.numerator} / {calculationResult.stepByStep.denominator})
                <br />
                = 1 + 3 × {calculationResult.stepByStep.fraction} ={" "}
                <strong className="text-black font-bold">
                  {calculationResult.precise} → {calculationResult.rounded}
                </strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deep-Dive Guide Section: "What International Students MUST Know" */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Essential Guide for International Applicants</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Common Pitfalls & What to Check on Your Transcript
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Uni-Assist and German admission committees strictly follow university-specific examination regulations. Read this before submitting your VPD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          
          {/* Card 1 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Never put 0 as Minimum Passing Score (Nmin)</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              A very frequent mistake is entering 0 as the minimum passing grade. In the Bavarian formula, <strong>N<sub>min</sub></strong> is the lowest score you could obtain and <em>still pass your degree</em>. Putting 0 will artificially drag your German grade down significantly!
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Check the Backside / Footnote of Your Transcript</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Indian universities (e.g., VTU, SPPU, Mumbai University, AKTU, Anna University) state the passing threshold on the reverse of the consolidated marksheet (e.g. <em>"Minimum grade for passing in any course is 'P' / 4.0 or 5.0"</em>). Uni-Assist uses whatever is explicitly printed.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Understanding German Grade Ranges</span>
            </h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• <strong>1.0 – 1.5:</strong> <em>Sehr Gut</em> (Very Good / Excellent)</div>
              <div>• <strong>1.6 – 2.5:</strong> <em>Gut</em> (Good) — Safe zone for 90% of public programs</div>
              <div>• <strong>2.6 – 3.0:</strong> <em>Befriedigend</em> (Satisfactory) — Look for NC-frei courses</div>
              <div>• <strong>3.1 – 4.0:</strong> <em>Ausreichend</em> (Sufficient) — Lowest passing grade</div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">
                4
              </span>
              <span>German Truncation vs Mathematical Rounding</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Most German universities and Uni-Assist truncate or round to one decimal place in favor of the student (e.g., <strong>1.74 → 1.7</strong>). When entering your grade in portals or CVs, use one decimal place.
            </p>
          </div>
        </div>

        {/* Call to action banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-sm font-bold text-emerald-950">
              Ready to shortlist German universities with your grade?
            </div>
            <div className="text-xs text-emerald-800">
              Track deadlines, organize requirements, and follow the 6-phase relocation checklist in UniTracker.
            </div>
          </div>
          {onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="bg-black hover:bg-gray-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center space-x-1.5 cursor-pointer"
            >
              <span>Go to Application Tracker</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
