import { useMemo, useState } from "react";
import { CounterScenario, PharmacyCampaign } from "../../types";
import { 
  RotateCcw, 
  Search, 
  X, 
  ListFilter, 
  Check, 
  CircleDot, 
  Coins,
  Archive,
  ArchiveRestore,
  Target
} from "lucide-react";

interface ScenarioSidebarProps {
  scenarios: CounterScenario[];
  selectedScenarioId: string;
  completedScenarioIds: string[];
  archivedScenarioIds?: string[];
  activeCampaign?: PharmacyCampaign;
  onSelectScenario: (scenarioId: string) => void;
  onResetScenarios?: () => void;
  onToggleArchiveScenario?: (scenarioId: string) => void;
  getCategoryLabel: (cat: string) => string;
  getDifficultyBadge: (diff: string) => string;
}

export function ScenarioSidebar({
  scenarios,
  selectedScenarioId,
  completedScenarioIds,
  archivedScenarioIds = [],
  activeCampaign,
  onSelectScenario,
  onResetScenarios,
  onToggleArchiveScenario,
  getCategoryLabel,
  getDifficultyBadge,
}: ScenarioSidebarProps) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"active" | "archived" | "all">("active");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    scenarios.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [scenarios]);

  // Filtered scenarios dynamically
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((sc) => {
      const isArchived = archivedScenarioIds.includes(sc.id);
      
      if (statusFilter === "active" && isArchived) return false;
      if (statusFilter === "archived" && !isArchived) return false;
      if (categoryFilter !== "all" && sc.category !== categoryFilter) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = sc.title.toLowerCase().includes(query);
        const matchCustomer = sc.customer.name.toLowerCase().includes(query) || sc.customer.situation.toLowerCase().includes(query);
        const matchTarget = sc.targetAddon.toLowerCase().includes(query);
        const matchGoal = sc.goal.toLowerCase().includes(query);
        const matchPrescription = sc.prescriptionContext?.toLowerCase().includes(query) || false;
        const matchCategory = sc.category.toLowerCase().includes(query);
        const matchDifficulty = sc.difficulty.toLowerCase().includes(query);

        return matchTitle || matchCustomer || matchTarget || matchGoal || matchPrescription || matchCategory || matchDifficulty;
      }

      return true;
    });
  }, [scenarios, archivedScenarioIds, statusFilter, categoryFilter, searchQuery]);

  const completedCount = scenarios.filter((s) => completedScenarioIds.includes(s.id)).length;
  const archivedCount = scenarios.filter((s) => archivedScenarioIds.includes(s.id)).length;
  const activeCount = scenarios.length - archivedCount;
  const progressPct = scenarios.length > 0 ? Math.round((completedCount / scenarios.length) * 100) : 0;

  const handleExecuteResetAll = () => {
    if (onResetScenarios) {
      onResetScenarios();
    }
    setShowResetConfirm(false);
  };

  return (
    <aside 
      id="comptoir-scenarios-sidebar"
      aria-label="Catalogue des cas d'officine"
      className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] flex flex-col bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 z-10"
    >
      {/* Header & Reset Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Cas d&apos;Officine ({scenarios.length})
            </h2>
            <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              {progressPct}% validés
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-36 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {onResetScenarios && (
          <div className="relative">
            {showResetConfirm ? (
              <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-xl border border-rose-200 animate-fade-in">
                <button
                  id="confirm-reset-all-btn"
                  onClick={handleExecuteResetAll}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  Effacer
                </button>
                <button
                  id="cancel-reset-all-btn"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-1.5 py-1 text-slate-600 hover:text-slate-800 text-[10px] rounded-lg cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                id="init-reset-all-btn"
                onClick={() => setShowResetConfirm(true)}
                className="p-1.5 px-2.5 rounded-xl text-slate-500 hover:text-teal-700 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] font-semibold"
                title="Réinitialiser les validations"
              >
                <RotateCcw className="w-3 h-3 text-slate-400" />
                <span>Réinitialiser</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Search Box */}
      <div className="relative shrink-0">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          id="search-scenario-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher molécule, pathologie, nom..."
          className="w-full pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs text-slate-800 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-md cursor-pointer"
            aria-label="Effacer la recherche"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Status Tabs (Actifs, Archivés, Tous) */}
      <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold text-slate-600 gap-1 shrink-0">
        <button
          id="filter-active-tab"
          onClick={() => setStatusFilter("active")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
            statusFilter === "active"
              ? "bg-white text-slate-900 shadow-2xs font-extrabold"
              : "hover:text-slate-900"
          }`}
          title="Cas à traiter ou non-archivés"
        >
          Actifs ({activeCount})
        </button>
        <button
          id="filter-archived-tab"
          onClick={() => setStatusFilter("archived")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
            statusFilter === "archived"
              ? "bg-white text-slate-900 shadow-2xs font-extrabold"
              : "hover:text-slate-900"
          }`}
          title="Cas validés et archivés"
        >
          Archivés ({archivedCount})
        </button>
        <button
          id="filter-all-tab"
          onClick={() => setStatusFilter("all")}
          className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
            statusFilter === "all"
              ? "bg-white text-slate-900 shadow-2xs font-extrabold"
              : "hover:text-slate-900"
          }`}
          title="Tous les cas"
        >
          Tous ({scenarios.length})
        </button>
      </div>

      {/* Category Dropdown */}
      <div className="flex items-center gap-2 pt-0.5 shrink-0">
        <ListFilter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          id="category-filter-select"
          aria-label="Filtrer par spécialité médicale"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl py-2 px-2.5 focus:outline-none focus:border-teal-500 cursor-pointer transition-colors"
        >
          <option value="all">Toutes les spécialités ({scenarios.length})</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {getCategoryLabel(cat)} ({scenarios.filter((s) => s.category === cat).length})
            </option>
          ))}
        </select>
      </div>

      {/* Scrollable Scenario Cards */}
      <div className="flex-1 min-h-0 max-h-[380px] lg:max-h-none overflow-y-auto space-y-2.5 pr-1.5 overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
        {filteredScenarios.length === 0 ? (
          <div className="p-6 text-center text-slate-400 space-y-2 my-auto">
            <Search className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold text-slate-600">
              {statusFilter === "archived" ? "Aucun cas n'est archivé pour l'instant" : "Aucun cas ne correspond aux critères"}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredScenarios.map((sc) => {
            const isCompleted = completedScenarioIds.includes(sc.id);
            const isArchived = archivedScenarioIds.includes(sc.id);
            const isCurrent = sc.id === selectedScenarioId;
            const isTargetedByCampaign = activeCampaign && (
              activeCampaign.categoryTarget === "all" || 
              activeCampaign.categoryTarget === sc.category
            );

            return (
              <div
                key={sc.id}
                id={`scenario-card-${sc.id}`}
                onClick={() => onSelectScenario(sc.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3 group relative ${
                  isCurrent
                    ? "bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                    : isTargetedByCampaign
                    ? "bg-amber-50/30 border-amber-200/90 hover:border-amber-400 hover:shadow-xs"
                    : "bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-xs"
                }`}
              >
                {/* Left Icon Avatar Badge */}
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 transition-colors ${
                  isCurrent
                    ? "bg-teal-600 text-white border-teal-700"
                    : isTargetedByCampaign
                    ? "bg-amber-100 border-amber-300 text-amber-900 group-hover:bg-amber-600 group-hover:text-white"
                    : "bg-teal-50 border-teal-200 text-teal-700 group-hover:bg-teal-600 group-hover:text-white"
                }`}>
                  {sc.customer.initials}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {getCategoryLabel(sc.category)}
                      </span>
                      {isTargetedByCampaign && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                          <Target className="w-2.5 h-2.5 text-amber-700" /> Priorité Titulaire
                        </span>
                      )}
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${getDifficultyBadge(sc.difficulty)}`}>
                        {sc.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {isArchived ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded-full shrink-0 border border-slate-300">
                          <Archive className="w-2.5 h-2.5 text-slate-600" /> Archivé
                        </span>
                      ) : isCompleted ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full shrink-0 border border-emerald-300">
                          <Check className="w-2.5 h-2.5 text-emerald-600" /> Validé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full shrink-0">
                          <CircleDot className="w-2 h-2 text-slate-300" /> À faire
                        </span>
                      )}

                      {/* Quick Archive / Dearchive Toggle Button */}
                      {onToggleArchiveScenario && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleArchiveScenario(sc.id);
                          }}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isArchived 
                              ? "text-teal-700 hover:text-teal-900 bg-teal-50" 
                              : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                          title={isArchived ? "Désarchiver ce cas" : "Archiver ce cas"}
                          aria-label={isArchived ? "Désarchiver ce cas" : "Archiver ce cas"}
                        >
                          {isArchived ? (
                            <ArchiveRestore className="w-3.5 h-3.5" />
                          ) : (
                            <Archive className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-1">
                    {sc.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                    {sc.goal}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                    <span className="text-slate-600 font-medium truncate max-w-[130px]">
                      {sc.customer.name} ({sc.customer.age} ans)
                    </span>
                    <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 shrink-0">
                      <Coins className="w-3 h-3 text-emerald-600" />
                      +{sc.netMarginGainDh.toFixed(0)} DH
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
