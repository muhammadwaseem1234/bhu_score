import { LandParcelProfile, ParcelAlertEvent, WatchlistSubscription, AiLegalOpinionResponse, AiLegalOpinionRequest } from '../types';

export const api = {
  async getParcels(params?: { query?: string; state?: string; riskLevel?: string; minScore?: number; maxScore?: number }): Promise<LandParcelProfile[]> {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.state) searchParams.set('state', params.state);
    if (params?.riskLevel) searchParams.set('riskLevel', params.riskLevel);
    if (params?.minScore) searchParams.set('minScore', String(params.minScore));
    if (params?.maxScore) searchParams.set('maxScore', String(params.maxScore));

    const res = await fetch(`/api/parcels?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch land parcel records');
    return res.json();
  },

  async getParcelById(idOrUlpin: string): Promise<LandParcelProfile> {
    const res = await fetch(`/api/parcels/${encodeURIComponent(idOrUlpin)}`);
    if (!res.ok) throw new Error('Land parcel record not found');
    return res.json();
  },

  async getWatchlist(): Promise<WatchlistSubscription[]> {
    const res = await fetch('/api/watchlist');
    if (!res.ok) throw new Error('Failed to fetch watchlist');
    return res.json();
  },

  async addToWatchlist(data: {
    parcelId: string;
    notificationEmail: string;
    webhookUrl?: string;
    alertOnLitigation?: boolean;
    alertOnMortgage?: boolean;
    alertOnRegistration?: boolean;
    alertOnPublicNotice?: boolean;
  }): Promise<WatchlistSubscription> {
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to subscribe to parcel');
    return res.json();
  },

  async removeFromWatchlist(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to remove parcel from watchlist');
    return res.json();
  },

  async getAlerts(): Promise<ParcelAlertEvent[]> {
    const res = await fetch('/api/alerts');
    if (!res.ok) throw new Error('Failed to fetch alert stream');
    return res.json();
  },

  async markAlertsRead(alertId?: string): Promise<{ success: boolean; alerts: ParcelAlertEvent[] }> {
    const res = await fetch('/api/alerts/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alertId }),
    });
    if (!res.ok) throw new Error('Failed to update alert state');
    return res.json();
  },

  async simulateAlertEvent(data: {
    parcelId: string;
    eventType: 'NEW_REGISTRATION' | 'NEW_CERSAI_MORTGAGE' | 'NEW_COURT_SUIT' | 'MUTATION_STATUS_CHANGE' | 'PUBLIC_GAZETTE_NOTICE';
    customTitle?: string;
    customDescription?: string;
    severity?: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  }): Promise<ParcelAlertEvent> {
    const res = await fetch('/api/alerts/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to simulate alert event');
    return res.json();
  },

  async generateAiLegalOpinion(req: AiLegalOpinionRequest): Promise<AiLegalOpinionResponse> {
    const res = await fetch('/api/ai/title-opinion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error('Failed to generate AI legal due-diligence report');
    return res.json();
  },

  async screenPortfolio(parcelIds?: string[]): Promise<any> {
    const res = await fetch('/api/portfolio/screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelIds }),
    });
    if (!res.ok) throw new Error('Failed to run batch portfolio screening');
    return res.json();
  }
};
