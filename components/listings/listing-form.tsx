"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/listings/image-upload";
import { createListing, updateListing } from "@/app/actions/listings";
import {
  PROPERTY_TYPES,
  DUBAI_AREAS,
  type Listing,
  type PropertyType,
} from "@/types/database";

type ListingFormProps = {
  mode: "create" | "edit";
  listing?: Listing | null;
  userId: string;
};

export function ListingForm({ mode, listing, userId }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [price, setPrice] = useState(listing?.price?.toString() ?? "");
  const [propertyType, setPropertyType] = useState<PropertyType>(
    listing?.property_type ?? "apartment"
  );
  const [area, setArea] = useState(listing?.area ?? "");
  const [bedrooms, setBedrooms] = useState(listing?.bedrooms?.toString() ?? "0");
  const [bathrooms, setBathrooms] = useState(listing?.bathrooms?.toString() ?? "0");
  const [furnished, setFurnished] = useState(listing?.furnished ?? false);
  const [imageUrls, setImageUrls] = useState<string[]>(listing?.image_urls ?? []);
  const [ownerPhone, setOwnerPhone] = useState(listing?.owner_phone ?? "");
  const [ownerWhatsapp, setOwnerWhatsapp] = useState(listing?.owner_whatsapp ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("description", description.trim());
    formData.set("price", price);
    formData.set("property_type", propertyType);
    formData.set("area", area.trim());
    formData.set("bedrooms", bedrooms);
    formData.set("bathrooms", bathrooms);
    formData.set("furnished", String(furnished));
    formData.set("image_urls", JSON.stringify(imageUrls));
    formData.set("owner_phone", ownerPhone.trim() || "");
    formData.set("owner_whatsapp", ownerWhatsapp.trim() || "");

    try {
      if (mode === "create") {
        const result = await createListing(formData);
        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        router.push("/dashboard/listings");
        router.refresh();
      } else if (listing?.id) {
        const result = await updateListing(listing.id, formData);
        if (result.error) {
          setError(result.error);
          setLoading(false);
          return;
        }
        router.push("/dashboard/listings");
        router.refresh();
      }
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <Input
        label="Title"
        placeholder="e.g. Spacious Marina apartment"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        disabled={loading}
      />
      <Textarea
        label="Description"
        placeholder="Describe the property..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        disabled={loading}
        rows={4}
      />
      <Input
        type="number"
        min={0}
        step={0.01}
        label="Price (AED / month)"
        placeholder="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        disabled={loading}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Property type
        </label>
        <select
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value as PropertyType)}
          disabled={loading}
          className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base dark:border-zinc-600 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          {PROPERTY_TYPES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Area
        </label>
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          required
          disabled={loading}
          className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-base dark:border-zinc-600 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="">Select area</option>
          {DUBAI_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          type="number"
          min={0}
          label="Bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          disabled={loading}
        />
        <Input
          type="number"
          min={0}
          label="Bathrooms"
          value={bathrooms}
          onChange={(e) => setBathrooms(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="furnished"
          checked={furnished}
          onChange={(e) => setFurnished(e.target.checked)}
          disabled={loading}
          className="h-4 w-4 rounded border-zinc-300 text-foreground focus:ring-foreground"
        />
        <label htmlFor="furnished" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Furnished
        </label>
      </div>

      <ImageUpload
        listingId={listing?.id ?? null}
        userId={userId}
        value={imageUrls}
        onChange={setImageUrls}
        disabled={loading}
      />

      <div className="border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Contact info (for WhatsApp & Call buttons)
        </h3>
        <div className="space-y-4">
          <Input
            type="tel"
            label="Phone"
            placeholder="+971 50 123 4567"
            value={ownerPhone}
            onChange={(e) => setOwnerPhone(e.target.value)}
            disabled={loading}
          />
          <Input
            type="tel"
            label="WhatsApp (optional if same as phone)"
            placeholder="+971 50 123 4567"
            value={ownerWhatsapp}
            onChange={(e) => setOwnerWhatsapp(e.target.value)}
            disabled={loading}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
          Visitors can contact you directly via WhatsApp or call if you add your number.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={loading} size="lg">
          {mode === "create" ? "Create listing" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
