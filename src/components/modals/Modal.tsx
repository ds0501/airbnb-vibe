"use client";

import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  body?: React.ReactNode;
  actionLabel: string;
  secondaryAction?: () => void;
  secondaryActionLabel?: string;
  disabled?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  actionLabel,
  secondaryAction,
  secondaryActionLabel,
  disabled,
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) return;
    setShowModal(false);
    setTimeout(() => onClose(), 300);
  }, [disabled, onClose]);

  const handleSubmit = useCallback(() => {
    if (disabled) return;
    onSubmit();
  }, [disabled, onSubmit]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-800/70 p-4">
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 max-h-[90vh] flex flex-col">
        <div
          className={`translate duration-300 flex flex-col min-h-0 ${
            showModal ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          <div className="relative flex flex-col w-full bg-white shadow-lg rounded-2xl border-0 overflow-hidden max-h-[90vh]">
            {/* Header — 항상 고정 */}
            <div className="flex items-center p-6 rounded-t border-b justify-center relative flex-shrink-0">
              <button
                onClick={handleClose}
                className="absolute left-9 p-1 border-0 hover:opacity-70 transition cursor-pointer"
              >
                <X size={18} />
              </button>
              <h2 className="text-base font-semibold">{title}</h2>
            </div>

            {/* Body — 내용이 넘칠 때만 이 영역이 스크롤 */}
            <div className="relative p-6 flex-1 overflow-y-auto min-h-0">{body}</div>

            {/* Footer — 항상 하단 고정 */}
            <div className="p-6 border-t flex-shrink-0">
              <div className="flex flex-row items-center gap-4 w-full">
                {secondaryAction && secondaryActionLabel && (
                  <div className="flex-1">
                    <Button
                      variant="outline"
                      onClick={secondaryAction}
                      disabled={disabled}
                      className="w-full"
                    >
                      {secondaryActionLabel}
                    </Button>
                  </div>
                )}
                <div className="flex-1">
                  <Button
                    onClick={handleSubmit}
                    disabled={disabled}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                  >
                    {actionLabel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
