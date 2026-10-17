import React, { useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageLightboxProps {
  images: readonly LightboxImage[];
  /** Index of the image being shown, or null when the viewer is closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  labels: { close: string; previous: string; next: string };
}

const buttonClass =
  "grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 text-[#f5f7f8] transition hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

/**
 * Full-size viewer for case-study screenshots. Radix Dialog supplies the focus trap, Escape to close
 * and the modal semantics; arrow keys move between images. The image is never cropped here.
 */
const ImageLightbox: React.FC<ImageLightboxProps> = ({ images, index, onIndexChange, labels }) => {
  const opener = useRef<HTMLElement | null>(null);
  const open = index !== null && images[index] !== undefined;
  const current = open ? images[index as number] : null;
  const total = images.length;

  const go = useCallback(
    (step: number) => {
      if (index === null) return;
      onIndexChange((index + step + total) % total);
    },
    [index, onIndexChange, total],
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (next) opener.current = document.activeElement as HTMLElement | null;
        else onIndexChange(null);
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-3 p-3 focus:outline-none sm:p-6"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          onOpenAutoFocus={() => {
            opener.current = (document.activeElement as HTMLElement | null) ?? opener.current;
          }}
          onKeyDown={(event) => {
            if (total < 2) return;
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{current?.caption || current?.alt}</Dialog.Title>
          <div className="flex w-full max-w-[1600px] items-center justify-between gap-3">
            <p className="font-mono text-xs text-[#c3ccd2]" aria-live="polite">
              {index !== null ? `${index + 1} / ${total}` : ""}
            </p>
            <Dialog.Close className={buttonClass} aria-label={labels.close}>
              <X size={20} aria-hidden />
            </Dialog.Close>
          </div>
          <div className="relative flex min-h-0 w-full max-w-[1600px] flex-1 items-center justify-center">
            {total > 1 && (
              <button type="button" onClick={() => go(-1)} aria-label={labels.previous} className={`${buttonClass} absolute left-0 z-10`}>
                <ChevronLeft size={22} aria-hidden />
              </button>
            )}
            {current && (
              <img src={current.src} alt={current.alt} className="max-h-full max-w-full rounded-lg border border-white/10 bg-[#0b1019] object-contain" />
            )}
            {total > 1 && (
              <button type="button" onClick={() => go(1)} aria-label={labels.next} className={`${buttonClass} absolute right-0 z-10`}>
                <ChevronRight size={22} aria-hidden />
              </button>
            )}
          </div>
          {current?.caption && <p className="max-w-3xl text-center text-sm text-[#e6ecef]">{current.caption}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageLightbox;
