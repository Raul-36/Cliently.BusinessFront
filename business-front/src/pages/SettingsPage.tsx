import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { useBusiness } from "@/contexts/BusinessContext";
import { decodeJwt } from "@/lib/jwt"; 
import { authFetch } from "@/lib/api"; 

export default function SettingsPage() {
  const { business, loading, error } = useBusiness();
  const [deleteBusinessError, setDeleteBusinessError] = useState<string | null>(null);
  const [deleteAccountError, setDeleteAccountError] = useState<string | null>(null); 
  const navigate = useNavigate();
  const dialogBusinessCloseRef = useRef<HTMLButtonElement>(null); 
  const dialogAccountCloseRef = useRef<HTMLButtonElement>(null); 


  const handleDeleteBusiness = async () => {
    setDeleteBusinessError(null);

    if (!business || !business.id) {
      setDeleteBusinessError("No business found to delete.");
      return;
    }

    try {
      const response = await authFetch(`http://localhost:8080/api/business/Businesses/${business.id}`, {
        method: "DELETE",
      }, navigate); 

      if (response.status === 204) {
        
        localStorage.removeItem('authToken');
        navigate('/login');
        window.location.reload();
      } else {
        const text = await response.text();
        let errorMessage = "Failed to delete business.";
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        setDeleteBusinessError(errorMessage);
        if (dialogBusinessCloseRef.current) {
            dialogBusinessCloseRef.current.click(); 
        }
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        return; 
      }
      console.error("Delete Business API call failed:", err);
      setDeleteBusinessError(err.message || "Network error or server unavailable.");
      if (dialogBusinessCloseRef.current) {
          dialogBusinessCloseRef.current.click(); 
      }
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteAccountError(null);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setDeleteAccountError("Authentication token missing. Please log in.");
        navigate('/login');
        return;
      }

      const decodedToken = decodeJwt(token);
      const userId = decodedToken?.sub; 

      if (!userId) {
        setDeleteAccountError("User ID not found in token.");
        return;
      }

      const response = await authFetch(`http://localhost:8080/api/identity/Users/${userId}`, {
        method: "DELETE",
      }, navigate); 

      if (response.status === 204) {
        localStorage.removeItem('authToken');
        navigate('/login');
        window.location.reload();
      } else {
        const text = await response.text();
        let errorMessage = "Failed to delete account.";
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          errorMessage = text || errorMessage;
        }
        setDeleteAccountError(errorMessage);
        if (dialogAccountCloseRef.current) {
            dialogAccountCloseRef.current.click(); 
        }
      }
    } catch (err: any) {
      if (err instanceof Error && err.message === 'Unauthorized') {
        return; 
      }
      console.error("Delete Account API call failed:", err);
      setDeleteAccountError(err.message || "Network error or server unavailable.");
      if (dialogAccountCloseRef.current) {
          dialogAccountCloseRef.current.click(); 
      }
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading settings...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Settings</CardTitle>
          <CardDescription>Manage your application settings.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {business ? (
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold">Your Business: {business.name}</h2>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Delete My Business
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete your business &quot;{business.name}&quot; and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={handleDeleteBusiness}>
                      Delete Business
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {deleteBusinessError && <p className="text-sm text-red-500 mt-2">{deleteBusinessError}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground">No business associated with your account.</p>
          )}

          <hr className="my-4" /> 

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Delete My Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account and all associated data, including your business.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {deleteAccountError && <p className="text-sm text-red-500 mt-2">{deleteAccountError}</p>}

        </CardContent>
        <CardFooter className="flex-col gap-4">
        </CardFooter>
      </Card>
    </div>
  );
}
