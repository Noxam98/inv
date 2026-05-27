import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';

const BackgroundWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  contain: strict;
`;

const GridOverlay = styled(motion.div)`
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0.05) 85%);
  -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0.05) 85%);
  will-change: transform;
`;

/* Sharp Geometries */

const Diamond = styled(motion.div)`
  position: absolute;
  width: 500px;
  height: 500px;
  border: 2px solid rgba(155, 93, 229, 0.5); /* much brighter */
  background: rgba(155, 93, 229, 0.03);
  box-shadow: 0 0 50px rgba(155, 93, 229, 0.2), inset 0 0 50px rgba(155, 93, 229, 0.1);
  top: 15%;
  left: 5%; /* moved slightly inwards */
  will-change: transform;
`;

const CircleDashed = styled(motion.div)`
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  border: 3px dashed rgba(199, 125, 255, 0.25); /* slightly brighter */
  top: 35%;
  right: -5%;
  will-change: transform;
`;

const Crosshair = styled(motion.div)`
  position: absolute;
  width: 60px;
  height: 60px;
  top: 70%;
  left: 20%;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 1px;
    background: rgba(155, 93, 229, 0.4);
  }
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    height: 100%;
    width: 1px;
    background: rgba(155, 93, 229, 0.4);
  }
`;

export default function ParallaxBackground() {
  const { scrollY } = useScroll();

  // Scroll parallax mappings
  const gridY = useTransform(scrollY, [0, 5000], [0, -250]);
  const diamondY = useTransform(scrollY, [0, 5000], [0, -700]);
  const diamondRotate = useTransform(scrollY, [0, 5000], [45, 135]);
  const circleY = useTransform(scrollY, [0, 5000], [0, -1000]);
  const circleRotate = useTransform(scrollY, [0, 5000], [0, -90]);
  const crossY = useTransform(scrollY, [0, 5000], [0, -400]);

  return (
    <BackgroundWrapper>
      <GridOverlay 
        style={{ y: gridY }} 
        animate={{ opacity: [0.8, 0.4, 0.8] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Outer div handles scroll position and scroll rotation, inner handles continuous floating and pulse */}
      <motion.div style={{ position: 'absolute', top: '15%', left: '5%', y: diamondY, rotate: diamondRotate }}>
        <Diamond 
          style={{ top: 0, left: 0 }}
          animate={{ y: [0, -40, 0], scale: [1, 1.05, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div style={{ position: 'absolute', top: '35%', right: '-5%', y: circleY, rotate: circleRotate }}>
        <CircleDashed 
          style={{ top: 0, right: 0 }}
          animate={{ y: [0, 30, 0], scale: [1, 0.95, 1], opacity: [1, 0.4, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <motion.div style={{ position: 'absolute', top: '70%', left: '20%', y: crossY }}>
        <Crosshair 
          style={{ top: 0, left: 0 }}
          animate={{ opacity: [0.8, 0, 0.8, 0.8, 0.2, 0.8], scale: [1, 1.2, 1, 1, 0.9, 1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2, 0.8, 0.9, 1] }}
        />
      </motion.div>
    </BackgroundWrapper>
  );
}

