"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RotateCcw } from "lucide-react";
import { clearAllData } from "@/lib/storage";

interface ResetButtonProps {
    onReset: () => void;
}

export function ResetButton({ onReset }: ResetButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleReset = () => {
        clearAllData();
        onReset();
        setIsOpen(false);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Data
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Reset All Data</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your budget, food items,
                        and meal history. This action cannot be undone. Are you
                        sure you want to start fresh?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleReset}>
                        Yes, Reset Everything
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
