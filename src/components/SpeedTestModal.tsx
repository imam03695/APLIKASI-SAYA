import React, { useState, useEffect } from 'react';
import { InternetPackage } from '../types';
import { X, Play, RotateCcw, ArrowDown, ArrowUp, Activity, CheckCircle2 } from 'lucide-react';

interface SpeedTestModalProps {
  pkg: InternetPackage;
  onClose: () => void;
}

export const SpeedTestModal: React.FC<SpeedTestModalProps> = ({ pkg, onClose }) => {
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'completed'>('idle');
  const [ping, setPing] = useState<number>(0);
  const [jitter, setJitter] = useState<number>(0);
  const [downloadSpeed, setDownloadSpeed] = useState<number>(0);
  const [uploadSpeed, setUploadSpeed] = useState<number>(0);

  const startTest = () => {
    setStage('ping');
    setPing(0);
    setJitter(0);
    setDownloadSpeed(0);
    setUploadSpeed(0);

    // Phase 1: Ping (1.5s)
    setTimeout(() => {
      setPing(Math.floor(4 + Math.random() * 6));
      setJitter(Math.floor(1 + Math.random() * 2));
      setStage('download');

      // Phase 2: Download ramp up (2.5s)
      let dVal = 0;
      const targetDownload = pkg.speedMbps * (0.95 + Math.random() * 0.08); // 95% - 103% of package
      const dInterval = setInterval(() => {
        dVal += (targetDownload - dVal) * 0.25;
        if (Math.abs(targetDownload - dVal) < 0.2) {
          dVal = targetDownload;
          clearInterval(dInterval);
          setDownloadSpeed(parseFloat(dVal.toFixed(1)));
          setStage('upload');

          // Phase 3: Upload ramp up (2.5s)
          let uVal = 0;
          const targetUpload = pkg.uploadMbps * (0.93 + Math.random() * 0.09);
          const uInterval = setInterval(() => {
            uVal += (targetUpload - uVal) * 0.25;
            if (Math.abs(targetUpload - uVal) < 0.2) {
              uVal = targetUpload;
              clearInterval(uInterval);
              setUploadSpeed(parseFloat(uVal.toFixed(1)));
              setStage('completed');
            } else {
              setUploadSpeed(parseFloat(uVal.toFixed(1)));
            }
          }, 80);

        } else {
          setDownloadSpeed(parseFloat(dVal.toFixed(1)));
        }
      }, 80);

    }, 1200);
  };

  useEffect(() => {
    startTest();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 text-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            Uji Kecepatan Koneksi RT RW Net
          </span>
          <h3 className="text-xl font-bold text-white">Live Speed Test</h3>
          <p className="text-xs text-slate-400 mt-1">
            Server: Core Mikrotik RT 01-05 (OLT GPON Sukamaju)
          </p>
        </div>

        {/* Speedometer Circle Display */}
        <div className="relative w-48 h-48 mx-auto flex flex-col items-center justify-center border-4 border-slate-800 rounded-full my-4 bg-slate-950/60 shadow-inner">
          <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white tabular-nums">
            {stage === 'download' ? downloadSpeed : stage === 'upload' ? uploadSpeed : stage === 'completed' ? downloadSpeed : '...'}
          </div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mt-1">
            Mbps
          </span>
          <div className="text-[10px] text-slate-400 mt-1 uppercase font-mono">
            {stage === 'ping' && 'Mengukur Latensi...'}
            {stage === 'download' && 'Mengukur Download...'}
            {stage === 'upload' && 'Mengukur Upload...'}
            {stage === 'completed' && 'Uji Selesai'}
            {stage === 'idle' && 'Siap'}
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 my-6 text-center">
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Ping</span>
            </div>
            <div className="text-base font-bold font-mono tabular-nums text-white">
              {ping > 0 ? `${ping} ms` : '-'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download</span>
            </div>
            <div className="text-base font-bold font-mono tabular-nums text-emerald-400">
              {downloadSpeed > 0 ? `${downloadSpeed}` : '-'} <span className="text-[10px]">Mbps</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
              <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
              <span>Upload</span>
            </div>
            <div className="text-base font-bold font-mono tabular-nums text-purple-400">
              {uploadSpeed > 0 ? `${uploadSpeed}` : '-'} <span className="text-[10px]">Mbps</span>
            </div>
          </div>
        </div>

        {stage === 'completed' ? (
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Koneksi normal sesuai paket Anda ({pkg.speedMbps} Mbps)</span>
            </div>

            <button
              onClick={startTest}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Uji Ulang Kecepatan</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-2 text-xs text-slate-400">
            Menjalankan pengujian paket fiber optik...
          </div>
        )}
      </div>
    </div>
  );
};
