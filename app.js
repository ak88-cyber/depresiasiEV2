/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Global React Destructuring
const { useState, useMemo } = React;

// Core Dataset (translated directly from data.ts)
const CAR_TYPES = [
  {
    id: "ev1",
    name: "Mobil Listrik (1)",
    category: "EV",
    description: "Dengan insentif PKB dan diskon isi daya di rumah.",
    notes: "",
    color: "#0d9488", // teal-600
    years: [
      { year: 1, depreciation: -26.6, ownershipCost: -0.8, totalReduction: -27.4 },
      { year: 2, depreciation: -35.0, ownershipCost: -1.6, totalReduction: -36.6 },
      { year: 3, depreciation: -43.4, ownershipCost: -2.4, totalReduction: -45.8 },
      { year: 4, depreciation: -51.7, ownershipCost: -3.2, totalReduction: -54.9 },
      { year: 5, depreciation: -60.1, ownershipCost: -4.0, totalReduction: -64.1 },
    ]
  },
  {
    id: "ev2",
    name: "Mobil Listrik (2)",
    category: "EV",
    description: "Bayar PKB (100 %) dan diskon isi daya di rumah.",
    notes: "",
    color: "#0284c7", // sky-600
    years: [
      { year: 1, depreciation: -26.6, ownershipCost: -3.2, totalReduction: -29.8 },
      { year: 2, depreciation: -35.0, ownershipCost: -6.3, totalReduction: -41.3 },
      { year: 3, depreciation: -43.4, ownershipCost: -9.5, totalReduction: -52.9 },
      { year: 4, depreciation: -51.7, ownershipCost: -12.7, totalReduction: -64.4 },
      { year: 5, depreciation: -60.1, ownershipCost: -15.9, totalReduction: -76.0 },
    ]
  },
  {
    id: "ev3",
    name: "Mobil Listrik (3)",
    category: "EV",
    description: "Bayar PKB (100 %) dan isi daya di SPKLU.",
    notes: "",
    color: "#4f46e5", // indigo-600
    years: [
      { year: 1, depreciation: -26.6, ownershipCost: -3.7, totalReduction: -30.3 },
      { year: 2, depreciation: -35.0, ownershipCost: -7.5, totalReduction: -42.5 },
      { year: 3, depreciation: -43.4, ownershipCost: -11.2, totalReduction: -54.6 },
      { year: 4, depreciation: -51.7, ownershipCost: -15.0, totalReduction: -66.7 },
      { year: 5, depreciation: -60.1, ownershipCost: -18.7, totalReduction: -78.8 },
    ]
  },
  {
    id: "hybrid",
    name: "Mobil Hibrida (HEV)",
    category: "Hybrid",
    description: "Sistem hibrida konvensional dengan efisiensi bahan bakar ganda.",
    notes: "",
    color: "#d97706", // amber-600
    years: [
      { year: 1, depreciation: -14.1, ownershipCost: -3.7, totalReduction: -17.8 },
      { year: 2, depreciation: -20.2, ownershipCost: -7.5, totalReduction: -27.7 },
      { year: 3, depreciation: -26.3, ownershipCost: -11.3, totalReduction: -37.6 },
      { year: 4, depreciation: -32.5, ownershipCost: -15.1, totalReduction: -47.6 },
      { year: 5, depreciation: -38.6, ownershipCost: -18.8, totalReduction: -57.4 },
    ]
  },
  {
    id: "ice",
    name: "Mobil Bensin (ICE)",
    category: "ICE",
    description: "Kendaraan mesin pembakaran konvensional dengan pajak standar pemakaian bahan bakar fosil.",
    notes: "",
    color: "#dc2626", // red-600
    years: [
      { year: 1, depreciation: -14.5, ownershipCost: -8.6, totalReduction: -23.1 },
      { year: 2, depreciation: -19.2, ownershipCost: -17.2, totalReduction: -36.4 },
      { year: 3, depreciation: -23.9, ownershipCost: -25.7, totalReduction: -49.6 },
      { year: 4, depreciation: -28.6, ownershipCost: -34.3, totalReduction: -62.9 },
      { year: 5, depreciation: -33.3, ownershipCost: -42.9, totalReduction: -76.2 },
    ]
  }
];

const PRESET_PRICES = [
  { label: "200 Juta", value: 200000000 },
  { label: "350 Juta", value: 350000000 },
  { label: "500 Juta", value: 500000000 },
  { label: "1 Miliar", value: 1000000000 },
];

// Helper Icon component to display clean, responsive SVGs on-the-fly without dependencies
const Icon = ({ name, className = "w-4 h-4", id }) => {
  const getSvg = () => {
    switch (name) {
      case 'car':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
            <circle cx="7" cy="17" r="2"/>
            <path d="M9 17h6"/>
            <circle cx="17" cy="17" r="2"/>
          </svg>
        );
      case 'trending-down':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/>
            <polyline points="16 17 22 17 22 11"/>
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        );
      case 'zap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        );
      case 'fuel':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <line x1="3" y1="22" x2="15" y2="22"/>
            <path d="M4 9h8"/>
            <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/>
            <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2h2"/>
            <path d="M9 18a3 3 0 0 1-3-3V5h6v10a3 3 0 0 1-3 3Z"/>
          </svg>
        );
      case 'leaf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-13.9.2"/>
            <path d="M9 22v-4h4"/>
          </svg>
        );
      case 'calendar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        );
      case 'dollar-sign':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        );
      case 'calculator':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <line x1="8" y1="6" x2="16" y2="6"/>
            <line x1="16" y1="14" x2="16" y2="18"/>
            <path d="M16 10h.01"/>
            <path d="M12 10h.01"/>
            <path d="M8 10h.01"/>
            <path d="M12 14h.01"/>
            <path d="M8 14h.01"/>
            <path d="M12 18h.01"/>
            <path d="M8 18h.01"/>
          </svg>
        );
      case 'rotate-ccw':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} id={id}>
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <polyline points="3 3 3 8 8 8"/>
          </svg>
        );
      default:
        return null;
    }
  };
  return getSvg();
};

function App() {
  // Application states
  const [priceInput, setPriceInput] = useState("500.000.000");
  const [selectedCarId, setSelectedCarId] = useState("ev1");
  const [selectedYear, setSelectedYear] = useState(3);
  const [compareAll, setCompareAll] = useState(true);

  // Parse price state cleanly
  const rawPrice = useMemo(() => {
    const cleaned = priceInput.replace(/\D/g, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? 0 : parsed;
  }, [priceInput]);

  // Format currency directly
  const formatRupiah = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Convert inputs helper to text words (e.g. "Rp 500 Juta")
  const priceToIndonesianWords = (val) => {
    if (val === 0) return "Rp 0";
    if (val >= 1000000000) {
      const bio = val / 1000000000;
      return `Rp ${bio.toLocaleString("id-ID", { maximumFractionDigits: 2 })} Miliar`;
    }
    const mio = val / 1000000;
    return `Rp ${mio.toLocaleString("id-ID", { maximumFractionDigits: 0 })} Juta`;
  };

  // Safe input handler formatting on keyup
  const handlePriceChange = (e) => {
    const value = e.target.value;
    const cleanNumbers = value.replace(/\D/g, "");
    if (cleanNumbers === "") {
      setPriceInput("");
    } else {
      const formatted = Number(cleanNumbers).toLocaleString("id-ID");
      setPriceInput(formatted);
    }
  };

  // Handle Preset prices clicks
  const applyPresetPrice = (value) => {
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

  // SVG Chart Dimensions & Configuration
  const chartHeight = 265;
  const chartWidth = 500;
  const paddingX = 45;
  const paddingY = 25;

  // Render SVG Line path helper
  const getCoordinatesForCar = (car) => {
    const points = [{ year: 0, cost: 0 }];
    car.years.forEach(y => {
      points.push({ year: y.year, cost: Math.abs(y.totalReduction) });
    });

    return points.map(p => {
      const x = paddingX + (p.year / 5) * (chartWidth - 2 * paddingX);
      const y = chartHeight - paddingY - (p.cost / 100) * (chartHeight - 2 * paddingY);
      return { x, y, year: p.year, cost: p.cost };
    });
  };

  // Get SVG paths for the curves
  const curvesData = useMemo(() => {
    return CAR_TYPES.map(car => {
      const coords = getCoordinatesForCar(car);
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
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 font-sans">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 border border-blue-100/80 flex items-center justify-center">
              <Icon name="calculator" className="w-7 h-7" id="title-icon" />
            </div>
            <div>
              <h1 className="font-semibold text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                Simulasi Depresiasi Mobil
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
              className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all cursor-pointer"
              title="Reset Simulasi"
            >
              <Icon name="rotate-ccw" className="w-4 h-4" />
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
              <Icon name="dollar-sign" className="w-4 h-4 text-blue-500" />
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
            <Icon name="car" className="w-4 h-4 text-blue-500" />
            Langkah 2: Pilih Jenis Kategori Mobil
          </label>

          {/* Radio Grid */}
          <div className="space-y-2">
            {CAR_TYPES.map((car) => {
              const isSelected = car.id === selectedCarId;
              
              const renderCategoryIcon = (category) => {
                switch (category) {
                  case "EV":
                    return <Icon name="zap" className="w-3.5 h-3.5" />;
                  case "Hybrid":
                    return <Icon name="leaf" className="w-3.5 h-3.5" />;
                  default:
                    return <Icon name="fuel" className="w-3.5 h-3.5" />;
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
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse animate-duration-1000" />
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

                  {/* Highlight Color Strip */}
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

          {/* Contextual Description Details */}
          {selectedCar.description && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/60 text-[11px] text-slate-700 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase flex items-center gap-1">
                <span>Detail Kategori Terpilih</span>
                <span className="text-[9px] opacity-60">({selectedCar.category})</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {selectedCar.description}
              </p>
            </div>
          )}
        </div>

        {/* Card untuk Memilih Tahun (1 s.d. 5) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Icon name="calendar" className="w-4 h-4 text-blue-500" />
            Langkah 3: Jangka Waktu Pemakaian (Tahun)
          </label>

          {/* Segmented Picker Tabs */}
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
                      : "bg-transparent text-slate-500 hover:bg-slate-200/60"
                  }`}
                >
                  <span>Th {year}</span>
                  <span className="text-[9px] opacity-85 font-normal">
                    {Math.abs(selectedCar.years.find(y => y.year === year)?.totalReduction || 0).toFixed(1)}%
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-xs bg-slate-50 p-3 rounded-xl text-slate-600 border border-slate-100 flex gap-2">
            <Icon name="info" className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Analisis Persentase Akumulatif (Th-{selectedYear}):</p>
              <div className="grid grid-cols-2 gap-2 mt-1 text-[11px] font-mono">
                <div>Depresiasi: <span className="font-bold text-rose-600">{Math.abs(activeYearData.depreciation).toFixed(1)}%</span></div>
                <div>Biaya Kepemilikan: <span className="font-bold text-amber-700">{Math.abs(activeYearData.ownershipCost).toFixed(1)}%</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOM INTERACTIVE GRAPH */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200/80 pb-3">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <Icon name="trending-down" className="w-4 h-4 text-blue-600" />
                Kurva Depresiasi dan Biaya Pemakaian
              </h3>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Bandingkan Semua:</span>
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

              {/* Vertical year grid pointers */}
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
                      y={chartHeight - paddingY + 14} 
                      textAnchor="middle" 
                      className="text-[10px] font-semibold fill-slate-600"
                    >
                      Th {year}
                    </text>
                  </g>
                );
              })}

              {/* Draw Curves & Lines */}
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

                    {/* Interactive year selection dots */}
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
                           onClick={() => {
                             if (cpt.year > 0) {
                               setSelectedYear(cpt.year);
                             }
                           }}
                         />
                      );
                    })}
                  </g>
                );
              })}

              {/* Selected point vertical guide highlight line bar */}
              {(() => {
                const activeCur = curvesData.find(c => c.id === selectedCarId);
                if (!activeCur) return null;
                const activeCoord = activeCur.coords[selectedYear];
                return (
                  <g>
                    <line 
                      x1={activeCoord.x} 
                      y1={paddingY} 
                      x2={activeCoord.x} 
                      y2={chartHeight - paddingY} 
                      stroke="#2563eb" 
                      strokeWidth="1.5" 
                      strokeDasharray="2 2"
                      opacity="0.6"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>

          {/* Real-time calculated results for Selected Year */}
          <div className="pt-3 border-t border-slate-100">
            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-700 tracking-wider font-mono block">
                  Total Biaya Keluar dan Hilang (Tahun {selectedYear})
                </span>
                <span className="text-xl font-extrabold text-rose-600 mt-1 block font-mono">
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

          {/* Legend indicator buttons */}
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

      {/* Footer spacing */}
      <div className="pb-12" />

    </div>
  );
}

// Render root React 18 element
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
