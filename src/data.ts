/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CarType } from "./types";

export const CAR_TYPES: CarType[] = [
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
    description: "",
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
    description: "",
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

export const PRESET_PRICES = [
  { label: "200 Juta", value: 200000000 },
  { label: "350 Juta", value: 350000000 },
  { label: "500 Juta", value: 500000000 },
  { label: "1 Miliar", value: 1000000000 },
];
