import React, { useState } from 'react';
import { ArrowRight, CheckCircle, RefreshCcw } from 'lucide-react';
import { DESIGN_STYLES } from '../types';

interface QuizQuestion {
  id: string;
  question: string;
  options: { label: string; scoreMapping: Record<string, number> }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "colors",
    question: "Which color palette resonates with your ideal space?",
    options: [
      { label: "Deep, moody walnuts and champagne brass", scoreMapping: { "Luxe Editorial": 3, "Mid-Century Modern": 1 } },
      { label: "Pale, warm neutrals and soft chalk whites", scoreMapping: { "Scandinavian Modern": 3, "Japandi Minimalist": 1 } },
      { label: "Earthy, muted tones with burnt organic accents", scoreMapping: { "Japandi Minimalist": 3, "Mid-Century Modern": 1 } },
      { label: "Warm cognac, rich teak, and saturated blocks of color", scoreMapping: { "Mid-Century Modern": 3, "Luxe Editorial": 1 } },
    ]
  },
  {
    id: "textures",
    question: "What textural elements draw your eye?",
    options: [
      { label: "Structural marble slabs and tailored cashmere", scoreMapping: { "Luxe Editorial": 3 } },
      { label: "Heavy Belgian linens and lime-washed oak", scoreMapping: { "Scandinavian Modern": 3, "Japandi Minimalist": 1 } },
      { label: "Textured sand clay plaster and rice paper", scoreMapping: { "Japandi Minimalist": 3 } },
      { label: "Polished steel frames and leather weave", scoreMapping: { "Mid-Century Modern": 3 } },
    ]
  },
  {
    id: "furniture",
    question: "How do you prefer your furniture silhouettes?",
    options: [
      { label: "Bold, monolithic, and deeply tailored", scoreMapping: { "Luxe Editorial": 3 } },
      { label: "Softly rounded, floating, and minimal", scoreMapping: { "Scandinavian Modern": 3 } },
      { label: "Low to the ground, asymmetric, and imperfect", scoreMapping: { "Japandi Minimalist": 3 } },
      { label: "Tapered legs, geometric, and iconic vintage", scoreMapping: { "Mid-Century Modern": 3 } },
    ]
  },
  {
    id: "atmosphere",
    question: "What is the desired atmosphere for your space?",
    options: [
      { label: "High architectural drama and hospitality-grade sophistication", scoreMapping: { "Luxe Editorial": 3 } },
      { label: "The ultimate realization of soft warmth and light", scoreMapping: { "Scandinavian Modern": 3 } },
      { label: "A meditation on tranquility, deeply grounding", scoreMapping: { "Japandi Minimalist": 3 } },
      { label: "Curated, conversation-starting, and creatively stimulating", scoreMapping: { "Mid-Century Modern": 3 } },
    ]
  },
  {
    id: "clutter",
    question: "What is your stance on decor objects and styling?",
    options: [
      { label: "Highly curated large-scale art and sculptural elements", scoreMapping: { "Luxe Editorial": 2, "Mid-Century Modern": 2 } },
      { label: "A few functional, beautiful items. Everything has its place.", scoreMapping: { "Scandinavian Modern": 2, "Japandi Minimalist": 2 } },
      { label: "Absolute minimalism. Bare, textured surfaces.", scoreMapping: { "Japandi Minimalist": 3 } },
      { label: "Eclectic mixes of vintage finds and books", scoreMapping: { "Mid-Century Modern": 3 } },
    ]
  }
];

export default function StyleQuiz({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const handleOptionSelect = (mapping: Record<string, number>) => {
    const newScores = { ...scores };
    Object.keys(mapping).forEach(style => {
      newScores[style] = (newScores[style] || 0) + mapping[style];
    });
    setScores(newScores);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendations = () => {
    const sortedStyles = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const topStyleName = sortedStyles[0];
    const runnerUpName = sortedStyles[1];

    const topStyle = DESIGN_STYLES.find(s => s.name === topStyleName);
    const runnerUp = DESIGN_STYLES.find(s => s.name === runnerUpName);

    return { topStyle, runnerUp };
  };

  if (isFinished) {
    const { topStyle, runnerUp } = getRecommendations();
    return (
      <div className="bg-white border border-luxury-stone p-8 md:p-12 shadow-sm rounded-xl animate-fade-in text-center max-w-3xl mx-auto">
        <CheckCircle className="w-12 h-12 text-luxury-accent mx-auto mb-6" />
        <h2 className="font-display text-3xl text-luxury-charcoal mb-2 font-medium">Your Aesthetic Profile is Complete</h2>
        <p className="font-sans text-luxury-slate mb-8 max-w-xl mx-auto mt-4">
          Based on your refined preferences regarding texture, geometry, and atmospheric lighting, we have identified your optimal spatial archetypes.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
          <div className="bg-luxury-cream border border-luxury-gold p-6 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-luxury-gold text-white text-[9px] font-mono tracking-widest px-3 py-1 uppercase font-bold">Primary Match</div>
            <h3 className="font-display text-xl text-luxury-charcoal mb-2 mt-4">{topStyle?.name}</h3>
            <p className="text-sm font-sans text-luxury-slate">{topStyle?.desc}</p>
            {topStyle?.sampleImage && <img src={topStyle.sampleImage} alt={topStyle.name} className="w-full h-32 object-cover mt-4 rounded-md" />}
          </div>
          
          <div className="bg-white border border-luxury-stone p-6 rounded-lg">
            <h3 className="font-display text-xl text-luxury-charcoal mb-2">Secondary Affinity: {runnerUp?.name}</h3>
            <p className="text-sm font-sans text-luxury-slate">{runnerUp?.desc}</p>
            {runnerUp?.sampleImage && <img src={runnerUp.sampleImage} alt={runnerUp.name} className="w-full h-32 object-cover mt-4 rounded-md" />}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onComplete}
            className="px-6 py-3 bg-luxury-charcoal text-luxury-cream hover:bg-luxury-black font-mono text-xs uppercase tracking-widest rounded transition-all shadow-sm flex items-center gap-2"
          >
            Enter Spatial Studio
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => { setScores({}); setCurrentStep(0); setIsFinished(false); }}
            className="px-6 py-3 border border-luxury-stone text-luxury-charcoal hover:border-luxury-gold font-mono text-xs uppercase tracking-widest rounded transition-all flex items-center gap-2"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[currentStep];

  return (
    <div className="bg-white border border-luxury-stone rounded-xl shadow-sm overflow-hidden animate-fade-in max-w-2xl mx-auto pt-6">
      <div className="px-8 py-6 text-center border-b border-luxury-stone">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E7C68] font-bold block mb-2">
          Diagnostic Phase {currentStep + 1} / {QUIZ_QUESTIONS.length}
        </span>
        <h2 className="font-display text-2xl text-luxury-charcoal font-medium">
          {currentQ.question}
        </h2>
      </div>
      
      <div className="p-8 bg-luxury-cream space-y-3">
        {currentQ.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleOptionSelect(opt.scoreMapping)}
            className="w-full text-left p-4 rounded-lg bg-white border border-luxury-stone hover:border-luxury-gold hover:-translate-y-0.5 transition-all outline-none focus:ring-1 focus:ring-luxury-gold shadow-sm font-sans text-luxury-charcoal text-sm"
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      <div className="bg-luxury-stone h-1 w-full">
        <div 
          className="h-1 bg-luxury-accent transition-all duration-500 ease-in-out"
          style={{ width: `${((currentStep) / QUIZ_QUESTIONS.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
