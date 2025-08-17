
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Confetti from "./Confetti";
import { useState, useEffect } from "react";

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export default function WelcomePopup({ isOpen, onClose, username }: WelcomePopupProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(isOpen);
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md overflow-visible">
         {showConfetti && <Confetti />}
        <DialogHeader className="z-10 relative pt-12">
           <div className="flex justify-center items-center mb-4">
              <div className="text-6xl animate-bounce-slow">🎉</div>
           </div>
          <DialogTitle className="text-center text-2xl font-bold animate-fade-in-up">Congratulations, {username}!</DialogTitle>
          <DialogDescription className="text-center text-lg mt-2 animate-fade-in-up animation-delay-200">
            You've got <span className="font-bold text-primary">₹5,000</span> as a reward for signing up with Tradeverse!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center z-10 relative animate-fade-in-up animation-delay-400">
          <Button onClick={onClose} className="w-full sm:w-auto transition-transform hover:scale-105">Start Investing</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
