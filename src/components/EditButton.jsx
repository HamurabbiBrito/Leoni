"use client";

import { Pencil } from "lucide-react";

const EditButton = ({ onClick, className = "", size = "md" }) => {
  // Tamaños predefinidos
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-14 w-14"
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const selectedSize = sizeClasses[size] || sizeClasses.md;
  const iconSize = iconSizes[size] || iconSizes.md;

  return (
    <button 
      onClick={onClick}
      className={`group flex items-center justify-center rounded-xl border-2 border-blue-600 bg-blue-400 hover:bg-blue-500 transition ${selectedSize} ${className}`}
    >
      <Pencil size={iconSize} className="text-white" />
    </button>
  );
};

export default EditButton;
