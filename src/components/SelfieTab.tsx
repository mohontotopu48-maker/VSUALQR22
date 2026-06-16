import React, { useState, useRef, useEffect } from "react";
import { Camera, Download, RefreshCw, Upload, Smartphone, Award, Sparkles, Image, ShieldCheck } from "lucide-react";

export default function SelfieTab() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [brandedResult, setBrandedResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Overlay Config UI states
  const [badgeText, setBadgeText] = useState("Vanguard");
  const [frameColor, setFrameColor] = useState("#C00F7A");
  const [subtitle, setSubtitle] = useState("Instant Authority");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = {
        video: {
          facingMode: "user", // front camera for selfie
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Front camera failed to load:", err);
      setCameraError(
        "Selfie camera access is restricted in this frame. Upload an image below to overlay direct VSUAL agency frames!"
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedImage(result);
      applyBranding(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 640;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw reversed for normal selfie preview feel
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Reset scale
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const base64 = canvas.toDataURL("image/jpeg");
      setCapturedImage(base64);
      stopCamera();
      applyBranding(base64);
    }
  };

  // Compose selfie image with beautiful text overlay watermark on HTML5 Canvas
  const applyBranding = (sourceBase64: string) => {
    setIsProcessing(true);
    const img = new Image();
    img.src = sourceBase64;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      // High-resolution export frame
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // 1. Draw base photo
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 2. Add hot-magenta framing border
        ctx.lineWidth = 14;
        ctx.strokeStyle = frameColor;
        ctx.strokeRect(7, 7, canvas.width - 14, canvas.height - 14);

        // 3. Add subtle black glass-gradient bottom tag
        const gradientHeight = 160;
        const gradient = ctx.createLinearGradient(0, canvas.height - gradientHeight, 0, canvas.height);
        gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(0.3, "rgba(5, 0, 3, 0.75)");
        gradient.addColorStop(1, "rgba(10, 0, 6, 0.96)");
        ctx.fillStyle = gradient;
        ctx.fillRect(14, canvas.height - gradientHeight - 14, canvas.width - 28, gradientHeight);

        // 4. Draw VSUAL typography left bottom
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 44px sans-serif";
        ctx.fillText("VSUAL", 40, canvas.height - 75);

        // 5. Draw branding subtitle right bottom
        ctx.fillStyle = frameColor;
        ctx.font = "bold 20px monospace";
        ctx.textAlign = "right";
        ctx.fillText(subtitle.toUpperCase(), canvas.width - 40, canvas.height - 90);

        // 6. Draw motto right bottom below subtitle
        ctx.fillStyle = "#A1A1AA"; // zinc-450
        ctx.font = "14px monospace";
        ctx.fillText("CAPTURE • CONNECT • AUTOMATE", canvas.width - 40, canvas.height - 65);

        // Reset text align for other draws
        ctx.textAlign = "left";

        // 7. Render dynamic authority crown badge top-right inside framed corner
        const badgeWidth = 150;
        const badgeHeight = 40;
        const bX = canvas.width - badgeWidth - 40;
        const bY = 40;

        // Draw badge pill
        ctx.fillStyle = frameColor;
        // Simple rounded rectangle helper
        ctx.beginPath();
        const bRIdx = 8;
        ctx.roundRect ? ctx.roundRect(bX, bY, badgeWidth, badgeHeight, bRIdx) : ctx.rect(bX, bY, badgeWidth, badgeHeight);
        ctx.fill();

        // Print Badge text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(badgeText.toUpperCase(), bX + (badgeWidth / 2), bY + 24);

        // Reset align
        ctx.textAlign = "left";

        // Extract outcome
        const resultDataUrl = canvas.toDataURL("image/png");
        setBrandedResult(resultDataUrl);
        setIsProcessing(false);
      }
    };
  };

  const downloadBrandedSelfie = () => {
    if (!brandedResult) return;
    const link = document.createElement("a");
    link.href = brandedResult;
    link.download = `VSUAL-Authority-Selfie-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setBrandedResult(null);
    stopCamera();
  };

  return (
    <div className="space-y-6 max-w-md mx-auto" id="selfie-view-container">
      {/* Tab Header Banner */}
      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-zinc-950 to-zinc-900 border-l-4 border-[#C00F7A] rounded-r-lg shadow-md">
        <div className="p-2 bg-[#C00F7A]/10 rounded-lg text-[#C00F7A]">
          <Smartphone className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            VSUAL Authority Frame
          </h2>
          <p className="text-xs text-zinc-400">
            Corporate Selfie & Watermark Overlays
          </p>
        </div>
      </div>

      {!capturedImage && !cameraActive && !isProcessing && (
        <div className="space-y-4">
          {/* Main Select Mode Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              id="selfie-camera-btn"
              onClick={startCamera}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl hover:border-[#C00F7A]/40 transition group relative text-center"
            >
              <div className="p-3 bg-[#C00F7A]/10 rounded-full text-[#C00F7A] mb-3 group-hover:bg-[#C00F7A]/20 transition">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Live Selfie Cam</span>
              <span className="text-[10px] text-zinc-400 mt-1">Open Device Lens</span>
            </button>

            <button
              type="button"
              id="selfie-upload-btn"
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl hover:border-[#C00F7A]/40 transition group text-center"
            >
              <div className="p-3 bg-[#C00F7A]/10 rounded-full text-[#C00F7A] mb-3 group-hover:bg-[#C00F7A]/20 transition">
                <Upload className="h-6 w-6" />
              </div>
              <span className="text-sm font-bold text-zinc-100">Upload Portrait</span>
              <span className="text-[10px] text-zinc-400 mt-1">PNG, JPEG From Gallery</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* Quick Informational Tip */}
          <div className="p-4 bg-zinc-950/40 border border-zinc-900/60 rounded-xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C00F7A] flex items-center space-x-1.5">
              <Award className="h-3.5 w-3.5" />
              <span>Instant Branding Philosophy</span>
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              When working at booths, trade shows, or client forums, snapping a swift cohesive selfie adds immediate corporate Authority. Our generator watermarks it perfectly for instant LinkedIn, X, or promotional marketing group updates.
            </p>
          </div>
        </div>
      )}

      {/* Live Front Camera Stream */}
      {cameraActive && !capturedImage && (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#C00F7A] bg-black aspect-square flex flex-col justify-end">
          <video
            ref={videoRef}
            className="w-full h-full object-cover scale-x-[-1]" // mirror selfie
            playsInline
            muted
          />

          {/* Live Overlay View HUD */}
          <div className="absolute inset-0 border border-white/10 pointer-events-none flex flex-col justify-between p-6">
            <div className="self-end bg-[#C00F7A] text-white text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-md uppercase">
              {badgeText}
            </div>
            <div className="space-y-1">
              <div className="text-white text-lg font-black tracking-wide">VSUAL</div>
              <div className="text-[#C00F7A] text-xs font-mono font-bold uppercase tracking-widest">
                {subtitle}
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 pointer-events-auto">
            <button
              type="button"
              id="selfie-snap-btn"
              onClick={handleCapture}
              className="bg-gradient-to-r from-[#C00F7A] to-pink-650 hover:from-pink-650 hover:to-magenta-700 text-white font-bold p-4 rounded-full shadow-lg border border-white/20 transition-all scale-110 active:scale-95 flex items-center justify-center"
            >
              <Camera className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={stopCamera}
              className="bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-bold px-4 py-2 rounded-full text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cameraError && !cameraActive && !capturedImage && (
        <div className="p-3.5 bg-zinc-950 border border-zinc-850/80 text-zinc-400 text-xs rounded-xl flex items-start space-x-2">
          <Smartphone className="h-5 w-5 text-[#C00F7A] shrink-0 mt-0.5" />
          <span>{cameraError}</span>
        </div>
      )}

      {/* Render composite overlay results */}
      {brandedResult && (
        <div className="space-y-4">
          <div className="border-2 border-[#C00F7A] rounded-2xl overflow-hidden shadow-2xl bg-zinc-950">
            <img
              src={brandedResult}
              alt="Branded VSUAL Selfie"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain bg-zinc-900"
            />
          </div>

          {/* Configuration and Watermark control */}
          <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#C00F7A] font-bold block mb-1">
              Frame Settings & Authority Customization
            </span>
            
            <div className="space-y-3">
              {/* Corner Badge Word */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Watermark Badge Tag (Top Right)
                </label>
                <div className="flex space-x-1.5">
                  {["Vanguard", "Platinum", "Authority", "Promo Pro"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setBadgeText(t);
                        if (capturedImage) applyBranding(capturedImage);
                      }}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition border ${
                        badgeText === t
                          ? "bg-[#C00F7A] text-white border-[#C00F7A]"
                          : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle wording */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Tagline Subtitle Text (Bottom Right)
                </label>
                <input
                  type="text"
                  maxLength={24}
                  value={subtitle}
                  onChange={(e) => {
                    setSubtitle(e.target.value);
                    if (capturedImage) {
                      // Throttle branding dynamically
                      applyBranding(capturedImage);
                    }
                  }}
                  onBlur={() => {
                    if (capturedImage) applyBranding(capturedImage);
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C00F7A] text-xs text-white px-3 py-2 rounded-lg outline-none"
                  placeholder="e.g. Instant Authority"
                />
              </div>

              {/* Theme color frame choice */}
              <div>
                <label className="block text-[9px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                  Frame Branding Color
                </label>
                <div className="flex space-x-2">
                  {[
                    { name: "Hot Magenta", hex: "#C00F7A" },
                    { name: "Cyber Purple", hex: "#7A0FC0" },
                    { name: "Promo Crimson", hex: "#C00F0F" },
                    { name: "Matte Gold", hex: "#C0A60F" }
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => {
                        setFrameColor(c.hex);
                        if (capturedImage) {
                          // Quick inline apply
                          const imgObj = new Image();
                          imgObj.src = capturedImage;
                          imgObj.onload = () => {
                            const cElem = document.createElement("canvas");
                            cElem.width = 800;
                            cElem.height = 800;
                            const ctx = cElem.getContext("2d");
                            if (ctx) {
                              ctx.drawImage(imgObj, 0, 0, 800, 800);
                              ctx.lineWidth = 14;
                              ctx.strokeStyle = c.hex;
                              ctx.strokeRect(7, 7, 786, 786);
                              // Gradient
                              const grad = ctx.createLinearGradient(0, 640, 0, 800);
                              grad.addColorStop(0, "rgba(0, 0, 0, 0)");
                              grad.addColorStop(0.3, "rgba(5, 0, 3, 0.75)");
                              grad.addColorStop(1, "rgba(10, 0, 6, 0.96)");
                              ctx.fillStyle = grad;
                              ctx.fillRect(14, 626, 772, 160);
                              // VSUAL text
                              ctx.fillStyle = "#FFFFFF";
                              ctx.font = "bold 44px sans-serif";
                              ctx.fillText("VSUAL", 40, 725);
                              // Subtitle
                              ctx.fillStyle = c.hex;
                              ctx.font = "bold 20px monospace";
                              ctx.textAlign = "right";
                              ctx.fillText(subtitle.toUpperCase(), 760, 710);
                              // Motto
                              ctx.fillStyle = "#A1A1AA";
                              ctx.font = "14px monospace";
                              ctx.fillText("CAPTURE • CONNECT • AUTOMATE", 760, 735);
                              // Badge
                              ctx.textAlign = "center";
                              ctx.fillStyle = c.hex;
                              ctx.fillRect(610, 40, 150, 40);
                              ctx.fillStyle = "#FFFFFF";
                              ctx.font = "bold 13px sans-serif";
                              ctx.fillText(badgeText.toUpperCase(), 610 + 75, 40 + 24);
                              
                              setBrandedResult(cElem.toDataURL("image/png"));
                            }
                          };
                        }
                      }}
                      className="h-6 w-12 rounded border border-white/10 relative transition flex items-center justify-center font-mono text-[8px] text-white"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {frameColor === c.hex && "✓"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl text-xs transition"
            >
              Take Another
            </button>
            <button
              type="button"
              id="selfie-download-btn"
              onClick={downloadBrandedSelfie}
              className="bg-gradient-to-r from-[#C00F7A] to-pink-650 hover:from-pink-650 hover:to-magenta-700 text-white font-bold py-3 rounded-xl text-xs shadow-lg flex items-center justify-center space-x-1 transition"
            >
              <Download className="h-4 w-4" />
              <span>Download Branded JPEG</span>
            </button>
          </div>

          {/* Social Proof Checklist */}
          <div className="p-3 bg-zinc-950 border border-green-950/40 text-zinc-400 text-[10px] rounded-xl flex items-center space-x-2 shadow-inner">
            <ShieldCheck className="h-4 w-4 text-green-400 shrink-0" />
            <span>Success: PNG rendered successfully. Watermarks are fully embedded and optimized for social platforms!</span>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="p-12 bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
          <RefreshCw className="h-8 w-8 text-[#C00F7A] animate-spin" />
          <p className="text-xs font-bold text-white uppercase tracking-widest animate-pulse">
            Rendering high-res composite...
          </p>
        </div>
      )}
    </div>
  );
}
