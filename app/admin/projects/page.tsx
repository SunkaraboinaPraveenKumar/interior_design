"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Check, Clock, Hourglass, Pause, Plus, RefreshCw, Search } from "lucide-react";
import { useFilterStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";

export default function AdminProjectsPage() {
  const projects = useQuery(api.projects.getProjects);
  const { statusFilter, searchQuery, setStatusFilter, setSearchQuery, resetFilters } = useFilterStore();
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleReset = () => {
    resetFilters();
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Hourglass className="h-4 w-4" />;
      case "in_progress":
        return <RefreshCw className="h-4 w-4" />;
      case "completed":
        return <Check className="h-4 w-4" />;
      case "delayed":
        return <Pause className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </Link>
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
                value={statusFilter || ""}
                onValueChange={(value) => setStatusFilter(value || null)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Statuses">All Statuses</SelectItem>
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
                <Tabs
                  defaultValue="grid"
                  value={view}
                  onValueChange={(value) => setView(value as "grid" | "list")}
                  className="w-auto"
                >
                  <TabsList className="grid w-16 grid-cols-2">
                    <TabsTrigger value="grid" className="p-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="1"
                          y="1"
                          width="6"
                          height="6"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="1"
                          y="9"
                          width="6"
                          height="6"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="9"
                          y="1"
                          width="6"
                          height="6"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <rect
                          x="9"
                          y="9"
                          width="6"
                          height="6"
                          rx="1"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </TabsTrigger>
                    <TabsTrigger value="list" className="p-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1.5C1 1.22386 1.22386 1 1.5 1H14.5C14.7761 1 15 1.22386 15 1.5V3.5C15 3.77614 14.7761 4 14.5 4H1.5C1.22386 4 1 3.77614 1 3.5V1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M1 7C1 6.72386 1.22386 6.5 1.5 6.5H14.5C14.7761 6.5 15 6.72386 15 7V9C15 9.27614 14.7761 9.5 14.5 9.5H1.5C1.22386 9.5 1 9.27614 1 9V7Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M1.5 12C1.22386 12 1 12.2239 1 12.5V14.5C1 14.7761 1.22386 15 1.5 15H14.5C14.7761 15 15 14.7761 15 14.5V12.5C15 12.2239 14.7761 12 14.5 12H1.5Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="grid" className="m-0">
                    {projects ? (
                      filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredProjects.map((project) => (
                            <Link key={project._id} href={`/admin/projects/${project._id}`}>
                              <div className="group rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors duration-300 h-full overflow-hidden">
                                <div className="aspect-[4/3] relative bg-muted w-full">
                                  {project.images && project.images.length > 0 ? (
                                    <img
                                      src={project.images[0].url}
                                      alt={project.title}
                                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                      No image
                                    </div>
                                  )}
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
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No projects match the current filters.</p>
                          <Button variant="link" onClick={handleReset} className="mt-2">
                            Reset Filters
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                          <div key={index} className="border border-border rounded-lg overflow-hidden">
                            <Skeleton className="h-48 w-full" />
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
                  </TabsContent>
                  <TabsContent value="list" className="m-0">
                    {projects ? (
                      filteredProjects.length > 0 ? (
                        <div className="border rounded-md">
                          <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
                            <div className="col-span-5">Project</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Price</div>
                            <div className="col-span-3">Completion Date</div>
                          </div>
                          <div className="divide-y">
                            {filteredProjects.map((project) => (
                              <Link key={project._id} href={`/admin/projects/${project._id}`}>
                                <div className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/50 transition-colors group">
                                  <div className="col-span-5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded bg-muted/80 flex items-center justify-center shrink-0">
                                        {project.images && project.images.length > 0 ? (
                                          <img
                                            src={project.images[0].url}
                                            alt={project.title}
                                            className="w-10 h-10 rounded object-cover"
                                          />
                                        ) : (
                                          getStatusIcon(project.status)
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-1">
                                          {project.title}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                          {project.description}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-span-2">
                                    <Badge className={`capitalize ${getStatusBadgeColor(project.status)}`}>
                                      {project.status.replace("_", " ")}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2 font-medium">
                                    ${project.price.toLocaleString()}
                                  </div>
                                  <div className="col-span-3 text-muted-foreground text-sm">
                                    {project.completionDate ? new Date(project.completionDate).toLocaleDateString() : "Not set"}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">No projects match the current filters.</p>
                          <Button variant="link" onClick={handleReset} className="mt-2">
                            Reset Filters
                          </Button>
                        </div>
                      )
                    ) : (
                      <div className="border rounded-md">
                        <div className="grid grid-cols-12 gap-4 p-4 bg-muted">
                          <Skeleton className="col-span-5 h-5" />
                          <Skeleton className="col-span-2 h-5" />
                          <Skeleton className="col-span-2 h-5" />
                          <Skeleton className="col-span-3 h-5" />
                        </div>
                        <div className="divide-y">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center">
                              <div className="col-span-5">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="w-10 h-10 rounded" />
                                  <div className="space-y-1">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-40" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-span-2">
                                <Skeleton className="h-6 w-20 rounded-full" />
                              </div>
                              <div className="col-span-2">
                                <Skeleton className="h-5 w-16" />
                              </div>
                              <div className="col-span-3">
                                <Skeleton className="h-5 w-24" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}