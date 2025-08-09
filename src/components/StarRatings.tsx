// src/components/StarRating.tsx

import { Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Importando a função 'cn' para classes condicionais

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  className?: string;
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  size = 24, 
  className 
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className={cn("flex gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoverRating(star)}
          onMouseLeave={() => setHoverRating(0)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            style={{ width: size, height: size }}
            className={cn(
              "transition-colors",
              star <= (hoverRating || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground hover:text-yellow-400'
            )}
          />
        </button>
      ))}
    </div>
  );
};