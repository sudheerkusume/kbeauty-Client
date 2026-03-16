import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Use a timeout of 0 to ensure it happens after the browser paints
        // This handles cases where React concurrent rendering or AOS animations might interfere
        const timeoutId = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant' // Force instant jump to prevent clashes with CSS smooth scroll
            });
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [pathname]);

    return null;
};

export default ScrollToTop;