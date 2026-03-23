import styled from "styled-components";
import { motion } from "framer-motion";

const DESKTOP_WIDTH = 120;
const DESKTOP_HEIGHT = 60;
const MOBILE_WIDTH = 67;
const MOBILE_HEIGHT = 60;

const CARD_PARAMS = [
  {
    start: "#2a0340",
    end: "#3d0558",
    width: DESKTOP_WIDTH,
    height: DESKTOP_HEIGHT,
    mobileWidth: MOBILE_WIDTH,
    mobileHeight: MOBILE_HEIGHT,
  },
  {
    start: "#4e0c70",
    end: "#6a1296",
    width: DESKTOP_WIDTH - 3,
    height: DESKTOP_HEIGHT,
    mobileWidth: MOBILE_WIDTH - 3,
    mobileHeight: MOBILE_HEIGHT,
  },
  {
    start: "#761ca5",
    end: "#9826d4",
    width: DESKTOP_WIDTH,
    height: DESKTOP_HEIGHT,
    mobileWidth: MOBILE_WIDTH,
    mobileHeight: MOBILE_HEIGHT,
  },
];


const Wrap = styled(motion.div)`
  position: relative;
  flex: 1;
  display: flex;
  align-items: stretch;

  filter: drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.5));
`;

const SvgContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const ContentDiv = styled.div`
  position: relative;
  z-index: 1;
  padding: 28px 140px 28px 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.55;

    @media (max-width: 1034px) {
     padding: 28px 34px 28px 100px;
  line-height: 1;
     
    }

      @media (max-width: 528px) {
     padding: 28px 34px 28px 60px;

      }

`;

const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Item = styled(motion.li)`
  font-size: 13px;
  color: rgba(220, 215, 230, 0.85);
  padding-left: 14px;
  position: relative;
  
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 8px;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(155, 93, 229, 0.65);
  }
`;

const wrapV = (i) => ({
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
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

const SVG_VIEWBOX_WIDTH = 80;
const SVG_VIEWBOX_HEIGHT = 53.912868;

function Shape3({ gradientId, startColor, endColor, svgWidth, svgHeight, mobileWidth, mobileHeight }) {
  return (
    <SvgWrapper $svgWidth={svgWidth} $svgHeight={svgHeight} $mobileWidth={mobileWidth} $mobileHeight={mobileHeight}>
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        version="1.1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={SVG_VIEWBOX_WIDTH}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              style={{ stopColor: startColor, stopOpacity: 1 }}
              offset="0"
            />
            <stop
              style={{ stopColor: endColor, stopOpacity: 1 }}
              offset="1"
            />
          </linearGradient>
        </defs>
        <path
          style={{
            fill: `url(#${gradientId})`,
            fillOpacity: 1,
            stroke: "none",
          }}
          d="M 11,5.8 V 3.4 C 11,1.6 12.4,0 14.3,0 h 53 c 1.8,0 3.3,1.6 3.3,3.4 v 47.2 c 0,1.8 -1.5,3.3 -3.3,3.3 l -53.1,-0.1 c -0.8,0 -3,-0.1 -3,-3.1 l -0.03,-3.5 c 0,0 -2.2,0.2 -4.4,-0.4 c -2.1,-0.6 -4.3,-2 -5,-3.9 c -1.5,-3.7 -1.4,-8.3 -1.4,-8.3 l 5.8,0 c 0.2,3.6 0.2,4.8 1.6,6.1 c 0.6,0.6 3.2,1.5 4.8,-1 c 0.6,-1 0.8,-2.4 0.9,-3.2 c 0.2,-1.8 -0.1,-4.2 -1.3,-5.7 c -0.4,-0.5 -1.7,-0.7 -1.7,-0.7 l -3.3,0.2 l -0.02,-6.1 l 3.5,0 c 2.6,-1.1 3.6,-7.9 -0.1,-9.6 c -3.5,0.6 -3.5,2.5 -4,6 l -5.8,0 c 0.3,-2.6 0.4,-3.2 1.2,-5.8 c 0.7,-2.6 3.2,-5.1 4.8,-5.6 c 0.7,-0.3 1.6,-0.4 4.3,-0.3 c 0.1,0 0.02,-3 0.02,-3 z"
        />
      </svg>
    </SvgWrapper>
  );
}

const SvgWrapper = styled.div`
  width: ${({ $svgWidth }) => $svgWidth}mm;
  height: ${({ $svgHeight }) => $svgHeight}mm;

  @media (max-width: 528px) {
    width: ${({ $mobileWidth }) => $mobileWidth || $svgWidth}mm;
    height: ${({ $mobileHeight }) => $mobileHeight || $svgHeight}mm;
  }

  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

function Shape1({ gradientId, startColor, endColor, svgWidth, svgHeight, mobileWidth, mobileHeight }) {
  return (
    <SvgWrapper $svgWidth={svgWidth} $svgHeight={svgHeight} $mobileWidth={mobileWidth} $mobileHeight={mobileHeight}>
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        version="1.1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={SVG_VIEWBOX_WIDTH}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              style={{ stopColor: startColor, stopOpacity: 1 }}
              offset="0"
            />
            <stop
              style={{ stopColor: endColor, stopOpacity: 1 }}
              offset="1"
            />
          </linearGradient>
        </defs>
        <path
          style={{
            fill: `url(#${gradientId})`,
            fillOpacity: 1,
            stroke: "none",
          }}
          d="M 18,5.8 V 3.4 C 18,1.6 19.4,0 21.3,0 h 50 c 1.8,0 3.3,1.6 3.3,3.4 v 47.2 c 0,1.8 -1.5,3.3 -3.3,3.3 l -50.1,-0.1 c -0.8,0 -3,-0.1 -3,-3.1 c 0,-0.9 -0.03,-3.5 -0.03,-3.5 l -3.2,0.1 l 0.3,-28.5 l -4.7,2.9 l -0.1,-7.2 l 7.5,-5.6 c 0,0 0.02,-3 0.02,-3 z"
        />
      </svg>
    </SvgWrapper>
  );
}

function Shape2({ gradientId, startColor, endColor, svgWidth, svgHeight, mobileWidth, mobileHeight }) {
  return (
    <SvgWrapper $svgWidth={svgWidth} $svgHeight={svgHeight} $mobileWidth={mobileWidth} $mobileHeight={mobileHeight}>
      <svg
        viewBox={`0 0 ${SVG_VIEWBOX_WIDTH} ${SVG_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        version="1.1"
        xmlSpace="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2={SVG_VIEWBOX_WIDTH}
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              style={{ stopColor: startColor, stopOpacity: 1 }}
              offset="0"
            />
            <stop style={{ stopColor: endColor, stopOpacity: 1 }} offset="1" />
          </linearGradient>
        </defs>
        <path
          style={{ fill: `url(#${gradientId})`, fillOpacity: 1 }}
          d="M 14,0.1 C 12.1,0.1 10.7,1.6 10.7,3.4 v 2.4 c 0,0 0.04,3 -0.02,3 c -2.7,-0.1 -3.6,0 -4.3,0.3 c -1.6,0.6 -4.1,3 -4.8,5.6 c -0.7,2.6 -0.1,4 0.4,6.6 l 5.8,-0.1 c -0.2,-3.6 -0.2,-6.2 3.2,-6.8 c 6.3,0.8 0.3,13.1 -4.6,20 l -4.8,6.9 l -0.1,5.4 l 5.9,0 l 4.6,-0.1 l -0.2,4.1 c 0,3 2.2,3.1 3,3.1 l 53.1,0.1 c 1.8,0 3.3,-1.5 3.3,-3.3 V 3.4 c 0,-1.8 -1.5,-3.3 -3.3,-3.3 L 14,0.1 z M 11,35.7 l -0.02,5.1 l -3.5,-0.04 z"
        />
      </svg>
    </SvgWrapper>
  );
}

const SHAPES = [Shape1, Shape2, Shape3];

const CardWrap = styled.div`
  position: relative;
  width: ${({ $svgWidth }) => $svgWidth}mm;
  height: ${({ $svgHeight }) => $svgHeight}mm;

  @media (max-width: 528px) {
    width: ${({ $mobileWidth }) => $mobileWidth || $svgWidth}mm;
    height: ${({ $mobileHeight }) => $mobileHeight || $svgHeight}mm;
  }
`;

function CardSvg({ index, startColor, endColor, svgWidth, svgHeight, mobileWidth, mobileHeight, children }) {
  const ShapeComponent = SHAPES[index] ?? SHAPES[0];
  const gradientId = `gradient-${index}`;

  return (
    <CardWrap $svgWidth={svgWidth} $svgHeight={svgHeight} $mobileWidth={mobileWidth} $mobileHeight={mobileHeight}>
      <ShapeComponent
        gradientId={gradientId}
        startColor={startColor}
        endColor={endColor}
        svgWidth={svgWidth}
        svgHeight={svgHeight}
        mobileWidth={mobileWidth}
        mobileHeight={mobileHeight}
      />
      <SvgContent>{children}</SvgContent>
    </CardWrap>
  );
}

export default function StageCard({ items, index }) {
  const { start, end, width, height, mobileWidth, mobileHeight } = CARD_PARAMS[index] ?? CARD_PARAMS[0];

  return (
    <Wrap
      variants={wrapV(index)}
      initial="hidden"
      whileInView="visible"
    >
      <CardSvg
        index={index}
        startColor={start}
        endColor={end}
        svgWidth={width}
        svgHeight={height}
        mobileWidth={mobileWidth}
        mobileHeight={mobileHeight}
      >
        <ContentDiv>
          <ItemList>
            {items.map((item, j) => (
              <Item
                key={j}
                custom={j}
                variants={itemV}
                initial="hidden"
                whileInView="visible"
              >
                {item}
              </Item>
            ))}
          </ItemList>
        </ContentDiv>
      </CardSvg>
    </Wrap>
  );
}
