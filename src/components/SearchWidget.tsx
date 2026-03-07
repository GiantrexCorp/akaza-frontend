"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from '@/i18n/navigation';
import {
  Hotel,
  Ship,
  Car,
  MapPin,
  Calendar,
  Users,
  Search,
  Navigation,
  Clock,
  User,
} from "lucide-react";
import { DatePicker } from "@/components/ui";
import type { AutocompleteOption } from "@/components/ui";
import { useDestinationSearch } from "@/hooks/useDestinationSearch";

export type TabId = "hotels" | "excursions" | "transfers";

const tabs = [
  { id: "hotels" as TabId, label: "Stays", icon: Hotel },
  { id: "excursions" as TabId, label: "Experiences", icon: Ship },
  { id: "transfers" as TabId, label: "Transfers", icon: Car },
];

interface FieldConfig {
  key: string;
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const fieldConfigs: Record<TabId, FieldConfig[]> = {
  hotels: [
    { key: "destination", label: "Destination", placeholder: "Destination", icon: MapPin },
    { key: "checkIn", label: "Check-in", placeholder: "Select date", icon: Calendar },
    { key: "checkOut", label: "Check-out", placeholder: "Select date", icon: Calendar },
    { key: "guests", label: "Guests", placeholder: "2", icon: Users },
  ],
  excursions: [
    {
      key: "destination",
      label: "Excursion Destination",
      placeholder: "e.g. Giza Pyramids",
      icon: MapPin,
    },
    { key: "date", label: "Excursion Date", placeholder: "Select Date", icon: Calendar },
    { key: "participants", label: "Participants", placeholder: "1 Participant", icon: User },
  ],
  transfers: [
    {
      key: "pickup",
      label: "Pick-up Location",
      placeholder: "From airport or hotel",
      icon: MapPin,
    },
    { key: "dropoff", label: "Drop-off Location", placeholder: "To destination", icon: Navigation },
    { key: "date", label: "Date & Time", placeholder: "Select date", icon: Clock },
    { key: "passengers", label: "Passengers", placeholder: "How many", icon: User },
  ],
};

const buttonLabels: Record<TabId, string> = {
  hotels: "Find Hotel",
  excursions: "Find Excursion",
  transfers: "Find Transfer",
};

const searchRoutes: Record<TabId, string> = {
  hotels: "/hotels/search",
  excursions: "/tours",
  transfers: "/transfers",
};

interface SearchWidgetProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function SearchWidget({
  activeTab,
  onTabChange,
}: SearchWidgetProps) {
  const router = useRouter();
  const fields = fieldConfigs[activeTab];
  const [values, setValues] = useState<Record<string, string>>({});
  const [destinationCode, setDestinationCode] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [hotelCheckIn, setHotelCheckIn] = useState("");
  const [hotelCheckOut, setHotelCheckOut] = useState("");
  const [hotelGuests, setHotelGuests] = useState("2");
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const destContainerRef = useRef<HTMLDivElement>(null);
  const destSearch = useDestinationSearch();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (destContainerRef.current && !destContainerRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const destinationOptions: AutocompleteOption[] = destSearch.results.map((d) => ({
    value: d.code,
    label: d.name,
    sublabel: d.country_name || d.country_code,
  }));

  const todayStr = new Date().toISOString().split("T")[0];

  const handleTabChange = (tab: TabId) => {
    setValues({});
    setDestinationCode("");
    setDestinationName("");
    setHotelCheckIn("");
    setHotelCheckOut("");
    setHotelGuests("2");
    setShowDestDropdown(false);
    destSearch.clear();
    onTabChange(tab);
  };

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (activeTab === "hotels") {
      if (destinationCode) {
        params.set("destination", destinationCode);
        params.set("destinationName", destinationName);
      }
      if (hotelCheckIn) params.set("checkIn", hotelCheckIn);
      if (hotelCheckOut) params.set("checkOut", hotelCheckOut);
      params.set("adults", hotelGuests || "2");
      params.set("children", "0");
    } else {
      for (const [key, value] of Object.entries(values)) {
        if (value.trim()) params.set(key, value.trim());
      }
    }
    const query = params.toString();
    const route = searchRoutes[activeTab];
    router.push(query ? `${route}?${query}` : route);
  };

  return (
    <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-6">
      <div className="relative border border-[var(--line-soft)] bg-[var(--search-widget-surface)] shadow-[0_24px_56px_-24px_rgba(0,0,0,0.45)]">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary-gradient-end/75 overflow-hidden" />

        <div className="bg-[var(--search-widget-topbar)] px-5 pt-4 pb-3 md:px-7 md:pt-5 md:pb-4 border-b border-[var(--line-soft)]">
          <nav role="tablist" className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="search-tabpanel"
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 transition-all border ${
                    isActive
                      ? "bg-primary/12 text-primary font-bold border-primary/50"
                      : "text-[var(--text-secondary)] font-semibold border-transparent hover:border-[var(--line-soft)] hover:bg-[var(--search-widget-tab-hover)] hover:text-primary"
                  }`}
                >
                  <Icon size={17} />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    {tab.label}
                  </span>
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div id="search-tabpanel" role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="p-5 md:p-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 items-end">
            {activeTab === "hotels" ? (
              <>
                <div className="space-y-2" ref={destContainerRef}>
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.22em]">
                    Destination
                  </label>
                  <div className="relative group border border-[var(--search-widget-field-border)] bg-[var(--search-widget-field-bg)] px-3 py-3 transition-all hover:border-primary/45 focus-within:border-primary/55 focus-within:shadow-[0_0_0_1px_rgba(185,117,50,0.2)]">
                    <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors" />
                    <input
                      type="text"
                      placeholder="Search destination"
                      value={destinationName || destSearch.query}
                      onChange={(e) => {
                        if (destinationName) {
                          setDestinationCode("");
                          setDestinationName("");
                        }
                        destSearch.setQuery(e.target.value);
                        setShowDestDropdown(true);
                      }}
                      onFocus={() => {
                        if (destSearch.query.length >= 2 && !destinationName) {
                          setShowDestDropdown(true);
                        }
                      }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                      className="w-full pl-8 pr-2 py-1 bg-transparent text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:ring-0 text-[1.15rem] font-serif transition-colors outline-none"
                    />
                    {showDestDropdown && (destSearch.isLoading || destinationOptions.length > 0 || destSearch.query.length >= 2) && (
                      <ul className="absolute z-50 left-0 right-0 top-full mt-1 max-h-60 overflow-auto bg-[var(--surface-card)] border border-[var(--line-soft)] shadow-xl">
                        {destSearch.isLoading ? (
                          <li className="flex items-center justify-center py-4">
                            <span className="text-xs text-[var(--text-muted)] font-sans">Searching...</span>
                          </li>
                        ) : destinationOptions.length === 0 ? (
                          <li className="px-4 py-3 text-sm text-[var(--text-muted)] font-sans">No destinations found</li>
                        ) : (
                          destinationOptions.map((opt) => (
                            <li
                              key={opt.value}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setDestinationCode(opt.value);
                                setDestinationName(opt.label);
                                setShowDestDropdown(false);
                              }}
                              className="px-4 py-2.5 cursor-pointer transition-colors text-[var(--text-primary)] hover:bg-primary/10"
                            >
                              <div className="text-sm font-serif">{opt.label}</div>
                              {opt.sublabel && <div className="text-xs text-[var(--text-muted)] font-sans mt-0.5">{opt.sublabel}</div>}
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.22em]">
                    Check-in
                  </label>
                  <DatePicker
                    value={hotelCheckIn}
                    onChange={setHotelCheckIn}
                    minDate={todayStr}
                    renderTrigger={({ displayValue, onClick }) => (
                      <div
                        onClick={onClick}
                        className="relative group border border-[var(--search-widget-field-border)] bg-[var(--search-widget-field-bg)] px-3 py-3 transition-all hover:border-primary/45 cursor-pointer"
                      >
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors pointer-events-none" />
                        <span className={`block pl-8 pr-2 py-1 text-[1.15rem] font-serif ${displayValue ? 'text-[var(--field-text)]' : 'text-[var(--field-placeholder)]'}`}>
                          {displayValue || "Select date"}
                        </span>
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.22em]">
                    Check-out
                  </label>
                  <DatePicker
                    value={hotelCheckOut}
                    onChange={setHotelCheckOut}
                    minDate={hotelCheckIn || todayStr}
                    renderTrigger={({ displayValue, onClick }) => (
                      <div
                        onClick={onClick}
                        className="relative group border border-[var(--search-widget-field-border)] bg-[var(--search-widget-field-bg)] px-3 py-3 transition-all hover:border-primary/45 cursor-pointer"
                      >
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors pointer-events-none" />
                        <span className={`block pl-8 pr-2 py-1 text-[1.15rem] font-serif ${displayValue ? 'text-[var(--field-text)]' : 'text-[var(--field-placeholder)]'}`}>
                          {displayValue || "Select date"}
                        </span>
                      </div>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.22em]">
                    Guests
                  </label>
                  <div className="relative group border border-[var(--search-widget-field-border)] bg-[var(--search-widget-field-bg)] px-3 py-3 transition-all hover:border-primary/45 focus-within:border-primary/55 focus-within:shadow-[0_0_0_1px_rgba(185,117,50,0.2)]">
                    <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors" />
                    <input
                      type="number"
                      min={1}
                      max={6}
                      placeholder="2"
                      value={hotelGuests}
                      onChange={(e) => setHotelGuests(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                      className="w-full pl-8 pr-2 py-1 bg-transparent text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:ring-0 text-[1.15rem] font-serif transition-colors outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="space-y-2">
                    <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.22em]">
                      {field.label}
                    </label>
                    <div className="relative group border border-[var(--search-widget-field-border)] bg-[var(--search-widget-field-bg)] px-3 py-3 transition-all hover:border-primary/45 focus-within:border-primary/55 focus-within:shadow-[0_0_0_1px_rgba(185,117,50,0.2)]">
                      <Icon
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors"
                      />
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        value={values[field.key] || ""}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
                        className="w-full pl-8 pr-2 py-1 bg-transparent text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:ring-0 text-[1.15rem] font-serif transition-colors outline-none"
                      />
                    </div>
                  </div>
                );
              })
            )}

            <div className="flex items-end h-full sm:col-span-2 lg:col-span-1">
              <button
                onClick={handleSearch}
                className="w-full border border-primary/60 bg-gradient-to-r from-primary to-primary-gradient-end text-white h-[50px] px-4 font-bold transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-[0.14em] text-[11px] shadow-[0_14px_28px_-18px_rgba(185,117,50,0.85)] hover:-translate-y-0.5 hover:brightness-105"
              >
                <Search size={13} />
                {buttonLabels[activeTab]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
