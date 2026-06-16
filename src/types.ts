export interface Contact {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  jobTitle: string;
  personalizedFollowUp: string;
  scanDate: string;
  notes?: string;
  crmSynced?: boolean;
  syncMessage?: string;
}

export interface CrmConfig {
  crmWebhookUrl: string;
  apiKey: string;
  locationId: string;
  testMode: boolean;
}

export interface FollowUpTemplate {
  id: string;
  name: string;
  channel: "SMS" | "Email" | "LinkedIn";
  subject?: string;
  content: string;
  delayHours: number;
  triggerType: "immediate" | "scheduled";
}
