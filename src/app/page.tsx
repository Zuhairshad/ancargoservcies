import Hero from '@/components/home/Hero'
import Coverage from '@/components/home/Coverage'
import StatsSplit from '@/components/home/StatsSplit'
import SolutionTiles from '@/components/home/SolutionTiles'
import ServicesBand from '@/components/home/ServicesBand'
import Mission from '@/components/home/Mission'
import GiftsBand from '@/components/home/GiftsBand'
import CtaBand from '@/components/CtaBand'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Coverage />
      <StatsSplit />
      <SolutionTiles />
      <ServicesBand />
      <Mission />
      <GiftsBand />
      <CtaBand />
    </>
  )
}
