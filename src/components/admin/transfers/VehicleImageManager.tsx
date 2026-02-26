'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminTransfersApi } from '@/lib/api/admin-transfers';
import { ApiError } from '@/lib/api/client';
import type { AdminTransferVehicle } from '@/types/transfer';

interface VehicleImageManagerProps {
  vehicle: AdminTransferVehicle;
  onUpdated: (vehicle: AdminTransferVehicle) => void;
}

export default function VehicleImageManager({ vehicle, onUpdated }: VehicleImageManagerProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const updated = await adminTransfersApi.uploadVehicleImage(vehicle.id, files[0]);
      onUpdated(updated);
      toast('success', 'Image uploaded');
    } catch (err) {
      if (err instanceof ApiError) {
        toast('error', err.errors[0] || 'Upload failed');
      } else if (err instanceof Error) {
        toast('error', err.message);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminTransfersApi.deleteVehicleImage(vehicle.id);
      onUpdated({ ...vehicle, image: null, image_url: null });
      toast('success', 'Image deleted');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
          Vehicle Image
        </h3>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <Button
            size="sm"
            variant="outline"
            icon={uploading ? undefined : <Upload size={14} />}
            loading={uploading}
            onClick={() => fileRef.current?.click()}
          >
            Upload Image
          </Button>
        </div>
      </div>

      {vehicle.image_url ? (
        <div className="relative group border border-[var(--line-soft)] overflow-hidden inline-block">
          <img
            src={vehicle.image_url}
            alt={vehicle.translated_name}
            className="max-w-sm h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-white hover:text-red-400 transition-colors"
            >
              {deleting ? <Spinner size="sm" /> : <Trash2 size={18} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-[var(--line-soft)] py-12 flex flex-col items-center justify-center gap-3">
          <ImageIcon size={40} strokeWidth={1} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)] font-sans">No image uploaded yet</p>
        </div>
      )}
    </div>
  );
}
