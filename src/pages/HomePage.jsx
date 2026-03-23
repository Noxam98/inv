import Hero from '../components/Hero';
import IndsSection from '../components/IndsSection';
import ProblemsDecisions from '../components/ProblemsDecisions';
import ProjectComponents from '../components/ProjectComponents';
import SecurityFeatures from '../components/SecurityFeatures';
import Architecture from '../components/Architecture';
import Stages from '../components/Stages';

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndsSection />
      <ProblemsDecisions />
      <ProjectComponents />
      <SecurityFeatures />
      <Architecture />
      <Stages />
    </>
  );
}
