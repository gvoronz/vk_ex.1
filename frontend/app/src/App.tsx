import { useEffect, useState } from "react";
import { Table, Spin, Alert } from "antd";
import moment from "moment";

const columns = [
  { title: "IP Address", dataIndex: "IPAddress", key: "ip" },
  { title: "Ping Time (ms)", dataIndex: "PingTime", key: "pingTime" },
  {
    title: "Last Seen",
    dataIndex: "LastSeen",
    key: "lastSeen",
    render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:8080/ping-results");
      if (!response.ok) throw new Error("Ошибка при получении данных");

      const result = await response.json();
      setData(result);
    } catch (error) {
      setError("Не удалось загрузить данные. Проверьте соединение с сервером.");
      console.error("Ошибка загрузки:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Ping Results</h2>

      {error && <Alert message={error} type="error" showIcon className="mb-4" />}
      {loading ? <Spin size="large" className="block mx-auto mt-4" /> : <Table dataSource={data} columns={columns} rowKey="ID" />}
    </div>
  );
}
