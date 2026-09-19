import { useState } from "react";
import { UserProfile, PharmacyCampaign } from "../types";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Target, 
  Check
} from "lucide-react";

interface Props {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  activeCampaign: PharmacyCampaign;
  onUpdateCampaign: (campaign: PharmacyCampaign) => void;
}

export function AdminDashboard({
  currentUser,
  allUsers,
  activeCampaign,
  onUpdateCampaign,
}: Props) {
  const [directiveText, setDirectiveText] = useState<string>(activeCampaign.directive);
  const [targetRate, setTargetRate] = useState<number>(activeCampaign.targetConversionRate);
  const [categoryTarget, setCategoryTarget] = useState<PharmacyCampaign["categoryTarget"]>(activeCampaign.categoryTarget);
  const [isSavedCampaign, setIsSavedCampaign] = useState<boolean>(false);

  const handleSaveCampaign = () => {
    onUpdateCampaign({
      ...activeCampaign,
      directive: directiveText,
      targetConversionRate: targetRate,
      categoryTarget: categoryTarget,
    });
    setIsSavedCampaign(true);
    setTimeout(() => setIsSavedCampaign(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-purple-900/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              <LayoutDashboard className="w-3.5 h-3.5" />
              ESPACE DIRECTION OFFICINALE & AUDIT
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Tableau de Bord Titulaire · {currentUser.pharmacyName}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Supervisez la progression de vos préparateurs, définissez la consigne prioritaire diffusée au comptoir et mesurez le gain de marge brute.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl border border-white/15 shrink-0 text-xs font-semibold">
            <span>Ville : {currentUser.city}</span>
          </div>
        </div>
      </div>

      {/* 4 Core Pharmacy KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Complétion Formation Équipe
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">82%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14% ce mois
            </span>
          </div>
          <p className="text-[11px] text-slate-500">3 collaborateurs actifs cette semaine.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Taux Conseil Associé Réussi
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-teal-700">38.4%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +19.2%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Moyenne avant formation : 18%.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Taux de Substitution Générique
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-700">76%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +11%
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Marge brute laboratoire optimisée.</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Gain Marge Mensuel Estimé
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-700">+4,250 DH</span>
            <span className="text-xs text-slate-500 font-medium">/ préparateur</span>
          </div>
          <p className="text-[11px] text-slate-500">Surcoût formation amorti en 6 jours.</p>
        </div>
      </div>

      {/* Target Product & Campaign Management (Owner Configuration) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Paramétrage de la Consigne Prioritaire du Mois (Titulaire)
              </h2>
              <p className="text-xs text-slate-500">
                Cette consigne sera instantanément visible sur le briefing d&apos;accueil et sur les cas de comptoir correspondants.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-purple-800 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
            Diffusion Active
          </span>
        </div>

        <div className="grid md:grid-cols-12 gap-4 items-end pt-2">
          <div className="md:col-span-6">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Consigne thérapeutique & argumentaire transmis à l&apos;équipe :
            </label>
            <input
              type="text"
              value={directiveText}
              onChange={(e) => setDirectiveText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden bg-slate-50/50"
            />
          </div>

          <div className="md:col-span-3">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Cas de comptoir ciblés :
            </label>
            <select
              value={categoryTarget}
              onChange={(e) => setCategoryTarget(e.target.value as PharmacyCampaign["categoryTarget"])}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-hidden bg-white"
            >
              <option value="antibiotique">Antibiotiques (ex: Amoxicilline)</option>
              <option value="ains_douleur">AINS & Douleur (ex: Ibuprofène)</option>
              <option value="substitution_generique">Substitutions & Statines</option>
              <option value="pediatrie">Urgence Pédiatrique & Fièvre</option>
              <option value="dermocosmetique">Dermo-cosmétique (ex: Curacné)</option>
              <option value="all">Tous les cas de comptoir</option>
            </select>
          </div>

          <div className="md:col-span-1">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Obj. :
            </label>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={targetRate}
                onChange={(e) => setTargetRate(Number(e.target.value))}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 outline-hidden"
              />
              <span className="text-xs font-bold text-slate-500">%</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <button
              onClick={handleSaveCampaign}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isSavedCampaign ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" /> Diffusé !
                </>
              ) : (
                "Diffuser à l'officine"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Team Members Performance Roster */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            <h2 className="text-sm font-extrabold text-slate-900">
              Suivi Individuel de l&apos;Équipe Officinale
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {allUsers.length} profils officinaux
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Collaborateur</th>
                <th className="pb-3">Rôle Officinal</th>
                <th className="pb-3 text-center">Taux de Conformité</th>
                <th className="pb-3 text-center">Cas Pratiques Validés</th>
                <th className="pb-3 text-center">Cas Archivés</th>
                <th className="pb-3 text-right pr-2">Dernière Connexion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {allUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 pl-2 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-700 text-white font-bold text-[11px] flex items-center justify-center">
                      {u.avatar}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[10px] text-slate-400">{u.city}</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      u.role === "admin" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-700"
                    }`}>
                      {u.role === "admin" ? "Titulaire" : "Préparateur"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className="font-bold text-teal-800">{u.complianceScore}%</span>
                    <span className="text-slate-400 block text-[10px]">{u.trainingSessionsCount} sessions</span>
                  </td>
                  <td className="py-3 text-center font-bold text-slate-800">
                    {u.completedScenarios.length}
                  </td>
                  <td className="py-3 text-center font-bold text-slate-500">
                    {u.archivedScenarios?.length || 0}
                  </td>
                  <td className="py-3 text-right pr-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {u.lastActiveDate || "Aujourd'hui"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}
