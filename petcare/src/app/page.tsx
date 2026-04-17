"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Calendar,
  Syringe,
  Users,
  Bot,
  MessageSquare,
  Shield,
  Heart,
  Stethoscope,
  Bell,
  Menu,
  X,
  Star,
  ArrowRight,
  Loader2,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

// Feature icons mapping
const featureIcons = {
  PawPrint,
  Calendar,
  Syringe,
  Users,
  Bot,
  MessageSquare,
  Shield,
  Heart,
  Stethoscope,
  Bell,
};

interface User {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: string;
}

interface PublicStats {
  totalUsers: number;
  totalPets: number;
  totalVets: number;
  avgRating: number;
}

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Check if user is logged in
  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch("/api/user", {
        credentials: "include",
      });
      if (response.ok) {
        const data = (await response.json()) as { user?: Partial<User> };
        setUser((data.user as User) || null);
      }
    } catch {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  // Fetch public stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/public/stats");
      if (response.ok) {
        const data = (await response.json()) as { stats?: PublicStats };
        setStats((data.stats as PublicStats) || null);
      }
    } catch {
      console.error("Failed to fetch stats");
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    checkAuth();
    fetchStats();
  }, [checkAuth, fetchStats]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } catch {
      console.error("Logout failed");
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K+";
    }
    return num.toString();
  };

  const features = [
    {
      icon: "PawPrint",
      title: "Pet Profiles",
      description:
        "Create detailed profiles for all your pets with photos, medical history, and vital information.",
    },
    {
      icon: "Calendar",
      title: "Appointments",
      description:
        "Book appointments with top veterinarians and manage your pet's healthcare schedule effortlessly.",
    },
    {
      icon: "Syringe",
      title: "Vaccination Tracking",
      description:
        "Never miss a vaccination with our smart reminder system and comprehensive health records.",
    },
    {
      icon: "Users",
      title: "Social Community",
      description:
        "Connect with fellow pet lovers, share stories, photos, and get advice from experienced owners.",
    },
    {
      icon: "Bot",
      title: "AI Assistant",
      description:
        "Get instant answers to your pet care questions powered by advanced AI technology.",
    },
    {
      icon: "Shield",
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security and privacy measures.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Dog Owner",
      content:
        "PetCare Pro has completely transformed how I manage my dog's health. The vaccination reminders are a lifesaver!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Cat Owner",
      content:
        "The social community feature helped me connect with other cat lovers and get valuable advice. Highly recommended!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Multi-Pet Household",
      content:
        "Managing appointments for my 4 pets used to be a nightmare. Now it's incredibly simple with PetCare Pro.",
      rating: 5,
    },
  ];

  if (!mounted || checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <PawPrint className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">PetCare Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              /* Logged in user menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline text-sm font-medium">
                      {user.name || "User"}
                    </span>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/pets" className="cursor-pointer">
                      <PawPrint className="mr-2 h-4 w-4" />
                      My Pets
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Not logged in - show sign in/get started */
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <nav className="container mx-auto flex flex-col gap-2 p-4">
              <a
                href="#features"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
              <a
                href="#about"
                className="text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              {user ? (
                <div className="flex flex-col gap-2 pt-4 border-t mt-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full text-red-600"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-4 border-t mt-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Link href="/auth/signup">Get Started</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

        <div className="container mx-auto relative px-4 py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              🐾 Trusted by {stats ? formatNumber(stats.totalUsers) : "10,000+"}{" "}
              pet owners
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              Complete Pet Care
              <span className="text-primary block">Management System</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Manage your pets&apos; health, appointments, vaccinations, and
              connect with other pet lovers all in one place. Professional pet
              care made simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-lg px-8"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-lg px-8"
                >
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8"
              >
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Real Data */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          {loadingStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <Skeleton className="h-8 w-20 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stats ? formatNumber(stats.totalUsers) : "10,000+"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Happy Pet Owners
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stats ? formatNumber(stats.totalVets) : "500+"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Partner Veterinarians
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stats ? formatNumber(stats.totalPets) : "50,000+"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Pet Protected
                </p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stats ? `${stats.avgRating.toFixed(1)}/5.0` : "4.8/5.0"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  User Satisfaction
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for pet care
            </h2>
            <p className="text-lg text-muted-foreground">
              Our comprehensive suite of tools helps you manage every aspect of
              your pet&apos;s health and happiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const IconComponent =
                featureIcons[feature.icon as keyof typeof featureIcons] ||
                PawPrint;
              return (
                <Card
                  key={i}
                  className="group hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                >
                  <CardContent className="p-6">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Loved by pet owners everywhere
            </h2>
            <p className="text-lg text-muted-foreground">
              See what our community has to say about their experience with
              PetCare Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="bg-background">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star
                        key={j}
                        className="h-4 w-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="gradient-green p-8 md:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to give your pet the best care?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Join {stats ? formatNumber(stats.totalUsers) : "thousands of"}{" "}
                pet owners who trust PetCare Pro for their pet&apos;s health and
                happiness.
              </p>
              {user ? (
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="text-lg px-8"
                >
                  <Link href="/auth/signup">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <PawPrint className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold">PetCare Pro</span>
              </Link>
              <p className="text-muted-foreground max-w-sm">
                Comprehensive pet care management system for modern pet owners.
                Your pet&apos;s health, happiness, and community - all in one
                place.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <nav className="flex flex-col gap-2">
                <a
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </a>
                <a
                  href="#testimonials"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Testimonials
                </a>
                <a
                  href="#about"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </a>
              </nav>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <nav className="flex flex-col gap-2">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} PetCare Pro. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
