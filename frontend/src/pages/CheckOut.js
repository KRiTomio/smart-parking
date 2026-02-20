import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

function CheckOut() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [duration, setDuration] = useState(null);

  useEffect(() => {
    handleCheckout();
  }, []);

  const handleCheckout = async () => {
    try {
      const res = await API.post("/parking/checkout", { id });

      setResult(res.data);

      // คำนวณเวลาที่จอดทั้งหมดจากชั่วโมงที่ backend ส่งมา
      const hours = res.data.hours_parked || 0;

      // สมมติว่า backend คิดจาก time_out - time_in
      // เพื่อแสดงผลละเอียด เราจะดึงข้อมูล status อีกครั้ง
      const statusRes = await API.get(`/parking/status/${id}`);

      const timeIn = new Date(statusRes.data.time_in);
      const timeOut = new Date(statusRes.data.time_out);

      const diffMs = timeOut - timeIn;

      const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
      const totalMinutes = Math.floor(
        (diffMs % (1000 * 60 * 60)) / (1000 * 60)
      );
      const totalSeconds = Math.floor(
        (diffMs % (1000 * 60)) / 1000
      );

      setDuration({
        totalHours,
        totalMinutes,
        totalSeconds,
      });

    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  if (!result || !duration)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg">กำลังคำนวณ...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[420px] text-center">

        <h2 className="text-2xl font-bold text-green-600 mb-4">
          สรุปการจอดรถ
        </h2>

        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">เวลาที่จอด:</span>{" "}
            {duration.totalHours} ชั่วโมง {duration.totalMinutes} นาที {duration.totalSeconds} วินาที
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl mb-6">
          <p className="text-lg font-semibold text-green-700">
            ค่าบริการ
          </p>
          <p className="text-3xl font-bold text-green-800">
            {result.total_price} บาท
          </p>
          <p className="text-sm text-gray-500">
            คิดจาก {result.hours_parked} ชั่วโมง
            ({result.price_per_hour} บาท / ชั่วโมง)
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition duration-300"
        >
          กลับหน้าแรก
        </button>
      </div>
    </div>
  );
}

export default CheckOut;
