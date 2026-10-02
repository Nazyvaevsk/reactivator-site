"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Sheet = {
  sheet: number;
  sourceSheet?: number;
  cardId: string;
  sourceType: string;
  sourcePage: number;
  assetKey: string;
};

type GroupData = {
  schemaVersion: number;
  groupId: string;
  make: string;
  model: string;
  year: string;
  variant: string;
  sheetCount: number;
  sheets: Sheet[];
};

type Point = {
  x: number;
  y: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 6;

function clampScale(value: number) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, value));
}

export default function BodyDimensionSheetPage() {
  const params = useParams<{ groupId: string; sheet: string }>();

  const groupId = params.groupId.toLowerCase();
  const sheetNumber = Number(params.sheet);

  const [data, setData] = useState<GroupData | null>(null);
  const [error, setError] = useState("");

  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const viewerRef = useRef<HTMLDivElement | null>(null);
  const pointers = useRef<Map<number, Point>>(new Map());
  const lastPointer = useRef<Point | null>(null);

  const pinchStart = useRef<{
    distance: number;
    scale: number;
    offset: Point;
    midpoint: Point;
  } | null>(null);

  useEffect(() => {
    fetch(`/body-dimensions/groups/${groupId}.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error();
        }

        return response.json();
      })
      .then((json: GroupData) => {
        setData(json);
        setError("");
      })
      .catch(() => setError("Карта автомобиля не найдена."));
  }, [groupId]);

  const currentSheet = useMemo(() => {
    return data?.sheets.find((item) => item.sheet === sheetNumber) ?? null;
  }, [data, sheetNumber]);

  const currentIndex = useMemo(() => {
    if (!data || !currentSheet) return -1;

    return data.sheets.findIndex(
      (item) => item.sheet === currentSheet.sheet,
    );
  }, [data, currentSheet]);

  const previousSheet =
    data && currentIndex > 0
      ? data.sheets[currentIndex - 1]
      : null;

  const nextSheet =
    data &&
    currentIndex >= 0 &&
    currentIndex < data.sheets.length - 1
      ? data.sheets[currentIndex + 1]
      : null;

  const assetUrl = currentSheet
    ? `/body-dimensions/${currentSheet.assetKey}`
    : "";

  function resetView() {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  function zoomBy(delta: number) {
    setScale((current) => {
      const next = clampScale(current + delta);

      if (next === 1) {
        setOffset({ x: 0, y: 0 });
      }

      return next;
    });
  }

  useEffect(() => {
    const viewer = viewerRef.current;

    if (!viewer) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const factor = event.deltaY < 0 ? 0.2 : -0.2;

      setScale((current) => {
        const next = clampScale(current + factor);

        if (next === 1) {
          setOffset({ x: 0, y: 0 });
        }

        return next;
      });
    };

    viewer.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return () => {
      viewer.removeEventListener("wheel", handleWheel);
    };
  }, [currentSheet?.sheet]);

  function getDistance(a: Point, b: Point) {
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  function getMidpoint(a: Point, b: Point): Point {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    };
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);

    const point = {
      x: event.clientX,
      y: event.clientY,
    };

    pointers.current.set(event.pointerId, point);

    if (pointers.current.size === 1) {
      lastPointer.current = point;
      setDragging(true);
    }

    if (pointers.current.size === 2) {
      const [a, b] = Array.from(pointers.current.values());

      pinchStart.current = {
        distance: getDistance(a, b),
        scale,
        offset,
        midpoint: getMidpoint(a, b),
      };

      lastPointer.current = null;
      setDragging(false);
    }
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    if (!pointers.current.has(event.pointerId)) {
      return;
    }

    const point = {
      x: event.clientX,
      y: event.clientY,
    };

    pointers.current.set(event.pointerId, point);

    if (
      pointers.current.size === 1 &&
      lastPointer.current &&
      scale > 1
    ) {
      const dx = point.x - lastPointer.current.x;
      const dy = point.y - lastPointer.current.y;

      setOffset((current) => ({
        x: current.x + dx,
        y: current.y + dy,
      }));

      lastPointer.current = point;
      return;
    }

    if (
      pointers.current.size === 2 &&
      pinchStart.current
    ) {
      const [a, b] = Array.from(pointers.current.values());

      const distance = getDistance(a, b);
      const midpoint = getMidpoint(a, b);

      const ratio =
        distance / pinchStart.current.distance;

      const nextScale = clampScale(
        pinchStart.current.scale * ratio,
      );

      setScale(nextScale);

      setOffset({
        x:
          pinchStart.current.offset.x +
          (midpoint.x - pinchStart.current.midpoint.x),
        y:
          pinchStart.current.offset.y +
          (midpoint.y - pinchStart.current.midpoint.y),
      });
    }
  }

  function handlePointerEnd(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    pointers.current.delete(event.pointerId);

    if (pointers.current.size === 0) {
      lastPointer.current = null;
      pinchStart.current = null;
      setDragging(false);
      return;
    }

    if (pointers.current.size === 1) {
      const remaining = Array.from(
        pointers.current.values(),
      )[0];

      lastPointer.current = remaining;
      pinchStart.current = null;
      setDragging(true);
    }
  }

  useEffect(() => {
    resetView();
  }, [groupId, sheetNumber]);

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 bg-zinc-950/95">
        <div className="mx-auto max-w-[1440px] px-6 pb-7 pt-28 md:px-8 max-md:px-4 max-md:pt-24">
          <Link
            href={`/body-dimensions/${groupId}`}
            className="text-sm font-semibold text-zinc-400 transition hover:text-orange-500"
          >
            ← Назад к автомобилю
          </Link>

          {data && currentSheet && (
            <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
                  {data.groupId} · Лист {currentSheet.sheet} из{" "}
                  {data.sheetCount}
                </p>

                <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                  {data.make} {data.model}{" "}
                  <span className="text-orange-500">
                    {data.year}
                  </span>
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  {data.variant || "Кузов не указан"} ·{" "}
                  {currentSheet.cardId}
                </p>
              </div>

              <a
                href={assetUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:text-orange-500"
              >
                Открыть SVG отдельно
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1600px] px-4 py-5 md:px-6">
        {error && (
          <div className="rounded-[22px] border border-red-500/30 bg-red-950/20 p-6 text-red-300">
            {error}
          </div>
        )}

        {data && !currentSheet && (
          <div className="rounded-[22px] border border-red-500/30 bg-red-950/20 p-6 text-red-300">
            Такой лист не найден.
          </div>
        )}

        {currentSheet && (
          <>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-zinc-500">
                Колесо мыши или жест двумя пальцами — масштаб.
                Перетаскивайте схему для просмотра деталей.
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => zoomBy(-0.25)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-xl font-bold transition hover:border-orange-500 hover:text-orange-500"
                  aria-label="Уменьшить"
                >
                  −
                </button>

                <div className="min-w-[74px] rounded-xl border border-white/10 bg-zinc-950 px-3 py-3 text-center text-sm font-semibold text-zinc-300">
                  {Math.round(scale * 100)}%
                </div>

                <button
                  type="button"
                  onClick={() => zoomBy(0.25)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-zinc-950 text-xl font-bold transition hover:border-orange-500 hover:text-orange-500"
                  aria-label="Увеличить"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={resetView}
                  className="h-11 rounded-xl border border-white/10 bg-zinc-950 px-4 text-sm font-semibold text-zinc-300 transition hover:border-orange-500 hover:text-orange-500"
                >
                  Сброс
                </button>
              </div>
            </div>

            <div
              ref={viewerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              className={`relative flex h-[76vh] min-h-[560px] w-full items-center justify-center overflow-hidden rounded-[22px] border border-white/10 bg-white select-none touch-none max-md:h-[68vh] max-md:min-h-[460px] ${
                dragging && scale > 1
                  ? "cursor-grabbing"
                  : scale > 1
                    ? "cursor-grab"
                    : "cursor-zoom-in"
              }`}
            >
              <img
                src={assetUrl}
                alt={`${data?.make} ${data?.model} ${data?.year} — лист ${currentSheet.sheet}`}
                draggable={false}
                className="pointer-events-none block max-h-full max-w-full object-contain"
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transformOrigin: "center center",
                  transition:
                    pointers.current.size === 0
                      ? "transform 120ms ease-out"
                      : "none",
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 items-center gap-3">
              <div>
                {previousSheet ? (
                  <Link
                    href={`/body-dimensions/${groupId}/${previousSheet.sheet}`}
                    className="inline-flex min-h-12 items-center rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:text-orange-500"
                  >
                    ← Лист {previousSheet.sheet}
                  </Link>
                ) : (
                  <span />
                )}
              </div>

              <div className="text-center text-sm text-zinc-500">
                {currentSheet.sheet} / {data?.sheetCount}
              </div>

              <div className="text-right">
                {nextSheet ? (
                  <Link
                    href={`/body-dimensions/${groupId}/${nextSheet.sheet}`}
                    className="inline-flex min-h-12 items-center rounded-2xl border border-white/10 bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-500 hover:text-orange-500"
                  >
                    Лист {nextSheet.sheet} →
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

