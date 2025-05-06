"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";
import { DonutChart } from "@/components/ui/donut-chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, Clock, Hourglass, Pause, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = useQuery(api.projects.getProjectStatsByStatus, {});
  const recentProjects = useQuery(api.projects.getRecentProjects, {});

  // Format data for charts
  const statusData = stats
    ? [
        { name: "Planning", value: stats.planning, color: "hsl(var(--chart-1))" },
        { name: "In Progress", value: stats.in_progress, color: "hsl(var(--chart-2))" },
        { name: "Completed", value: stats.completed, color: "hsl(var(--chart-3))" },
        { name: "Delayed", value: stats.delayed, color: "hsl(var(--chart-4))" },
      ]
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Hourglass className="h-4 w-4 text-yellow-500" />;
      case "in_progress":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <Check className="h-4 w-4 text-green-500" />;
      case "delayed":
        return <Pause className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All time projects
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.in_progress}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.in_progress > 0 
                    ? `${Math.round((stats.in_progress / stats.total) * 100)}% of total projects`
                    : "No projects in progress"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.completed > 0 
                    ? `${Math.round((stats.completed / stats.total) * 100)}% of total projects`
                    : "No completed projects"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delayed</CardTitle>
                <Pause className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.delayed}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.delayed > 0 
                    ? `${Math.round((stats.delayed / stats.total) * 100)}% of total projects`
                    : "No delayed projects"}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Status distribution across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            {stats ? (
              <BarChart 
                data={statusData} 
                xAxisKey="name" 
                yAxisKey="value"
                colors={statusData.map(item => item.color)}
              />
            ) : (
              <div className="w-full aspect-[4/3] flex items-center justify-center">
                <Skeleton className="w-full h-full" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
            <CardDescription>Distribution of project statuses</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            {stats ? (
              <DonutChart 
                data={statusData}
                category="value"
                index="name"
                valueFormatter={(value) => `${value} projects`}
                colors={statusData.map(item => item.color)}
                className="max-w-xs mx-auto h-full"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <Skeleton className="w-64 h-64 rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest projects added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProjects ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project._id} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                    {getStatusIcon(project.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <Link href={`/admin/projects/${project._id}`}>
                        <h4 className="font-medium truncate hover:text-primary transition-colors">
                          {project.title}
                        </h4>
                      </Link>
                      <span className="text-muted-foreground text-sm">
                        ${project.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {project.description}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{getProgressText(project.status)}</span>
                        <span>{getProgressPercentage(project.status)}%</span>
                      </div>
                      <Progress value={getProgressPercentage(project.status)} className="h-1.5" />
                    </div>
                  </div>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No projects yet. Create your first project!
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0">
                  <Skeleton className="w-12 h-12 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-2 w-full mt-3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function getProgressPercentage(status: string): number {
  switch (status) {
    case "planning":
      return 25;
    case "in_progress":
      return 50;
    case "delayed":
      return 65;
    case "completed":
      return 100;
    default:
      return 0;
  }
}

function getProgressText(status: string): string {
  switch (status) {
    case "planning":
      return "Planning Phase";
    case "in_progress":
      return "In Progress";
    case "delayed":
      return "Delayed";
    case "completed":
      return "Completed";
    default:
      return "Unknown";
  }
}