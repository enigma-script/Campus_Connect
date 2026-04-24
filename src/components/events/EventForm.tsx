import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader as Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { supabase } from '../../lib/supabase';
import type { Event, EventCategory, EventStatus } from '../../lib/database.types';
import { useEffect} from "react";   // add useEffect + useState


interface EventFormData {
  title: string;
  date: string;
  time: string;
  venue: string;
  category: EventCategory;
  description: string;
  poster_url: string;
  status: EventStatus;
}

interface EventFormProps {
  initialData?: Event | null;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

const CATEGORIES: EventCategory[] = ['Technical', 'Cultural', 'Robotics', 'Workshop', 'Seminar', 'Other'];
const STATUSES: EventStatus[] = ['Upcoming', 'Completed'];

const DEFAULT_FORM: EventFormData = {
  title: '',
  date: '',
  time: '09:00 AM',
  venue: '',
  category: 'Technical',
  description: '',
  poster_url: '',
  status: 'Upcoming',
};

export default function EventForm({ initialData, onSubmit, onCancel, submitting }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(
    initialData
      ? {
          title: initialData.title,
          date: initialData.date,
          time: initialData.time,
          venue: initialData.venue,
          category: initialData.category,
          description: initialData.description ?? '',
          poster_url: initialData.poster_url ?? '',
          status: initialData.status,
        }
      : DEFAULT_FORM
  );
  const [errors, setErrors] = useState<Partial<Record<keyof EventFormData, string>>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(form.poster_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EventFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.date) newErrors.date = 'Date is required';
    if (!form.time.trim()) newErrors.time = 'Time is required';
    if (!form.venue.trim()) newErrors.venue = 'Venue is required';
    if (!form.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((e) => ({ ...e, poster_url: 'Image must be under 5MB' }));
      return;
    }

    setUploadingImage(true);
    const fileName = `posters/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    const { data, error } = await supabase.storage
      .from('event-posters')
      .upload(fileName, file);

    if (error) {
      setErrors((e) => ({ ...e, poster_url: 'Upload failed: ' + error.message }));
      setImagePreview(form.poster_url);
    } else {
      const { data: urlData } = supabase.storage.from('event-posters').getPublicUrl(data.path);
      setForm((f) => ({ ...f, poster_url: urlData.publicUrl }));
      setImagePreview(urlData.publicUrl);
      setErrors((e) => { const n = { ...e }; delete n.poster_url; return n; });
    }

    setUploadingImage(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;
  if (role !== "admin") {
    alert("🚫 Only admins can create events");
    return;
  }
  await onSubmit(form);
  };


  const set = (key: keyof EventFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => { const n = { ...err }; delete n[key]; return n; });
  };
  

  const [role, setRole] = useState<string | null>(null);
useEffect(() => {
  async function checkRole() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log("App metadata role:", user.app_metadata.role);
    }
  }
  checkRole();
}, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="title" className="text-sm font-semibold">Event Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          value={form.title}
          onChange={set('title')}
          placeholder="e.g., Annual Tech Hackathon 2025"
          className={errors.title ? 'border-red-400' : ''}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-sm font-semibold">Date <span className="text-red-500">*</span></Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            onChange={set('date')}
            className={errors.date ? 'border-red-400' : ''}
          />
          {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="time" className="text-sm font-semibold">Time <span className="text-red-500">*</span></Label>
          <Input
            id="time"
            value={form.time}
            onChange={set('time')}
            placeholder="e.g., 10:00 AM"
            className={errors.time ? 'border-red-400' : ''}
          />
          {errors.time && <p className="text-xs text-red-500">{errors.time}</p>}
        </div>
      </div>

      {/* Venue */}
      <div className="space-y-1.5">
        <Label htmlFor="venue" className="text-sm font-semibold">Venue <span className="text-red-500">*</span></Label>
        <Input
          id="venue"
          value={form.venue}
          onChange={set('venue')}
          placeholder="e.g., Main Auditorium, Block A"
          className={errors.venue ? 'border-red-400' : ''}
        />
        {errors.venue && <p className="text-xs text-red-500">{errors.venue}</p>}
      </div>

      {/* Category & Status */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Category <span className="text-red-500">*</span></Label>
          <Select
            value={form.category}
            onValueChange={(val) => setForm((f) => ({ ...f, category: val as EventCategory }))}
          >
            <SelectTrigger className={errors.category ? 'border-red-400' : ''}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm font-semibold">Status</Label>
          <Select
            value={form.status}
            onValueChange={(val) => setForm((f) => ({ ...f, status: val as EventStatus }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={set('description')}
          placeholder="Describe the event, what participants can expect, prizes, etc."
          rows={4}
          className="resize-none"
        />
      </div>

      {/* Poster Upload */}
      <div className="space-y-1.5">
        <Label className="text-sm font-semibold">Event Poster</Label>
        <div
          className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-colors ${
            uploadingImage ? 'border-blue-300 bg-blue-50' : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
          } cursor-pointer`}
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover"
                onError={() => setImagePreview('')}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="text-white text-center">
                  <Upload className="w-6 h-6 mx-auto mb-1" />
                  <p className="text-sm font-medium">Click to change</p>
                </div>
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview('');
                  setForm((f) => ({ ...f, poster_url: '' }));
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-slate-400">
              {uploadingImage ? (
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              ) : (
                <ImageIcon className="w-10 h-10 mb-2 text-slate-300" />
              )}
              <p className="text-sm font-medium text-slate-500">
                {uploadingImage ? 'Uploading...' : 'Click to upload poster'}
              </p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
        </div>
        {errors.poster_url && <p className="text-xs text-red-500">{errors.poster_url}</p>}

        {/* URL input as alternative */}
        <Input
          placeholder="Or paste an image URL here"
          value={form.poster_url}
          onChange={(e) => {
            setForm((f) => ({ ...f, poster_url: e.target.value }));
            setImagePreview(e.target.value);
          }}
          className="text-sm"
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || uploadingImage}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
        >
          {submitting ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
          ) : (
            initialData ? 'Update Event' : 'Create Event'
          )}
        </Button>
      </div>
    </form>
  );
}
