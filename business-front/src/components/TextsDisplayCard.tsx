import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ShortInfoTextResponse } from "@/contexts/BusinessContext";

import { Button } from "@/components/ui/button";

interface TextsDisplayCardProps {
  texts: ShortInfoTextResponse[];
}

export default function TextsDisplayCard({ texts }: TextsDisplayCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Texts</CardTitle>
        <Button
          asChild
          size="sm"
          className="bg-white text-green-600 border border-green-600 hover:bg-green-50 hover:text-green-700"
        >
          <Link to="/create-text">Add New Text</Link>
        </Button>


      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto overflow-x-hidden pr-2">
          {texts.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground text-center">
                No texts found. Click "Add New Text" to create one.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {texts.map((text) => (
                <Link
                  to={`/texts/${text.id}`}
                  key={text.id}
                  className="block p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <p className="font-medium truncate">{text.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
