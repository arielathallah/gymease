import GymDetailContent from '@/components/gyms/GymDetailContent';

export default function GymPage({ params }: { params: { id: string } }) {
  return <GymDetailContent params={params} />;
}
