import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MessageCircle,
  Bot,
  Sparkles,
  X,
  Volume2,
} from "lucide-react";

/**
 * Central Talk Hub - The MAIN interaction point for HI AI App
 * Prominently displayed at bottom center - impossible to miss!
 */
export default function CentralTalkHub({
  onOpenAIMEE,
  onOpenVoice,
  hasNewNotification = false
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  // Pulse animation to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Central Hub Button - Now positioned at bottom-left */}
      <div className="fixed bottom-6 left-6 z-50" data-testid="central-talk-hub">
        <AnimatePresence>
          {isExpanded ? (
            // Expanded State - Show Options
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="flex items-center gap-3 bg-gradient-to-r from-[#0a1628] to-[#1a2744] rounded-full px-4 py-3 shadow-2xl border border-[#00ff88]/30"
            >
              {/* Voice Assistant */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onOpenVoice?.();
                  setIsExpanded(false);
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg"
                data-testid="voice-btn"
              >
                <Mic className="w-6 h-6 text-white" />
              </motion.button>

              {/* Central AIMEE Button - Largest */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onOpenAIMEE?.();
                  setIsExpanded(false);
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-2xl relative"
                data-testid="aimee-main-btn"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-500 animate-pulse opacity-50"></div>
                <Bot className="w-10 h-10 text-white relative z-10" />
                {hasNewNotification && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                )}
              </motion.button>

              {/* Text Chat */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  onOpenAIMEE?.();
                  setIsExpanded(false);
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg"
                data-testid="chat-btn"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.button>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                data-testid="close-hub-btn"
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>
          ) : (
            // Collapsed State - Main CTA Button
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="relative group"
              data-testid="talk-hub-trigger"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>

              {/* Main Button */}
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center shadow-2xl border-2 border-white/20">
                {/* Rotating Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/30 animate-spin" style={{ animationDuration: "10s" }}></div>

                {/* Inner Glow */}
                <div className={`absolute inset-2 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 ${pulseAnimation ? "opacity-30" : "opacity-50"} transition-opacity duration-1000`}></div>

                {/* Icon */}
                <div className="relative z-10 flex flex-col items-center">
                  <Sparkles className="w-8 h-8 text-white mb-0.5" />
                  <span className="text-[8px] font-bold text-white/90 tracking-wider">TALK</span>
                </div>

                {/* Notification Badge */}
                {hasNewNotification && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-bounce">!</span>
                )}
              </div>

              {/* Floating Label */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
              >
                <Badge className="bg-white/90 text-purple-700 font-bold shadow-lg px-3 py-1">
                  <Bot className="w-3 h-3 mr-1" />
                  ASK AIMEE
                </Badge>
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Side Quick Access Buttons (smaller, for advanced users) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onOpenVoice}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/80 to-rose-600/80 backdrop-blur flex items-center justify-center shadow-lg opacity-70 hover:opacity-100 transition-opacity"
          data-testid="voice-quick-btn"
        >
          <Volume2 className="w-5 h-5 text-white" />
        </motion.button>
      </div>
    </>
  );
}
