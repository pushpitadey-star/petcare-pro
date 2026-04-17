"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  PawPrint,
  Calendar,
  Syringe,
  Users,
  Plus,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle,
  Bell,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStats {
  totalPets: number;
  totalAppointments: number;
  upcomingVaccinations: number;
  totalPosts: number;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  photo: string | null;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  reason: string | null;
  vet: {
    name: string;
    specialization: string;
  };
  pet: {
    name: string;
    species: string;
  };
}

interface Vaccination {
  id: string;
  name: string;
  nextDueDate: string | null;
  status: string;
  pet: {
    name: string;
    species: string;
  };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsRes = await fetch("/api/dashboard/stats");
      if (statsRes.ok) {
        const statsData = (await statsRes.json()) as DashboardStats;
        setStats(statsData);
      }

      // Fetch pets
      const petsRes = await fetch("/api/pets");
      if (petsRes.ok) {
        const petsData = (await petsRes.json()) as { pets?: Pet[] };
        setPets(petsData.pets || []);
      }

      // Fetch upcoming appointments
      const appointmentsRes = await fetch("/api/appointments?status=pending,confirmed&limit=5");
      if (appointmentsRes.ok) {
        const appointmentsData = (await appointmentsRes.json()) as { appointments?: Appointment[] };
        setAppointments(appointmentsData.appointments || []);
      }

      // Fetch upcoming vaccinations
      const vaccinationsRes = await fetch("/api/vaccinations?status=scheduled&limit=5");
      if (vaccinationsRes.ok) {
        const vaccinationsData = (await vaccinationsRes.json()) as { vaccinations?: Vaccination[] };
        setVaccinations(vaccinationsData.vaccinations || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSpeciesEmoji = (species: string) => {
    const emojis: Record<string, string> = {
      dog: "🐕",
      cat: "🐱",
      bird: "🐦",
      fish: "🐠",
      rabbit: "🐰",
      hamster: "🐹",
      other: "🐾",
    };
    return emojis[species.toLowerCase()] || "🐾";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s an overview of your pet care.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-accent-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pets</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <PawPrint className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats?.totalPets || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Founders & companions</p>
          </CardContent>
        </Card>
        <Card className="card-accent-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Appointments</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats?.totalAppointments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Confirmed with specialists</p>
          </CardContent>
        </Card>
        <Card className="card-accent-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Vaccinations Due</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Syringe className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats?.upcomingVaccinations || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending health checks</p>
          </CardContent>
        </Card>
        <Card className="card-accent-green">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Social Posts</CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats?.totalPosts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Community interactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks at your fingertips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/pets">
                <Plus className="mr-2 h-4 w-4" />
                Add Pet
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Book Appointment
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/vaccinations">
                <Syringe className="mr-2 h-4 w-4" />
                Add Vaccination
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/social">
                <Users className="mr-2 h-4 w-4" />
                Create Post
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Pets */}
        <Card className="card-accent-green shadow-lg shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Pets</CardTitle>
              <CardDescription>Your registered pets</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/pets">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <PawPrint className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No pets registered yet</p>
                <Button asChild>
                  <Link href="/dashboard/pets">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Pet
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {pets.slice(0, 4).map((pet) => (
                  <div
                    key={pet.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                      {pet.photo ? (
                        <img src={pet.photo} alt={pet.name} className="h-12 w-12 rounded-full object-cover" />
                      ) : (
                        getSpeciesEmoji(pet.species)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{pet.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.breed || pet.species}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="card-accent-green shadow-lg shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled visits</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/appointments">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {appointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button asChild>
                  <Link href="/dashboard/appointments">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{apt.vet.name}</p>
                        <Badge className={getStatusColor(apt.status)} variant="secondary">
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        For {apt.pet.name} • {apt.vet.specialization}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Vaccinations */}
        <Card className="card-accent-green shadow-lg shadow-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vaccination Schedule</CardTitle>
              <CardDescription>Upcoming vaccinations</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/vaccinations">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {vaccinations.length === 0 ? (
              <div className="text-center py-8">
                <Syringe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No vaccinations scheduled</p>
                <Button asChild>
                  <Link href="/dashboard/vaccinations">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Vaccination Record
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {vaccinations.slice(0, 4).map((vax) => (
                  <div
                    key={vax.id}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Syringe className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{vax.name}</p>
                        <Badge className={getStatusColor(vax.status)} variant="secondary">
                          {vax.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For {vax.pet.name}
                      </p>
                      {vax.nextDueDate && (
                        <p className="text-sm text-muted-foreground">
                          Due: {formatDate(vax.nextDueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications / Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest pet care updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Welcome to PetCare Pro!</p>
                  <p className="text-xs text-muted-foreground">
                    Start by adding your first pet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">Account created</p>
                  <p className="text-xs text-muted-foreground">
                    Your journey begins now
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
