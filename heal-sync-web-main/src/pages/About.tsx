
import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">About MediTrack</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Story</h2>
        <p className="mb-4">
          MediTrack was created by a team of engineering students who wanted to simplify 
          healthcare management. Our goal was to create a platform where patients and doctors 
          could easily connect and manage healthcare needs.
        </p>
        <p>
          This application was built as part of our final year project at the Engineering School, 
          with the goal of addressing real-world healthcare challenges through technology.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-meditrack-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold">SA</span>
            </div>
            <h3 className="font-medium">Sarah Ahmed</h3>
            <p className="text-sm text-gray-500">Frontend Developer</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-meditrack-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold">MH</span>
            </div>
            <h3 className="font-medium">Mohammed Hassan</h3>
            <p className="text-sm text-gray-500">Backend Developer</p>
          </div>
          <div className="text-center">
            <div className="w-24 h-24 bg-meditrack-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-xl font-bold">LK</span>
            </div>
            <h3 className="font-medium">Layla Khalil</h3>
            <p className="text-sm text-gray-500">UI/UX Designer</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        <div className="space-y-3">
          <p>
            <span className="font-medium">Technology Stack:</span> React, TailwindCSS, TypeScript
          </p>
          <p>
            <span className="font-medium">Course:</span> Engineering Senior Project (CSE 499)
          </p>
          <p>
            <span className="font-medium">Year:</span> 2025
          </p>
          <p>
            <span className="font-medium">Supervisor:</span> Dr. Nabil Mahmoud
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
