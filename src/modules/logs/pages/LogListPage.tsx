import { useEffect, useState } from 'react';
import { getLogs } from '../services/log-service';
import type { Log } from '../types/Log';

const LogListPage = () => {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    getLogs().then(setLogs);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Logs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">Level</th>
              <th className="py-2 px-4 border-b">Message</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="py-2 px-4 border-b">{log.timestamp.toLocaleString()}</td>
                <td className="py-2 px-4 border-b">{log.level}</td>
                <td className="py-2 px-4 border-b">{log.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LogListPage;
