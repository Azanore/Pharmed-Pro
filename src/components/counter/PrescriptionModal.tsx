import { useEffect } from "react";
import { CounterScenario } from "../../types";
import { Building2, X, FileText, ShieldCheck } from "lucide-react";

interface PrescriptionModalProps {
  scenario: CounterScenario;
  onClose: () => void;
}

export function PrescriptionModal({ scenario, onClose }: PrescriptionModalProps) {
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

  if (!scenario.prescriptionDetails) return null;

  return (
    <div 
      id="prescription-modal-backdrop"
      className="fixed top-16 left-0 right-0 bottom-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
    >
      <div 
        id="prescription-pad-card"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[calc(100vh-5rem)] overscroll-contain"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-teal-300 font-bold flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                <span>Royaume du Maroc · Ordre des Médecins</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {scenario.prescriptionDetails.doctorName}
              </h2>
              <p className="text-xs text-teal-200 font-medium">
                {scenario.prescriptionDetails.doctorSpecialty} · {scenario.prescriptionDetails.clinicAddress}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              id="close-prescription-modal-btn"
              onClick={onClose}
              className="touch-target p-2 text-teal-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer l'ordonnance"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-slate-700 text-xs sm:text-sm flex-1">
          {/* Patient Line */}
          <div className="flex items-center justify-between text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-500 font-medium">Patient(e) : </span>
              <strong className="text-slate-900">{scenario.customer.name} ({scenario.customer.age} ans)</strong>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Date : {scenario.prescriptionDetails.date}
            </div>
          </div>

          {/* Rx Items List */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-teal-700" />
              <span>Prescription Médicale Réglementaire (Rx)</span>
            </div>

            <div className="space-y-2">
              {scenario.prescriptionDetails.items.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs sm:text-sm">
                      <span>{item.name}</span>
                      {item.isPrinceps && (
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                          Princeps
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 font-medium">{item.dosage} · {item.posology}</p>
                    <p className="text-[10px] text-slate-400">Durée du traitement : {item.duration}</p>
                  </div>
                  <div className="font-extrabold text-slate-800 text-xs sm:text-sm shrink-0 bg-white px-2.5 py-1 rounded-xl border border-slate-200">
                    {item.priceDh.toFixed(2)} DH
                  </div>
                </div>
              ))}
            </div>

            {scenario.prescriptionDetails.clinicalNotes && (
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                <span className="font-bold">Diagnostic / Notes cliniques : </span>
                {scenario.prescriptionDetails.clinicalNotes}
              </div>
            )}
          </div>

          {/* Authentic Moroccan Medical Stamp & Signature Box */}
          <div className="bg-teal-50/70 border-2 border-dashed border-teal-700/40 rounded-2xl p-4 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-teal-900 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Cachet Officiel & Signature Médicale</span>
            </div>
            <div className="text-xs text-teal-900 font-bold leading-tight">
              {scenario.prescriptionDetails.doctorName}
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              INPE / CNOM: 14082/C · Casablanca
            </div>
            <div className="text-xs font-serif italic text-teal-800 pt-1 border-t border-teal-200/80">
              ✍️ {scenario.prescriptionDetails.doctorName.split(" ").slice(-1)[0]}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-bold">Total PPM Réglementé</span>
            <span className="text-base sm:text-lg font-extrabold text-teal-900">
              {scenario.prescriptionBasePriceDh.toFixed(2)} DH
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Fermer l&apos;ordonnance
          </button>
        </div>
      </div>
    </div>
  );
}
