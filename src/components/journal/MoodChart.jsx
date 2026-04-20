import { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const MOOD_COLORS = {
  Happy: '#10b981',
  Sad: '#3b82f6',
  Tired: '#8b5cf6',
  Productive: '#f59e0b',
};

const MoodChart = ({ entries }) => {
  const data = useMemo(() => {
    const counts = {};
    entries.forEach(e => {
      counts[e.mood] = (counts[e.mood] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: '0.85rem' }}>
          <p style={{ color: payload[0].payload.fill || '#fff' }}>{payload[0].name}</p>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{payload[0].value} entries</p>
        </div>
      );
    }
    return null;
  };

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        Not enough data to analyze yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || '#6366f1'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
        {data.map(d => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: MOOD_COLORS[d.name] || '#fff' }} />
            {d.name} ({d.value})
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodChart;
