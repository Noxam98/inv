import Hero from '../components/Hero';
import IndsSection from '../components/IndsSection';
import ProblemsDecisions from '../components/ProblemsDecisions';
import ProjectComponents from '../components/ProjectComponents';
import SecurityFeatures from '../components/SecurityFeatures';
import Stages from '../components/Stages';
import ParallaxBackground from '../components/ParallaxBackground';

export default function HomePage() {
  return (
    <>
      <ParallaxBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <IndsSection />
        <ProblemsDecisions />
        <ProjectComponents />
        <SecurityFeatures />
        <Stages />
      </div>
    </>
  );
}
