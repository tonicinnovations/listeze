// v1.10 — Photo upload with AI feature extraction
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  onFeaturesExtracted: (features: string) => void;
}

export function PhotoUpload({ onFeaturesExtracted }: PhotoUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const accepted = Array.from(newFiles).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );

    if (files.length + accepted.length > 8) {
      toast.error("Maximum 8 photos allowed");
      return;
    }

    const newPreviews = accepted.map((f) => URL.createObjectURL(f));
    setFiles((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExtract = async () => {
    if (files.length === 0) return;
    setIsExtracting(true);

    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("photos", f));

      const res = await fetch("/api/extract-features", {
        method: "POST",
        body: formData,
      });

      if (res.status === 402) {
        const data = await res.json();
        toast.error(data.message);
        if (data.upgradeUrl) window.location.href = data.upgradeUrl;
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Extraction failed");
      }

      const data = await res.json();
      if (data.features && data.features.length > 0) {
        onFeaturesExtracted(data.features.join(", "));
        toast.success(`Extracted ${data.features.length} features from photos`);
      } else {
        toast.error("No features detected in photos");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Extraction failed");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <Card className="p-4 border border-dashed border-border bg-muted/50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Camera className="w-4 h-4" />
          Photo Feature Extraction
        </div>
        {files.length > 0 && (
          <span className="text-xs text-muted-foreground">{files.length}/8 photos</span>
        )}
      </div>

      {/* Drop zone / file input */}
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {files.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors"
        >
          <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drop listing photos or click to upload
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, or WebP — up to 8 photos
          </p>
        </button>
      ) : (
        <>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {files.length < 8 && (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-blue-400 transition-colors"
              >
                <Camera className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Extract button */}
          <Button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
          >
            {isExtracting ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" />Analyzing photos...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Extract Features from Photos</>
            )}
          </Button>
        </>
      )}
    </Card>
  );
}
