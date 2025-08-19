import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { LayoutOption, FilterOption } from '../types';
import { FILTERS } from '../constants';
import { useTranslations } from '../hooks/useTranslations';

interface CaptureProps {
  layout: LayoutOption;
  onComplete: (photos: string[]) => void;
  onBack: () => void;
}

const Capture: React.FC<CaptureProps> = ({ layout, onComplete, onBack }) => {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [countdown, setCountdown] = useState<number>(3);
  const [filter, setFilter] = useState<FilterOption>(FILTERS[0]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const t = useTranslations();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError(t.captureCameraError);
    }
  }, [t]);

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    }
    return () => {
      // Cleanup: stop camera stream
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mode, startCamera]);

  const takePicture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.filter = filter.value;
        // Flip the image horizontally for a mirror effect
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Reset transform
        context.setTransform(1, 0, 0, 1, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhotos(prev => [...prev, dataUrl]);
      }
    }
  }, [filter]);

  const startCaptureSequence = useCallback(async () => {
    setIsCapturing(true);
    setCapturedPhotos([]);
    for (let i = 0; i < layout.poses; i++) {
      setCaptureStatus(t.captureStatusGetReady(i + 1));
      await new Promise(resolve => setTimeout(resolve, 1000));
      for (let j = countdown; j > 0; j--) {
        setCaptureStatus(`${j}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCaptureStatus(t.captureStatusSmile);
      await new Promise(resolve => setTimeout(resolve, 500));
      takePicture();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setIsCapturing(false);
    setCaptureStatus('');
  }, [layout.poses, countdown, takePicture, t]);

  useEffect(() => {
    if (capturedPhotos.length === layout.poses) {
      onComplete(capturedPhotos);
    }
  }, [capturedPhotos, layout.poses, onComplete]);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files) {
        const files = Array.from(e.target.files).slice(0, layout.poses);
        setUploadedFiles(files);
    }
  };

  const handleUploadConfirm = () => {
    setError(null);
    const photoPromises = uploadedFiles.map(file => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if(event.target && typeof event.target.result === 'string') {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            canvas.width = img.naturalWidth;
                            canvas.height = img.naturalHeight;
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                ctx.filter = filter.value; // Apply filter
                                ctx.drawImage(img, 0, 0);
                                resolve(canvas.toDataURL('image/png'));
                            } else { reject('Could not get canvas context'); }
                        } else { reject('Canvas element not found'); }
                    };
                    img.onerror = () => reject('Error loading image');
                    img.src = event.target.result;
                } else { reject('Error reading file'); }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });
    
    Promise.all(photoPromises).then(photoDataUrls => {
        onComplete(photoDataUrls);
    }).catch(err => {
        setError('There was an error processing your images.');
        console.error(err);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
        <div className="w-full bg-white/60 backdrop-blur-lg p-6 rounded-3xl shadow-lg">
            <div className="flex justify-center mb-4 border-b border-pink-200">
                <button onClick={() => setMode('camera')} className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${mode === 'camera' ? 'bg-pink-400 text-white' : 'text-gray-600 hover:bg-pink-100'}`}>{t.captureCameraTab}</button>
                <button onClick={() => setMode('upload')} className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${mode === 'upload' ? 'bg-pink-400 text-white' : 'text-gray-600 hover:bg-pink-100'}`}>{t.captureUploadTab}</button>
            </div>

            {mode === 'camera' ? (
                 <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center text-white">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" style={{ filter: filter.value }} />
                    {isCapturing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <p className="text-7xl font-bold text-white drop-shadow-lg animate-pulse">{captureStatus}</p>
                        </div>
                    )}
                    {error && <p className="absolute inset-0 bg-red-800/80 flex items-center justify-center p-4 text-center">{error}</p>}
                </div>
            ) : (
                <div className="w-full aspect-video bg-pink-100/50 rounded-2xl flex flex-col items-center justify-center p-4">
                    <h3 className="text-xl font-semibold mb-2">{t.captureUploadTitle(layout.poses)}</h3>
                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="mb-4 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"/>
                    {uploadedFiles.length > 0 && <p className="mb-4">{t.captureFilesSelected(uploadedFiles.length, layout.poses)}</p>}
                    <button onClick={handleUploadConfirm} disabled={uploadedFiles.length !== layout.poses} className="bg-pink-400 text-white font-bold py-2 px-6 rounded-full disabled:bg-gray-300 transform hover:scale-105 transition-transform">{t.captureConfirmUpload}</button>
                </div>
            )}

            <div className="mt-6">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="font-semibold text-gray-700 mr-2">{t.captureFilterLabel}</span>
                    {FILTERS.map(f => (
                        <button key={f.name} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-sm ${filter.name === f.name ? 'bg-pink-400 text-white ring-2 ring-offset-2 ring-pink-400' : 'bg-white/70 hover:bg-pink-100 text-gray-600'}`}>
                            {f.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mt-6 space-y-4 md:space-y-0 md:space-x-4">
                {mode === 'camera' ? (
                    <>
                        <div className="flex items-center space-x-2">
                            <span className="font-semibold">{t.captureCountdownLabel}</span>
                            {[3, 5, 7].map(time => (
                                <button key={time} onClick={() => setCountdown(time)} className={`w-10 h-10 rounded-full font-bold transition-colors ${countdown === time ? 'bg-pink-400 text-white shadow-md' : 'bg-white/70 hover:bg-pink-100'}`}>{time}s</button>
                            ))}
                        </div>
                        <button onClick={startCaptureSequence} disabled={isCapturing || !!error} className="bg-rose-500 text-white font-bold py-3 px-6 rounded-full hover:bg-rose-600 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-300 disabled:scale-100">
                            {isCapturing ? t.captureCapturingButton : t.captureStartButton(layout.poses)}
                        </button>
                    </>
                ) : (
                    <div className="w-full text-center text-sm text-gray-500">
                        {t.captureUploadHint}
                    </div>
                )}
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <button onClick={onBack} className="mt-4 bg-gray-400 text-white font-bold py-2 px-6 rounded-full hover:bg-gray-500 transition-colors shadow-md transform hover:scale-105">{t.captureBackButton}</button>
    </div>
  );
};

export default Capture;