import { useState, useMemo } from "react";
import { Medication, UserRole, PharmacyCampaign } from "../types";
import { 
  Search, 
  Pill, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles, 
  Bookmark, 
  Check, 
  Share2, 
  ShieldAlert,
  Copy,
  Package,
  Briefcase,
  Target,
  ShieldCheck,
  Stethoscope,
  Coins,
  X,
  ListFilter,
  Calculator,
  Layers,
  Heart
} from "lucide-react";

interface Props {
  medications: Medication[];
  favoriteIds: string[];
  onToggleFavorite: (medId: string) => void;
  userRole?: UserRole;
  activeCampaign?: PharmacyCampaign;
}

export function MedicationMastery({
  medications,
  favoriteIds = [],
  onToggleFavorite,
  userRole = "employee",
  activeCampaign,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"all" | "favorites" | "highMargin">("all");
  const [selectedMedId, setSelectedMedId] = useState<string>(medications[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"business" | "clinical" | "substitution">("business");
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);

  // Dynamic calculations
  const favoriteCount = favoriteIds.length;
  const avgMarginBoost = useMemo(() => {
    if (!medications.length) return 0;
    const total = medications.reduce((sum, m) => sum + m.companionProduct.marginBoostPct, 0);
    return Math.round(total / medications.length);
  }, [medications]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    medications.forEach((m) => {
      if (m.category) set.add(m.category);
    });
    return Array.from(set);
  }, [medications]);

  // Filtered medications
  const filteredMeds = useMemo(() => {
    return medications.filter((m) => {
      const isFav = favoriteIds.includes(m.id);
      const isHighMargin = m.companionProduct.marginBoostPct >= 35;

      if (filterMode === "favorites" && !isFav) return false;
      if (filterMode === "highMargin" && !isHighMargin) return false;
      if (selectedCategory !== "all" && m.category !== selectedCategory) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchDci = m.dci.toLowerCase().includes(query);
        const matchBrands = m.brandNames.some((b) => b.toLowerCase().includes(query));
        const matchIndication = m.indication.toLowerCase().includes(query);
        const matchCompanion = m.companionProduct.name.toLowerCase().includes(query);
        const matchCategory = m.category.toLowerCase().includes(query);

        return matchDci || matchBrands || matchIndication || matchCompanion || matchCategory;
      }

      return true;
    });
  }, [medications, favoriteIds, filterMode, selectedCategory, searchQuery]);

  const selectedMed = medications.find((m) => m.id === selectedMedId) || filteredMeds[0] || medications[0];

  const handleCopyPitch = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  const isCurrentFav = selectedMed ? favoriteIds.includes(selectedMed.id) : false;

  return (
    <div id="encyclopedia-master-container" className="space-y-5 max-w-7xl mx-auto animate-fade-in pb-8">
      {/* 1. Header Banner & Live Dynamic Metrics */}
      <div 
        id="encyclopedia-top-hero"
        className={`text-white rounded-3xl p-5 sm:p-7 shadow-xl border relative overflow-hidden transition-all ${
          userRole === "admin"
            ? "bg-gradient-to-r from-purple-950 via-slate-900 to-teal-950 border-purple-800/40"
            : "bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 border-teal-800/40"
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-200 text-xs font-bold tracking-wide border border-white/20">
              <Pill className="w-3.5 h-3.5 text-teal-300" />
              <span>RÉPERTOIRE PHARMACOLOGIQUE & VENTE ÉTHIQUE</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
              Encyclopédie des Médicaments & Stratégies Officinales
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Consultez les monographies complètes, sécurisez les posologies et maîtrisez les argumentaires de conseil associé à haute valeur ajoutée.
            </p>
          </div>

          {/* Live Dynamic Metrics Bar */}
          <div className="shrink-0 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15">
            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">Molécules</span>
              <span className="text-lg sm:text-xl font-extrabold text-white">
                {medications.length}
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">Favoris</span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-300">
                {favoriteCount}
              </span>
            </div>

            <div className="w-px h-8 bg-white/20" />

            <div className="text-center px-2">
              <span className="text-[10px] font-bold text-teal-200 uppercase tracking-wider block">Marge Associée</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-300">
                +{avgMarginBoost}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaign Directive Banner */}
      {activeCampaign && (
        <div 
          id="encyclopedia-active-campaign-banner"
          className="p-4 rounded-2xl bg-amber-50/95 border border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-xs animate-fade-in"
        >
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 font-bold">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-extrabold uppercase tracking-wider text-[11px]">
                <span className="text-amber-950">Directive Prioritaire du Titulaire ({activeCampaign.authorName})</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
                  Cible : {activeCampaign.categoryTarget === "all" ? "Toutes spécialités" : activeCampaign.categoryTarget}
                </span>
              </div>
              <p className="text-amber-900 mt-0.5 font-medium leading-relaxed">
                &ldquo;{activeCampaign.directive}&rdquo;
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-[11px] font-bold text-amber-900 self-end sm:self-center shadow-2xs">
            Objectif : {activeCampaign.targetConversionRate}%
          </div>
        </div>
      )}

      {/* 2. Main Responsive Grid */}
      <div className="grid lg:grid-cols-12 gap-5 items-start">
        
        {/* SIDEBAR: Sticky Molecules Catalog with Dynamic Search & Filters */}
        <aside 
          id="encyclopedia-sidebar"
          aria-label="Catalogue des molécules"
          className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6.5rem)] flex flex-col bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5 z-10"
        >
          {/* Header & Molecule Count */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Catalogue ({medications.length})
              </h2>
              <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                {filteredMeds.length} affiché{filteredMeds.length > 1 ? "s" : ""}
              </span>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              Nomenclature PPM
            </span>
          </div>

          {/* Search Box */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-molecule-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher DCI, marque, pathologie..."
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

          {/* Filter Mode Pills (Toutes, Favoris, Forte Marge) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-[11px] font-bold text-slate-600 gap-1 shrink-0">
            <button
              id="filter-all-meds-btn"
              onClick={() => setFilterMode("all")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                filterMode === "all"
                  ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                  : "hover:text-slate-900"
              }`}
            >
              Toutes ({medications.length})
            </button>
            <button
              id="filter-fav-meds-btn"
              onClick={() => setFilterMode("favorites")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                filterMode === "favorites"
                  ? "bg-white text-amber-900 shadow-2xs font-extrabold"
                  : "hover:text-slate-900"
              }`}
            >
              <Bookmark className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Favoris ({favoriteCount})</span>
            </button>
            <button
              id="filter-margin-meds-btn"
              onClick={() => setFilterMode("highMargin")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                filterMode === "highMargin"
                  ? "bg-white text-emerald-900 shadow-2xs font-extrabold"
                  : "hover:text-slate-900"
              }`}
            >
              Marge &gt;35%
            </button>
          </div>

          {/* Specialty Selector Dropdown */}
          <div className="flex items-center gap-2 pt-0.5 shrink-0">
            <ListFilter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="med-category-select"
              aria-label="Filtrer par spécialité médicale"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium rounded-xl py-2 px-2.5 focus:outline-none focus:border-teal-500 cursor-pointer transition-colors"
            >
              <option value="all">Toutes les spécialités ({medications.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat} ({medications.filter((m) => m.category === cat).length})
                </option>
              ))}
            </select>
          </div>

          {/* Scrollable Molecule Cards */}
          <div className="flex-1 min-h-0 max-h-[380px] lg:max-h-none overflow-y-auto space-y-2.5 pr-1.5 overscroll-contain touch-pan-y [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
            {filteredMeds.length === 0 ? (
              <div className="p-6 text-center text-slate-400 space-y-2 my-auto">
                <Search className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">Aucune molécule ne correspond aux critères</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterMode("all");
                    setSelectedCategory("all");
                  }}
                  className="text-[11px] font-bold text-teal-700 hover:underline cursor-pointer"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredMeds.map((med) => {
                const isSelected = selectedMed && med.id === selectedMed.id;
                const isFav = favoriteIds.includes(med.id);

                return (
                  <div
                    key={med.id}
                    id={`med-card-${med.id}`}
                    onClick={() => setSelectedMedId(med.id)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start gap-3 group relative ${
                      isSelected
                        ? "bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                        : "bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-xs"
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? "bg-teal-600 text-white border-teal-700"
                        : "bg-teal-50 border-teal-200 text-teal-700 group-hover:bg-teal-600 group-hover:text-white"
                    }`}>
                      <Pill className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 truncate max-w-[130px]">
                          {med.category}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(med.id);
                          }}
                          className={`p-1 rounded-md transition-colors cursor-pointer ${
                            isFav ? "text-amber-500" : "text-slate-300 hover:text-slate-500"
                          }`}
                          title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                          aria-label={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                        </button>
                      </div>

                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-teal-700 transition-colors line-clamp-1">
                        {med.dci}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-relaxed">
                        {med.brandNames.join(", ")}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100/80 text-[10px]">
                        <span className="text-slate-600 font-medium truncate max-w-[120px] flex items-center gap-1">
                          <Package className="w-3 h-3 text-slate-400 shrink-0" /> {med.form.split("/")[0]}
                        </span>
                        <span className="text-emerald-700 font-extrabold flex items-center gap-0.5 shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          +{med.companionProduct.marginBoostPct}% Marge
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* WORKSPACE: Detailed Monographic Dossier */}
        <main 
          id="encyclopedia-active-workspace"
          aria-label="Fiche monographique détaillée"
          className="lg:col-span-7 xl:col-span-8 bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden"
        >
          {selectedMed ? (
            <div>
              {/* Header Card with Molecule & Tab Navigation */}
              <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/70 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                        Fiche Monographique Officinale
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {selectedMed.category}
                      </span>
                      {selectedMed.form && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-200">
                          {selectedMed.form}
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900">
                      {selectedMed.dci}
                    </h2>
                    <p className="text-xs text-slate-600">
                      Spécialités disponibles : <strong className="text-slate-800">{selectedMed.brandNames.join(" · ")}</strong>
                    </p>
                  </div>

                  {/* Bookmark Button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      id="toggle-fav-header-btn"
                      onClick={() => onToggleFavorite(selectedMed.id)}
                      className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs ${
                        isCurrentFav
                          ? "bg-amber-50 border-amber-300 text-amber-900"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isCurrentFav ? "text-amber-600 fill-amber-500" : "text-slate-400"}`} />
                      <span>{isCurrentFav ? "Dans vos favoris" : "Ajouter aux favoris"}</span>
                    </button>
                  </div>
                </div>

                {/* 3 Tab Navigation Switcher */}
                <div className="flex bg-slate-200/80 p-1 rounded-xl text-xs font-bold text-slate-600 gap-1 overflow-x-auto scrollbar-none">
                  <button
                    id="tab-business-btn"
                    onClick={() => setActiveTab("business")}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      activeTab === "business"
                        ? "bg-white text-emerald-900 shadow-2xs font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Conseil Associé & Marge</span>
                  </button>

                  <button
                    id="tab-clinical-btn"
                    onClick={() => setActiveTab("clinical")}
                    className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                      activeTab === "clinical"
                        ? "bg-white text-teal-900 shadow-2xs font-extrabold"
                        : "hover:text-slate-900"
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Données Cliniques & Posologie</span>
                  </button>

                  {selectedMed.substitutionNote && (
                    <button
                      id="tab-substitution-btn"
                      onClick={() => setActiveTab("substitution")}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 ${
                        activeTab === "substitution"
                          ? "bg-white text-purple-900 shadow-2xs font-extrabold"
                          : "hover:text-slate-900"
                      }`}
                    >
                      <Share2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Protocole de Substitution</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Contents */}
              <div className="p-4 sm:p-6 space-y-5">
                
                {/* TAB 1: CONSEIL ASSOCIÉ & MARGE */}
                {activeTab === "business" && (
                  <div className="space-y-5 animate-fade-in">
                    {/* Hero Companion Banner */}
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white shadow-sm relative overflow-hidden space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                            <TrendingUp className="w-3.5 h-3.5" />
                            PRODUIT CONSEIL ASSOCIÉ SYNERGIQUE
                          </div>
                          <h3 className="text-lg sm:text-2xl font-extrabold text-white">
                            {selectedMed.companionProduct.name}
                          </h3>
                          <p className="text-xs text-emerald-200/90 font-medium">
                            Gamme : {selectedMed.companionProduct.category}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                              Prix Public (PPM)
                            </span>
                            <span className="text-lg sm:text-xl font-black text-white flex items-center justify-end gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-300" />
                              {selectedMed.companionProduct.priceDh.toFixed(2)} DH
                            </span>
                          </div>

                          <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-right">
                            <span className="text-[10px] uppercase font-bold text-emerald-200 block">
                              Marge Officine
                            </span>
                            <span className="text-lg sm:text-xl font-black text-emerald-300">
                              +{selectedMed.companionProduct.marginBoostPct}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/15 grid sm:grid-cols-2 gap-4 text-xs text-emerald-100">
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <strong className="text-white font-bold mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <Target className="w-3.5 h-3.5 text-emerald-400" /> Justification Clinique au Patient :
                          </strong>
                          <p className="leading-relaxed opacity-95">
                            {selectedMed.companionProduct.clinicalJustification}
                          </p>
                        </div>
                        <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                          <strong className="text-white font-bold mb-1 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Bénéfice Santé Concret :
                          </strong>
                          <p className="leading-relaxed opacity-95">
                            {selectedMed.companionProduct.patientBenefit}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Verbal Pitch Script to Say at Counter */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Argumentaire Verbal Prêt à l&apos;Emploi au Comptoir
                        </h4>
                        <button
                          id="copy-pitch-btn"
                          onClick={() => handleCopyPitch(selectedMed.companionProduct.counterPitch)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200"
                        >
                          {copiedPitch ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" /> Phrase copiée !
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier la phrase
                            </>
                          )}
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-white border border-teal-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium shadow-2xs">
                        &ldquo;{selectedMed.companionProduct.counterPitch}&rdquo;
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: CLINICAL DATA & DOSAGE */}
                {activeTab === "clinical" && (
                  <div className="space-y-4 animate-fade-in text-xs sm:text-sm text-slate-700">
                    <div className="grid sm:grid-cols-2 gap-3.5">
                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Indication Thérapeutique Principale
                        </span>
                        <p className="font-semibold text-slate-900 leading-normal text-xs sm:text-sm">
                          {selectedMed.indication}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Posologie Usuelle & Modalités de Prise
                        </span>
                        <p className="font-semibold text-slate-900 leading-normal text-xs sm:text-sm">
                          {selectedMed.commonDosage}
                        </p>
                      </div>
                    </div>

                    {/* Key Side Effects to Prevent */}
                    <div className="p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Effets Indésirables Majeurs à Surveiller & Prévenir au Comptoir
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                        {selectedMed.keySideEffects.map((ef, idx) => (
                          <li key={idx} className="leading-relaxed">{ef}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Absolute Contraindications */}
                    <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-900 uppercase tracking-wider">
                        <ShieldAlert className="w-4 h-4 text-rose-600" />
                        Contre-indications Absolues & Pharmacovigilance
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700 pl-4 list-disc">
                        {selectedMed.contraindications.map((ci, idx) => (
                          <li key={idx} className="leading-relaxed">{ci}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 3: SUBSTITUTION PRINCEPS VERS GÉNÉRIQUE */}
                {activeTab === "substitution" && selectedMed.substitutionNote && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Share2 className="w-4 h-4 text-purple-600" />
                          Protocole de Substitution Officinale (Princeps vers Générique Certifié)
                        </h4>
                        <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                          Marge & Observance
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-0.5">
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Sur l&apos;ordonnance (Princeps)</span>
                          <span className="font-extrabold text-slate-800 text-sm">{selectedMed.substitutionNote.originalDoctorPrescription}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-0.5">
                          <span className="text-[10px] font-bold text-purple-700 block uppercase">Alternative Générique Recommandée</span>
                          <span className="font-extrabold text-purple-900 text-sm">{selectedMed.substitutionNote.recommendedAlternative}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-white rounded-xl border border-purple-100 text-xs text-slate-700 space-y-2">
                        <div>
                          <strong className="text-slate-900">Facteur d&apos;adhésion du patient : </strong>
                          <span className="text-slate-600">{selectedMed.substitutionNote.whyBetterForPatient}</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-100">
                          <strong className="text-slate-900">Impact économique pour l&apos;officine : </strong>
                          <span className="text-emerald-700 font-bold">{selectedMed.substitutionNote.whyBetterForPharmacy}</span>
                        </div>
                      </div>

                      <div className="p-3.5 bg-purple-100/70 rounded-xl text-xs text-purple-950 space-y-1">
                        <span className="font-bold block text-[10px] uppercase text-purple-900 tracking-wider">
                          Dialogue Verbatim Recommandé au Comptoir :
                        </span>
                        <p className="italic font-medium leading-relaxed">
                          &ldquo;{selectedMed.substitutionNote.dialogueScript}&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <Pill className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Sélectionnez une molécule dans le catalogue pour afficher son dossier complet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
