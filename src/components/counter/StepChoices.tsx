import { SimulationStep, SimulationChoice } from "../../types";
import { 
  MessageSquare, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight 
} from "lucide-react";

interface StepChoicesProps {
  currentStep: SimulationStep;
  currentStepIndex: number;
  totalSteps: number;
  selectedChoiceId: string | null;
  onSelectChoice: (choice: SimulationChoice) => void;
  onNextStep: () => void;
}

export function StepChoices({
  currentStep,
  currentStepIndex,
  totalSteps,
  selectedChoiceId,
  onSelectChoice,
  onNextStep,
}: StepChoicesProps) {
  const chosenChoice = currentStep.choices.find((c) => c.id === selectedChoiceId);

  return (
    <div className="space-y-3.5 pt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-teal-600" />
          Quelle est votre conduite au comptoir ?
        </h3>
        <span className="text-[11px] text-slate-400 font-medium">
          {currentStep.choices.length} options proposées
        </span>
      </div>

      {/* Choices List */}
      <div className="space-y-3">
        {currentStep.choices.map((choice, idx) => {
          const isSelected = selectedChoiceId === choice.id;
          const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C'
          
          let choiceStyle = "bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/20 text-slate-800";
          let letterStyle = "bg-slate-100 text-slate-700 border-slate-300";
          
          if (selectedChoiceId) {
            if (choice.isOptimal) {
              choiceStyle = "bg-emerald-50/90 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs";
              letterStyle = "bg-emerald-600 text-white border-emerald-700";
            } else if (isSelected) {
              choiceStyle = "bg-rose-50 border-rose-400 text-rose-950";
              letterStyle = "bg-rose-600 text-white border-rose-700";
            } else {
              choiceStyle = "opacity-40 bg-slate-50 border-slate-200 text-slate-500 pointer-events-none";
              letterStyle = "bg-slate-200 text-slate-500 border-slate-200";
            }
          }

          return (
            <button
              key={choice.id}
              id={`choice-option-${choice.id}`}
              onClick={() => onSelectChoice(choice)}
              disabled={Boolean(selectedChoiceId)}
              className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed transition-all cursor-pointer ${choiceStyle}`}
            >
              <div className="flex items-start gap-3">
                <span className={`w-6 h-6 rounded-xl border flex items-center justify-center font-extrabold text-xs shrink-0 mt-0.5 transition-colors ${letterStyle}`}>
                  {letter}
                </span>
                
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 leading-relaxed">{choice.text}</p>
                  
                  {selectedChoiceId && choice.isOptimal && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Réflexe Officinal Optimal · Sécurité + Observance</span>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Instant Dynamic Feedback Panel */}
      {chosenChoice && (
        <div 
          id="step-feedback-panel"
          className={`p-4 sm:p-5 rounded-2xl border mt-5 space-y-4 animate-fade-in ${
            chosenChoice.isOptimal 
              ? "bg-emerald-50/90 border-emerald-300 text-emerald-950 shadow-xs" 
              : "bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs"
          }`}
        >
          <div className="flex items-start gap-3">
            {chosenChoice.isOptimal ? (
              <div className="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle className="w-5 h-5 text-emerald-700" />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-700" />
              </div>
            )}
            
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {chosenChoice.isOptimal ? "Pratique Officinale Exemplaire" : "Axe d'Amélioration au Comptoir"}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                  Score : {chosenChoice.clinicalScore}%
                </span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed font-medium">
                {chosenChoice.feedback}
              </p>
            </div>
          </div>

          {/* Behavioral & Deontological Recommendation Box */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Clé de pratique officinale & Déontologie :</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-5 font-normal">
              {chosenChoice.psychologyMechanism}
            </p>
          </div>

          {/* Step Navigation Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">
                {currentStepIndex < totalSteps - 1 
                  ? `Étape ${currentStepIndex + 1} validée sur ${totalSteps} · Choix enregistré` 
                  : `Dernière étape validée · Cas clinique prêt pour le bilan`}
              </span>
            </div>

            <button
              id="next-step-trigger-btn"
              onClick={onNextStep}
              className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 self-stretch sm:self-auto"
            >
              <span>
                {currentStepIndex < totalSteps - 1 
                  ? "Question suivante du patient" 
                  : "Consulter le bilan officinal 360°"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
