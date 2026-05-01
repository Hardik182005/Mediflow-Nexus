"use client";

import { useState } from "react";
import { Plus, Trash2, Zap, CreditCard, FileText, ClipboardList, Stethoscope } from "lucide-react";
import type { VOBInput } from "@/types/vob";

const INPUT_TYPES: VOBInput["type"][] = [
  "Insurance Card", "Benefits PDF", "Manual Form", "Clinical Context",
];

const TYPE_ICONS: Record<VOBInput["type"], React.ReactNode> = {
  "Insurance Card": <CreditCard size={14} />,
  "Benefits PDF": <FileText size={14} />,
  "Manual Form": <ClipboardList size={14} />,
  "Clinical Context": <Stethoscope size={14} />,
};

const TYPE_PLACEHOLDERS: Record<VOBInput["type"], string> = {
  "Insurance Card": "Paste OCR text from the insurance card...\ne.g. Member ID: XYZ123456, Group: 87654, Aetna PPO, Effective: 01/01/2025",
  "Benefits PDF": "Paste benefits / eligibility document text...\ne.g. Deductible: $2,500 (met: $800), Copay: $40, OOP Max: $7,500, Coinsurance: 20%",
  "Manual Form": "Enter patient and insurance details...\ne.g. Patient: John Smith, DOB: 04/15/1982, Payer: UnitedHealthcare, Plan: Choice Plus PPO",
  "Clinical Context": "Enter clinical details...\ne.g. CPT: 99215, 93000 | Diagnosis: I10, E11.9 | Service: Cardiology Office Visit",
};

interface Props {
  onGenerate: (inputs: VOBInput[]) => void;
  isLoading: boolean;
}

export default function VOBInputPanel({ onGenerate, isLoading }: Props) {
  const [inputs, setInputs] = useState<VOBInput[]>([
    { id: "1", type: "Insurance Card", content: "" },
    { id: "2", type: "Clinical Context", content: "" },
  ]);

  const addInput = () => {
    if (inputs.length >= 4) return;
    const usedTypes = inputs.map((i) => i.type);
    const nextType = INPUT_TYPES.find((t) => !usedTypes.includes(t)) || "Manual Form";
    setInputs((prev) => [...prev, { id: Date.now().toString(), type: nextType, content: "" }]);
  };

  const removeInput = (id: string) => {
    setInputs((prev) => prev.filter((i) => i.id !== id));
  };

  const updateType = (id: string, type: VOBInput["type"]) => {
    setInputs((prev) => prev.map((i) => (i.id === id ? { ...i, type } : i)));
  };

  const updateContent = (id: string, content: string) => {
    setInputs((prev) => prev.map((i) => (i.id === id ? { ...i, content } : i)));
  };

  const canGenerate = inputs.some((i) => i.content.trim().length > 10) && !isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-white">AI Insurance Analyzer</h2>
          <p className="text-[12px] text-white/40 mt-0.5">
            Paste insurance card, benefits, or clinical data — get a full VOB report instantly.
          </p>
        </div>
        <button
          onClick={addInput}
          disabled={inputs.length >= 4}
          className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-30"
        >
          <Plus size={12} /> Add Input
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inputs.map((inp, idx) => (
          <div key={inp.id} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-white/20 text-[10px] font-bold">#{idx + 1}</span>
                <select
                  value={inp.type}
                  onChange={(e) => updateType(inp.id, e.target.value as VOBInput["type"])}
                  className="bg-white/[0.06] border border-white/[0.1] text-white text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-white/30 cursor-pointer"
                >
                  {INPUT_TYPES.map((t) => (
                    <option key={t} value={t} className="bg-black">{t}</option>
                  ))}
                </select>
                <span className="text-white/30">{TYPE_ICONS[inp.type]}</span>
              </div>
              {inputs.length > 1 && (
                <button onClick={() => removeInput(inp.id)} className="btn-ghost p-1.5 text-white/20 hover:text-white/60">
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <textarea
              value={inp.content}
              onChange={(e) => updateContent(inp.id, e.target.value)}
              placeholder={TYPE_PLACEHOLDERS[inp.type]}
              rows={5}
              className="w-full bg-black/40 border border-white/[0.08] rounded-lg p-3 text-xs text-white/70 placeholder:text-white/20 outline-none focus:border-white/20 resize-none font-mono leading-relaxed transition-colors"
            />
            <span className="text-[10px] text-white/20">{inp.content.length} chars</span>
          </div>
        ))}
      </div>

      <button
        onClick={() => onGenerate(inputs)}
        disabled={!canGenerate}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing Insurance Data...
          </>
        ) : (
          <>
            <Zap size={15} />
            Run AI Verification (VOB)
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-white/20">
        Powered by Gemini 1.5 Pro · Generates 8-section clinical intelligence report
      </p>
    </div>
  );
}
