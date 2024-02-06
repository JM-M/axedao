import Heading from '@/sections/Heading';
import Topic from '@/sections/Topic';

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Heading />

      <Topic
        title="Creating Axé"
        bgImg="/images/Chamada-Street.jpg"
        text="Coming together and creating Axé"
        card={{
          width: '600px',
          height: '450px',
          xOffset: '50%',
          yOffset: '-20%',
        }}
      />

      <Topic
        title="Creating Axé II"
        bgImg="/images/Roda-PedestrianZone.jpg"
        text="Coming together and creating Axé"
        animateFrom="right"
        card={{ width: '400px', height: '250px' }}
      />
    </div>
  );
}
