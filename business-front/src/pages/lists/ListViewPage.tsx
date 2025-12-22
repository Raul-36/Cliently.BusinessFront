import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Based on the C# DTOs
interface DynamicItem {
  id: string;
  listId: string;
  properties: { [key: string]: any };
}

interface InfoList {
  id: string;
  name: string;
}

export default function ListViewPage() {
  const { listId } = useParams<{ listId: string }>();
  const [dynamicItems, setDynamicItems] = useState<DynamicItem[]>([]);
  const [listName, setListName] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedListName, setEditedListName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCancelEdit = () => {
    setEditedListName(listName);
    setIsEditing(false);
  };

  const handleSaveEdit = async () => {
    if (!listId || !editedListName.trim()) {
      setError("List ID or name cannot be empty.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/business/InfoLists/name`, {
        method: 'PATCH',
        body: JSON.stringify({ Id: listId, Name: editedListName }),
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Failed to update list name.");
        return;
      }

      setListName(editedListName);
      setIsEditing(false);
      // No full reload, just update local state
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      setError("Network error or failed to connect during save.");
      console.error("Update list name failed:", err);
    }
  };

  const handleDelete = async () => {
    if (!listId) {
      setError("List ID is missing, cannot delete.");
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
      const response = await authFetch(`${apiUrl}/api/business/InfoLists/${listId}`, {
        method: 'DELETE',
      }, navigate);

      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Failed to delete list.");
        return;
      }

      navigate('/'); // Redirect to homepage after successful deletion
      window.location.reload(); // Force a reload of sidebar data
    } catch (err) {
      if (err instanceof Error && err.message === 'Unauthorized') return;
      setError("Network error or failed to connect during delete.");
      console.error("Delete list failed:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!listId) {
        setError("List ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;

        const [itemsResponse, listResponse] = await Promise.all([
          authFetch(`${apiUrl}/api/business/DynamicItems/ByList/${listId}`, {}, navigate),
          authFetch(`${apiUrl}/api/business/InfoLists/${listId}`, {}, navigate)
        ]);

        // Handle List Info Response
        if (listResponse.ok) {
          const listData: InfoList = await listResponse.json();
          setListName(listData.name);
          setEditedListName(listData.name); // Initialize edited name
        } else {
          // If the list itself isn't found, that's a primary error.
          setError("The requested list could not be found.");
          setLoading(false);
          return;
        }

        // Handle Dynamic Items Response
        if (itemsResponse.ok) {
          const itemsData: DynamicItem[] = await itemsResponse.json();
          setDynamicItems(itemsData);
        } else if (itemsResponse.status === 404) {
          setDynamicItems([]); // Treat 404 as an empty list, not an error
        } else {
          setError("Failed to fetch dynamic items for the list.");
        }

      } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') return;
        setError("A network error occurred. Please try again.");
        console.error("Fetch data failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [listId, navigate]);

  if (loading) {
    return <div className="p-4 text-center">Loading list data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 flex flex-col flex-grow">
      <div className="flex flex-row items-center justify-between mb-4">
        <div className="flex-grow">
          {!isEditing ? (
            <h1 className="text-2xl font-bold text-center">{listName}</h1>
          ) : (
            <Input
              value={editedListName}
              onChange={(e) => setEditedListName(e.target.value)}
              className="text-2xl font-bold p-2 h-auto border-2 border-dashed text-center"
            />
          )}
        </div>
        {!isEditing && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => { setIsEditing(true); setEditedListName(listName); }}>
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
                    This action cannot be undone. This will permanently delete the list titled &quot;{listName}&quot;.
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
      </div>
      {isEditing && (
        <div className="flex justify-end gap-2 mb-4">
          <Button variant="destructive" onClick={handleCancelEdit}>Cancel</Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Save</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Changes</DialogTitle>
                <DialogDescription>
                  Are you sure you want to save these changes to "{listName}"?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {dynamicItems.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-muted-foreground text-center">No dynamic items found for this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
          {dynamicItems.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="truncate">Item ID: {item.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  {Object.entries(item.properties).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-semibold capitalize">{key}: </span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}