"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { useFilterStore } from "@/lib/store";
import CreateProjectDialog from "./_components/create-project-dialog";
import ProjectCard from "./_components/ProjectCard";

export default function AdminProjectsPage() {
  const projects = useQuery(api.projects.getProjects); // Fetch projects
  const { statusFilter, searchQuery, setStatusFilter, setSearchQuery, resetFilters } = useFilterStore();
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleReset = () => {
    resetFilters();
  };

  // Filter projects based on status and search query
  const filteredProjects = projects
    ? projects.filter((project) => {
        const matchesStatus =
          !statusFilter || statusFilter === "all" || project.status === statusFilter;
        const matchesSearch =
          !searchQuery ||
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
      })
    : [];

  // Loading state
  if (!projects) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <div className="h-10 w-32 bg-muted rounded-md"></div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Project Management</CardTitle>
            <CardDescription>
              Manage your interior design projects and track their progress.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Skeleton className="h-10 w-72" />
                <Skeleton className="h-10 w-48" />
                <div className="flex items-center gap-2 ml-auto">
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <CreateProjectDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </CreateProjectDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Project Management</CardTitle>
          <CardDescription>
            Manage your interior design projects and track their progress.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={statusFilter || "all"}
                onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="whitespace-nowrap"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
            
            {/* No results state */}
            {filteredProjects.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-lg font-medium mb-2">No projects found</p>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || statusFilter 
                    ? "Try changing your search or filter criteria" 
                    : "Add your first project to get started"}
                </p>
                <CreateProjectDialog>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </CreateProjectDialog>
              </div>
            )}
            
            {/* Project grid */}
            {filteredProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}