"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useFilterStore } from "@/lib/store";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.getProjects);
  const { statusFilter, searchQuery, setStatusFilter, setSearchQuery, resetFilters } = useFilterStore();

  // Filter projects based on status and search query
  const filteredProjects = projects
    ? projects.filter((project) => {
        const matchesStatus = !statusFilter || project.status === statusFilter;
        const matchesSearch = !searchQuery || 
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        return matchesStatus && matchesSearch;
      })
    : [];

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20";
      case "planning":
        return "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20";
      case "delayed":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-muted/30 py-12 md:py-20 border-b">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Our Projects
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Browse through our portfolio of interior design projects and get inspired for your own space.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 max-w-xl mx-auto">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search projects..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select 
                  value={statusFilter || ""} 
                  onValueChange={(value) => setStatusFilter(value || null)}
                >
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-12 md:py-20">
          {projects ? (
            filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Link key={project._id} href={`/projects/${project._id}`} className="block group">
                    <div className="rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors duration-300 h-full overflow-hidden">
                      <div className="relative">
                        <AspectRatio ratio={4/3}>
                          {project.images && project.images.length > 0 ? (
                            <img
                              src={project.images[0].url}
                              alt={project.title}
                              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <p className="text-muted-foreground">No image</p>
                            </div>
                          )}
                        </AspectRatio>
                        <Badge 
                          className={`absolute top-3 right-3 capitalize ${getStatusBadgeColor(project.status)}`}
                        >
                          {project.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground line-clamp-2 mb-4">
                          {project.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">${project.price.toLocaleString()}</span>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-20">
                <h3 className="text-xl font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any projects matching your search criteria.
                </p>
                <Button onClick={() => resetFilters()}>Clear Filters</Button>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border border-border rounded-lg overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-5 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}