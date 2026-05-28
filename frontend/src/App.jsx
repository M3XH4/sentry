import { useEffect, useRef, useState, } from "react";
import {
  Bell,
  Flame,
  BarChart3,
  Radio,
  Wifi,
  RefreshCw,
  DatabaseZap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const HAS_DATA = false; // change to false to preview no-data fallback

const smokeData = HAS_DATA
  ? [
    { time: "09:40", ppm: 450 },
    { time: "09:45", ppm: 500 },
    { time: "09:50", ppm: 680 },
    { time: "09:55", ppm: 820 },
    { time: "09:57", ppm: 2100 },
    { time: "10:00", ppm: 3300 },
    { time: "10:05", ppm: 3700 },
    { time: "10:10", ppm: 4050 },
    { time: "10:15", ppm: 3650 },
    { time: "10:20", ppm: 3842 },
  ]
  : [];

const smokeTypes = HAS_DATA
  ? [
    { name: "Vape Smoke", value: 60, fill: "#ef4444" },
    { name: "Cigarette Smoke", value: 20, fill: "#facc15" },
    { name: "Fire Smoke", value: 20, fill: "#f97316" },
  ]
  : [];

const devices = HAS_DATA
  ? [
    { name: "Classroom 301 Publisher", status: "ONLINE", ppm: "3,842 PPM", sub: "MQ-2" },
    { name: "Monitor Node 1", status: "ONLINE", ppm: "Active", sub: "Status" },
    { name: "Monitor Node 2", status: "ONLINE", ppm: "Active", sub: "Status" },
  ]
  : [];

const initialAlerts = HAS_DATA
  ? [
    ["10:24:31 AM", "Classroom 301", "DANGER", "High smoke level detected! (3842 PPM)", "MQTT, SMS"],
    ["10:18:05 AM", "Classroom 301", "WARNING", "Smoke level rising (2287 PPM)", "MQTT, SMS"],
    ["10:12:47 AM", "Classroom 305", "WARNING", "Smoke level rising (1765 PPM)", "MQTT"],
    ["10:05:14 AM", "Faculty Room", "SAFE", "Air quality normal (842 PPM)", "MQTT"],
    ["09:58:33 AM", "Classroom 301", "SAFE", "Air quality normal (612 PPM)", "MQTT"],
  ]
  : [];

const latestReading = smokeData.at(-1);
const currentPpm = latestReading?.ppm ?? 0;
const currentStatus =
  currentPpm > 3000
    ? "DANGER"
    : currentPpm > 1500
      ? "WARNING"
      : currentPpm > 0
        ? "SAFE"
        : "NO DATA";

function EmptyState({ title = "No data available", message = "Waiting for MQTT sensor readings..." }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-6 text-center">
      <DatabaseZap className="mb-3 text-slate-500" size={36} />
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, tone = "blue" }) {
  const tones = {
    red: "border-red-500/40 text-red-400 bg-red-500/10",
    blue: "border-blue-500/40 text-blue-400 bg-blue-500/10",
    yellow: "border-yellow-500/40 text-yellow-400 bg-yellow-500/10",
    green: "border-green-500/40 text-green-400 bg-green-500/10",
    gray: "border-slate-500/40 text-slate-400 bg-slate-500/10",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
      <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-slate-300">{title}</p>
      <div className="flex items-center gap-4">
        <div className={`shrink-0 rounded-full border p-3 sm:p-4 ${tones[tone]}`}>
          <Icon size={26} />
        </div>
        <div className="min-w-0">
          <h2 className={`truncate text-2xl font-bold sm:text-3xl ${tones[tone].split(" ")[1]}`}>{value}</h2>
          <p className="mt-1 text-sm text-slate-200">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ level }) {
  const style =
    level === "DANGER"
      ? "bg-red-500/25 text-red-100"
      : level === "WARNING"
        ? "bg-yellow-500/25 text-yellow-100"
        : "bg-green-500/25 text-green-100";

  return <span className={`rounded-md px-3 py-1 text-xs font-bold ${style}`}>{level}</span>;
}
function MqttBrokerCard({ wsConnected, onReconnect }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-300">
            MQTT Broker Connection
          </p>
          <h2 className="mt-3 text-xl font-bold text-white">HiveMQ Cloud</h2>
          <p className="mt-1 text-sm text-slate-400">Topic: iot/smoke/data</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReconnect}
            title="Reconnect WebSocket"
            className="rounded-full border border-slate-700 bg-slate-950 p-3 text-slate-300 transition hover:border-indigo-500/60 hover:bg-indigo-500/10 hover:text-indigo-300"
          >
            <RefreshCw size={22} />
          </button>

          <div
            className={`rounded-full border p-4 ${wsConnected
              ? "border-green-500/40 bg-green-500/10 text-green-400"
              : "border-slate-500/40 bg-slate-500/10 text-slate-400"
              }`}
          >
            <Wifi size={28} />
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Status</p>
          <p
            className={`mt-1 font-bold ${wsConnected ? "text-green-400" : "text-yellow-400"
              }`}
          >
            {wsConnected ? "CONNECTED" : "WAITING"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Protocol</p>
          <p className="mt-1 font-bold text-slate-200">WebSocket / Node-RED</p>
        </div>

        <div className="rounded-xl bg-slate-950/50 p-4">
          <p className="text-xs text-slate-500">Version</p>
          <p className="mt-1 font-bold text-slate-200">1.0.0</p>
        </div>
      </div>
    </div>
  );
}

export default function SentryDashboard() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [currentAlertPage, setCurrentAlertPage] = useState(1);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(initialAlerts.length);
  const alertsPerPage = 5;
  const lastAlertRef = useRef(null);
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "ws://localhost:1880/smoke-data";
  const hasData = smokeData.length > 0;
  const [wsConnected, setWsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const markAllNotificationsAsRead = () => {
    setUnreadCount(0);
  };
  const addAlert = ({ device, level, message, channel = "MQTT" }) => {
    const now = new Date().toLocaleTimeString();
    const newAlert = [now, device, level, message, channel];

    setAlerts((prev) => [newAlert, ...prev]);
    setUnreadCount((count) => count + 1);
  };
  useEffect(() => {
    if (!hasData) return;

    const latest = smokeData.at(-1);
    if (!latest) return;

    const level =
      latest.ppm > 3000 ? "DANGER" : latest.ppm > 1500 ? "WARNING" : "SAFE";

    if (level === "SAFE") return;

    const alertKey = `${latest.time}-${latest.ppm}-${level}`;
    if (lastAlertRef.current === alertKey) return;

    lastAlertRef.current = alertKey;

    const now = new Date().toLocaleTimeString();
    const newAlert = [
      now,
      "Classroom 301",
      level,
      level === "DANGER"
        ? `High smoke level detected! (${latest.ppm} PPM)`
        : `Smoke level rising (${latest.ppm} PPM)`,
      level === "DANGER" ? "MQTT, SMS" : "MQTT",
    ];

    setAlerts((prev) => [newAlert, ...prev]);
    setUnreadCount((count) => count + 1);
  }, [hasData]);
  const statusTone =
    currentStatus === "DANGER"
      ? "red"
      : currentStatus === "WARNING"
        ? "yellow"
        : currentStatus === "SAFE"
          ? "green"
          : "gray";

  const totalAlertPages = Math.max(1, Math.ceil(alerts.length / alertsPerPage));
  const paginatedAlerts = alerts.slice(
    (currentAlertPage - 1) * alertsPerPage,
    currentAlertPage * alertsPerPage
  );

  const goToPreviousAlertPage = () => {
    setCurrentAlertPage((page) => Math.max(1, page - 1));
  };

  const goToNextAlertPage = () => {
    setCurrentAlertPage((page) => Math.min(totalAlertPages, page + 1));
  };

  useEffect(() => {
    let shouldReconnect = true;

    const connectWebSocket = () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      const socket = new WebSocket(SOCKET_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket connected");
        setWsConnected(true);

        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          addAlert({
            device: data.location || "Classroom 301",
            level: data.status || "SAFE",
            message: `Smoke level: ${data.smoke_value} PPM, Type: ${data.smoke_type}`,
            channel: "WebSocket / Node-RED",
          });
        } catch (error) {
          console.error("Invalid WebSocket message:", error);
        }
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setWsConnected(false);

        if (shouldReconnect) {
          reconnectTimerRef.current = setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setWsConnected(false);
        socket.close();
      };
    };

    connectWebSocket();

    return () => {
      shouldReconnect = false;

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  const handleManualReconnect = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
  };
  return (
    <div className="min-h-screen bg-[#07111f] text-white">
      <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/20 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-indigo-600/25 p-3 text-indigo-300">
              <img src="/sentry-logo.png" alt="Sentry Logo" className="h-20 w-20" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">SENTRY</h1>
              <p className="mt-1 text-sm text-slate-300 sm:text-base">An IoT Smoke Detection and MQTT-Based Emergency Alert System</p>
            </div>
          </div>

          <div className="relative flex flex-wrap items-center gap-4 text-sm text-slate-300">
            <button
              onClick={() => setIsNotificationOpen((open) => !open)}
              className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 transition hover:bg-slate-800"
            >
              <div className="relative">
                <Bell />
                {unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-xs">
                    {unreadCount}
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-14 z-40 w-full max-w-sm rounded-2xl border border-slate-800 bg-[#07111f] p-4 shadow-2xl shadow-black/60 sm:w-96">
                <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-white">Notifications</h3>
                    <p className="text-xs text-slate-400">
                      {unreadCount} unread alert{unreadCount === 1 ? "" : "s"}
                    </p>
                  </div>

                  <button
                    onClick={markAllNotificationsAsRead}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-slate-800"
                  >
                    Mark all as read
                  </button>
                </div>

                {alerts.length ? (
                  <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                    {alerts.slice(0, 6).map((alert, index) => (
                      <div
                        key={`${alert[0]}-${alert[1]}-${index}`}
                        className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <StatusBadge level={alert[2]} />
                          <span className="text-xs text-slate-500">{alert[0]}</span>
                        </div>
                        <p className="mt-2 font-semibold text-slate-200">{alert[1]}</p>
                        <p className="mt-1 text-sm text-slate-400">{alert[3]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No notifications"
                    message="New SENTRY alerts will appear here."
                  />
                )}
              </div>
            )}

            <button
              onClick={() =>
                addAlert({
                  device: "Classroom 301",
                  level: "DANGER",
                  message: "High smoke level detected! (3842 PPM)",
                  channel: "MQTT, SMS",
                })
              }
              className="rounded-xl bg-red-500/20 px-4 py-3 font-semibold text-red-200 transition hover:bg-red-500/30"
            >
              Test Alert
            </button>

            <span>May 18, 2025</span>
            <span>10:24:35 AM</span>
          </div>
        </header>

        {!hasData && (
          <div className="mb-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
            No live MQTT readings yet. The dashboard will automatically populate once sensor data arrives.
          </div>
        )}

        <section className="mb-5">
          <MqttBrokerCard wsConnected={wsConnected} onReconnect={handleManualReconnect} />
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Current Status" value={currentStatus} subtitle={hasData ? "Latest sensor status" : "Waiting for data"} icon={Flame} tone={statusTone} />
          <StatCard title="Current PPM" value={hasData ? currentPpm.toLocaleString() : "—"} subtitle={hasData ? "Latest MQ-2 reading" : "No sensor reading"} icon={BarChart3} tone={statusTone} />
          <StatCard title="Active Devices" value={devices.length || "—"} subtitle={hasData ? "Online systems" : "No devices connected"} icon={Radio} tone={hasData ? "blue" : "gray"} />
          <StatCard title="Alerts Today" value={alerts.length || "—"} subtitle={hasData ? "Total alerts" : "No alert records"} icon={Bell} tone={hasData ? "yellow" : "gray"} />
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[2fr_1.1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-bold uppercase">Live Smoke Level (PPM)</h2>
              <select className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 sm:w-auto">
                <option>Last 30 Minutes</option>
                <option>Last Hour</option>
                <option>Today</option>
              </select>
            </div>

            {hasData ? (
              <div className="h-64 min-h-[16rem] min-w-0 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={smokeData} margin={{ left: -20, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="time" stroke="#cbd5e1" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#cbd5e1" domain={[0, 5000]} tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 12 }} />
                    <Area type="monotone" dataKey="ppm" stroke="#ef4444" fill="#ef444433" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState title="No smoke readings" message="Connect the ESP32 publisher or MQTT topic to display live PPM values." />
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold uppercase">Device Status</h2>
              <button
                onClick={() => setIsDeviceModalOpen(true)}
                className="text-sm text-indigo-400 transition hover:text-indigo-300"
              >
                View All
              </button>
            </div>

            {devices.length ? (
              <div className="space-y-3">
                {devices.map((device) => (
                  <div key={device.name} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold">{device.name}</p>
                      <p className="mt-1 text-sm text-slate-400">
                        {device.sub}: <span className="text-red-400">{device.ppm}</span>
                      </p>
                      <p className="text-xs text-slate-500">Last update: 10:24:30 AM</p>
                    </div>
                    <span className="w-fit rounded-md bg-green-500/20 px-2 py-1 text-xs font-bold text-green-300">ONLINE</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="No devices connected" message="Device cards will appear after a publisher or subscriber node connects." />
            )}
          </div>
        </section>

        <section className="mt-5 grid gap-5 xl:grid-cols-[2fr_1.1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-bold uppercase">Recent Alerts</h2>
              <button className="text-sm text-indigo-400">View All</button>
            </div>

            {alerts.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-400">
                    <tr className="border-b border-slate-800">
                      <th className="py-3">Time</th>
                      <th>Device</th>
                      <th>Level</th>
                      <th>Message</th>
                      <th>Channel</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAlerts.map((alert) => (
                      <tr key={alert.join("-")} className="border-b border-slate-800/80 text-slate-200">
                        <td className="py-3">{alert[0]}</td>
                        <td>{alert[1]}</td>
                        <td><StatusBadge level={alert[2]} /></td>
                        <td>{alert[3]}</td>
                        <td>{alert[4]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-400">
                    Page {currentAlertPage} of {totalAlertPages}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={goToPreviousAlertPage}
                      disabled={currentAlertPage === 1}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    <button
                      onClick={goToNextAlertPage}
                      disabled={currentAlertPage === totalAlertPages}
                      className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="No alerts yet" message="Warning and danger events will be listed here once detected." />
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-black/20 sm:p-6">
            <h2 className="mb-5 font-bold uppercase">Smoke Type Distribution</h2>

            {smokeTypes.length ? (
              <>
                <div className="h-56 min-h-[14rem] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={smokeTypes} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={2}>
                        {smokeTypes.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#020617", border: "1px solid #334155", borderRadius: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                  {smokeTypes.map((type) => (
                    <div key={type.name} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: type.fill }} />
                        {type.name}
                      </span>
                      <span>{type.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState title="No classification data" message="Smoke type distribution will appear after alerts are recorded." />
            )}
          </div>
        </section>
        {isDeviceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-[#07111f] p-5 shadow-2xl shadow-black/60 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold">All Device Status</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    Complete list of connected SENTRY publisher and monitoring nodes.
                  </p>
                </div>

                <button
                  onClick={() => setIsDeviceModalOpen(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Close
                </button>
              </div>

              {devices.length ? (
                <div className="max-h-[65vh] space-y-3 overflow-y-auto pr-1">
                  {devices.map((device) => (
                    <div
                      key={device.name}
                      className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold">{device.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {device.sub}: <span className="text-red-400">{device.ppm}</span>
                        </p>
                        <p className="text-xs text-slate-500">Last update: 10:24:30 AM</p>
                      </div>

                      <span className="w-fit rounded-md bg-green-500/20 px-2 py-1 text-xs font-bold text-green-300">
                        {device.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No devices connected"
                  message="Connected publisher and subscriber nodes will appear here."
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
