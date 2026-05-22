import { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';
import { fadeUp, staggerContainer } from '../utils/animations';

export function AnimatedDiv({ children, variants = fadeUp, custom, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      custom={custom}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerDiv({ children, style, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
}

