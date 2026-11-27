import React, { useEffect, useState, useCallback } from 'react';
import { BarChart3, Users, Eye, Gamepad2, Crown, Smartphone, Monitor, RefreshCw, ArrowRight, Globe } from 'lucide-react';
import { ACTIVITY_TILES } from './HomeHub';

export default function StatsDashboard({ lang, onBack }) {
  const isHe = lang === 'he';
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStats = useCallback(async (rangeDays) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/analytics/stats?days=${rangeDays}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e.message || 'Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(days);
  }, [days, loadStats]);

  const tileMap = Object.fromEntries(ACTIVITY_TILES.map((t) => [t.id, t]));
  const maxGameCount = Math.max(1, ...(data?.byActivity?.map((a) => a.count) || [1]));
  const maxDayViews = Math.max(1, ...(data?.dailyTrend?.map((d) => Math.max(d.views, d.plays)) || [1]));

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/30 border border-indigo-300/40 flex items-center justify-center">
            <BarChart3 className="w-7 h-7 text-amber-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black">
              {isHe ? 'סְטָטִיסְטִיקוֹת וְשִׁמּוּשׁ בָּאֲתָר' : 'Site & App Usage Stats'}
            </h2>
            <p className="text-xs text-indigo-200 font-medium">
              {isHe ? 'מְדִידָה אָנוֹנִימִית לְלֹא עוּגִיּוֹת צַד ג׳ • מֵיְדָע חַי מִ-Cloudflare D1' : 'Privacy-safe first-party analytics from Cloudflare D1'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition ${
                days === d ? 'bg-amber-400 text-slate-900' : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              {d}d
            </button>
          ))}
          <button
            type="button"
            onClick={() => loadStats(days)}
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-900 font-black text-xs rounded-xl cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>{isHe ? 'חֲזָרָה' : 'Back'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border-2 border-rose-300 text-rose-800 rounded-2xl font-bold text-sm">
          {error}
        </div>
      )}

      {data && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white rounded-2xl p-4 border-2 border-indigo-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-500" /> {isHe ? 'בִּקּוּרִים (סֶשְׁנִים)' : 'Unique Sessions'}</div>
              <div className="text-3xl font-black text-slate-800 mt-1">{data.totals.uniqueSessions}</div>
              <div className="text-[11px] font-bold text-emerald-600 mt-0.5">24h: {data.last24h.uniqueSessions24h}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-sky-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Eye className="w-4 h-4 text-sky-500" /> {isHe ? 'צְפִיּוֹת בַּדַּף' : 'Page Views'}</div>
              <div className="text-3xl font-black text-slate-800 mt-1">{data.totals.pageViews}</div>
              <div className="text-[11px] font-bold text-sky-600 mt-0.5">24h: {data.last24h.pageViews24h}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-amber-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Gamepad2 className="w-4 h-4 text-amber-500" /> {isHe ? 'מִשְׂחָקִים שֶׁנִּפְתְּחוּ' : 'Games Played'}</div>
              <div className="text-3xl font-black text-slate-800 mt-1">{data.totals.gamePlays}</div>
              <div className="text-[11px] font-bold text-amber-700 mt-0.5">⭐ {data.totals.starsEvents} {isHe ? 'זְכִיּוֹת' : 'star wins'}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-emerald-200 shadow-sm">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Crown className="w-4 h-4 text-emerald-600" /> {isHe ? 'מִשְׁתַּמְּשֵׁי PRO' : 'Pro Users'}</div>
              <div className="text-3xl font-black text-slate-800 mt-1">{data.accounts.proUsers}</div>
              <div className="text-[11px] font-bold text-slate-500 mt-0.5">{isHe ? `מָסָךְ PRO: ${data.funnel.proViews}` : `Modal views: ${data.funnel.proViews}`}</div>
            </div>

            <div className="bg-white rounded-2xl p-4 border-2 border-purple-200 shadow-sm col-span-2 md:col-span-1">
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Globe className="w-4 h-4 text-purple-500" /> {isHe ? 'רְשׁוּמִים (Google)' : 'Signed-in Parents'}</div>
              <div className="text-3xl font-black text-slate-800 mt-1">{data.accounts.totalUsers}</div>
              <div className="text-[11px] font-bold text-purple-600 mt-0.5">{isHe ? `הִתְחַבְּרוּיוֹת: ${data.funnel.googleSignins}` : `Sign-ins: ${data.funnel.googleSignins}`}</div>
            </div>
          </div>

          {/* Popular Activities + Device & Language Split */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-3">
                {isHe ? 'הַמִּשְׂחָקִים הֲכִי פּוֹפּוּלָרִיִּים' : 'Most Popular Activities'}
              </h3>
              {data.byActivity.length === 0 ? (
                <p className="text-sm text-slate-400 font-bold py-6 text-center">
                  {isHe ? 'עֲדַיִן אֵין מִשְׂחָקִים בַּתְּקוּפָה זוֹ' : 'No activity plays recorded in this window yet.'}
                </p>
              ) : (
                <div className="space-y-2.5">
                  {data.byActivity.map((row) => {
                    const tile = tileMap[row.id];
                    const pct = Math.round((row.count / maxGameCount) * 100);
                    return (
                      <div key={row.id} className="flex items-center gap-3">
                        <div className="w-40 flex items-center gap-2 text-sm font-black text-slate-700 truncate">
                          <span>{tile?.icon || '🎮'}</span>
                          <span className="truncate">{tile ? (isHe ? tile.titleHe : tile.titleEn) : row.id}</span>
                        </div>
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                            style={{ width: `${Math.max(6, pct)}%` }}
                          />
                        </div>
                        <span className="w-10 text-end font-black text-sm text-slate-800">{row.count}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm flex flex-col gap-4">
              <div>
                <h3 className="text-base font-black text-slate-800 mb-2">
                  {isHe ? 'מַכְשִׁירִים (מַחְשֵׁב / נַיָּד)' : 'Devices'}
                </h3>
                <div className="space-y-2">
                  {data.byDevice.map((d) => (
                    <div key={d.device} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-sm font-bold">
                      <span className="flex items-center gap-2">
                        {d.device === 'mobile' ? <Smartphone className="w-4 h-4 text-emerald-600" /> : <Monitor className="w-4 h-4 text-indigo-600" />}
                        {d.device === 'mobile' ? (isHe ? 'נַיָּד / טָאבְּלֶט' : 'Phone / Tablet') : isHe ? 'מַחְשֵׁב' : 'Computer'}
                      </span>
                      <span className="font-black text-slate-900">{d.sessions} {isHe ? 'סֶשְׁנִים' : 'sessions'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-800 mb-2">
                  {isHe ? 'שָׂפָה מֻעֲדֶפֶת' : 'Language'}
                </h3>
                <div className="space-y-2">
                  {data.byLang.map((l) => (
                    <div key={l.lang} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-xl text-sm font-bold">
                      <span>{l.lang === 'he' ? '🇮🇱 עברית' : '🇬🇧 English'}</span>
                      <span className="font-black text-slate-900">{l.sessions}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 14-Day Trend */}
          <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-3">
              {isHe ? 'פְּעִילוּת בְּ-14 הַיָּמִים הָאַחֲרוֹנִים' : 'Last 14 Days Activity'}
            </h3>
            {data.dailyTrend.length === 0 ? (
              <p className="text-sm text-slate-400 font-bold py-4 text-center">
                {isHe ? 'מַמְתִּין לִנְתוּנִים רִאשׁוֹנִים...' : 'Waiting for first daily data...'}
              </p>
            ) : (
              <div className="flex items-end gap-2 h-36 pt-4 overflow-x-auto" dir="ltr">
                {data.dailyTrend.map((d) => {
                  const hViews = Math.max(8, Math.round((d.views / maxDayViews) * 100));
                  const hPlays = Math.max(4, Math.round((d.plays / maxDayViews) * 100));
                  return (
                    <div key={d.day} className="flex-1 min-w-[36px] flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center gap-1 h-24">
                        <div className="w-3 bg-sky-400 rounded-t-md" style={{ height: `${hViews}%` }} title={`Views: ${d.views}`} />
                        <div className="w-3 bg-indigo-600 rounded-t-md" style={{ height: `${hPlays}%` }} title={`Plays: ${d.plays}`} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">{d.day.slice(5)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
