import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X, ChevronDown, BookOpen, LayoutDashboard, Users, BarChart3, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const LOGO_URL = "/manus-storage/skillsphere-logo-circle_8ea1006a.png";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    if (user.role === "admin") return "/admin";
    if (user.role === "trainer") return "/trainer";
    return "/dashboard";
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img src={LOGO_URL} alt="SkillSphere" className="h-10 w-10 rounded-full object-cover" />
            <div className="leading-tight">
              <span className="block text-base font-bold tracking-tight" style={{ fontFamily: 'Poppins, sans-serif', background: 'linear-gradient(90deg, #2A63BF, #7B3FE4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SkillSphere</span>
              <span className="block text-[10px] text-muted-foreground" style={{ fontFamily: 'Lato, sans-serif', color: '#F5B942' }}>Empowering Skills. Building Futures.</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? "text-primary" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-accent transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium max-w-[120px] truncate">{user.name ?? "User"}</span>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user.email ?? user.name}</p>
                    <span className="inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary capitalize">{user.role}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> My Learning
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "trainer" || user.role === "admin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/trainer" className="flex items-center gap-2">
                        <LayoutDashboard className="h-4 w-4" /> Trainer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/payments" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" /> Payment History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href={getLoginUrl("/dashboard")}>Sign In</a>
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <a href={getLoginUrl("/dashboard")}>Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fade-in">
          <div className="container py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium py-2 text-foreground/70 hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium py-2" onClick={() => setMobileOpen(false)}>
                    My Learning
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm font-medium py-2 text-destructive text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a href={getLoginUrl("/dashboard")} className="text-sm font-medium py-2 text-primary">Sign In</a>
                  <a href={getLoginUrl("/dashboard")} className="btn-primary text-center text-sm py-2 rounded-lg">Get Started</a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
