import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { getPublicUrlFromFullPath } from "@/lib/listings/storage";
import { getSavedListingIds } from "@/app/actions/saved";
import { SaveButton } from "@/components/listings/save-button";
import { ListingImageGallery } from "@/components/listings/listing-image-gallery";
import { ListingHighlights } from "@/components/listings/listing-highlights";
import { OwnerCard } from "@/components/listings/owner-card";
import { MobileCTABar } from "@/components/listings/mobile-cta-bar";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: listing } = await supabase
    .from("listings")
    .select("title, area, price, description")
    .eq("id", id)
    .single();

  if (!listing) return { title: "Listing | Dubai Rentals" };

  const title = `${listing.title} · ${listing.area} | Dubai Rentals`;
  const desc =
    (listing.description as string)?.slice(0, 160) ??
    `${listing.title} - AED ${Number(listing.price).toLocaleString()}/mo in ${listing.area}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      type: "website",
    },
  };
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: listing, error },
    savedListingIds,
    { data: { user } },
  ] = await Promise.all([
    supabase.from("listings").select("*").eq("id", id).single(),
    getSavedListingIds(),
    supabase.auth.getUser(),
  ]);

  if (error || !listing) notFound();
  const isSaved = savedListingIds?.includes(listing.id) ?? false;
  const isOwner = user?.id === listing.user_id;

  const imageUrls = (listing.image_urls ?? []).map((url: string) =>
    url.startsWith("http") ? url : getPublicUrlFromFullPath(url)
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dubai-rentals.vercel.app";
  const listingUrl = `${baseUrl}/listings/${listing.id}`;
  const waMessage = `Hi, I'm interested in "${listing.title}"\n${listingUrl}`;
  const waNumber = listing.owner_whatsapp ?? listing.owner_phone ?? null;

  const formatWaPhone = (p: string) => {
    const d = p.replace(/\D/g, "");
    if (d.startsWith("971")) return d;
    if (d.startsWith("0")) return "971" + d.slice(1);
    return "971" + d;
  };

  const showContact = !isOwner;
  const showSave = savedListingIds != null && !isOwner;

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${showContact ? "pb-24 md:pb-0" : ""}`}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Link
          href="/search"
          className="mb-6 inline-flex text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Back to search
        </Link>

        {/* Full-width hero gallery */}
        <div className="relative -mx-4 sm:mx-0 sm:rounded-2xl sm:overflow-hidden sm:border sm:border-zinc-200 dark:sm:border-zinc-800">
          <ListingImageGallery
            images={imageUrls}
            alt={listing.title}
            overlay={
              showSave ? (
                <div className="absolute right-4 top-4 z-10">
                  <SaveButton
                    listingId={listing.id}
                    initialSaved={isSaved}
                    variant="detail"
                  />
                </div>
              ) : null
            }
          />
        </div>

        {/* Airbnb-style two-column layout */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Left column - property info */}
          <div className="min-w-0 flex-1">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
              <span className="rounded-lg bg-zinc-100 px-2 py-1 text-xs font-medium dark:bg-zinc-800">
                {listing.property_type}
              </span>
              <span className="mx-2 text-zinc-400">·</span>
              <span className="text-zinc-600 dark:text-zinc-400">{listing.area}</span>

              <h1 className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-4">
                <ListingHighlights
                  bedrooms={listing.bedrooms}
                  bathrooms={listing.bathrooms}
                  furnished={listing.furnished}
                  propertyType={listing.property_type}
                  area={listing.area}
                />
              </div>

              <h2 className="mt-8 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                About this property
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {listing.description}
              </p>
            </div>
          </div>

          {/* Right column - sticky sidebar */}
          <aside className="lg:w-96 lg:shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Price card */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  AED {Number(listing.price).toLocaleString()}
                  <span className="text-base font-normal text-zinc-500">/month</span>
                </p>
                {waNumber && (
                  <div className="mt-4 w-full">
                    <a
                      href={`https://wa.me/${formatWaPhone(waNumber)}?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-medium text-white hover:bg-[#20bd5a]"
                    >
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Contact on WhatsApp
                    </a>
                  </div>
                )}
              </div>

              {/* Owner card + contact form */}
              {showContact && (
                <div id="contact-form">
                  <OwnerCard
                    listingId={listing.id}
                    listingTitle={listing.title}
                    showContactForm={true}
                  />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      {showContact && (
        <MobileCTABar
          listingId={listing.id}
          listingTitle={listing.title}
          listingUrl={listingUrl}
          initialSaved={isSaved}
          showSave={showSave}
          ownerPhone={listing.owner_phone}
          ownerWhatsapp={listing.owner_whatsapp}
        />
      )}

      {/* Floating WhatsApp - desktop (mobile has CTA bar) */}
      {waNumber && showContact && (
        <a
          href={`https://wa.me/${formatWaPhone(waNumber)}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-4 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/50 md:flex md:bottom-6 md:right-6"
          aria-label="Contact on WhatsApp"
        >
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
        </a>
      )}

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Apartment",
            name: listing.title,
            description: listing.description,
            address: {
              "@type": "PostalAddress",
              addressLocality: listing.area,
              addressRegion: "Dubai",
            },
            numberOfRooms: listing.bedrooms,
            numberOfBathroomsTotal: listing.bathrooms,
            furnishingValue: listing.furnished,
            offers: {
              "@type": "Offer",
              price: listing.price,
              priceCurrency: "AED",
            },
          }),
        }}
      />
    </div>
  );
}
