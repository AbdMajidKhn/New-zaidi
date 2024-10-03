// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { lazy, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import Cookies from 'js-cookie';

import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import { TourProvider } from '@reactour/tour';
import ThemeContext from '../contexts/themeContext';

import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { demoPages, layoutMenu, homePortal } from '../menu';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import steps, { styles } from '../steps';
import { isLoggedIn, isValidToken } from '../baseURL/authUtils';
import LOGIN from '../pages/presentation/auth/Login';
import { CounterProvider } from '../contexts/contextPurchase';

const PAGE_404 = lazy(() => import('../pages/presentation/auth/Page404'));

const App = () => {
	getOS();

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};
	const navigate = useNavigate();

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [darkModeStatus]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	//	Add paths to the array that you don't want to be "Aside".
	const withOutAsidePages = [demoPages.login.path, demoPages.signUp.path, layoutMenu.blank.path];

	// Perform JWT validation here
	const isAuthenticated = isLoggedIn() && isValidToken();
	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>
		<CounterProvider>
		<TourProvider
					steps={steps}
					styles={styles}
					showNavigation={false}
					showBadge={false}>
					<div
						ref={ref}
						className='app'
						style={{
							backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
							zIndex: fullScreenStatus && 1,
							overflow: fullScreenStatus && 'scroll',
						}}>
						<Routes>
							{withOutAsidePages.map((path) => (
								<Route key={path} path={path} />
							))}

							{isAuthenticated ? (
								<Route path='*' element={<Aside />} />
							) : (
								<Route path='*' element={<LOGIN />} />
							)}

							{/* <Route path='*' element={<Aside />} /> */}
						</Routes>
						{isAuthenticated && <Wrapper />}
					</div>
					<Portal id='portal-notification'>
						<ReactNotifications />
					</Portal>
				</TourProvider>
		</CounterProvider>
			
		
				
			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
