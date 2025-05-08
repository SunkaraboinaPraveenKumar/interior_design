"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil, MoreVertical, Clock, CheckCircle2, AlertCircle, Calendar, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format, isValid, parseISO } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@/convex/_generated/dataModel";
import EditTaskDialog from "./EditTaskDialog";

const statusIcons = {
  pending: <Clock className="h-4 w-4 mr-1" />,
  in_progress: <Clock className="h-4 w-4 mr-1" />,
  completed: <CheckCircle2 className="h-4 w-4 mr-1" />,
  delayed: <AlertCircle className="h-4 w-4 mr-1" />,
};

const statusColors = {
  pending: "bg-purple-100 text-purple-800",
  in_progress: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  delayed: "bg-red-100 text-red-800",
};

interface TaskCardProps {
  task: {
    _id: Id<"tasks">;
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed" | "delayed";
    price: number;
    taskImageUrl?: string;
    completionDate?: string;
    delayReason?: string;
    materials?: string[];
    createdAt: string;
  };
  projectId: string;
}

export default function TaskCard({ task, projectId }: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const deleteTask = useMutation(api.tasks.deleteTask);
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  const handleDeleteTask = async () => {
    try {
      await deleteTask({ taskId: task._id });
      toast.success("Task deleted successfully!");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    try {
      await updateTaskStatus({
        taskId: task._id,
        status: newStatus
      });
      toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  // Helper function to safely format date
  const formatDate = (dateString: string) => {
    try {
      // Try parsing as ISO string first
      const date = parseISO(dateString);
      
      // Check if the date is valid
      if (isValid(date)) {
        return format(date, "MMM d, yyyy");
      }
      
      // If not valid as ISO, try as timestamp
      const timestamp = Number(dateString);
      if (!isNaN(timestamp)) {
        const dateFromTimestamp = new Date(timestamp);
        if (isValid(dateFromTimestamp)) {
          return format(dateFromTimestamp, "MMM d, yyyy");
        }
      }
      
      return "Invalid date";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Parse completion date for the edit dialog
  const parseCompletionDate = () => {
    if (!task.completionDate) return null;
    
    try {
      const date = parseISO(task.completionDate);
      if (isValid(date)) return date;
      
      // Try parsing as timestamp
      const timestamp = Number(task.completionDate);
      if (!isNaN(timestamp)) {
        const dateFromTimestamp = new Date(timestamp);
        if (isValid(dateFromTimestamp)) {
          return dateFromTimestamp;
        }
      }
      
      return null;
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Task
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                  <Clock className="mr-2 h-4 w-4" /> Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                  <Clock className="mr-2 h-4 w-4" /> In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange("delayed")}>
                  <AlertCircle className="mr-2 h-4 w-4" /> Delayed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center mt-2">
            <Badge className={statusColors[task.status]}>
              {statusIcons[task.status]}
              {task.status.replace("_", " ")}
            </Badge>
            <div className="text-sm ml-2">
              ₹{task.price.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm mb-4">{task.description}</p>

          {task.taskImageUrl && (
            <div className="mb-4">
              <img
                src={task.taskImageUrl}
                alt={task.title}
                className="w-full h-32 object-fit rounded-md"
              />
            </div>
          )}

          <div className="mt-4 space-y-2">
            {task.completionDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Due: {formatDate(task.completionDate)}</span>
              </div>
            )}

            {task.delayReason && (
              <div className="text-sm text-red-600">
                <span>Delay reason: {task.delayReason}</span>
              </div>
            )}

            {task.materials && task.materials.length > 0 && (
              <div className="flex flex-col text-sm">
                <div className="flex items-center mb-1">
                  <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Materials:</span>
                </div>
                <div className="ml-6 flex flex-wrap gap-1">
                  {task.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4 text-xs text-muted-foreground">
          {task.createdAt ? (
            <>Created {formatDate(task.createdAt)}</>
          ) : (
            <>Created date not available</>
          )}
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the task "{task.title}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      {isEditDialogOpen && (
        <EditTaskDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          projectId={projectId}
          taskId={task._id}
          initialData={{
            title: task.title,
            description: task.description,
            price: task.price.toString(),
            status: task.status,
            completionDate: parseCompletionDate(),
            delayReason: task.delayReason || "",
            materials: task.materials ? task.materials.join(", ") : "",
            taskImageUrl: task.taskImageUrl
          }}
        />
      )}
    </>
  );
}