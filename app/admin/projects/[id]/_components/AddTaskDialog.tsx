"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel"; // Import Id type for proper typing

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2, PlusIcon, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Define the task status type for better type checking
type TaskStatus = "pending" | "in_progress" | "completed" | "delayed";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export default function AddTaskDialog({ open, onOpenChange, projectId }: AddTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [delayReason, setDelayReason] = useState("");
  const [materials, setMaterials] = useState("");
  const [taskImage, setTaskImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const createTask = useMutation(api.tasks.createTask);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

interface TaskData {
    projectId: Id<"projects">; // Use Id type from Convex
    title: string;
    description: string;
    price: number;
    status: TaskStatus; // Use the TaskStatus type
    completionDate?: string;
    delayReason?: string;
    materials?: string[];
    taskImageUrl?: string;
}

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description || !price) {
        toast.error("Please fill in all required fields");
        return;
    }

    setIsLoading(true);
    let taskImageStorageId: string | null = null;

    try {
        // Upload the task image to Convex storage if one exists
        if (taskImage) {
            const uploadUrl: string = await generateUploadUrl();
            const uploadResponse: Response = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": taskImage.type },
                body: taskImage,
            });

            if (!uploadResponse.ok) {
                throw new Error("Failed to upload task image.");
            }

            const result: { storageId: string } = await uploadResponse.json();
            taskImageStorageId = result.storageId;
        }

        // Format materials as an array
        const materialsList: string[] = materials
            ? materials.split(",").map((item) => item.trim())
            : [];

        // Create the task
        const taskData: TaskData = {
            projectId: projectId as Id<"projects">, // Cast to Id<"projects">
            title,
            description,
            price: parseFloat(price),
            status,
            completionDate: completionDate ? format(completionDate, "yyyy-MM-dd") : undefined,
            delayReason: status === "delayed" ? delayReason : undefined,
            materials: materialsList.length > 0 ? materialsList : undefined,
            taskImageUrl: taskImageStorageId || undefined,
        };

        await createTask(taskData);
        toast.success("Task added successfully!");
        resetForm();
        onOpenChange(false);
    } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to add task.");
    } finally {
        setIsLoading(false);
    }
};

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setStatus("pending");
    setCompletionDate(null);
    setDelayReason("");
    setMaterials("");
    setTaskImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTaskImage(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Create a new task for this project. Fill in the task details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title<span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description<span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe the task in detail"
                  className="min-h-[100px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)<span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status<span className="text-red-500">*</span></Label>
                <Select 
                  defaultValue={status} 
                  onValueChange={(value) => setStatus(value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !completionDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {completionDate ? format(completionDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={completionDate || undefined}
                      onSelect={(date) => {
                        setCompletionDate(date || null);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {status === "delayed" && (
                <div className="space-y-2">
                  <Label htmlFor="delayReason">Reason for Delay</Label>
                  <Input
                    id="delayReason"
                    placeholder="Explain why the task is delayed"
                    value={delayReason}
                    onChange={(e) => setDelayReason(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="materials">Materials (comma separated)</Label>
              <Input
                id="materials"
                placeholder="Wood, Paint, Tools, etc."
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskImage">Task Image</Label>
              <div className="flex items-center gap-4">
                <Label
                  htmlFor="taskImage"
                  className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 w-full hover:border-gray-400 transition-colors"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <UploadCloud className="h-8 w-8 text-gray-400" />
                    <div className="text-sm text-gray-500">
                      {taskImage ? taskImage.name : "Click to upload an image"}
                    </div>
                  </div>
                  <Input
                    id="taskImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
                {taskImage && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTaskImage(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Task...
                </>
              ) : (
                <>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}