"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import PipelineDashBoard from "@/app/pipeline-dashboard-v2";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface DashboardWrapperProps {
  user: User;
}

export function DashboardWrapper({ user }: DashboardWrapperProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="relative">
      {/* User header bar */}
      <div className="fixed top-0 right-0 z-50 p-4 flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.name} ({user.email})
        </span>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>

      {/* Dashboard content */}
      <PipelineDashBoard />
    </div>
  );
}
