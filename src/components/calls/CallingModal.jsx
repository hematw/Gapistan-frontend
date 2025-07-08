// components/CallingModal.js
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { motion, AnimatePresence } from "framer-motion";

export default function CallingModal({ isOpen, targetName, onCancel }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed right-6 bottom-6 rounded-xl text-center shadow-lg z-50"
          initial={{ scale: 0.9, translateX: 60 }}
          animate={{ scale: 1, translateX: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          exit={{ scale: 0.9 }}
        >
          <Card className="p-6 border border-default-300">
            <CardHeader className="flex flex-col items-center gap-2">Calling to <span className="font-semibold text-xl">{targetName}...</span></CardHeader>

            <CardBody>
              <p className="text-gray-500 text-center mb-6">
                Waiting for them to answer
              </p>
              <Button
                // isIconOnly
                radius="full"
                onPress={onCancel}
                color="danger"
                size="lg"
                fullWidth
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
            </CardBody>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
