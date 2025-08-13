import React from 'react';
import { motion } from 'framer-motion';
import { Home, ChartLine, AudioLines } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- MenuBar Component ---

const menuItems = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Home",
    href: "/home",
    gradient: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "group-hover:text-blue-400",
  },
  {
    icon: <AudioLines className="h-5 w-5" />,
    label: "Assistant",
    href: "/healthmisinformation",
    gradient: "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "group-hover:text-orange-400",
  },
  {
    icon: <ChartLine className="h-5 w-5" />,
    label: "Extension",
    href: "/extension",
    gradient: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "group-hover:text-green-400",
  },
];

// Animation variants for different parts of the menu
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
};

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
};

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
};

const navGlowVariants = {
  initial: { opacity: 0 },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
};

function NavBar() {
  const navigate = useNavigate();

  // Handle navigation click
  const handleNavClick = (event, item) => {
    event.preventDefault();
    navigate(item.href);
  };

  return (
    <motion.nav
      className="flex items-center justify-center rounded-2xl bg-[#0000003e] backdrop-blur-lg border border-[#a4a4a434] shadow-[4px_3px_10px_rgba(255,255,255,0.2)] relative overflow-hidden"
      style={{ width: '25rem', height: '3rem' }}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        className="absolute -inset-2 rounded-3xl z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 50%, rgba(239,68,68,0.1) 100%)"
        }}
        variants={navGlowVariants}
      />
      <ul className="flex items-center gap-2 relative z-10">
        {menuItems.map((item) => (
          <motion.li key={item.label} className="relative">
            <motion.div
              className="block rounded-xl overflow-visible group relative"
              style={{ perspective: "600px" }}
              whileHover="hover"
              initial="initial"
            >
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none rounded-2xl"
                variants={glowVariants}
                style={{ background: item.gradient, opacity: 0 }}
              />
              
              {/* Front-facing menu item */}
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center gap-2 px-4 py-2 bg-transparent relative z-10 text-gray-200 group-hover:text-white transition-colors rounded-xl"
                variants={itemVariants}
                transition={sharedTransition}
                style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
              >
                <span className={`transition-colors duration-300 ${item.iconColor}`}>
                  {item.icon}
                </span>
                <span className="text-[1rem]">{item.label}</span>
              </motion.a>
              
              {/* Back-facing menu item for the 3D flip effect */}
              <motion.a
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-gray-200 group-hover:text-white transition-colors rounded-xl"
                variants={backVariants}
                transition={sharedTransition}
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "center top",
                  transform: "rotateX(90deg)"
                }}
              >
                <span className={`transition-colors duration-300 ${item.iconColor}`}>
                  {item.icon}
                </span>
                <span className="text-[1rem]">{item.label}</span>
              </motion.a>
            </motion.div>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  );
}

export default NavBar;