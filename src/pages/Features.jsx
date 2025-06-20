import React from "react";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Zap,
  Mic,
  Group,
  ImagePlus,
  Shield,
  MessagesSquare,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen text-white px-6 pt-6 pb-16">
      <nav className="mx-auto px-6 py-4 container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessagesSquare className="mr-2 w-8 h-8 text-white" />
            <span className="font-bold text-white text-2xl">Gapistan</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Link
              to="/"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
            >
              Features
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
            >
              About
            </Link>
          </div>
        </div>
      </nav>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center pt-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Features</h1>
        <p className="text-lg md:text-xl text-white/80 mb-10">
          Gapistan is not just a chat app — it's a secure, full-featured
          communication experience designed with real-time speed, privacy, and
          simplicity in mind.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mt-12">
        {[
          {
            icon: <Zap className="w-10 h-10 mb-4" />,
            title: "Lightning Fast",
            desc: "Messages are delivered instantly using Socket.IO — no lag, no delay.",
          },
          {
            icon: <Shield className="w-10 h-10 mb-4" />,
            title: "End-to-End Encryption",
            desc: "Built using AES + ECDH for 1-to-1 chats and secure RSA for group messaging.",
          },
          {
            icon: <Mic className="w-10 h-10 mb-4" />,
            title: "Voice Messages",
            desc: "Record, visualize, and send voice messages with animated waveform UX.",
          },
          {
            icon: <ImagePlus className="w-10 h-10 mb-4" />,
            title: "File Sharing",
            desc: "Send images, documents, and media with optional encryption for extra privacy.",
          },
          {
            icon: <Group className="w-10 h-10 mb-4" />,
            title: "Group Chat",
            desc: "Create group chats with secure key distribution and AES-encrypted messages.",
          },
          {
            icon: <Smartphone className="w-10 h-10 mb-4" />,
            title: "Mobile Responsive",
            desc: "Designed with Tailwind to look and feel perfect across all screen sizes.",
          },
          {
            icon: <Globe className="w-10 h-10 mb-4" />,
            title: "Global Access",
            desc: "Connect with users anywhere in the world — no borders, just smooth connection.",
          },
          {
            icon: <MessagesSquare className="w-10 h-10 mb-4" />,
            title: "Live Chat Timeline",
            desc: "Chat messages update in real-time using React Query + Socket events.",
          },
          {
            icon: <User className="w-10 h-10 mb-4" />,
            title: "Easy UX",
            desc: "Clean design and simple flows for both guests and authenticated users.",
          },
        ].map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-8 rounded-xl backdrop-blur-sm shadow-lg text-center grid"
          >
            <span className="m-auto">{feature.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-white/90">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Features;
