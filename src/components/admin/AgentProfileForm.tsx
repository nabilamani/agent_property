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
import { updateAgent } from "@/app/actions/agent";

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
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
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

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({ type: "error", text: "Ukuran file terlalu besar! Maksimal 2MB." });
        e.target.value = ""; // Clear input
        return;
      }
      setMessage(null);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setMessage({ type: "error", text: "Ukuran logo terlalu besar! Maksimal 2MB." });
        e.target.value = "";
        return;
      }
      setMessage(null);
      setSelectedLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreviewUrl(url);
    }
  };

  const resetLogoPreview = () => {
    setLogoPreviewUrl(agent.logo);
    setSelectedLogoFile(null);
    const input = document.getElementById("logo") as HTMLInputElement;
    if (input) input.value = "";
  };

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    setMessage(null);
    
    // Ensure the selected files are in the formData if they were changed
    if (selectedFile) {
      formData.set("photo", selectedFile);
    }
    if (selectedLogoFile) {
      formData.set("logo", selectedLogoFile);
    }

    const result = await updateAgent(formData);
    setSaving(false);

    if (result?.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Profil berhasil disimpan!" });
      router.refresh();
    }
  }

  // Use a key derived from agent data to force re-render when data changes
  // This prevents the Base UI "changing default value of uncontrolled component" warning
  const formKey = `${agent.name}-${agent.phone}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profil Agent</h1>
        <p className="text-muted-foreground">
          Kelola informasi publik Anda yang akan ditampilkan kepada calon pembeli.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-lg p-3 text-sm border ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          {message.text}
        </div>
      )}

      <form action={handleSubmit} key={formKey}>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-8">
          {/* Photo Section */}
          <Card className="md:col-span-1 border-none shadow-sm bg-transparent">
            <CardHeader className="px-0">
              <CardTitle>Foto Profil</CardTitle>
              <CardDescription>
                Foto ini akan ditampilkan di semua listing properti Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex flex-col items-center">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-background shadow-lg mb-6 group">
                {previewUrl ? (
                  <Image src={previewUrl} alt="Profile Photo" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-6xl font-bold text-primary">
                    {agent.name.charAt(0)}
                  </div>
                )}
                
                {selectedFile && (
                  <button
                    type="button"
                    onClick={resetPreview}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Batalkan perubahan"
                  >
                    <X className="text-white h-8 w-8" />
                  </button>
                )}
              </div>
              
              <div className="w-full space-y-2">
                <Label htmlFor="photo" className="cursor-pointer block">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors w-full">
                    <Upload className="h-4 w-4" />
                    {selectedFile ? "Ganti Pilihan" : "Unggah Foto"}
                  </div>
                </Label>
                <Input 
                  id="photo" 
                  name="photo" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {selectedFile && (
                  <p className="text-xs text-center text-primary font-medium animate-pulse">
                    Pilihan baru: {selectedFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Logo Section */}
          <Card className="md:col-span-1 border-none shadow-sm bg-transparent">
            <CardHeader className="px-0">
              <CardTitle>Logo Properti</CardTitle>
              <CardDescription>
                Logo bisnis atau agensi properti Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-dashed border-muted-foreground/20 bg-white shadow-inner mb-6 group flex items-center justify-center">
                {logoPreviewUrl ? (
                  <Image src={logoPreviewUrl} alt="Property Logo" fill className="object-contain p-4" />
                ) : (
                  <Building className="h-12 w-12 text-muted-foreground/40" />
                )}
                
                {selectedLogoFile && (
                  <button
                    type="button"
                    onClick={resetLogoPreview}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Batalkan perubahan"
                  >
                    <X className="text-white h-8 w-8" />
                  </button>
                )}
              </div>
              
              <div className="w-full space-y-2">
                <Label htmlFor="logo" className="cursor-pointer block">
                  <div className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm font-medium hover:bg-muted transition-colors w-full">
                    <Upload className="h-4 w-4" />
                    {selectedLogoFile ? "Ganti Logo" : "Unggah Logo"}
                  </div>
                </Label>
                <Input 
                  id="logo" 
                  name="logo" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleLogoChange}
                />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Profile Details Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informasi Personal</CardTitle>
              <CardDescription>Pastikan data Anda selalu up-to-date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={agent.name} 
                  required 
                  key={`name-${agent.name}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor WhatsApp</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  defaultValue={agent.phone} 
                  required 
                  key={`phone-${agent.phone}`}
                />
                <p className="text-xs text-muted-foreground">
                  Gunakan format kode negara tanpa simbol +, contoh: 62812...
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption / Tagline</Label>
                <Input 
                  id="caption" 
                  name="caption" 
                  defaultValue={agent.caption || ""} 
                  placeholder="Contoh: Solusi Properti Modern & Terpercaya"
                  key={`caption-${agent.caption}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Deskripsi Agent</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={agent.bio || ""}
                  placeholder="Tuliskan pengalaman dan spesialisasi Anda secara singkat."
                  className="min-h-[150px]"
                  key={`bio-${agent.bio}`}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6 bg-muted/20">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Perubahan
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}

