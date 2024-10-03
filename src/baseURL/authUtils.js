// import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { decodeToken } from './jwtUtils';

// import 'stream-browserify';
// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// eslint-disable-next-line no-unused-vars
// import jwt from 'jsonwebtoken';

// require('stream');

// import stream from 'stream-browserify';

export const isLoggedIn = () => {
	const token = Cookies.get('userToken');
	return token !== null;
};

export const isValidToken = () => {
	const token = Cookies.get('userToken'); // Retrieve the token from local storage

	if (token) {
		const decodedToken = decodeToken(token);
		const currentTime = Date.now() / 1000;

		if (decodedToken.exp < currentTime) {
			// Token has expired, log the user out
			// localStorage.removeItem('token');
			Cookies.remove('userToken');
			return false;

			// window.location.href = '/login';
		}
		return true;
		// User is authenticated, proceed with the protected component logic
	}
	Cookies.remove('userToken');

	// Token not found, log the user out
	return false;

	// window.location.href = '/login';
};
export const isValidToken2 = () => {
	const token = Cookies.get('userToken'); // Retrieve the token from local storage

	if (!token) {
		return false; // No token found, invalid
	}

	try {
		// const decodedToken = jwt.decode(token);
		// const currentTime = Date.now() / 1000; // Convert to seconds

		// if (decodedToken.exp < currentTime) {
		// 	return false; // Token has expired, invalid
		// }
		// eslint-disable-next-line no-constant-condition, no-self-compare
		if (
			Cookies.get('userToken') === undefined ||
			Cookies.get('userToken') === null ||
			Cookies.get('userToken') === 'null' ||
			!Cookies.get('userToken')
		)
			return false; // Token is valid
		return true; // Token is valid
	} catch (error) {
		return false; // Invalid token
	}
};

export default isValidToken;
