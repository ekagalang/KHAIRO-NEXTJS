import { LucideIcon } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <Card className="p-12">
      <div className="flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>

        {(action || secondaryAction) && (
          <div className="flex gap-3">
            {action && (
              <Button onClick={action.onClick} size="lg">
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                onClick={secondaryAction.onClick}
                size="lg"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
