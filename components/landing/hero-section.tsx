"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
          alt="Interior design hero image"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      
      <div className="relative z-10 container">
        <div className="flex flex-col items-center justify-center min-h-[85vh] text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Transform Your Space Into Something Extraordinary
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We create beautiful, functional interiors that reflect your personality and enhance your lifestyle. Experience the perfect blend of style and comfort.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/projects">
                <Button size="lg" className="font-medium">
                  View Our Projects
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 font-medium">
                  Get a Free Consultation
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}