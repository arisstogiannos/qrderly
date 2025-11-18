import { Plus, X } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ImageUploaderProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  t: (key: string) => string;
}

export function ImageUploader({ images, onImagesChange, t }: ImageUploaderProps) {
  const [fileType, setFileType] = React.useState<'image' | 'pdf'>('image');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 15) {
      toast.error(t('menu.images.max'));
      return;
    }
    onImagesChange([...images, ...files].slice(0, 15));
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  const getAcceptedFileTypes = () => {
    return fileType === 'image' ? 'image/*' : '.pdf';
  };

  const handleTypeChange = (value: 'image' | 'pdf') => {
    onImagesChange([]);
    setFileType(value);
  };

  const renderFilePreview = (file: File, index: number) => {
    if (fileType === 'image') {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={`Uploaded ${index + 1}`}
          className="w-full h-full object-cover"
        />
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center bg-accent/20">
        <span className="text-sm font-medium">PDF</span>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between ">
        <div className="space-y-1">
          <Label className="text-sm font-medium">{t('menu.label')}</Label>
          <p className="text-sm text-foreground/80 text-pretty pr-10">{t('menu.desc')}</p>
        </div>
        <Select value={fileType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-[120px] bg-accent/30 border-none">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="image">{t('menu.images.label')}</SelectItem>
            <SelectItem value="pdf">{t('menu.pdf.label')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div
            key={`${image.name}-${index}`}
            className="relative w-24 h-24 rounded-lg overflow-hidden bg-accent/30"
          >
            {renderFilePreview(image, index)}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 p-1 rounded-full bg-destructive/80 hover:bg-destructive text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < 15 && (
          <label className="w-24 h-24 rounded-lg bg-accent/30 border-2 border-dashed border-foreground/20 flex items-center justify-center cursor-pointer hover:bg-accent/40 transition-colors">
            <input
              type="file"
              accept={getAcceptedFileTypes()}
              multiple={fileType === 'image'}
              className="hidden"
              onChange={handleImageUpload}
            />
            <Plus className="h-8 w-8 text-foreground/60" />
          </label>
        )}
      </div>
      <p className="text-sm text-foreground/60">
        {fileType === 'image' ? t('menu.images.description') : t('menu.pdf.description')}
      </p>
    </div>
  );
}
