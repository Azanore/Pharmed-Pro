import { useEffect } from "react";
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Server, 
  CheckCircle2, 
  X, 
  FileText, 
  Scale, 
  Stethoscope, 
  Building2, 
  BadgePercent,
  HeartHandshake
} from "lucide-react";

export type PrivacyModalTab = "sovereignty" | "deontology" | "ppm";

interface Props {
  isOpen: boolean;
  initialTab?: PrivacyModalTab;
  onClose: () => void;
}

export function PrivacyShieldModal({ isOpen, initialTab = "sovereignty", onClose }: Props) {
  // Lock body scroll when dialog is open so scrolling occurs inside modal, not behind it
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto overscroll-contain animate-fade-in"
      onClick={onClose}
    >
      {/* Dedicated Sovereignty Dialog */}
      {initialTab === "sovereignty" && (
        <div 
          id="sovereignty-dialog"
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[88vh] overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-teal-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">Souveraineté des Données</h2>
                <p className="text-xs text-teal-200">PharmEd Pro Officine · 100% Déterministe & Local</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-teal-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer le dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-slate-700 text-xs sm:text-sm flex-1">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed text-emerald-950 space-y-1">
                <strong className="block text-emerald-900 font-bold">Architecture 100% Déterministe & Zéro Fuite Tiers</strong>
                <p>
                  L&apos;application s&apos;exécute de manière autonome dans le navigateur de l&apos;officine sans dépendance à des APIs d&apos;IA générative externes. 
                  Aucune ordonnance, donnée patient ou chiffre économique n&apos;est transmis vers des serveurs tiers.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Lock className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Zéro LLM Externe</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Toutes les évaluations sont régies par des arbres décisionnels pharmacologiques vérifiés et reproductibles.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <EyeOff className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zéro Hallucination</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Les posologies et contre-indications sont strictement conformes aux monographies et référentiels officiels.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <Server className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Traitement Local</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Les scores et l&apos;historique d&apos;apprentissage sont enregistrés dans l&apos;environnement local de l&apos;officine.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Accès Cloisonné Titulaire</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Les marges et données économiques sont strictement isolées et réservées à la session Titulaire.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">
              PharmEd Pro · Souveraineté & Déterminisme
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Dedicated Deontology Dialog */}
      {initialTab === "deontology" && (
        <div 
          id="deontology-dialog"
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[88vh] overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center shrink-0">
                <Scale className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">Charte Déontologique Officinale</h2>
                <p className="text-xs text-purple-200">Conseil Associé Protecteur · Bonnes Pratiques Officinales</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-purple-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer le dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-slate-700 text-xs sm:text-sm flex-1">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
              <div className="flex items-center gap-2 text-purple-950 font-bold text-sm">
                <Stethoscope className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Principes Déontologiques de la Délivrance</span>
              </div>
              <p className="text-xs text-purple-900 leading-relaxed">
                Le conseil associé à l&apos;officine a pour objectif exclusif d&apos;améliorer l&apos;observance thérapeutique, 
                de prévenir les effets indésirables (iatrogénie) et de sécuriser la prise des traitements prescrits.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>1. Priorité Thérapeutique & Non-Subordination :</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                  Le conseil associé ne doit jamais se substituer à la prescription médicale ni conditionner la délivrance des médicaments majeurs.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <HeartHandshake className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>2. Pédagogie, Observance & Empathie :</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                  Toute recommandation (protecteur gastrique, probiotiques, réhydratation) doit s&apos;accompagner d&apos;une explication claire de son bénéfice direct pour le confort et la tolérance du patient.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>3. Cas Cliniques & Formation Continue :</span>
                </div>
                <p className="text-[11px] text-slate-600 pl-6 leading-relaxed">
                  Les scénarios et noms de patients simulés dans cette plateforme sont strictement fictifs et conçus uniquement à des fins d&apos;entraînement de l&apos;équipe.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">
              PharmEd Pro · Déontologie & Éthique
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Dedicated PPM Nomenclature Dialog */}
      {initialTab === "ppm" && (
        <div 
          id="ppm-dialog"
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[88vh] overscroll-contain"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-amber-950 via-amber-900 to-slate-900 text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold">Conformité Nomenclature PPM</h2>
                <p className="text-xs text-amber-200">Prix Public Maroc · Tarification Homologuée & DCI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-amber-200 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Fermer le dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain space-y-4 text-slate-700 text-xs sm:text-sm flex-1">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                <Building2 className="w-4 h-4 text-amber-800 shrink-0" />
                <span>Cadre Tarifaire & Prix Public Maroc (PPM)</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Les prix des médicaments princeps et génériques indiqués dans les fiches monographies 
                sont conformes à la nomenclature officielle des Prix Publics Maroc (PPM) fixés par les arrêtés du Ministère de la Santé.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 pt-1">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <BadgePercent className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>DCI & Génériques Certifiés</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Encouragement de la substitution économique sécurisée conforme à la réglementation marocaine pour préserver le pouvoir d&apos;achat du patient.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                  <FileText className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Conseils Associés Libres</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Les compléments alimentaires, solutés d&apos;hydratation et topiques disposent de prix officinaux libres avec transparence des marges.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-500 font-medium">
              PharmEd Pro · Nomenclature Officielle Maroc
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

