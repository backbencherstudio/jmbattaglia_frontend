import { Package, Globe, FileEdit, Layers } from "lucide-react";
import { MetricCardItem } from "@/types/metrics";

export const metricsData: MetricCardItem[] = [
  {
    id: "total-packages",
    title: "Total packages",
    value: 6,
    icon: Package,
    iconBgClass: "bg-orange-100/70 border border-orange-200/50",
    iconColorClass: "text-primary",
  },
  {
    id: "live-on-portal",
    title: "Live on portal",
    value: 5,
    icon: Globe,
    iconBgClass: "bg-blue-100/70 border border-blue-200/50",
    iconColorClass: "text-blue-600",
  },
  {
    id: "in-draft",
    title: "In draft",
    value: 1,
    icon: FileEdit,
    iconBgClass: "bg-purple-100/70 border border-purple-200/50",
    iconColorClass: "text-purple-600",
  },
  {
    id: "add-on-services",
    title: "Add on Services",
    value: 8,
    icon: Layers,
    iconBgClass: "bg-lime-100/70 border border-lime-200/50",
    iconColorClass: "text-lime-700",
  },
];
