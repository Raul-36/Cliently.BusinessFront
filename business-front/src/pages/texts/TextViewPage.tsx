import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authFetch } from "@/lib/api";

interface InfoText {
  id: string;
  name: string;
  text: string;
}

export default function TextViewPage() {
  const { id } = useParams<{ id: string }>();
  const [infoText, setInfoText] = useState<InfoText | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfoText = async () => {
      if (!id) {
        setError("Text ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
        const response = await authFetch(`${apiUrl}/api/business/InfoTexts/${id}`, {}, navigate);

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Failed to fetch text data.");
          setLoading(false);
          return;
        }

        const data: InfoText = await response.json();
        setInfoText(data);
      } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
          return;
        }
        setError("Network error or failed to connect.");
        console.error("Fetch InfoText failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfoText();
  }, [id, navigate]);

  if (loading) {
    return <div className="p-4 text-center">Loading text...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!infoText) {
    return <div className="p-4 text-center">Text not found.</div>;
  }

  return (
    <div className="flex h-full w-full justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl">{infoText.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: infoText.text.replace(/\n/g, '<br />') }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
