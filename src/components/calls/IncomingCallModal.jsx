import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { PhoneCall, PhoneOff } from "lucide-react";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function IncomingCallModal({
  isOpen,
  callerId,
  onAccept,
  onReject,
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      audioRef.current = new Audio("/reflection.mp3");
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-6 bottom-6  rounded-2xl shadow-lg  text-center z-50"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
        >
          <Card className="p-6 border border-default-300">
            <CardHeader className="flex flex-col items-center gap-2">
              <p className="text-lg text-default-500">Call from</p>
              <h3 className="text-xl font-semibold mb-6">{callerId}</h3>
            </CardHeader>
            <CardBody>
              <div className="flex justify-center gap-4">
                <Button
                  fullWidth
                  radius="full"
                  startContent={<PhoneCall />}
                  onPress={onAccept}
                  color="success"
                  size="lg"
                />
                <Button
                  fullWidth
                  radius="full"
                  onPress={onReject}
                  color="danger"
                  size="lg"
                  startContent={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <g transform="rotate(135 12 12)">
                        <path d="M21 15.46l-5.27-.61a.99.99 0 0 0-.9.29l-2.54 2.58a15.05 15.05 0 0 1-6.59-6.59l2.58-2.54a.99.99 0 0 0 .29-.9l-.61-5.27A1 1 0 0 0 6 2H3a1 1 0 0 0-1 1c0 10.49 8.51 19 19 19a1 1 0 0 0 1-1v-3a1 1 0 0 0-.99-1.04z" />
                      </g>
                    </svg>
                  }
                />
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
