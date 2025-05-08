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
import { useTheme } from "next-themes";
import DonutChartComponent from "./_components/DonutChartComponent";
import BarChartComponent from "./_components/BarChartComponent";

export default function AdminDashboardPage() {
  const stats = useQuery(api.projects.getProjectsStats, {}); // Fetch project stats
  const recentProjects = useQuery(api.projects.getRecentProjects, {}); // Fetch recent projects
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Format data for charts with highly contrasting colors for both themes
  const statusData = stats
    ? [
      {
        name: "Planning",
        value: stats.planning,
        color: isDark ? "#FFD700" : "#B45309" // Gold for dark / Brown for light
      },
      {
        name: "In Progress",
        value: stats.in_progress,
        color: isDark ? "#3B82F6" : "#1E40AF" // Bright blue for dark / Darker blue for light
      },
      {
        name: "Completed",
        value: stats.completed,
        color: isDark ? "#10B981" : "#047857" // Bright green for dark / Darker green for light
      },
      {
        name: "Delayed",
        value: stats.delayed,
        color: isDark ? "#EF4444" : "#B91C1C" // Bright red for dark / Darker red for light
      },
    ]
    : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "planning":
        return <Hourglass className="h-4 w-4 text-amber-400" />;
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

      {/* Project Stats */}
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
                <p className="text-xs text-muted-foreground">All time projects</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <RefreshCw className="h-4 w-4 text-blue-500" />
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
                <Check className="h-4 w-4 text-green-500" />
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
                <Pause className="h-4 w-4 text-red-500" />
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

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Status distribution across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            {stats ? (
              <BarChartComponent data={statusData} />
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
              <DonutChartComponent data={statusData} />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center">
                <Skeleton className="w-64 h-64 rounded-full" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>Latest projects added to the system</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProjects ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
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
                <div
                  key={i}
                  className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <Skeleton className="w-12 h-12 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
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