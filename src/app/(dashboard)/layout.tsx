"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  Calendar,
  BarChart3,
  Plug,
  Bot,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons";
import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/create", icon: PenSquare, label: "Create Post" },
  { href: "/posts", icon: FileText, label: "My Posts" },
  { href: "/schedule", icon: Calendar, label: "Schedule" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/integrations", icon: Plug, label: "Integrations" },
  { href: "/ai-agent", icon: Bot, label: "AI Agent" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

function SidebarContent({ collapsed, onCollapse }: { collapsed: boolean; onCollapse?: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-4 border-b">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary">
          <Instagram className="h-5 w-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold tracking-tight">
            InstaFlow <span className="text-gradient">AI</span>
          </span>
        )}
        {onCollapse && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={onCollapse}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive && "text-primary")} />
                {!collapsed && <span>{item.label}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t p-3">
        <div className={cn("flex items-center gap-3 rounded-lg px-3 py-2", collapsed && "justify-center px-0")}>
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials(session?.user?.name || "U")}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{session?.user?.email || ""}</p>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <header className="lg:hidden flex h-14 items-center gap-3 border-b px-4 bg-card">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent collapsed={false} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Instagram className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold">InstaFlow AI</span>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r bg-card h-screen fixed top-0 left-0 z-40 transition-all duration-300",
            collapsed ? "w-[72px]" : "w-[260px]"
          )}
        >
          <SidebarContent collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
        </aside>

        {/* Main content */}
        <main className={cn(
          "flex-1 min-h-screen transition-all duration-300",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"
        )}>
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
