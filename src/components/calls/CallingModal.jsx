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
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                📞 Calling {targetName}...
              </h2>
            </CardHeader>

            <CardBody>
              <p className="text-gray-500">Waiting for them to answer</p>
              <Button
                isIconOnly
                radius="full"
                onPress={onCancel}
                color="danger"
                size="lg"
                startContent={
                  <svg
                    className="w-[24px] h-[24px] text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="26"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.017 6.995c-2.306 0-4.534.408-6.215 1.507-1.737 1.135-2.788 2.944-2.797 5.451a4.8 4.8 0 0 0 .01.62c.015.193.047.512.138.763a2.557 2.557 0 0 0 2.579 1.677H7.31a2.685 2.685 0 0 0 2.685-2.684v-.645a.684.684 0 0 1 .684-.684h2.647a.686.686 0 0 1 .686.687v.645c0 .712.284 1.395.787 1.898.478.478 1.101.787 1.847.787h1.647a2.555 2.555 0 0 0 2.575-1.674c.09-.25.123-.57.137-.763.015-.2.022-.433.01-.617-.002-2.508-1.049-4.32-2.785-5.458-1.68-1.1-3.907-1.51-6.213-1.51Z" />
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
