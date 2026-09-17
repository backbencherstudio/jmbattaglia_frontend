import React from "react";

export interface MetricCardItem {
  id: string;
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
}

export interface MetricCardProps {
  item: MetricCardItem;
}
