import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

import { contents } from '../../routes/contentRoutes';
// import { isLoggedIn, isValidToken } from '../../baseURL/authUtils';
// import LOGIN from '../../pages/presentation/auth/Login';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));

// const MAIN = lazy(() => import('../../pages/Portal/Requirements/index'));

const ContentRoutes = () => {
	// const isAuthenticated = isLoggedIn() && isValidToken();

	return (
		<Routes>
			{contents.map((page) => (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<Route key={page.path} {...page} />
			))}
			<Route path='*' element={<PAGE_404 />} />
			{/* {isAuthenticated ? (
				<Route path='*' element={<PAGE_404 />} />
			) : (
				<Route path='*' element={<LOGIN />} />
			)} */}
		</Routes>
	);
};

export default ContentRoutes;
