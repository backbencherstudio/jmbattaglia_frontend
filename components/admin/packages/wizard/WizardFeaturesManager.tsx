"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2 } from "lucide-react";

interface WizardFeaturesManagerProps {
  features: string[];
  onChange: (features: string[]) => void;
}

export function WizardFeaturesManager({
  features,
  onChange,
}: WizardFeaturesManagerProps) {
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    onChange([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleDeleteFeature = (index: number) => {
    const updated = features.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(features[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...features];
    updated[index] = editingText.trim();
    onChange(updated);
    setEditingIndex(null);
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-main uppercase">
        What Features Included <span className="text-primary">*</span>
      </label>

      {/* Add Feature Input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddFeature();
            }
          }}
          placeholder="Package Features..."
          className="flex-1 px-4 py-2.5 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border"
        />
        <button
          type="button"
          onClick={handleAddFeature}
          className="p-3 bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors cursor-pointer"
          title="Add feature"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Features List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3.5 bg-white border border-hairline rounded-xl text-sm"
          >
            {editingIndex === index ? (
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onBlur={() => handleSaveEdit(index)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit(index);
                }}
                className="flex-1 px-2 py-1 border border-brand-border rounded text-sm text-main"
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                <CheckCircle2 className="w-4 h-4 text-accent-green shrink-0" />
                <span className="text-sub font-medium truncate">
                  {feature}
                </span>
              </div>
            )}

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(index)}
                className="text-muted hover:text-main transition-colors p-1 cursor-pointer"
                title="Edit feature"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteFeature(index)}
                className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                title="Delete feature"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
