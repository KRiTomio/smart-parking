import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function CheckIn() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    car_plate: "",
    phone: "",
    email: "",
    floor: "",
    zone: "",
    slot_number: "",
  });

  const [availability, setAvailability] = useState(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 เรียก API เมื่อเลือกชั้น
  const handleFloorChange = async (e) => {
    const selectedFloor = e.target.value;

    setForm({ ...form, floor: selectedFloor });
    setAvailability(null);

    if (selectedFloor) {
      try {
        setLoadingAvailability(true);
        const res = await API.get(`/parking/availability/${selectedFloor}`);
        setAvailability(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAvailability(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availability && availability.available <= 0) {
      alert("ชั้นนี้เต็มแล้ว");
      return;
    }

    try {
      const res = await API.post("/parking/checkin", form);
      navigate(`/status/${res.data.record_id}`);
    } catch (error) {
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 to-blue-400 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[420px]">
        <h2 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Smart Parking
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="ชื่อ"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />

            <input
              name="last_name"
              placeholder="นามสกุล"
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <input
            name="car_plate"
            placeholder="ทะเบียนรถ"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="phone"
            placeholder="เบอร์โทร"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <input
            name="email"
            placeholder="อีเมล(ถ้ามี)"
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          

          {/* 🔥 ชั้น */}
          <div className="grid grid-cols-2 gap-4">
          <select
            name="floor"
            onChange={handleFloorChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">เลือกชั้น</option>
            <option value="1">ชั้น 1</option>
            <option value="2">ชั้น 2</option>
            <option value="3">ชั้น 3</option>
            <option value="4">ชั้น 4</option>
          </select>

          
          
          <select
            name="zone"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          >
            <option value="">เลือกโซน</option>
            <option value="A">โซน A</option>
            <option value="B">โซน B</option>
            <option value="C">โซน C</option>
          </select>
          </div>

          {/* 🔥 แสดงจำนวนว่าง */}
          {loadingAvailability && (
            <p className="text-sm text-gray-500 text-center">
              กำลังตรวจสอบจำนวนที่ว่าง...
            </p>
          )}

          {availability && (
            <div
              className={`p-3 rounded-lg text-center ${
                availability.available > 0
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              ที่จอดว่าง: {availability.available} / {availability.total}
            </div>
          )}


          <input
            name="slot_number"
            placeholder="เลขช่องจอด"
            onChange={handleChange}
            required
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <button
            type="submit"
            disabled={availability && availability.available <= 0}
            className={`w-full py-2 rounded-lg text-white transition duration-300 ${
              availability && availability.available <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            เริ่มจอดรถ
          </button>
        </form>
      </div>
    </div>
  );
}

export default CheckIn;
