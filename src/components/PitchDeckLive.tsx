import { useState } from "react";
import { 
  Presentation, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Calculator, 
  Brain, 
  Award,
  ChevronRight,
  ChevronLeft,
  ArrowUpRight,
  DollarSign,
  Clock,
  Target,
  HeartHandshake
} from "lucide-react";

export function PitchDeckLive() {
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // ROI Interactive Calculator state
  const [dailyTickets, setDailyTickets] = useState<number>(160);
  const [teamSize, setTeamSize] = useState<number>(4);
  const [conversionRate, setConversionRate] = useState<number>(30); // 30% of tickets get companion product
  const [addonValue, setAddonValue] = useState<number>(35); // Average companion sale price in DH or €

  // Calculations (310 working days/year)
  const annualEligibleTickets = dailyTickets * 310;
  const annualConvertedSales = Math.round(annualEligibleTickets * (conversionRate / 100));
  const annualRevenueGain = annualConvertedSales * addonValue;
  const annualMarginGain = Math.round(annualRevenueGain * 0.42); // 42% average margin on OTC/companion products

  const slides = [
    {
      id: "slide-paradox",
      badge: "CONSTAT ÉCONOMIQUE",
      title: "Le Paradoxe de l'Officine : 70% du volume, 30% de la marge",
      content: (
        <div className="space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
            La délivrance d&apos;ordonnances pures assure le flux, mais les marges réglementées sur les princeps s&apos;érodent chaque année. La survie et la rentabilité de l&apos;officine reposent désormais sur la capacité de votre équipe à conseiller activement.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1 text-center">
              <span className="text-3xl font-black text-rose-700">72%</span>
              <p className="text-xs font-bold text-rose-900">Des tickets sans aucun conseil associé</p>
              <p className="text-[11px] text-rose-600">L&apos;employé délivre la boîte sans proposer la protection synergique indispensable.</p>
            </div>

            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-center">
              <span className="text-3xl font-black text-amber-700">-28%</span>
              <p className="text-xs font-bold text-amber-900">Perte de marge sur les princeps</p>
              <p className="text-[11px] text-amber-600">Quand le client refuse le générique faute d&apos;argumentation médicale rassurante.</p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1 text-center">
              <span className="text-3xl font-black text-emerald-700">+35%</span>
              <p className="text-xs font-bold text-emerald-900">Marge brute moyenne du conseil associé</p>
              <p className="text-[11px] text-emerald-600">Probiotiques, pansements gastriques, micronutrition et dermocosmétique ciblée.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs leading-relaxed flex items-center justify-between gap-4">
            <div>
              <strong className="text-teal-400">Le rôle du Titulaire :</strong> Transformer vos préparateurs de « distributeurs de boîtes passifs » en « conseillers de santé indispensables et rentables ».
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide-psychology",
      badge: "PSYCHOLOGIE COMPORTEMENTALE AU COMPTOIR",
      title: "Vendre sans vendre : La science de l'adhésion patient",
      content: (
        <div className="space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed">
            Les employés hésitent souvent à proposer un produit complémentaire par peur de &ldquo;forcer la vente&rdquo;. Les études en sciences comportementales démontrent qu&apos;un conseil médical bien formulé est au contraire perçu comme une preuve d&apos;attention et de compétence.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                <Brain className="w-4 h-4 text-indigo-600" />
                <span>1. Réciprocité Médicale (Cialdini)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Quand l&apos;employé donne une astuce posologique gratuite (&ldquo;prenez-le 30 min avant le repas&rdquo;), le patient se sent redevable et accepte le conseil associé 4x plus facilement.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>2. Aversion à la Perte (Kahneman)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Ne dites pas : &ldquo;Voulez-vous des probiotiques en plus ?&rdquo; mais : &ldquo;Pour vous éviter les diarrhées et crampes fréquentes sous cet antibiotique...&rdquo; Le cerveau réagit immédiatement au danger évité.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-purple-900">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span>3. Substitution valorisante</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                &ldquo;Le docteur a prescrit la molécule d&apos;origine, nous avons la formule bio-équivalente certifiée qui vous fait économiser 30 DH pour le même résultat.&rdquo; Le patient gagne, l&apos;officine gagne.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide-roi",
      badge: "SIMULATEUR DE RENTABILITÉ EN DIRECT",
      title: "Calculez le gain de marge annuel net pour votre officine",
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-12 gap-6 items-center">
            {/* Sliders (7 cols) */}
            <div className="md:col-span-7 space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Nombre de clients au comptoir / jour</span>
                  <span className="text-teal-700">{dailyTickets} clients</span>
                </div>
                <input
                  type="range"
                  min={50}
                  max={400}
                  step={10}
                  value={dailyTickets}
                  onChange={(e) => setDailyTickets(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Nombre d&apos;employés / préparateurs</span>
                  <span className="text-teal-700">{teamSize} collaborateurs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={12}
                  step={1}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Taux de réussite du conseil associé</span>
                  <span className="text-teal-700">{conversionRate}%</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={60}
                  step={5}
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Prix moyen du produit associé conseillé</span>
                  <span className="text-teal-700">{addonValue} DH / €</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={90}
                  step={5}
                  value={addonValue}
                  onChange={(e) => setAddonValue(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Results card (5 cols) */}
            <div className="md:col-span-5 p-6 rounded-2xl bg-gradient-to-br from-teal-900 to-emerald-950 text-white shadow-lg space-y-4 text-center">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                Impact Financier Annuel Estimé
              </span>

              <div>
                <span className="text-xs text-slate-300 block">Chiffre d&apos;Affaires Additionnel</span>
                <span className="text-2xl sm:text-3xl font-black text-white">
                  +{annualRevenueGain.toLocaleString()} <small className="text-xs font-normal">DH/€</small>
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <span className="text-[11px] text-emerald-300 font-bold block">
                  Marge Brute Nette Supplémentaire
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-300">
                  +{annualMarginGain.toLocaleString()} <small className="text-xs font-normal">DH/€ / an</small>
                </span>
              </div>

              <p className="text-[10px] text-slate-300">
                Basé sur 310 jours d&apos;ouverture et un taux de marge brute de 42% sur le conseil associé.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "slide-delivery",
      badge: "DÉPLOIEMENT SANS CONTRAINTE",
      title: "Pourquoi PharmEd Pro fonctionne là où les formations classiques échouent",
      content: (
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" /> 3 Minutes par Jour (Micro-Learning)
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Pas besoin de bloquer l&apos;équipe le week-end ou de payer des journées de formation externes. Un scénario interactif le matin avant l&apos;ouverture ou pendant les heures creuses.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" /> Zéro Risque & Données Souveraines
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Conformité totale. Aucune ordonnance réelle ni donnée patient n&apos;est transmise. Les simulations utilisent des archétypes cliniques anonymisés.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-900 text-sm flex items-center gap-1.5">
                <Target className="w-4 h-4 text-purple-600" /> Campagnes Mensuelles Titulaire
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Le gérant choisit les produits stratégiques du mois (ex: Probiotiques en hiver, Solaire en été, Générique ciblé) et suit les scores de son équipe en direct.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <strong className="text-slate-900 text-sm flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-600" /> Fierté & Rétention du Personnel
              </strong>
              <p className="text-slate-600 leading-relaxed">
                Vos collaborateurs ne se sentent plus comme de simples caissiers. Ils développent une véritable expertise clinique reconnue par les patients du quartier.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 flex items-center justify-between gap-4">
            <div>
              <h4 className="font-extrabold text-sm text-teal-900">Prêt pour une démonstration en direct au comptoir ?</h4>
              <p className="text-xs text-teal-700">Passez immédiatement au simulateur pour tester un cas patient en situation réelle.</p>
            </div>
            <span className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-bold shrink-0">
              Démo Interactive Active
            </span>
          </div>
        </div>
      ),
    },
  ];

  const currentSlide = slides[activeSlide];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Controls & Slide Tracker */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-xs">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-900 block">Mode Présentation Client Titulaire</span>
            <span className="text-[10px] text-slate-500">Sans PowerPoint ni PDF · 100% Interactif</span>
          </div>
        </div>

        {/* Slide navigation buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSlide((prev) => Math.max(0, prev - 1))}
            disabled={activeSlide === 0}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
            aria-label="Slide précédente"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 px-2">
            {activeSlide + 1} / {slides.length}
          </span>
          <button
            onClick={() => setActiveSlide((prev) => Math.min(slides.length - 1, prev + 1))}
            disabled={activeSlide === slides.length - 1}
            className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
            aria-label="Slide suivante"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Active Slide Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-6 sm:p-8 space-y-6 transition-all">
        <div>
          <span className="text-xs font-bold text-purple-700 uppercase tracking-wider px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
            {currentSlide.badge}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 leading-tight">
            {currentSlide.title}
          </h2>
        </div>

        {/* Slide Body */}
        {currentSlide.content}
      </div>
    </div>
  );
}
