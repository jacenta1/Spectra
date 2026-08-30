"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function SpectraLogo({ className, size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 transition-transform duration-200 hover:scale-105", className)}
    >
      <defs>
        <linearGradient id="spectra-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <linearGradient id="spectra-glow-filter" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Outer Rounded Container */}
      <rect
        x="8"
        y="8"
        width="104"
        height="104"
        rx="26"
        fill="#121316"
        stroke="url(#spectra-grad-primary)"
        strokeWidth="3"
      />

      {/* Geometric Prism Lines */}
      <path
        d="M 30 60 L 60 25 L 90 60 L 60 95 Z"
        fill="none"
        stroke="url(#spectra-grad-primary)"
        strokeWidth="2.5"
        opacity="0.4"
      />

      {/* Hexagonal Inner Lattice */}
      <polygon
        points="60,36 80,48 80,72 60,84 40,72 40,48"
        fill="url(#spectra-grad-primary)"
        opacity="0.18"
      />

      {/* Outer Dashed Orbit */}
      <circle
        cx="60"
        cy="60"
        r="28"
        fill="none"
        stroke="url(#spectra-glow-filter)"
        strokeWidth="1.8"
        strokeDasharray="6 4"
      />

      {/* Core Verification Node */}
      <circle cx="60" cy="60" r="11" fill="url(#spectra-grad-primary)" />
      <circle cx="60" cy="60" r="5" fill="#FFFFFF" />

      {/* 4 0G Cardinal Nodes (Chain, Storage, Compute, DA) */}
      <circle cx="60" cy="25" r="4" fill="#3B82F6" />
      <circle cx="90" cy="60" r="4" fill="#10B981" />
      <circle cx="60" cy="95" r="4" fill="#6366F1" />
      <circle cx="30" cy="60" r="4" fill="#38BDF8" />
    </svg>
  );
}
