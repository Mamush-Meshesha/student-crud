import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import type { RootState } from "@/stores";
import { logout } from "@/stores/slices/authSlice";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { User as UserIcon, LogOut, Home } from "lucide-react";

function getInitials(name?: string | null, email?: string | null) {
  if (name && name.trim().length) {
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const last = parts[1]?.[0] ?? "";
    return (first + last).toUpperCase();
  }
  if (email) return email[0]?.toUpperCase() ?? "U";
  return "U";
}

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold">
            <Home className="h-4 w-4" /> Student Manager
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2">
                <span className="mr-2 inline-flex items-center justify-center h-7 w-7 rounded-full bg-muted text-foreground/80 text-xs font-semibold">
                  {getInitials(user?.name, user?.email)}
                </span>
                <span className="hidden sm:inline text-sm">{user?.name ?? user?.email ?? "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/")}> <UserIcon className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-destructive"> <LogOut className="mr-2 h-4 w-4" /> Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
