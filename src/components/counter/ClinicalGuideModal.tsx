import { useEffect } from "react";
import { CounterScenario } from "../../types";
import { Lightbulb, X, Check, AlertTriangle } from "lucide-react";

interface ClinicalGuideModalProps {
  scenario: CounterScenario;
  onClose: () => void;
}

export function ClinicalGuideModal({ scenario, onClose }: ClinicalGuideModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = "";
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      id="guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain animate-fade-in"
      onClick={onClose}
    >
      <div 
        id="guide-card-content"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[88vh] overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-teal-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Fiche Clinique Express</h2>
              <p className="text-xs text-blue-200 font-medium">Aide-mémoire de pharmacologie pour ce cas de comptoir</p>
            </div>
          </div>
          <button
            id="close-guide-modal-btn"
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fermer la fiche clinique"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-slate-700 text-xs sm:text-sm flex-1">
          <div className="p-4 bg-teal-50 rounded-2xl border border-teal-200 space-y-1.5">
            <span className="font-bold text-teal-950 uppercase tracking-wider text-[10px] block">
              Produit Associé Idéal Synergique
            </span>
            <p className="text-sm font-extrabold text-teal-900">{scenario.targetAddon}</p>
            <div className="flex items-center gap-3 text-xs text-teal-800 pt-1 border-t border-teal-200/60">
              <span>PPM Réglementé : <strong>{scenario.addonPriceDh.toFixed(2)} DH</strong></span>
              <span>·</span>
              <span>Gain Marge Brute : <strong className="text-emerald-700">+{scenario.netMarginGainDh.toFixed(2)} DH ({scenario.addonMarginPct}%)</strong></span>
            </div>
          </div>

          {scenario.takeaways && scenario.takeaways.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                Points de Vigilance Essentiels
              </span>
              <ul className="space-y-2 text-xs text-slate-600">
                {scenario.takeaways.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5 text-amber-900">
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Conseil d&apos;observance patient
            </span>
            <p className="leading-relaxed text-xs text-amber-950">
              Toujours valider la compréhension de la posologie par le patient avant son départ en lui faisant répéter les moments de prise clés.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            PharmEd Pro · Fiche Clinique
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Compris, retour à l&apos;échange
          </button>
        </div>
      </div>
    </div>
  );
}
