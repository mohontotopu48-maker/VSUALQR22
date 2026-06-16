import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertTriangle, ArrowRightLeft, Landmark, Send, Settings, Sparkles, RefreshCcw, ExternalLink } from "lucide-react";
import { Contact, CrmConfig } from "../types";

interface CrmTabProps {
  contacts: Contact[];
  onContactUpdated: (updatedContact: Contact) => void;
}

export default function CrmTab({ contacts, onContactUpdated }: CrmTabProps) {
  // Sync states
  const [config, setConfig] = useState<CrmConfig>({
    crmWebhookUrl: "https://services.leadconnectorhq.com/hooks/vsual-networking-demo",
    apiKey: "",
    locationId: "",
    testMode: true,
  });

  const [syncStatus, setSyncStatus] = useState<Record<string, "idle" | "syncing" | "success" | "error">>({});
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [latestSyncResult, setLatestSyncResult] = useState<any | null>(null);

  // Load configuration from localstorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("vsual_crm_config");
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (err) {
        console.warn("Could not parse saved CRM config:", err);
      }
    }
  }, []);

  const saveConfig = (newConfig: CrmConfig) => {
    setConfig(newConfig);
    localStorage.setItem("vsual_crm_config", JSON.stringify(newConfig));
  };

  // REST syncing mechanism
  const syncSingleContact = async (contact: Contact) => {
    setSyncStatus((prev) => ({ ...prev, [contact.id]: "syncing" }));
    setLatestSyncResult(null);

    try {
      const response = await fetch("/api/ghl-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact,
          crmWebhookUrl: config.testMode ? "" : config.crmWebhookUrl, // bypass if testmode is on
          apiKey: config.apiKey,
          locationId: config.locationId,
        }),
      });

      if (!response.ok) {
        throw new Error("GHL API Syncer Endpoint responded with error status.");
      }

      const outcome = await response.json();
      
      if (outcome.success) {
        setSyncStatus((prev) => ({ ...prev, [contact.id]: "success" }));
        
        // Callback parent to update sync status
        onContactUpdated({
          ...contact,
          crmSynced: true,
          syncMessage: `${outcome.destination}: Integrated successfully.`
        });

        setLatestSyncResult({
          contactName: contact.name,
          destination: outcome.destination,
          message: outcome.message,
          syncedData: outcome.syncedData
        });
      } else {
        throw new Error(outcome.message || "Failed CRM Sync.");
      }

    } catch (err: any) {
      console.error("GHL integration failed:", err);
      setSyncStatus((prev) => ({ ...prev, [contact.id]: "error" }));
    }
  };

  // Bulk synchronizer trigger
  const syncAllUnsynced = async () => {
    setIsBulkSyncing(true);
    const unsynced = contacts.filter((c) => !c.crmSynced);
    
    for (const contact of unsynced) {
      await syncSingleContact(contact);
    }
    
    setIsBulkSyncing(false);
    alert(`Bulk operations complete. Synced ${unsynced.length} contact profiles to CRM!`);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto" id="crm-view-container">
      {/* Visual Tech Header */}
      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-zinc-950 to-zinc-900 border-l-4 border-[#C00F7A] rounded-r-lg shadow-md">
        <div className="p-2 bg-[#C00F7A]/10 rounded-lg text-[#C00F7A]">
          <Database className="h-6 w-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            GoHighLevel Sync
          </h2>
          <p className="text-xs text-zinc-400">
            Real-time Contact CRM Relay Interface
          </p>
        </div>
        <button
          type="button"
          id="crm-settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-lg transition ${
            showSettings ? "bg-[#C00F7A] text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
          }`}
          title="Configure GoHighLevel Credentials"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel Drawer */}
      {showSettings && (
        <div className="p-4 bg-zinc-950 border border-[#C00F7A]/20 rounded-2xl space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#C00F7A] uppercase tracking-wider flex items-center space-x-1">
              <Settings className="h-3.5 w-3.5" />
              <span>CRM API Integrations</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] text-zinc-400 font-mono">Sandbox Demo</span>
              <button
                type="button"
                onClick={() => saveConfig({ ...config, testMode: !config.testMode })}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none ${
                  config.testMode ? "bg-[#C00F7A]" : "bg-zinc-800"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-250 ease-in-out ${
                    config.testMode ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="text-[10px] text-zinc-400">
            {config.testMode
              ? "Sandbox Demo is active. Scanning triggers high-fidelity simulated CRM records, perfect for trade show displays and general reviews."
              : "Live Connection is active. Synchronizing will actively POST production JSON data payloads in the background."}
          </p>

          <div className="space-y-2.5 pt-1">
            {/* HighLevel Hook URL */}
            <div>
              <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                GHL Custom Webhook URL
              </label>
              <input
                type="text"
                disabled={config.testMode}
                value={config.crmWebhookUrl}
                onChange={(e) => saveConfig({ ...config, crmWebhookUrl: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-900 text-[11px] text-white px-3 py-2 rounded-lg outline-none focus:border-[#C00F7A] disabled:opacity-40 transition"
                placeholder="https://services.leadconnectorhq.com/hooks/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* API token */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                  Location API Key
                </label>
                <input
                  type="password"
                  disabled={config.testMode}
                  value={config.apiKey}
                  onChange={(e) => saveConfig({ ...config, apiKey: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-900 text-[11px] text-white px-3 py-1.5 rounded-lg outline-none focus:border-[#C00F7A] disabled:opacity-40 transition"
                  placeholder="ghl-location-token..."
                />
              </div>

              {/* Location ID */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-400 uppercase mb-1">
                  GHL Location ID
                </label>
                <input
                  type="text"
                  disabled={config.testMode}
                  value={config.locationId}
                  onChange={(e) => saveConfig({ ...config, locationId: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-900 text-[11px] text-white px-3 py-1.5 rounded-lg outline-none focus:border-[#C00F7A] disabled:opacity-40 transition"
                  placeholder="Account Location ID"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Success Notification Modal style inside pane */}
      {latestSyncResult && (
        <div className="p-4 bg-gradient-to-br from-zinc-950 to-zinc-900 border border-[#C00F7A]/40 rounded-2xl space-y-3 shadow-xl relative overflow-hidden animate-fade-in animate-duration-300">
          <div className="absolute top-0 right-0 p-1 bg-green-550 text-[#C00F7A]">
            <CheckCircle2 className="h-20 w-20 text-[#C00F7A]/10 absolute -top-5 -right-5" />
          </div>

          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle2 className="h-5 w-5 text-[#C00F7A] shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#C00F7A]">
              GoHighLevel Sync Complete
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white">
              {latestSyncResult.contactName}
            </h4>
            <p className="text-[10px] text-zinc-400 mt-1">
              {latestSyncResult.message}
            </p>
          </div>

          {/* Code preview block of parameters posted to highlevel */}
          <div className="bg-black/90 p-3 rounded-xl border border-zinc-900 text-left">
            <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 block mb-1">
              Transmitted JSON Payload Parameters
            </span>
            <pre className="font-mono text-[9px] text-green-400/90 max-h-24 overflow-y-auto leading-tight">
              {JSON.stringify(latestSyncResult.syncedData, null, 2)}
            </pre>
          </div>

          <button
            type="button"
            onClick={() => setLatestSyncResult(null)}
            className="text-[10px] text-[#C00F7A] font-mono hover:underline block ml-auto uppercase tracking-wider font-bold"
          >
            Acknowledge Confirmation
          </button>
        </div>
      )}

      {/* Main Leads sync console */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
            Contact Pipeline Queue
          </h3>
          
          {contacts.some((c) => !c.crmSynced) && (
            <button
              type="button"
              id="bulk-sync-btn"
              disabled={isBulkSyncing}
              onClick={syncAllUnsynced}
              className="text-[10px] bg-[#C00F7A]/10 hover:bg-[#C00F7A]/20 text-[#C00F7A] border border-[#C00F7A]/30 font-bold px-3 py-1 rounded-full flex items-center space-x-1 transition disabled:opacity-40"
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>Sync All ({contacts.filter((c) => !c.crmSynced).length})</span>
            </button>
          )}
        </div>

        {contacts.length === 0 ? (
          <div className="border border-dashed border-zinc-900 p-8 rounded-xl text-center space-y-2">
            <Landmark className="h-8 w-8 text-zinc-800 mx-auto" />
            <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
              No contacts captured yet
            </p>
            <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
              Please head over to the Business Card Scanner tab first, scan your prospects, then sync them cleanly into your promotional CRM dashboards here.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {contacts.map((contact) => {
              const status = syncStatus[contact.id] || (contact.crmSynced ? "success" : "idle");
              
              return (
                <div
                  key={contact.id}
                  className="p-3 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between hover:border-zinc-800 transition"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white">
                      {contact.name}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center space-x-1 font-mono">
                      <span>{contact.company || "Independent"}</span>
                      <span className="text-zinc-700">•</span>
                      <span>{contact.jobTitle}</span>
                    </div>
                  </div>

                  <div>
                    {status === "idle" && (
                      <button
                        type="button"
                        onClick={() => syncSingleContact(contact)}
                        className="bg-zinc-900 hover:bg-[#C00F7A] text-zinc-400 hover:text-white border border-zinc-800 hover:border-transparent text-[10px] px-3 py-1.5 rounded-lg transition font-mono flex items-center space-x-1"
                      >
                        <Send className="h-2.5 w-2.5" />
                        <span>Push to GHL</span>
                      </button>
                    )}

                    {status === "syncing" && (
                      <div className="text-[10px] text-zinc-500 font-mono flex items-center space-x-1 px-3 py-1.5">
                        <RefreshCcw className="h-3 w-3 animate-spin text-[#C00F7A]" />
                        <span>Relaying...</span>
                      </div>
                    )}

                    {status === "success" && (
                      <div className="bg-[#C00F7A]/10 text-[#C00F7A] border border-[#C00F7A]/20 text-[9px] font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center space-x-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Synced</span>
                      </div>
                    )}

                    {status === "error" && (
                      <button
                        type="button"
                        onClick={() => syncSingleContact(contact)}
                        className="bg-red-950/40 text-red-400 border border-red-900 text-[10px] px-2 py-1 rounded-md transition font-mono flex items-center space-x-1 hover:bg-red-950"
                        title="Retry syncing"
                      >
                        <AlertTriangle className="h-2.5 w-2.5" />
                        <span>Fail. Retry?</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Safe sandbox disclaimer */}
      <div className="p-3 bg-zinc-950 border border-zinc-900/60 rounded-xl">
        <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400 leading-relaxed font-sans uppercase font-bold tracking-wider mb-1 text-white">
          <Sparkles className="h-3 w-3 text-[#C00F7A]" />
          <span>GHL Automated Tagging Rules</span>
        </div>
        <p className="text-[9px] text-zinc-500 leading-tight">
          Each contact relayed is tagged with <code className="text-[#C00F7A] font-mono">#vsual-networking</code> and <code className="text-[#C00F7A] font-mono">#trade-show-lead</code> inside GoHighLevel, triggering immediate sequence workflows, including text follow-ups and high-velocity promo drip campaigns.
        </p>
      </div>
    </div>
  );
}
