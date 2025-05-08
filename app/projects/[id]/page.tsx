"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarIcon, 
  ClockIcon, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Trash2
} from "lucide-react";
import { formatDistance } from "date-fns";
import TaskCard from "./_components/TaskCard";
import AddTaskDialog from "./_components/AddTaskDialog";
import { Id } from "@/convex/_generated/dataModel"; // Import Id type

// Define the status types
type ProjectStatus = "planning" | "in_progress" | "completed" | "delayed";
type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";

const statusColors = {
  planning: "bg-blue-100 text-blue-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
};

const taskStatusColors = {
  pending: "bg-purple-100 text-purple-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
};

const statusIcons = {
  planning: <ClockIcon className="h-4 w-4 mr-1" />,
  in_progress: <Clock className="h-4 w-4 mr-1" />,
  completed: <CheckCircle2 className="h-4 w-4 mr-1" />,
  delayed: <AlertCircle className="h-4 w-4 mr-1" />,
};

function ProjectDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  
  // @ts-ignore
  const project = useQuery(api.projects.getProjectByIdOrEmail, { id });
  // @ts-ignore
  const tasks = useQuery(api.tasks.getTasksByProjectId, { projectId: id });

  if (!project) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setIsAddTaskDialogOpen(true)}
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Budget</div>
                <div className="text-2xl font-bold">₹{project.price.toLocaleString()}</div>
              </div>

              <div className="border p-4 rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <div className="flex items-center">
                  <Badge className={statusColors[project.status as ProjectStatus]}>
                    {statusIcons[project.status as ProjectStatus]}
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">Timeline</div>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Created {formatDistance(new Date(project.createdAt), new Date(), { addSuffix: true })}</span>
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Updated {formatDistance(new Date(project.updatedAt), new Date(), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              {project.clientImage ? (
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                  <img
                    src={project.clientImage}
                    alt="Client"
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="bg-slate-200 h-16 w-16 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-slate-500">
                    {project.clientEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="font-medium">{project.clientEmail}</div>
                <div className="text-sm text-muted-foreground">Client</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <div className="text-sm text-muted-foreground">
            {tasks?.length || 0} tasks
          </div>
        </div>

        {tasks?.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">No tasks yet</h3>
              <p className="text-muted-foreground mt-1">Add tasks to track project progress</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsAddTaskDialogOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Task
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks?.map((task) => (
              <TaskCard key={task._id} task={{ ...task, createdAt: task.createdAt.toString() }} projectId={id} />
            ))}
          </div>
        )}
      </div>

      <AddTaskDialog
        open={isAddTaskDialogOpen} 
        onOpenChange={setIsAddTaskDialogOpen} 
        projectId={id} 
      />
    </div>
  );
}

export default ProjectDetailPage;