import { useEffect, useState } from "react";
import API from "../api";

function AdminDashboard() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await API.get("/parking/dashboard");
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {data.map((floor) => (
          <div
            key={floor.floor}
            className="bg-white shadow-xl rounded-2xl p-6 text-center"
          >
            <h2 className="text-xl font-bold mb-4">
              ชั้น {floor.floor}
            </h2>

            <p className="text-red-500 text-lg font-semibold">
              ใช้งาน: {floor.occupied}
            </p>

            <p className="text-green-600 text-lg font-semibold">
              ว่าง: {floor.available}
            </p>

            <p className="text-gray-500 text-sm">
              ทั้งหมด: {floor.total}
            </p>

            <div className="mt-4 bg-gray-200 rounded-full h-4">
              <div
                className="bg-indigo-500 h-4 rounded-full"
                style={{
                  width: `${(floor.occupied / floor.total) * 100}%`
                }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default AdminDashboard;