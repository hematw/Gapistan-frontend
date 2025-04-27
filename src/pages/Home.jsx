import React from "react";
import {
  User,
  Lock,
  MessagesSquare,
  Globe,
  Smartphone,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-gray-700 to-black min-h-screen text-gray-800">
      <nav className="mx-auto px-6 py-4 container">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MessagesSquare className="mr-2 w-8 h-8 text-white" />
            <span className="font-bold text-white text-2xl">Gapistan</span>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button
              onPress={() => navigate("/chat")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all"
            >
              Features
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white transition-all">
              About
            </Button>
            <Button
              className="bg-white hover:bg-opacity-90 text-lime-600 transition-all"
              onPress={() => navigate("/signin")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <div className="mx-auto px-4 py-8 container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 pt-10 text-white text-center"
        >
          <h1 className="mb-6 font-bold text-6xl md:text-7xl">
            Welcome to Gapistan
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-xl md:text-2xl">
            Connect, Chat, and Collaborate in Real-Time with the most intuitive
            messaging platform
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4">
            <Button
              className="bg-white hover:bg-opacity-90 shadow-lg px-8 py-3 rounded-full font-medium text-lime-600 text-lg transition-all"
              onPress={() => navigate("/signin")}
            >
              Get Started
            </Button>
            <Button
              className="bg-transparent hover:bg-white/10 shadow-lg px-8 py-3 border-2 border-white rounded-full font-medium text-white text-lg transition-all"
              onPress={() => navigate("/signup")}
            >
              Sign Up
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="mb-12 font-bold text-white text-3xl md:text-4xl text-center">
            Why Choose Gapistan?
          </h2>
          <div className="gap-8 grid md:grid-cols-3 text-white">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 shadow-lg backdrop-blur-sm p-8 rounded-xl"
            >
              <MessagesSquare className="mb-4 w-12 h-12" />
              <h3 className="mb-3 font-semibold text-xl">Real-Time Chat</h3>
              <p className="text-white/90">
                Experience seamless communication with instant messaging
                capabilities that keep you connected
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 shadow-lg backdrop-blur-sm p-8 rounded-xl"
            >
              <User className="mb-4 w-12 h-12" />
              <h3 className="mb-3 font-semibold text-xl">
                Group Conversations
              </h3>
              <p className="text-white/90">
                Create and join group chats with friends and colleagues for
                better collaboration
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 shadow-lg backdrop-blur-sm p-8 rounded-xl"
            >
              <Lock className="mb-4 w-12 h-12" />
              <h3 className="mb-3 font-semibold text-xl">Secure Messaging</h3>
              <p className="text-white/90">
                Your conversations are protected with end-to-end encryption for
                maximum privacy
              </p>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="gap-8 grid md:grid-cols-3 mb-20"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl"
          >
            <Globe className="mb-3 w-8 h-8 text-white" />
            <h3 className="mb-2 font-semibold text-white text-lg">
              Global Access
            </h3>
            <p className="text-white/80">
              Connect with anyone, anywhere in the world with our global network
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl"
          >
            <Smartphone className="mb-3 w-8 h-8 text-white" />
            <h3 className="mb-2 font-semibold text-white text-lg">
              Mobile Friendly
            </h3>
            <p className="text-white/80">
              Take your conversations on the go with our responsive mobile
              design
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 backdrop-blur-sm p-6 border border-white/10 rounded-xl"
          >
            <Zap className="mb-3 w-8 h-8 text-white" />
            <h3 className="mb-2 font-semibold text-white text-lg">
              Lightning Fast
            </h3>
            <p className="text-white/80">
              Experience lightning-fast message delivery with minimal latency
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/10 backdrop-blur-md mb-16 p-10 rounded-2xl text-white text-center"
        >
          <h2 className="mb-4 font-bold text-3xl">Ready to get started?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl">
            Join thousands of users already enjoying the seamless communication
            experience on Gapistan
          </p>
          <Button
            className="bg-white hover:bg-opacity-90 shadow-lg px-8 py-3 rounded-full font-medium text-lime-600 text-lg"
            onPress={() => navigate("/signup")}
          >
            Create Your Account
          </Button>
        </motion.div>

        <footer className="py-6 text-white/70 text-center">
          <p>© 2023 Gapistan. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
