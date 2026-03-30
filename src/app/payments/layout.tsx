"use client";

import AppLayout from "@/components/layout/AppLayout";
import { ReactNode } from "react";

export default function PaymentsLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}