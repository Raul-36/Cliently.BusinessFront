import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome!</h1>
      <p>You are logged in. The sidebar is visible.</p>
      <Button>Click me!</Button>
    </div>
  );
}
