import React from 'react';
import { PublicNotice } from '../types';
import { Newspaper, AlertOctagon, CheckCircle2, FileText, AlertTriangle } from 'lucide-react';

interface PublicNoticesViewProps {
  notices: PublicNotice[];
  state: string;
}

export const PublicNoticesView: React.FC<PublicNoticesViewProps> = ({ notices, state }) => {
  return (
    <div id="public-notices-card" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Newspaper className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">Government Gazettes & Land Acquisition Notices</h3>
            <p className="text-xs text-slate-500 font-medium">
              RFCTLARR Act 2013, Section 4/6 Notifications, NHAI / Metro Corridors, PTCL Alienation Bars
            </p>
          </div>
        </div>

        <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-full border border-slate-200">
          State Gazette: {state}
        </span>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-slate-900">No Acquisition or Statutory Restriction Gazettes</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 font-medium">
            Zero gazettes published by National Highways Authority of India (NHAI), Metro Rail, or State Industrial Development Corporations affecting this survey plot.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => {
            const isActive = notice.status === 'ACTIVE_NOTIFICATION';
            return (
              <div 
                key={notice.id}
                className={`p-4 rounded-xl border ${
                  isActive 
                    ? 'bg-rose-50/70 border-rose-300 text-rose-950' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{notice.noticeType}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">{notice.authority}</span>
                  </div>

                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                      : 'bg-slate-200 text-slate-700 border border-slate-300'
                  }`}>
                    {notice.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200 text-xs mb-2">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Gazette / Notification Ref</span>
                    <div className="font-mono text-slate-900 font-bold">{notice.gazetteNumber}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Published Date</span>
                    <div className="text-slate-800 font-medium">{notice.publishDate}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Impacted Extent</span>
                    <div className="text-slate-900 font-bold">{notice.affectedAreaAcres} Acres</div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded border border-slate-200 font-medium leading-relaxed">
                  {notice.details}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
