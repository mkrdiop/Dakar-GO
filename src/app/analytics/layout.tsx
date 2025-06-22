"use client";

import AppLayout from "@/components/layout/AppLayout";
import { ReactNode } from "react";

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}