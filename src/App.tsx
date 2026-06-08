/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { 
  Car, 
  TrendingDown, 
  Info, 
  Heart, 
  HelpCircle, 
  Battery, 
  Zap, 
  Fuel, 
  Leaf, 
  Calendar, 
  DollarSign, 
  Coins, 
  Sparkles, 
  TrendingUp, 
  Check, 
  ArrowRight,
  Calculator,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CAR_TYPES, PRESET_PRICES } from "./data";
import { CarType, CarYearData } from "./types";

export default function App() {
  // Application states
  const [priceInput, setPriceInput] = useState<string>("500.000.000");
  const [selectedCarId, setSelectedCarId] = useState<string>("ev1");
  const [selectedYear, setSelectedYear] = useState<number>(3);
  const [compareAll, setCompareAll] = useState<boolean>(true);

  // Parse price state cleanly
  const rawPrice = useMemo(() => {
    const cleaned = priceInput.replace(/\D/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [priceInput]);

  // Format currency directly
  const formatRupiah = (val: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Convert inputs helper to text words (e.g. "Rp 500 Juta")
  const priceToIndonesianWords = (val: number): string => {
    if (val === 0) return "Rp 0";
    if (val >= 1000000000) {
      const bio = val / 1000000000;
      return `Rp ${bio.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Miliar`;
    }
    const mio = val / 1000000;
    return `Rp ${mio.toLocaleString("id-ID", { maximumFractionDigits: 0 })} Juta`;
  };

  // Safe input handler formatting on keyup
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Keep numbers only
    const cleanNumbers = value.replace(/\D/g, "");
    if (cleanNumbers === "") {
      setPriceInput("");
    } else {
      const formatted = Number(cleanNumbers).toLocaleString("id-ID");
      setPriceInput(formatted);
    }
  };

  // Handle Preset prices clicks
  const applyPresetPrice = (value: number) => {
    setPriceInput(value.toLocaleString("id-ID"));
  };

  // Selected car type details
  const selectedCar = useMemo(() => {
    return CAR_TYPES.find(car => car.id === selectedCarId) || CAR_TYPES[0];
  }, [selectedCarId]);

  // Target year data helper for selected car
  const activeYearData = useMemo(() => {
    return selectedCar.years.find(y => y.year === selectedYear) || selectedCar.years[2];
  }, [selectedCar, selectedYear]);

  // Calculate actual rupiah figures for breakdown
  // Total reduction is negative, so sisa persentase = 100% + totalReduction
  const calculatedValues = useMemo(() => {
    const base = rawPrice;
    const dy = activeYearData.depreciation;
    const oc = activeYearData.ownershipCost;
    const tr = activeYearData.totalReduction;
    
    const sisaPercent = Math.max(0, 100 + tr);
    
    const valueDepreciation = (base * Math.abs(dy)) / 100;
    const valueOwnershipCost = (base * Math.abs(oc)) / 100;
    const valueTotalReduction = (base * Math.abs(tr)) / 100;
    const valueRemaining = (base * sisaPercent) / 100;

    return {
      depreciation: valueDepreciation,
      ownershipCost: valueOwnershipCost,
      totalReduction: valueTotalReduction,
      remaining: valueRemaining,
      remainingPercent: sisaPercent
    };
  }, [rawPrice, activeYearData]);

  // Comparative calculation relative to standard ICE (Bensin)
  const iceComparison = useMemo(() => {
    const base = rawPrice;
    const iceCar = CAR_TYPES.find(c => c.id === "ice");
    if (!iceCar || selectedCarId === "ice") return null;

    const selectedSisaPercent = 100 + activeYearData.totalReduction;
    const iceYearData = iceCar.years.find(y => y.year === selectedYear);
    if (!iceYearData) return null;

    const iceSisaPercent = 100 + iceYearData.totalReduction;
    const selectedRemainingValue = (base * selectedSisaPercent) / 100;
    const iceRemainingValue = (base * iceSisaPercent) / 100;

    const valueDiff = selectedRemainingValue - iceRemainingValue;
    const isBetter = valueDiff > 0;

    return {
      diffAmount: Math.abs(valueDiff),
      isBetter,
      percentDiff: Math.abs(selectedSisaPercent - iceSisaPercent).toFixed(1)
    };
  }, [rawPrice, selectedCarId, selectedYear, activeYearData]);

  // SVG Chart Dimensions & Configuration
  const chartHeight = 265;
  const chartWidth = 500;
  const paddingX = 45;
  const paddingY = 25;

  // Render SVG Line path helper
  const getCoordinatesForCar = (car: CarType) => {
    const points = [{ year: 0, cost: 0 }];
    car.years.forEach(y => {
      points.push({ year: y.year, cost: Math.abs(y.totalReduction) });
    });

    return points.map(p => {
      // Map year (0 to 5) to X dimension
      const x = paddingX + (p.year / 5) * (chartWidth - 2 * paddingX);
      // Map cost percentage (0 to 100) to Y dimension (SVG 0 is at top, so flip it)
      const y = chartHeight - paddingY - (p.cost / 100) * (chartHeight - 2 * paddingY);
      return { x, y, year: p.year, cost: p.cost };
    });
  };

  // Get SVG paths for the curves
  const curvesData = useMemo(() => {
    return CAR_TYPES.map(car => {
      const coords = getCoordinatesForCar(car);
      // Build straight line path using coordinates
      let d = `M ${coords[0].x} ${coords[0].y}`;
      for (let i = 1; i < coords.length; i++) {
        d += ` L ${coords[i].x} ${coords[i].y}`;
      }
      return {
        id: car.id,
        name: car.name,
        color: car.color,
        coords,
        d
      };
    });
  }, [chartWidth, chartHeight]);

  const activePoints = useMemo(() => {
    return curvesData.map(c => {
      // Index is selectedYear (since year 0 is at 0, year 1 is at index 1)
      return {
        id: c.id,
        name: c.name,
        color: c.color,
        point: c.coords[selectedYear]
      };
    });
  }, [curvesData, selectedYear]);

  // Set default fallback if they empty the input
  const handleInputBlur = () => {
    if (rawPrice === 0) {
      setPriceInput("100.000.000");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased text-slate-800">
      
      {/* Top Banner & Info Segment */}
      <header className="bg-white border-b border-slate-200/80 py-6 px-4 sm:px-6 w-full sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-sans">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100/80 flex items-center justify-center">
              <Calculator className="w-7 h-7" id="title-icon" />
            </div>
            <div>
              <h1 className="font-display font-semibold text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                Simulasi Depresiasi Mobil
                <span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-sans border border-blue-200/60 font-medium">Auto-Calc</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Depresiasi dan Biaya Kepemilikan Mobil Listrik, Mobil Hibrida, dan Mobil Bensin
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 self-start md:self-center">
            <button 
              onClick={() => {
                setPriceInput("500.000.000");
                setSelectedCarId("ev1");
                setSelectedYear(3);
                setCompareAll(true);
              }}
              className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-850 hover:bg-slate-50 transition-all cursor-pointer"
              title="Reset Simulasi"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>



      {/* Main Body Layout */}
      <main className="flex-1 w-full max-w-2xl mx-auto p-4 sm:p-6 space-y-6 flex flex-col justify-start">

          {/* Card untuk Input Harga Baru */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-blue-500" />
                Langkah 1: Harga Mobil Baru
              </label>
              <span className="text-xs text-slate-500 font-mono">IDR (Rupiah)</span>
            </div>

            {/* Input Formatted */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-slate-500 text-sm">Rp</span>
              <input
                type="text"
                value={priceInput}
                onChange={handlePriceChange}
                onBlur={handleInputBlur}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-lg text-slate-900 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:bg-slate-100/50 transition-all font-mono"
                placeholder="0"
                id="harga-baru-input"
              />
            </div>



            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_PRICES.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => applyPresetPrice(preset.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                    rawPrice === preset.value
                      ? "bg-blue-600 border-blue-600 text-white shadow-md font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Input Slider */}
            <div className="pt-2">
              <input
                type="range"
                min="50000000"
                max="2500000000"
                step="10000000"
                value={rawPrice || 100000000}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setPriceInput(val.toLocaleString("id-ID"));
                }}
                className="w-full accent-blue-600 cursor-pointer"
                id="harga-baru-slider"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>Rp 50 Juta</span>
                <span>Rp 1,2 Miliar</span>
                <span>Rp 2,5 Miliar</span>
              </div>
            </div>
          </div>

          {/* Card untuk Memilih Jenis Mobil */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Car className="w-4 h-4 text-blue-500" />
              Langkah 2: Pilih Jenis Kategori Mobil
            </label>

            {/* Premium Interactive Radio Grid */}
            <div className="space-y-2">
              {CAR_TYPES.map((car) => {
                const isSelected = car.id === selectedCarId;
                
                // Appropriate Category Icon Picker
                const renderCategoryIcon = (category: string) => {
                  switch (category) {
                    case "EV":
                      return <Zap className="w-3.5 h-3.5" />;
                    case "Hybrid":
                      return <Leaf className="w-3.5 h-3.5" />;
                    default:
                      return <Fuel className="w-3.5 h-3.5" />;
                  }
                };

                const displayName = 
                  car.id === "hybrid" 
                    ? "Mobil Hibrida" 
                    : car.id === "ice" 
                    ? "Mobil Bensin" 
                    : car.name;

                return (
                  <button
                    key={car.id}
                    onClick={() => setSelectedCarId(car.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl border transition-all flex items-center justify-between relative overflow-hidden cursor-pointer ${
                      isSelected
                        ? "bg-slate-100/60 border-blue-500 text-slate-900 shadow-sm font-semibold"
                        : "bg-slate-50 border-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span 
                        className={`p-1.5 rounded-lg flex items-center justify-center ${
                          isSelected 
                            ? "bg-white text-blue-600 border border-blue-100" 
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {renderCategoryIcon(car.category)}
                      </span>
                      <span className="font-semibold text-xs sm:text-sm">{displayName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold">
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                      )}
                      <span 
                        className={`px-1.5 py-0.5 rounded ${
                          car.category === "EV" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" 
                            : car.category === "Hybrid"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                            : "bg-rose-50 text-rose-700 border border-rose-200/50"
                        }`}
                      >
                        {car.category}
                      </span>
                    </div>

                    {/* Left Highlight Active Color Strip */}
                    {isSelected && (
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1"
                        style={{ backgroundColor: car.color }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Contextual Description Helper below the compact selection buttons */}
            {selectedCar.description && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] text-slate-750 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase flex items-center gap-1">
                  <span>Detail Kategori Terpilih</span>
                  <span className="text-[9px] opacity-60">({selectedCar.category})</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {selectedCar.description}
                </p>
                {selectedCar.notes && (
                  <p className="text-slate-500 italic font-sans leading-relaxed">
                    💡 {selectedCar.notes}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Card untuk Memilih Tahun (1 s.d. 5) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-500" />
              Langkah 3: Jangka Waktu Pemakaian (Tahun)
            </label>

            {/* Premium segmented picker tabs */}
            <div className="bg-slate-50 p-1.5 rounded-xl grid grid-cols-5 gap-1.5 border border-slate-100">
              {[1, 2, 3, 4, 5].map((year) => {
                const isSelected = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-white"
                        : "bg-transparent text-slate-555 text-slate-500 hover:bg-slate-200/60"
                    }`}
                  >
                    <span>Th {year}</span>
                    <span className="text-[9px] opacity-85 font-normal">
                      {selectedCar.years.find(y => y.year === year)?.totalReduction.toFixed(1)}%
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="text-xs bg-slate-55 bg-slate-50 p-3 rounded-xl text-slate-600 border border-slate-100 flex gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Analisis Persentase Akumulatif (Th-{selectedYear}):</p>
                <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] font-mono">
                  <div>Depresiasi: <span className="font-bold text-rose-600">{activeYearData.depreciation.toFixed(1)}%</span></div>
                  <div>Biaya Kepemilikan: <span className="font-bold text-amber-700">{activeYearData.ownershipCost.toFixed(1)}%</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOM INTERACTIVE GRAPH */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <h3 className="font-display font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                  Kurva Depresiasi dan Biaya Pemakaian
                </h3>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-550 text-slate-500">Bandingkan Semua:</span>
                <button
                  onClick={() => setCompareAll(!compareAll)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    compareAll ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      compareAll ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Custom Responsive SVG Chart - Proportional Aspect Ratio */}
            <div className="relative w-full bg-slate-50/50 rounded-xl p-3 sm:p-4 border border-slate-100 aspect-[500/265] flex items-center justify-center shadow-inner">
              <svg 
                viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
                className="w-full h-full overflow-visible"
              >
                {/* Horizontal reference grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = chartHeight - paddingY - (val / 100) * (chartHeight - 2 * paddingY);
                  return (
                    <g key={val} className="opacity-70">
                      <line 
                        x1={paddingX} 
                        y1={y} 
                        x2={chartWidth - paddingX} 
                        y2={y} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={paddingX - 8} 
                        y={y + 3} 
                        textAnchor="end" 
                        className="text-[10px] font-mono fill-slate-500 font-medium"
                      >
                        {val}%
                      </text>
                    </g>
                  );
                })}

                {/* Vertical year grid links */}
                {[0, 1, 2, 3, 4, 5].map((year) => {
                  const x = paddingX + (year / 5) * (chartWidth - 2 * paddingX);
                  return (
                    <g key={year} className="opacity-70">
                      <line 
                        x1={x} 
                        y1={paddingY} 
                        x2={x} 
                        y2={chartHeight - paddingY} 
                        stroke="#e2e8f0" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={x} 
                        y={chartHeight - paddingY + 16} 
                        textAnchor="middle" 
                        className="text-[10px] font-semibold fill-slate-600"
                      >
                        Th {year}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Curves */}
                {curvesData.map((curve) => {
                  const isMain = curve.id === selectedCarId;
                  if (!compareAll && !isMain) return null;

                  return (
                    <g key={curve.id}>
                      {/* Path Line */}
                      <path
                        d={curve.d}
                        fill="none"
                        stroke={curve.color}
                        strokeWidth={isMain ? "3.2" : "1.5"}
                        strokeOpacity={isMain ? "1" : "0.35"}
                        className="transition-all duration-300"
                      />

                      {/* Small dots on each year point */}
                      {curve.coords.map((cpt) => {
                        const isSelectedPoint = isMain && cpt.year === selectedYear;
                        return (
                           <circle
                             key={cpt.year}
                             cx={cpt.x}
                             cy={cpt.y}
                             r={isSelectedPoint ? "6" : isMain ? "3.5" : "2.5"}
                             fill={isSelectedPoint ? "#ffffff" : curve.color}
                             stroke={isSelectedPoint ? curve.color : "none"}
                             strokeWidth={isSelectedPoint ? "3" : "0"}
                             opacity={isMain ? "1" : "0.5"}
                             className="cursor-pointer transition-all hover:scale-125"
                             title={`${curve.name} Th ${cpt.year}: ${cpt.cost.toFixed(1)}%`}
                           />
                        );
                      })}
                    </g>
                  );
                })}

                {/* Selected point floating indicator lines highlight */}
                {(() => {
                  const activeCur = curvesData.find(c => c.id === selectedCarId);
                  if (!activeCur) return null;
                  const activeCoord = activeCur.coords[selectedYear];
                  return (
                    <g>
                      {/* Vertical highlight bar to selected point */}
                      <line 
                        x1={activeCoord.x} 
                        y1={paddingY} 
                        x2={activeCoord.x} 
                        y2={chartHeight - paddingY} 
                        stroke="#2563eb" 
                        strokeWidth="1.5" 
                        strokeDasharray="2 2"
                        opacity="0.65"
                      />
                    </g>
                  );
                })()}
              </svg>

              {/* Floating Tooltip HTML on graph overlay removed at user request */}
            </div>

            {/* Real-time Rupiah Calculations for Selected Year */}
            <div className="pt-3 border-t border-slate-100">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider font-mono block">
                    Total Biaya Keluar dan Hilang (Tahun {selectedYear})
                  </span>
                  <span className="text-xl font-extrabold text-rose-600 mt-1 block">
                    {formatRupiah(calculatedValues.depreciation + calculatedValues.ownershipCost)}
                  </span>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-600 font-semibold font-mono block">
                    Penyusutan dan Biaya Kepemilikan
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono block mt-0.5">
                    {Math.abs(activeYearData.totalReduction).toFixed(1)}% dari harga baru
                  </span>
                </div>
              </div>
            </div>

            {/* Legend indicators */}
            {compareAll && (
              <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center pt-2 text-[11px] border-t border-slate-100 font-mono">
                {CAR_TYPES.map((c) => {
                  const isMain = c.id === selectedCarId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCarId(c.id)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 transition-all cursor-pointer"
                    >
                      <span 
                        className="w-3 h-1.5 rounded-full inline-block" 
                        style={{ 
                           backgroundColor: c.color,
                           opacity: isMain ? 1 : 0.4
                        }}
                      />
                      <span className={isMain ? "font-bold text-slate-900" : "font-normal opacity-80"}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

      </main>

      {/* Footer copyright */}
      <footer className="mt-12 border-t border-slate-200/85 bg-slate-100 py-6 text-center text-xs text-slate-600 space-y-1">
        <p>© 2026 Kalkulator Depresiasi Mobil Terpadu. Data bersumber dari simulasi real-time depresiasi otomotif Indonesia.</p>
        <p className="text-[10px] text-slate-500">Dibuat menggunakan standard visual modern Inter & Space Grotesk.</p>
      </footer>

    </div>
  );
}
