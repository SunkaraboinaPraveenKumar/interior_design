"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg mb-8">
            Get in touch with our design team to schedule a free consultation. We'll discuss your vision, needs, and how we can create a space that's uniquely yours.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="font-medium">
                Get a Free Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <Button size="lg" variant="secondary" className="font-medium">
              <PhoneCall className="mr-2 h-4 w-4" />
              Call (555) 123-4567
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}