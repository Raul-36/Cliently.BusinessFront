import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom';
import { useBusiness } from '@/contexts/BusinessContext';
import TextsDisplayCard from '@/components/TextsDisplayCard';

export default function HomePage() {
  const { business, loading, error } = useBusiness();

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-4">
        <p>Loading business data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-red-500">
        <h1 className="text-2xl font-bold">Error loading business!</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="relative flex-1">
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-[20vh] mt-24 text-center">
          <h1 className="text-2xl font-bold">
            Hey, you don't have a business yet!
          </h1>
          <p className="mt-2">
            Let's fix that. Create your business to unlock all features.
          </p>
          <Button asChild className="mt-4">
            <Link to="/create-business">Create New Business</Link>
          </Button>
        </div>
      </div>


    );
  }

        return (

          <div className="px-4 pt-8 flex flex-col gap-4 flex-grow">

            <TextsDisplayCard texts={business.texts} />

          </div>

        );
}
