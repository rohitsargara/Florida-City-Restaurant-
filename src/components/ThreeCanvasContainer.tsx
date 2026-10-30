/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ThreeSceneManager } from '../three/ThreeSceneManager';
import { TableInfo, ThreeSceneMode, LightingPreset, CameraPreset } from '../types/restaurant';
import { soundFx } from '../utils/audioSynthesizer';
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Layers,
  Sun,
  Moon,
  Sunset,
  Camera,
  ChevronDown,
  ChevronUp,
  RotateCw,
  Utensils,
  MapPin,
  CalendarCheck,
} from 'lucide-react';

interface ThreeCanvasContainerProps {
  tables: TableInfo[];
  selectedTable: TableInfo | null;
  onSelectTable: (table: TableInfo) => void;
  onOpenReservation: () => void;
}

export const ThreeCanvasContainer: React.FC<ThreeCanvasContainerProps> = ({
  tables,
  selectedTable,
  onSelectTable,
  onOpenReservation,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<ThreeSceneManager | null>(null);

  const [mode, setMode] = useState<ThreeSceneMode>('restaurant');
  const [lighting, setLighting] = useState<LightingPreset>('sunset');
  const [explodedRatio, setExplodedRatio] = useState<number>(0);
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hoveredTable, setHoveredTable] = useState<TableInfo | null>(null);
  const [cameraView, setCameraView] = useState<CameraPreset>('orbit');

  useEffect(() => {
    if (!mountRef.current) return;

    const manager = new ThreeSceneManager(
      mountRef.current,
      tables,
      (table) => {
        soundFx.playClick();
        onSelectTable(table);
      },
      (table) => {
        setHoveredTable(table);
      }
    );

    sceneManagerRef.current = manager;

    return () => {
      manager.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  // Update selected table highlight in 3D
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.updateTableStatuses(tables, selectedTable?.id || null);
    }
  }, [tables, selectedTable]);

  const handleModeChange = (newMode: ThreeSceneMode) => {
    soundFx.playClick();
    setMode(newMode);
    if (newMode === 'dish') {
      setCameraView('dish');
    } else if (newMode === 'floorplan') {
      setCameraView('aerial');
    } else {
      setCameraView('orbit');
    }
    sceneManagerRef.current?.setMode(newMode);
  };

  const handleLightingChange = (preset: LightingPreset) => {
    soundFx.playClick();
    setLighting(preset);
    sceneManagerRef.current?.applyLightingPreset(preset);
  };

  const handleCameraChange = (preset: CameraPreset) => {
    soundFx.playClick();
    setCameraView(preset);
    sceneManagerRef.current?.setCameraPreset(preset);
  };

  const handleExplodedChange = (value: number) => {
    setExplodedRatio(value);
    sceneManagerRef.current?.setExplodedRatio(value);
  };

  const handleSoundToggle = () => {
    const active = soundFx.toggleAmbience();
    setIsMuted(!active);
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[720px] bg-slate-950 overflow-hidden select-none">
      {/* 3D WebGL Canvas isolated container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge & Specs (Non-occluding Top-Left & Top-Right) */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 text-xs text-amber-300 font-mono-nums uppercase tracking-wider bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 pointer-events-auto">
          <span>WebGL 3D Studio</span>
          <span aria-hidden="true" className="text-slate-500">·</span>
          <span>1209 NW 9th Ave, Florida City</span>
        </div>
        <h2 className="text-white text-xl lg:text-2xl font-bold font-display drop-shadow">
          {mode === 'restaurant' && 'Tropical Diner & Terrace'}
          {mode === 'dish' && '3D Exploded Dish Inspector'}
          {mode === 'floorplan' && 'Interactive 3D Seating Plan'}
        </h2>
        <p className="text-xs text-slate-300 max-w-md hidden sm:block drop-shadow">
          {mode === 'restaurant' && 'Drag to rotate 360°. Inspect mid-century architectural facade, palm trees, and outdoor patio terrace.'}
          {mode === 'dish' && 'Slide exploded view to reveal artisan brioche, flame-grilled beef, sharp cheddar, and fresh local toppings.'}
          {mode === 'floorplan' && 'Hover over any table to view seating capacity and status. Click any table to reserve.'}
        </p>
      </div>

      {/* Top-Right Quick Actions */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={handleSoundToggle}
          title={isMuted ? 'Turn on Florida patio breeze audio' : 'Mute ambient sound'}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-700/60 transition-colors shadow-lg"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          <span className="hidden sm:inline">{isMuted ? 'Audio Off' : 'Patio Breeze'}</span>
        </button>

        <button
          onClick={() => handleCameraChange('orbit')}
          title="Auto Rotate 3D Scene"
          className="p-2 rounded-lg bg-slate-900/85 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-colors shadow-lg"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Hovered / Selected Table Floating Tooltip (Floorplan Mode) */}
      {mode === 'floorplan' && (hoveredTable || selectedTable) && (
        <div className="absolute top-20 right-6 z-10 bg-slate-900/95 border border-slate-700 rounded-xl p-4 shadow-2xl max-w-xs text-white pointer-events-auto">
          {selectedTable ? (
            <div>
              <div className="text-xs font-semibold uppercase text-amber-400 tracking-wide mb-1">
                Selected Table #{selectedTable.number}
              </div>
              <div className="text-sm font-bold text-white mb-1">{selectedTable.zone}</div>
              <div className="text-xs text-slate-300 mb-3">
                Seats up to {selectedTable.capacity} guests · Status: <span className="text-emerald-400 capitalize">{selectedTable.status}</span>
              </div>
              <button
                onClick={onOpenReservation}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                Reserve Table #{selectedTable.number}
              </button>
            </div>
          ) : hoveredTable ? (
            <div>
              <div className="text-xs font-semibold uppercase text-slate-400 tracking-wide mb-0.5">
                Table #{hoveredTable.number}
              </div>
              <div className="text-sm font-bold text-white">{hoveredTable.zone}</div>
              <div className="text-xs text-slate-300 mt-1">
                Capacity: {hoveredTable.capacity} guests ·{' '}
                <span className={hoveredTable.status === 'available' ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                  {hoveredTable.status === 'available' ? 'Available' : 'Reserved'}
                </span>
              </div>
              {hoveredTable.status === 'available' && (
                <div className="text-[11px] text-amber-400 mt-2 font-medium">Click to select this table</div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Unified Bottom Control Dock (Strictly Unobstructed Center Viewport Contract) */}
      <div
        className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[880px] transition-transform duration-300 ease-out ${
          isDockCollapsed ? 'translate-y-[calc(100%-36px)]' : 'translate-y-0'
        }`}
      >
        {/* Collapse / Expand Tab Handle */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-xs font-medium text-slate-300 border-t border-x border-slate-700/80 rounded-t-lg transition-colors shadow-lg"
          >
            {isDockCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-amber-400" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Hide Controls (Zen Mode)</span>
              </>
            )}
          </button>
        </div>

        {/* Main Glassmorphic Dock Container */}
        <div className="bg-slate-900/95 border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Zone 1: Scene Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700/60 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={() => handleModeChange('restaurant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  mode === 'restaurant'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>Terrace Exterior</span>
              </button>

              <button
                onClick={() => handleModeChange('dish')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  mode === 'dish'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>3D Gourmet Dish</span>
              </button>

              <button
                onClick={() => handleModeChange('floorplan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                  mode === 'floorplan'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>3D Floor Plan</span>
              </button>
            </div>

            {/* Zone 2: Contextual Controls (Exploded Slider in Dish Mode OR Camera Views) */}
            {mode === 'dish' ? (
              <div className="flex items-center gap-3 w-full md:w-auto px-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300 shrink-0">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Exploded View:</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={explodedRatio}
                  onChange={(e) => handleExplodedChange(parseFloat(e.target.value))}
                  className="w-full md:w-36 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <span className="text-xs font-mono-nums text-amber-400 w-10 text-right shrink-0">
                  {Math.round(explodedRatio * 100)}%
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden lg:inline mr-1">Views:</span>
                <button
                  onClick={() => handleCameraChange('terrace')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    cameraView === 'terrace' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => handleCameraChange('aerial')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    cameraView === 'aerial' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Aerial
                </button>
                <button
                  onClick={() => handleCameraChange('orbit')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    cameraView === 'orbit' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Orbit 360°
                </button>
              </div>
            )}

            {/* Zone 3: Lighting Mood Presets */}
            <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl border border-slate-700/60">
              <button
                onClick={() => handleLightingChange('sunset')}
                title="Florida Sunset Golden Hour"
                className={`p-1.5 rounded-lg transition-colors ${
                  lighting === 'sunset' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sunset className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLightingChange('night')}
                title="Miami Neon Night"
                className={`p-1.5 rounded-lg transition-colors ${
                  lighting === 'night' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleLightingChange('noon')}
                title="Tropical Noon Sun"
                className={`p-1.5 rounded-lg transition-colors ${
                  lighting === 'noon' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
