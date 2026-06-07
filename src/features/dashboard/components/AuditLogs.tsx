import { useState, useEffect } from "react";
import { adminApi } from "../../../lib/api";
import { format } from "date-fns";
export function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminApi.getAuditLogs({ size: 50, sort: 'createdAt,desc' });
        setLogs(res.data.data.content || []);
      } catch (err) {
        console.error("Failed to fetch audit logs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);
  if (loading) return <div className="text-gray-500">Loading audit logs...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">System Audit Logs</h2>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={log.id || i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                  {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                </td>
                <td className="px-4 py-3 font-medium">{log.username}</td>
                <td className="px-4 py-3">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                    {log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 truncate max-w-md" title={log.details}>
                  {log.details}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No logs found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
