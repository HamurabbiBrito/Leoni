"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(null);
  const [shouldShowAnimation, setShouldShowAnimation] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      // Solo mostrar animación si la carga tarda más de 300ms
      const timeout = setTimeout(() => {
        setShouldShowAnimation(true);
        setIsAnimating(true);
      }, 100);
      setLoadingTimeout(timeout);
    };

    const handleRouteChangeComplete = () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
      if (shouldShowAnimation) {
        setIsAnimating(false);
        const timer = setTimeout(() => setShouldShowAnimation(false), 500);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener('routeChangeStart', handleRouteChangeStart);
    window.addEventListener('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      window.removeEventListener('routeChangeStart', handleRouteChangeStart);
      window.removeEventListener('routeChangeComplete', handleRouteChangeComplete);
      if (loadingTimeout) clearTimeout(loadingTimeout);
    };
  }, [loadingTimeout, shouldShowAnimation]);

  return (
    <>
      {/* Contenido principal */}
      <div style={{ pointerEvents: isAnimating ? 'none' : 'auto' }}>
        {children}
      </div>

      {/* Overlay de transición (solo cuando es necesario) */}
      <AnimatePresence>
        {shouldShowAnimation && isAnimating && (
          <motion.div
            key="page-transition"
            className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
              animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
              exit={{ clipPath: "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative w-64 h-64"
            >
              <Image
                src="/images/Logo.png"
                alt="Loading"
                fill
                className="object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}