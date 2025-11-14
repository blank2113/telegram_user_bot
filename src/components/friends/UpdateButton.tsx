import { type FC, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { RxUpdate } from "react-icons/rx";

type Props = {
  onClick?: () => void;
  className?: string;
  size?: number;
  vibrate?: boolean;
};

const UpdateButton: FC<Props> = ({
  onClick,
  className = "",
  size = 35,
  vibrate = true,
}) => {
  const btnSize = `${size}px`;
  const iconControls = useAnimation();
  const rotationRef = useRef<number>(0);

  const handleClick = async () => {
    onClick?.();

    try {
      if (vibrate && navigator.vibrate) navigator.vibrate(20);
    } catch {}

    rotationRef.current += 360;

    void iconControls.start({
      rotate: rotationRef.current,
      transition: { duration: 0.55, ease: "easeInOut" },
    });
  };

  return (
    <motion.button
      type='button'
      onClick={handleClick}
      aria-label='Обновить'
      whileTap={{ scale: 1.12 }}
      whileHover={{ scale: 1.06 }}
      transition={{ type: "spring", stiffness: 600, damping: 18 }}
      className={`flex items-center justify-center rounded-md border ${className}`}
      style={{
        width: btnSize,
        height: btnSize,
        background: "rgba(183,248,255,0.25)", // #B7F8FF40
        borderColor: "rgba(183,248,255,0.58)", // #B7F8FF95
        padding: 0,
        display: "inline-flex",
        cursor: "pointer",
      }}>
      <motion.span
        animate={iconControls}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <RxUpdate
          style={{ color: "rgba(183,248,255,0.58)" }}
          size={Math.round(size * 0.56)}
        />
      </motion.span>
    </motion.button>
  );
};

export default UpdateButton;
