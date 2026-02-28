"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    {
      key: "dates",
      label: "Check-in - Check-out",
      placeholder: "Check-in - Check-out",
      icon: Calendar,
    },
    { key: "guests", label: "Guests", placeholder: "Guests", icon: Users },
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

  const handleTabChange = (tab: TabId) => {
    setValues({});
    onTabChange(tab);
  };

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(values)) {
      if (value.trim()) params.set(key, value.trim());
    }
    const query = params.toString();
    const route = searchRoutes[activeTab];
    router.push(query ? `${route}?${query}` : route);
  };

  return (
    <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-6">
      <div className="relative overflow-hidden border border-[var(--line-soft)] bg-[var(--search-widget-surface)] shadow-[0_24px_56px_-24px_rgba(0,0,0,0.45)]">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/70 via-primary to-primary-gradient-end/75" />

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6 items-end">
            {fields.map((field) => {
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
            })}

            <div className="flex items-end h-full md:col-span-1">
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
