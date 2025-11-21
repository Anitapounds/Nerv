"use client";

import { useEffect, useRef, useState } from "react";
import ChatSidebar from "@/components/ChatSidebar";
import TipModal from "@/components/TipModal";
import Link from "next/link";
import { Camera, MonitorUp, Mic, MicOff, X, MessageSquare, DollarSign } from "lucide-react";

/**
 * Live session page
 * - isLive: whether the live session is ongoing
 * - cameraStream / screenStream: separate media streams
 * - startLive -> toggles isLive (live can start even without camera/screen)
 * - toggleCamera / toggleScreenShare -> request & attach tracks, stop only those tracks when toggled off
 * - endLive -> stops all tracks and resets
 *
 * Notes:
 * - Browser permissions required for camera and screen sharing.
 * - For real streaming you would forward tracks to a server, or use WebRTC/Livepeer/etc.
 */

export default function LiveSessionPage() {
  const mainVideoRef = useRef<HTMLVideoElement | null>(null); // main frame (screen or camera)
  const camVideoRef = useRef<HTMLVideoElement | null>(null); // small overlay for camera when both active

  const [isLive, setIsLive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);
  const [viewerCount, setViewerCount] = useState(45);
  const [tipTotal, setTipTotal] = useState(0);

  // attach media streams to appropriate video elements
  useEffect(() => {
    // if screen exists, show it in main video
    if (mainVideoRef.current) {
      if (screenStream) {
        mainVideoRef.current.srcObject = screenStream;
      } else if (cameraStream) {
        mainVideoRef.current.srcObject = cameraStream;
      } else {
        mainVideoRef.current.srcObject = null;
      }
    }

    if (camVideoRef.current) {
      // if both active, show camera in PIP
      if (cameraStream && screenStream) {
        camVideoRef.current.srcObject = cameraStream;
      } else {
        camVideoRef.current.srcObject = null;
      }
    }
  }, [cameraStream, screenStream]);

  // Clean up on unmount: stop tracks
  useEffect(() => {
    return () => {
      stopCamera();
      stopScreen();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // start live (does not request any stream automatically)
  const startLive = () => {
    setIsLive(true);
  };

  // end everything: stops streams and ends live
  const endLive = () => {
    stopCamera();
    stopScreen();
    setIsLive(false);
  };

  // request camera stream
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraStream(s);
      // mute local preview to prevent audio echo in browser
      if (camVideoRef.current) camVideoRef.current.muted = true;
    } catch (err) {
      console.error("camera error", err);
      alert("Camera permission denied or not available.");
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
  };

  // request screen share
  const startScreen = async () => {
    try {
      const s = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: true });
      setScreenStream(s);
      // if main video using screen, mute it locally
      if (mainVideoRef.current) mainVideoRef.current.muted = true;
    } catch (err) {
      console.error("screen error", err);
      alert("Screen share permission denied or not available.");
    }
  };

  const stopScreen = () => {
    screenStream?.getTracks().forEach((t) => t.stop());
    setScreenStream(null);
  };

  // toggle mic on/off across available streams
  const toggleMic = () => {
    const toggle = (s: MediaStream | null) => {
      s?.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    };
    toggle(cameraStream);
    toggle(screenStream);
    setMicOn((m) => !m);
  };

  // when user clicks camera toggle (can start or stop)
  const handleCameraToggle = async () => {
    if (!cameraStream) {
      await startCamera();
    } else {
      stopCamera();
    }
  };

  // when user clicks screen toggle (can start or stop)
  const handleScreenToggle = async () => {
    if (!screenStream) {
      await startScreen();
    } else {
      stopScreen();
    }
  };

  // handle tip sending
  const handleSendTip = (amount: number) => {
    setTipTotal((t) => t + amount);
    setViewerCount((v) => v + Math.floor(Math.random() * 2)); // small fake activity
  };

 

  // video placeholder UI when no streams exist yet
  const placeholder = (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="text-center opacity-60">
        <div className="inline-block mb-3 w-64 h-36 bg-neutral-800 rounded-lg" />
        <div className="text-sm">Preview area — your stream will appear here</div>
      </div>
    </div>
  );

  return (
    <div className="relative h-screen w-full bg-black text-white">
      {/* Top bar */}
      <div className="absolute top-25 left-4 z-40 flex items-center gap-3">
        <Link href="/ongoing-live" className="text-gray-400 hover:text-white">
          ←
        </Link>
        <div className="bg-indigo-600 px-3 py-1 rounded-md text-sm">Live</div>
        <span className="text-gray-300 text-sm">👁 0</span>
      </div>

      {/* Main frame */}
      <div className="h-full w-full flex items-center justify-center">
        <div className="relative h-full w-full max-w-[1400px] max-h-[820px] bg-black/80 rounded-lg overflow-hidden">
          {/* main video (screen or camera) */}
          <video
            ref={mainVideoRef}
            autoPlay
            playsInline
            muted // local preview muted to avoid feedback
            className="w-full h-full object-cover bg-black px-55 py-20"
          />

          {/* camera PIP */}
          {cameraStream && screenStream && (
            <video
              ref={camVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-6 right-6 w-48 h-32 rounded-md border border-neutral-800 object-cover shadow-lg"
            />
          )}

          {/* placeholder when nothing is active */}
          {!cameraStream && !screenStream && placeholder}
        </div>
      </div>

      {/* Controls bottom center */}
      <div className="absolute bottom-6 left-0 right-0 z-50 flex flex-col items-center">
        <div className="flex gap-4 mb-3">
          {/* Camera toggle */}
          <button
            onClick={handleCameraToggle}
            title="Toggle camera"
            className={`p-3 rounded-full ${cameraStream ? "bg-indigo-600 " : "bg-neutral-800"}`}
          >
            <Camera />
          </button>

          {/* Screen share toggle */}
          <button
            onClick={handleScreenToggle}
            title="Toggle screen share"
            className={`p-3 rounded-full ${screenStream ? "bg-indigo-600 " : "bg-neutral-800"}`}
          >
            <MonitorUp />
          </button>

          {/* Mic */}
          <button
            onClick={toggleMic}
            title="Toggle mic"
            className={`p-3 rounded-full ${micOn ? "bg-neutral-800" : "bg-red-600"}`}
          >
            {micOn ? <Mic /> : <MicOff />}
          </button>

          {/* End call */}
          <button
            onClick={endLive}
            title="End Live"
            className="p-3 rounded-full bg-red-600"
          >
            <X />
          </button>
        </div>

        {/* Start / Live controls row */}
        <div className="flex items-center gap-3">
          {!isLive ? (
            // layout preview + start live
            <div className="flex items-center gap-3">
              

              <button onClick={startLive} className="bg-indigo-600  px-4 py-2 rounded ml-2">
                Start Live
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded bg-neutral-900 text-sm">Viewers: {viewerCount}</div>
              <div className="px-3 py-1 rounded bg-neutral-900 text-sm">Tipped: {tipTotal} $oct</div>
              <button onClick={() => setTipOpen(true)} className="bg-indigo-600 px-3 py-1 rounded">
                Tip
              </button>
              <button onClick={() => setChatOpen((c) => !c)} className="bg-indigo-600 px-3 py-1 rounded">
                Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat and tip UI */}
      {chatOpen && <ChatSidebar onClose={() => setChatOpen(false)} />}
      {tipOpen && <TipModal onClose={() => setTipOpen(false)} onSend={handleSendTip} />}

      {/* A small floating tip and total at bottom corners */}
      {isLive && (
      <div className="absolute bottom-4 left-4">
        <button onClick={() => setTipOpen(true)} className="bg-indigo-600 px-3 py-1 rounded text-sm">Stream tip</button>
      </div>)}
      <div className="absolute bottom-4 right-4">
        <div className="bg-indigo-600 px-3 py-1 rounded text-sm">Total tipped: {tipTotal} $oct</div>
      </div>
    </div>
    
  );
}
