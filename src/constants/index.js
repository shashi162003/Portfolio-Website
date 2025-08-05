import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  pawzz,
  geeksforgeeks,
  prodigy,
  techfest,
  uber,
  github,
  vite,
  bhabha,
  expressjs,
  jwt,
  sql,
  postman,
  vercel,
  render,
  chatty,
  uptime,
  chat,
  algo,
  url,
  inv
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "blog",
    title: "Blog",
    url: "/blog",
    isExternal: true,
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
    link: "https://github.com/shashi162003",
  },
  {
    title: "Data Structures & Algorithms",
    icon: mobile,
    link: "https://takeuforward.org/plus/profile/shashi16",
  },
  {
    title: "Backend Developer",
    icon: backend,
    link: "https://github.com/shashi162003",
  },
  {
    title: "Electronics",
    icon: creator,
    link: "https://www.linkedin.com/in/shashi-kumar-gupta-36668b239",
  },
];

export const technologies = [
  // Frontend
  { name: "React", icon: reactjs },
  { name: "JavaScript", icon: javascript },
  { name: "TypeScript", icon: typescript },
  { name: "HTML5", icon: html },
  { name: "CSS3", icon: css },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Vite", icon: vite },

  // Backend & Databases
  { name: "Node.js", icon: nodejs },
  { name: "Express.js", icon: expressjs },
  { name: "MongoDB", icon: mongodb },
  { name: "MySQL", icon: sql },
  { name: "JWT", icon: jwt },

  // Tools & Platforms
  { name: "Git", icon: git },
  { name: "GitHub", icon: github },
  { name: "Postman", icon: postman },
  { name: "Vercel", icon: vercel },
  { name: "Render", icon: render },
  { name: "Redux", icon: redux },
];

const experiences = [
  {
    title: "Project Trainee",
    company_name: "Bhabha Atomic Research Center",
    icon: bhabha,
    iconBg: "#383E56",
    date: "May 2025 - August 2025",
    points: [
      "Worked on Xilinx ZCU216 RFSoC board utilizing the QICK (Quantum Instrumentation Control Kit) library for high-speed signal generation and acquisition in quantum computing research environments.",
      "Developed and tested control sequences in Python, enabling precise waveform generation and hardware interfacing.",
      "Collaborated on integrating FPGA-level control with Python APIs for streamlined experimentation.",
      "Implemented real-time signal processing algorithms for quantum control applications.",
    ],
  },
  {
    title: "Campus Ambassador",
    company_name: "GeeksforGeeks",
    icon: geeksforgeeks,
    iconBg: "#383E56",
    date: "July 2024 - July 2025",
    points: [
      "Promoted GeeksforGeeks' initiatives by organizing workshops, webinars, and coding events, resulting in increased platform engagement among peers.",
      "Facilitated student participation in various GFG contests and programs, enhancing coding culture within the campus.",
      "Acted as a liaison between GeeksforGeeks and the college, addressing queries and sharing feedback to improve user experience.",
      "Developed communication and leadership skills by interacting with diverse groups and representing GFG at campus-level events.",
    ],
  },
  {
    title: "Campus Ambassador",
    company_name: "Techfest IIT Bombay",
    icon: techfest,
    iconBg: "#E6DEDD",
    date: "June 2024 - Jan 2025",
    points: [
      "Promoted Techfest IIT Bombay events and initiatives on campus, driving student registrations and participation in competitions, workshops, and webinars.",
      "Collaborated with the Techfest team to disseminate information and ensure seamless communication between the organizing committee and participants.",
      "Enhanced leadership and organizational skills by coordinating with students and managing responsibilities to represent Techfest effectively.",
      "Achieved participation targets by leveraging social media and word-of-mouth strategies to maximize outreach efforts.",
    ],
  },
  {
    title: "Web Developer Intern",
    company_name: "Prodigy Infotech",
    icon: prodigy,
    iconBg: "#383E56",
    date: "June 2024 - July 2024",
    points: [
      "Responsive Landing Pages: Designed visually appealing and user-friendly landing pages optimized for multiple devices, ensuring cross-browser compatibility and a seamless user experience.",
      "Stopwatch Application: Developed a functional and interactive stopwatch app with accurate timing mechanisms and an intuitive interface, using core JavaScript for functionality.",
      "Tic-Tac-Toe Game: Built an engaging tic-tac-toe game with interactive gameplay features, incorporating dynamic rendering and state management to enhance usability.",
      "Personalized Portfolio Website: Created a personal portfolio website showcasing professional projects and achievements, featuring clean design and smooth navigation using modern web development practices.",
      "Real-Time Weather App: Developed a weather application leveraging Open Weather API for real-time data, integrating responsive design and interactive elements for a user-friendly experience.",
    ],
  },
  {
    title: "Fundraiser Intern",
    company_name: "Pawzz Welfare Organization",
    icon: pawzz,
    iconBg: "#E6DEDD",
    date: "June 2024 - July 2024",
    points: [
      "Worked as a fundraiser intern at Pawzz Welfare Organization, successfully raising funds to support initiatives aiding approximately 1000 stray dogs.",
      "Contributed to animal welfare by assisting in resource generation and awareness campaigns.",
    ],
  },
];

const projects = [
  {
    name: "Inventory Management System (Offline Support)",
    description:
      "InvTrack is a modern full-stack inventory management system built with the MERN stack and OpenAI integration. It offers intelligent insights, automated alerts, a responsive UI, and a seamless offline-first experience to streamline stock control.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "openai api",
        color: "yellow-text-gradient"
      },
      {
        name: "dexie.js",
        color: "red-orange-gradient"
      }
    ],
    image: inv,
    source_code_link: "https://github.com/shashi162003/Flipr-Hackathon-2025---Inventory-Management",
    live_demo_link: "https://inventory-management-topaz-tau.vercel.app/",
  },
  {
    name: "Uber Clone",
    description:
      "A full-stack Uber clone application built with React, Node.js, and MongoDB. Features include real-time ride tracking, user authentication, and payment integration. (Backend is deployed on Render, may take a moment to spin up)",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "socket.io",
        color: "yellow-text-gradient"
      },
      {
        name: "google-maps-api",
        color: "red-orange-gradient"
      }
    ],
    image: uber,
    source_code_link: "https://github.com/shashi162003/Uber-Clone",
    live_demo_link: "https://uber-clone-webapp-ten.vercel.app/",
  },
  {
    name: "Chatty - Real-Time Chat App",
    description:
      "A real-time chat application with features like private messaging, group chats, and file sharing. Built with React, Socket.io, and Express. (Backend is deployed on Render, may take a moment to spin up)",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "socket.io",
        color: "yellow-text-gradient"
      }
    ],
    image: chatty,
    source_code_link: "https://github.com/shashi162003/Chatty---Real-Time-Chat-App",
    live_demo_link: "https://chatty-real-time-chat-app-green.vercel.app/",
  },
  {
    name: "Uptime Tracker",
    description: 
    "A full-stack uptime monitoring application inspired by Uptime Robot. This project allows users to monitor website uptime, receive notifications, and view detailed reports. Built with a React frontend and Node.js/Express backend. (Backend is deployed on Render, may take a moment to spin up)",
    tags:[
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "recharts",
        color: "yellow-text-gradient"
      },
      {
        name: "node-cron",
        color: "red-orange-gradient"
      }
    ],
    image: uptime,
    source_code_link: "https://github.com/shashi162003/UptimeRobot",
    live_demo_link: "https://uptime-robot-psi.vercel.app/",
  },
  {
    name: "URL Shortener",
    description:
      "A URL shortening service that converts long URLs into shorter, more manageable links. Features include custom URLs and analytics tracking. (Backend is deployed on Render, may take a moment to spin up)",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "jsonwebtoken",
        color: "yellow-text-gradient"
      }
    ],
    image: url,
    source_code_link: "https://github.com/shashi162003/URL_Shortener",
    live_demo_link: "https://url-shortener-puce-delta.vercel.app/",
  },
  {
    name: "ChatRoom",
    description:
      "A simple yet powerful chat room application allowing multiple users to communicate in real-time. Built with React and Firebase. (Backend is deployed on Render, may take a moment to spin up)",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "nodejs",
        color: "green-text-gradient",
      },
      {
        name: "express",
        color: "orange-text-gradient",
      },
      {
        name: "mongodb",
        color: "pink-text-gradient",
      },
      {
        name: "jsonwebtoken",
        color: "yellow-text-gradient"
      },
      {
        name: "websockets",
        color: "red-orange-gradient"
      }
    ],
    image: chat,
    source_code_link: "https://github.com/shashi162003/ChatRoom",
    live_demo_link: "https://chat-room-mauve-delta.vercel.app/",
  },
];

export { services, experiences, projects };
