"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, Upload } from "lucide-react";
import { PackageFormData } from "@/types/wizard";
import { Button } from "@/components/ui/Button";

interface WizardStepMediaProps {
  formData: PackageFormData;
  updateFormData: (fields: Partial<PackageFormData>) => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function WizardStepMedia({
  formData,
  updateFormData,
  onNext,
  onSaveDraft,
}: WizardStepMediaProps) {
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    updateFormData({
      featuresIncluded: [...formData.featuresIncluded, newFeature.trim()],
    });
    setNewFeature("");
  };

  const handleDeleteFeature = (index: number) => {
    const updated = formData.featuresIncluded.filter((_, i) => i !== index);
    updateFormData({ featuresIncluded: updated });
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditingText(formData.featuresIncluded[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (!editingText.trim()) return;
    const updated = [...formData.featuresIncluded];
    updated[index] = editingText.trim();
    updateFormData({ featuresIncluded: updated });
    setEditingIndex(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-canvas border border-hairline rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <h3 className="font-trade font-bold text-xl text-main border-b border-hairline pb-4">
        Educational Content & Media
      </h3>

      <div className="space-y-6">
        {/* Why it matters */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-main uppercase">
            Why it matters <span className="text-primary">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.whyItMatters}
            onChange={(e) => updateFormData({ whyItMatters: e.target.value })}
            placeholder="A persuasive sentence shown in the expandable block on the portal — e.g. 'Buyers make a six-figure decision on a single walkthrough. A Signature inspection surfaces the repairs that change the negotiation.'"
            className="w-full px-4 py-3 bg-white border border-hairline rounded-xl text-sm font-medium text-main placeholder:text-muted focus:outline-none focus:border-brand-border resize-none"
          />
        </div>

        {/* What Features Included */}
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
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Features List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {formData.featuresIncluded.map((feature, index) => (
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
                    className="text-muted hover:text-main transition-colors p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(index)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Package Media Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-main uppercase">
            Package media <span className="text-primary">*</span>
          </label>
          <div className="border-2 border-dashed border-hairline rounded-2xl p-8 bg-white text-center space-y-3 hover:border-brand-border/60 transition-colors cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-primary-subtle text-primary flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="font-trade font-bold text-base text-main">
                Drag image or video here
              </p>
              <p className="text-xs text-muted mt-1">
                or click to browse • JPG, PNG, MP4 up to 50 MB
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-hairline">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          className="bg-white"
        >
          Save as draft
        </Button>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </form>
  );
}
