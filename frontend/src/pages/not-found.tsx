import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
        <Link to="/">
          <Button className="h-10 px-4">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
