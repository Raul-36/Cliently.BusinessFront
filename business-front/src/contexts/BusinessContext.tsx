import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the types for the business data based on the API response
interface ShortInfoTextResponse {
  id: string;
  title: string;
  // Add other properties if available in the DTO
}

interface InfoListResponse {
  id: string;
  name: string;
  // Add other properties if available in the DTO
}

interface BusinessResponse {
  id: string;
  name: string;
  lists: InfoListResponse[];
  texts: ShortInfoTextResponse[];
}

interface BusinessContextType {
  business: BusinessResponse | null;
  loading: boolean;
  error: string | null;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

interface BusinessProviderProps {
  children: React.ReactNode;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/business/Businesses/byUser", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 404) {
            // No business found for this user, which is a valid scenario.
            // We can set business to null and clear error.
            setBusiness(null);
            setError(null);
            console.warn("No business found for the current user.");
            setLoading(false);
            return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          setError(errorText || "Failed to fetch business data.");
          setLoading(false);
          return;
        }

        const data: BusinessResponse = await response.json();
        setBusiness(data);
      } catch (err) {
        let errorMessage = "Network error or failed to connect to business service.";
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        console.error("Error fetching business data:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <BusinessContext.Provider value={{ business, loading, error }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
