"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  group: string;
  exp: string;
  sig: string;
  sheets: string[];
  make: string;
  model: string;
  year: string;
  variant: string;
};

export default function AccessViewer({
  group,
  exp,
  sig,
  sheets,
  make,
  model,
  year,
  variant,
}: Props) {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const pointers = useRef(
    new Map<number, { x: number; y: number }>()
  );
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const lastDistance = useRef<number | null>(null);

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

  const reset = () => {
    setScale(1);
    setX(0);
    setY(0);
    pointers.current.clear();
    lastPoint.current = null;
    lastDistance.current = null;
  };

  useEffect(() => {
    reset();
  }, [index]);

  const sheet = sheets[index];

  const [src, setSrc] = useState("");
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const sheetUrl =
    `/api/body-dimensions/sheet` +
    `?group=${encodeURIComponent(group)}` +
    `&exp=${encodeURIComponent(exp)}` +
    `&sheet=${encodeURIComponent(sheet)}`;

  useEffect(() => {
    const controller = new AbortController();
    let blobUrl = "";
    setSrc("");
    setError("");
    fetch(sheetUrl, { headers: { Authorization: "Bearer " + sig }, cache: "no-store", referrerPolicy: "no-referrer", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error(response.status === 429 ? "Слишком много запросов. Подождите минуту." : "Не удалось загрузить лист. Проверьте срок доступа.");
        const blob = await response.blob();
        if (controller.signal.aborted) return;
        blobUrl = URL.createObjectURL(blob);
        setSrc(blobUrl);
      }).catch(error => { if (!controller.signal.aborted) setError(error.message); });
    return () => { controller.abort(); if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [sheetUrl, sig]);

  const download = async () => {
    setDownloading(true);
    setError("");
    try {
      const response = await fetch("/api/body-dimensions/download?" + new URLSearchParams({ group, exp }), {
        headers: { Authorization: "Bearer " + sig }, cache: "no-store", referrerPolicy: "no-referrer",
      });
      if (!response.ok) throw new Error(response.status === 429 ? "Слишком много скачиваний. Попробуйте позже." : "Не удалось скачать комплект.");
      const url = URL.createObjectURL(await response.blob());
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = group + ".zip";
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) { setError(error instanceof Error ? error.message : "Ошибка скачивания"); }
    finally { setDownloading(false); }
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    setScale((current) =>
      clamp(current * (event.deltaY < 0 ? 1.12 : 0.88), 0.5, 6)
    );
  };

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 1) {
      lastPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }

    if (pointers.current.size === 2) {
      const points = [...pointers.current.values()];
      lastDistance.current = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );
    }
  };

  const handlePointerMove = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    if (!pointers.current.has(event.pointerId)) return;

    pointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });

    if (pointers.current.size === 2) {
      const points = [...pointers.current.values()];

      const distance = Math.hypot(
        points[0].x - points[1].x,
        points[0].y - points[1].y
      );

      if (lastDistance.current) {
        const ratio = distance / lastDistance.current;

        setScale((current) =>
          clamp(current * ratio, 0.5, 6)
        );
      }

      lastDistance.current = distance;
      return;
    }

    if (pointers.current.size === 1 && lastPoint.current) {
      const dx = event.clientX - lastPoint.current.x;
      const dy = event.clientY - lastPoint.current.y;

      setX((current) => current + dx);
      setY((current) => current + dy);

      lastPoint.current = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>
  ) => {
    pointers.current.delete(event.pointerId);
    lastDistance.current = null;

    const remaining = [...pointers.current.values()];

    if (remaining.length === 1) {
      lastPoint.current = remaining[0];
    } else {
      lastPoint.current = null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <div className="border-b border-white/10 bg-black px-4 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Реактиватор
            </div>

            <div className="mt-1 text-lg font-bold">
              {make} {model} {year}
            </div>

            <div className="text-sm text-zinc-400">
              {variant ? `${variant} · ` : ""}Комплект {group} · {sheets.length} листов
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={download}
              disabled={downloading}
              className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-black hover:bg-orange-400"
            >
              {downloading ? "Скачивание…" : "Скачать комплект"}
            </button>

            <button
              onClick={reset}
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Сбросить масштаб
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-zinc-900 px-3 py-3">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
          {sheets.map((_, sheetIndex) => (
            <button
              key={sheetIndex}
              onClick={() => setIndex(sheetIndex)}
              className={
                sheetIndex === index
                  ? "shrink-0 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-black"
                  : "shrink-0 rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
              }
            >
              Лист {sheetIndex + 1}
            </button>
          ))}
        </div>
      </div>

      <div
        className="relative flex flex-1 cursor-grab items-center justify-center overflow-hidden bg-zinc-800 active:cursor-grabbing"
        style={{ touchAction: "none", minHeight: "70vh" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {error && <p role="alert">{error}</p>}
        {src && <img
          src={src}
          alt={`Лист ${index + 1}`}
          draggable={false}
          className="max-h-[85vh] max-w-[95vw] select-none"
          style={{
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
        />}
      </div>

      <div className="border-t border-white/10 bg-black px-4 py-3 text-center text-xs text-zinc-500">
        Колесо мыши — масштаб · перетаскивание — перемещение · двумя пальцами — масштаб
      </div>
    </div>
  );
}


