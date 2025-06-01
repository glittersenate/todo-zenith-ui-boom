
import { useState, useEffect } from "react";

interface PointsAnimationProps {
  points: number;
  trigger: boolean;
  onComplete: () => void;
}

const PointsAnimation = ({ points, trigger, onComplete }: PointsAnimationProps) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        onComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
      <div className="text-6xl font-bold text-yellow-400 animate-bounce">
        +{points} XP! 
        <div className="text-2xl">🎉</div>
      </div>
    </div>
  );
};

export default PointsAnimation;
