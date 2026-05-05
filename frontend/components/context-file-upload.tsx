"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, FileText, Film, Music, Image, File, Plus } from "lucide-react";

const ACCEPTED = {
  "application/pdf": [".pdf"],
  "text/plain": [".txt", ".md", ".csv"],
  "image/png": [".png"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
};

const ALL_EXTS = Object.values(ACCEPTED).flat().join(", ");
const MAX_FILE_MB = 20;
const MAX_FILES = 5;

export interface UploadedFile {
  id: string;
  name: string;
  ext: string;
  base64: string;
  label: string;
  sizeKB: number;
  mimeType: string;
}

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
  onChange: (files: UploadedFile[]) => void;
}

export default function ContextFileUpload({ onChange }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify parent on change
  useEffect(() => {
    onChange(files);
  }, [files, onChange]);

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
        newErrors.push(`"${file.name}" format not supported`);
        continue;
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name,
        ext,
        base64,
        label: "Product Document",
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

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          dragging
            ? "border-white/40 bg-white/[0.06]"
            : "border-white/[0.12] bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
        }`}
      >
        <input ref={inputRef} type="file" multiple accept={ALL_EXTS} onChange={onInputChange} className="hidden" />
        <Upload size={20} className={dragging ? "text-white/60" : "text-white/30"} />
        <div className="text-center">
          <p className="text-sm font-medium text-white/80">
            {dragging ? "Drop files here" : "Add Product Context (PDF, Video, etc.)"}
          </p>
          <p className="text-xs text-white/30 mt-0.5">Drag & drop or click to upload</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((e, i) => (
            <p key={i} className="text-xs text-red-400/80 flex items-center px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              {e}
            </p>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {files.map((file) => (
            <div key={file.id} className="p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileIcon ext={file.ext} size={16} />
                <div className="truncate">
                  <p className="text-xs text-white truncate">{file.name}</p>
                  <p className="text-[10px] text-white/40">{formatSize(file.sizeKB)}</p>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="p-1 hover:bg-white/10 rounded">
                <X size={14} className="text-white/40 hover:text-white/80" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
