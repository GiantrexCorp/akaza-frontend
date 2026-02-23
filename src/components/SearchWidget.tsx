"use client";

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
  label: string;
  placeholder: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const fieldConfigs: Record<TabId, FieldConfig[]> = {
  hotels: [
    { label: "Destination", placeholder: "Destination", icon: MapPin },
    {
      label: "Check-in - Check-out",
      placeholder: "Check-in - Check-out",
      icon: Calendar,
    },
    { label: "Guests", placeholder: "Guests", icon: Users },
  ],
  excursions: [
    {
      label: "Excursion Destination",
      placeholder: "e.g. Giza Pyramids",
      icon: MapPin,
    },
    { label: "Excursion Date", placeholder: "Select Date", icon: Calendar },
    { label: "Participants", placeholder: "1 Participant", icon: User },
  ],
  transfers: [
    {
      label: "Pick-up Location",
      placeholder: "From airport or hotel",
      icon: MapPin,
    },
    { label: "Drop-off Location", placeholder: "To destination", icon: Navigation },
    { label: "Date & Time", placeholder: "Select date", icon: Clock },
    { label: "Passengers", placeholder: "How many", icon: User },
  ],
};

const buttonLabels: Record<TabId, string> = {
  hotels: "Find Hotel",
  excursions: "Find Excursion",
  transfers: "Find Transfer",
};

interface SearchWidgetProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function SearchWidget({
  activeTab,
  onTabChange,
}: SearchWidgetProps) {
  const fields = fieldConfigs[activeTab];

  return (
    <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-6">
      <div className="bg-[var(--surface-card)] shadow-2xl p-1 md:p-2 border-t-4 border-primary">
        <div className="px-4 pt-3 pb-2 border-b border-[var(--line-soft)]">
          <nav className="flex flex-wrap md:flex-nowrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 transition-all rounded-md border ${
                    isActive
                      ? "bg-primary/10 text-primary font-bold border-primary/60"
                      : "text-[var(--text-muted)] hover:text-primary font-medium border-transparent hover:border-[var(--line-soft)]"
                  }`}
                >
                  <Icon size={17} />
                  <span className="text-xs uppercase tracking-[0.16em]">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="space-y-3">
                  <label className="block text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <Icon
                      size={20}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-primary group-hover:text-primary-dark transition-colors"
                    />
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-[var(--line-strong)] focus:border-primary text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:ring-0 text-lg font-serif transition-colors outline-none"
                    />
                  </div>
                </div>
              );
            })}

            <div className="flex items-end h-full md:col-span-1">
              <button className="w-full bg-primary hover:bg-primary-gradient-end text-white h-[56px] font-bold transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs shadow-lg">
                <Search size={14} />
                {buttonLabels[activeTab]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
