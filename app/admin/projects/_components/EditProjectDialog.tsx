"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.preprocess(
    (a) => (a === "" ? undefined : Number(a)),
    z.number().positive()
  ),
  clientEmail: z.string().email({ message: "Invalid email address" }),
  status: z.enum(["planning", "in_progress", "completed", "delayed"]),
  clientImageId: z.string().optional()
});

interface Project {
  _id: string;
  title: string;
  description: string;
  price: number;
  clientEmail: string;
  clientImage?: string;
  clientImageId?: string;
  status: "planning" | "in_progress" | "completed" | "delayed";
}

export default function EditProjectDialog({ project, children }: { project: Project; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(project.clientImage || "");
  
  const updateProject = useMutation(api.projects.updateProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      price: project.price,
      clientEmail: project.clientEmail,
      status: project.status,
      clientImageId: project.clientImageId || "" // Provide an empty string as fallback
    },
  });

  const [newClientImageId, setNewClientImageId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadUrl = await generateUploadUrl();
      
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }
      
      const result = await uploadResponse.json();
      const storageId = result.storageId;
      
      // Set the new client image ID
      setNewClientImageId(storageId);
      
      // Create a temporary preview
      setImagePreview(URL.createObjectURL(file));
      
      return storageId;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("There was an error uploading your image.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: any) => {
    try {
      // Only include clientImageId if a new image was uploaded
      const updateData = {
        projectId: project._id,
        ...values,
      };
      
      // If a new image was uploaded, include the new ID
      if (newClientImageId) {
        updateData.clientImageId = newClientImageId;
      } else if (project.clientImageId) {
        // Keep the existing image ID if there was one
        updateData.clientImageId = project.clientImageId;
      } else {
        // If no image was ever uploaded, don't include the field
        delete updateData.clientImageId;
      }
      
      await updateProject(updateData);
      
      toast.success("Your project has been successfully updated.");
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("There was an error updating your project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project information below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the project"
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        min="0"
                        step="100"
                        placeholder="Enter project price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="delayed">Delayed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="clientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="client@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Project Image</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-2">
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-md overflow-hidden bg-muted">
                      <img 
                        src={imagePreview} 
                        alt="Project preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              </FormControl>
              <FormDescription>
                Upload a new image or keep the existing one.
              </FormDescription>
              <FormMessage />
            </FormItem>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading || !form.formState.isDirty}
              >
                {isUploading ? "Uploading..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}