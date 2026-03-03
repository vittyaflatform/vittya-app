"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Loader2, Save, User, Users, Globe, 
  Instagram, Facebook, Twitter, Sparkles 
} from "lucide-react";
import Image from "next/image";
import ImageUpload from "@/components/ui/image-upload";
import { cn } from "@/lib/utils";

export default function CouplePage() {
  const supabase = useMemo(() => createClient(), []);
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState("");
  
  // MESIN UTAMA: Pakai State Manual untuk performa maksimal di React 19
  const [formData, setFormData] = useState<any>({
    groom_name: "", groom_nickname: "", groom_photo: "", groom_order: "", 
    groom_father: "", groom_mother: "", groom_ig: "", groom_fb: "", groom_x: "",
    bride_name: "", bride_nickname: "", bride_photo: "", bride_order: "", 
    bride_father: "", bride_mother: "", bride_ig: "", bride_fb: "", bride_x: ""
  });

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("id", projectId)
        .single();

      if (!error && data) {
        setUserId(data.user_id);
        setFormData(data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle perubahan text input secara real-time
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle perubahan gambar dari komponen ImageUpload
  const handleImageChange = (name: string, url: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: url }));
  };

  const onSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("invitations")
      .update(formData)
      .eq("id", projectId);

    if (!error) {
      toast.success("Identity Secured!", {
        description: "Data pengantin telah berhasil disinkronisasi.",
      });
    } else {
      toast.error("Failed to Sync", {
        description: "Gagal menyimpan ke database. Coba lagi nanti.",
      });
    }
    setSaving(false);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FDF8F3] gap-4">
      <Image src="/logo-Vittya.png" alt="Loading" width={60} height={60} className="animate-pulse" />
      <p className="text-[#1A4D2E] font-serif italic animate-pulse">Initializing System...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A4D2E] pb-40">
      {/* HEADER EXCLUSIVE */}
      <header className="sticky top-0 z-100 bg-[#FDF8F3]/90 backdrop-blur-md border-b border-[#E8DFD3] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo-Vittya.png" alt="Vittya" width={50} height={50} />
            <div className="text-left">
              <h1 className="text-2xl font-serif italic font-bold text-[#1A4D2E]">
                Couple <span className="text-[#C5A371]">IDENTITY</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A9907E]">Exclusive Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/50 px-6 py-2 rounded-full border border-[#E8DFD3] shadow-inner">
            <Sparkles size={16} className="text-[#C5A371]" />
            <span className="text-[10px] font-black uppercase italic text-[#1A4D2E]">System Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-12">
        <Tabs defaultValue="groom" className="w-full">
          <div className="flex justify-center mb-16">
            <TabsList className="h-16 bg-[#E8DFD3]/40 p-2 rounded-full border border-[#E8DFD3] w-full max-w-sm">
              <TabsTrigger value="groom" className="rounded-full flex-1 font-serif italic text-lg data-[state=active]:bg-[#1A4D2E] data-[state=active]:text-white transition-all duration-500 shadow-sm">The Groom</TabsTrigger>
              <TabsTrigger value="bride" className="rounded-full flex-1 font-serif italic text-lg data-[state=active]:bg-[#C5A371] data-[state=active]:text-white transition-all duration-500 shadow-sm">The Bride</TabsTrigger>
            </TabsList>
          </div>

          {(["groom", "bride"] as const).map((type) => (
            <TabsContent key={type} value={type} className="animate-in fade-in zoom-in-95 duration-500 outline-none">
              <div className="grid lg:grid-cols-12 gap-12 text-left">
                
                {/* PORTRAIT CARD */}
                <div className="lg:col-span-4">
                  <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white sticky top-32 border-b-8 border-[#1A4D2E]/10">
                    <div className={cn(
                      "h-16 flex items-center justify-center text-white font-serif italic tracking-widest", 
                      type === "groom" ? "bg-[#1A4D2E]" : "bg-[#C5A371]"
                    )}>
                      Portrait
                    </div>
                    <CardContent className="py-12 flex justify-center">
                      <ImageUpload
                        userId={userId}
                        invitationId={projectId}
                        assetType="profiles"
                        value={formData[`${type}_photo`] || ""}
                        onChange={(url: string) => handleImageChange(`${type}_photo`, url)}
                        onRemove={() => handleImageChange(`${type}_photo`, "")}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* FORM DETAILS */}
                <div className="lg:col-span-8 space-y-10">
                  <SectionBox 
                    title="Personal Details" 
                    icon={<User size={20} />} 
                    accent={type === "groom" ? "bg-[#1A4D2E]" : "bg-[#C5A371]"}
                  >
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="col-span-full space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#A9907E]">Full Name & Degree</Label>
                        <Input 
                          name={`${type}_name`}
                          value={formData[`${type}_name`] || ""}
                          onChange={handleChange}
                          placeholder="e.g. Muhamad Abdul Yusuf, S.Kom"
                          className="h-14 rounded-2xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#C5A371] focus:bg-white text-[#1A4D2E] font-serif italic text-xl px-6 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#A9907E]">Nickname</Label>
                        <Input 
                          name={`${type}_nickname`}
                          value={formData[`${type}_nickname`] || ""}
                          onChange={handleChange}
                          placeholder="Nickname"
                          className="h-14 rounded-2xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#C5A371] focus:bg-white text-[#1A4D2E] font-bold px-6 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#A9907E]">Child Order</Label>
                        <Input 
                          name={`${type}_order`}
                          value={formData[`${type}_order`] || ""}
                          onChange={handleChange}
                          placeholder="Putra pertama dari..."
                          className="h-14 rounded-2xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#C5A371] focus:bg-white text-[#1A4D2E] font-bold px-6 transition-all" 
                        />
                      </div>
                    </div>
                  </SectionBox>

                  <SectionBox title="Family Background" icon={<Users size={20} />} accent="bg-[#1A4D2E]">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#A9907E]">Father's Name</Label>
                        <Input 
                          name={`${type}_father`}
                          value={formData[`${type}_father`] || ""}
                          onChange={handleChange}
                          className="h-14 rounded-2xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#1A4D2E] focus:bg-white text-[#1A4D2E] font-bold px-6 transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-[#A9907E]">Mother's Name</Label>
                        <Input 
                          name={`${type}_mother`}
                          value={formData[`${type}_mother`] || ""}
                          onChange={handleChange}
                          className="h-14 rounded-2xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#1A4D2E] focus:bg-white text-[#1A4D2E] font-bold px-6 transition-all" 
                        />
                      </div>
                    </div>
                  </SectionBox>

                  <SectionBox title="Social Presence" icon={<Globe size={20} />} accent="bg-[#C5A371]">
                    <div className="grid md:grid-cols-3 gap-6">
                      {[ 
                        { icon: Instagram, key: `${type}_ig`, label: "Instagram" },
                        { icon: Facebook, key: `${type}_fb`, label: "Facebook" },
                        { icon: Twitter, key: `${type}_x`, label: "Twitter / X" }
                      ].map((social) => (
                        <div key={social.key} className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-[#A9907E]">{social.label}</Label>
                          <div className="relative">
                            <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C5A371]" size={18} />
                            <Input 
                              name={social.key}
                              value={formData[social.key] || ""}
                              onChange={handleChange}
                              placeholder="@username"
                              className="pl-12 h-12 rounded-xl bg-[#FDF8F3] border-2 border-[#E8DFD3] focus:border-[#C5A371] focus:bg-white text-[#1A4D2E] font-bold transition-all" 
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionBox>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* FLOATING ACTION BUTTON */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-101 w-full max-w-lg px-6">
          <Button
            onClick={onSave}
            disabled={saving}
            className="w-full h-20 rounded-full shadow-[0_20px_50px_rgba(26,77,46,0.3)] font-serif italic text-2xl border-4 border-white transition-all duration-500 bg-[#1A4D2E] text-white hover:scale-105 active:scale-95 disabled:opacity-70 disabled:grayscale"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin mr-3" />
                Securing...
              </>
            ) : (
              <>
                <Save size={24} className="mr-4 text-[#C5A371]" />
                Publish Identity
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}

// Sub Komponen Card Internal
function SectionBox({ title, icon, accent, children }: { title: string, icon: any, accent: string, children: any }) {
  return (
    <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden border-t-4 border-transparent hover:border-current transition-colors">
      <div className="flex items-center gap-5 p-8 border-b border-[#FDF8F3]">
        <div className={cn("p-4 rounded-2xl text-white shadow-lg", accent)}>{icon}</div>
        <h3 className="text-xl font-serif italic font-bold text-[#1A4D2E]">{title}</h3>
      </div>
      <CardContent className="p-10">{children}</CardContent>
    </Card>
  );
}