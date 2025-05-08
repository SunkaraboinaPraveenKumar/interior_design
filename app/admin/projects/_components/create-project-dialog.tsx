"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CreateProjectDialog({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientImage, setClientImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const createProject = useMutation(api.projects.createProject);
  const generateUploadUrl = useMutation(api.projects.generateUploadUrl);

  const handleSubmit = async () => {
    setIsLoading(true); // Set loading state to true
    let clientImageStorageId: string | null = null;

    try {
      // Upload the client image to Convex storage
      if (clientImage) {
        const uploadUrl = await generateUploadUrl();
        const uploadResponse = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": clientImage.type },
          body: clientImage,
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload client image.");
        }

        const result = await uploadResponse.json();
        clientImageStorageId = result.storageId;
      }

      // Create the project
      const projectData = {
        title,
        description,
        price: parseFloat(price),
        status: "planning" as const,
        clientEmail,
        clientImageId: clientImageStorageId || undefined,
      };

      await createProject(projectData);
      toast.success("Project created successfully!");

      // Reset form fields
      setTitle("");
      setDescription("");
      setPrice("");
      setClientEmail("");
      setClientImage(null);
    } catch (error) {
      toast.error("Failed to create project.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            placeholder="Client Email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
          <Input
            type="file"
            onChange={(e) => setClientImage(e.target.files?.[0] || null)}
          />
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Project"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}