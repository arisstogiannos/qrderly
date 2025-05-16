"use client";

import type React from "react";
import FeedbackForm from "./FeedbackForm";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <FeedbackForm />
    </Suspense>
  );
}
