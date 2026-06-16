import React, { useState } from "react";
import { Zap, Send, Mail, Phone, Linkedin, CheckCircle2, ChevronRight, Clock, ShieldCheck, Sparkles, Plus, AlertCircle } from "lucide-react";
import { Contact, FollowUpTemplate } from "../types";

interface AutomationTabProps {
  contacts: Contact[];
}

export default function AutomationTab({ contacts }: AutomationTabProps) {
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || "");
  const [triggeredSequences, setTriggeredSequences] = useState<Record<string, boolean>>({});
  const [isSimulating, setIsSimulating] = useState<string | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || contacts[0];

  // Default follow-up templates designed specifically for promotional agency professionals
  const defaultTemplates: FollowUpTemplate[] = [
    {
      id: "t-1",
      name: "Immediate VIP Text Touchpoint",
      channel: "SMS",
      content: `Hey {NAME}, dynamic meeting you today! Loved the brand direction at {COMPANY}. Here is our short-form authority guide: vsual.media. Let's schedule 10 minutes Thursday. - Dax @ VSUAL`,
      delayHours: 0,
      triggerType: "immediate"
    },
    {
      id: "t-2",
      name: "High-Authority LinkedIn Pitch",
      channel: "LinkedIn",
      content: `Hi {NAME}, great connecting at the expo! Outstanding work with your campaigns at {COMPANY}. I'm following up to share some experiential branding ideas we've successfully run. Let's stay synced!`,
      delayHours: 2,
      triggerType: "scheduled"
    },
    {
      id: "t-3",
      name: "Promotional Drip Pitch Email",
      channel: "Email",
      subject: "Interactive ROI Strategy for {COMPANY}",
      content: `Hi {NAME},

It was a pleasure meeting you today and briefly hearing about your merchandising and branding objectives for {COMPANY}.

Here at VSUAL, we specialize in helping brands achieve instant authority using our automated follow-up assets and bespoke merchandise catalogs. I've designed a quick bespoke concept deck tailored for you.

When would be a good slot this week for an introductory 10-minute web call?

Best regards,
Dax Sterling
VSUAL Digital Media`,
      delayHours: 24,
      triggerType: "scheduled"
    }
  ];

  // Replace templates placeholders with live prospect details
  const renderTemplateText = (text: string, contact: Contact | undefined) => {
    if (!contact) return text.replace("{NAME}", " Dax ").replace("{COMPANY}", " Limitless Merch ");
    return text
      .replace(/{NAME}/g, contact.name.split(" ")[0] || contact.name)
      .replace(/{COMPANY}/g, contact.company || "your brand")
      .replace(/{ROLE}/g, contact.jobTitle || "Director");
  };

  const handleTriggerSequence = (contactId: string) => {
    if (!contactId) return;
    setIsSimulating(contactId);

    // Simulate marketing trigger delay
    setTimeout(() => {
      setTriggeredSequences((prev) => ({ ...prev, [contactId]: true }));
      setIsSimulating(null);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-md mx-auto" id="automation-view-container">
      {/* Visual Tech Header */}
      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-zinc-950 to-zinc-900 border-l-4 border-[#C00F7A] rounded-r-lg shadow-md">
        <div className="p-2 bg-[#C00F7A]/10 rounded-lg text-[#C00F7A]">
          <Zap className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            Networking Automation
          </h2>
          <p className="text-xs text-zinc-400">
            High-Velocity Follow-Up Sequences
          </p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="border border-dashed border-zinc-900 p-8 rounded-xl text-center space-y-2">
          <AlertCircle className="h-8 w-8 text-zinc-800 mx-auto" />
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            Prospect Hub is Empty
          </p>
          <p className="text-[10px] text-zinc-600 max-w-xs mx-auto">
            You must capture prospects via the Business Card Scanner first to trigger personalized CRM marketing followups.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Selector of which captured lead to personalize for */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono text-zinc-300 uppercase tracking-wider">
              Target Prospect to Personalize
            </label>
            <select
              value={selectedContactId}
              onChange={(e) => setSelectedContactId(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 focus:border-[#C00F7A] text-xs text-white px-3.5 py-3 rounded-xl outline-none cursor-pointer transition text-zinc-200"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.company}
                </option>
              ))}
            </select>
          </div>

          {/* Render Active Sequence timelines */}
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2.5">
              <span className="text-[10px] font-mono uppercase text-[#C00F7A] font-bold tracking-wider">
                Authority Funnel Timeline ({selectedContact?.name.split(" ")[0]})
              </span>
              <span className="text-[9px] font-mono bg-[#C00F7A]/10 text-[#C00F7A] px-2 py-0.5 rounded uppercase">
                Active Sequence
              </span>
            </div>

            {/* Campaign triggers lists */}
            <div className="space-y-3 relative before:absolute before:inset-y-3 before:left-4 before:w-[1.5px] before:bg-zinc-850">
              {defaultTemplates.map((tpl) => (
                <div key={tpl.id} className="flex items-start space-x-3.5 relative">
                  {/* Icon Channel circle */}
                  <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-850 flex items-center justify-center text-zinc-400 shrink-0 z-10">
                    {tpl.channel === "SMS" && <Phone className="h-3.5 w-3.5 text-[#C00F7A]" />}
                    {tpl.channel === "LinkedIn" && <Linkedin className="h-3.5 w-3.5 text-blue-400" />}
                    {tpl.channel === "Email" && <Mail className="h-3.5 w-3.5 text-[#C00F7A]" />}
                  </div>

                  {/* Template Text Content Card */}
                  <div className="flex-1 bg-zinc-900/60 p-3 rounded-xl border border-zinc-900 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">
                        {tpl.name}
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-mono flex items-center space-x-0.5">
                        <Clock className="h-2.5 w-2.5 text-[#C00F7A] mr-0.5" />
                        {tpl.delayHours === 0 ? "Instant" : `+${tpl.delayHours} Hrs`}
                      </span>
                    </div>

                    {tpl.subject && (
                      <div className="text-[10px] text-zinc-200 font-bold mb-1">
                        Subj: {renderTemplateText(tpl.subject, selectedContact)}
                      </div>
                    )}

                    <p className="text-[10px] text-zinc-400 leading-relaxed italic whitespace-pre-line">
                      "{renderTemplateText(tpl.content, selectedContact)}"
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch Campaign buttons */}
            <div className="pt-2">
              {triggeredSequences[selectedContact.id] ? (
                <div className="p-3 bg-zinc-900 border border-green-950 text-green-400 text-xs rounded-xl flex items-center justify-center space-x-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#C00F7A]" />
                  <span className="font-bold text-[#C00F7A] uppercase tracking-wide">
                    Sequence Initiated Successfully!
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  id="trigger-sequence-btn"
                  disabled={isSimulating === selectedContact.id}
                  onClick={() => handleTriggerSequence(selectedContact.id)}
                  className="w-full bg-gradient-to-r from-[#C00F7A] to-pink-650 hover:from-pink-650 hover:to-magenta-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98]"
                >
                  {isSimulating === selectedContact.id ? (
                    <>
                      <Zap className="h-4 w-4 animate-bounce text-pink-300" />
                      <span>CONNECTING AUTOMATIONS...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>TRIGGER DYNAMICS FOR {selectedContact.name.toUpperCase()}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Strategy Tip Box */}
          <div className="p-3.5 bg-zinc-950 border border-zinc-900 rounded-xl">
            <span className="text-[10px] font-mono text-[#C00F7A] uppercase tracking-wider font-bold block mb-1">
              PROSECUTION BLUEPRINT
            </span>
            <p className="text-[9px] text-zinc-500 leading-tight">
              In promotional marketing, the top 1% follow up within 2 hours. This sequence sends a custom SMS immediately, followed by standard automated social invites and persistent emails. It enforces authority while eliminating human drag.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
