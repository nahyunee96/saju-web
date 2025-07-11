// src/components/MapPicker.tsx
'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet';
import type { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet 기본 아이콘을 CDN에서 불러오기 (v1.9.4 예시)
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export interface MapPickerProps {
  /** 초기 중심 좌표 (위도, 경도) — 기본값을 세계 중심으로 설정 */
  initialPosition?: [number, number];
  /** 지도 클릭 시 위·경도 콜백 */
  onSelectPosition: (lat: number, lng: number) => void;
  /** 초기 줌 레벨 — 기본 2로 전 지구가 한눈에 보이도록 */
  zoom?: number;
  /** 지도 스타일 (width/height) */
  style?: React.CSSProperties;
  className?: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

/** 지도 클릭 이벤트만 처리하고 위경도 콜백 호출 */
function LocationClickHandler({
  onSelectPosition,
}: {
  onSelectPosition: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      onSelectPosition(lat, lng);
    },
  });
  return null;
}

/** position / zoom 변경 시 지도를 중앙으로 옮깁니다 */
function MapController({
  position,
  zoom,
}: {
  position: LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(position, zoom);
  }, [position, zoom, map]);
  return null;
}

export default function MapPicker({
  initialPosition = [37.5665, 126.978],
  onSelectPosition,
  zoom = 13,               
  //style = { width: '100%', height: '200px' },
}: MapPickerProps) {
  const [position, setPosition] =
    useState<LatLngExpression>(initialPosition);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const debounceRef = useRef<number | null>(null);

  // 자동완성 API 호출 (300ms 디바운스)
  useEffect(() => {
  if (!isTyping) return;  
  if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(searchTerm)}`);
        if (!res.ok) throw new Error(res.statusText);
        const results: Suggestion[] = await res.json();
        setSuggestions(results);
      } catch (err) {
        console.error('Autocomplete fetch error:', err);
        setSuggestions([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
    };
  }, [searchTerm, isTyping]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsTyping(true);
  };

  // 제안 선택 시 맵 이동
  const selectSuggestion = (s: Suggestion) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    setPosition([lat, lng]);
    onSelectPosition(lat, lng);
    setSearchTerm(s.display_name);
    setSuggestions([]);
    setIsTyping(false);
  };

  return (
  <div className="relative w-full h-[200px] md:h-[250px]">  {/* ① 부모를 relative로 */}
    {/* ② 검색창은 absolute & 높은 z-index */}
    <div className="relative z-50">
      <input
        type="text"
        value={searchTerm}
        onChange={onInputChange}
        placeholder="도시 이름으로 검색 (해외도 가능)"
        className="w-full border p-2 text-sm outline-none bg-white"
      />
      {suggestions.length > 0 && (
        <ul className="absolute t-0 l-0 w-full max-h-40 overflow-auto bg-white border">
          {suggestions.map((s, i) => (
            <li
              key={i}
              onClick={() => selectSuggestion(s)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>

    {/* ③ MapContainer는 z-0 이하로 */}
    <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom
        className="w-full h-[160px] md:h-[200px] z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationClickHandler
          onSelectPosition={(lat, lng) => {
            setPosition([lat, lng]);
            onSelectPosition(lat, lng);
          }}
        />
        <MapController position={position} zoom={zoom} />
        {/* 항상 position 상태에 맞춰 마커 렌더 */}
        <Marker position={position} />
      </MapContainer>
  </div>

  );
}
