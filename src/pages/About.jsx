import React from "react";
import { motion } from "framer-motion";
import { MessagesSquare, User, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-800 to-black min-h-screen text-white px-6 pt-6 pb-16">
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center pt-16"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About Gapistan</h1>
        <p className="text-lg md:text-xl text-white/80 mb-10">
          <strong>Gapistan</strong> is a modern, full-stack real-time chat
          platform built with performance, privacy, and clean UI in mind. It
          enables seamless 1-to-1 and group conversations with end-to-end
          encryption using AES and ECDH — meaning your messages stay private and
          secure even from us.
        </p>
        <p className="text-white/70 text-base max-w-3xl mx-auto">
          The platform also includes features like visual voice recording, live
          chat timelines, encrypted file sharing, and mobile-responsive design —
          all crafted to make real-time communication feel fast and effortless.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-3xl mx-auto text-center mt-20"
      >
        <h2 className="text-3xl font-bold mb-4">Meet the Developer</h2>
        <p className="text-white/80 text-lg mb-6">
          Gapistan was built from scratch by{" "}
          <span className="font-semibold text-white">Hematullah Waziri</span>, a
          passionate full-stack MERN developer and Computer Science student at
          Kabul Polytechnic University. With a deep interest in real-time
          systems, encryption, and user-centered design, Hemat has brought this
          ambitious project to life as his final year thesis.
        </p>
        <p className="text-white/70 text-base">
          Every feature in Gapistan is intentionally built — from the secure
          backend logic to the smooth frontend animations — with attention to
          both functionality and user experience. This isn’t just a project.
          It’s a message to the world: that clean tech, even from limited
          resources, can compete on a global level.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 mt-20">
        {[
          {
            icon: <MessagesSquare className="w-10 h-10 mb-4" />,
            title: "Fast Messaging",
            desc: "Instant message delivery with real-time Socket.IO integration and minimal latency.",
          },
          {
            icon: <User className="w-10 h-10 mb-4" />,
            title: "User Friendly",
            desc: "Sleek, responsive UI built with React, Tailwind, and Framer Motion for smooth transitions.",
          },
          {
            icon: <Lock className="w-10 h-10 mb-4" />,
            title: "Secure by Default",
            desc: "AES + ECDH based end-to-end encryption to ensure total message privacy.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 p-8 rounded-xl backdrop-blur-sm shadow-lg text-center"
          >
            <span className="m-auto flex justify-center items-center">{item.icon}</span>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-white/90">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
