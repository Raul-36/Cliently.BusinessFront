import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authFetch } from '@/lib/api';

type NavigateFunction = ReturnType<typeof useNavigate>;
interface ShortInfoTextResponse {
  id: string;
  name: string;
}

interface InfoListResponse {
  id: string;
  name: string;
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
  navigate: NavigateFunction;
}

export const BusinessProvider: React.FC<BusinessProviderProps> = ({ children, navigate }) => {
  const [business, setBusiness] = useState<BusinessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      setError(null);

      if (!localStorage.getItem('authToken')) {
        setLoading(false);
        return;
      }

      try {
        const apiUrl = import.meta.env.VITE_API_GATEWAY_URL;
        const response = await authFetch(`${apiUrl}/api/business/Businesses/byUser`, {
          method: "GET",
        }, navigate);

        if (response.status === 404) {
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
        if (err instanceof Error && err.message === 'Unauthorized') {
          return;
        }
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
  }, [navigate]);

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