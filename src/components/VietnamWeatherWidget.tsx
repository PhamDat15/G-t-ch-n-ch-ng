"use client";

import { useState, useEffect } from "react";

interface CityWeatherConfig {
  name: string;
  region: string;
  lat: number;
  lon: number;
  defaultTemp: number;
  condition: "sunny" | "rainy" | "cloudy" | "foggy";
}

const VIETNAM_DESTINATIONS: CityWeatherConfig[] = [
  { name: "Hà Nội", region: "Bắc Bộ", lat: 21.0285, lon: 105.8542, defaultTemp: 29, condition: "sunny" },
  { name: "Sa Pa", region: "Tây Bắc", lat: 22.3364, lon: 103.8438, defaultTemp: 18, condition: "foggy" },
  { name: "Hà Giang", region: "Đông Bắc", lat: 22.8233, lon: 104.9839, defaultTemp: 22, condition: "cloudy" },
  { name: "Đà Nẵng", region: "Miền Trung", lat: 16.0544, lon: 108.2022, defaultTemp: 31, condition: "sunny" },
  { name: "Đà Lạt", region: "Tây Nguyên", lat: 11.9404, lon: 108.4583, defaultTemp: 20, condition: "foggy" },
  { name: "Nha Trang", region: "Nam Trung Bộ", lat: 12.2388, lon: 109.1967, defaultTemp: 30, condition: "sunny" },
  { name: "TP. Hồ Chí Minh", region: "Nam Bộ", lat: 10.8231, lon: 106.6297, defaultTemp: 32, condition: "rainy" },
  { name: "Phú Quốc", region: "Kiên Giang", lat: 10.2899, lon: 103.9840, defaultTemp: 29, condition: "sunny" },
];

export default function VietnamWeatherWidget() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [weatherData, setWeatherData] = useState<{
    temp: number;
    humidity: number;
    windSpeed: number;
    weatherCode: number;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentCity = VIETNAM_DESTINATIONS[selectedIdx];

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    // Gọi API Open-Meteo để lấy dữ liệu thực tế tại vĩ độ/kinh độ của tỉnh thành
    const fetchWeather = async () => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${currentCity.lat}&longitude=${currentCity.lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=Asia%2FBangkok`;
        const res = await fetch(url);
        const data = await res.json();

        if (isMounted && data.current) {
          const code = data.current.weather_code;
          let desc = "Trời quang đãng";
          if (code >= 51 && code <= 67) desc = "Mưa rào nhẹ";
          else if (code >= 80 && code <= 99) desc = "Mưa dông";
          else if (code >= 1 && code <= 3) desc = "Nhiều mây, dịu mát";
          else if (code === 45 || code === 48) desc = "Sương mù cao nguyên";

          setWeatherData({
            temp: Math.round(data.current.temperature_2m),
            humidity: Math.round(data.current.relative_humidity_2m),
            windSpeed: Math.round(data.current.wind_speed_10m),
            weatherCode: code,
            description: desc,
          });
        }
      } catch {
        if (isMounted) {
          // Dự phòng nếu mất mạng
          setWeatherData({
            temp: currentCity.defaultTemp,
            humidity: 78,
            windSpeed: 12,
            weatherCode: 1,
            description: "Nắng ráo dịu mát",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [selectedIdx, currentCity]);

  // Xác định kiểu hiệu ứng dựa trên nhiệt độ và mô tả
  const isRainy = weatherData?.description.includes("Mưa");
  const isFoggy = weatherData?.description.includes("Sương") || currentCity.name === "Sa Pa" || currentCity.name === "Đà Lạt";
  const isSunny = !isRainy && !isFoggy;

  return (
    <div className="border border-slate-200 bg-white p-4 rounded-sm shadow-xs space-y-3">
      {/* Tiêu đề Box */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A56DB] block">
            Khí Tượng Du Lịch 3 Miền
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#0A2540] font-sans">
            Thời Tiết Điểm Đến Hôm Nay
          </h3>
        </div>
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Dữ liệu thời gian thực"></span>
      </div>

      {/* Thanh chọn nhanh tỉnh thành du lịch */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
        {VIETNAM_DESTINATIONS.map((c, idx) => (
          <button
            key={c.name}
            onClick={() => setSelectedIdx(idx)}
            className={`px-2 py-1 whitespace-nowrap rounded-xs font-semibold transition cursor-pointer ${
              selectedIdx === idx
                ? "bg-[#0A2540] text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Card Hiển Thị Thời Tiết Kèm Hiệu Ứng Sống Động */}
      <div
        className={`relative overflow-hidden p-4 rounded-sm border transition-all duration-500 ${
          isRainy
            ? "bg-gradient-to-br from-slate-100 to-blue-50 border-blue-200 text-slate-800"
            : isFoggy
            ? "bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200 border-slate-300 text-slate-800"
            : "bg-gradient-to-br from-amber-50/70 via-sky-50 to-blue-50/50 border-amber-200/80 text-slate-900"
        }`}
      >
        {/* HIỆU ỨNG THỜI TIẾT ĐỒNG BỘ */}
        {isRainy && (
          <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
            <div className="absolute top-2 left-6 w-0.5 h-6 bg-blue-500 rounded-full animate-rain"></div>
            <div className="absolute top-0 left-16 w-0.5 h-8 bg-blue-600 rounded-full animate-rain [animation-delay:0.3s]"></div>
            <div className="absolute top-1 left-28 w-0.5 h-6 bg-blue-500 rounded-full animate-rain [animation-delay:0.6s]"></div>
            <div className="absolute top-3 left-40 w-0.5 h-7 bg-blue-600 rounded-full animate-rain [animation-delay:0.2s]"></div>
            <div className="absolute top-0 right-8 w-0.5 h-8 bg-blue-500 rounded-full animate-rain [animation-delay:0.5s]"></div>
          </div>
        )}

        {isFoggy && (
          <div className="absolute inset-0 pointer-events-none opacity-30 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-drift"></div>
          </div>
        )}

        {isSunny && (
          <div className="absolute top-2 right-3 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-amber-400/20 animate-sun flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-amber-400/80 shadow-md"></div>
            </div>
          </div>
        )}

        {/* Thông tin nhiệt độ & tình trạng */}
        <div className="relative z-10">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                {currentCity.region}
              </span>
              <h4 className="text-xl font-extrabold text-[#0A2540] font-sans">
                {currentCity.name}
              </h4>
            </div>

            <div className="text-right">
              <span className="text-3xl font-black text-[#0A2540] font-mono">
                {isLoading ? "--" : `${weatherData?.temp}°C`}
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-[#1A56DB] mt-1.5 flex items-center space-x-1">
            <span>•</span>
            <span>{isLoading ? "Đang cập nhật vệ tinh..." : weatherData?.description}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-600 font-sans">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Độ ẩm không khí</span>
              <span className="font-mono font-bold text-slate-800">{weatherData?.humidity || 75}%</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Tốc độ gió</span>
              <span className="font-mono font-bold text-slate-800">{weatherData?.windSpeed || 10} km/h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
