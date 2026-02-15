"use client";

import { SaveButton } from "./save-button";

type MobileCTABarProps = {
  listingId: string;
  listingTitle: string;
  listingUrl: string;
  initialSaved: boolean;
  showSave: boolean;
  ownerPhone?: string | null;
  ownerWhatsapp?: string | null;
  contactFormId?: string;
};

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.startsWith("971")) return d;
  if (d.startsWith("0")) return "971" + d.slice(1);
  return "971" + d;
}

export function MobileCTABar({
  listingId,
  listingTitle,
  listingUrl,
  initialSaved,
  showSave,
  ownerPhone,
  ownerWhatsapp,
  contactFormId = "contact-form",
}: MobileCTABarProps) {
  const waNum = ownerWhatsapp || ownerPhone;
  const waMessage = `Hi, I'm interested in "${listingTitle}"\n${listingUrl}`;
  const waHref = waNum
    ? `https://wa.me/${formatPhone(waNum)}?text=${encodeURIComponent(waMessage)}`
    : null;
  const callHref = ownerPhone ? `tel:${ownerPhone.replace(/\D/g, "")}` : null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-zinc-200 bg-white/95 p-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 md:hidden">
      {waHref && (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 font-medium text-white hover:bg-[#20bd5a]"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          </svg>
          WhatsApp
        </a>
      )}
      {!waHref && (
        <a
          href={`#${contactFormId}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-3 font-medium text-background hover:bg-foreground/90"
        >
          Contact
        </a>
      )}
      {callHref && (
        <a
          href={callHref}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-zinc-300 dark:border-zinc-600"
          aria-label="Call"
        >
          <svg className="h-5 w-5 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </a>
      )}
      {showSave && (
        <div className="shrink-0">
          <SaveButton listingId={listingId} initialSaved={initialSaved} variant="detail" />
        </div>
      )}
    </div>
  );
}
