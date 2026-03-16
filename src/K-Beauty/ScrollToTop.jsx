import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Use a small timeout to ensure it runs after the route change has fully rendered
        const timeoutId = setTimeout(() => {
            const scrollOptions = { top: 0, left: 0, behavior: 'instant' };
            
            window.scrollTo(scrollOptions);
            document.documentElement.scrollTo(scrollOptions);
            document.body.scrollTo(scrollOptions);
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;