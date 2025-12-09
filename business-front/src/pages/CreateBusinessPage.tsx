import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreateBusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleCreateBusiness = async () => {
    setErrors([]);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrors(["No authentication token found. Please log in."]);
        navigate('/login');
        return;
      }

      const response = await fetch("http://localhost:8080/api/business/Businesses", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: businessName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (Array.isArray(errorData)) {
          setErrors(errorData);
        } else if (errorData && errorData.message) {
          setErrors([errorData.message]);
        }
        else {
          setErrors(["An unknown error occurred during business creation."]);
        }
        return;
      }

      // Business created successfully, navigate to home and reload to refresh context
      navigate('/');
      window.location.reload();
    } catch (err: any) {
      console.error("Create Business API call failed:", err);
      setErrors([err.message || "Network error or server unavailable."]);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Business</CardTitle>
          <CardDescription>
            Enter a name for your new business to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="business-name">Business Name</label>
            <Input
              id="business-name"
              type="text"
              placeholder="My Awesome Business"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
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
        <CardFooter>
          <Button className="w-full" onClick={handleCreateBusiness}>Create Business</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
