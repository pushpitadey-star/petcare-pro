"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  X,
  Loader2,
  Stethoscope,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { APPOINTMENT_TYPES } from "@/lib/constants";

interface Pet {
  id: string;
  name: string;
  species: string;
}

interface Veterinarian {
  id: string;
  name: string;
  specialization: string;
  clinic: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  photo: string | null;
  qualification: string | null;
  experience: number | null;
  rating: number;
  reviewCount: number;
  consultationFee: number | null;
  availability: string | null;
  bio: string | null;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  duration: number;
  reason: string | null;
  type: string;
  status: string;
  notes: string | null;
  vet: Veterinarian;
  pet: Pet;
}

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedVet, setSelectedVet] = useState<Veterinarian | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    petId: "",
    date: "",
    time: "",
    type: "consultation",
    reason: "",
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vetsRes, appointmentsRes, petsRes] = await Promise.all([
        fetch("/api/vets"),
        fetch("/api/appointments"),
        fetch("/api/pets"),
      ]);

      if (vetsRes.ok) {
        const vetsData = (await vetsRes.json()) as { vets?: Veterinarian[] };
        setVets(vetsData.vets || []);
      }
      if (appointmentsRes.ok) {
        const appointmentsData = (await appointmentsRes.json()) as { appointments?: Appointment[] };
        setAppointments(appointmentsData.appointments || []);
      }
      if (petsRes.ok) {
        const petsData = (await petsRes.json()) as { pets?: Pet[] };
        setPets(petsData.pets || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVet) return;

    setSaving(true);
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          vetId: selectedVet.id,
        }),
      });

      const data = (await response.json()) as { success?: boolean; message?: string; error?: string };
      if (data.success) {
        toast({
          title: "Appointment booked",
          description: data.message,
        });
        setBookingDialogOpen(false);
        fetchData();
        resetForm();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedVet(null);
    setFormData({
      petId: "",
      date: "",
      time: "",
      type: "consultation",
      reason: "",
      notes: "",
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredVets = vets.filter((vet) =>
    vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vet.clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingAppointments = appointments.filter(
    (a) => a.status === "pending" || a.status === "confirmed"
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "cancelled"
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Appointments</h1>
        <p className="text-muted-foreground">Book and manage your veterinary appointments</p>
      </div>

      <Tabs defaultValue="book" className="space-y-6">
        <TabsList>
          <TabsTrigger value="book">Find Veterinarians</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Book Tab */}
        <TabsContent value="book" className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, specialty, or clinic..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Vets Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredVets.map((vet) => (
              <Card key={vet.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={vet.photo || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {vet.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{vet.name}</h3>
                      <p className="text-sm text-primary">{vet.specialization}</p>
                      <p className="text-sm text-muted-foreground">{vet.clinic}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span>{vet.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({vet.reviewCount} reviews)
                      </span>
                    </div>
                    {vet.experience && (
                      <p className="text-sm text-muted-foreground">
                        {vet.experience} years experience
                      </p>
                    )}
                    {vet.consultationFee && (
                      <p className="text-sm font-medium">
                        ${vet.consultationFee} consultation
                      </p>
                    )}
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={() => {
                      setSelectedVet(vet);
                      setBookingDialogOpen(true);
                    }}
                    disabled={pets.length === 0}
                  >
                    {pets.length === 0 ? "Add a pet first" : "Book Appointment"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground">
                  Book an appointment with one of our veterinarians
                </p>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((apt) => (
              <Card key={apt.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{apt.vet.name}</h3>
                        <Badge className={getStatusColor(apt.status)}>
                          {getStatusIcon(apt.status)}
                          <span className="ml-1">{apt.status}</span>
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {apt.vet.specialization} • {apt.vet.clinic}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(apt.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {apt.time}
                        </span>
                        <span>For {apt.pet.name}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No appointment history</h3>
                <p className="text-muted-foreground">
                  Your completed appointments will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((apt) => (
              <Card key={apt.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <Stethoscope className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{apt.vet.name}</h3>
                        <Badge className={getStatusColor(apt.status)}>
                          {apt.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(apt.date)} at {apt.time}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment with {selectedVet?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleBookAppointment} className="space-y-4">
            {/* Pet */}
            <div className="space-y-2">
              <Label htmlFor="petId">Select Pet *</Label>
              <Select
                value={formData.petId}
                onValueChange={(value) =>
                  setFormData({ ...formData, petId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose your pet" />
                </SelectTrigger>
                <SelectContent>
                  {pets.map((pet) => (
                    <SelectItem key={pet.id} value={pet.id}>
                      {pet.name} ({pet.species})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {APPOINTMENT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Describe your pet's symptoms or reason for visit..."
                rows={3}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information..."
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setBookingDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Appointment
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
