import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/api"; 
import { Textarea } from "@/components/ui/textarea";
import { useBusiness } from "@/contexts/BusinessContext";

export default function CreateTextPage() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();
  const { business, loading } = useBusiness();

  const handleCreateText = async () => {
    setErrors([]);

    if (!business) {
      setErrors(["Business context is not loaded."]);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/business/InfoTexts`, {
        method: "POST",
        body: JSON.stringify({ Name: name, Text: text, BusinessId: business.id }),
      }, navigate); 

      if (!response.ok) {
        const resText = await response.text();
        let errorMessage = "Failed to create text.";
        try {
          const json = JSON.parse(resText);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = resText || errorMessage;
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
      console.error("Create Text API call failed:", err);
      setErrors(["Network error or server unavailable."]);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Create New Text</CardTitle>
          <CardDescription>
            Enter the title and content for your new text.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="name">Title</label>
            <Input
              id="name"
              type="text"
              placeholder="My Awesome Text Title"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="text">Content</label>
            <Textarea
              id="text"
              placeholder="Enter your text content here..."
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
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
          <Button className="w-full" onClick={handleCreateText}>Create Text</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
