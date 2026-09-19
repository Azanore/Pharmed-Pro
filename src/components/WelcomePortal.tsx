import { UserProfile, CounterScenario, Medication, PharmacyCampaign } from "../types";
import { 
  ShieldCheck, 
  ArrowRight, 
  BookOpen, 
  MessageSquareText, 
  CheckCircle2, 
  Sparkles, 
  LayoutDashboard, 
  Building2,
  Users,
  FileCheck2,
  Stethoscope,
  Briefcase,
  Layers,
  Award,
  Scale,
  FileText,
  Target
} from "lucide-react";

interface Props {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  scenarios: CounterScenario[];
  medications: Medication[];
  activeCampaign?: PharmacyCampaign;
  onSelectRole: (userId: string, targetTab: string) => void;
  onNavigateTab: (tab: string) => void;
  onOpenPrivacyModal: (tab?: "sovereignty" | "deontology" | "ppm") => void;
}

export function WelcomePortal({
  currentUser,
  allUsers,
  scenarios,
  medications,
  activeCampaign,
  onSelectRole,
  onNavigateTab,
  onOpenPrivacyModal,
}: Props) {
  const employeeUser = allUsers.find((u) => u.role === "employee") || allUsers[0];
  const adminUser = allUsers.find((u) => u.role === "admin") || allUsers[1];

  const handleOpenCounter = () => {
    onNavigateTab("scenarios");
  };

  const handleOpenAdmin = () => {
    if (currentUser.role !== "admin") {
      onSelectRole(adminUser.id, "dashboard");
    } else {
      onNavigateTab("dashboard");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-4">
      {/* Pharmacy Identification & Sovereign Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-7 sm:p-9 shadow-xl border border-teal-900/50">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wide">
            <ShieldCheck className="w-4 h-4 text-teal-300 shrink-0" />
            <span>Pharmacie Centrale de Bourgogne · Casablanca</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Système Officinal d&apos;Excellence Clinique & Conseil Associé
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl">
            Plateforme interne d&apos;entraînement de l&apos;équipe officinale pour sécuriser les délivrances, 
            maîtriser la pharmacovigilance et valoriser le conseil associé éthique, 
            garantissant une conformité déontologique totale.
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-200">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
              <MessageSquareText className="w-3.5 h-3.5 text-teal-300" />
              <span>{scenarios.length} Cas de Comptoir</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
              <BookOpen className="w-3.5 h-3.5 text-emerald-300" />
              <span>{medications.length} Monographies PPM</span>
            </div>
            <button
              onClick={() => onOpenPrivacyModal("sovereignty")}
              className="flex items-center gap-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 px-3 py-1 rounded-xl border border-emerald-400/30 text-emerald-200 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>100% Déterministe & RGPD</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={handleOpenCounter}
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-900/30 flex items-center gap-2 transition-colors duration-150 cursor-pointer"
            >
              <span>Accéder aux Simulations</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleOpenAdmin}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-2 transition-colors duration-150 cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-purple-300" />
              <span>Espace Titulaire & Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Campaign Directive Notice for Employees */}
      {activeCampaign && (
        <div 
          id="welcome-active-campaign-card"
          className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-100/40 border border-amber-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs mt-0.5">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-950 bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Directive & Priorité Officinale du Mois
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Diffusée par {activeCampaign.authorName} · Valable jusqu'au {activeCampaign.activeUntil}
                </span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                &ldquo;{activeCampaign.directive}&rdquo;
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 flex-wrap">
                <span>Cible prioritaire : <strong className="text-amber-950 font-bold">{activeCampaign.categoryTarget === "all" ? "Toutes les spécialités" : activeCampaign.categoryTarget}</strong></span>
                <span>·</span>
                <span>Objectif de conversion équipe : <strong className="text-amber-950 font-bold">{activeCampaign.targetConversionRate}%</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenCounter}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs shrink-0 self-start md:self-center flex items-center gap-1.5"
          >
            <span>S&apos;entraîner sur cette consigne</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Dual Professional Workspaces */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Workspace 1: Équipe Comptoir & Préparateurs */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-teal-300 transition-colors duration-150 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                <MessageSquareText className="w-5 h-5 text-teal-700" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Espace Équipe Comptoir
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                Pratique au Comptoir & Pharmacovigilance
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Entraînez-vous sur des situations patient concrètes du quotidien officinal marocain 
                (antibiothérapie, pédiatrie d&apos;urgence, affections chroniques, dermo-cosmétique). 
                Formulez le conseil associé protecteur avec des arguments déontologiques solides.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Cas réels : posologie en mg/kg, SRO, gastro-protection, antibiothérapie</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Monographies complètes : DCI, Princeps/Génériques et prix réglementés PPM</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Évaluation continue : conformité déontologique, empathie et pertinence</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-6 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">{scenarios.length} cas cliniques disponibles</span>

            <button
              onClick={handleOpenCounter}
              className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Ouvrir les Simulations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Workspace 2: Direction Officinale / Pharmacien Titulaire */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-purple-300 transition-colors duration-150 flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5 text-purple-700" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-1 rounded-full border border-purple-300">
                Direction Officinale
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-purple-800 transition-colors">
                Pilotage des Consignes & Audit d&apos;Équipe
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Supervisez la progression et les scores de conformité de votre équipe, 
                paramétrez la consigne prioritaire du mois répercutée sur les écrans de comptoir 
                et mesurez le retour sur investissement sur la marge brute officinale.
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Diffusion instantanée des consignes et objectifs de conseil associé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Roster de performance : scores de conformité et cas validés par préparateur</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tableau comparatif d&apos;audit : valorisation de la marge avant / après formation</span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-100 mt-6 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Titulaire : {adminUser.name}</span>

            <button
              onClick={handleOpenAdmin}
              className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-colors duration-150 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Accéder à la Supervision</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Access Modules Bar */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              Modules Pédagogiques & Espaces Métier
            </h3>
            <p className="text-xs text-slate-500">
              Entraînement immersif au comptoir, fiches DCI et pilotage officinal
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-center">
            {scenarios.length} cas · {medications.length} DCI
          </span>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigateTab("scenarios")}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-xs transition-colors duration-150 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold mb-3">
              <MessageSquareText className="w-5 h-5 text-teal-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
              Simulateur de Comptoir
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Cas scénarisés interactifs avec réactions patients, audio vocal, calcul de marge et archivage.
            </p>
          </button>

          <button
            onClick={() => onNavigateTab("medications")}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-400 hover:shadow-xs transition-colors duration-150 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
              <BookOpen className="w-5 h-5 text-emerald-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
              Encyclopédie DCI & Marges
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Monographies PPM complètes, conseil associé synergique et argumentaires de substitution.
            </p>
          </button>

          <button
            onClick={() => handleOpenAdmin()}
            className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-xs transition-colors duration-150 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3">
              <Building2 className="w-5 h-5 text-purple-700" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-purple-700 transition-colors">
              Espace Audit & Titulaire
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Supervision de l&apos;équipe, paramétrage des campagnes prioritaires et mesure du ROI officinal.
            </p>
          </button>
        </div>
      </div>

      {/* Responsive Cadre Déontologique, Souveraineté & PPM Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700">
            Cadre de Confiance & Conformité Officinale
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Standards Marocains & RGPD</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Card 1: Souveraineté des Données */}
          <button
            onClick={() => onOpenPrivacyModal("sovereignty")}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-xs transition-colors duration-150 text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-teal-700 transition-colors">
                Souveraineté des Données
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                100% Déterministe · Zéro LLM externe · Traitement strictement local à l&apos;officine.
              </p>
            </div>
          </button>

          {/* Card 2: Charte Déontologique Officinale */}
          <button
            onClick={() => onOpenPrivacyModal("deontology")}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-400 hover:shadow-xs transition-colors duration-150 text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-purple-700 transition-colors">
                Charte Déontologique
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Conseil associé protecteur non subordonné à la prescription · Cas cliniques pédagogiques.
              </p>
            </div>
          </button>

          {/* Card 3: Conformité Nomenclature PPM */}
          <button
            onClick={() => onOpenPrivacyModal("ppm")}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-amber-400 hover:shadow-xs transition-colors duration-150 text-left flex items-start gap-3.5 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-amber-700 transition-colors">
                Nomenclature PPM
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Prix Public Maroc officiels · Transparence des marges · Génériques certifiés.
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
