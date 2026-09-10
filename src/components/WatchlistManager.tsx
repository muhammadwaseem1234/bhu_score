import React, { useState } from 'react';
import { WatchlistSubscription, ParcelAlertEvent, LandParcelProfile } from '../types';
import { Bell, Mail, Smartphone, Globe, Plus, Trash2, Zap, CheckCircle2, AlertTriangle, ShieldAlert, Sparkles, Send, RefreshCw } from 'lucide-react';

interface WatchlistManagerProps {
  currentParcel: LandParcelProfile;
  watchlist: WatchlistSubscription[];
  alerts: ParcelAlertEvent[];
  onSubscribe: (data: {
    parcelId: string;
    notificationEmail: string;
    webhookUrl?: string;
    alertOnLitigation: boolean;
    alertOnMortgage: boolean;
    alertOnRegistration: boolean;
    alertOnPublicNotice: boolean;
  }) => Promise<void>;
  onUnsubscribe: (id: string) => Promise<void>;
  onSimulateEvent: (data: {
    parcelId: string;
    eventType: 'NEW_REGISTRATION' | 'NEW_CERSAI_MORTGAGE' | 'NEW_COURT_SUIT' | 'MUTATION_STATUS_CHANGE' | 'PUBLIC_GAZETTE_NOTICE';
    customTitle?: string;
    customDescription?: string;
    severity?: 'INFO' | 'WARNING' | 'ALERT' | 'CRITICAL';
  }) => Promise<void>;
  onSelectParcel: (parcelId: string) => void;
}

export const WatchlistManager: React.FC<WatchlistManagerProps> = ({
  currentParcel,
  watchlist,
  alerts,
  onSubscribe,
  onUnsubscribe,
  onSimulateEvent,
  onSelectParcel
}) => {
  const isCurrentlySubscribed = watchlist.some(w => w.parcelId === currentParcel.id);

  // Form State
  const [email, setEmail] = useState('selvasurukam@gmail.com');
  const [webhookUrl, setWebhookUrl] = useState('https://api.fintech-lender.com/webhooks/bhuscore-risk');
  const [alertLitigation, setAlertLitigation] = useState(true);
  const [alertMortgage, setAlertMortgage] = useState(true);
  const [alertRegistration, setAlertRegistration] = useState(true);
  const [alertPublicNotice, setAlertPublicNotice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Simulation State
  const [simEventType, setSimEventType] = useState<'NEW_COURT_SUIT' | 'NEW_CERSAI_MORTGAGE' | 'NEW_REGISTRATION' | 'PUBLIC_GAZETTE_NOTICE'>('NEW_COURT_SUIT');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubscribe({
        parcelId: currentParcel.id,
        notificationEmail: email,
        webhookUrl: webhookUrl.trim() || undefined,
        alertOnLitigation: alertLitigation,
        alertOnMortgage: alertMortgage,
        alertOnRegistration: alertRegistration,
        alertOnPublicNotice: alertPublicNotice,
      });

      // Browser Push Notification simulation
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`BhuScore Bureau Watchlist Active`, {
          body: `Subscribed to real-time 24/7 title & litigation alerts for Survey No. ${currentParcel.stateSurveyNo} (${currentParcel.ulpin})`,
          icon: '/favicon.ico'
        });
      }

      setSuccessToast(`Successfully subscribed ${email} to parcel ${currentParcel.ulpin}! Automated email and push triggers are live.`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    try {
      await onSimulateEvent({
        parcelId: currentParcel.id,
        eventType: simEventType,
      });

      // Trigger browser notification if supported
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`🚨 BhuScore Real-Time Alert!`, {
          body: `New event detected on Survey ${currentParcel.stateSurveyNo}: ${simEventType.replace(/_/g, ' ')}`,
        });
      }

      setSuccessToast(`Live alert triggered! Dispatched to Email (${email}), Browser Push, and Webhook listener.`);
      setTimeout(() => setSuccessToast(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  const requestBrowserPushPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          setSuccessToast('Browser Push Notifications Enabled! You will receive instant desktop alerts on new filings.');
          setTimeout(() => setSuccessToast(null), 4000);
        }
      });
    }
  };

  return (
    <div id="watchlist-manager-section" className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-sm flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* Grid: Subscription Form & Live Event Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Watchlist Subscription Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Bell className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Parcel Watchlist & 24/7 Alert Subscription</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Target: <strong className="text-slate-800 font-mono">{currentParcel.ulpin}</strong> (Sy {currentParcel.stateSurveyNo})
                </p>
              </div>
            </div>

            <button
              onClick={requestBrowserPushPermission}
              className="text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enable Browser Push</span>
            </button>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                Notification Email (Bank Risk Desk / Legal Counsel)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="credit-officer@bank.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                Enterprise Webhook Endpoint (Optional / FinTech API)
              </label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://your-bank-core.com/api/v1/land-alerts"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
              />
            </div>

            {/* Alert Triggers Checkboxes */}
            <div className="pt-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Automated Trigger Matrix
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={alertLitigation}
                    onChange={(e) => setAlertLitigation(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-white border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">eCourts Suit Filings</div>
                    <div className="text-[10px] text-slate-500">New suits, stays & interim orders</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={alertMortgage}
                    onChange={(e) => setAlertMortgage(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-white border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">CERSAI Mortgage Charges</div>
                    <div className="text-[10px] text-slate-500">Fresh bank hypothecations & liens</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={alertRegistration}
                    onChange={(e) => setAlertRegistration(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-white border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Sub-Registrar Transfers</div>
                    <div className="text-[10px] text-slate-500">Sale deeds, GPA & agreements</div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-slate-300">
                  <input
                    type="checkbox"
                    checked={alertPublicNotice}
                    onChange={(e) => setAlertPublicNotice(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4 bg-white border-slate-300"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">Govt Land Acquisition</div>
                    <div className="text-[10px] text-slate-500">Sec 4/6 gazettes & masterplans</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>{isCurrentlySubscribed ? 'Update Watchlist Settings' : 'Subscribe to 24/7 Automated Parcel Watch'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Event Trigger Simulator (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-200">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">Live Registry Event Simulator</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Test automated real-time alerts across Email & Webhook
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed font-medium">
              Simulate an external event triggered in Government / Judicial registries to test your automated email dispatch and lender webhook listeners in real-time.
            </p>

            <div className="space-y-2 mb-6">
              <label className="block text-xs font-semibold text-slate-700">Select Mock Registry Event:</label>
              
              <button
                type="button"
                onClick={() => setSimEventType('NEW_COURT_SUIT')}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  simEventType === 'NEW_COURT_SUIT' 
                    ? 'bg-rose-50 border-rose-400 text-rose-950 font-semibold ring-1 ring-rose-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>eCourts: New Civil Partition Suit Filed</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300">CRITICAL</span>
              </button>

              <button
                type="button"
                onClick={() => setSimEventType('NEW_CERSAI_MORTGAGE')}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  simEventType === 'NEW_CERSAI_MORTGAGE' 
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-semibold ring-1 ring-amber-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>CERSAI: ₹4.5 Cr Secondary Mortgage Created</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">ALERT</span>
              </button>

              <button
                type="button"
                onClick={() => setSimEventType('PUBLIC_GAZETTE_NOTICE')}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  simEventType === 'PUBLIC_GAZETTE_NOTICE' 
                    ? 'bg-blue-50 border-blue-400 text-blue-950 font-semibold ring-1 ring-blue-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span>NHAI: Expressway Alignment Gazette Published</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-300">WARNING</span>
              </button>

              <button
                type="button"
                onClick={() => setSimEventType('NEW_REGISTRATION')}
                className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                  simEventType === 'NEW_REGISTRATION' 
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-300' 
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" />
                  <span>Bhoomi: Form 11 Mutation Transfer Lodged</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">INFO</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={isSimulating}
            onClick={handleRunSimulation}
            className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{isSimulating ? 'Dispatching Multi-Channel Event...' : 'Fire Event & Trigger Multi-Channel Alert'}</span>
          </button>
        </div>
      </div>

      {/* Active Watchlist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Active Monitored Land Portfolio ({watchlist.length} Subscribed Parcels)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Recurring Bureau Monitoring</span>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs font-medium">
            No parcels currently in watchlist. Subscribe above to begin 24/7 monitoring.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">ULPIN / Survey No</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">BhuScore</th>
                  <th className="py-2.5 px-3">Recipient Email</th>
                  <th className="py-2.5 px-3">Active Triggers</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {watchlist.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onSelectParcel(sub.parcelId)}
                        className="font-mono text-emerald-700 hover:underline font-bold text-left block cursor-pointer"
                      >
                        {sub.ulpin}
                      </button>
                      <span className="text-slate-500 text-[11px]">Sy {sub.surveyNo}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {sub.village}, {sub.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono font-bold text-slate-900">{sub.currentScore}</span>{' '}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                        {sub.riskGrade}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700 text-[11px]">
                      {sub.notificationEmail}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-1">
                        {sub.alertOnLitigation && <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded text-[10px] font-semibold border border-rose-200">Court</span>}
                        {sub.alertOnMortgage && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-semibold border border-amber-200">CERSAI</span>}
                        {sub.alertOnRegistration && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded text-[10px] font-semibold border border-blue-200">Deed</span>}
                        {sub.alertOnPublicNotice && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-semibold border border-purple-200">Govt</span>}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => onUnsubscribe(sub.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Unsubscribe"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Real-time Alert Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Bureau Alert Event Stream (Real-Time Ingestion)</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">{alerts.length} Total Events Logged</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                alert.severity === 'CRITICAL' 
                  ? 'bg-rose-50 border-rose-300 text-rose-950' 
                  : alert.severity === 'ALERT'
                  ? 'bg-amber-50 border-amber-300 text-amber-950'
                  : alert.severity === 'WARNING'
                  ? 'bg-blue-50 border-blue-300 text-blue-950'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    alert.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                    alert.severity === 'ALERT' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                    'bg-slate-200 text-slate-800 border border-slate-300'
                  }`}>
                    {alert.severity}
                  </span>
                  <span className="font-bold text-xs text-slate-900">{alert.title}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{alert.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span>Source: <strong className="text-slate-800">{alert.sourceRegistry}</strong></span>
                  <span>•</span>
                  <span>Target: <strong className="font-mono text-slate-800">{alert.ulpin}</strong> (Sy {alert.surveyNo})</span>
                  <span>•</span>
                  <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectParcel(alert.parcelId)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-xs border border-emerald-300 transition-colors whitespace-nowrap cursor-pointer"
                >
                  View Land Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
