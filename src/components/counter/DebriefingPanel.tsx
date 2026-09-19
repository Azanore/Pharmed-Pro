import { CounterScenario } from "../../types";
import { 
  Award, 
  CheckCircle, 
  Coins, 
  Stethoscope, 
  Sparkles, 
  RotateCcw, 
  ArrowRight,
  Archive,
  ArchiveRestore
} from "lucide-react";

interface DebriefingPanelProps {
  scenario: CounterScenario;
  scoresLog: { clinical: number; business: number; empathy: number }[];
  isArchived?: boolean;
  onToggleArchive?: () => void;
  onReplay: () => void;
  onNextScenario: () => void;
}

export function DebriefingPanel({
  scenario,
  scoresLog,
  isArchived = false,
  onToggleArchive,
  onReplay,
  onNextScenario,
}: DebriefingPanelProps) {
  // Compute average scores dynamically from actual choices made by the user
  const avgClinical = scoresLog.length 
    ? Math.round(scoresLog.reduce((a, b) => a + b.clinical, 0) / scoresLog.length) 
    : 100;
  const avgBusiness = scoresLog.length 
    ? Math.round(scoresLog.reduce((a, b) => a + b.business, 0) / scoresLog.length) 
    : 100;
  const avgEmpathy = scoresLog.length 
    ? Math.round(scoresLog.reduce((a, b) => a + b.empathy, 0) / scoresLog.length) 
    : 100;

  const totalBasketDh = scenario.prescriptionBasePriceDh + scenario.addonPriceDh;

  return (
    <div 
      id="scenario-final-debriefing"
      className="p-5 sm:p-7 bg-gradient-to-b from-teal-50/70 via-emerald-50/40 to-white border border-teal-200 rounded-3xl space-y-6 animate-fade-in"
    >
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-700 text-white flex items-center justify-center shadow-md">
          <Award className="w-8 h-8" />
        </div>
        
        <div>
          <span className="text-xs font-bold text-teal-800 uppercase tracking-widest block">
            Bilan Officinal 360° · Cas Validé
          </span>
          <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mt-0.5">
            {scenario.title}
          </h2>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
          <span>Conformité Déontologique & Économique Validée</span>
        </div>
      </div>

      {/* 3 Pillar Score Cards dynamically calculated */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3 max-w-xl mx-auto text-left">
        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sécurité Clinique</span>
          <span className="text-lg sm:text-2xl font-extrabold text-teal-700">{avgClinical}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Posologie & DCI</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Empathie Patient</span>
          <span className="text-lg sm:text-2xl font-extrabold text-indigo-700">{avgEmpathy}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Écoute & Clarté</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Conseil Associé</span>
          <span className="text-lg sm:text-2xl font-extrabold text-emerald-700">{avgBusiness}%</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Marge Officine</span>
        </div>
      </div>

      {/* Moroccan Pharmacy Economics & Clinical Guarantee */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200 shadow-2xs space-y-4 text-xs text-slate-700 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600" /> Bilan Économique Officinal (PPM)
          </span>
          <span className="font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 text-xs">
            +{scenario.netMarginGainDh.toFixed(2)} DH gain net
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 block uppercase">Panier Initial</span>
            <span className="text-sm font-extrabold text-slate-800">{scenario.prescriptionBasePriceDh.toFixed(2)} DH</span>
          </div>
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-800 block uppercase">Panier Conseillé</span>
            <span className="text-sm font-extrabold text-emerald-900">
              {totalBasketDh.toFixed(2)} DH
            </span>
          </div>
        </div>

        <p className="text-slate-600 font-medium leading-relaxed">
          {scenario.economicImpactSummary}
        </p>

        {/* Guaranteed Clinical Outcome */}
        <div className="pt-3 border-t border-slate-100 flex items-start gap-2.5">
          <Stethoscope className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-teal-950 block font-bold text-xs">Résultat Clinique & Observance :</strong>
            <span className="text-slate-600 leading-relaxed font-normal">{scenario.clinicalOutcome}</span>
          </div>
        </div>
      </div>

      {/* 3 Golden Rules / Takeaways for Retention */}
      {scenario.takeaways && scenario.takeaways.length > 0 && (
        <div className="max-w-xl mx-auto bg-amber-50/70 rounded-2xl p-4 sm:p-5 border border-amber-200 text-left space-y-2.5">
          <div className="flex items-center gap-1.5 font-extrabold text-amber-950 text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>3 Règles d&apos;Or au Comptoir à Mémoriser</span>
          </div>

          <ul className="space-y-2 text-xs text-amber-900">
            {scenario.takeaways.map((rule, rIdx) => (
              <li key={rIdx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {rIdx + 1}
                </span>
                <span className="leading-relaxed font-medium">{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
        <button
          id="replay-scenario-btn"
          onClick={onReplay}
          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rejouer ce cas</span>
        </button>

        {onToggleArchive && (
          <button
            id="toggle-archive-debrief-btn"
            onClick={onToggleArchive}
            className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
              isArchived
                ? "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
                : "bg-teal-50 border-teal-200 text-teal-800 hover:bg-teal-100"
            }`}
          >
            {isArchived ? (
              <>
                <ArchiveRestore className="w-3.5 h-3.5 text-teal-700" />
                <span>Désarchiver</span>
              </>
            ) : (
              <>
                <Archive className="w-3.5 h-3.5 text-teal-700" />
                <span>Archiver ce cas validé</span>
              </>
            )}
          </button>
        )}

        <button
          id="next-scenario-btn"
          onClick={onNextScenario}
          className="px-6 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
        >
          <span>Cas clinique suivant</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
