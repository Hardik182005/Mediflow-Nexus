"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Zap, CreditCard, FileText, ClipboardList, Stethoscope, Upload, X } from "lucide-react";
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

  const handleFileUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setInputs((prev) => prev.map((i) => (i.id === id ? {
      ...i,
      fileBase64: base64,
      fileName: file.name,
      mimeType: file.type,
      content: ""
    } : i)));
    
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setInputs((prev) => prev.map((i) => (i.id === id ? {
      ...i,
      fileBase64: undefined,
      fileName: undefined,
      mimeType: undefined
    } : i)));
  };

  const canGenerate = inputs.some((i) => i.content.trim().length > 10 || i.fileBase64) && !isLoading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-bold text-black">AI Insurance Analyzer</h2>
          <p className="text-[12px] text-black/40 mt-0.5">
            Upload documents or paste clinical data — get a full VOB report instantly.
          </p>
        </div>
        <button
          onClick={addInput}
          disabled={inputs.length >= 4}
          className="btn-secondary flex items-center gap-2 text-xs disabled:opacity-30 border border-black hover:bg-black hover:text-white transition-all font-bold"
        >
          <Plus size={12} /> Add Input
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inputs.map((inp, idx) => (
          <div key={inp.id} className="bg-white border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-black/40 text-[10px] font-bold">#{idx + 1}</span>
                <select
                  value={inp.type}
                  onChange={(e) => updateType(inp.id, e.target.value as VOBInput["type"])}
                  className="bg-white border border-black/[0.1] text-black text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-black/30 cursor-pointer font-medium"
                >
                  {INPUT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="text-black/40">{TYPE_ICONS[inp.type]}</span>
              </div>
              <div className="flex items-center gap-1">
                {!inp.fileBase64 && (
                  <label className="cursor-pointer btn-secondary px-2 py-1 flex items-center gap-1.5 text-[10px] border border-black/10 text-black">
                    <Upload size={10} /> Upload
                    <input 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.png,.jpg,.jpeg,.txt"
                      onChange={(e) => handleFileUpload(inp.id, e)} 
                    />
                  </label>
                )}
                {inputs.length > 1 && (
                  <button onClick={() => removeInput(inp.id)} className="btn-ghost p-1.5 text-black/40 hover:text-black/80">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
            
            {inp.fileBase64 ? (
              <div className="w-full bg-black/[0.02] border border-black/[0.08] rounded-lg p-4 flex flex-col items-center justify-center gap-2 text-center h-[116px]">
                <FileText size={24} className="text-black/40" />
                <div>
                  <p className="text-xs font-bold text-black truncate max-w-[200px]">{inp.fileName}</p>
                  <p className="text-[10px] text-black/40 mt-0.5">Ready for AI Analysis</p>
                </div>
                <button onClick={() => removeFile(inp.id)} className="text-[10px] text-red-500 font-bold hover:underline flex items-center gap-1 mt-1">
                  <X size={10} /> Remove File
                </button>
              </div>
            ) : (
              <textarea
                value={inp.content}
                onChange={(e) => updateContent(inp.id, e.target.value)}
                placeholder={TYPE_PLACEHOLDERS[inp.type]}
                rows={5}
                className="w-full bg-white border border-black rounded-lg p-3 text-xs text-black placeholder:text-black/30 outline-none focus:ring-1 focus:ring-black resize-none font-mono leading-relaxed transition-all"
              />
            )}
            
            {!inp.fileBase64 && (
              <span className="text-[10px] text-black/40 font-medium block">{inp.content.length} chars</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onGenerate(inputs)}
        disabled={!canGenerate}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed bg-black text-white hover:bg-black/90 font-bold shadow-md"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing Documents...
          </>
        ) : (
          <>
            <Zap size={15} />
            Run AI Verification (VOB)
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-black/40 font-medium">
        Powered by Gemini 2.0 Flash · Generates 8-section clinical intelligence report
      </p>
    </div>
  );
}
