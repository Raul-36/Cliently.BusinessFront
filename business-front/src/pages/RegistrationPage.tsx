import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setErrors([]);

    if (password !== confirmPassword) {
      setErrors(["Passwords do not match."]);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/identity/Identity/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (Array.isArray(errorData)) {
          setErrors(errorData);
        } else {
          setErrors(["An unknown registration error occurred."]);
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      navigate('/');
      window.location.reload(); // still reload to make sure App.tsx re-evaluates auth
    } catch (err) {
      console.error("Registration API call failed:", err);
      setErrors(["Network error or server unavailable."]);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Create a new account.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
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
          <div className="grid gap-2">
            <label htmlFor="confirm-password">Confirm Password</label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {errors.length > 0 && (
            <div className="text-sm text-red-500">
              {errors.map((error, index) => (
                <p key={index}>{error}</p>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-4">
          <Button className="w-full" onClick={handleRegister}>Register</Button>
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
