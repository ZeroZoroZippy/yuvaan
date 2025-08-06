import React from 'react';

const About = () => {
  const skills = [
    'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
    'Tailwind CSS', 'Git', 'AWS', 'Docker'
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            I'm a passionate developer who loves turning ideas into reality through code
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              With [X] years of experience in web development, I specialize in creating 
              modern, responsive applications using the latest technologies. I enjoy 
              solving complex problems and building user-friendly interfaces.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When I'm not coding, you can find me [your hobbies/interests]. I'm always 
              eager to learn new technologies and take on challenging projects.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills & Technologies</h3>
            <div className="grid grid-cols-2 gap-3">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-primary-50 text-primary-700 px-4 py-2 rounded-lg text-center font-medium"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;