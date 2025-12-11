import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/api"; 
import { useBusiness } from "@/contexts/BusinessContext";
import { decodeJwt } from "@/lib/jwt";

export default function CreateListPage() {
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { business, loading } = useBusiness();

  const handleCreateList = async () => {
    setErrors([]);

    if (!business) {
      setErrors(["Business context is not loaded."]);
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      setErrors(["Authentication token not found."]);
      return;
    }

    const decodedToken = decodeJwt(token);
    const userId = decodedToken?.sub;

    if (!userId) {
      setErrors(["User ID not found in token."]);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const payload = { Name: name, BusinessId: business.id, UserId: userId };
      const response = await authFetch(`${apiUrl}/api/business/InfoLists`, {
        method: "POST",
        body: JSON.stringify(payload),
      }, navigate); 

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Failed to create list.";
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
      console.error("Create List API call failed:", err);
      setErrors(["Network error or server unavailable."]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create New List</CardTitle>
          <CardDescription>
            Enter the name for your new list.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">List Name</label>
            <Input
              id="name"
              type="text"
              placeholder="My Awesome List Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <Button className="w-full" onClick={handleCreateList}>Create List</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
