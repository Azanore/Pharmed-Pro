import { useState, useMemo, useEffect, useRef } from "react";
import { CounterScenario, UserRole, PharmacyCampaign, SimulationChoice } from "../types";
import { 
  ShieldCheck, 
  Target, 
  Coins, 
  Stethoscope, 
  FileText, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  TrendingUp,
  CheckCircle,
  Radio,
  Archive,
  ArchiveRestore
} from "lucide-react";
import { ScenarioSidebar } from "./counter/ScenarioSidebar";
import { DebriefingPanel } from "./counter/DebriefingPanel";
import { StepChoices } from "./counter/StepChoices";
import { PrescriptionModal } from "./counter/PrescriptionModal";
import { ClinicalGuideModal } from "./counter/ClinicalGuideModal";

interface Props {
  scenarios: CounterScenario[];
  completedScenarioIds: string[];
  archivedScenarioIds?: string[];
  onCompleteScenario: (scenarioId: string, clinicalScore: number) => void;
  onResetScenarios?: () => void;
  onToggleArchiveScenario?: (scenarioId: string) => void;
  userRole?: UserRole;
  activeCampaign?: PharmacyCampaign;
}

export function CounterSimulator({
  scenarios,
  completedScenarioIds = [],
  archivedScenarioIds = [],
  onCompleteScenario,
  onResetScenarios,
  onToggleArchiveScenario,
  userRole = "employee",
  activeCampaign,
}: Props) {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(scenarios[0]?.id || "");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [isScenarioFinished, setIsScenarioFinished] = useState<boolean>(false);
  const [scoresLog, setScoresLog] = useState<{ clinical: number; business: number; empathy: number }[]>([]);

  // Modal States
  const [showPrescriptionModal, setShowPrescriptionModal] = useState<boolean>(false);
  const [showClinicalGuideModal, setShowClinicalGuideModal] = useState<boolean>(false);

  // Audio Speech Synthesis & Utterance Reference to prevent Chromium Garbage Collection
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Helper labels for categories
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "antibiotique": return "Antibiotiques";
      case "ains_douleur": return "AINS & Douleur";
      case "substitution_generique": return "Génériques & DCI";
      case "pediatrie": return "Pédiatrie & SRO";
      case "dermocosmetique": return "Dermo-médicale";
      case "cardiologie": return "Cardiologie & HTA";
      case "grossesse_femme": return "Grossesse & Sécurité";
      case "gastro_enterologie": return "Gastro & RGO";
      default: return cat;
    }
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Débutant":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Intermédiaire":
        return "bg-blue-50 text-blue-800 border-blue-200";
      case "Expert":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getEmotionBadge = (emotion: string) => {
    switch (emotion) {
      case "pressé":
        return { label: "Pressé(e)", color: "bg-amber-100 text-amber-900 border-amber-300", icon: "⏱️" };
      case "inquiet":
        return { label: "Inquiet(e)", color: "bg-blue-100 text-blue-900 border-blue-300", icon: "😰" };
      case "sceptique":
        return { label: "Sceptique", color: "bg-purple-100 text-purple-900 border-purple-300", icon: "🧐" };
      case "douloureux":
        return { label: "Douloureux / En crise", color: "bg-rose-100 text-rose-900 border-rose-300", icon: "😣" };
      case "hésitant":
        return { label: "Hésitant(e)", color: "bg-orange-100 text-orange-900 border-orange-300", icon: "🤔" };
      case "ouvert":
      default:
        return { label: "À l'écoute", color: "bg-emerald-100 text-emerald-900 border-emerald-300", icon: "😊" };
    }
  };

  // Active scenario
  const currentScenario = scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0];
  const currentStep = currentScenario?.steps[currentStepIndex];

  // Dynamic calculations across all scenarios
  const completedCount = scenarios.filter((s) => completedScenarioIds.includes(s.id)).length;
  
  // Dynamic Realized Margin calculation based on completed cases
  const totalRealizedMarginDh = useMemo(() => {
    return scenarios
      .filter((s) => completedScenarioIds.includes(s.id))
      .reduce((sum, s) => sum + s.netMarginGainDh, 0);
  }, [scenarios, completedScenarioIds]);

  // Total potential margin across all scenarios
  const totalPotentialMarginDh = useMemo(() => {
    return scenarios.reduce((sum, s) => sum + s.netMarginGainDh, 0);
  }, [scenarios]);

  // Check if current scenario is targeted by the active pharmacy campaign
  const isCampaignApplicable = activeCampaign && (
    activeCampaign.categoryTarget === "all" || 
    activeCampaign.categoryTarget === currentScenario?.category
  );

  // Play a gentle audible chime as audio feedback
  const playChimeTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // Audio context silently ignored if not permitted
    }
  };

  // Robust Speech synthesis with French voice fallback and ref binding
  const handleSpeakCustomer = () => {
    if (!currentStep?.customerSay) return;

    if (isSpeaking) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    playChimeTone();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const textToSpeak = currentStep.customerSay;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "fr-FR";
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      // Select French voice if available
      const voices = window.speechSynthesis.getVoices();
      const frVoice = voices.find(
        (v) => v.lang.startsWith("fr") || v.lang.includes("fr") || v.lang.includes("FR")
      );
      if (frVoice) {
        utterance.voice = frVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback visual speaking timer if SpeechSynthesis API is restricted in browser
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
      }, 4000);
    }
  };

  // Reset speech when changing steps or scenarios
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    utteranceRef.current = null;
  }, [currentStepIndex, selectedScenarioId]);

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id);
    setCurrentStepIndex(0);
    setSelectedChoiceId(null);
    setIsScenarioFinished(false);
    setScoresLog([]);
    setShowPrescriptionModal(false);
    setShowClinicalGuideModal(false);
  };

  const handleChoiceClick = (choice: SimulationChoice) => {
    if (selectedChoiceId) return;
    setSelectedChoiceId(choice.id);

    const newScores = [...scoresLog, {
      clinical: choice.clinicalScore,
      business: choice.businessScore,
      empathy: choice.empathyScore,
    }];
    setScoresLog(newScores);

    if (currentStepIndex >= currentScenario.steps.length - 1) {
      setIsScenarioFinished(true);
      const finalClinical = newScores.length 
        ? Math.round(newScores.reduce((a, b) => a + b.clinical, 0) / newScores.length) 
        : 100;
      onCompleteScenario(currentScenario.id, finalClinical);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentScenario.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedChoiceId(null);
    }
  };

  const handleResetCurrentScenario = () => {
    setCurrentStepIndex(0);
    setSelectedChoiceId(null);
    setIsScenarioFinished(false);
    setScoresLog([]);
  };

  const handleNextScenarioDirect = () => {
    // Try to find the next scenario that is not archived
    const currentIndex = scenarios.findIndex((s) => s.id === currentScenario.id);
    const candidateScenarios = [
      ...scenarios.slice(currentIndex + 1),
      ...scenarios.slice(0, currentIndex)
    ];

    const nextUnarchived = candidateScenarios.find((s) => !archivedScenarioIds.includes(s.id));
    if (nextUnarchived) {
      handleSelectScenario(nextUnarchived.id);
    } else {
      const nextIndex = (currentIndex + 1) % scenarios.length;
      handleSelectScenario(scenarios[nextIndex].id);
    }
  };

  const isCurrentArchived = archivedScenarioIds.includes(currentScenario.id);

  const emotionInfo = currentStep 
    ? getEmotionBadge(currentStep.customerEmotion) 
    : { label: "Normal", color: "bg-slate-100 text-slate-800", icon: "👤" };

  return (
    <div id="comptoir-simulator-container" className="space-y-5 max-w-7xl mx-auto animate-fade-in pb-8">
      
      {/* 1. Header Banner & Live Dynamic Metrics */}
      <div 
        id="comptoir-top-hero"
        className={`text-white rounded-3xl p-5 sm:p-7 shadow-xl border relative overflow-hidden transition-all ${
          userRole === "admin"
            ? "bg-gradient-to-r from-purple-950 via-slate-900 to-teal-950 border-purple-800/40"
            : "bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 border-teal-800/40"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-bold tracking-wide border border-white/20">
              {userRole === "admin" ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  <span>AUDIT OFFICINAL · SUPERVISION DES PROTOCOLES CLINIQUES</span>
                </>
              ) : (
                <>
                  <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
                  <span>SIMULATION DE COMPTOIR · CAS RÉELS ET CONSEIL ÉTHIQUE</span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              {userRole === "admin"
                ? "Supervision des Échanges & Rentabilité"
                : "Simulateur d'Échanges au Comptoir"}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {userRole === "admin"
                ? "Examinez les protocoles de dispensation, vérifiez la sécurité clinique et optimisez la marge sur les ordonnances marocaines."
                : "Entraînez-vous face aux réactions réelles des patients : objections de prix, craintes d'effets indésirables et sécurisation des posologies."}
            </p>
          </div>

          {/* Dynamic Interactive Metrics Bar */}
          <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            {/* Validated Scenarios Counter */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">Cas Validés</span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {completedCount}/{scenarios.length}
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Current Scenario Target Margin */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">Marge Cible</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-300">
                +{currentScenario ? currentScenario.netMarginGainDh.toFixed(0) : "0"} DH
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            {/* Total Cumulative Realized Margin */}
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block flex items-center justify-center gap-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Réalisé
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-400">
                +{totalRealizedMarginDh.toFixed(0)} DH
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Campaign Directive Banner */}
      {activeCampaign && (
        <div 
          id="comptoir-active-campaign-banner"
          className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in ${
            isCampaignApplicable 
              ? "bg-amber-50/95 border-amber-300 ring-2 ring-amber-400/20" 
              : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold ${
              isCampaignApplicable ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-700"
            }`}>
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-[11px] flex-wrap">
                <span className={isCampaignApplicable ? "text-amber-950" : "text-slate-900"}>
                  Directive Prioritaire du Titulaire ({activeCampaign.authorName})
                </span>
                {isCampaignApplicable ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                    🎯 Cas directement ciblé
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                    Cible : {activeCampaign.categoryTarget === "all" ? "Toutes spécialités" : activeCampaign.categoryTarget}
                  </span>
                )}
              </div>
              <p className={`mt-0.5 font-medium leading-relaxed ${isCampaignApplicable ? "text-amber-950 font-bold" : "text-slate-600"}`}>
                &ldquo;{activeCampaign.directive}&rdquo;
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-800 shadow-2xs">
              Objectif : {activeCampaign.targetConversionRate}%
            </div>
            {!isCampaignApplicable && (
              <button
                onClick={() => {
                  const targetSc = scenarios.find(s => activeCampaign.categoryTarget === "all" || s.category === activeCampaign.categoryTarget);
                  if (targetSc) handleSelectScenario(targetSc.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold transition-colors cursor-pointer shadow-2xs"
              >
                Voir cas ciblés
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Responsive Grid */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        
        {/* SIDEBAR: Scenario Catalog with Dynamic Search & Filters */}
        <ScenarioSidebar
          scenarios={scenarios}
          selectedScenarioId={currentScenario.id}
          completedScenarioIds={completedScenarioIds}
          archivedScenarioIds={archivedScenarioIds}
          activeCampaign={activeCampaign}
          onSelectScenario={handleSelectScenario}
          onResetScenarios={onResetScenarios}
          onToggleArchiveScenario={onToggleArchiveScenario}
          getCategoryLabel={getCategoryLabel}
          getDifficultyBadge={getDifficultyBadge}
        />

        {/* WORKSPACE: Active Simulation Stage */}
        <main 
          id="comptoir-active-workspace"
          aria-label="Espace de simulation interactif"
          className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden"
        >
          {/* Header Card with Patient & Scenario Context */}
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                    Étape {currentStepIndex + 1} sur {currentScenario.steps.length}
                  </span>
                  <span className="text-[11px] text-slate-400">·</span>
                  <span className="text-[11px] font-semibold text-slate-600">
                    {getCategoryLabel(currentScenario.category)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(currentScenario.difficulty)}`}>
                    {currentScenario.difficulty}
                  </span>
                  {isCurrentArchived ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300 flex items-center gap-1">
                      <Archive className="w-3 h-3 text-slate-600" /> Archivé
                    </span>
                  ) : completedScenarioIds.includes(currentScenario.id) ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" /> Validé
                    </span>
                  ) : null}
                </div>
                <h2 className="text-base sm:text-lg lg:text-xl font-extrabold text-slate-900">
                  {currentScenario.title}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {currentScenario.prescriptionDetails && (
                  <button
                    id="open-prescription-modal-btn"
                    onClick={() => setShowPrescriptionModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>Ordonnance ({currentScenario.prescriptionBasePriceDh.toFixed(0)} DH)</span>
                  </button>
                )}

                <button
                  id="open-guide-modal-btn"
                  onClick={() => setShowClinicalGuideModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-blue-700" />
                  <span>Fiche Clinique</span>
                </button>

                {onToggleArchiveScenario && (
                  <button
                    id="toggle-archive-header-btn"
                    onClick={() => onToggleArchiveScenario(currentScenario.id)}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                      isCurrentArchived
                        ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                    title={isCurrentArchived ? "Désarchiver ce cas" : "Archiver ce cas"}
                  >
                    {isCurrentArchived ? (
                      <>
                        <ArchiveRestore className="w-3.5 h-3.5 text-teal-700" />
                        <span className="hidden sm:inline">Désarchiver</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Archiver</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="flex items-center gap-1.5">
              {currentScenario.steps.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                    idx < currentStepIndex 
                      ? "bg-teal-600" 
                      : idx === currentStepIndex 
                        ? "bg-teal-400 ring-2 ring-teal-400/30" 
                        : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {/* Patient Card & Context */}
            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-[10px]">
                      {currentScenario.customer.initials}
                    </div>
                    <span>{currentScenario.customer.name} ({currentScenario.customer.age} ans)</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${emotionInfo.color}`}>
                    {emotionInfo.icon} {emotionInfo.label}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {currentScenario.customer.situation}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-teal-200/90 bg-teal-50/20 space-y-1">
                <div className="font-bold text-teal-950 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-teal-700" /> Objectif Officinal
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full border border-emerald-300">
                    +{currentScenario.netMarginGainDh.toFixed(0)} DH marge
                  </span>
                </div>
                <p className="text-teal-900 text-[11px] font-medium leading-relaxed">
                  {currentScenario.goal}
                </p>
              </div>
            </div>
          </div>

          {/* SIMULATION BODY */}
          <div className="p-4 sm:p-6 space-y-6">
            
            {/* Customer Speech Bubble */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-xs border border-slate-700">
                {currentScenario.customer.initials}
              </div>

              <div className="space-y-1.5 flex-1 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                    <span>{currentScenario.customer.name}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-slate-400 font-medium">Au comptoir</span>
                  </div>

                  {/* Audio Read-Aloud Button & Equalizer */}
                  <div className="flex items-center gap-2">
                    {isSpeaking && (
                      <div className="flex items-center gap-0.5 px-2 py-1 bg-teal-50 border border-teal-200 rounded-lg">
                        <span className="w-1 h-2 bg-teal-600 rounded-full animate-pulse" />
                        <span className="w-1 h-3.5 bg-teal-700 rounded-full animate-pulse [animation-delay:150ms]" />
                        <span className="w-1 h-2.5 bg-teal-600 rounded-full animate-pulse [animation-delay:300ms]" />
                        <span className="text-[10px] font-bold text-teal-800 ml-1 hidden xs:inline">Lecture vocale</span>
                      </div>
                    )}

                    <button
                      id="speak-customer-dialogue-btn"
                      onClick={handleSpeakCustomer}
                      className={`p-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                        isSpeaking 
                          ? "bg-teal-700 text-white ring-2 ring-teal-300" 
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90"
                      }`}
                      title={isSpeaking ? "Arrêter la lecture" : "Écouter la réplique du patient"}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-white" />
                          <span>Arrêter</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                          <span>Écouter</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className={`p-4 rounded-2xl rounded-tl-xs text-xs sm:text-sm leading-relaxed border transition-all duration-300 ${
                  isSpeaking 
                    ? "bg-teal-50/70 border-teal-300 shadow-sm text-slate-900" 
                    : "bg-slate-100 text-slate-900 border-slate-200 shadow-2xs"
                }`}>
                  <p className="font-semibold text-slate-900 leading-relaxed">&ldquo;{currentStep?.customerSay}&rdquo;</p>
                </div>
              </div>
            </div>

            {/* RESPONSE CHOICES / STEPS or FINAL DEBRIEFING */}
            {!isScenarioFinished && currentStep ? (
              <StepChoices
                currentStep={currentStep}
                currentStepIndex={currentStepIndex}
                totalSteps={currentScenario.steps.length}
                selectedChoiceId={selectedChoiceId}
                onSelectChoice={handleChoiceClick}
                onNextStep={handleNextStep}
              />
            ) : (
              <DebriefingPanel
                scenario={currentScenario}
                scoresLog={scoresLog}
                isArchived={isCurrentArchived}
                onToggleArchive={() => onToggleArchiveScenario?.(currentScenario.id)}
                onReplay={handleResetCurrentScenario}
                onNextScenario={handleNextScenarioDirect}
              />
            )}
          </div>
        </main>
      </div>

      {/* MODAL 1: Moroccan Medical Prescription Slip */}
      {showPrescriptionModal && currentScenario.prescriptionDetails && (
        <PrescriptionModal
          scenario={currentScenario}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}

      {/* MODAL 2: Clinical Guide Modal */}
      {showClinicalGuideModal && (
        <ClinicalGuideModal
          scenario={currentScenario}
          onClose={() => setShowClinicalGuideModal(false)}
        />
      )}

    </div>
  );
}
