import { useEffect, useRef } from 'react';

const useInactivityLogout = (timeout = 1800000) => { // default timeout 10 minutes
    const timer = useRef(null);

    const resetTimer = () => {
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            localStorage.clear();
            window.location.reload(); // Optionally redirect or take another action
        }, timeout);
    };

    useEffect(() => {
        const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];

        const handleEvent = () => resetTimer();

        events.forEach(event => {
            window.addEventListener(event, handleEvent);
        });

        resetTimer(); // Initialize the timer

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, handleEvent);
            });
            if (timer.current) {
                clearTimeout(timer.current);
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeout]);
};

export default useInactivityLogout;
