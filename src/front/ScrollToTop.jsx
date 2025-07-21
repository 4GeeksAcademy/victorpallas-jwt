
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// Este componente fuerza el scroll al tope de la página cuando cambia la ruta
const ScrollToTop = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return children;
};

ScrollToTop.propTypes = {
    children: PropTypes.any
};

export default ScrollToTop;
