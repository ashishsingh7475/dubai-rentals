type ListingHighlightsProps = {
  bedrooms: number;
  bathrooms: number;
  furnished: boolean;
  propertyType: string;
  area: string;
};

const Icon = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={["flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800", className].join(" ")}>
    {children}
  </span>
);

export function ListingHighlights({
  bedrooms,
  bathrooms,
  furnished,
  propertyType,
  area,
}: ListingHighlightsProps) {
  const items = [
    {
      icon: (
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: bedrooms === 0 ? "Studio" : `${bedrooms} Bedroom${bedrooms > 1 ? "s" : ""}`,
    },
    {
      icon: (
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        </svg>
      ),
      label: `${bathrooms} Bathroom${bathrooms !== 1 ? "s" : ""}`,
    },
    {
      icon: (
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: area,
    },
    {
      icon: (
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: propertyType.charAt(0).toUpperCase() + propertyType.slice(1),
    },
  ];

  if (furnished) {
    items.push({
      icon: (
        <svg className="h-5 w-5 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      label: "Furnished",
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <Icon>{item.icon}</Icon>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
