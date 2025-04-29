import { motion } from "framer-motion";
import React from "react";

/**
 * A collection of reusable automotive-themed animations for the application
 * Each specific page should have at least 10 unique animations
 */

export type AnimationProps = {
  className?: string;
  color?: string;
  scale?: number;
  opacity?: number;
  delay?: number;
};

// Base animations that can be reused across pages

// Car silhouette moving horizontally
export const CarAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-20 h-12 ${className}`}
    style={{ opacity }}
    initial={{ x: -100, opacity: 0 }}
    animate={{ 
      x: 100, 
      opacity,
      transition: { 
        duration: 10,
        repeat: Infinity,
        repeatType: "loop", 
        ease: "linear",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 640 512" 
      fill="currentColor" 
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M171.3 96H224v96H111.3l30.4-63.1A32 32 0 0 1 171.3 96zM272 192V96h81.2c12.1 0 23.2 6.8 28.6 17.7L416 192H272zm30.2-160H171.3c-28.6 0-54.7 16.3-67.1 42.1L33.5 192H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H48c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32V288c0-14.7-5.8-28.7-16.3-39.1L482.8 99.2c-15.2-15.1-36-23.4-57.5-23.2H302.2zM144 320a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm288 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z"/>
    </svg>
  </motion.div>
);

// Spinning wheel/tire
export const SpinningWheelAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-16 h-16 ${className}`}
    style={{ opacity }}
    animate={{ 
      rotate: 360,
      transition: { 
        duration: 5,
        repeat: Infinity,
        ease: "linear",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 512 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M464 96H384V48c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v48H48c-26.5 0-48 21.5-48 48v320c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48zM176 48h160v48H176V48zm160 416H176c0-79.5-64.5-144-144-144v-64c79.5 0 144-64.5 144-144h160c0 79.5 64.5 144 144 144v64c-79.5 0-144 64.5-144 144zm80-256c0 35.3-28.7 64-64 64s-64-28.7-64-64 28.7-64 64-64 64 28.7 64 64z"/>
    </svg>
  </motion.div>
);

// Gas/Fuel Pump
export const FuelPumpAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-14 h-14 ${className}`}
    style={{ opacity }}
    animate={{ 
      scale: [1, 1.1, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 512 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M32 64C32 28.7 60.7 0 96 0H256c35.3 0 64 28.7 64 64V256h8c48.6 0 88 39.4 88 88v32c0 13.3 10.7 24 24 24s24-10.7 24-24V222c-27.6-7.1-48-32.2-48-62c0-35.3 28.7-64 64-64c35.3 0 64 28.7 64 64c0 29.8-20.4 54.9-48 62V376c0 39.8-32.2 72-72 72s-72-32.2-72-72V344c0-22.1-17.9-40-40-40h-8V448c17.7 0 32 14.3 32 32v32H32V480c0-17.7 14.3-32 32-32V64zM96 64V224h64V64H96zm160 0H192V224h64V64z"/>
    </svg>
  </motion.div>
);

// Speedometer
export const SpeedometerAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-16 h-16 ${className}`}
    style={{ opacity }}
    initial={{ rotate: -120 }}
    animate={{ 
      rotate: ["-120deg", "120deg"],
      transition: { 
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 512 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM288 96a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM256 416c35.3 0 64-28.7 64-64c0-17.4-6.9-33.1-18.1-44.6L366 161.7c5.3-12.1-.2-26.3-12.3-31.6s-26.3 .2-31.6 12.3L257.9 288c-.6 0-1.3 0-1.9 0c-35.3 0-64 28.7-64 64s28.7 64 64 64zM176 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM96 288a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm352-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/>
    </svg>
  </motion.div>
);

// Engine
export const EngineAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-16 h-16 ${className}`}
    style={{ opacity }}
    animate={{ 
      scale: [1, 1.05, 1],
      transition: { 
        duration: 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 640 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M344 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V48H264c-13.3 0-24 10.7-24 24s10.7 24 24 24h32v46.4L183.3 210c-14.5 8.7-23.3 24.3-23.3 41.2V488c0 13.3 10.7 24 24 24s24-10.7 24-24V251.2c0-4.6 2.4-8.8 6.4-11.2L320 160.8l105.6 79.2c4 3 6.4 7.3 6.4 11.2V488c0 13.3 10.7 24 24 24s24-10.7 24-24V251.2c0-16.9-8.8-32.5-23.3-41.2L344 142.4V96h32c13.3 0 24-10.7 24-24s-10.7-24-24-24H344V24zM120.9 128l-13.6 32H69.1l10.3-32H55.1L43.7 160H16.7C7.5 160 0 167.5 0 176.7c0 2.5 .6 5 1.7 7.3L16.7 224h26.9l-13-40H55.1l22.4 69.3L8.2 400H64.2l36.7-60h11l-35.6 60h56.1l46.6-92.3L198.7 400h56.1l-39-120h-61.6l-39-120h56.1l15.9 49.3L232.9 128H120.9zm427.8 0H439.5l-39 120h61.6l39 120H444.9l-15.9-49.3L383.2 400h56.1l13.6-42h38.2l-13 42h26.5c8.6 0 15.8-6.7 16.3-15.3c.3-4.6-1.4-9.2-4.7-12.5l-35.3-35.3 21.1-65.5c2.3-7.1 .1-14.9-5.6-19.9s-13.7-6.1-20.5-2.9l-6.3 3L454.8 192h38.2l16-49.3L543.6 128h-59.8l-15-46.3c-3.7-11.5-16.1-18-27.6-14.3s-18 16.1-14.3 27.6l9 27.9h-33.7l-9-27.9c-3.7-11.5-16.1-18-27.6-14.3s-18 16.1-14.3 27.6l15 46.3h60.6zM494.2 192L466.7 280l47.4 47.4c1.2 1.2 2.9 1.9 4.6 1.9c3.2 0 5.8-2.6 5.8-5.8c0-1.3-.4-2.5-1.2-3.5l-21.4-28.5 18.4-57.1 4.3-13.5 30.2-16.1c1.3-.7 2-2.1 1.8-3.5c-.2-1.4-1.2-2.6-2.6-3.1l-17.2-7L494.2 192zm-365 0l36.7 60H155l-46.6-60h20.9z"/>
    </svg>
  </motion.div>
);

// Road with moving dashed lines
export const RoadAnimation = ({ className = "", opacity = 0.1 }: AnimationProps) => (
  <div className={`w-full h-4 bg-gray-600 relative overflow-hidden ${className}`} style={{ opacity }}>
    <motion.div 
      className="absolute top-1/2 h-0.5 w-1/4 bg-white"
      style={{ y: "-50%" }}
      animate={{
        x: ["-100%", "400%"],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }
      }}
    />
    <motion.div 
      className="absolute top-1/2 h-0.5 w-1/4 bg-white"
      style={{ y: "-50%" }}
      animate={{
        x: ["-100%", "400%"],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: "linear",
          delay: 1.5
        }
      }}
    />
  </div>
);

// Wrench tool - for service related animations
export const WrenchAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-14 h-14 ${className}`}
    style={{ opacity }}
    animate={{ 
      rotate: [-20, 20, -20],
      transition: { 
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 512 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M352 320c88.4 0 160-71.6 160-160c0-15.3-2.2-30.1-6.2-44.2c-3.1-10.8-16.4-13.2-24.3-5.3l-76.8 76.8c-3 3-7.1 4.7-11.3 4.7H336c-8.8 0-16-7.2-16-16V118.6c0-4.2 1.7-8.3 4.7-11.3l76.8-76.8c7.9-7.9 5.4-21.2-5.3-24.3C382.1 2.2 367.3 0 352 0C263.6 0 192 71.6 192 160c0 19.1 3.4 37.5 9.5 54.5L19.9 396.1C7.2 408.8 0 426.1 0 444.1C0 481.6 30.4 512 67.9 512c18 0 35.3-7.2 48-19.9L297.5 310.5c17 6.2 35.4 9.5 54.5 9.5zM80 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"/>
    </svg>
  </motion.div>
);

// Key fob animation
export const KeyFobAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-14 h-14 ${className}`}
    style={{ opacity }}
    animate={{ 
      scale: [1, 1.15, 1],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 512 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/>
    </svg>
  </motion.div>
);

// Traffic Lights
export const TrafficLightAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => {
  const [lightState, setLightState] = React.useState<'red' | 'yellow' | 'green'>('red');

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLightState(current => {
        if (current === 'red') return 'green';
        if (current === 'green') return 'yellow';
        return 'red';
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`w-10 h-24 bg-gray-800 rounded-md flex flex-col items-center justify-around py-2 ${className}`}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <div className={`w-6 h-6 rounded-full ${lightState === 'red' ? 'bg-red-500' : 'bg-red-900'}`}></div>
      <div className={`w-6 h-6 rounded-full ${lightState === 'yellow' ? 'bg-yellow-400' : 'bg-yellow-900'}`}></div>
      <div className={`w-6 h-6 rounded-full ${lightState === 'green' ? 'bg-green-500' : 'bg-green-900'}`}></div>
    </div>
  );
};

// Flashing emergency lights
export const EmergencyLightsAnimation = ({ className = "", scale = 1, opacity = 0.1 }: AnimationProps) => {
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFlash(current => !current);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className={`w-16 h-6 flex justify-between ${className}`}
      style={{ opacity, transform: `scale(${scale})` }}
    >
      <div className={`w-6 h-6 rounded-full ${flash ? 'bg-red-500' : 'bg-blue-500'}`}></div>
      <div className={`w-6 h-6 rounded-full ${!flash ? 'bg-red-500' : 'bg-blue-500'}`}></div>
    </div>
  );
};

// GPS/Map Pin animation
export const MapPinAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <motion.div 
    className={`w-12 h-12 ${className}`}
    style={{ opacity }}
    animate={{ 
      y: [0, -10, 0],
      transition: { 
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
  >
    <svg 
      viewBox="0 0 384 512" 
      fill="currentColor"
      style={{ transform: `scale(${scale})` }}
    >
      <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
    </svg>
  </motion.div>
);

// Pulse animation - can be used for sensors, signals, etc.
export const PulseAnimation = ({ className = "", color = "bg-blue-500", scale = 1, opacity = 0.1 }: AnimationProps) => (
  <div className={`relative ${className}`} style={{ opacity }}>
    <div className={`w-6 h-6 rounded-full ${color}`} style={{ transform: `scale(${scale})` }}></div>
    <motion.div 
      className={`absolute inset-0 rounded-full ${color} -z-10`}
      animate={{
        scale: [1, 3, 1],
        opacity: [0.8, 0, 0.8],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeOut"
        }
      }}
    ></motion.div>
  </div>
);

// Dashboard with moving needle
export const DashboardAnimation = ({ className = "", scale = 1, opacity = 0.1, delay = 0 }: AnimationProps) => (
  <div 
    className={`w-32 h-16 bg-gray-800 rounded-t-full relative overflow-hidden ${className}`}
    style={{ opacity, transform: `scale(${scale})` }}
  >
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full h-1/2 bg-transparent border-t-2 border-gray-600 rounded-t-full"></div>
      <motion.div 
        className="absolute bottom-0 left-1/2 w-1 h-12 bg-red-500 origin-bottom"
        style={{ transformOrigin: "bottom center" }}
        animate={{
          rotate: [-80, 80, -80],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay
          }
        }}
      ></motion.div>
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-700 rounded-full transform -translate-x-1/2"></div>
    </div>
  </div>
);

// Page-specific animation templates

// VehicleVault animations collection
export const vehicleVaultAnimations = [
  <CarAnimation key="vv-car" className="text-blue-600" delay={0.2} />,
  <SpinningWheelAnimation key="vv-wheel1" className="text-gray-800" delay={0.5} />,
  <SpinningWheelAnimation key="vv-wheel2" className="text-gray-800" delay={1.5} />,
  <KeyFobAnimation key="vv-key" className="text-indigo-600" />,
  <SpeedometerAnimation key="vv-speed" className="text-red-500" />,
  <EngineAnimation key="vv-engine" className="text-gray-700" />,
  <DashboardAnimation key="vv-dash" className="text-white" scale={0.8} />,
  <RoadAnimation key="vv-road" className="text-gray-700" />,
  <PulseAnimation key="vv-pulse" color="bg-green-500" />,
  <FuelPumpAnimation key="vv-fuel" className="text-amber-600" />
];

// BookService animations collection
export const bookServiceAnimations = [
  <WrenchAnimation key="bs-wrench1" className="text-gray-700" />,
  <WrenchAnimation key="bs-wrench2" className="text-blue-600" delay={0.7} />,
  <SpinningWheelAnimation key="bs-wheel" className="text-gray-800" />,
  <EngineAnimation key="bs-engine" className="text-red-500" />,
  <DashboardAnimation key="bs-dash" scale={0.7} className="text-white" />,
  <PulseAnimation key="bs-pulse" color="bg-green-500" />,
  <CarAnimation key="bs-car" className="text-blue-700" />,
  <SpeedometerAnimation key="bs-speedo" className="text-amber-600" delay={0.5} />,
  <MapPinAnimation key="bs-map" className="text-red-600" />,
  <RoadAnimation key="bs-road" className="w-full" />
];

// FastagEChallan animations collection
export const fastagAnimations = [
  <RoadAnimation key="ft-road" className="text-gray-700" />,
  <CarAnimation key="ft-car1" className="text-blue-600" />,
  <CarAnimation key="ft-car2" className="text-red-600" delay={1.2} />,
  <CarAnimation key="ft-car3" className="text-green-600" delay={2.4} />,
  <TrafficLightAnimation key="ft-traffic" />,
  <PulseAnimation key="ft-pulse" color="bg-blue-500" />,
  <DashboardAnimation key="ft-dash" className="text-white" />,
  <SpeedometerAnimation key="ft-speed" className="text-red-500" />,
  <MapPinAnimation key="ft-map" className="text-indigo-600" />,
  <KeyFobAnimation key="ft-key" className="text-amber-600" />
];

// EmergencyServices animations collection
export const emergencyAnimations = [
  <EmergencyLightsAnimation key="em-lights" />,
  <CarAnimation key="em-car" className="text-red-600" />,
  <PulseAnimation key="em-pulse" color="bg-red-500" />,
  <PulseAnimation key="em-pulse2" color="bg-blue-500" delay={0.7} />,
  <WrenchAnimation key="em-wrench" className="text-gray-700" />,
  <SpeedometerAnimation key="em-speed" className="text-red-500" />,
  <MapPinAnimation key="em-map" className="text-red-600" />,
  <RoadAnimation key="em-road" className="text-gray-700" />,
  <TrafficLightAnimation key="em-traffic" />,
  <KeyFobAnimation key="em-key" className="text-amber-600" />
];

// NearbyServices animations collection
export const nearbyAnimations = [
  <MapPinAnimation key="nb-map1" className="text-red-600" />,
  <MapPinAnimation key="nb-map2" className="text-blue-600" delay={0.5} />,
  <MapPinAnimation key="nb-map3" className="text-green-600" delay={1} />,
  <CarAnimation key="nb-car" className="text-blue-700" />,
  <WrenchAnimation key="nb-wrench" className="text-gray-700" />,
  <PulseAnimation key="nb-pulse" color="bg-blue-500" />,
  <RoadAnimation key="nb-road" className="text-gray-700" />,
  <SpeedometerAnimation key="nb-speed" className="text-amber-600" />,
  <FuelPumpAnimation key="nb-fuel" className="text-green-600" />,
  <TrafficLightAnimation key="nb-traffic" />
];

// Drishti animations collection
export const drishtiAnimations = [
  <PulseAnimation key="dr-pulse1" color="bg-blue-500" />,
  <PulseAnimation key="dr-pulse2" color="bg-green-500" delay={0.5} />,
  <PulseAnimation key="dr-pulse3" color="bg-red-500" delay={1} />,
  <DashboardAnimation key="dr-dash" className="text-white" />,
  <SpeedometerAnimation key="dr-speed" className="text-red-500" />,
  <EngineAnimation key="dr-engine" className="text-gray-700" />,
  <CarAnimation key="dr-car" className="text-blue-700" />,
  <SpinningWheelAnimation key="dr-wheel" className="text-gray-800" />,
  <KeyFobAnimation key="dr-key" className="text-amber-600" />,
  <RoadAnimation key="dr-road" className="text-gray-700" />
];

// TestBeforeBuy animations collection
export const testBeforeBuyAnimations = [
  <CarAnimation key="tb-car1" className="text-blue-600" />,
  <CarAnimation key="tb-car2" className="text-red-600" delay={1} />,
  <SpinningWheelAnimation key="tb-wheel" className="text-gray-800" />,
  <KeyFobAnimation key="tb-key" className="text-indigo-600" />,
  <WrenchAnimation key="tb-wrench" className="text-gray-700" />,
  <SpeedometerAnimation key="tb-speed" className="text-amber-600" />,
  <DashboardAnimation key="tb-dash" className="text-white" />,
  <RoadAnimation key="tb-road" className="text-gray-700" />,
  <EngineAnimation key="tb-engine" className="text-gray-700" />,
  <PulseAnimation key="tb-pulse" color="bg-green-500" />
];

// Marketplace animations collection
export const marketplaceAnimations = [
  <CarAnimation key="mp-car" className="text-blue-700" />,
  <SpinningWheelAnimation key="mp-wheel1" className="text-gray-800" />,
  <SpinningWheelAnimation key="mp-wheel2" className="text-gray-800" delay={0.5} />,
  <WrenchAnimation key="mp-wrench1" className="text-gray-700" />,
  <WrenchAnimation key="mp-wrench2" className="text-blue-600" delay={0.7} />,
  <EngineAnimation key="mp-engine" className="text-red-500" />,
  <KeyFobAnimation key="mp-key" className="text-amber-600" />,
  <SpeedometerAnimation key="mp-speed" className="text-red-500" />,
  <FuelPumpAnimation key="mp-fuel" className="text-green-600" />,
  <DashboardAnimation key="mp-dash" className="text-white" scale={0.8} />
];

// FindVerifyParts animations collection
export const verifyPartsAnimations = [
  <WrenchAnimation key="vp-wrench1" className="text-gray-700" />,
  <WrenchAnimation key="vp-wrench2" className="text-blue-600" delay={0.7} />,
  <EngineAnimation key="vp-engine1" className="text-red-500" />,
  <EngineAnimation key="vp-engine2" className="text-gray-700" delay={0.5} />,
  <SpinningWheelAnimation key="vp-wheel1" className="text-gray-800" />,
  <SpinningWheelAnimation key="vp-wheel2" className="text-gray-800" delay={0.5} />,
  <PulseAnimation key="vp-pulse1" color="bg-green-500" />,
  <PulseAnimation key="vp-pulse2" color="bg-red-500" delay={0.7} />,
  <CarAnimation key="vp-car" className="text-blue-700" />,
  <KeyFobAnimation key="vp-key" className="text-amber-600" />
];

// FixPointCard animations collection
export const fixpointAnimations = [
  <EmergencyLightsAnimation key="fp-lights" />,
  <CarAnimation key="fp-car" className="text-blue-700" />,
  <WrenchAnimation key="fp-wrench" className="text-gray-700" />,
  <MapPinAnimation key="fp-map" className="text-red-600" />,
  <KeyFobAnimation key="fp-key" className="text-amber-600" />,
  <SpeedometerAnimation key="fp-speed" className="text-red-500" />,
  <FuelPumpAnimation key="fp-fuel" className="text-green-600" />,
  <PulseAnimation key="fp-pulse" color="bg-blue-500" />,
  <RoadAnimation key="fp-road" className="text-gray-700" />,
  <TrafficLightAnimation key="fp-traffic" />
];

// LearnDrivingRto animations collection
export const learnDrivingAnimations = [
  <RoadAnimation key="ld-road" className="text-gray-700" />,
  <CarAnimation key="ld-car1" className="text-blue-600" />,
  <CarAnimation key="ld-car2" className="text-red-600" delay={1.2} />,
  <TrafficLightAnimation key="ld-traffic" />,
  <MapPinAnimation key="ld-map" className="text-red-600" />,
  <SpeedometerAnimation key="ld-speed" className="text-amber-600" />,
  <KeyFobAnimation key="ld-key" className="text-indigo-600" />,
  <DashboardAnimation key="ld-dash" className="text-white" />,
  <PulseAnimation key="ld-pulse" color="bg-green-500" />,
  <SpinningWheelAnimation key="ld-wheel" className="text-gray-800" />
];

// Educational animations collection
export const educationalAnimations = [
  <EngineAnimation key="ed-engine" className="text-gray-700" />,
  <SpeedometerAnimation key="ed-speed" className="text-red-500" />,
  <SpinningWheelAnimation key="ed-wheel1" className="text-gray-800" />,
  <SpinningWheelAnimation key="ed-wheel2" className="text-gray-800" delay={0.5} />,
  <FuelPumpAnimation key="ed-fuel" className="text-green-600" />,
  <WrenchAnimation key="ed-wrench" className="text-gray-700" />,
  <CarAnimation key="ed-car" className="text-blue-700" />,
  <DashboardAnimation key="ed-dash" className="text-white" />,
  <KeyFobAnimation key="ed-key" className="text-amber-600" />,
  <RoadAnimation key="ed-road" className="text-gray-700" />
];

// Arena animations collection
export const arenaAnimations = [
  <CarAnimation key="ar-car1" className="text-blue-600" />,
  <CarAnimation key="ar-car2" className="text-red-600" delay={1} />,
  <CarAnimation key="ar-car3" className="text-green-600" delay={2} />,
  <SpinningWheelAnimation key="ar-wheel1" className="text-gray-800" />,
  <SpinningWheelAnimation key="ar-wheel2" className="text-gray-800" delay={0.5} />,
  <KeyFobAnimation key="ar-key" className="text-indigo-600" />,
  <EngineAnimation key="ar-engine" className="text-gray-700" />,
  <WrenchAnimation key="ar-wrench" className="text-gray-700" />,
  <SpeedometerAnimation key="ar-speed" className="text-amber-600" />,
  <FuelPumpAnimation key="ar-fuel" className="text-green-600" />
];

// CommercialFleet animations collection
export const commercialFleetAnimations = [
  <CarAnimation key="cf-car1" className="text-blue-600" />,
  <CarAnimation key="cf-car2" className="text-red-600" delay={0.8} />,
  <CarAnimation key="cf-car3" className="text-green-600" delay={1.6} />,
  <CarAnimation key="cf-car4" className="text-amber-600" delay={2.4} />,
  <MapPinAnimation key="cf-map" className="text-red-600" />,
  <RoadAnimation key="cf-road" className="text-gray-700" />,
  <FuelPumpAnimation key="cf-fuel" className="text-green-600" />,
  <SpeedometerAnimation key="cf-speed" className="text-amber-600" />,
  <PulseAnimation key="cf-pulse" color="bg-blue-500" />,
  <DashboardAnimation key="cf-dash" className="text-white" />
];

// AnimationsContainer - A container for multiple animations
interface AnimationContainerProps {
  animations: React.ReactNode[];
  className?: string;
}

export const AnimationsContainer: React.FC<AnimationContainerProps> = ({ animations, className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {animations.map((animation, index) => {
        // Calculate random positions for each animation
        const top = Math.floor(Math.random() * 80) + 10;
        const left = Math.floor(Math.random() * 80) + 10;
        
        return (
          <div 
            key={index} 
            className="absolute" 
            style={{ 
              top: `${top}%`, 
              left: `${left}%`,
              transform: `translate(-50%, -50%)`
            }}
          >
            {animation}
          </div>
        );
      })}
    </div>
  );
};