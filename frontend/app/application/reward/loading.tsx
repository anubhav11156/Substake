import { LoaderIcon } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <div className="h-[calc(100vh-85px)] w-full flex items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
