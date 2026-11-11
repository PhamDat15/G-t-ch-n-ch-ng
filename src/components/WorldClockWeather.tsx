"use client";

import { useState, useEffect } from "react";

interface CityTimeWeather {
  city: string;
  timeZone: string;
  temp: string;
  weather: string;
}

const CITIES: CityTimeWeather[] = [
  { city: "Hà Nội", timeZone: "Asia/Bangkok", temp: "28°C", weather: "Nắng nhẹ" },
  { city: "Tokyo", timeZone: "Asia/Tokyo", temp: "24°C", weather: "Quang đãng" },
  { city: "Paris", timeZone: "Europe/Paris", temp: "18°C", weather: "Dịu mát" },
  { city: "New York", timeZone: "America/New_York", temp: "21°C", weather: "Có mây" },
  { city: "London", timeZone: "Europe/London", temp: "17°C", weather: "Nhiều mây" },
  { city: "Sydney", timeZone: "Australia/Sydney", temp: "22°C", weather: "Gió nhẹ" },
];

export default function WorldClockWeather() {
  const [times, setTimes] = useState<Record<string, string>>({});
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [activeCityIdx, setActiveCityIdx] = useState(0);

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();

      // Cập nhật ngày tháng tiếng Việt
      const daysOfWeek = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
      const dayName = daysOfWeek[now.getDay()];
      setCurrentDateStr(
        `${dayName}, ${String(now.getDate()).padStart(2, "0")}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${now.getFullYear()}`
      );

      // Cập nhật giờ của các thành phố
      const newTimes: Record<string, string> = {};
      CITIES.forEach((c) => {
        try {
          const formatter = new Intl.DateTimeFormat("vi-VN", {
            timeZone: c.timeZone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          newTimes[c.city] = formatter.format(now);
        } catch {
          newTimes[c.city] = "--:--";
        }
      });
      setTimes(newTimes);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);

    // Luân chuyển thành phố hiển thị trên màn hình nhỏ
    const cityInterval = setInterval(() => {
      setActiveCityIdx((prev) => (prev + 1) % CITIES.length);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(cityInterval);
    };
  }, []);

  const activeCity = CITIES[activeCityIdx];

  return (
    <div className="flex items-center space-x-3 text-xs text-slate-300">
      {/* Ngày tháng chính */}
      <span className="font-medium text-slate-200">{currentDateStr || "Đang tải..."}</span>
      <span className="text-slate-600">|</span>

      {/* Hiển thị trên màn hình lớn: Hiện 3 thành phố đại diện */}
      <div className="hidden lg:flex items-center space-x-3">
        {CITIES.slice(0, 3).map((item, idx) => (
          <div key={item.city} className="flex items-center space-x-1.5">
            {idx > 0 && <span className="text-slate-600 mr-2">•</span>}
            <span className="text-slate-300">{item.city}</span>
            <span className="font-mono text-[#d49a37] font-semibold">
              {times[item.city] || "--:--"}
            </span>
            <span className="text-slate-400 text-[11px]">({item.temp})</span>
          </div>
        ))}
      </div>

      {/* Hiển thị trên màn hình vừa và nhỏ: Tự động lướt từng thành phố */}
      <div className="lg:hidden flex items-center space-x-1.5 animate-fade-in">
        <span className="text-slate-300">{activeCity.city}</span>
        <span className="font-mono text-[#d49a37] font-semibold">
          {times[activeCity.city] || "--:--"}
        </span>
        <span className="text-slate-400 text-[11px]">({activeCity.temp})</span>
      </div>
    </div>
  );
}
