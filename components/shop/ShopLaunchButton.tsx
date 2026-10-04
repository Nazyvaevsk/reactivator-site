"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { shopLaunchTitle, shopLaunchDescription, shopLaunchStatus } from "./launch-copy";

export default function ShopLaunchButton({ children, className }: { children: ReactNode; className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!isOpen) return;
    const modal = dialog.current;
    const opener = trigger.current;
    const previousOverflow = document.body.style.overflow;
    modal?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen]);

  return (
    <>
      <button ref={trigger} type="button" className={className} aria-haspopup="dialog" onClick={() => setIsOpen(true)}>
        {children}
      </button>
      {isOpen && createPortal(
        <dialog
          ref={dialog}
          aria-modal="true"
          aria-labelledby={id + "-title"}
          aria-describedby={id + "-description"}
          onClose={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
          onKeyDown={(event) => {
            event.stopPropagation();
            // Keep Tab and Shift+Tab on the dialog's only interactive control.
            if (event.key === "Tab") {
              event.preventDefault();
              event.currentTarget.querySelector<HTMLButtonElement>("button")?.focus();
            }
          }}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialog.current?.close();
          }}
          className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-3xl border border-white/10 bg-zinc-950 p-0 text-white shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        >
          <div className="p-6 sm:p-8">
            <div aria-hidden="true" className="mb-6 h-px w-12 bg-orange-500" />
            <h2 id={id + "-title"} className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{shopLaunchTitle}</h2>
            <p id={id + "-description"} className="mt-5 text-base leading-relaxed text-zinc-400">{shopLaunchDescription}</p>
            <p className="mt-6 text-sm font-semibold text-orange-500">{shopLaunchStatus}</p>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold transition-colors hover:border-orange-500/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500">
              Понятно
            </button>
          </div>
        </dialog>, document.body
      )}
    </>
  );
}
