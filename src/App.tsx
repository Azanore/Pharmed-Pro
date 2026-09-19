import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { WelcomePortal } from "./components/WelcomePortal";
import { CounterSimulator } from "./components/CounterSimulator";
import { MedicationMastery } from "./components/MedicationMastery";
import { AdminDashboard } from "./components/AdminDashboard";
import { PrivacyShieldModal, PrivacyModalTab } from "./components/PrivacyShieldModal";

import { 
  INITIAL_PROFILES, 
  MEDICATIONS, 
  SCENARIOS, 
  DEFAULT_CAMPAIGN
} from "./data/mockPharmacyData";
import { UserProfile, PharmacyCampaign } from "./types";
import { Sparkles, X, ShieldCheck, Scale, FileText } from "lucide-react";

const STORAGE_KEY = "pharmed_pro_state_v5";

export default function App() {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profiles`);
      return saved ? JSON.parse(saved) : INITIAL_PROFILES;
    } catch {
      return INITIAL_PROFILES;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_currentUserId`);
      return saved || INITIAL_PROFILES[0].id;
    } catch {
      return INITIAL_PROFILES[0].id;
    }
  });

  const [activeCampaign, setActiveCampaign] = useState<PharmacyCampaign>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activeCampaign`);
      return saved ? JSON.parse(saved) : DEFAULT_CAMPAIGN;
    } catch {
      return DEFAULT_CAMPAIGN;
    }
  });

  const [activeTab, setActiveTab] = useState<string>("welcome");
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [privacyModalTab, setPrivacyModalTab] = useState<PrivacyModalTab>("sovereignty");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active user object
  const currentUser = profiles.find((u) => u.id === currentUserId) || profiles[0];

  // Save profiles and campaign whenever updated
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profiles`, JSON.stringify(profiles));
  }, [profiles]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_currentUserId`, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_activeCampaign`, JSON.stringify(activeCampaign));
  }, [activeCampaign]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPrivacyModal = (tab: PrivacyModalTab = "sovereignty") => {
    setPrivacyModalTab(tab);
    setIsPrivacyModalOpen(true);
  };

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    const targetUser = profiles.find((p) => p.id === userId);
    if (targetUser?.role === "employee" && activeTab === "dashboard") {
      setActiveTab("scenarios");
    }
    showToast(`Session active : ${targetUser?.name} (${targetUser?.role === "admin" ? "Titulaire" : "Préparateur"})`);
  };

  const handleSelectRoleAndTab = (userId: string, targetTab: string) => {
    setCurrentUserId(userId);
    setActiveTab(targetTab);
    const targetUser = profiles.find((p) => p.id === userId);
    showToast(`Session active : ${targetUser?.name} (${targetUser?.role === "admin" ? "Titulaire" : "Préparateur"})`);
  };

  const handleUpdateCampaign = (campaign: PharmacyCampaign) => {
    setActiveCampaign(campaign);
    showToast(`Consigne mise à jour et diffusée à l'équipe avec succès.`);
  };

  const handleCompleteScenario = (scenarioId: string, clinicalScore: number) => {
    setProfiles((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const alreadyDone = u.completedScenarios.includes(scenarioId);
        const newScenarios = alreadyDone ? u.completedScenarios : [...u.completedScenarios, scenarioId];
        const newSessions = u.trainingSessionsCount + 1;
        const newCompliance = Math.round((u.complianceScore * 4 + clinicalScore) / 5);
        return {
          ...u,
          completedScenarios: newScenarios,
          trainingSessionsCount: newSessions,
          complianceScore: Math.min(100, Math.max(70, newCompliance)),
          lastActiveDate: "À l'instant",
        };
      })
    );
    showToast(`Cas clinique validé ! Score de conformité : ${clinicalScore}%.`);
  };

  const handleResetScenarios = () => {
    setProfiles((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        return {
          ...u,
          completedScenarios: [],
        };
      })
    );
    showToast("Toutes les validations de cas ont été réinitialisées.");
  };

  const handleToggleArchiveScenario = (scenarioId: string) => {
    const isCurrentlyArchived = currentUser.archivedScenarios?.includes(scenarioId);
    setProfiles((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const currentArchived = u.archivedScenarios || [];
        const newArchived = currentArchived.includes(scenarioId)
          ? currentArchived.filter((id) => id !== scenarioId)
          : [...currentArchived, scenarioId];
        return {
          ...u,
          archivedScenarios: newArchived,
        };
      })
    );
    showToast(isCurrentlyArchived ? "Cas restauré dans les cas actifs." : "Cas archivé avec succès.");
  };

  const handleToggleFavoriteMed = (medId: string) => {
    setProfiles((prev) =>
      prev.map((u) => {
        if (u.id !== currentUser.id) return u;
        const favs = u.favoriteMeds.includes(medId)
          ? u.favoriteMeds.filter((id) => id !== medId)
          : [...u.favoriteMeds, medId];
        return { ...u, favoriteMeds: favs };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 flex flex-col font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        allUsers={profiles}
        onOpenPrivacyModal={() => handleOpenPrivacyModal("sovereignty")}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "welcome" && (
          <WelcomePortal
            currentUser={currentUser}
            allUsers={profiles}
            scenarios={SCENARIOS}
            medications={MEDICATIONS}
            activeCampaign={activeCampaign}
            onSelectRole={handleSelectRoleAndTab}
            onNavigateTab={setActiveTab}
            onOpenPrivacyModal={handleOpenPrivacyModal}
          />
        )}

        {activeTab === "scenarios" && (
          <CounterSimulator
            scenarios={SCENARIOS}
            completedScenarioIds={currentUser.completedScenarios}
            archivedScenarioIds={currentUser.archivedScenarios || []}
            onCompleteScenario={handleCompleteScenario}
            onResetScenarios={handleResetScenarios}
            onToggleArchiveScenario={handleToggleArchiveScenario}
            userRole={currentUser.role}
            activeCampaign={activeCampaign}
          />
        )}

        {activeTab === "medications" && (
          <MedicationMastery
            medications={MEDICATIONS}
            favoriteIds={currentUser.favoriteMeds}
            onToggleFavorite={handleToggleFavoriteMed}
            userRole={currentUser.role}
            activeCampaign={activeCampaign}
          />
        )}

        {activeTab === "dashboard" && currentUser.role === "admin" && (
          <AdminDashboard
            currentUser={currentUser}
            allUsers={profiles}
            activeCampaign={activeCampaign}
            onUpdateCampaign={handleUpdateCampaign}
          />
        )}
      </main>

      {/* Floating Toast Notification - Accessible */}
      {toastMessage && (
        <div 
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs font-semibold shadow-2xl border border-slate-700 animate-slide-up touch-target"
        >
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 text-slate-400 hover:text-white cursor-pointer touch-target"
            aria-label="Fermer la notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Data Sovereignty & Privacy Shield Modal */}
      <PrivacyShieldModal
        isOpen={isPrivacyModalOpen}
        initialTab={privacyModalTab}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Modern, High-Utility Footer */}
      <footer className="bg-white border-t border-slate-200/90 pt-10 pb-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-100">
            {/* Column 1: Pharmacy Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-800 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  P
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight block">PharmEd Pro</span>
                  <span className="text-[11px] text-slate-400">Excellence Officinale & Conseil</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Pharmacie Centrale de Bourgogne · Casablanca. Plateforme interne d&apos;évaluation clinique et déontologique.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>100% Déterministe & Local</span>
              </div>
            </div>

            {/* Column 2: Module Shortcuts */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Modules d&apos;Entraînement
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setActiveTab("welcome")}
                    className={`hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "welcome" ? "text-teal-800 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span>Portail d&apos;Accueil</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("scenarios")}
                    className={`hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "scenarios" ? "text-teal-800 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span>Simulateur de Comptoir</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("medications")}
                    className={`hover:text-teal-700 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "medications" ? "text-teal-800 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span>Encyclopédie DCI & Marges</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      const admin = profiles.find((u) => u.role === "admin") || profiles[1];
                      handleSelectRoleAndTab(admin.id, "dashboard");
                    }}
                    className={`hover:text-purple-700 transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeTab === "dashboard" ? "text-purple-800 font-bold" : "text-slate-500"
                    }`}
                  >
                    <span>Supervision Titulaire & Audit</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Regulatory Modals */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Cadre Déontologique & RGPD
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => handleOpenPrivacyModal("sovereignty")}
                    className="w-full sm:w-auto text-slate-600 hover:text-teal-700 hover:bg-teal-50/60 p-2 sm:p-0 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-left"
                  >
                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="font-medium">Souveraineté des Données</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenPrivacyModal("deontology")}
                    className="w-full sm:w-auto text-slate-600 hover:text-purple-700 hover:bg-purple-50/60 p-2 sm:p-0 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-left"
                  >
                    <Scale className="w-4 h-4 text-purple-600 shrink-0" />
                    <span className="font-medium">Charte Déontologique Officinale</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenPrivacyModal("ppm")}
                    className="w-full sm:w-auto text-slate-600 hover:text-amber-700 hover:bg-amber-50/60 p-2 sm:p-0 rounded-lg transition-colors cursor-pointer flex items-center gap-2 text-left"
                  >
                    <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-medium">Conformité Nomenclature PPM</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Sub-row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span>© {new Date().getFullYear()} PharmEd Pro. Tous droits réservés.</span>
              <span>·</span>
              <span>Conforme Ordre National des Pharmaciens</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Officine Connectée (Mode Autonome)
              </span>
              <span>·</span>
              <span className="font-semibold text-slate-500">v2.4.0</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
