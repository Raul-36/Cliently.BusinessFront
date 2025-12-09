import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/api"; 

export default function CreateBusinessPage() {
  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleCreateBusiness = async () => {
    setErrors([]);

    try {
      const response = await authFetch("http://localhost:8080/api/business/Businesses", {
        method: "POST",
        body: JSON.stringify({ name: businessName }),
      }, navigate); 

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Failed to create business.";
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        setErrors([errorMessage]);
        return;
      }

      
      navigate('/');
      window.location.reload();
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        
        return;
      }
      console.error("Create Business API call failed:", err);
      setErrors(["Network error or server unavailable."]);
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
