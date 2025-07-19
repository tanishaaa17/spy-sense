import React, { useState, useEffect } from 'react';
import { FaTerminal, FaRobot, FaBug, FaMicrochip } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './Dashboard.css';

const SIDEBAR_ITEMS = [
  { key: 'logs', label: 'Logs', icon: <FaTerminal /> },
  { key: 'summary', label: 'Gemini Summary', icon: <FaRobot /> },
  { key: 'detection', label: 'Detection', icon: <FaBug /> },
  { key: 'system', label: 'System Info', icon: <FaMicrochip /> },
];

function LoadingSpinner() {
  return <div className="spinner"><div /></div>;
}

function formatDetectionData(data) {
  if (typeof data === 'string') {
    return data;
  }
  return JSON.stringify(data, null, 2);
}

export default function Dashboard() {
  const [active, setActive] = useState('logs');
  const [logs, setLogs] = useState('');
  const [summary, setSummary] = useState('');
  const [detection, setDetection] = useState([]);
  const [system, setSystem] = useState({ cpu: 0, ram: 0, process_count: 0 });
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  // Poll system info every 5s
  useEffect(() => {
    let interval;
    const fetchSystem = async () => {
      setLoading((l) => ({ ...l, system: true }));
      setError((e) => ({ ...e, system: null }));
      try {
        const res = await fetch('/system');
        const data = await res.json();
        setSystem(data);
      } catch (err) {
        setError((e) => ({ ...e, system: 'Failed to fetch system info' }));
      } finally {
        setLoading((l) => ({ ...l, system: false }));
      }
    };
    fetchSystem();
    interval = setInterval(fetchSystem, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch data for active section
  useEffect(() => {
    const fetchData = async () => {
      setLoading((l) => ({ ...l, [active]: true }));
      setError((e) => ({ ...e, [active]: null }));
      try {
        if (active === 'logs') {
          const res = await fetch('/log');
          const data = await res.json();
          setLogs(data.log || '');
        } else if (active === 'summary') {
          const res = await fetch('/log-summary');
          const data = await res.json();
          setSummary(data.summary || 'No summary.');
        } else if (active === 'detection') {
          const res = await fetch('/detect');
          const data = await res.json();
          setDetection(Array.isArray(data) ? data : [data]);
        }
      } catch (err) {
        setError((e) => ({ ...e, [active]: 'Failed to fetch data' }));
      } finally {
        setLoading((l) => ({ ...l, [active]: false }));
      }
    };
    if (active !== 'system') fetchData();
  }, [active]);

  // Sidebar click handler
  const handleSidebarClick = (key) => {
    setActive(key);
  };

  // System chart data
  const sysChartData = {
    labels: ['CPU %', 'RAM %'],
    datasets: [
      {
        label: 'Usage',
        data: [system.cpu, system.ram],
        backgroundColor: [
          'rgba(57,255,20,0.7)',
          'rgba(180,0,255,0.7)'
        ],
        borderColor: [
          'rgba(57,255,20,1)',
          'rgba(180,0,255,1)'
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="hacker-root">
      <aside className="hacker-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">SPY SENSE</span>
        </div>
        <nav>
          {SIDEBAR_ITEMS.map((item) => (
            <div
              key={item.key}
              className={`sidebar-item${active === item.key ? ' active' : ''}`}
              onClick={() => handleSidebarClick(item.key)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <div className="content-wrapper">
        <h1 className="dashboard-header">SPY SENSE // HACKER DASHBOARD</h1>
        <main className="hacker-main">
          <div className="hacker-cards">
            {active === 'logs' && (
              <section className="hacker-card neon-card">
                <h2 className="glitch" data-text="Keylog">Keylog</h2>
                {loading.logs ? <LoadingSpinner /> : error.logs ? <div className="error-msg">{error.logs}</div> : (
                  <textarea className="hacker-logs" value={logs} readOnly />
                )}
              </section>
            )}
            {active === 'summary' && (
              <section className="hacker-card neon-card">
                <h2 className="glitch" data-text="Gemini Summary">Gemini Summary</h2>
                {loading.summary ? <LoadingSpinner /> : error.summary ? <div className="error-msg">{error.summary}</div> : (
                  <div className="hacker-summary typing-anim">{summary}</div>
                )}
              </section>
            )}
            {active === 'detection' && (
              <section className={`hacker-card neon-card ${detection.length === 0 ? 'card-green' : 'card-red'}`}>
                <h2 className="glitch" data-text="Detection">Detection</h2>
                {loading.detection ? <LoadingSpinner /> : error.detection ? <div className="error-msg">{error.detection}</div> : (
                  detection.length === 0 ? (
                    <div className="hacker-success">No suspicious processes found.</div>
                  ) : (
                    <div className="detection-container">
                      {detection.map((alert, idx) => (
                        <div key={idx} className="detection-item">
                          <pre className="detection-json">{formatDetectionData(alert)}</pre>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </section>
            )}
            {active === 'system' && (
              <section className="hacker-card neon-card">
                <h2 className="glitch" data-text="System Info">System Info</h2>
                {loading.system ? <LoadingSpinner /> : error.system ? <div className="error-msg">{error.system}</div> : (
                  <div className="system-charts">
                    <Bar
                      data={sysChartData}
                      options={{
                        indexAxis: 'y',
                        plugins: {
                          legend: { display: false },
                          title: { display: false },
                        },
                        scales: {
                          x: { min: 0, max: 100, grid: { color: '#444' }, ticks: { color: '#39ff14' } },
                          y: { grid: { color: '#444' }, ticks: { color: '#b400ff' } },
                        },
                      }}
                      height={120}
                    />
                    <div className="system-meta">
                      <span><FaMicrochip /> Processes: <span className="neon-purple">{system.process_count}</span></span>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 