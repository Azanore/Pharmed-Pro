import { useState, useRef, useEffect } from "react";
import { 
  Shield, 
  CheckCircle2, 
  Award, 
  ChevronDown, 
  UserCircle, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  MessageSquareText, 
  LayoutDashboard,
  Home,
  Menu,
  X
} from "lucide-react";
import { UserProfile } from "../types";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  onSwitchUser: (userId: string) => void;
  allUsers: UserProfile[];
  onOpenPrivacyModal: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  currentUser,
  onSwitchUser,
  allUsers,
  onOpenPrivacyModal,
}: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setIsMobileDrawerOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Logo & Brand */}
            <div 
              onClick={() => handleNavClick("welcome")}
              className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
              title="PharmEd Pro - Accueil"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-base shadow-sm shadow-teal-900/15">
                Ph
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base sm:text-lg tracking-tight whitespace-nowrap">PharmEd Pro</span>
                <span className="text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/60 whitespace-nowrap">
                  360°
                </span>
              </div>
            </div>

            {/* Center: Desktop Navigation Bar (Seamless segmented control without layout shifts) */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70 shrink-0">
              <button
                onClick={() => handleNavClick("welcome")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap border ${
                  activeTab === "welcome"
                    ? "bg-white text-teal-900 shadow-2xs border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 border-transparent"
                }`}
              >
                <Home className={`w-3.5 h-3.5 shrink-0 ${activeTab === "welcome" ? "text-teal-700" : "text-slate-500"}`} />
                <span>Accueil</span>
              </button>

              <button
                onClick={() => handleNavClick("scenarios")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap border ${
                  activeTab === "scenarios"
                    ? "bg-white text-teal-900 shadow-2xs border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 border-transparent"
                }`}
              >
                <MessageSquareText className={`w-3.5 h-3.5 shrink-0 ${activeTab === "scenarios" ? "text-teal-700" : "text-slate-500"}`} />
                <span>Comptoir</span>
              </button>

              <button
                onClick={() => handleNavClick("medications")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap border ${
                  activeTab === "medications"
                    ? "bg-white text-teal-900 shadow-2xs border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50 border-transparent"
                }`}
              >
                <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeTab === "medications" ? "text-emerald-700" : "text-slate-500"}`} />
                <span>Encyclopédie DCI</span>
              </button>

              {/* Titulaire Management Tab */}
              {currentUser.role === "admin" && (
                <button
                  onClick={() => handleNavClick("dashboard")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors duration-150 cursor-pointer whitespace-nowrap border ${
                    activeTab === "dashboard"
                      ? "bg-purple-700 text-white shadow-2xs border-purple-800"
                      : "text-purple-800 hover:bg-purple-100/70 border-transparent"
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 shrink-0" />
                  <span>Titulaire</span>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-black ${
                    activeTab === "dashboard" ? "bg-purple-800 text-purple-100" : "bg-purple-200/80 text-purple-900"
                  }`}>
                    Audit
                  </span>
                </button>
              )}
            </nav>

            {/* Right: Security Icon & Profile Switcher */}
            <div className="flex items-center gap-2 shrink-0">
              
              {/* Sovereign & Privacy Discreet Icon Button */}
              <button
                onClick={onOpenPrivacyModal}
                className="hidden sm:flex items-center justify-center w-8 h-8 rounded-xl text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/70 transition-colors duration-150 cursor-pointer shadow-2xs"
                title="Déterminisme 100% Souverain & Conformité RGPD (Cliquez pour détails)"
                aria-label="Sécurité et souveraineté des données"
              >
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>

              {/* Profile Dropdown */}
              <div 
                className="relative" 
                ref={dropdownRef}
              >
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50 transition-colors duration-150 cursor-pointer whitespace-nowrap"
                  title="Changer de profil (Titulaire / Préparateur)"
                  aria-expanded={isDropdownOpen}
                >
                  <div className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg flex items-center justify-center font-bold text-xs text-white shadow-2xs shrink-0 ${
                    currentUser.role === "admin" ? "bg-purple-700" : "bg-teal-700"
                  }`}>
                    {currentUser.avatar}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1 leading-tight">
                      {currentUser.name}
                      {currentUser.role === "admin" ? (
                        <Briefcase className="w-3 h-3 text-purple-600" />
                      ) : (
                        <UserCircle className="w-3 h-3 text-teal-600" />
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium leading-tight">
                      {currentUser.role === "admin" ? "Pharmacien Titulaire" : "Préparatrice / Staff"}
                    </div>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full pt-1.5 w-64 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2">
                      <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Changer de profil
                        </span>
                        <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded">
                          Simulation
                        </span>
                      </div>
                      
                      <div className="space-y-1">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              onSwitchUser(u.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors duration-150 cursor-pointer ${
                              u.id === currentUser.id 
                                ? "bg-teal-50 text-teal-900 font-bold border border-teal-100" 
                                : "hover:bg-slate-50 text-slate-700 border border-transparent"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                              u.role === "admin" ? "bg-purple-700" : "bg-teal-700"
                            }`}>
                              {u.avatar}
                            </div>
                            <div className="truncate text-xs flex-1">
                              <div className="font-semibold text-slate-800">{u.name}</div>
                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                {u.role === "admin" ? (
                                  <>
                                    <Briefcase className="w-2.5 h-2.5 text-purple-600" />
                                    <span>Titulaire / Gérant</span>
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-2.5 h-2.5 text-teal-600" />
                                    <span>Préparateur Officine</span>
                                  </>
                                )}
                              </div>
                            </div>
                            {u.id === currentUser.id && (
                              <div className="w-2 h-2 rounded-full bg-teal-600 shrink-0"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Drawer Trigger Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors duration-150 cursor-pointer"
                aria-label="Ouvrir le menu de navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer Modal - Clean & Focused */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed inset-y-0 right-0 w-[80%] max-w-xs bg-white shadow-2xl flex flex-col z-50 animate-slide-left border-l border-slate-200">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-bold text-sm">
                  Ph
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm leading-tight">PharmEd Pro</div>
                  <div className="text-[10px] text-teal-700 font-semibold">Officine 360°</div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors duration-150 cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Navigation & Compact Profile */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* Compact Active User Profile Bar with quick Switcher */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200/70">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      currentUser.role === "admin" ? "bg-purple-700" : "bg-teal-700"
                    }`}>
                      {currentUser.avatar}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {currentUser.role === "admin" ? "Pharmacien Titulaire" : "Préparatrice / Staff"}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick toggle user */}
                  <button
                    onClick={() => {
                      const nextUser = allUsers.find((u) => u.id !== currentUser.id) || allUsers[0];
                      onSwitchUser(nextUser.id);
                    }}
                    className="text-[10px] font-bold text-teal-800 bg-white hover:bg-teal-50 px-2 py-1 rounded-lg border border-slate-200 transition-colors duration-150 cursor-pointer shrink-0"
                    title="Changer de profil"
                  >
                    Changer
                  </button>
                </div>
              </div>

              {/* Main Navigation List */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                  Navigation
                </div>

                <button
                  onClick={() => handleNavClick("welcome")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer ${
                    activeTab === "welcome"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Home className="w-4 h-4 shrink-0" />
                  <span>Accueil</span>
                </button>

                <button
                  onClick={() => handleNavClick("scenarios")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer ${
                    activeTab === "scenarios"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <MessageSquareText className="w-4 h-4 shrink-0" />
                  <span>Comptoir</span>
                </button>

                <button
                  onClick={() => handleNavClick("medications")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer ${
                    activeTab === "medications"
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <span>Encyclopédie DCI</span>
                </button>

                {currentUser.role === "admin" && (
                  <button
                    onClick={() => handleNavClick("dashboard")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors duration-150 cursor-pointer ${
                      activeTab === "dashboard"
                        ? "bg-purple-700 text-white shadow-xs"
                        : "bg-purple-50 text-purple-900 hover:bg-purple-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      <span>Espace Titulaire</span>
                    </div>
                    <span className="text-[9px] bg-purple-200/80 text-purple-900 px-1.5 py-0.5 rounded font-black">
                      AUDIT
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Discreet Drawer Footer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  onOpenPrivacyModal();
                }}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 hover:text-emerald-700 transition-colors duration-150 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Sécurité & RGPD</span>
              </button>
              <span className="text-[10px] text-slate-400">v2.4 Pro</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


