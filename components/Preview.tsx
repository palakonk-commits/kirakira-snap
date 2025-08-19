import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { LayoutOption, StickerObject } from '../types';
import { FRAME_COLORS, STICKER_PACKS } from '../constants';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslations } from '../hooks/useTranslations';

// A placeholder for a GIF generation library.
const generateGif = async (frames: HTMLImageElement[], frameDelay: number): Promise<string> => {
    console.log("GIF generation started with placeholder. Frame count:", frames.length);
    return new Promise(resolve => {
        alert("GIF generation is a placeholder. A real implementation would require a GIF encoding library.");
        resolve(frames[0].src); 
    });
};

interface PreviewProps {
  layout: LayoutOption;
  photos: string[];
  onRetake: () => void;
}

type FrameTheme = 'solid' | 'dots' | 'stripes';

const Preview: React.FC<PreviewProps> = ({ layout, photos, onRetake }) => {
  const [frameColor, setFrameColor] = useState<string>('#FFFFFF');
  const [frameTheme, setFrameTheme] = useState<FrameTheme>('solid');
  const [stickers, setStickers] = useState<StickerObject[]>([]);
  const [activeStickerPack, setActiveStickerPack] = useState(STICKER_PACKS[1].name);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoImages = useRef<HTMLImageElement[]>([]);
  
  const drawCanvas = useCallback(async () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    
    const stripWidth = 600;
    const stripHeight = layout.grid.rows > layout.grid.cols * 2 ? 1800 : (stripWidth / layout.grid.cols) * layout.grid.rows;
    const padding = 20;

    canvas.width = stripWidth;
    canvas.height = stripHeight;
    
    // Draw background/frame
    ctx.fillStyle = frameColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw frame theme pattern
    if (frameTheme === 'dots') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let x = 15; x < canvas.width; x += 25) {
        for (let y = 15; y < canvas.height; y += 25) {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (frameTheme === 'stripes') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 15;
      ctx.save();
      ctx.rotate(-Math.PI / 4);
      for (let i = -canvas.height; i < canvas.width; i += 35) {
        ctx.beginPath();
        ctx.moveTo(i, -canvas.height);
        ctx.lineTo(i + canvas.height * 2, canvas.height);
        ctx.stroke();
      }
      ctx.restore();
    }


    const photoWidth = (stripWidth - (padding * (layout.grid.cols + 1))) / layout.grid.cols;
    const photoHeight = (stripHeight - (padding * (layout.grid.rows + 1))) / layout.grid.rows;

    // Draw photos
    for (let i = 0; i < photos.length; i++) {
        const row = Math.floor(i / layout.grid.cols);
        const col = i % layout.grid.cols;

        // Define the destination rectangle on the canvas
        const dx = padding + col * (photoWidth + padding);
        const dy = padding + row * (photoHeight + padding);
        const dWidth = photoWidth;
        const dHeight = photoHeight;

        const img = photoImages.current[i];
        if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
            // This logic performs a "center crop" to ensure the image fills the space
            // without being stretched or distorted, preserving its original aspect ratio.
            
            const imgAspectRatio = img.naturalWidth / img.naturalHeight;
            const slotAspectRatio = dWidth / dHeight;

            let sx = 0, sy = 0, sWidth = img.naturalWidth, sHeight = img.naturalHeight;

            // Compare aspect ratios to decide whether to crop horizontally or vertically
            if (imgAspectRatio > slotAspectRatio) {
                // Image is wider than the slot (e.g., landscape photo in a portrait slot).
                // We need to crop the sides.
                sWidth = img.naturalHeight * slotAspectRatio; // Calculate new source width to match slot ratio
                sx = (img.naturalWidth - sWidth) / 2;      // Center the crop horizontally
            } else {
                // Image is taller than or same ratio as the slot (e.g., portrait photo in a portrait slot).
                // We need to crop the top and bottom.
                sHeight = img.naturalWidth / slotAspectRatio; // Calculate new source height to match slot ratio
                sy = (img.naturalHeight - sHeight) / 2;       // Center the crop vertically
            }

            // Draw the calculated portion of the source image into the destination rectangle
            ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        }
    }
    
    // Draw stickers
    stickers.forEach(sticker => {
      ctx.save();
      const x = (sticker.x / 100) * canvas.width;
      const y = (sticker.y / 100) * canvas.height;
      ctx.translate(x, y);
      ctx.rotate(sticker.rotation * Math.PI / 180);
      ctx.font = `${sticker.size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sticker.emoji, 0, 0);
      ctx.restore();
    });

    // Draw watermark
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const watermarkText = `KiraKira ${dateStr} ${timeStr} © 2025 AW`;
    ctx.font = '16px "Fredoka"';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.textAlign = 'right';
    ctx.fillText(watermarkText, canvas.width - padding, canvas.height - padding + 5);

  }, [frameColor, frameTheme, stickers, photos, layout]);

  useEffect(() => {
    // Preload photo images
    const imagePromises = photos.map(src => {
        return new Promise<HTMLImageElement>(resolve => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    });
    Promise.all(imagePromises).then(images => {
        photoImages.current = images;
        drawCanvas();
    });
  }, [photos, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [frameColor, frameTheme, stickers, drawCanvas]);

  const addSticker = (emoji: string) => {
    setStickers(prev => [...prev, {
      id: `sticker-${Date.now()}`,
      emoji,
      x: 50,
      y: 50,
      size: 80,
      rotation: 0
    }]);
  };
  
  const resetCustomization = () => {
    setStickers([]);
    setFrameColor('#FFFFFF');
    setFrameTheme('solid');
  };

  const handleDownload = (format: 'png' | 'gif') => {
    setIsProcessing(true);
    setTimeout(async () => {
        try {
            if (format === 'png') {
                const dataUrl = canvasRef.current?.toDataURL('image/png');
                if (dataUrl) {
                    const link = document.createElement('a');
                    link.download = 'kirakira-snap.png';
                    link.href = dataUrl;
                    link.click();
                }
            } else if (format === 'gif') {
                const gifUrl = await generateGif(photoImages.current, 1000); // 1s per frame
                if (gifUrl) {
                    const link = document.createElement('a');
                    link.download = 'kirakira-snap.gif';
                    link.href = gifUrl;
                    link.click();
                }
            }
        } finally {
            setIsProcessing(false);
        }
    }, 100);
  };

  const handleQrCode = () => {
    if(qrCodeUrl) {
        setQrCodeUrl(null);
        return;
    }
    setIsProcessing(true);
    canvasRef.current?.toBlob(blob => {
        if(blob) {
            const url = URL.createObjectURL(blob);
            setQrCodeUrl(url);
        }
        setIsProcessing(false);
    }, 'image/png');
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in p-4">
      <div className="flex-grow flex flex-col items-center">
        <div className="w-full max-w-sm lg:max-w-md bg-white/50 p-4 rounded-2xl shadow-lg">
           <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
        </div>
      </div>

      <div className="w-full lg:w-96 flex-shrink-0 bg-white/60 backdrop-blur-lg p-6 rounded-2xl shadow-lg self-start">
        <h3 className="text-2xl font-bold mb-4 text-pink-500">{t.previewTitle}</h3>
        
        <div className="mb-6">
            <label className="font-semibold block mb-2">{t.previewFrameColorLabel}</label>
            <div className="flex flex-wrap gap-2">
                {FRAME_COLORS.map(color => (
                    <button key={color.name} onClick={() => setFrameColor(color.value)} className={`w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110 ${frameColor === color.value ? 'border-pink-500 scale-110 animate-pulse' : 'border-white/50'}`} style={{ backgroundColor: color.value }} aria-label={color.name} />
                ))}
                <input type="color" value={frameColor} onChange={e => setFrameColor(e.target.value)} className="w-8 h-8 p-0 border-none rounded-full cursor-pointer" />
            </div>
        </div>
        
        <div className="mb-6">
            <label className="font-semibold block mb-2">{t.previewFrameThemeLabel}</label>
            <div className="flex items-center gap-2">
                {(['solid', 'dots', 'stripes'] as FrameTheme[]).map(theme => (
                     <button key={theme} onClick={() => setFrameTheme(theme)} className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors ${frameTheme === theme ? 'bg-pink-400 text-white shadow-md' : 'bg-white/70 hover:bg-pink-100'}`}>
                        {t[`previewFrameTheme${theme.charAt(0).toUpperCase() + theme.slice(1)}` as keyof typeof t] as string}
                    </button>
                ))}
            </div>
        </div>

        <div className="mb-6">
            <label className="font-semibold block mb-2">{t.previewStickersLabel}</label>
            <select value={activeStickerPack} onChange={e => setActiveStickerPack(e.target.value)} className="w-full p-2 border border-pink-200 rounded-lg bg-white/70 mb-2 focus:ring-2 focus:ring-pink-400 focus:outline-none">
                {STICKER_PACKS.map(pack => <option key={pack.name} value={pack.name}>{pack.name}</option>)}
            </select>
            <div className="flex flex-wrap gap-2 bg-pink-100/50 p-2 rounded-lg max-h-32 overflow-y-auto">
                {STICKER_PACKS.find(p => p.name === activeStickerPack)?.stickers.map(sticker => (
                    <button key={sticker} onClick={() => addSticker(sticker)} className="text-3xl hover:scale-125 transition-transform">{sticker}</button>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">{t.previewStickersHint}</p>
        </div>
        
        <button onClick={resetCustomization} className="w-full text-center text-sm text-gray-600 hover:text-pink-500 mb-6 font-semibold">{t.previewResetButton}</button>
        
        <div className="space-y-3">
            <button disabled={isProcessing} onClick={() => handleDownload('png')} className="w-full bg-pink-400 text-white font-bold py-3 px-4 rounded-full hover:bg-pink-500 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-300">
                {isProcessing ? t.previewProcessing : t.previewDownloadPNG}
            </button>
            <button disabled={isProcessing} onClick={() => handleDownload('gif')} className="w-full bg-pink-400 text-white font-bold py-3 px-4 rounded-full hover:bg-pink-500 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-300">
                {isProcessing ? t.previewProcessing : t.previewDownloadGIF}
            </button>
            <button disabled={isProcessing} onClick={handleQrCode} className="w-full bg-pink-400 text-white font-bold py-3 px-4 rounded-full hover:bg-pink-500 transition-all shadow-lg transform hover:scale-105 disabled:bg-gray-300">
                {isProcessing ? t.previewProcessing : (qrCodeUrl ? t.previewCloseQRButton : t.previewQRCodeButton)}
            </button>
            {qrCodeUrl && (
                <div className="bg-white p-4 rounded-lg flex flex-col items-center animate-fade-in">
                    <QRCodeSVG value={qrCodeUrl} size={128} />
                    <p className="text-sm mt-2 text-center">{t.previewQRHint}</p>
                </div>
            )}
            <button onClick={onRetake} className="w-full bg-gray-400 text-white font-bold py-3 px-4 rounded-full hover:bg-gray-500 transition-all shadow-lg transform hover:scale-105">
                {t.previewRetakeButton}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Preview;