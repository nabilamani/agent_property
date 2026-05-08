"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Loader2, Filter, ChevronDown, MoreHorizontal, ImagePlus, X, Star, AlertTriangle, ChevronLeft, ChevronRight, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency, cn } from "@/lib/utils";
import { toast } from "sonner";
import { createProperty, updateProperty, deleteProperty, deletePropertyImage, toggleFeaturedProperty } from "@/app/actions/properties";
import { compressImage } from "@/lib/image-compression";

interface PropertyRow {
  id: string;
  title: string;
  address: string;
  type: string;
  price: number;
  is_active?: boolean;
  is_sold?: boolean;
  is_featured?: boolean;
  agent_whatsapp?: string;
  property_images?: { id: string, image_url: string }[];
  images?: string[];
  land_area?: number;
  building_area?: number;
  condition?: string;
  map_url?: string;
  description?: string;
  owner_whatsapp?: string;
}

function PropertyForm({ 
  defaultValues, 
  formError, 
  fieldErrors = {},
  orderedImages = [], 
  onMoveExistingImage,
  onMoveNewImage,
  existingImages, 
  handleDeleteImage, 
  deletingImage, 
  previewUrls, 
  removeNewImage, 
  compressing, 
  handleFileChange,
  editingProperty,
  agentPhone
}: { 
  defaultValues?: any,
  formError: string | null,
  fieldErrors?: Record<string, string>,
  orderedImages?: any[],
  onMoveExistingImage: (index: number, direction: 'left' | 'right') => void,
  onMoveNewImage: (index: number, direction: 'left' | 'right') => void,
  existingImages: any[],
  handleDeleteImage: (id: string, url: string) => void,
  deletingImage: string | null,
  previewUrls: string[],
  removeNewImage: (index: number) => void,
  compressing: boolean,
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  editingProperty: any | null,
  agentPhone: string
}) {
  return (
    <div className="space-y-8">
      {formError && (
        <div className="p-4 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl font-medium animate-in fade-in slide-in-from-top-2">
          {formError}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="title" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Judul Properti *</Label>
          <Input 
            id="title" 
            name="title" 
            placeholder="Contoh: Rumah Minimalis Modern di Pusat Kota"
            defaultValue={defaultValues?.title} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
            required 
          />
          {fieldErrors.title && <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.title}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Harga (IDR) *</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            placeholder="Masukkan nominal harga"
            defaultValue={defaultValues?.price} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
            required 
          />
          {fieldErrors.price && <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.price}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="type" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Tipe Properti *</Label>
          <select
            id="type"
            name="type"
            defaultValue={defaultValues?.type || "Rumah"}
            className="flex h-12 w-full rounded-2xl bg-muted/20 border-1 px-3 py-1 text-sm font-sans font-bold transition-all focus:ring-4 focus:ring-primary/10 outline-none focus:bg-background"
            required
          >
            <option value="Rumah">Rumah</option>
            <option value="Tanah">Tanah</option>
            <option value="Kavling">Kavling</option>
            <option value="Cluster">Cluster</option>
            <option value="Apartemen">Apartemen</option>
          </select>
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Alamat Lengkap *</Label>
          <Input 
            id="address" 
            name="address" 
            placeholder="Nama jalan, nomor, RT/RW, Kecamatan, Kota"
            defaultValue={defaultValues?.address} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
            required 
          />
          {fieldErrors.address && <p className="text-[10px] text-destructive font-bold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1">{fieldErrors.address}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="land_area" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Luas Tanah (m²)</Label>
          <Input 
            id="land_area" 
            name="land_area" 
            type="number" 
            placeholder="0"
            defaultValue={defaultValues?.land_area || 0} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="building_area" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Luas Bangunan (m²)</Label>
          <Input 
            id="building_area" 
            name="building_area" 
            type="number" 
            placeholder="0"
            defaultValue={defaultValues?.building_area || 0} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Kondisi Unit</Label>
          <select
            id="condition"
            name="condition"
            defaultValue={defaultValues?.condition || "Baru"}
            className="flex h-12 w-full rounded-2xl bg-muted/20 border-1 px-3 py-1 text-sm font-sans font-bold transition-all focus:ring-4 focus:ring-primary/10 outline-none focus:bg-background"
          >
            <option value="Baru">Baru</option>
            <option value="Bekas">Bekas</option>
            <option value="Indent">Indent</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="is_active" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Status Listing</Label>
          <select
            id="is_active"
            name="is_active"
            defaultValue={String(defaultValues?.is_active !== false)}
            className={cn(
              "flex h-11 w-full rounded-xl border px-3 py-1 text-sm font-sans font-bold transition-all focus:ring-4 focus:ring-primary/10 outline-none",
              (defaultValues?.is_active !== false) ? "bg-emerald-50/50 border-emerald-200 text-emerald-700" : "bg-muted/50 border-border"
            )}
          >
            <option value="true">Aktif (Tampil di Web)</option>
            <option value="false">Nonaktif (Sembunyikan)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="is_sold" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Status Penjualan</Label>
          <select
            id="is_sold"
            name="is_sold"
            defaultValue={String(defaultValues?.is_sold === true)}
            className={cn(
              "flex h-11 w-full rounded-xl border px-3 py-1 text-sm font-sans font-bold transition-all focus:ring-4 focus:ring-primary/10 outline-none",
              (defaultValues?.is_sold === true) ? "bg-rose-50/50 border-rose-200 text-rose-700" : "bg-emerald-50/50 border-emerald-200 text-emerald-700"
            )}
          >
            <option value="false">Tersedia</option>
            <option value="true">Terjual</option>
          </select>
        </div>
        <div className="space-y-2 opacity-60">
          <Label htmlFor="agent_whatsapp" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">WA Agent (Otomatis dari Profil)</Label>
          <Input 
            id="agent_whatsapp" 
            name="agent_whatsapp" 
            value={editingProperty ? editingProperty.agent_whatsapp : agentPhone} 
            readOnly
            className="h-12 rounded-2xl bg-muted/40 border-1 cursor-not-allowed font-bold" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner_whatsapp" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">WA Owner (Opsional)</Label>
          <Input 
            id="owner_whatsapp" 
            name="owner_whatsapp" 
            placeholder="Contoh: 6281234567890"
            defaultValue={defaultValues?.owner_whatsapp || ""} 
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90" 
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="map_url" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Google Maps Embed URL</Label>
          <Input 
            id="map_url" 
            name="map_url" 
            defaultValue={defaultValues?.map_url || ""} 
            placeholder="Paste kode <iframe> atau URL maps di sini"
            className="h-12 rounded-2xl bg-muted/20 border-1 focus:bg-background transition-all placeholder:text-muted-foreground/90"
          />
        </div>
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="description" className="text-[11px] font-black uppercase tracking-[0.1em] text-muted-foreground/70 ml-1">Deskripsi Properti</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="Tuliskan detail menarik tentang properti ini (misal: bebas banjir, dekat tol, AC gratis, dll)"
            defaultValue={defaultValues?.description || ""} 
            className="min-h-[150px] rounded-3xl bg-muted/20 border-1 focus:bg-background transition-all p-4 placeholder:text-muted-foreground/60" 
          />
        </div>

        <div className="md:col-span-2 space-y-6 pt-4 border-t">
          <Label className="text-sm font-black uppercase tracking-[0.15em] text-primary">Manajemen Media & Gambar</Label>
          
          {/* Existing Images */}
          {orderedImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-muted/20 rounded-3xl border border-border/40">
              {orderedImages.map((img: any, index: number) => (
                <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-border/40 shadow-sm bg-white animate-in fade-in">
                  <Image src={img.image_url} alt="Property" fill className="object-cover" />
                  
                  {/* Badge for Main Image */}
                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-primary text-[8px] font-black uppercase text-white rounded-lg shadow-lg z-10">
                      Sampul
                    </div>
                  )}

                  {/* Reorder Controls */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30"
                      onClick={() => onMoveExistingImage(index, 'left')}
                      disabled={index === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30"
                      onClick={() => onMoveExistingImage(index, 'right')}
                      disabled={index === orderedImages.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.image_url)}
                    disabled={deletingImage === img.id}
                    className="absolute top-2 right-2 h-7 w-7 bg-destructive/90 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 shadow-lg"
                  >
                    {deletingImage === img.id ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Images for Upload */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {orderedImages.length > 0 ? "Tambah Gambar Baru" : "Upload Gambar"}
            </Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {previewUrls.map((url, index) => (
                <div key={url} className="relative aspect-square rounded-2xl overflow-hidden group border-2 border-primary/20 shadow-sm animate-in zoom-in">
                  <Image src={url} alt="Preview" fill className="object-cover" />
                  
                  {/* Reorder Controls */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center gap-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30"
                      onClick={() => onMoveNewImage(index, 'left')}
                      disabled={index === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 rounded-lg bg-white/20 text-white hover:bg-white/40 disabled:opacity-30"
                      onClick={() => onMoveNewImage(index, 'right')}
                      disabled={index === previewUrls.length - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 h-7 w-7 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <label 
                className={cn(
                  "relative aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group",
                  compressing && "opacity-50 cursor-not-allowed pointer-events-none"
                )}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={compressing}
                />
                {compressing ? (
                  <>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    </div>
                    <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-wider">Memproses...</span>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform">
                      <ImagePlus className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Tambah</span>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyTable({ properties, agentPhone }: { properties: PropertyRow[], agentPhone: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyRow | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [compressing, setCompressing] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [orderedImages, setOrderedImages] = useState<any[]>([]);

  // Update orderedImages when editingProperty changes
  useEffect(() => {
    if (editingProperty?.property_images) {
      setOrderedImages([...editingProperty.property_images].sort((a, b) => (a.position || 0) - (b.position || 0)));
    } else {
      setOrderedImages([]);
    }
  }, [editingProperty]);

  async function handleToggleFeatured(id: string, currentStatus: boolean) {
    setTogglingFeatured(id);
    try {
      const res = await toggleFeaturedProperty(id, !currentStatus);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(!currentStatus ? "Ditampilkan di beranda" : "Dihapus dari beranda");
        router.refresh();
      }
    } catch (e) {
      toast.error("Gagal mengubah status pilihan");
    } finally {
      setTogglingFeatured(null);
    }
  }

  const filtered = properties.filter((p) => {
    const matchesSearch = 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === "Semua" || p.type === typeFilter;
    
    const matchesStatus = statusFilter === "Semua" || 
      (statusFilter === "Aktif" && p.is_active !== false) || 
      (statusFilter === "Nonaktif" && p.is_active === false);

    return matchesSearch && matchesType && matchesStatus;
  });

  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    
    setCompressing(true);
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Basic validation
        if (!ALLOWED_TYPES.includes(file.type)) {
          toast.error(`File "${file.name}" bukan gambar yang didukung (Gunakan JPG, PNG, atau WebP)`);
          continue;
        }

        if (file.size > MAX_FILE_SIZE) {
          toast.error(`File "${file.name}" terlalu besar (Maks 10MB)`);
          continue;
        }

        // Show progress if many files
        if (files.length > 1) {
          toast.info(`Mengompres gambar ${i + 1}/${files.length}...`, { duration: 1000 });
        }

        const compressed = await compressImage(file);
        validFiles.push(compressed);
        newPreviews.push(URL.createObjectURL(compressed));
      }

      setNewImages(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newPreviews]);
      toast.success(`${files.length} gambar berhasil ditambahkan`);
    } catch (err) {
      toast.error("Gagal mengompres gambar");
    } finally {
      setCompressing(false);
      e.target.value = "";
    }
  }

  function removeNewImage(index: number) {
    URL.revokeObjectURL(previewUrls[index]);
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  }

  async function handleDelete(id: string) {
    setPropertyToDelete(id);
    setShowDeleteDialog(true);
  }

  async function confirmDelete() {
    if (!propertyToDelete) return;
    setDeleting(propertyToDelete);
    try {
      await deleteProperty(propertyToDelete);
      toast.success("Properti berhasil dihapus");
      setShowDeleteDialog(false);
      setPropertyToDelete(null);
      router.refresh();
    } catch (e) {
      toast.error("Gagal menghapus properti");
    } finally {
      setDeleting(null);
    }
  }

  async function handleDeleteImage(imageId: string, imageUrl: string) {
    if (!confirm("Hapus gambar ini?")) return;
    setDeletingImage(imageId);
    try {
      const res = await deletePropertyImage(imageId, imageUrl);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Gambar dihapus");
        if (editingProperty) {
          setEditingProperty({
            ...editingProperty,
            property_images: editingProperty.property_images?.filter(img => img.id !== imageId)
          });
        }
        router.refresh();
      }
    } catch (e) {
      toast.error("Terjadi kesalahan");
    } finally {
      setDeletingImage(null);
    }
  }

  function moveExistingImage(index: number, direction: 'left' | 'right') {
    const newOrdered = [...orderedImages];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newOrdered.length) {
      const temp = newOrdered[index];
      newOrdered[index] = newOrdered[targetIndex];
      newOrdered[targetIndex] = temp;
      setOrderedImages(newOrdered);
    }
  }

  function moveNewImage(index: number, direction: 'left' | 'right') {
    const newFiles = [...newImages];
    const newUrls = [...previewUrls];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newFiles.length) {
      // Swap files
      const tempFile = newFiles[index];
      newFiles[index] = newFiles[targetIndex];
      newFiles[targetIndex] = tempFile;
      
      // Swap urls
      const tempUrl = newUrls[index];
      newUrls[index] = newUrls[targetIndex];
      newUrls[targetIndex] = tempUrl;

      setNewImages(newFiles);
      setPreviewUrls(newUrls);
    }
  }

  async function handleFormSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    setFieldErrors({});
    const toastId = toast.loading(editingProperty ? "Memperbarui properti..." : "Menerbitkan properti...");
    try {
      // Append new images from state
      newImages.forEach(file => {
        formData.append("images", file);
      });

      // Append image order for existing images
      if (editingProperty) {
        formData.append("image_order", JSON.stringify(orderedImages.map(img => img.id)));
      }

      let result;
      if (editingProperty) {
        result = await updateProperty(editingProperty.id, formData);
      } else {
        result = await createProperty(formData);
      }

      if (result?.fieldErrors) {
        setFieldErrors(result.fieldErrors);
        toast.error("Mohon perbaiki kesalahan pada form", { id: toastId });
      } else if (result?.error) {
        setFormError(result.error);
        toast.error(result.error, { id: toastId });
      } else {
        toast.success(editingProperty ? "Properti berhasil diperbarui" : "Properti berhasil ditambahkan", { id: toastId });
        closeDialog();
        router.refresh();
      }
    } catch (e) {
      const msg = "Terjadi kesalahan sistem. Silakan coba lagi.";
      setFormError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setSaving(false);
    }
  }

  function closeDialog() {
    setEditingProperty(null);
    setShowAddDialog(false);
    // Cleanup previews
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setNewImages([]);
    setPreviewUrls([]);
    setFormError(null);
    setFieldErrors({});
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Manajemen Properti</h1>
          <p className="text-muted-foreground font-medium">Kelola dan pantau semua listing Anda.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          if (!open) closeDialog();
          else setShowAddDialog(true);
        }}>
          <DialogTrigger
            render={
              <Button size="lg" className="rounded-2xl font-bold shadow-lg shadow-primary/20" onClick={() => setShowAddDialog(true)}>
                <Plus className="mr-2 h-5 w-5" />
                Tambah Properti
              </Button>
            }
          />
          <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-[2rem] p-0 border-none shadow-2xl bg-background custom-scrollbar overflow-x-hidden">
            <div className="p-10 md:p-14">
              <DialogHeader className="mb-10">
                <DialogTitle className="text-4xl font-black tracking-tight text-foreground">
                  {editingProperty ? "Edit Properti" : "Properti Baru"}
                </DialogTitle>
                <DialogDescription className="text-lg font-medium text-muted-foreground/80 mt-2">
                  {editingProperty ? "Perbarui detail unit properti Anda." : "Masukkan detail unit yang akan dipasarkan."}
                </DialogDescription>
              </DialogHeader>

              <form action={handleFormSubmit} className="space-y-10">
                <PropertyForm 
                  key={editingProperty?.id || "new"}
                  defaultValues={editingProperty}
                  formError={formError}
                  fieldErrors={fieldErrors}
                  orderedImages={orderedImages}
                  onMoveExistingImage={moveExistingImage}
                  onMoveNewImage={moveNewImage}
                  existingImages={editingProperty?.property_images || []}
                  handleDeleteImage={handleDeleteImage}
                  deletingImage={deletingImage}
                  previewUrls={previewUrls}
                  removeNewImage={removeNewImage}
                  compressing={compressing}
                  handleFileChange={handleFileChange}
                  editingProperty={editingProperty}
                  agentPhone={agentPhone}
                />
                
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-10 border-t">
                  <Button type="button" variant="ghost" onClick={closeDialog} className="rounded-2xl h-14 px-10 font-bold text-base hover:bg-muted">
                    Batal
                  </Button>
                  <Button type="submit" disabled={saving} className="rounded-2xl h-14 px-14 font-bold text-base shadow-2xl shadow-primary/30">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      editingProperty ? "Simpan Perubahan" : "Terbitkan Properti"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-card/50 p-4 rounded-[2rem] border border-border/40 backdrop-blur-sm">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Cari judul atau alamat..."
            className="pl-10 h-12 rounded-2xl border-none bg-background shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 px-3 h-12 bg-background rounded-2xl shadow-inner border border-1 focus-within:border-primary/20 transition-all">
          <Filter className="h-4 w-4 text-primary/40" />
          <select 
            className="bg-transparent text-sm font-sans font-bold w-full focus:outline-none cursor-pointer"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="Semua">Semua Tipe</option>
            <option value="Rumah">Rumah</option>
            <option value="Tanah">Tanah</option>
            <option value="Kavling">Kavling</option>
            <option value="Cluster">Cluster</option>
            <option value="Apartemen">Apartemen</option>
          </select>
        </div>

        <div className="flex items-center gap-2 px-3 h-12 bg-background rounded-2xl shadow-inner border border-1 focus-within:border-primary/20 transition-all">
          <div className={`h-2 w-2 rounded-full ${statusFilter === "Aktif" ? "bg-emerald-500" : statusFilter === "Nonaktif" ? "bg-gray-400" : "bg-primary/40"}`} />
          <select 
            className="bg-transparent text-sm font-sans font-bold w-full focus:outline-none cursor-pointer"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Nonaktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-[2rem] border border-border/40 bg-card/50 overflow-hidden shadow-sm backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-b border-border/40 hover:bg-transparent">
              <TableHead className="py-5 font-bold uppercase tracking-wider text-[10px] text-muted-foreground px-6">Informasi Properti</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Tipe</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Harga Listing</TableHead>
              <TableHead className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">Status</TableHead>
              <TableHead className="text-right font-bold uppercase tracking-wider text-[10px] text-muted-foreground px-6">Manajemen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((property) => (
              <TableRow key={property.id} className="border-b border-border/20 hover:bg-primary/[0.02] transition-colors group">
                <TableCell className="py-4 px-6">
                  <div className="flex flex-col">
                    <span className="font-bold text-base tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {truncateText(property.title, 40)}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium italic">
                      {truncateText(property.address, 50)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="px-3 py-1 bg-primary/5 text-primary text-[11px] font-black uppercase tracking-widest rounded-full">
                    {property.type}
                  </span>
                </TableCell>
                <TableCell className="font-bold text-foreground">
                  {formatCurrency(Number(property.price))}
                </TableCell>
                <TableCell>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    property.is_active !== false
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${property.is_active !== false ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {property.is_active !== false ? "Aktif" : "Off"}
                  </div>
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-xl transition-all",
                        property.is_featured 
                          ? "bg-amber-50 text-amber-500 hover:bg-amber-100 hover:text-amber-600 shadow-sm" 
                          : "hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={() => handleToggleFeatured(property.id, !!property.is_featured)}
                      disabled={togglingFeatured === property.id}
                      title={property.is_featured ? "Hapus dari pilihan beranda" : "Tampilkan di beranda (Maks 3)"}
                    >
                      {togglingFeatured === property.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Star className={cn("h-4 w-4", property.is_featured && "fill-current")} />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                      onClick={() => {
                        setEditingProperty(property);
                        setShowAddDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(property.id)}
                      disabled={deleting === property.id}
                    >
                      {deleting === property.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid md:hidden grid-cols-1 gap-4">
        {filtered.map((property) => (
          <div key={property.id} className="bg-card border border-border/40 p-5 rounded-[2rem] shadow-sm space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-md mb-2 inline-block">
                  {property.type}
                </span>
                <h3 className="font-bold text-lg leading-tight tracking-tight">{truncateText(property.title, 35)}</h3>
                <p className="text-xs text-muted-foreground mt-1">{truncateText(property.address, 40)}</p>
              </div>
              <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-background shadow-sm ${property.is_active !== false ? "bg-emerald-500" : "bg-gray-400"}`} />
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-border/40">
              <span className="font-black text-primary">{formatCurrency(Number(property.price))}</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={cn(
                    "h-10 w-10 p-0 rounded-xl transition-all",
                    property.is_featured 
                      ? "bg-amber-50 text-amber-500 border-amber-200 shadow-sm" 
                      : ""
                  )}
                  onClick={() => handleToggleFeatured(property.id, !!property.is_featured)}
                  disabled={togglingFeatured === property.id}
                >
                  {togglingFeatured === property.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Star className={cn("h-4 w-4", property.is_featured && "fill-current")} />
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-10 p-0 rounded-xl" 
                  onClick={() => {
                    setEditingProperty(property);
                    setShowAddDialog(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-10 w-10 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive border-destructive/20"
                  onClick={() => handleDelete(property.id)}
                  disabled={deleting === property.id}
                >
                  {deleting === property.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-card/30 rounded-[3rem] border-2 border-dashed border-border/40">
          <div className="p-4 bg-muted/20 rounded-full mb-4">
            <Search className="h-8 w-8 text-muted-foreground/30" />
          </div>
          <p className="text-muted-foreground font-bold tracking-tight">Tidak ada properti ditemukan</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Coba sesuaikan filter atau kata kunci pencarian Anda.</p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-[2rem] p-0 border-none shadow-2xl bg-background overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-center">Hapus Properti?</DialogTitle>
              <DialogDescription className="text-center text-muted-foreground font-medium mt-2">
                Tindakan ini tidak dapat dibatalkan. Seluruh data dan gambar properti ini akan dihapus secara permanen dari sistem.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <Button 
                variant="ghost" 
                className="flex-1 rounded-2xl h-12 font-bold hover:bg-muted" 
                onClick={() => {
                  setShowDeleteDialog(false);
                  setPropertyToDelete(null);
                }}
              >
                Batal
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 rounded-2xl h-12 font-bold shadow-lg shadow-destructive/20" 
                onClick={confirmDelete}
                disabled={!!deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Sekarang"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
