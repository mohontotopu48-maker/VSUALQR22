import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Layers, ShieldCheck, Database, Zap, Smartphone, ChevronDown, RefreshCw, Volume2, Award } from "lucide-react";
import ScannerTab from "./components/ScannerTab";
import SelfieTab from "./components/SelfieTab";
import CrmTab from "./components/CrmTab";
import AutomationTab from "./components/AutomationTab";
import { Contact } from "./types";

export default function App() {
  // Application Data States
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeTab, setActiveTab] = useState<"scan" | "selfie" | "crm" | "automation">("scan");
  
  // Media Loading States
  const [mediaLoading, setMediaLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const actionsSectionRef = useRef<HTMLDivElement | null>(null);

  // Load contacts from localstorage on launch
  useEffect(() => {
    const saved = localStorage.getItem("vsual_contacts");
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch (err) {
        console.warn("Could not retrieve locally saved contacts:", err);
      }
    }
  }, []);

  // Save contacts helper
  const persistenceContacts = (newContacts: Contact[]) => {
    setContacts(newContacts);
    localStorage.setItem("vsual_contacts", JSON.stringify(newContacts));
  };

  // Callback triggers
  const handleAddNewContact = (newContact: Contact) => {
    const updated = [newContact, ...contacts];
    persistenceContacts(updated);
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    const updated = contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c));
    persistenceContacts(updated);
  };

  // Video Load status watchers
  const handleMediaLoaded = () => {
    console.log("VSUAL red-720p.mp4 background loop initialized successfully!");
    setMediaLoading(false);
  };

  const handleVideoError = () => {
    console.warn("Background video loop has fallback to poster image.");
    setVideoError(true);
    setMediaLoading(false);
  };

  // Fallback safe load release timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setMediaLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToActions = () => {
    actionsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-sans antialiased text-white bg-[#0A0006] min-h-screen selection:bg-[#C00F7A] selection:text-white pb-14">
      
      {/* 1. HERO GRAPHICAL VIEWPORT */}
      <section className="relative h-screen w-full flex flex-col justify-between overflow-hidden" id="hero-landing-pane">
        
        {/* Background Visual Wrapper */}
        <div className="absolute inset-0 z-0 bg-[#0A0006]">
          {/* autoloop video media file */}
          {!videoError ? (
            <video
              ref={videoRef}
              src="/red-720p.mp4"
              poster="/red-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={handleMediaLoaded}
              onError={handleVideoError}
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]"
            />
          ) : (
            /* fallback poster design if missing */
            <img
              src="/red-poster.jpg"
              alt="VSUAL background art"
              className="absolute inset-0 w-full h-full object-cover filter brightness-[0.3]"
              onError={(e) => {
                // If even the poster jpg is missing from the directory, display a gorgeous fallback mesh CSS gradient
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          )}

          {/* Fallback Mesh Radiant Circles when media is absent */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#C00F7A]/25 pointer-events-none mix-blend-color-dodge"></div>
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#C00F7A]/15 blur-[120px] pointer-events-none animate-pulse"></div>
        </div>

        {/* Dynamic Media Loading State Shield */}
        {mediaLoading && (
          <div className="absolute inset-0 z-50 bg-[#0c0007] flex flex-col items-center justify-center space-y-4">
            <div className="p-3 bg-[#C00F7A]/15 rounded-xl border border-[#C00F7A]/30">
              <RefreshCw className="h-8 w-8 text-[#C00F7A] animate-spin" />
            </div>
            <div className="text-center space-y-1">
              <span className="text-xs font-mono tracking-widest text-[#C00F7A] uppercase font-bold">
                VSUAL MEDIA INITIALIZING
              </span>
              <p className="text-[10px] text-zinc-500 font-medium">
                Syncing Authority Layouts • Trade Show Mode
              </p>
            </div>
          </div>
        )}

        {/* Top Branding Header info bar */}
        <div className="z-10 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <div className="h-7 w-7 rounded-lg bg-[#C00F7A] flex items-center justify-center font-bold text-white text-base tracking-tighter">
              V
            </div>
            <span className="text-sm font-black tracking-widest uppercase font-display">
              VSUAL<span className="text-[#C00F7A]">.</span>NETWORKING
            </span>
          </div>

          <div className="flex items-center space-x-1.5 md:flex bg-black/40 border border-white/5 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-[#C00F7A] uppercase">
            <ShieldCheck className="h-3 w-3 animate-pulse" />
            <span>INSTANT AUTHORITY</span>
          </div>
        </div>

        {/* Centered Agency Pitch Text Overlay */}
        <div className="z-10 px-6 text-center space-y-5">
          <div className="space-y-1">
            {/* Logo Typographic treatment */}
            <h1 className="text-6xl md:text-8xl font-black tracking-[0.25em] font-display text-white drop-shadow-xl relative inline-block">
              VSUAL
              <span className="absolute -bottom-1 right-8 h-2 w-2 rounded-full bg-[#C00F7A]"></span>
            </h1>
            
            {/* Tagline */}
            <p className="text-xl md:text-2xl font-bold uppercase tracking-[0.15em] text-[#C00F7A]">
              Instant Authority
            </p>
          </div>

          {/* Subline */}
          <div className="max-w-md mx-auto p-[1px] bg-gradient-to-r from-transparent via-[#C00F7A]/50 to-transparent">
            <div className="bg-[#0A0006]/80 backdrop-blur-sm py-2 px-4 rounded-md">
              <p className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
                Capture. Connect. Automate.
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
            AI-powered contact capture, branded selfie watermarking, and instant GoHighLevel synchronization for promo professionals.
          </p>

          <div className="pt-4">
            <button
              onClick={scrollToActions}
              className="bg-gradient-to-r from-[#C00F7A] to-pink-650 hover:from-pink-650 hover:to-magenta-700 text-white font-extrabold tracking-widest text-xs uppercase px-7 py-3.5 rounded-full shadow-lg shadow-[#C00F7A]/20 transform hover:-translate-y-0.5 active:translate-y-0 transition flex items-center space-x-2 mx-auto"
            >
              <span>ACCESS CONSOLE</span>
              <ChevronDown className="h-4 w-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Footer info line */}
        <div className="z-10 p-6 flex flex-col sm:flex-row justify-between items-center text-zinc-500 text-[10px] uppercase font-mono tracking-widest gap-2">
          <span>By VSUALdigitalmedia</span>
          <span>© 2026 • Trade Show Engine</span>
        </div>

      </section>

      {/* 2. OPERATIONAL INTERACTIVE CONSOLE VIEW */}
      <div 
        ref={actionsSectionRef} 
        className="max-w-md mx-auto px-4 pt-16 space-y-6"
        id="control-console-deck"
      >
        <span className="text-[10px] font-mono tracking-widest font-black text-[#C00F7A] text-center block uppercase">
          ✦ VSUAL Interactive Platform Deck ✦
        </span>

        {/* Interactive Dynamic Tabs System Navigation */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-1.5 grid grid-cols-4 gap-1 shadow-lg shadow-black">
          {/* Tab 1: Scanner */}
          <button
            type="button"
            onClick={() => setActiveTab("scan")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition ${
              activeTab === "scan"
                ? "bg-[#C00F7A] text-white shadow-md shadow-pink-900/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Scan</span>
          </button>

          {/* Tab 2: Selfie */}
          <button
            type="button"
            onClick={() => setActiveTab("selfie")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition ${
              activeTab === "selfie"
                ? "bg-[#C00F7A] text-white shadow-md shadow-pink-900/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Selfie</span>
          </button>

          {/* Tab 3: CRM */}
          <button
            type="button"
            onClick={() => setActiveTab("crm")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition relative ${
              activeTab === "crm"
                ? "bg-[#C00F7A] text-white shadow-md shadow-pink-900/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
            }`}
          >
            {contacts.some((c) => !c.crmSynced) && (
              <span className="absolute top-2 right-4 h-2 w-2 rounded-full bg-yellow-400 animate-ping"></span>
            )}
            <Database className="h-4 w-4" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Sync</span>
          </button>

          {/* Tab 4: Automator */}
          <button
            type="button"
            onClick={() => setActiveTab("automation")}
            className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition ${
              activeTab === "automation"
                ? "bg-[#C00F7A] text-white shadow-md shadow-pink-900/10"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900/55"
            }`}
          >
            <Zap className="h-4 w-4" />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-1.5">Auto</span>
          </button>
        </div>

        {/* Dynamic active component container with elegant motion simulation */}
        <main className="animate-fade-in animate-duration-300 min-h-[350px]">
          {activeTab === "scan" && (
            <ScannerTab
              savedContacts={contacts}
              onContactSaved={handleAddNewContact}
            />
          )}

          {activeTab === "selfie" && (
            <SelfieTab />
          )}

          {activeTab === "crm" && (
            <CrmTab
              contacts={contacts}
              onContactUpdated={handleUpdateContact}
            />
          )}

          {activeTab === "automation" && (
            <AutomationTab
              contacts={contacts}
            />
          )}
        </main>
      </div>

      {/* Floating Bottom Hub Indicator for mobile density */}
      <div className="fixed bottom-0 inset-x-0 bg-black/90 border-t border-zinc-900 backdrop-blur-lg py-2.5 px-6 z-40 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center space-x-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          <span>Core Live Engine Ok</span>
        </span>
        <button 
          onClick={scrollToActions} 
          className="text-zinc-400 hover:text-white font-bold flex items-center space-x-1 uppercase"
        >
          <span>Deck Console</span>
          <ChevronDown className="h-3 w-3" />
        </button>
      </div>

    </div>
  );
}
