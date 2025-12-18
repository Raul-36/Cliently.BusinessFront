import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authFetch } from "@/lib/api";
import { useBusiness } from "@/contexts/BusinessContext";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

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

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedText, setEditedText] = useState("");

  const { business } = useBusiness();

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
          return;
        }

        const data: InfoText = await response.json();
        setInfoText(data);
        setEditedName(data.name);
        setEditedText(data.text);
      } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') return;
        setError("Network error or failed to connect.");
        console.error("Fetch InfoText failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInfoText();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!id || !business) {
      setError("Cannot save without Text ID and Business ID.");
      return;
    }

    const payload = {
      id: id,
      name: editedName,
      text: editedText,
      businessId: business.id,
    };

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/business/InfoTexts`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Failed to update text.");
        return;
      }

      window.location.reload();
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      setError("Network error or failed to connect during save.");
      console.error("Update InfoText failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!id) {
      setError("Cannot delete without Text ID.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/business/InfoTexts/${id}`, {
        method: 'DELETE',
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Failed to delete text.");
        return;
      }

      navigate('/');
      window.location.reload();
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      setError("Network error or failed to connect during delete.");
      console.error("Delete InfoText failed:", err);
    }
  };

  const handleCancel = () => {
    if (infoText) {
      setEditedName(infoText.name);
      setEditedText(infoText.text);
    }
    setIsEditing(false);
  };

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
        <CardHeader className="flex flex-row items-start justify-between">
          <div className="flex-grow min-w-0">
            {!isEditing ? (
              <CardTitle className="text-3xl break-words">{infoText.name}</CardTitle>
            ) : (
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="text-3xl font-bold p-2 h-auto border-2 border-dashed"
              />
            )}
          </div>
          {!isEditing && (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Pencil className="h-5 w-5 text-blue-500" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete the text titled &quot;{infoText.name}&quot;.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <p className="whitespace-pre-wrap break-words">{infoText.text}</p>
          ) : (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[400px]"
            />
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="justify-end gap-2">
            <Button variant="destructive" onClick={handleCancel}>Cancel</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Save</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Changes</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to save these changes?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSave}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
