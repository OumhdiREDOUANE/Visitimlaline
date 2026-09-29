'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Button } from '@/components/ui/Button.js';
import { logClientError } from '@/lib/observability/client.js';

/**
 * Camera QR reader for the check-in desk.
 *
 * Two deliberate choices keep this small and dependable:
 *
 * 1. jsQR is imported dynamically, so the decoder is fetched the first time
 *    someone opens the camera and never sits in the initial bundle.
 * 2. A scan is one read and then the camera closes. The desk handles one
 *    guest at a time, and the typed form below stays usable the entire time,
 *    so a denied permission or an unreadable code is a dead end for nobody.
 *
 * The camera needs a secure context, which http://localhost is; on a bare
 * LAN address the browser refuses and the form carries the flow alone.
 */
export function QrScanner({ onScan, t }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const foundRef = useRef(false);

  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setActive(false);
  }, []);

  useEffect(() => stop, [stop]);

  const start = async () => {
    setError(null);
    foundRef.current = false;

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

      streamRef.current = stream;

      const video = videoRef.current;
      video.srcObject = stream;
      await video.play();

      // jsQR ships CommonJS, so interop may hand back the function directly.
      const imported = await import('jsqr');
      const jsQR = imported.default ?? imported;

      setActive(true);

      timerRef.current = setInterval(() => {
        if (foundRef.current || video.readyState < 2) {
          return;
        }

        const canvas = canvasRef.current;
        const width = Math.min(video.videoWidth, 480);

        if (!width) {
          return;
        }

        canvas.width = width;
        canvas.height = Math.round(
          (video.videoHeight * width) / video.videoWidth
        );

        const context = canvas.getContext('2d', {
          willReadFrequently: true,
        });

        context.drawImage(
          video,
          0,
          0,
          canvas.width,
          canvas.height
        );

        const frame = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        const hit = jsQR(
          frame.data,
          frame.width,
          frame.height
        );

        if (!hit) {
          return;
        }

        foundRef.current = true;
        stop();
        onScan(hit.data);
      }, 250);
    } catch (failure) {
      logClientError('checkin.camera_failed', {
        reason: failure?.name ?? 'unknown',
      });

      setError(t('checkIn.cameraError'));
      stop();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={active ? stop : start}
        >
          {active
            ? t('checkIn.scanStop')
            : t('checkIn.scanStart')}
        </Button>

        <p className="text-sm text-muted">
          {t('checkIn.scanHint')}
        </p>
      </div>

      {/*
        The <video> and <canvas> stay mounted so their refs exist before
        start() runs; only the video is shown while the camera is open.
      */}
      <video
        ref={videoRef}
        muted
        playsInline
        aria-hidden="true"
        className={
          active
            ? 'w-full max-w-sm border border-ink/10 bg-ink'
            : 'hidden'
        }
      />

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="hidden"
      />

      {error ? (
        <p
          role="alert"
          className="text-sm font-semibold text-terra"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
