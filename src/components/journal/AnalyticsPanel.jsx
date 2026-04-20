import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { Award, Calendar, Activity, Zap } from 'lucide-react';

const MOOD_VALUES = {
  Happy: 4,
  Productive: 3,
  Tired: 2,
  Sad: 1,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 8, fontSize: '0.85rem' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        <p style={{ margin: 0, fontWeight: 600, color: payload[0].color }}>
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const AnalyticsPanel = ({ entries }) => {

  const { weeklyData, moodTrendData, insights } = useMemo(() => {
    // 1. Generate last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = subDays(new Date(), 6 - i);
      return {
        dateStr: format(d, 'yyyy-MM-dd'),
        dayName: format(d, 'EEE'), // Mon, Tue, etc.
        count: 0
      };
    });

    let thisWeekCount = 0;
    const dayCounts = {}; // To find most active day

    // Process entries for weekly bar chart
    entries.forEach(entry => {
      const entryDate = entry.date; // yyyy-mm-dd
      const dayMatch = last7Days.find(d => d.dateStr === entryDate);
      if (dayMatch) {
        dayMatch.count += 1;
        thisWeekCount += 1;
      }
      dayCounts[entryDate] = (dayCounts[entryDate] || 0) + 1;
    });

    // 2. Find Most Active Day (all time or just recent? Let's do all time)
    let mostActiveDayStr = 'None';
    let maxCount = 0;
    Object.entries(dayCounts).forEach(([date, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDayStr = date;
      }
    });
    const mostActiveDayName = mostActiveDayStr !== 'None' ? format(parseISO(mostActiveDayStr), 'EEEE') : 'None';

    // 3. Mood Trend (Line Chart)
    // Take the last 14 entries, sorted chronologically (oldest to newest for the chart left-to-right)
    const recentEntries = [...entries]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-14);

    const moodTrendData = recentEntries.map(e => ({
      date: format(parseISO(e.date), 'MMM d'),
      moodVal: MOOD_VALUES[e.mood] || 2,
      mood: e.mood
    }));

    // 4. Most Frequent Mood
    const moodCounts = {};
    entries.forEach(e => {
      moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
    });
    const mostFrequentMood = entries.length > 0 
      ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
      : 'None';

    return {
      weeklyData: last7Days,
      moodTrendData,
      insights: {
        thisWeekCount,
        mostActiveDayName,
        mostFrequentMood,
        totalEntries: entries.length
      }
    };
  }, [entries]);

  return (
    <div className="analytics-panel">
      {/* Insights Row */}
      <div className="stats-mini-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: 24 }}>
        <div className="stat-mini">
          <Award size={20} style={{ color: '#3b82f6', marginBottom: 8 }} />
          <div className="stat-mini-value" style={{ fontSize: '1.5rem' }}>{insights.totalEntries}</div>
          <div className="stat-mini-label">Total</div>
        </div>
        <div className="stat-mini">
          <Activity size={20} style={{ color: '#8b5cf6', marginBottom: 8 }} />
          <div className="stat-mini-value text-accent" style={{ fontSize: '1.2rem' }}>{insights.mostFrequentMood}</div>
          <div className="stat-mini-label">Top Mood</div>
        </div>
        <div className="stat-mini">
          <Calendar size={20} style={{ color: '#10b981', marginBottom: 8 }} />
          <div className="stat-mini-value" style={{ fontSize: '1.5rem' }}>{insights.thisWeekCount}</div>
          <div className="stat-mini-label">This Week</div>
        </div>
        <div className="stat-mini">
          <Zap size={20} style={{ color: '#f59e0b', marginBottom: 8 }} />
          <div className="stat-mini-value" style={{ fontSize: '1.2rem', color: '#fcd34d' }}>{insights.mostActiveDayName}</div>
          <div className="stat-mini-label">Top Day</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Weekly Activity Bar Chart */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Activity (Last 7 Days)</h4>
          <div style={{ height: 200, width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={weeklyData}>
                <XAxis dataKey="dayName" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" name="Entries" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mood Trend Line Chart */}
        <div>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 16 }}>Mood Trend (Recent)</h4>
          <div style={{ height: 200, width: '100%' }}>
            <ResponsiveContainer>
              <LineChart data={moodTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  domain={[1, 4]} 
                  ticks={[1, 2, 3, 4]} 
                  stroke="var(--text-muted)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  width={40}
                  tickFormatter={(val) => {
                    if (val === 4) return 'Happy';
                    if (val === 3) return 'Prod';
                    if (val === 2) return 'Tired';
                    if (val === 1) return 'Sad';
                    return '';
                  }}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="moodVal" name="Mood Score" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPanel;
