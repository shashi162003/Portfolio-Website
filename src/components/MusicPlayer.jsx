import React, { useEffect, useRef, useState } from 'react';

const MusicPlayer = () => {
    const audioRef = useRef(null);
    const [showPermission, setShowPermission] = useState(true);

    useEffect(() => {
        // Create audio element
        audioRef.current = new Audio('/background-music.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.2; // Set initial volume to 20%

        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.play();
            setShowPermission(false);
        }
    };

    const handleDecline = () => {
        setShowPermission(false);
    };

    if (!showPermission) return null;

    return (
        <div className="fixed top-4 left-4 z-[100]">
            <div className="bg-tertiary p-4 rounded-lg shadow-lg max-w-[280px]">
                <h3 className="text-white text-lg font-bold mb-2">Background Music</h3>
                <p className="text-white-100 text-sm mb-4">
                    Would you like to enable background music?
                </p>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={handleDecline}
                        className="px-3 py-1 text-sm text-white-100 hover:text-white transition-colors"
                    >
                        No
                    </button>
                    <button
                        onClick={handlePlay}
                        className="px-3 py-1 text-sm bg-[#915EFF] text-white rounded hover:bg-[#7c4dff] transition-colors"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer; 