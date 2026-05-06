"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search, Loader2, Filter, ChevronDown, MoreHorizontal } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { createProperty, updateProperty, deleteProperty, deletePropertyImage } from "@/app/actions/properties";

interface PropertyRow {
  id: string;
  title: string;
  address: string;
  type: string;
  price: number;
  is_active?: boolean;
  property_images?: { id: string, image_url: string }[];
  images?: string[];
}

export function PropertyTable({ properties }: { properties: PropertyRow[] }) {
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

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

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

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus properti ini?")) return;
    setDeleting(id);
    try {
      await deleteProperty(id);
      toast.success("Properti berhasil dihapus");
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

  async function handleFormSubmit(formData: FormData) {
    setSaving(true);
    setFormError(null);
    try {
      let result;
      if (editingProperty) {
        result = await updateProperty(editingProperty.id, formData);
      } else {
        result = await createProperty(formData);
      }

      if (result?.error) {
        setFormError(result.error);
        toast.error(result.error);
      } else {
        toast.success(editingProperty ? "Properti berhasil diperbarui" : "Properti berhasil ditambahkan");
        setEditingProperty(null);
        setShowAddDialog(false);
        router.refresh();
      }
    } catch (e) {
      const msg = "Terjadi kesalahan sistem. Silakan coba lagi.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  function PropertyForm({ defaultValues }: { defaultValues?: any }) {
    const existingImages = defaultValues?.property_images || [];

    return (
      <form action={handleFormSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
        {formError && (
          <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-xl font-medium">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Judul Properti *</Label>
            <Input id="title" name="title" defaultValue={defaultValues?.title} className="h-11 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Harga (IDR) *</Label>
            <Input id="price" name="price" type="number" defaultValue={defaultValues?.price} className="h-11 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Tipe Properti *</Label>
            <select
              id="type"
              name="type"
              defaultValue={defaultValues?.type || "Rumah"}
              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm transition-all focus:ring-4 focus:ring-primary/10"
              required
            >
              <option value="Rumah">Rumah</option>
              <option value="Tanah">Tanah</option>
              <option value="Kavling">Kavling</option>
              <option value="Cluster">Cluster</option>
              <option value="Apartemen">Apartemen</option>
            </select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Alamat Lengkap *</Label>
            <Input id="address" name="address" defaultValue={defaultValues?.address} className="h-11 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="land_area" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Luas Tanah (m²)</Label>
            <Input id="land_area" name="land_area" type="number" defaultValue={defaultValues?.land_area || 0} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building_area" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Luas Bangunan (m²)</Label>
            <Input id="building_area" name="building_area" type="number" defaultValue={defaultValues?.building_area || 0} className="h-11 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Kondisi</Label>
            <select
              id="condition"
              name="condition"
              defaultValue={defaultValues?.condition || "Baru"}
              className="flex h-11 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm transition-all focus:ring-4 focus:ring-primary/10"
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
              className={`flex h-11 w-full rounded-xl border px-3 py-1 text-sm font-bold transition-all focus:ring-4 focus:ring-primary/10 ${
                (defaultValues?.is_active !== false) ? "bg-emerald-50/50 border-emerald-200 text-emerald-700" : "bg-muted/50 border-border"
              }`}
            >
              <option value="true">Aktif (Tampil di Web)</option>
              <option value="false">Nonaktif (Sembunyikan)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_whatsapp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">WA Agent *</Label>
            <Input id="agent_whatsapp" name="agent_whatsapp" defaultValue={defaultValues?.agent_whatsapp || "6281234567890"} className="h-11 rounded-xl" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner_whatsapp" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">WA Owner (Opsional)</Label>
            <Input id="owner_whatsapp" name="owner_whatsapp" defaultValue={defaultValues?.owner_whatsapp || ""} className="h-11 rounded-xl" />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="map_url" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Google Maps Embed URL</Label>
            <Input 
              id="map_url" 
              name="map_url" 
              defaultValue={defaultValues?.map_url || ""} 
              placeholder="Paste kode <iframe> atau URL maps di sini"
              className="h-11 rounded-xl"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Deskripsi</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={defaultValues?.description || ""} 
              className="min-h-[120px] rounded-2xl" 
            />
          </div>

          {/* Image Management Section */}
          <div className="col-span-2 space-y-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Manajemen Gambar</Label>
            
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-3 bg-muted/20 rounded-2xl border border-border/40">
                {existingImages.map((img: any) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-border/40 shadow-sm bg-white">
                    <Image src={img.image_url} alt="Property" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(img.id, img.image_url)}
                      disabled={deletingImage === img.id}
                      className="absolute top-1 right-1 h-6 w-6 bg-destructive/90 text-white rounded-md flex items-center justify-center opacity-100 transition-opacity disabled:opacity-50"
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

            <div className="space-y-2">
              <Label htmlFor="images" className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {existingImages.length > 0 ? "Tambah Gambar Baru" : "Upload Gambar"}
              </Label>
              <Input 
                id="images" 
                name="images" 
                type="file" 
                accept="image/*" 
                multiple 
                className="rounded-xl h-auto py-2 file:bg-primary/5 file:text-primary file:font-bold file:border-none file:rounded-md cursor-pointer"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files) {
                    for (let i = 0; i < files.length; i++) {
                      if (files[i].size > MAX_FILE_SIZE) {
                        toast.error(`File "${files[i].name}" terlalu besar!`);
                        e.target.value = ""; 
                        return;
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button type="submit" size="lg" className="w-full sm:w-auto rounded-xl font-bold" disabled={saving || !!formError}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingProperty ? "Simpan Perubahan" : "Tambah Properti"}
          </Button>
        </DialogFooter>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Manajemen Properti</h1>
          <p className="text-muted-foreground font-medium">Kelola dan pantau semua listing Anda.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger
            render={
              <Button size="lg" className="rounded-2xl font-bold shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-5 w-5" />
                Tambah Properti
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[650px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Properti Baru</DialogTitle>
              <DialogDescription>Masukkan detail unit yang akan dipasarkan.</DialogDescription>
            </DialogHeader>
            <PropertyForm />
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
        
        <div className="flex items-center gap-2 px-3 h-12 bg-background rounded-2xl shadow-inner border border-transparent focus-within:border-primary/20 transition-all">
          <Filter className="h-4 w-4 text-primary/40" />
          <select 
            className="bg-transparent text-sm font-bold w-full focus:outline-none cursor-pointer"
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

        <div className="flex items-center gap-2 px-3 h-12 bg-background rounded-2xl shadow-inner border border-transparent focus-within:border-primary/20 transition-all">
          <div className={`h-2 w-2 rounded-full ${statusFilter === "Aktif" ? "bg-emerald-500" : statusFilter === "Nonaktif" ? "bg-gray-400" : "bg-primary/40"}`} />
          <select 
            className="bg-transparent text-sm font-bold w-full focus:outline-none cursor-pointer"
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
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary"
                            onClick={() => setEditingProperty(property)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-[650px] rounded-[2rem]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black">Edit Listing</DialogTitle>
                          <DialogDescription>Update detail properti pilihan Anda.</DialogDescription>
                        </DialogHeader>
                        <PropertyForm defaultValues={property} />
                      </DialogContent>
                    </Dialog>
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
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-xl" onClick={() => setEditingProperty(property)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    }
                  />
                  <DialogContent className="sm:max-w-[650px] w-[95vw] rounded-[2rem]">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Edit Listing</DialogTitle>
                    </DialogHeader>
                    <PropertyForm defaultValues={property} />
                  </DialogContent>
                </Dialog>
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
    </div>
  );
}
