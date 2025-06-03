"use client";
import React, { useEffect } from "react";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";

export default function Analytics() {
  const [loaded, setLoaded] = React.useState(false);
  useEffect(() => {
    // Load Vercel Analytics after the component mounts
    setTimeout(() => {
      setLoaded(true);
    }, 3000);
  }, []);

  if (!loaded) return null;

  return <VercelAnalytics />;
}
