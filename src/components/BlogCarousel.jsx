import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EMBLA_OPTIONS = {
  align: 'center',
  loop: true,
  skipSnaps: true,
  duration: 28,
};

const SLIDE_SPRING = { type: 'spring', damping: 32, stiffness: 240, mass: 0.7 };

const Frame = styled(motion.div)`
  position: relative;
  border-radius: 36px;
  background:
    radial-gradient(120% 120% at 0% 0%, rgba(80, 30, 140, 0.18) 0%, transparent 60%),
    radial-gradient(120% 120% at 100% 100%, rgba(50, 10, 90, 0.22) 0%, transparent 60%),
    rgba(15, 5, 30, 0.45);
  border: 1px solid rgba(155, 93, 229, 0.12);
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    inset 0 1px 0 rgba(180, 130, 255, 0.08),
    inset 0 0 60px rgba(80, 30, 140, 0.08);
  padding: 64px 130px;
  margin-bottom: 110px;
  overflow: hidden;
  user-select: none;
  touch-action: pan-y;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 56px 90px;
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 56px 24px;
    border-radius: 24px;
    margin-bottom: 70px;
  }
`;

const Viewport = styled.div`
  overflow: hidden;
  cursor: grab;

  &:active { cursor: grabbing; }
  @media (hover: none) { cursor: auto; }
`;

const Container = styled.div`
  display: flex;
  gap: 28px;
  align-items: stretch;
  touch-action: pan-y;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    gap: 16px;
  }
`;

const SlideWrapper = styled.div`
  flex: 0 0 calc((100% - 56px) / 3);
  min-width: 0;
  display: flex;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex: 0 0 86%;
  }
`;

const Slide = styled(motion.create(Link))`
  position: relative;
  width: 100%;
  border-radius: 18px;
  background: linear-gradient(155deg, rgba(70, 25, 110, 0.55), rgba(20, 8, 45, 0.85));
  border: 1px solid rgba(155, 93, 229, 0.18);
  padding: 24px 24px 28px;
  display: flex;
  flex-direction: column;
  min-height: 320px;
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(200, 150, 255, 0.06),
    0 12px 30px rgba(0, 0, 0, 0.35);
  transform-origin: center center;
  will-change: transform, opacity;
  text-decoration: none;
  color: inherit;
  -webkit-user-drag: none;
  transition: border-color 0.25s, box-shadow 0.25s;

  ${({ $active }) =>
    $active &&
    `
      background: linear-gradient(155deg, rgba(95, 35, 150, 0.7), rgba(30, 10, 60, 0.92));
      border-color: rgba(155, 93, 229, 0.35);
      box-shadow:
        inset 0 1px 0 rgba(220, 170, 255, 0.10),
        0 16px 50px rgba(60, 20, 130, 0.45);
      cursor: pointer;

      &:hover {
        border-color: rgba(180, 130, 255, 0.6);
        box-shadow:
          inset 0 1px 0 rgba(220, 170, 255, 0.14),
          0 20px 60px rgba(80, 30, 160, 0.55);
      }
    `}
`;

const NewPill = styled.span`
  position: absolute;
  top: 16px;
  right: 16px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 10px;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.95);
  background: rgba(120, 60, 200, 0.5);
  border: 1px solid rgba(180, 130, 255, 0.35);
  border-radius: 12px;
  padding: 4px 12px;
  backdrop-filter: blur(6px);
`;

const Meta = styled.div`
  font-size: 12px;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 12px;
`;

const Title = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 24px;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.colors.white};
  line-height: 1.2;
  margin-bottom: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 22px;
  }
`;

const Excerpt = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.6);
  flex: 1;
`;

const Dots = styled.div`
  display: none;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const Dot = styled.button`
  width: ${({ $active }) => ($active ? '22px' : '8px')};
  height: 8px;
  border-radius: 999px;
  background: ${({ $active }) =>
    $active ? 'rgba(180, 130, 255, 0.9)' : 'rgba(255, 255, 255, 0.18)'};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background 0.25s, width 0.3s ease;

  &:active {
    transform: scale(0.9);
  }
`;

const NavBtn = styled.button`
  position: absolute;
  top: 50%;
  ${({ $side }) => ($side === 'left' ? 'left: 28px;' : 'right: 28px;')}
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(140, 70, 220, 0.85), rgba(40, 10, 80, 0.95) 70%);
  border: 1px solid rgba(180, 130, 255, 0.35);
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 24px rgba(120, 60, 200, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  transition: transform 0.2s, box-shadow 0.2s, opacity 0.25s;
  z-index: 4;

  &:hover {
    transform: translateY(-50%) scale(1.06);
    box-shadow:
      0 0 32px rgba(155, 93, 229, 0.55),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  &:active { transform: translateY(-50%) scale(0.96); }
  &:disabled { opacity: 0.25; cursor: not-allowed; pointer-events: none; }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export default function BlogCarousel({ articles }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(EMBLA_OPTIONS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    onSelect();
    emblaApi.on('select', onSelect).on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onSelect);
    };
  }, [emblaApi]);

  return (
    <Frame
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <NavBtn
        $side="left"
        onClick={() => emblaApi?.scrollPrev()}
        disabled={!canPrev}
        aria-label="Previous article"
      >
        <ChevronLeft size={26} strokeWidth={1.6} />
      </NavBtn>

      <Viewport ref={emblaRef}>
        <Container>
          {articles.map((a, i) => {
            const isActive = i === selectedIndex;
            return (
              <SlideWrapper key={a.slug}>
                <Slide
                  $active={isActive}
                  to={`/blog/${a.slug}`}
                  draggable={false}
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                      emblaApi?.scrollTo(i);
                    }
                  }}
                  animate={{ scale: isActive ? 1 : 0.78, opacity: isActive ? 1 : 0.42 }}
                  transition={SLIDE_SPRING}
                >
                  {a.isNew && <NewPill>new</NewPill>}
                  <Meta>{a.label} · {a.date}</Meta>
                  <Title>{a.title}</Title>
                  <Excerpt>{a.excerpt}</Excerpt>
                </Slide>
              </SlideWrapper>
            );
          })}
        </Container>
      </Viewport>

      <NavBtn
        $side="right"
        onClick={() => emblaApi?.scrollNext()}
        disabled={!canNext}
        aria-label="Next article"
      >
        <ChevronRight size={26} strokeWidth={1.6} />
      </NavBtn>

      <Dots>
        {articles.map((a, i) => (
          <Dot
            key={a.slug}
            $active={i === selectedIndex}
            onClick={() => emblaApi?.scrollTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </Dots>
    </Frame>
  );
}
