import { PropsWithChildren, RefObject } from "react";
import { useClickOutside } from "../../hooks";

interface ModalProps {
  onClose: () => void
}

export function Modal({ onClose, children }: PropsWithChildren<ModalProps>) {
  const ref = useClickOutside(onClose)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
      <div ref={ref as RefObject<HTMLDivElement>} className="bg-white rounded-lg shadow-lg p-6 max-w-md  w-full relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};