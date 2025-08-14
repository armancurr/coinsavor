import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SunHorizon, Sun, Moon } from "@phosphor-icons/react";
import type { DailyPlan as DailyPlanType } from "@/lib/types";

interface DailyPlanProps {
  plan: DailyPlanType;
}

export function DailyPlan({ plan }: DailyPlanProps) {
  const mealConfigs = {
    breakfast: {
      label: "Breakfast",
      Icon: SunHorizon,
      iconClasses: "bg-amber-100 text-amber-700",
    },
    lunch: {
      label: "Lunch",
      Icon: Sun,
      iconClasses: "bg-sky-100 text-sky-700",
    },
    dinner: {
      label: "Dinner",
      Icon: Moon,
      iconClasses: "bg-indigo-100 text-indigo-700",
    },
  } as const;

  return (
    <div className="grid grid-cols-1 gap-4">
      {(Object.keys(mealConfigs) as Array<keyof typeof mealConfigs>).map(
        (key) => {
          const { label, Icon, iconClasses } = mealConfigs[key];
          const meal = plan.meals[key];
          const descriptionText = meal.description
            ? meal.description.length > 90
              ? meal.description.slice(0, 90).trim() + "…"
              : meal.description
            : "";
          return (
            <Card key={key} className="bg-white border border-lime-600">
              <div
                className={`relative h-36 w-full overflow-hidden rounded-t-xl ${iconClasses}`}
              >
                <div className="absolute inset-0 grid place-items-center">
                  <Icon className="h-12 w-12 opacity-90" />
                </div>
              </div>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex flex-col">
                    <Badge variant="outline" className="w-fit">
                      {label}
                    </Badge>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {meal.name}
                    </p>
                  </div>
                  <div className="text-right text-lg font-bold text-lime-700">
                    ₹{meal.price.toFixed(2)}
                  </div>
                </div>
                {descriptionText && (
                  <p className="text-sm text-slate-600">{descriptionText}</p>
                )}
              </CardContent>
            </Card>
          );
        },
      )}
    </div>
  );
}
