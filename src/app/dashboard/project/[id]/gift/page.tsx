"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ImageUpload from "@/components/ui/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  Camera,
  Check,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  MapPin,
  Pencil,
  RefreshCw,
  ShoppingBag,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface GiftAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  qr_code_url?: string;
}

interface Wishlist {
  id: string;
  item_name: string;
  marketplace_url: string;
  image_url?: string;
}

export default function GiftPage() {
  const supabase = createClient();
  const params = useParams();
  const projectId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // --- STATE REKENING ---
  const [gifts, setGifts] = useState<GiftAccount[]>([]);
  const [bankName, setBankName] = useState("");
  const [accNumber, setAccNumber] = useState("");
  const [accHolder, setAccHolder] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [isAddingAcc, setIsAddingAcc] = useState(false);

  // --- STATE WISHLIST ---
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [manualImage, setManualImage] = useState("");
  const [isAddingWish, setIsAddingWish] = useState(false);
  const [editingWishId, setEditingWishId] = useState<string | null>(null);

  // --- STATE SETTINGS ---
  const [isGiftEnabled, setIsGiftEnabled] = useState(false);
  const [giftAddress, setGiftAddress] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const [giftRes, wishRes, invRes] = await Promise.all([
        supabase
          .from("gifts")
          .select("*")
          .eq("invitation_id", projectId)
          .order("created_at", { ascending: true }),
        supabase
          .from("kado_wishlist")
          .select("*")
          .eq("invitation_id", projectId)
          .order("created_at", { ascending: false }),
        supabase
          .from("invitations")
          .select("gift_address, gift_receiver_name, is_gift_enabled")
          .eq("id", projectId)
          .single(),
      ]);

      if (giftRes.data) setGifts(giftRes.data);
      if (wishRes.data) setWishlists(wishRes.data);
      if (invRes.data) {
        setGiftAddress(invRes.data.gift_address || "");
        setReceiverName(invRes.data.gift_receiver_name || "");
        setIsGiftEnabled(invRes.data.is_gift_enabled || false);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [projectId, supabase]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("invitations")
      .update({
        gift_address: giftAddress,
        gift_receiver_name: receiverName,
        is_gift_enabled: isGiftEnabled,
      })
      .eq("id", projectId);
    if (error) toast.error("Update Failed");
    else toast.success("Settings Updated!");
    setSaving(false);
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accNumber || !accHolder)
      return toast.error("Fill all fields!");
    setIsAddingAcc(true);
    const { error } = await supabase.from("gifts").insert({
      invitation_id: projectId,
      bank_name: bankName,
      account_number: accNumber,
      account_holder: accHolder,
      qr_code_url: qrCode || null,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Account Added!");
      setBankName("");
      setAccNumber("");
      setAccHolder("");
      setQrCode("");
      fetchData();
    }
    setIsAddingAcc(false);
  };

  const handleEditClick = (item: Wishlist) => {
    setEditingWishId(item.id);
    setItemName(item.item_name);
    setItemUrl(item.marketplace_url);
    setManualImage(item.image_url || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetWishlistForm = () => {
    setEditingWishId(null);
    setItemName("");
    setItemUrl("");
    setManualImage("");
  };

  const handleAddWishlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemUrl) return toast.error("Name & Link required!");
    setIsAddingWish(true);
    let finalImageUrl = manualImage;

    if (!finalImageUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      try {
        const response = await fetch(
          `https://api.microlink.io?url=${encodeURIComponent(itemUrl)}&screenshot=true&embed=screenshot.url`,
          { signal: controller.signal },
        );
        const result = await response.json();
        if (result.data?.image?.url) {
          finalImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(result.data.image.url)}&w=400&h=400&fit=cover`;
        } else if (result.data?.screenshot?.url) {
          finalImageUrl = `https://wsrv.nl/?url=${encodeURIComponent(result.data.screenshot.url)}&w=400&h=400&fit=cover`;
        }
      } catch (err) {
        const domain = new URL(itemUrl).hostname;
        finalImageUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      } finally {
        clearTimeout(timeoutId);
      }
    }

    const payload = {
      item_name: itemName,
      marketplace_url: itemUrl,
      image_url: finalImageUrl,
    };

    const { error } = editingWishId
      ? await supabase
          .from("kado_wishlist")
          .update(payload)
          .eq("id", editingWishId)
      : await supabase
          .from("kado_wishlist")
          .insert({ ...payload, invitation_id: projectId });

    if (error) toast.error("Action Failed");
    else {
      toast.success(editingWishId ? "Updated!" : "Added!");
      resetWishlistForm();
      fetchData();
    }
    setIsAddingWish(false);
  };

  const handleDeleteItem = async (table: string, id: string) => {
    if (!confirm("Delete this item?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) toast.error("Delete Failed");
    else {
      toast.success("Deleted!");
      fetchData();
    }
  };

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#FDF8F3]">
        <div className="relative w-24 h-24 mb-4">
          <Image
            src="/logo-Vittya.png"
            alt="Logo"
            fill
            className="object-contain animate-pulse"
          />
        </div>
        <Loader2 className="animate-spin text-[#1A4D2E] w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#1A4D2E] pb-32">
      {/* BRANDED HEADER */}
      <header className="sticky top-0 z-100 bg-[#FDF8F3]/80 backdrop-blur-md border-b border-[#E8DFD3] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <Image
              src="/logo-Vittya.png"
              alt="Vittya"
              width={50}
              height={50}
              className="drop-shadow-sm"
            />
            <div className="h-10 w-px bg-[#E8DFD3] hidden md:block" />
            <div className="text-left">
              <h1 className="text-2xl font-serif italic font-bold tracking-tight text-[#1A4D2E]">
                Digital Gift <span className="text-[#C5A371]">STATION</span>
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A9907E]">
                Exclusive Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/50 px-6 py-2 rounded-full border border-[#E8DFD3] shadow-inner">
            <span
              className={`text-[10px] font-black uppercase italic ${isGiftEnabled ? "text-[#1A4D2E]" : "text-slate-400"}`}
            >
              {isGiftEnabled ? "System Active" : "System Disabled"}
            </span>
            <Switch
              checked={isGiftEnabled}
              onCheckedChange={setIsGiftEnabled}
              className="data-[state=checked]:bg-[#1A4D2E]"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 mt-12 grid lg:grid-cols-12 gap-12">
        {/* LEFT COLUMN: BRANDED FORMS */}
        <div className="lg:col-span-4 space-y-8">
          {/* ADDRESS CARD */}
          <Card
            className={`overflow-hidden rounded-4xl border-none shadow-xl transition-all duration-500 ${!isGiftEnabled && "opacity-30 grayscale pointer-events-none"}`}
          >
            <div className="bg-[#1A4D2E] p-6 text-white">
              <h3 className="flex items-center gap-2 font-serif italic text-lg tracking-wide">
                <MapPin size={20} className="text-[#C5A371]" /> Shipping Address
              </h3>
            </div>
            <CardContent className="p-8 space-y-4 bg-white">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-[#A9907E]">
                  Receiver Name
                </Label>
                <Input
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] focus:ring-[#1A4D2E]"
                  placeholder="e.g. Vittya & Co"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-[#A9907E]">
                  Full Address
                </Label>
                <Textarea
                  value={giftAddress}
                  onChange={(e) => setGiftAddress(e.target.value)}
                  className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] min-h-25"
                  placeholder="Jl. Kemang Raya No. 1..."
                />
              </div>
              <Button
                onClick={handleSaveSettings}
                disabled={saving}
                className="w-full bg-[#1A4D2E] hover:bg-[#143d24] text-[#FDF8F3] rounded-xl h-12 font-bold tracking-widest uppercase text-xs"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "SAVE SETTINGS"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* WISHLIST FORM */}
          <Card
            className={`rounded-4xl border-none shadow-xl bg-white p-8 space-y-6 transition-all border-t-4 ${editingWishId ? "border-[#C5A371]" : "border-[#1A4D2E]"} ${!isGiftEnabled && "opacity-20 pointer-events-none"}`}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-serif italic text-xl flex items-center gap-2">
                {editingWishId ? (
                  <Pencil className="text-[#C5A371]" />
                ) : (
                  <ShoppingBag className="text-[#1A4D2E]" />
                )}
                {editingWishId ? "Edit Item" : "Add Wishlist"}
              </h3>
              {editingWishId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetWishlistForm}
                  className="rounded-full"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <form onSubmit={handleAddWishlist} className="space-y-4">
              <Input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Product Name"
                className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] h-12 font-medium"
              />
              <Input
                value={itemUrl}
                onChange={(e) => setItemUrl(e.target.value)}
                placeholder="Marketplace Link (Shopee/Tokopedia)"
                className="rounded-xl bg-[#FDF8F3] border-[#E8DFD3] h-12 text-[#C5A371]"
              />
              <div className="space-y-2 p-4 bg-[#FDF8F3] rounded-2xl border border-dashed border-[#E8DFD3]">
                <Label className="text-[9px] font-bold uppercase text-[#A9907E] flex items-center gap-2 mb-2">
                  <UploadCloud size={14} /> Image Override (Optional)
                </Label>
                <ImageUpload
                  userId={userId}
                  invitationId={projectId}
                  assetType="wishlist"
                  value={manualImage}
                  onChange={setManualImage}
                  onRemove={() => setManualImage("")}
                />
              </div>
              <Button
                disabled={isAddingWish}
                type="submit"
                className={`w-full h-14 rounded-2xl font-black italic tracking-widest text-[11px] uppercase transition-all shadow-lg ${editingWishId ? "bg-[#C5A371] hover:bg-[#b39263]" : "bg-[#1A4D2E] hover:bg-[#143d24]"}`}
              >
                {isAddingWish ? (
                  <Loader2 className="animate-spin" />
                ) : editingWishId ? (
                  "Update Wishlist"
                ) : (
                  "Add to Gallery"
                )}
              </Button>
            </form>
          </Card>

          {/* REKENING FORM */}
          <Card className="rounded-4xl border-none shadow-xl bg-white p-8 space-y-6">
            <h3 className="font-serif italic text-xl flex items-center gap-2">
              <CreditCard className="text-[#1A4D2E]" /> Bank Account
            </h3>
            <form onSubmit={handleAddAccount} className="space-y-3">
              <Input
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="Bank Name"
                className="rounded-xl bg-[#FDF8F3] border-none h-11"
              />
              <Input
                value={accNumber}
                onChange={(e) => setAccNumber(e.target.value)}
                placeholder="Account Number"
                className="rounded-xl bg-[#FDF8F3] border-none h-11 font-mono"
              />
              <Input
                value={accHolder}
                onChange={(e) => setAccHolder(e.target.value)}
                placeholder="Under Name"
                className="rounded-xl bg-[#FDF8F3] border-none h-11"
              />
              <ImageUpload
                userId={userId}
                invitationId={projectId}
                assetType="qris"
                value={qrCode}
                onChange={setQrCode}
                onRemove={() => setQrCode("")}
              />
              <Button
                disabled={isAddingAcc}
                type="submit"
                className="w-full bg-[#1A4D2E] text-white rounded-xl h-12 font-bold text-xs uppercase tracking-widest"
              >
                SAVE ACCOUNT
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT COLUMN: PREVIEW GALLERY */}
        <div className="lg:col-span-8 space-y-16">
          <section className="space-y-8">
            <h2 className="text-4xl font-serif italic text-[#1A4D2E] border-l-4 border-[#C5A371] pl-6">
              Wishlist{" "}
              <span className="font-sans font-black text-[#C5A371] uppercase text-2xl not-italic ml-2 tracking-tighter">
                Gallery
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {wishlists.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-700 hover:shadow-2xl ${editingWishId === item.id ? "border-[#C5A371] ring-4 ring-[#C5A371]/10 scale-95" : "border-[#E8DFD3]"}`}
                >
                  <div className="h-64 bg-[#FDF8F3] relative overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={item.item_name}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#A9907E] gap-2">
                        <Camera size={40} strokeWidth={1} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          No Preview
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-[#1A4D2E] shadow-xl hover:bg-[#1A4D2E] hover:text-white transition-all"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteItem("kado_wishlist", item.id)
                        }
                        className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 shadow-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h4 className="font-bold text-sm text-[#1A4D2E] mb-6 line-clamp-2 min-h-10 uppercase tracking-tight">
                      {item.item_name}
                    </h4>
                    <a
                      href={item.marketplace_url}
                      target="_blank"
                      className="mt-auto py-4 bg-[#1A4D2E] text-[#FDF8F3] text-center rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A371] transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                      VISIT STORE <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-4xl font-serif italic text-[#1A4D2E] border-l-4 border-[#1A4D2E] pl-6">
              Digital{" "}
              <span className="font-sans font-black text-[#A9907E] uppercase text-2xl not-italic ml-2 tracking-tighter">
                Accounts
              </span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white p-10 rounded-[3rem] border border-[#E8DFD3] shadow-sm relative group hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#1A4D2E]" />
                  <div className="flex justify-between mb-8 items-start">
                    <span className="px-4 py-1.5 bg-[#FDF8F3] text-[#1A4D2E] rounded-lg text-[10px] font-bold uppercase border border-[#E8DFD3]">
                      {gift.bank_name}
                    </span>
                    <button
                      onClick={() => handleDeleteItem("gifts", gift.id)}
                      className="text-[#E8DFD3] hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <p className="text-4xl font-mono font-bold tracking-tighter text-[#1A4D2E]">
                      {gift.account_number}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(gift.account_number, gift.id)
                      }
                      className="p-2 bg-[#FDF8F3] rounded-lg hover:bg-[#E8DFD3] transition-colors"
                    >
                      {copiedId === gift.id ? (
                        <Check size={16} className="text-green-600" />
                      ) : (
                        <Copy size={16} className="text-[#A9907E]" />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] font-bold text-[#A9907E] uppercase italic tracking-[0.2em]">
                    A.N. {gift.account_holder}
                  </p>
                  {gift.qr_code_url && (
                    <div className="mt-8 p-4 bg-[#FDF8F3] inline-block rounded-3xl border border-[#E8DFD3]">
                      <img
                        src={gift.qr_code_url}
                        className="w-28 h-28 object-contain mix-blend-multiply"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* SYNC INDICATOR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-3 bg-[#1A4D2E] text-[#FDF8F3] rounded-full shadow-2xl flex items-center gap-4 z-100 border border-[#C5A371]/30">
        <RefreshCw size={14} className="animate-spin text-[#C5A371]" />
        <p className="text-[9px] font-bold uppercase tracking-[0.3em] italic">
          Vittya Cloud Synchronized
        </p>
      </div>
    </div>
  );
}
