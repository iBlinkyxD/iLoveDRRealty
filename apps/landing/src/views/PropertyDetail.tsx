"use client";
import { Suspense, useState, useMemo, useEffect, useRef, type FormEvent } from "react";
import DOMPurify from "dompurify";
import { useSearchParams } from "next/navigation";
import { GoogleMap, OverlayView, useJsApiLoader } from "@react-google-maps/api";
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
  Link2,
  Video,
  Box,
} from "lucide-react";
import { useNav } from "../hooks/useNav";
import { fmt } from "../data/listings";
import { TONE_MAP } from "../data/propertyDetailData";
import { fetchListingById, recordListingView } from "../api/listings";
import type { ApiListingDetail } from "../api/listings";
import { submitInquiry } from "../api/inquiries";
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import { createBooking } from "../api/bookings";
import { getMe } from "../api/auth";

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

const MAP_STYLES: google.maps.MapTypeStyle[] = [
  { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#f0ede8" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#e4dfd8" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#cfe0f0" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#f7f5f2" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#d8d3cc" }] },
]

function parseLatLng(url: string): { lat: number; lng: number } | null {
  try {
    // Format 1: /maps/place/.../@lat,lng,zoom
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
    // Format 2: ?q=lat,lng or &q=lat,lng
    const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  } catch { /* ignore */ }
  return null
}

function PropertyMap({ mapsUrl, locationName, latitude, longitude }: {
  mapsUrl: string | null
  locationName: string
  latitude: number | null
  longitude: number | null
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""
  const coords: { lat: number; lng: number } | null =
    latitude != null && longitude != null
      ? { lat: latitude, lng: longitude }
      : mapsUrl ? parseLatLng(mapsUrl) : null

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "google-map-script",
  })

  if (!apiKey || !coords) {
    // Fallback: iframe embed by location name or maps_url
    const ALLOWED_HOSTS = new Set(["maps.google.com", "www.google.com", "google.com", "maps.googleapis.com"])
    const fallback = `https://maps.google.com/maps?q=${encodeURIComponent(locationName + ", Dominican Republic")}&output=embed`
    let embedSrc = fallback
    if (mapsUrl) {
      try {
        const u = new URL(mapsUrl)
        if (u.protocol === "https:" && ALLOWED_HOSTS.has(u.hostname)) {
          if (!u.searchParams.has("output")) u.searchParams.set("output", "embed")
          embedSrc = u.toString()
        }
      } catch { /* invalid URL */ }
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
    )
  }

  if (!isLoaded) {
    return <div className="w-full h-full bg-paper2 animate-pulse rounded-2xl" />
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={coords}
      zoom={15}
      options={{ styles: MAP_STYLES, disableDefaultUI: false, zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
    >
      <OverlayView
        position={coords}
        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
        getPixelPositionOffset={(w, h) => ({ x: -w / 2, y: -h })}
      >
        <div style={{ overflow: "visible", whiteSpace: "nowrap" }}>
          <div style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "default",
            userSelect: "none",
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: "#00102e",
              boxShadow: "0 3px 12px rgba(0,16,46,0.45)",
              border: "2.5px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <div style={{ transform: "rotate(45deg)", width: 10, height: 10, borderRadius: "50%", background: "white" }} />
            </div>
            <div style={{ width: 2, height: 6, background: "#00102e", borderRadius: 2, marginTop: -1 }} />
          </div>
        </div>
      </OverlayView>
    </GoogleMap>
  )
}

const TAG_TONES: Record<string, string> = {
  Luxury: "gold",
  Investment: "coral",
  "For Rent": "green",
  Commercial: "sea",
  New: "sea",
};

function safeUrl(u: string): string | null {
  try {
    const p = new URL(u);
    return p.protocol === "https:" || p.protocol === "http:" ? p.href : null;
  } catch {
    return null;
  }
}

function youtubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let vid: string | null = null;
    if (u.hostname === "youtu.be") {
      vid = u.pathname.slice(1).split("/")[0];
    } else if (u.hostname === "www.youtube.com" || u.hostname === "youtube.com") {
      if (u.pathname === "/watch") {
        vid = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        vid = u.pathname.slice(7).split("/")[0];
      } else if (u.pathname.startsWith("/shorts/")) {
        vid = u.pathname.slice(8).split("/")[0];
      }
    }
    return vid ? `https://www.youtube.com/embed/${vid}` : null;
  } catch {
    return null;
  }
}

const DEPOSIT_LABELS: Record<string, string> = {
  first: "First month's rent",
  last: "Last month's rent",
  first_last: "First + Last month's rent",
  none: "No deposit required",
};

function PropertyDetailInner() {
  const params = useSearchParams();
  const go = useNav();
  const id = params.get("id") ?? "";

  const [listing, setListing] = useState<ApiListingDetail | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [dopRate, setDopRate] = useState(59.5);
  const [currency, setCurrency] = useState<'USD' | 'DOP'>('DOP');
  const [aPrice, setAPrice] = useState(0);
  const [aDown, setADown] = useState(30);
  const [aRate, setARate] = useState(7);
  const [aTerm, setATerm] = useState(25);

  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [inquirySending, setInquirySending] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({ checkIn: '', checkOut: '', guests: 1, notes: '' });
  const [bookingSending, setBookingSending] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [me, setMe] = useState<{ display_name: string; email: string; phone: string | null; avatar_url: string | null } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [galleryTab, setGalleryTab] = useState<'photos' | '3dtour'>('photos');
  const shareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getMe().then(data => setMe(data)).catch(() => {})
  }, [])

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => { if (d.rates?.DOP) setDopRate(d.rates.DOP) })
      .catch(() => {})
  }, []);

  useEffect(() => {
    if (!id) {
      setLoadError(true);
      return;
    }
    fetchListingById(id)
      .then((data) => {
        setListing(data);
        setAPrice(Number(data.price));
        recordListingView(id).catch(() => {});
      })
      .catch(() => setLoadError(true));
  }, [id]);

  const fmtM = (v: number) => currency === 'DOP'
    ? `RD$${Math.round(v * dopRate).toLocaleString("en-US")}`
    : `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

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
  const handleInquiry = async (e: FormEvent) => {
    e.preventDefault()
    setInquirySending(true)
    try {
      await submitInquiry({ listing_id: id, name: inquiryForm.name, email: inquiryForm.email, phone: inquiryForm.phone || undefined, message: inquiryForm.message })
      setInquirySent(true)
    } catch { /* keep form open */ }
    finally { setInquirySending(false) }
  }

  const handleBooking = async (e: FormEvent) => {
    e.preventDefault()
    setBookingSending(true)
    setBookingError('')
    try {
      await createBooking({ listing_id: id, check_in: bookingForm.checkIn, check_out: bookingForm.checkOut, guests: bookingForm.guests, notes: bookingForm.notes || undefined })
      setBookingSent(true)
    } catch (err: any) {
      setBookingError(err?.response?.status === 401 ? 'Please log in to request a booking.' : 'Something went wrong. Please try again.')
    } finally { setBookingSending(false) }
  }

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

  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(e.target as Node)) setShareOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [shareOpen]);

  async function copyShareLink() {
    const url = window.location.href;
    try { await navigator.clipboard.writeText(url); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => { setCopied(false); setShareOpen(false); }, 1500);
  }

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
      <div className="mb-3.5">
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          {(listing.tags?.length ? listing.tags : listing.tag ? [listing.tag] : []).map(t => {
            const tone = TAG_TONES[t] ?? "sand";
            return (
              <span key={t} className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${TONE_MAP[tone] ?? TONE_MAP.sand}`}>
                {t}
              </span>
            );
          })}
          <div className="relative ml-auto" ref={shareRef}>
            <button
              onClick={() => setShareOpen(s => !s)}
              className="flex items-center gap-2 bg-transparent border border-line text-ink text-[13px] font-semibold px-4 py-2 rounded-full cursor-pointer font-sans hover:bg-paper2 transition-colors"
            >
              <Share2 size={14} /> Share
            </button>
            {shareOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 bg-white border border-line rounded-2xl shadow-[0_8px_30px_-8px_rgba(0,16,46,.2)] z-20 overflow-hidden">
                {[
                  {
                    label: copied ? "Copied!" : "Copy Link",
                    icon: <Link2 size={14} />,
                    onClick: copyShareLink,
                  },
                  {
                    label: "Twitter / X",
                    icon: <ExternalLink size={14} />,
                    href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(listing.title)}`,
                  },
                  {
                    label: "Facebook",
                    icon: <ExternalLink size={14} />,
                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`,
                  },
                  {
                    label: "Instagram",
                    icon: <ExternalLink size={14} />,
                    href: "https://www.instagram.com/",
                  },
                ].map(item =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setShareOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-ink hover:bg-paper2 transition-colors font-sans"
                    >
                      <span className="text-ink2">{item.icon}</span>
                      {item.label}
                    </a>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.onClick}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-ink hover:bg-paper2 transition-colors cursor-pointer bg-transparent border-none font-sans text-left"
                    >
                      <span className="text-ink2">{item.icon}</span>
                      {item.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>
        <h1 className="font-sans text-[clamp(26px,4vw,40px)] font-bold text-ink leading-[1.07] tracking-tight">
          {listing.title.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
        </h1>
        <div className="flex flex-wrap items-center gap-3.5 text-ink2 text-[14px] mt-2">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} />
            {listing.location}
          </span>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-7">
        {listing.tour_3d_url && safeUrl(listing.tour_3d_url) && (
          <div className="flex gap-1 mb-3">
            <button
              onClick={() => setGalleryTab('photos')}
              className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${galleryTab === 'photos' ? 'bg-ink text-white' : 'bg-paper2 text-ink2 hover:bg-paper'}`}
            >
              Photos
            </button>
            <button
              onClick={() => setGalleryTab('3dtour')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors ${galleryTab === '3dtour' ? 'bg-ink text-white' : 'bg-paper2 text-ink2 hover:bg-paper'}`}
            >
              <Box size={13} />
              3D Tour
            </button>
          </div>
        )}
        {galleryTab === '3dtour' && listing.tour_3d_url && safeUrl(listing.tour_3d_url) ? (
          <div className="rounded-2xl overflow-hidden aspect-video">
            <iframe
              src={safeUrl(listing.tour_3d_url)!}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="3D Tour"
            />
          </div>
        ) : (
          <div className="grid grid-cols-[2fr_1fr] sm:grid-cols-[2fr_1fr_1fr] grid-rows-[130px_130px] sm:grid-rows-[172px_172px] gap-2">
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
        )}
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
          {(() => {
            const fallback = `<p>Nestled along the pristine shores of ${listing.location.split(",")[0]}, this property is an architectural masterpiece that redefines Caribbean luxury — an extraordinary residence offering an unparalleled fusion of indoor-outdoor living in one of the DR's most sought-after destinations.</p>`
            const raw = listing.description ?? fallback
            // Support both plain-text (legacy) and Tiptap HTML
            const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
            const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
            return (
              <div
                className="listing-prose font-sans py-4 border-b border-line-soft"
                dangerouslySetInnerHTML={{ __html: safe }}
              />
            )
          })()}

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
                value: currency === 'DOP'
                  ? `RD$${Math.round(Number(listing.hoa_fee) * dopRate).toLocaleString('en-US')} / mo`
                  : `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
              },
              listing.roi && {
                icon: <Star size={18} />,
                label: "Est. ROI",
                value: `${listing.roi}% / yr`,
              },
              listing.seller_financing && {
                icon: <CheckCircle2 size={18} />,
                label: "Seller Financing",
                value: "Available",
              },
              listing.tax_exempt && {
                icon: <CheckCircle2 size={18} />,
                label: "Tax Exemption",
                value: "CONFOTUR Exempt",
              },
              listing.gated_community && {
                icon: <CheckCircle2 size={18} />,
                label: "Gated Community",
                value: "Private Access",
              },
              listing.hoa && {
                icon: <CheckCircle2 size={18} />,
                label: "HOA Community",
                value: "Included",
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

          {/* Resources: video links */}
          {(listing.video_links?.length ?? 0) > 0 && (
            <div className="mt-7">
              <h3 className="font-sans text-[22px] font-semibold text-ink mb-4">Resources</h3>
              <div className="space-y-2.5">
                {listing.video_links?.map((url, i) => {
                  const safe = safeUrl(url);
                  if (!safe) return null;
                  const embedUrl = youtubeEmbedUrl(safe);
                  if (embedUrl) {
                    return (
                      <div key={i} className="rounded-xl overflow-hidden aspect-video">
                        <iframe
                          src={embedUrl}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={`Video ${i + 1}`}
                        />
                      </div>
                    );
                  }
                  return (
                    <a
                      key={i}
                      href={safe}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-line-soft bg-paper2 hover:bg-paper transition-colors text-[13.5px] font-semibold text-ink group"
                    >
                      <Video size={16} className="text-ink2 shrink-0 group-hover:text-ink transition-colors" />
                      <span className="flex-1 truncate">{safe}</span>
                      <ExternalLink size={13} className="text-ink2 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Utilities */}
          {listing.utilities && (
            <div className="mt-7">
              <h3 className="font-sans text-[22px] font-semibold text-ink mb-3">Utilities</h3>
              {(() => {
                const raw = listing.utilities!
                const html = raw.trimStart().startsWith('<') ? raw : `<p>${raw}</p>`
                const safe = DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
                return <div className="listing-prose font-sans" dangerouslySetInnerHTML={{ __html: safe }} />
              })()}
            </div>
          )}

          {/* What is Included (rent only) */}
          {listing.transaction === "rent" && (listing.included_utilities?.length ?? 0) > 0 && (
            <div className="mt-7">
              <h3 className="font-sans text-[22px] font-semibold text-ink mb-4">What is Included</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {listing.included_utilities!.map(u => (
                  <div key={u} className="flex items-center gap-2.5">
                    <CheckCircle2 size={18} className="text-ink shrink-0" />
                    <span className="text-[14px] text-ink2">{u}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deposit (rent only) */}
          {listing.transaction === "rent" && listing.deposit_policy && listing.deposit_policy !== "none" && (
            <div className="mt-7 flex items-start gap-4 px-5 py-4 rounded-2xl border border-line-soft bg-paper2">
              <Calendar size={18} className="text-ink2 mt-0.5 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-ink2 uppercase tracking-wide mb-0.5">Security Deposit</div>
                <div className="text-[14px] font-semibold text-ink">{DEPOSIT_LABELS[listing.deposit_policy] ?? listing.deposit_policy}</div>
              </div>
            </div>
          )}

          {/* Mortgage calculator (sale only) */}
          {listing.transaction !== "rent" && (
            <div className="mt-7 border border-line-soft rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_-18px_rgba(0,16,46,.18)]">
              {/* Header */}
              <div className="px-6 py-4 bg-[linear-gradient(135deg,var(--color-coral)_0%,#a8000d_100%)] text-white">
                <div className="text-[11px] font-bold tracking-[.14em] uppercase">Mortgage Calculator</div>
                <div className="text-[12px] mt-0.5 text-white/70">Estimate your monthly payment · Amounts in {currency === 'DOP' ? 'DOP' : 'USD'}</div>
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
                    ["Monthly payment", `${fmtM(mortgage.monthly)}/mo`],
                    ["Loan amount", fmtM(mortgage.loan)],
                    ["Down payment", fmtM(mortgage.down)],
                    ["Total interest", fmtM(mortgage.totalInterest)],
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
              <PropertyMap mapsUrl={listing.maps_url ?? null} locationName={listing.location} latitude={listing.latitude ?? null} longitude={listing.longitude ?? null} />
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
          {/* Transaction type label + currency toggle */}
          <div className="flex items-center justify-between mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold border ${listing.transaction === "rent" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
            >
              {listing.transaction === "rent" ? "For Rent" : "For Sale"}
            </span>
            <div className="flex rounded-lg border border-line overflow-hidden text-[11px] font-bold">
              {(['DOP', 'USD'] as const).map(c => (
                <button key={c} type="button" onClick={() => setCurrency(c)}
                  className="px-2.5 py-1 transition-colors cursor-pointer"
                  style={{ background: currency === c ? '#00102e' : 'white', color: currency === c ? 'white' : '#64748b' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {listing.transaction !== "rent" ? (
            <>
              {(() => {
                const discounted = listing.is_deal && listing.deal_discount_value
                  ? (listing.deal_discount_type === 'fixed'
                      ? Math.round(Number(listing.price) - Number(listing.deal_discount_value))
                      : Math.round(Number(listing.price) * (1 - Number(listing.deal_discount_value) / 100)))
                  : null
                const effectivePrice = discounted ?? Number(listing.price)
                return (
                  <>
                    {discounted && (
                      <div className="inline-flex items-center gap-1.5 bg-coral/10 border border-coral/20 text-coral text-[11px] font-bold px-2.5 py-1 rounded-full mb-2">
                        ★ Deal of the Week &nbsp;·&nbsp;
                        {listing.deal_discount_type === 'fixed'
                          ? `−$${Number(listing.deal_discount_value).toLocaleString()} off`
                          : `−${listing.deal_discount_value}% off`}
                      </div>
                    )}
                    <div className="text-[32px] font-bold text-ink">
                      {currency === 'DOP'
                        ? `RD$${Math.round(effectivePrice * dopRate).toLocaleString("en-US")}`
                        : fmt(effectivePrice)}{" "}
                      <span className="text-[13px] text-ink2 mt-1">
                        {currency === 'DOP' ? 'DOP' : 'USD'}
                      </span>
                    </div>
                    {discounted ? (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12.5px] text-dim line-through">
                          {currency === 'DOP'
                            ? `RD$${Math.round(Number(listing.price) * dopRate).toLocaleString("en-US")}`
                            : fmt(listing.price)}
                        </span>
                        <span className="text-[12px] text-ink2">original price</span>
                      </div>
                    ) : (
                      <div className="text-[12.5px] text-ink2 mt-0.5">
                        {currency === 'DOP'
                          ? `≈ ${fmt(listing.price)} USD`
                          : `≈ RD$${Math.round(Number(listing.price) * dopRate).toLocaleString("en-US")} DOP`}
                      </div>
                    )}
                  </>
                )
              })()}

              {[
                listing.roi && ["Est. ROI", `${listing.roi}% / yr`],
                listing.hoa_fee && [
                  "HOA Fee",
                  currency === 'DOP'
                    ? `RD$${Math.round(Number(listing.hoa_fee) * dopRate).toLocaleString('en-US')} / mo`
                    : `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
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
                {currency === 'DOP'
                  ? `RD$${Math.round(Number(listing.price) * dopRate).toLocaleString("en-US")}`
                  : fmt(listing.price)}{" "}
                <span className="text-[16px] text-ink2 font-sans font-normal">
                  {currency === 'DOP' ? 'DOP / mo' : 'USD / mo'}
                </span>
              </div>
              <div className="text-[12.5px] text-ink2 mt-0.5">
                {currency === 'DOP'
                  ? `≈ ${fmt(listing.price)} USD / mo`
                  : `≈ RD$${Math.round(Number(listing.price) * dopRate).toLocaleString("en-US")} DOP / mo`}
              </div>
              {[
                listing.hoa_fee && [
                  "HOA Fee",
                  currency === 'DOP'
                    ? `RD$${Math.round(Number(listing.hoa_fee) * dopRate).toLocaleString('en-US')} / mo`
                    : `$${Number(listing.hoa_fee).toLocaleString()} / mo`,
                ],
                listing.association_fee && [
                  "Association Fee",
                  currency === 'DOP'
                    ? `RD$${Math.round(Number(listing.association_fee) * dopRate).toLocaleString('en-US')} / mo`
                    : `$${Number(listing.association_fee).toLocaleString()} / mo`,
                ],
                listing.deposit_policy && listing.deposit_policy !== 'none' && [
                  "Deposit",
                  DEPOSIT_LABELS[listing.deposit_policy] ?? listing.deposit_policy,
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
              {bookingSent ? (
                <div className="mt-4 py-3 text-center text-[13px] text-emerald-700 font-semibold">
                  <CheckCircle2 size={15} className="inline mr-1.5" />Booking request sent!
                </div>
              ) : bookingOpen ? (
                <form onSubmit={handleBooking} className="mt-4 flex flex-col gap-2">
                  {bookingError && <div className="text-[12px] text-coral font-semibold text-center">{bookingError}</div>}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-[10.5px] font-bold text-ink2 uppercase tracking-wide mb-1">Check-in</div>
                      <input required type="date" value={bookingForm.checkIn}
                        onChange={e => setBookingForm(f => ({ ...f, checkIn: e.target.value }))}
                        className="w-full text-[12px] border border-line rounded-lg px-2 py-1.5 font-sans outline-none" />
                    </div>
                    <div>
                      <div className="text-[10.5px] font-bold text-ink2 uppercase tracking-wide mb-1">Check-out</div>
                      <input required type="date" value={bookingForm.checkOut}
                        onChange={e => setBookingForm(f => ({ ...f, checkOut: e.target.value }))}
                        className="w-full text-[12px] border border-line rounded-lg px-2 py-1.5 font-sans outline-none" />
                    </div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-bold text-ink2 uppercase tracking-wide mb-1">Guests</div>
                    <input type="number" min={1} max={20} value={bookingForm.guests}
                      onChange={e => setBookingForm(f => ({ ...f, guests: parseInt(e.target.value) || 1 }))}
                      className="w-full text-[13px] border border-line rounded-lg px-3 py-1.5 font-sans outline-none" />
                  </div>
                  <textarea rows={2} placeholder="Notes (optional)" value={bookingForm.notes}
                    onChange={e => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full text-[13px] border border-line rounded-lg px-3 py-2 font-sans outline-none resize-none" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setBookingOpen(false); setBookingError('') }}
                      className="flex-1 py-2 rounded-full border border-line text-[13px] font-semibold text-ink2 cursor-pointer bg-transparent font-sans">
                      Cancel
                    </button>
                    <button type="submit" disabled={bookingSending}
                      className="flex-1 py-2 rounded-full bg-coral text-white text-[13px] font-bold border-none cursor-pointer font-sans disabled:opacity-60">
                      {bookingSending ? 'Sending…' : 'Request'}
                    </button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setBookingOpen(true)}
                  className="w-full flex justify-center items-center py-3 mt-4 rounded-full border-none cursor-pointer text-white font-sans text-[13.5px] font-bold bg-coral">
                  Request to book
                </button>
              )}
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
              {inquirySent ? (
                <div className="py-3 text-center text-[13px] text-emerald-700 font-semibold">
                  <CheckCircle2 size={15} className="inline mr-1.5" />Message sent! We'll be in touch.
                </div>
              ) : inquiryOpen ? (
                <form onSubmit={handleInquiry} className="flex flex-col gap-2">
                  <input required placeholder="Your name" value={inquiryForm.name}
                    onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full text-[13px] border border-line rounded-lg px-3 py-2 font-sans outline-none" />
                  <input required type="email" placeholder="Email" value={inquiryForm.email}
                    onChange={e => setInquiryForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full text-[13px] border border-line rounded-lg px-3 py-2 font-sans outline-none" />
                  <PhoneInput
                    defaultCountry="us"
                    placeholder="Phone (optional)"
                    value={inquiryForm.phone}
                    onChange={phone => setInquiryForm(f => ({ ...f, phone }))}
                    inputStyle={{ flex: 1, width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #e4ddcf', borderLeft: 'none', borderRadius: '0 0.5rem 0.5rem 0', backgroundColor: '#ffffff', fontFamily: 'inherit', fontSize: '0.8125rem', color: '#00102e', outline: 'none' }}
                    countrySelectorStyleProps={{ buttonStyle: { border: '1px solid #e4ddcf', borderRight: 'none', borderRadius: '0.5rem 0 0 0.5rem', backgroundColor: '#f3f1ea', padding: '0 0.5rem', cursor: 'pointer', height: '100%' } }}
                  />
                  <textarea required rows={3} placeholder="Your message…" value={inquiryForm.message}
                    onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full text-[13px] border border-line rounded-lg px-3 py-2 font-sans outline-none resize-none" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setInquiryOpen(false)}
                      className="flex-1 py-2 rounded-full border border-line text-[13px] font-semibold text-ink2 cursor-pointer bg-transparent font-sans">
                      Cancel
                    </button>
                    <button type="submit" disabled={inquirySending}
                      className="flex-1 py-2 rounded-full bg-sea text-white text-[13px] font-bold border-none cursor-pointer font-sans disabled:opacity-60">
                      {inquirySending ? 'Sending…' : 'Send'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => {
                    setInquiryForm(f => ({
                      ...f,
                      name: me?.display_name || f.name,
                      email: me?.email || f.email,
                      phone: me?.phone || f.phone,
                    }))
                    setInquiryOpen(true)
                  }}
                  className="w-full flex justify-center items-center gap-1.5 bg-transparent border border-line text-ink px-3 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer font-sans hover:bg-paper2 transition-colors">
                  <MessageCircle size={14} /> Message Agent
                </button>
              )}
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
