import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom';
import { useBusiness } from '@/contexts/BusinessContext';

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
      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
        <h1 className="text-2xl font-bold">Hey, you don't have a business yet!</h1>
        <p className="mt-2">Let's fix that. Create your business to unlock all features.</p>
        <Button asChild className="mt-4">
          <Link to="/create-business">
            Create New Business
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome, {business.name}!</h1>
      <p>You are logged in. The sidebar is visible and populated with your business data.</p>
      <Button>Click me!</Button>
    </div>
  );
}
