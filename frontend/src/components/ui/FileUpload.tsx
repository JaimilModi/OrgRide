"use client";

import React, { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  instruction: string;
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
    <div className="w-full">
      <label className="block text-sm font-semibold text-primary-900 mb-1.5">
        {label} {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      
      <div 
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-neutral-50 transition-colors ${
          error ? "border-red-300 bg-red-50" : "border-neutral-300 hover:bg-neutral-100 hover:border-primary-400"
        } ${selectedFile ? "border-primary-400 bg-primary-50/30" : ""}`}
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
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-600 mb-2" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-neutral-800 break-all px-4">{selectedFile.name}</p>
            <p className="text-xs text-neutral-500 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            
            <button
              onClick={handleRemove}
              className="mt-3 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors relative z-10"
            >
              Remove / Replace
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center pointer-events-none">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-neutral-400 mb-2" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm font-semibold text-primary-700 mb-1">
              Choose file <span className="text-neutral-500 font-normal">or drag & drop</span>
            </p>
            <p className="text-xs text-neutral-500 mb-1">{instruction}</p>
            <p className="text-xs text-neutral-400">Accepted: {accept}</p>
          </div>
        )}
      </div>
      
      {error && <p className="text-xs text-red-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}
