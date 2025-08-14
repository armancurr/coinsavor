"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto max-w-md px-4 py-6">
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
