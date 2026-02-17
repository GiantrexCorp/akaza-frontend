"use client";

import { useState } from "react";
import SearchWidget, { type TabId } from "./SearchWidget";
import DestinationsSection from "./DestinationsSection";

export default function HomeContent() {
  const [activeTab, setActiveTab] = useState<TabId>("excursions");

  return (
    <>
      <SearchWidget activeTab={activeTab} onTabChange={setActiveTab} />
      <DestinationsSection activeTab={activeTab} />
    </>
  );
}
