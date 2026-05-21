"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface VideoModalProps {
  isTrue: boolean;
  iframeSrc: string;
  handelClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isTrue,
  iframeSrc,
  handelClose,
}) => {
  return (
    <Dialog open={isTrue} onOpenChange={(open) => !open && handelClose()}>
      <DialogContent showCloseButton={false} className="sm:max-w-5xl p-0 bg-transparent border-none shadow-none">
        <div className="relative w-full">
          <button
            onClick={handelClose}
            className="absolute -top-12 right-0 z-50 flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <iframe
              className="w-full h-full bg-black"
              src={iframeSrc}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Player"
            ></iframe>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
