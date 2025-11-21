import type { FC, PropsWithChildren } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  open,
  onClose,
  title,
  children,
}) => {
  const modalRoot = document.getElementById('modal-root')!;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end justify-center z-50"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#05A2C6CC] rounded-xl shadow-xl p-6 relative w-full max-w-md h-96"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.22 }}
          >
            {/* Кнопка закрытия */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-2xl text-white hover:text-gray-600 transition"
              aria-label="Закрыть"
            >
              ✕
            </button>

            {/* {title && ( */}

            {/* )} */}

            <div className='overflow-hidden'>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot
  );
};
