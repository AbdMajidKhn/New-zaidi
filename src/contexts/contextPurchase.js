import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const CounterContext = createContext();

export const CounterProvider = ({ children }) => {
    const [counter, setCounter] = useState(0);

    const increment = () => setCounter(counter + 1);
    const decrement = () => setCounter(counter - 1);

    return (
        		// eslint-disable-next-line  react/jsx-no-constructed-context-values
        <CounterContext.Provider value={{ counter, increment, decrement }}>
            {children}
        </CounterContext.Provider>
    );
};

CounterProvider.propTypes = {
    children: PropTypes.node.isRequired
};
