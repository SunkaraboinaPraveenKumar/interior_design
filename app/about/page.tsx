"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12 md:py-20">
        <div className="container max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            We are passionate interior designers dedicated to transforming spaces into beautiful, functional environments. Our team brings creativity, expertise, and a client-focused approach to every project.
          </p>
          <Separator className="my-8" />
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              To inspire and elevate everyday living through innovative and thoughtful design solutions tailored to each client's unique needs and style.
            </p>
            <h2 className="text-2xl font-semibold mb-2 mt-8">Our Vision</h2>
            <p className="text-muted-foreground">
              To be recognized as a leading interior design studio known for creativity, quality, and exceptional client experiences.
            </p>
          </section>
          <Separator className="my-8" />
          <section>
            <h2 className="text-2xl font-semibold mb-6">Meet the Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
              {[1,2,3].map((i) => (
                <Card key={i} className="flex flex-col items-center p-6">
                  <Avatar className="w-20 h-20 mb-4" />
                  <h3 className="font-semibold text-lg mb-1">Team Member {i}</h3>
                  <p className="text-muted-foreground text-sm">Interior Designer</p>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 