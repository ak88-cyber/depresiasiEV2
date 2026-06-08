/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CarYearData {
  year: number;             // 1 to 5
  depreciation: number;     // e.g., -26.6
  ownershipCost: number;    // e.g., -0.8
  totalReduction: number;   // e.g., -27.4
}

export interface CarType {
  id: string;               // e.g., 'ev1', 'ev2', 'ev3', 'hybrid', 'ice'
  name: string;             // e.g., 'Mobil Listrik (1)'
  category: 'EV' | 'Hybrid' | 'ICE';
  description: string;
  notes: string;
  color: string;            // for chart/UI badges
  years: CarYearData[];
}
