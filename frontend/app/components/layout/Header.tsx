"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

// Navigation links that are always visible (except on auth pages)
const navLinks = [
  { name: "Home", href: "/" },
  { name: "Article", href: "/article" },
  { name: "Milestones", href: "/milestones" },
  { name: "About", href: "/about" },
];

// Dashboard link (only shown when logged in)
const dashboardLink = { name: "Dashboard", href: "/dashboard" };

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // Check if we're on any auth-related page
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  // Check login status on component mount and when pathname changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if token exists in localStorage
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token) {
        setIsLoggedIn(true);
        if (userData) {
          try {
            const user = JSON.parse(userData);
            setUserName(user.name || user.email?.split("@")[0] || "User");
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      } else {
        setIsLoggedIn(false);
        setUserName("");
      }
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn"); // Remove old flag if exists
    }
    setIsLoggedIn(false);
    setUserName("");

    // Redirect to home page
    router.push("/");
  };

  // Combine navigation links - include Dashboard only if logged in
  const getNavLinks = () => {
    if (isLoggedIn) {
      return [...navLinks, dashboardLink];
    }
    return navLinks;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Spectrum Sense Logo"
                width={60}
                height={60}
                className="rounded-xl object-contain"
              />
            </div>
            <span className="font-kids font-bold text-xl text-[#4b4b4b] group-hover:text-[#77c1e6] transition-colors">
              Spectrum Sense
            </span>
          </Link>

          {/* DESKTOP NAV - Only show if NOT on auth pages */}
          {!isAuthPage && (
            <>
              <nav className="hidden md:flex gap-10">
                {getNavLinks().map((link) => {
                  const isActive = pathname === link.href;

                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        relative font-medium transition-colors duration-200
                        ${isActive ? "text-[#77c1e6]" : "text-[#4b4b4b] hover:text-[#77c1e6]"}
                        
                        after:absolute after:left-0 after:-bottom-1
                        after:h-[2px] after:bg-[#77c1e6]
                        after:transition-all after:duration-300
                        ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                      `}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>

              {/* ACTION BUTTONS - Show different buttons based on login status */}
              <div className="hidden md:flex items-center gap-3">
                {isLoggedIn ? (
                  // If logged in, show user greeting and logout button
                  <>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="bg-[#F38081] text-white font-bold px-4 py-2 rounded-lg
                       hover:bg-[#4b4b4b] hover:text-white transition-colors cursor-pointer"
                    >
                      <LogOut className="mr-2 w-4 h-4" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  // If not logged in, show login/signup buttons
                  <>
                    {/* Log in button */}
                    <Link href="/login">
                      <Button
                        variant="ghost"
                        className="bg-[#F38081] text-white font-bold px-4 py-2 rounded-lg
                         hover:bg-[#4b4b4b] hover:text-white transition-colors cursor-pointer"
                      >
                        Log in
                      </Button>
                    </Link>

                    {/* Sign up button */}
                    <Link href="/signup">
                      <Button
                        variant="nav"
                        className="bg-[#77c1e6] text-white font-bold px-4 py-2 rounded-lg
                         hover:bg-[#4b4b4b] transition-colors cursor-pointer"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}

          {/* MOBILE MENU BUTTON - Only show if NOT on auth pages */}
          {!isAuthPage && (
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          )}
        </div>

        {/* MOBILE MENU - Only show if NOT on auth pages */}
        {!isAuthPage && mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {getNavLinks().map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="
                  block px-4 py-2 rounded-lg
                  text-muted-foreground
                  hover:bg-accent/10 hover:text-foreground
                  transition
                "
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {isLoggedIn ? (
              <>
                {/* Mobile user greeting */}
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-200">
                  Welcome,{" "}
                  <span className="font-medium text-[#77c1e6]">{userName}</span>
                </div>
                {/* Mobile logout button */}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="
                    w-full text-left px-4 py-2 rounded-lg
                    text-muted-foreground
                    hover:bg-accent/10 hover:text-foreground
                    transition flex items-center
                  "
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </button>
              </>
            ) : (
              // Mobile login/signup buttons
              <>
                <Link
                  href="/login"
                  className="
                    block px-4 py-2 rounded-lg
                    text-muted-foreground
                    hover:bg-accent/10 hover:text-foreground
                    transition
                  "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="
                    block px-4 py-2 rounded-lg
                    text-muted-foreground
                    hover:bg-accent/10 hover:text-foreground
                    transition
                  "
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
