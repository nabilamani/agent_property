"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload, Loader2, X, Building } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { updateAgent } from "@/app/actions/agent";
import { cn } from "@/lib/utils";

import { compressImage } from "@/lib/image-compression";

interface AgentData {
  name: string;
  phone: string;
  bio: string | null;
  caption: string | null;
  photo: string | null;
  logo: string | null;
}

export function AgentProfileForm({ agent }: { agent: AgentData }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [compressingPhoto, setCompressingPhoto] = useState(false);
  const [compressingLogo, setCompressingLogo] = useState(false);
  
  // Photo preview state
  const [previewUrl, setPreviewUrl] = useState<string | null>(agent.photo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Logo preview state
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(agent.logo);
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  // Update previews if agent prop changes (e.g. after save)
  useEffect(() => {
    setPreviewUrl(agent.photo);
    setLogoPreviewUrl(agent.logo);
    setSelectedFile(null);
    setSelectedLogoFile(null);
  }, [agent.photo, agent.logo]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressingPhoto(true);
      try {
        const compressed = await compressImage(file);
        setSelectedFile(compressed);
        const url = URL.createObjectURL(compressed);
        setPreviewUrl(url);
      } catch (err) {
        toast.error("Gagal mengompres foto profil");
      } finally {
        setCompressingPhoto(false);
      }
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompressingLogo(true);
      try {
        const compressed = await compressImage(file);
        setSelectedLogoFile(compressed);
        const url = URL.createObjectURL(compressed);
        setLogoPreviewUrl(url);
      } catch (err) {
        toast.error("Gagal mengompres logo");
      } finally {
        setCompressingLogo(false);
      }
    }
  };

  const resetPhotoPreview = () => {
    setPreviewUrl(agent.photo);
    setSelectedFile(null);
    const input = document.getElementById("photo") as HTMLInputElement;
    if (input) input.value = "";
  };

  const resetLogoPreview = () => {
    setLogoPreviewUrl(agent.logo);
    setSelectedLogoFile(null);
    const input = document.getElementById("logo") as HTMLInputElement;
    if (input) input.value = "";
  };

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    
    // Ensure the selected files are in the formData if they were changed
    if (selectedFile) {
      formData.set("photo", selectedFile);
    }
    if (selectedLogoFile) {
      formData.set("logo", selectedLogoFile);
    }

    try {
      const result = await updateAgent(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Profil berhasil diperbarui!");
        router.refresh();
      }
    } catch (e) {
      toast.error("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  }

  const formKey = `${agent.name}-${agent.phone}`;

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Profil Agent</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Kelola informasi publik dan identitas visual Anda untuk menarik lebih banyak calon pembeli.
        </p>
      </div>

      <form action={handleSubmit} key={formKey}>
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Left Sidebar - Visuals */}
          <div className="lg:col-span-4 space-y-6">
            {/* Photo Section */}
            <Card className="overflow-hidden border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Foto Profil</CardTitle>
                <CardDescription>Format JPG/PNG, maks 2MB.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-40 h-40 rounded-full overflow-hidden ring-4 ring-background shadow-xl mb-6 group cursor-pointer transition-transform hover:scale-[1.02]">
                  {previewUrl ? (
                    <Image src={previewUrl} alt="Profile Photo" fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-5xl font-black text-primary/30">
                      {agent.name.charAt(0)}
                    </div>
                  )}
                  
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={resetPhotoPreview}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Batalkan perubahan"
                    >
                      <X className="text-white h-8 w-8" />
                    </button>
                  )}
                </div>
                
                <div className="w-full">
                  <Label 
                    htmlFor="photo" 
                    className={cn(
                      "cursor-pointer block",
                      compressingPhoto && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/5 border border-primary/10 rounded-xl text-sm font-bold text-primary hover:bg-primary/10 transition-colors w-full">
                      {compressingPhoto ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {selectedFile ? "Ganti Foto" : "Unggah Foto"}
                        </>
                      )}
                    </div>
                  </Label>
                  <Input 
                    id="photo" 
                    name="photo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange} 
                    disabled={compressingPhoto}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Logo Section */}
            <Card className="overflow-hidden border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Logo Bisnis</CardTitle>
                <CardDescription>Tampil di kartu properti.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden border-2 border-dashed border-border bg-white shadow-inner mb-6 group flex items-center justify-center transition-all hover:border-primary/30">
                  {logoPreviewUrl ? (
                    <Image src={logoPreviewUrl} alt="Property Logo" fill className="object-contain p-6" />
                  ) : (
                    <Building className="h-10 w-10 text-muted-foreground/20" />
                  )}
                  
                  {selectedLogoFile && (
                    <button
                      type="button"
                      onClick={resetLogoPreview}
                      className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Batalkan perubahan"
                    >
                      <X className="text-white h-8 w-8" />
                    </button>
                  )}
                </div>
                
                <div className="w-full">
                  <Label 
                    htmlFor="logo" 
                    className={cn(
                      "cursor-pointer block",
                      compressingLogo && "opacity-50 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-colors w-full">
                      {compressingLogo ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          {selectedLogoFile ? "Ganti Logo" : "Unggah Logo"}
                        </>
                      )}
                    </div>
                  </Label>
                  <Input 
                    id="logo" 
                    name="logo" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleLogoChange} 
                    disabled={compressingLogo}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content - Form Details */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="border-border/50 shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 pb-8 pt-8 px-8 border-b">
                <CardTitle className="text-2xl font-black tracking-tight">Detail Informasi</CardTitle>
                <CardDescription className="text-base">Informasi ini akan dilihat langsung oleh calon pembeli.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="name" className="text-sm font-bold tracking-wide uppercase text-muted-foreground/80">Nama Lengkap</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      defaultValue={agent.name} 
                      className="h-12 text-base rounded-xl border-border/60 focus:ring-4 focus:ring-primary/10 transition-all"
                      required 
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="phone" className="text-sm font-bold tracking-wide uppercase text-muted-foreground/80">Nomor WhatsApp</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      defaultValue={agent.phone} 
                      className="h-12 text-base rounded-xl border-border/60 focus:ring-4 focus:ring-primary/10 transition-all"
                      required 
                    />
                    <p className="text-[10px] font-bold text-muted-foreground/50 italic">Contoh: 628123456789</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="caption" className="text-sm font-bold tracking-wide uppercase text-muted-foreground/80">Tagline / Slogan</Label>
                  <Input 
                    id="caption" 
                    name="caption" 
                    defaultValue={agent.caption || ""} 
                    placeholder="Contoh: Spesialis Rumah Mewah & Strategis"
                    className="h-12 text-base rounded-xl border-border/60 focus:ring-4 focus:ring-primary/10 transition-all"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="bio" className="text-sm font-bold tracking-wide uppercase text-muted-foreground/80">Biografi Profesional</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={agent.bio || ""}
                    placeholder="Ceritakan pengalaman dan nilai tambah yang Anda tawarkan..."
                    className="min-h-[200px] text-base rounded-2xl border-border/60 p-4 focus:ring-4 focus:ring-primary/10 transition-all resize-none"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end p-8 bg-muted/20 border-t gap-4">
                <Button type="submit" size="xl" className="px-10 shadow-lg shadow-primary/20" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="mr-3 h-5 w-5" />
                      Simpan Profil
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
