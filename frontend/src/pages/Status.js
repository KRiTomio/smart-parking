import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function Status() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await API.get(`/parking/live/${id}`);
      setData(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!data) return <div className="text-center mt-10">Loading...</div>;

  const timeIn = new Date(data.time_in);
  const now = new Date(data.current_time);
  const diffMs = now - timeIn;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[420px]">

        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          สถานะการจอดรถ
        </h2>

        <div className="space-y-2 text-gray-700">
          <p><span className="font-semibold">ชื่อ:</span> {data.first_name} {data.last_name}</p>
          <p><span className="font-semibold">ทะเบียน:</span> {data.car_plate}</p>
          <p>
            <span className="font-semibold">ตำแหน่ง:</span>{" "}
            ชั้น {data.floor} / โซน {data.zone} / ช่องจอด {data.slot_number}
          </p>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-xl text-center">
          <p className="text-lg font-semibold text-blue-700">⏳ เวลาที่จอด</p>
          <p className="text-2xl font-bold text-blue-900">
            {hours}h {minutes}m {seconds}s
          </p>
        </div>

        <div className="mt-6 bg-green-50 p-4 rounded-xl text-center">
          <p className="text-lg font-semibold text-green-700">💰 ค่าบริการ</p>
          <p className="text-3xl font-bold text-green-900">
            {data.current_price} บาท
          </p>
          <p className="text-sm text-gray-500">
            ({data.price_per_hour} บาท / ชั่วโมง)
          </p>
        </div>

        <button
          onClick={() => navigate(`/checkout/${id}`)}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl transition duration-300"
        >
          ออกจากลานจอด
        </button>
      </div>
    </div>
  );
}

export default Status;
