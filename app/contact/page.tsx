"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12 md:py-20">
        <div className="container max-w-xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Have a question or want to start your project? Fill out the form below and our team will get back to you soon.
          </p>
          <Card className="p-8 text-left shadow-lg">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                <Input id="name" placeholder="Your Name" required />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                <Input id="email" type="email" placeholder="you@example.com" required />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                <Textarea id="message" placeholder="How can we help you?" rows={5} required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 