"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  instruction?: string;
  accept: string;
  onChange: (file: File | null) => void;
  error?: string;
  required?: boolean;
}

export function FileUpload({ label, instruction, accept, onChange, error, required }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full font-sans">
      <label className="block text-sm font-bold text-[#10233F] mb-1.5">
        {label} {required && <span className="text-[#DC2626] ml-0.5">*</span>}
      </label>
      
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-white transition-colors shadow-sm",
          error 
            ? "border-[#DC2626]/50 bg-[#FEF2F2]" 
            : "border-[#CBD5E1] hover:bg-[#F8FAFC] hover:border-[#2563EB]/50",
          selectedFile ? "border-[#2563EB] bg-[#EEF5FF]" : ""
        )}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          required={required && !selectedFile}
          aria-label={label}
        />
        
        {selectedFile ? (
          <div className="flex flex-col items-center text-center">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#16A085] mb-2" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-bold text-[#10233F] break-all px-4">{selectedFile.name}</p>
            <p className="text-xs font-bold text-[#64748B] mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            
            <button
              onClick={handleRemove}
              className="mt-3 text-xs font-bold text-[#DC2626] hover:text-white hover:bg-[#DC2626] px-4 py-2 rounded-lg transition-all relative z-10 border border-[#FECACA]"
            >
              Remove / Replace
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#2563EB]/50 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm font-bold text-[#2563EB] mb-1">
              Choose file <span className="text-[#64748B] font-medium">or drag & drop</span>
            </p>
            {instruction && <p className="text-xs font-medium text-[#64748B] mb-1">{instruction}</p>}
            <p className="text-xs font-bold text-[#64748B]/70">Accepted: {accept}</p>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs font-bold text-[#DC2626] mt-2">{error}</p>}
    </div>
  );
}
