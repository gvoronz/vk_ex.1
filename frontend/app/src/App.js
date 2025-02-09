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
    render: (text) => moment(text).format("YYYY-MM-DD HH:mm:ss"),
  },
];

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Функция для получения данных с сервера
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");  // Сброс ошибки перед новым запросом

      const response = await fetch("http://localhost:8080/ping-results");

      // Если ответ от сервера не успешный, выводим ошибку с деталью
      if (!response.ok) {
        const errorText = await response.text();  // Получаем текст ошибки от сервера
        throw new Error(`Ошибка при получении данных: ${response.status} ${errorText}`);
      }

      // Преобразуем ответ в формат JSON
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(`Не удалось загрузить данные. ${error.message}`);  // Выводим более точное сообщение об ошибке
      console.error("Ошибка загрузки:", error);  // Логируем ошибку в консоль
    } finally {
      setLoading(false);  // Окончание загрузки
    }
  };

  // Хук useEffect для первого запроса и периодического обновления данных
  useEffect(() => {
    fetchData();  // Получаем данные сразу при загрузке компонента
    const interval = setInterval(fetchData, 30000);  // Периодический запрос данных каждые 30 секунд
    return () => clearInterval(interval);  // Очищаем интервал при размонтировании компонента
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Результаты пинга</h2>

      {error && (
        <Alert message={error} type="error" showIcon className="mb-4" />
      )} {/* Отображаем ошибку */}
      {loading ? (
        <Spin size="large" className="block mx-auto mt-4" />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="ID" />
      )}
    </div>
  );
}
