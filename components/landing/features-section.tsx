"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Home, PaintBucket, PenTool, Ruler, Users } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <PenTool className="h-8 w-8 text-primary" />,
    title: "Personalized Design",
    description: "Tailored interiors that reflect your unique style and preferences, ensuring a perfect match for your lifestyle.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Expert Team",
    description: "Our skilled designers bring years of experience and creative vision to every project, large or small.",
  },
  {
    icon: <PaintBucket className="h-8 w-8 text-primary" />,
    title: "Quality Materials",
    description: "We source only the finest materials, ensuring durability, sustainability, and stunning aesthetics.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Timely Delivery",
    description: "We understand the importance of deadlines and work efficiently to complete projects on schedule.",
  },
  {
    icon: <Ruler className="h-8 w-8 text-primary" />,
    title: "Custom Solutions",
    description: "From space planning to custom furniture, we create bespoke solutions for challenging spaces.",
  },
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: "Complete Service",
    description: "End-to-end interior design services from initial concept to final installation and styling.",
  },
];

export function FeaturesSection() {
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

  return (
    <section className="py-16 md:py-24 bg-muted/50 p-3">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Why Choose Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            We combine creative vision with meticulous execution to deliver spaces that exceed expectations.
            Our approach is collaborative, transparent, and focused on bringing your vision to life.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full border-border/50 hover:border-primary/20 transition-colors duration-300">
                <CardHeader>
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}