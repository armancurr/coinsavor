import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                    {new Date(plan.date).toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </h3>
                <Badge
                    variant="secondary"
                    className="bg-green-900 text-green-100"
                >
                    Total: ₹{plan.totalCost}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {mealTypes.map(({ key, label, icon }) => (
                    <Card key={key} className="bg-gray-800 border-gray-700">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2 text-white">
                                <span>{icon}</span>
                                {label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <p className="font-medium text-white">
                                    {plan.meals[key].name}
                                </p>
                                <p className="text-sm text-gray-400">
                                    ₹{plan.meals[key].price}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
