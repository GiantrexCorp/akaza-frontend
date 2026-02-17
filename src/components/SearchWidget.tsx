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
  { id: "hotels" as TabId, label: "Hotels", icon: Hotel },
  { id: "excursions" as TabId, label: "Excursions", icon: Ship },
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
    { label: "Check-in - Check-out", placeholder: "Check-in - Check-out", icon: Calendar },
    { label: "Guests", placeholder: "Guests", icon: Users },
  ],
  excursions: [
    { label: "Excursion Destination", placeholder: "e.g. Giza Pyramids", icon: MapPin },
    { label: "Excursion Date", placeholder: "Select Date", icon: Calendar },
    { label: "Participants", placeholder: "1 Participant", icon: User },
  ],
  transfers: [
    { label: "Pick-up Location", placeholder: "From airport or hotel", icon: MapPin },
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

export default function SearchWidget({ activeTab, onTabChange }: SearchWidgetProps) {
  const fields = fieldConfigs[activeTab];

  return (
    <div className="relative z-20 -mt-20 max-w-6xl mx-auto px-6">
      <div className="bg-bg-card shadow-2xl p-1 md:p-2 border-t-4 border-primary">
        <div className="flex flex-wrap md:flex-nowrap">
          {/* Vertical Tabs */}
          <div className="w-full md:w-56 flex flex-col p-4 border-r border-white/5">
            <nav className="flex md:flex-col gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 transition-all border-l-2 ${
                      isActive
                        ? "bg-primary/10 text-primary font-bold border-primary"
                        : "text-slate-400 hover:text-primary font-medium border-transparent"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm uppercase tracking-wider">
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Form Fields */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 p-6 items-center">
            {fields.map((field) => {
              const Icon = field.icon;
              return (
                <div key={field.label} className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <Icon
                      size={20}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-primary group-hover:text-white transition-colors"
                    />
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      className="w-full pl-8 pr-4 py-2 bg-transparent border-b border-slate-700 focus:border-primary text-white placeholder-slate-500 focus:ring-0 text-lg font-serif transition-colors outline-none"
                    />
                  </div>
                </div>
              );
            })}

            {/* Search Button */}
            <div className="flex items-end h-full">
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
