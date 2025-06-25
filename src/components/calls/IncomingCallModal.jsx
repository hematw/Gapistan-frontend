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
          className="fixed bg-black bg-opacity-40 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="fixed right-2 bottom-2 h-80 rounded-2xl shadow-lg  text-center "
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <Card className="p-6 border border-default-300">
              <CardHeader>
                <div className="text-lg font-semibold">
                  📞 Call from
                  <p className="text-sky-600">{callerId}</p>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex justify-center gap-4">
                  <Button
                    isIconOnly
                    radius="full"
                    startContent={<PhoneCall />}
                    onPress={onAccept}
                    color="success"
                    size="lg"
                  />
                  <Button
                    isIconOnly
                    radius="full"
                    startContent={<PhoneOff />}
                    onPress={onReject}
                    color="danger"
                    size="lg"
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
