import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DailyPlan as DailyPlanType } from "@/lib/types";

interface DailyPlanProps {
    plan: DailyPlanType;
}

export function DailyPlan({ plan }: DailyPlanProps) {
    const mealTypes = [
        { key: "breakfast" as const, label: "Breakfast", icon: "🌅" },
        { key: "lunch" as const, label: "Lunch", icon: "☀️" },
        { key: "dinner" as const, label: "Dinner", icon: "🌙" },
    ];

    return (
        <div className="grid grid-cols-1 gap-4">
            {mealTypes.map(({ key, label, icon }) => (
                <Card
                    key={key}
                    className="transform bg-lime-50 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-700">
                            <span>{icon}</span>
                            {label}
                        </CardTitle>
                        <div className="font-bold text-lime-700">
                            ₹{plan.meals[key].price.toFixed(2)}
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 pt-0">
                        <p className="text-lg font-semibold text-slate-900">
                            {plan.meals[key].name}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}