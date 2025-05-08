"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Linkedin } from "lucide-react";

const team = [
  {
    name: "Alex Morgan",
    role: "Lead Designer",
    bio: "Alex specializes in modern, functional spaces and has 10+ years of experience.",
    color: "bg-blue-500",
    email: "alex@elegant.com",
  },
  {
    name: "Jamie Lee",
    role: "Project Manager",
    bio: "Jamie ensures every project runs smoothly and clients are always informed.",
    color: "bg-green-500",
    email: "jamie@elegant.com",
  },
  {
    name: "Taylor Smith",
    role: "Senior Architect",
    bio: "Taylor brings creative vision and technical expertise to every design.",
    color: "bg-purple-500",
    email: "taylor@elegant.com"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30 py-12 md:py-20">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground mb-8">
            At Elegant Interiors, we transform spaces into beautiful, functional environments. Our team brings creativity, expertise, and a client-focused approach to every project.
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
              {team.map((member) => (
                <Card
                  key={member.email}
                  className="flex flex-col items-center p-6 shadow-md hover:shadow-xl transition-shadow border border-border/60 bg-white dark:bg-background"
                >
                  <Avatar className={`w-20 h-20 mb-4 text-3xl font-bold ${member.color} text-white flex items-center justify-center`}>
                    {member.name[0]}
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-1">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-3">{member.bio}</p>
                  <div className="flex gap-3 mt-auto">
                    <a href={`mailto:${member.email}`} className="text-muted-foreground hover:text-primary transition-colors text-sm underline">
                      Email
                    </a>
                  </div>
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