import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../constants';

const ProjectViewer = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();

    // Find the project based on the URL parameter
    const project = projects.find(p => p.name.toLowerCase().replace(/\s+/g, '-') === projectId);

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-primary">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Project Not Found</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // Get the project's subdomain URL
    const getProjectUrl = (projectName) => {
        const formattedName = projectName.toLowerCase().replace(/\s+/g, '-');
        return `https://${formattedName}.devshashi.dev`;
    };

    return (
        <div className="min-h-screen bg-primary p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-white">{project.name}</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all"
                    >
                        Back to Portfolio
                    </button>
                </div>

                {/* Project Description */}
                <div className="bg-tertiary p-6 rounded-lg mb-8">
                    <p className="text-white text-lg">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {project.tags.map((tag) => (
                            <span
                                key={tag.name}
                                className={`px-3 py-1 rounded-full text-sm ${tag.color}`}
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Project Links */}
                <div className="flex gap-4 mb-8">
                    <a
                        href={project.source_code_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-tertiary rounded-lg text-white font-medium hover:bg-tertiary/80 transition-all"
                    >
                        View Source Code
                    </a>
                    <a
                        href={getProjectUrl(project.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-lg text-white font-medium border border-white hover:bg-white hover:text-primary hover:scale-105 hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                    >
                        <span>Live Demo</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>

                {/* Project Preview */}
                <div className="bg-tertiary p-4 rounded-lg">
                    <iframe
                        src={getProjectUrl(project.name)}
                        title={project.name}
                        className="w-full h-[600px] rounded-lg"
                        style={{ border: 'none' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProjectViewer; 