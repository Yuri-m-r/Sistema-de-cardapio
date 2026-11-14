import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import type { ModalProps } from "../types/sharedType";

export const Modal = ({
  title,
  onClose,
  size = "md",
  children,
  isBusy = false,
}: ModalProps) => {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  // ------------- Change focus -------------
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, []);

  // ------------- Esc close -------------
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isBusy) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, isBusy]);

  // ------------- Render -------------
  return createPortal(
    <div className="modal-overlay">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={size === "lg" ? "modal modal--lg" : "modal"}
      >
        <header className="modal__header">
          <h2 id={titleId} className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            aria-label="Fechar"
            disabled={isBusy}
            onClick={() => onClose()}
          >
            ×
          </button>
        </header>
        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  );
};
