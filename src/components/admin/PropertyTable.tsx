"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
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
import { createProperty, updateProperty, deleteProperty } from "@/app/actions/properties";

interface PropertyRow {
  id: string;
  title: string;
  address: string;
  type: string;
  price: number;
  is_active?: boolean;
  property_images?: { image_url: string }[];
  images?: string[];
}

export function PropertyTable({ properties }: { properties: PropertyRow[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<PropertyRow | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const filtered = properties.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus properti ini?")) return;
    setDeleting(id);
    await deleteProperty(id);
    setDeleting(null);
    router.refresh();
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
      } else {
        setEditingProperty(null);
        setShowAddDialog(false);
        router.refresh();
      }
    } catch (e) {
      setFormError("Terjadi kesalahan sistem. Silakan coba lagi.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  function PropertyForm({ defaultValues }: { defaultValues?: any }) {
    return (
      <form action={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {formError && (
          <div className="p-3 text-sm bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
            {formError}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="title">Judul Properti *</Label>
            <Input id="title" name="title" defaultValue={defaultValues?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Harga (IDR) *</Label>
            <Input id="price" name="price" type="number" defaultValue={defaultValues?.price} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipe Properti *</Label>
            <select
              id="type"
              name="type"
              defaultValue={defaultValues?.type || "Rumah"}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
            <Label htmlFor="address">Alamat *</Label>
            <Input id="address" name="address" defaultValue={defaultValues?.address} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="land_area">Luas Tanah (m²)</Label>
            <Input id="land_area" name="land_area" type="number" defaultValue={defaultValues?.land_area || 0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="building_area">Luas Bangunan (m²)</Label>
            <Input id="building_area" name="building_area" type="number" defaultValue={defaultValues?.building_area || 0} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition">Kondisi</Label>
            <select
              id="condition"
              name="condition"
              defaultValue={defaultValues?.condition || "Baru"}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Baru">Baru</option>
              <option value="Bekas">Bekas</option>
              <option value="Indent">Indent</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agent_whatsapp">WhatsApp Agent *</Label>
            <Input id="agent_whatsapp" name="agent_whatsapp" defaultValue={defaultValues?.agent_whatsapp || "6281234567890"} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="owner_whatsapp">WhatsApp Owner</Label>
            <Input id="owner_whatsapp" name="owner_whatsapp" defaultValue={defaultValues?.owner_whatsapp || ""} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="map_url">Google Maps Embed URL</Label>
            <Input 
              id="map_url" 
              name="map_url" 
              defaultValue={defaultValues?.map_url || ""} 
              placeholder="Saran: Paste kode <iframe> dari Google Maps di sini" 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea 
              id="description" 
              name="description" 
              defaultValue={defaultValues?.description || ""} 
              className="min-h-[100px]" 
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="images">Upload Gambar Baru</Label>
            <Input 
              id="images" 
              name="images" 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  for (let i = 0; i < files.length; i++) {
                    if (files[i].size > MAX_FILE_SIZE) {
                      setFormError(`File "${files[i].name}" terlalu besar! Maksimal 2MB per foto.`);
                      e.target.value = ""; // Clear input
                      return;
                    }
                  }
                  setFormError(null);
                }
              }}
            />
            {defaultValues && (
              <p className="text-xs text-muted-foreground">Biarkan kosong jika tidak ingin menambah gambar.</p>
            )}
          </div>
          <div className="col-span-2 flex items-center gap-2">
            <input type="hidden" name="is_active" value={String(defaultValues?.is_active !== false)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={saving || !!formError}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingProperty ? "Simpan Perubahan" : "Tambah Properti"}
          </Button>
        </DialogFooter>
      </form>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen Properti</h1>
          <p className="text-muted-foreground">Kelola semua listing properti Anda di sini.</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger
            render={
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Properti
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Tambah Properti Baru</DialogTitle>
              <DialogDescription>Isi detail properti yang akan ditambahkan.</DialogDescription>
            </DialogHeader>
            <PropertyForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari properti..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Properti</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{property.title}</span>
                    <span className="text-xs text-muted-foreground">{property.address}</span>
                  </div>
                </TableCell>
                <TableCell>{property.type}</TableCell>
                <TableCell>{formatCurrency(Number(property.price))}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                      property.is_active !== false
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                        : "bg-gray-50 text-gray-600 ring-gray-500/10"
                    }`}
                  >
                    {property.is_active !== false ? "Aktif" : "Nonaktif"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => setEditingProperty(property)}
                          >
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        }
                      />
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Properti</DialogTitle>
                          <DialogDescription>Ubah detail properti.</DialogDescription>
                        </DialogHeader>
                        <PropertyForm defaultValues={property} />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Hapus"
                      className="hover:text-destructive hover:bg-destructive/10"
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                  {search ? "Tidak ada properti yang cocok." : "Belum ada properti. Tambahkan properti pertama Anda!"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
