"use client";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Star,
  Share2,
  MessageCircle,
  ExternalLink,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNav } from "../hooks/useNav";
import { fmt } from "../data/listings";
import {
  TONE_MAP,
  THINGS_TO_KNOW,
  REVIEWS,
} from "../data/propertyDetailData";
import { fetchListingById } from "../api/listings";
import type { ApiListingDetail } from "../api/listings";

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
  fmtV,
}: {
  label: string;
  value: number;
  set: (v: number) => void;
  min: number;
  max: number;
  step: number;
  fmtV: (v: number) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");

  const startEdit = () => {
    setInputVal(String(value));
    setEditing(true);
  };

  const commitEdit = () => {
    const n = parseFloat(inputVal);
    if (!isNaN(n)) set(Math.min(max, Math.max(min, n)));
    setEditing(false);
  };

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11.5px] font-semibold text-ink2 tracking-wide uppercase">
          {label}
        </span>
        {editing ? (
          <input
            type="number"
            value={inputVal}
            min={min}
            max={max}
            step={step}
            autoFocus
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitEdit();
              if (e.key === "Escape") setEditing(false);
            }}
            className="w-28 text-[13px] font-bold text-ink text-right border-b border-coral bg-transparent outline-none font-sans"
          />
        ) : (
          <span
            className="text-[13px] font-bold text-ink font-sans cursor-text hover:text-coral transition-colors"
            onClick={startEdit}
            title="Click to type a value"
          >
            {fmtV(value)}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="w-full accent-sea"
      />
    </div>
  );
}

const TAG_TONES: Record<string, string> = {
  Luxury: "gold",
  Investment: "coral",
  "For Rent": "green",
  Commercial: "sea",
  New: "sea",
};

function PropertyDetailInner() {
  const params = useSearchParams();
  const go = useNav();
  const id = params.get("id") ?? "";

  const [listing, setListing] = useState<ApiListingDetail | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [aPrice, setAPrice] = useState(0);
  const [aDown, setADown] = useState(30);
  const [aRate, setARate] = useState(7);
  const [aTerm, setATerm] = useState(25);

  useEffect(() => {
    if (!id) {
      setLoadError(true);
      return;
    }
    fetchListingById(id)
      .then((data) => {
        setListing(data);
        setAPrice(Number(data.price));
      })
      .catch(() => setLoadError(true));
  }, [id]);

  const mortgage = useMemo(() => {
    const loan = aPrice * (1 - aDown / 100);
    const down = aPrice * (aDown / 100);
    const mr = aRate / 100 / 12;
    const n = aTerm * 12;
    const monthly = mr > 0 ? (loan * (mr * Math.pow(1 + mr, n))) / (Math.pow(1 + mr, n) - 1) : loan / n;
    const totalPaid = monthly * n;
    const totalInterest = totalPaid - loan;
    return { loan, down, monthly, totalPaid, totalInterest };
  }, [aPrice, aDown, aRate, aTerm]);
  const imgs: string[] = listing?.images ?? [];

  const remainingCount = imgs.length - 4;

  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxIdx]);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIdx(null);
      if (e.key === "ArrowLeft") setLightboxIdx((i) => i !== null ? Math.max(0, i - 1) : null);
      if (e.key === "ArrowRight") setLightboxIdx((i) => i !== null ? Math.min(imgs.length - 1, i + 1) : null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, imgs.length]);

  if (loadError)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-muted font-sans">
        <p className="text-[15px]">Property not found.</p>
        <button
          onClick={() => go("search")}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-ink2 text-[13px] font-sans"
        >
          <ArrowLeft size={15} /> Back to search
        </button>
      </div>
    );

  if (!listing)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted font-sans text-[14px]">
        Loading property…
      </div>
    );

  const tagTone = TAG_TONES[listing.tag ?? ""] ?? "sand";

  return (
    <div className="max-w-310 mx-auto px-4 sm:px-6 py-5 pb-20">
      {/* Back */}
      <button
        onClick={() => go("search")}
        className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-ink2 text-[13px] mb-4 font-sans"
      >
        <ArrowLeft size={15} />
        Back to search
      </button>

      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-3 mb-3.5">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {listing.tag && (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONE_MAP[tagTone] ?? TONE_MAP.sand}`}
              >
                {listing.tag}
              </span>
            )}
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full border bg-brand text-white border-brand">
              Verified
            </span>
          </div>
          <h1 className="font-sans text-[clamp(26px,4vw,40px)] font-bold text-ink leading-[1.07] tracking-tight">
            {listing.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
          </h1>
          <div className="flex flex-wrap items-center gap-3.5 text-ink2 text-[14px] mt-2">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {listing.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Star size={15} className="text-gold fill-gold" />
              4.97 · 142 reviews
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-transparent border border-line text-ink text-[13px] font-semibold px-4 py-2.5 rounded-full cursor-pointer font-sans">
          <Share2 size={15} /> Share
        </button>
      </div>

      {/* Gallery */}
      <div className="mb-7 grid grid-cols-[2fr_1fr] sm:grid-cols-[2fr_1fr_1fr] grid-rows-[130px_130px] sm:grid-rows-[172px_172px] gap-2">
        <div
          className="rounded-2xl overflow-hidden row-span-2 bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${imgs[0]})` }}
          onClick={() => setLightboxIdx(0)}
        />
        <div
          className="rounded-xl overflow-hidden bg-cover bg-center cursor-pointer"
          style={{ backgroundImage: `url(${imgs[1]})` }}
          onClick={() => setLightboxIdx(1)}
        />
        <div
          className="rounded-xl overflow-hidden bg-cover bg-center hidden sm:block cursor-pointer"
          style={{ backgroundImage: `url(${imgs[2]})` }}
          onClick={() => setLightboxIdx(2)}
        />
        <div
          className="rounded-xl overflow-hidden bg-cover bg-center hidden sm:block cursor-pointer"
          style={{ backgroundImage: `url(${imgs[3]})` }}
          onClick={() => setLightboxIdx(3)}
        />
        <div
          className="rounded-xl overflow-hidden bg-cover bg-center relative cursor-pointer"
          style={{ backgroundImage: `url(${imgs[4] ?? imgs[1]})` }}
          onClick={() => setLightboxIdx(4)}
        >
          {remainingCount > 0 && (
            <div className="absolute inset-0 grid place-items-center text-white text-[13px] font-semibold font-sans bg-ink/52">
              + {remainingCount} photo{remainingCount !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
        {/* ── LEFT ── */}
        <div>
          {/* Quick stats */}
          <div className="flex flex-wrap gap-6 py-5.5 border-b border-line-soft text-ink text-[15px]">
            {(listing.bedrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={18} />
                {listing.bedrooms} beds
              </span>
            )}
            {(listing.bathrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Bath size={18} />
                {listing.bathrooms} baths
              </span>
            )}
            {listing.area_sqft && (
              <span className="flex items-center gap-1.5">
                <Maximize2 size={18} />
                {listing.area_sqft.toLocaleString()} ft²
              </span>
            )}
            {listing.type && (
              <span className="flex items-center gap-1.5">
                <Building2 size={18} />
                {listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}
              </span>
            )}
            {listing.year_built && (
              <span className="flex items-center gap-1.5">
                <Calendar size={18} />
                Built {listing.year_built}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="font-sans text-[19px] leading-[1.65] text-ink2 py-4 border-b border-line-soft">
            {(() => {
              const raw = listing.description ??
                `Nestled along the pristine shores of ${listing.location.split(",")[0]}, this property is an architectural masterpiece that redefines Caribbean luxury — an extraordinary residence offering an unparalleled fusion of indoor-outdoor living in one of the DR's most sought-after destinations.`
              return raw.toLowerCase().replace(/(?:^|\.\s+)\S/g, (c) => c.toUpperCase())
            })()}
          </p>

          {/* Property details */}
          <h3 className="font-sans text-[22px] font-semibold text-ink mt-7 mb-4">
            Property Details
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              listing.lot_size_sqft && {
                icon: <Layers size={18} />,
                label: "Lot Size",
                value: `${listing.lot_size_sqft.toLocaleString()} ft²`,
              },
              listing.construction_status && {
                icon: <Building2 size={18} />,
                label: "Construction",
                value: listing.construction_status
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()),
              },
              listing.hoa_fee && {
                icon: <MapPin size={18} />,
                label: "HOA Fee",
                value: `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
              },
              listing.roi && {
                icon: <Star size={18} />,
                label: "Est. ROI",
                value: `${listing.roi}% / yr`,
              },
            ]
              .filter(Boolean)
              .map((d: any, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-paper2 border border-line-soft rounded-2xl"
                >
                  <span className="text-ink2 mt-0.5 shrink-0">{d.icon}</span>
                  <div>
                    <div className="text-[11px] font-bold text-ink2 uppercase tracking-wide mb-0.5">
                      {d.label}
                    </div>
                    <div className="font-semibold text-[14px] text-ink">
                      {d.value}
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Boolean attributes */}
          {[
            {
              on: listing.seller_financing,
              label: "Seller Financing Available",
            },
            { on: listing.tax_exempt, label: "CONFOTUR Tax Exempt" },
            { on: listing.gated_community, label: "Gated Community" },
            { on: listing.hoa, label: "HOA Community" },
          ].some((b) => b.on) && (
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                {
                  on: listing.seller_financing,
                  label: "Seller Financing Available",
                },
                { on: listing.tax_exempt, label: "CONFOTUR Tax Exempt" },
                { on: listing.gated_community, label: "Gated Community" },
                { on: listing.hoa, label: "HOA Community" },
              ]
                .filter((b) => b.on)
                .map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                  >
                    <CheckCircle2 size={12} /> {b.label}
                  </span>
                ))}
            </div>
          )}

          {/* Features & amenities */}
          {listing.features.length > 0 && (
            <div className="mt-7">
              <h3 className="font-sans text-[22px] font-semibold text-ink mb-4">
                Property Features
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {listing.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-ink shrink-0" />
                    <span className="text-[14px] text-ink2">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mortgage calculator (sale only) */}
          {listing.transaction !== "rent" && (
            <div className="mt-7 border border-line-soft rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_-18px_rgba(0,16,46,.18)]">
              {/* Header */}
              <div className="px-6 py-4 bg-[linear-gradient(135deg,var(--color-coral)_0%,#a8000d_100%)] text-white">
                <div className="text-[11px] font-bold tracking-[.14em] uppercase">Mortgage Calculator</div>
                <div className="text-[12px] mt-0.5 text-white/70">Estimate your monthly payment for this property</div>
              </div>

              <div className="px-6 pt-5 pb-6">
                {/* Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Slider label="Purchase price" value={aPrice} set={setAPrice} min={50000} max={5000000} step={25000} fmtV={(v) => fmt(v)} />
                  <Slider label="Down payment" value={aDown} set={setADown} min={5} max={80} step={5} fmtV={(v) => `${v}%`} />
                  <Slider label="Interest rate" value={aRate} set={setARate} min={0} max={14} step={0.25} fmtV={(v) => `${v}%`} />
                  <Slider label="Loan term" value={aTerm} set={setATerm} min={5} max={30} step={5} fmtV={(v) => `${v} yrs`} />
                </div>

                {/* Results */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[
                    ["Monthly payment", `${fmt(mortgage.monthly)}/mo`],
                    ["Loan amount", fmt(mortgage.loan)],
                    ["Down payment", fmt(mortgage.down)],
                    ["Total interest", fmt(mortgage.totalInterest)],
                  ].map(([label, value], i) => (
                    <div key={i} className={`border rounded-xl p-4 ${i === 0 ? "bg-coral/10 border-coral/30" : "bg-paper2 border-line-soft"}`}>
                      <div className="text-[10.5px] font-bold text-ink2 uppercase tracking-wide mb-1">{label}</div>
                      <div className={`text-[18px] font-bold ${i === 0 ? "text-coral" : "text-ink"}`}>{value}</div>
                    </div>
                  ))}
                </div>

                <p className="text-[11.5px] text-muted mt-4 leading-[1.55]">
                  Principal & interest only. Does not include taxes, insurance, or HOA fees. Illustrative only, not financial advice.
                </p>
              </div>
            </div>
          )}

          {/* Location */}
          <div className="mt-7">
            <h2 className="font-sans text-[22px] font-semibold text-ink mb-3.5">
              Location
            </h2>
            <div
              className="rounded-2xl overflow-hidden border border-line"
              style={{ height: 300 }}
            >
              {(() => {
                const ALLOWED_HOSTS = new Set([
                  "maps.google.com",
                  "www.google.com",
                  "google.com",
                  "maps.googleapis.com",
                ]);
                const fallback = `https://maps.google.com/maps?q=${encodeURIComponent(listing.location + ", Dominican Republic")}&output=embed`;
                let embedSrc = fallback;
                if (listing.maps_url) {
                  try {
                    const u = new URL(listing.maps_url);
                    if (
                      u.protocol === "https:" &&
                      ALLOWED_HOSTS.has(u.hostname)
                    ) {
                      if (!u.searchParams.has("output"))
                        u.searchParams.set("output", "embed");
                      embedSrc = u.toString();
                    }
                  } catch {
                    /* invalid URL — use fallback */
                  }
                }
                return (
                  <iframe
                    src={embedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-scripts allow-same-origin"
                  />
                );
              })()}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[12.5px] text-ink2 leading-[1.55]">
                Exact location shared after inquiry.
              </p>
              {listing.maps_url && (
                <a
                  href={listing.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-sea hover:underline"
                >
                  Open in Google Maps <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Things to know */}
          <div className="mt-7">
            <h2 className="font-sans text-[22px] font-semibold text-ink mb-3.5">
              Things to know
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {THINGS_TO_KNOW.map(([title, items], i) => (
                <div key={i}>
                  <div className="text-[14px] font-bold text-ink mb-2.5">
                    {title}
                  </div>
                  {items.map((it, j) => (
                    <div
                      key={j}
                      className="text-[13px] text-ink2 leading-[1.7]"
                    >
                      {it}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-7">
            <div className="flex items-center gap-2.5 mb-4">
              <Star size={20} className="text-gold fill-gold" />
              <h2 className="font-sans text-[22px] font-semibold text-ink">
                4.97 · 142 reviews
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REVIEWS.map((r, i) => (
                <div
                  key={i}
                  className="bg-paper2 border border-line-soft rounded-2xl p-4"
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span
                      className={`w-8 h-8 rounded-full grid place-items-center text-[12px] font-bold text-white shrink-0 ${r.colClass}`}
                    >
                      {r.ini}
                    </span>
                    <div>
                      <div className="text-[13.5px] font-semibold text-ink">
                        {r.name}
                      </div>
                      <div className="flex gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            size={10}
                            className="text-gold fill-gold"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[13px] text-ink2 leading-[1.6]">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-2 bg-transparent border border-line text-ink text-[13px] font-semibold px-4 py-2.5 rounded-full cursor-pointer font-sans">
              Show all 142 reviews
            </button>
          </div>
        </div>

        {/* ── Lightbox ── */}
        {lightboxIdx !== null && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={() => setLightboxIdx(null)}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIdx(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Counter */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 text-white/60 text-[13px] font-sans select-none">
              {lightboxIdx + 1} / {imgs.length}
            </div>

            {/* Prev */}
            {lightboxIdx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx - 1); }}
                className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Image */}
            <img
              src={imgs[lightboxIdx]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[88vh] object-contain rounded-xl shadow-2xl select-none"
            />

            {/* Next */}
            {lightboxIdx < imgs.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(lightboxIdx + 1); }}
                className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {/* Thumbnail strip */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {imgs.map((src: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setLightboxIdx(i)}
                  className={`shrink-0 w-14 h-10 rounded-md bg-cover bg-center cursor-pointer transition-all ${i === lightboxIdx ? "ring-2 ring-white opacity-100" : "opacity-40 hover:opacity-70"}`}
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── RIGHT sticky sidebar ── */}
        <div className="lg:sticky lg:top-22.5 border border-line rounded-2xl p-5.5 bg-white shadow-[0_18px_44px_-30px_rgba(0,16,46,.4)]">
          {/* Transaction type label */}
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${listing.transaction === "rent" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
            >
              {listing.transaction === "rent" ? "For Rent" : "For Sale"}
            </span>
          </div>

          {listing.transaction !== "rent" ? (
            <>
              <div className="text-[32px] font-bold text-ink">
                {fmt(listing.price)}{" "}
                <span className="text-[13px] text-ink2 mt-1">
                  Sale price{listing.tax_exempt ? " · CONFOTUR eligible" : ""}
                </span>
              </div>

              {[
                listing.roi && ["Est. ROI", `${listing.roi}% / yr`],
                listing.hoa_fee && [
                  "HOA Fee",
                  `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
                ],
                listing.tax_exempt && ["Tax", "CONFOTUR exempt (IPI waived)"],
              ]
                .filter(Boolean)
                .map(([l, v]: any, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3.5 border-b border-line-soft text-[13.5px]"
                  >
                    <span className="text-ink2">{l}</span>
                    <span className="text-ink font-semibold">{v}</span>
                  </div>
                ))}
              <button
                onClick={() => go("calculator")}
                className="w-full flex justify-center items-center py-3 mt-4 rounded-full border-none cursor-pointer text-white font-sans text-[13.5px] font-bold bg-coral"
              >
                Analyze this deal
              </button>
            </>
          ) : (
            <>
              <div className="font-sans text-[30px] font-semibold text-ink">
                {fmt(listing.price)}{" "}
                <span className="text-[16px] text-ink2 font-sans font-normal">
                  / mo
                </span>
              </div>
              {[
                listing.hoa_fee && [
                  "HOA Fee",
                  `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
                ],
              ]
                .filter(Boolean)
                .map(([l, v]: any, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-3.5 border-b border-line-soft text-[13.5px]"
                  >
                    <span className="text-ink2">{l}</span>
                    <span className="text-ink font-semibold">{v}</span>
                  </div>
                ))}
              <button
                onClick={() => go("contact")}
                className="w-full flex justify-center items-center py-3 mt-4 rounded-full border-none cursor-pointer text-white font-sans text-[13.5px] font-bold bg-coral"
              >
                Request to book
              </button>
            </>
          )}

          {/* Submitter / Agent contact */}
          {listing.submitted_by_name && (
            <div className="mt-5 pt-4 border-t border-line-soft">
              <div className="text-[10.5px] font-bold text-ink2 uppercase tracking-wide mb-3">
                Listed by
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full grid place-items-center font-bold font-sans shrink-0 text-white text-[14px]"
                  style={{ background: "var(--color-sea)" }}
                >
                  {listing.submitted_by_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-[14px] text-ink leading-tight">
                    {listing.submitted_by_name}
                  </div>
                  {listing.submitted_by_email && (
                    <div className="text-[12px] text-ink2 mt-0.5">
                      {listing.submitted_by_email}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2.5">
                <button className="flex-1 justify-center flex items-center gap-1.5 bg-transparent border border-line text-ink px-3 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans hover:bg-paper2 transition-colors">
                  <MessageCircle size={14} /> Message
                </button>
                <button className="flex-1 justify-center flex items-center gap-1.5 bg-transparent border border-line text-ink px-3 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans hover:bg-paper2 transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetail() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-muted font-sans text-[14px]">
          Loading property…
        </div>
      }
    >
      <PropertyDetailInner />
    </Suspense>
  );
}
