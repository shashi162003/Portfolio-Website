import React from "react";
import { motion } from "framer-motion";
import { HiDownload } from "react-icons/hi";
import { Tilt } from "react-tilt";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon, link }) => (
  <div className='xs:w-[250px] w-full'>
    <Tilt
      options={{
        max: 45,
        scale: 1,
        speed: 450,
      }}
      className='w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card cursor-pointer'
    >
      <div
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
        onClick={() => window.open(link, '_blank', 'noopener,noreferrer')}
        style={{ cursor: 'pointer' }}
      >
        <img
          src={icon}
          alt='web-development'
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-white text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </Tilt>
  </div>
);

const About = () => {
  return (
    <motion.div variants={textVariant()}>
      <p className={styles.sectionSubText}>Introduction</p>
      <h2 className={styles.sectionHeadText}>Overview.</h2>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled software developer with experience in Java and JavaScript,
        and expertise in technologies like React, Node.js, Express.js, and
        MongoDB as part of the MERN stack. I'm a quick learner and collaborate
        closely with clients to create efficient, scalable, and user-friendly
        solutions that solve real-world problems. Let's work together to bring
        your ideas to life!
      </motion.p>

      <motion.a
        href="/resume.pdf"
        download
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors mt-6"
      >
        <HiDownload className="w-5 h-5" />
        Download Resume
      </motion.a>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </motion.div>
  );
};

export default SectionWrapper(About, "about");
