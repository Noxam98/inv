import styled from 'styled-components';
import { motion } from 'framer-motion';
import shape1 from '../assets/stages/stage-1.svg';
import shape2 from '../assets/stages/stage-2.svg';
import shape3 from '../assets/stages/stage-3.svg';
import shape4 from '../assets/stages/stage-4.svg';

/* SVG viewBox dimensions + body geometry per shape.
   `bodyStart` = x where the rounded rect (body) begins in the viewBox.
   The notch (digit cutout) lives to the LEFT of bodyStart and overlaps
   the previous panel on desktop. */
const SHAPES = [
  { url: shape1, viewW: 587.5, viewH: 457, bodyStart: 74.5, bodyW: 513 },
  { url: shape2, viewW: 603,   viewH: 457, bodyStart: 89.5, bodyW: 513.5 },
  { url: shape3, viewW: 597,   viewH: 457, bodyStart: 83.5, bodyW: 513 },
  { url: shape4, viewW: 435,   viewH: 457, bodyStart: 98.5, bodyW: 336 },
];

const Wrap = styled(motion.div)`
  position: relative;
  flex: 0 0 auto;
  width: calc(var(--card-h) * var(--ratio, 1));
  height: var(--card-h);
  filter:
    drop-shadow(0px 18px 40px rgba(0, 0, 0, 0.55))
    drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.5));
  transition: filter 0.35s ease, z-index 0s linear 0s;
  cursor: pointer;
  overflow: visible;

  &:hover {
    filter:
      drop-shadow(0px 28px 60px rgba(0, 0, 0, 0.75))
      drop-shadow(0px 8px 18px rgba(0, 0, 0, 0.6))
      drop-shadow(0 0 26px rgba(199, 125, 255, 0.45))
      brightness(1.12);
    z-index: 10 !important;
  }

  /* On hover, smoothly shift content toward card center + scale up.
     Padding stays constant (no layout reflow / text rewrap) — pure
     compositor-friendly transform animation. */
  &:hover > div {
    transform: translate3d(var(--shift, 20%), 0, 0) scale(var(--scale, 1.12));
  }
  /* Line above each item shortens to stay visually balanced with the
     scaled-up text. */
  &:hover > div > p::before {
    transform: scaleX(0.75);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 100%;
    height: auto;
    /* On mobile/tablet each card sits in its own grid cell — render
       full panel (with its digit inside), no overflow notch trick. */
    aspect-ratio: var(--ratio-full, 1);
    filter: drop-shadow(0px 10px 24px rgba(0, 0, 0, 0.5));
    overflow: hidden;

    &:hover > div {
      transform: translate3d(0, 0, 0) scale(1.06);
    }
    &:hover > div > p::before {
      transform: scaleX(0.85);
    }
  }
`;

const Bg = styled.img`
  position: absolute;
  top: 0;
  height: 100%;
  display: block;
  pointer-events: none;
  width: var(--img-w, 100%);
  left: var(--img-l, 0%);

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    width: 100%;
    left: 0;
  }
`;

const Content = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  padding-top: 28px;
  padding-bottom: 28px;
  padding-left: var(--pad-l, 10%);
  padding-right: var(--pad-r, 8%);
  transform-origin: left center;
  transition: transform 0.4s ease;
  will-change: transform;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 24px 8% 24px 22%;
    gap: 12px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 20px 6% 20px 24%;
  }
`;

const Item = styled(motion.p)`
  font-size: 14px;
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.92);
  margin: 0;
  padding-top: 18px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-width: 220px;
    height: 2px;
    background: rgba(255, 255, 255, 0.25);
    border-radius: 1px;
    transform-origin: left center;
    transition: transform 0.4s ease;
  }

  strong {
    font-weight: 700;
    color: #fff;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 12.5px;
    padding-top: 14px;

    &::before {
      max-width: 120px;
    }
  }
`;

const wrapV = (i) => ({
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  },
});

const itemV = {
  hidden: { opacity: 0, x: -8 },
  visible: (j) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay: j * 0.06 },
  }),
};

export default function StageCard({ items, index }) {
  const shape = SHAPES[index] ?? SHAPES[0];
  const isFirst = index === 0;

  // Desktop: first panel uses full width (notch visible against page bg).
  // Other panels use body-only width; img sticks LEFT into previous panel.
  const ratio = isFirst
    ? shape.viewW / shape.viewH
    : shape.bodyW / shape.viewH;

  const imgWidthPct = isFirst
    ? 100
    : (shape.viewW / shape.bodyW) * 100;

  const imgLeftPct = isFirst
    ? 0
    : -(shape.bodyStart / shape.bodyW) * 100;

  // Account for the next panel's notch+overlap covering the right side.
  // Panel 4 is last — full body usable.
  const PAD_L = ['13%', '0%', '0%', '0'];
  const PAD_R = ['52%', '62%', '62%', '34%'];
  // On hover the Content is translated rightward by --shift to center the
  // text block on the card. Each value = 50% - (pad-l + text-w/2) of Wrap.
  // text-w = 100% - pad-l - pad-r.
  const SHIFT = ['19.5%', '18%', '18%', '0%'];
  const SCALE = [1.12, 1.12, 1.12, 1.12];

  return (
    <Wrap
      style={{
        '--ratio': ratio,
        '--ratio-full': shape.viewW / shape.viewH,
        '--pad-l': PAD_L[index] ?? '10%',
        '--pad-r': PAD_R[index] ?? '8%',
        '--shift': SHIFT[index] ?? '0%',
        '--scale': SCALE[index] ?? 1.12,
        zIndex: index + 1,
      }}
      variants={wrapV(index)}
      initial="hidden"
      whileInView="visible"
      whileHover={{ y: -12, scale: 1.025 }}
      transition={{ y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
    >
      <Bg
        src={shape.url}
        style={{
          '--img-w': `${imgWidthPct}%`,
          '--img-l': `${imgLeftPct}%`,
        }}
        alt=""
        draggable={false}
      />
      <Content>
        {items.map((item, j) => (
          <Item
            key={j}
            custom={j}
            variants={itemV}
            initial="hidden"
            whileInView="visible"
          >
            {typeof item === 'string' ? (
              item
            ) : (
              <>
                <strong>{item.bold}</strong>
                {item.rest}
              </>
            )}
          </Item>
        ))}
      </Content>
    </Wrap>
  );
}
