'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, ImageIcon } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { adminToursApi } from '@/lib/api/admin-tours';
import { ApiError } from '@/lib/api/client';
import type { TourImage } from '@/types/tour';

interface TourImageManagerProps {
  tourId: number;
  images: TourImage[];
  onUpdated: (images: TourImage[]) => void;
}

export default function TourImageManager({ tourId, images, onUpdated }: TourImageManagerProps) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const updated = await adminToursApi.uploadImages(tourId, Array.from(files));
      onUpdated(updated.images);
      toast('success', `${files.length} image${files.length > 1 ? 's' : ''} uploaded`);
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

  const handleDelete = async (mediaId: string) => {
    setDeletingId(mediaId);
    try {
      await adminToursApi.deleteImage(tourId, Number(mediaId));
      onUpdated(images.filter((img) => img.id !== mediaId));
      toast('success', 'Image deleted');
    } catch (err) {
      if (err instanceof ApiError) toast('error', err.errors[0] || 'Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] font-sans">
          Images ({images.length})
        </h3>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
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
            Upload Images
          </Button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border border-dashed border-[var(--line-soft)] py-12 flex flex-col items-center justify-center gap-3">
          <ImageIcon size={40} strokeWidth={1} className="text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-muted)] font-sans">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group border border-[var(--line-soft)] overflow-hidden">
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleDelete(image.id)}
                  disabled={deletingId === image.id}
                  className="p-2 text-white hover:text-red-400 transition-colors"
                >
                  {deletingId === image.id ? <Spinner size="sm" /> : <Trash2 size={18} />}
                </button>
              </div>
              <p className="px-2 py-1.5 text-[10px] text-[var(--text-muted)] font-sans truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
