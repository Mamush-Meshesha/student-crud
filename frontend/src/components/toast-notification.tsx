"use client";

import React, { useEffect } from "react";
import { toast } from "sonner"; 
import { RootState } from "@/stores";
import { useSelector } from "react-redux";

export function ToastNotifications() {
  const { error, loading } = useSelector((state: RootState) => state.students);
  const prevLoadingRef = React.useRef(loading);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        description: "Please try again later.",
      });
    }
  }, [error]); 

  useEffect(() => {
    if (prevLoadingRef.current && !loading) {
      toast.success("completed successfully");
    }
    prevLoadingRef.current = loading;
  }, [loading]);
  
  return null;
}