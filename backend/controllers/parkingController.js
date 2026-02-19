const db = require("../config/db");

/* ===============================
   ✅ CHECK-IN
================================= */
exports.checkIn = (req, res) => {
  const {
    first_name,
    last_name,
    car_plate,
    phone,
    email,
    floor,
    zone,
    slot_number,
  } = req.body;

  // if (!first_name || !last_name || !car_plate || !floor || !zone || !slot_number) {
  //   return res.status(400).json({ message: "กรอกข้อมูลไม่ครบ" });
  // }

  const time_in = new Date();
  const status = "parking";

  const sql = `
    INSERT INTO parking_record
    (first_name, last_name, car_plate, phone, email, floor, zone, slot_number, time_in, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      first_name,
      last_name,
      car_plate,
      phone,
      email || null,
      floor,
      zone,
      slot_number,
      time_in,
      status,
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        message: "Check-in successful",
        record_id: result.insertId,
      });
    },
  );
};

/* ===============================
   ✅ GET STATUS (ปกติ)
================================= */
exports.getStatus = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM parking_record WHERE record_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    res.json(result[0]);
  });
};

/* ===============================
   ✅ LIVE STATUS (Real-Time)
   อิงราคา จาก Database
================================= */
exports.getLiveStatus = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM parking_record WHERE record_id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    const record = result[0];

    if (record.status === "finished") {
      return res.json(record);
    }

    const now = new Date();
    const diffMs = now - new Date(record.time_in);
    const diffHoursRaw = diffMs / (1000 * 60 * 60);

    // 🔥 คิดเฉพาะชั่วโมงเต็ม
    const diffHours = Math.floor(diffHoursRaw);

    const rateSql = "SELECT price_per_hour FROM parking_rate LIMIT 1";

    db.query(rateSql, (err2, rateResult) => {
      if (err2) return res.status(500).json({ message: "Rate error" });

      const price_per_hour = rateResult[0].price_per_hour;
      const current_price = diffHours * price_per_hour;

      res.json({
        ...record,
        current_time: now,
        hours_parked: diffHours,
        current_price,
        price_per_hour,
      });
    });
  });
};

/* ===============================
   ✅ CHECK-OUT
   อิงราคา จาก Database
================================= */
exports.checkOut = (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing record id" });
  }

  const getRecordSql = "SELECT * FROM parking_record WHERE record_id = ?";

  db.query(getRecordSql, [id], (err, recordResult) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (recordResult.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    const record = recordResult[0];

    if (record.status === "finished") {
      return res.json({
        message: "ออกจากลานแล้ว",
        total_price: record.total_price,
      });
    }

    const time_out = new Date();

    const diffMs = time_out - new Date(record.time_in);
    const diffHoursRaw = diffMs / (1000 * 60 * 60);

    // 🔥 คิดเฉพาะชั่วโมงเต็ม
    const diffHours = Math.floor(diffHoursRaw);

    const rateSql = "SELECT price_per_hour FROM parking_rate LIMIT 1";

    db.query(rateSql, (err2, rateResult) => {
      if (err2) return res.status(500).json({ message: "Rate error" });

      const price_per_hour = rateResult[0].price_per_hour;
      const total_price = diffHours * price_per_hour;

      const updateSql = `
        UPDATE parking_record
        SET time_out = ?, total_price = ?, status = 'finished'
        WHERE record_id = ?
      `;

      db.query(updateSql, [time_out, total_price, id], (err3) => {
        if (err3) return res.status(500).json({ message: "Update error" });

        res.json({
          message: "Check-out successful",
          total_price,
          hours_parked: diffHours,
          price_per_hour,
        });
      });
    });
  });
};

exports.getAvailableByFloor = (req, res) => {
  const { floor } = req.params;

  const TOTAL_SPOTS = 50;

  const sql = `
    SELECT COUNT(*) AS occupied
    FROM parking_record
    WHERE floor = ? AND status = 'parking'
  `;

  db.query(sql, [floor], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    const occupied = result[0].occupied;
    const available = TOTAL_SPOTS - occupied;

    res.json({
      floor,
      total: TOTAL_SPOTS,
      occupied,
      available
    });
  });
};

