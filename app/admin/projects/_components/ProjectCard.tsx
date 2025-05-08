"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProjectDialog from "./EditProjectDialog";

interface Project {
  _id: string;
  clientImage?: string;
  clientEmail: string;
  title: string;
  description: string;
  price: number;
  status: "completed" | "in_progress" | "planning" | "delayed";
}

export default function ProjectCard({ project }: { project: Project }) {
  const getStatusBadgeColor = (status:any) => {
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
    <div className="relative group rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors duration-300 h-full overflow-hidden">
      {/* Edit button (appears on hover) */}
      <div className="absolute top-3 left-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <EditProjectDialog project={project}>
          <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
            <Edit className="h-4 w-4" />
          </Button>
        </EditProjectDialog>
      </div>
      
      <Link href={`/admin/projects/${project._id}`}>
        <div className="aspect-[4/3] relative bg-muted w-full">
          {project.clientImage ? (
            <img
              src={project.clientImage}
              alt={project.title}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <Badge
            className={`absolute top-3 right-3 capitalize ${getStatusBadgeColor(
              project.status
            )}`}
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
            <span className="font-medium">₹{project.price.toLocaleString()}</span>
            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Link>
    </div>
  );
}