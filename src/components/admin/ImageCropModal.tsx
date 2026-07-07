"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImageBlob } from "@/lib/cropImage";

export function ImageCropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  async function handleConfirm() {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo recortar la imagen.");
      setProcessing(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 p-4">
      <div className="w-full max-w-lg bg-cream p-4 md:p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-gold mb-3">
          Ajusta el recorte de la imagen
        </p>

        <div className="relative w-full h-72 md:h-80 bg-ink/10">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={16 / 9}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <label className="block font-mono text-[10px] uppercase tracking-widest text-ink/50 mt-4 mb-1">
          Zoom
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
          className="w-full"
        />

        {error && <p className="font-mono text-xs text-red-700 mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={processing}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-ink/20 hover:border-gold disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing}
            className="font-mono text-xs uppercase tracking-widest px-4 py-2 bg-ink text-cream hover:bg-gold hover:text-ink disabled:opacity-50"
          >
            {processing ? "Procesando…" : "Recortar y usar"}
          </button>
        </div>
      </div>
    </div>
  );
}
