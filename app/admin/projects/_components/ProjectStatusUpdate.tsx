"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface Project {
  _id: string;
  clientImage?: string;
  title: string;
  description: string;
  price: number;
  status: "completed" | "in_progress" | "planning" | "delayed";
}

export default function ProjectStatusUpdate({ project }: { project: Project }) {
  const [status, setStatus] = useState(project.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const updateProjectStatus = useMutation(api.projects.updateProjectStatusOnly);
  
  const getStatusBadgeColor = (status:any) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-500";
      case "in_progress":
        return "bg-blue-500/10 text-blue-500";
      case "planning":
        return "bg-yellow-500/10 text-yellow-500";
      case "delayed":
        return "bg-red-500/10 text-red-500";
      default:
        return "";
    }
  };
  
  const handleStatusChange = async (newStatus:any) => {
    if (newStatus === status) return;
    
    setIsUpdating(true);
    try {
      await updateProjectStatus({
        projectId: project._id as Id<"projects">,
        status: newStatus,
      });
      
      setStatus(newStatus);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      toast.success(`Project status changed to ${newStatus.replace("_", " ")}.`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(`There was an error updating the project status.`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Project Status
          {showSuccess && (
            <span className="text-green-500 text-sm flex items-center">
              <CheckCircle className="h-4 w-4 mr-1" />
              Updated
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Update the current project status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-grow">
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getStatusBadgeColor(status)}`}>
                      {status.replace("_", " ")}
                    </Badge>
                    <span className="capitalize">
                      {status.replace("_", " ")}
                    </span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getStatusBadgeColor("planning")}`}>
                      Planning
                    </Badge>
                    <span>Planning</span>
                  </div>
                </SelectItem>
                <SelectItem value="in_progress">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getStatusBadgeColor("in_progress")}`}>
                      In Progress
                    </Badge>
                    <span>In Progress</span>
                  </div>
                </SelectItem>
                <SelectItem value="completed">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getStatusBadgeColor("completed")}`}>
                      Completed
                    </Badge>
                    <span>Completed</span>
                  </div>
                </SelectItem>
                <SelectItem value="delayed">
                  <div className="flex items-center">
                    <Badge className={`mr-2 ${getStatusBadgeColor("delayed")}`}>
                      Delayed
                    </Badge>
                    <span>Delayed</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}