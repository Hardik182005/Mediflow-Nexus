"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText, Film, Music, Image, File, Zap, Plus } from "lucide-react";

// ── Supported types & limits ─────────────────────────────────
const ACCEPTED = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt", ".md", ".csv"],
  "text/html": [".html"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
  "audio/mp3": [".mp3"],
  "audio/wav": [".wav"],
};

const ALL_EXTS = Object.values(ACCEPTED).flat().join(", ");
const MAX_FILE_MB = 20;
const MAX_FILES = 8;

export interface UploadedFile {
  id: string;
  name: string;
  ext: string;
  base64: string;
  label: string;
  sizeKB: number;
  mimeType: string;
}

const FILE_LABELS: Record<string, string> = {
  pdf: "Pitch Deck / Document",
  ppt: "Presentation",
  pptx: "Presentation",
  mp4: "Demo Video",
  mov: "Demo Video",
  webm: "Demo Video",
  mp3: "Audio",
  wav: "Audio",
  png: "Image / Slide",
  jpg: "Image / Slide",
  jpeg: "Image / Slide",
  webp: "Image / Slide",
  txt: "Text Document",
  md: "Text Document",
  csv: "Data File",
  html: "Web Content",
};

function FileIcon({ ext, size = 18 }: { ext: string; size?: number }) {
  const cls = "flex-shrink-0";
  if (["mp4", "mov", "webm", "avi"].includes(ext)) return <Film size={size} className={cls} />;
  if (["mp3", "wav", "ogg", "aac"].includes(ext)) return <Music size={size} className={cls} />;
  if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) return <Image size={size} className={cls} />;
  if (["pdf", "txt", "md", "csv", "html"].includes(ext)) return <FileText size={size} className={cls} />;
  return <File size={size} className={cls} />;
}

function formatSize(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}

interface Props {
  onGenerate: (files: UploadedFile[], textContext: string) => void;
  isLoading: boolean;
}

export default function GTMFileUpload({ onGenerate, isLoading }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [textContext, setTextContext] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (incoming: File[]) => {
    const newErrors: string[] = [];
    const newFiles: UploadedFile[] = [];

    for (const file of incoming) {
      if (files.length + newFiles.length >= MAX_FILES) {
        newErrors.push(`Max ${MAX_FILES} files allowed`);
        break;
      }

      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > MAX_FILE_MB) {
        newErrors.push(`"${file.name}" exceeds ${MAX_FILE_MB} MB limit`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const supportedExts = Object.values(ACCEPTED).flat().map((e) => e.replace(".", ""));
      if (!supportedExts.includes(ext)) {
        newErrors.push(`"${file.name}" — format .${ext} not supported`);
        continue;
      }

      // Read as base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Strip data URL prefix — keep only the base64 payload
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        ext,
        base64,
        label: FILE_LABELS[ext] ?? "Document",
        sizeKB: Math.round(file.size / 1024),
        mimeType: file.type,
      });
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setErrors(newErrors);
  }, [files.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, [processFiles]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const updateLabel = (id: string, label: string) => {
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, label } : f)));
  };

  const canGenerate = (files.length > 0 || textContext.trim().length > 10) && !isLoading;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-[20px] font-bold text-white tracking-tight">GTM Intelligence Engine</h1>
        <p className="text-[13px] text-white/40 mt-1">
          Upload your startup docs — pitch deck, product PDF, demo video, brochure — and get a full AI GTM strategy.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
          dragging
            ? "border-white/40 bg-white/[0.06]"
            : "border-white/[0.12] bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ALL_EXTS}
          onChange={onInputChange}
          className="hidden"
        />
        <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all ${dragging ? "bg-white/10 border-white/30" : "bg-white/[0.04] border-white/[0.1]"}`}>
          <Upload size={24} className="text-white/60" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-white">
            {dragging ? "Drop files here" : "Drag & drop or click to upload"}
          </p>
          <p className="text-xs text-white/30 mt-1">
            PDF · PPT (as PDF) · MP4 · MOV · MP3 · PNG · JPG · TXT · CSV
          </p>
          <p className="text-[11px] text-white/20 mt-1">Up to {MAX_FILES} files · Max {MAX_FILE_MB} MB each</p>
        </div>
        {files.length < MAX_FILES && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/30">
            <Plus size={11} /> Add files
          </div>
        )}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-white/40 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08]">
              ⚠ {e}
            </p>
          ))}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold">{files.length} file{files.length !== 1 ? "s" : ""} ready</p>
          {files.map((file) => (
            <div key={file.id} className="glass-card p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/50">
                <FileIcon ext={file.ext} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{file.name}</p>
                <p className="text-[11px] text-white/30">{formatSize(file.sizeKB)}</p>
              </div>
              {/* Editable label */}
              <select
                value={file.label}
                onChange={(e) => updateLabel(file.id, e.target.value)}
                className="bg-white/[0.04] border border-white/[0.08] text-white/60 text-[11px] rounded-lg px-2 py-1.5 outline-none focus:border-white/20 cursor-pointer"
              >
                {["Pitch Deck", "Product Document", "Website Content", "Brochure", "Demo Video", "Video Transcript", "Audio Recording", "Image / Slide", "Text Document", "Data File"].map((l) => (
                  <option key={l} value={l} className="bg-black">{l}</option>
                ))}
              </select>
              <button onClick={() => removeFile(file.id)} className="btn-ghost p-1.5 text-white/20 hover:text-white/60">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Optional text context */}
      <div className="space-y-2">
        <p className="text-[11px] text-white/20 uppercase tracking-wider font-bold">Additional Context (optional)</p>
        <textarea
          value={textContext}
          onChange={(e) => setTextContext(e.target.value)}
          placeholder="Any extra context — company name, target market, specific CPT codes, pricing info, etc."
          rows={3}
          className="w-full bg-black/40 border border-white/[0.08] rounded-xl p-3 text-sm text-white/60 placeholder:text-white/20 outline-none focus:border-white/20 resize-none transition-colors"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={() => onGenerate(files, textContext)}
        disabled={!canGenerate}
        className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            Analyzing documents with Gemini AI...
          </>
        ) : (
          <>
            <Zap size={16} />
            Generate GTM Strategy
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-white/20">
        <span>✦ PDF · Video · Audio · Images</span>
        <span>✦ Gemini 1.5 Pro multimodal</span>
        <span>✦ 11-section output</span>
      </div>
    </div>
  );
}
