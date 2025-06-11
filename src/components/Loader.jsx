import { Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

const CanvasLoader = () => {
  const { progress } = useProgress();
  return (
    <Html
      as='div'
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-20 h-20"
      >
        <div className="absolute inset-0 border-4 border-t-primary border-r-secondary border-b-tertiary border-l-white rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-t-secondary border-r-tertiary border-b-white border-l-primary rounded-full animate-spin-reverse"></div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-[14px] text-white-100 font-bold mt-8"
      >
        {progress.toFixed(2)}%
      </motion.p>
    </Html>
  );
};

export default CanvasLoader;
