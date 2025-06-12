import { useRef, useEffect } from 'react';

export const useMousePosition = () => {
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev) => {
            mouse.current = { x: ev.clientX, y: ev.clientY };
        };

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return mouse;
}; 