"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function PortfolioSection() {
  const projects = useQuery(api.projects.getProjects);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
    <section className="py-16 md:py-24 p-5">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Our Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore some of our recent transformations and get inspired for your own space.
            Each project represents our commitment to excellence and attention to detail.
          </p>
        </div>

        {projects ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
            >
              {projects.slice(0, 6).map((project) => (
                <motion.div key={project._id} variants={item}>
                  <Link href={`/projects/${project._id}`} className="group block">
                    <div className="overflow-hidden rounded-lg border border-border/50 bg-card hover:border-primary/20 transition-colors duration-300">
                      <div className="relative">
                        <AspectRatio ratio={4/3}>
                          {project?.clientImage ? (
                            <img
                              src={project.clientImage}
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
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center">
              <Link href="/projects">
                <Button size="lg">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="border border-border rounded-lg overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}