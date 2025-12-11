import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authFetch } from "@/lib/api"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/identity/Identity/signin`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, navigate); 
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Login failed.";
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        setError(errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate('/');
      window.location.reload();
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        return;
      }
      console.error("Login API call failed:", err);
      setError("Network error or server unavailable.");
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button className="w-full" onClick={handleLogin}>Sign in</Button>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
