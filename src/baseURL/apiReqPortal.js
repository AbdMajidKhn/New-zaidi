import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ClearCookies from './clearCookies';
import Icon from '../components/icon/Icon';
import showNotification from '../components/extras/showNotification';

const apiClient = axios.create({
	baseURL: 'http://thesfb.live/ZaidiTradersBackend/api',
	// baseURL: 'http://192.168.18.20/Zaidi_TradersBackend/api', /// Auranzeb

	// baseURL: 'http://192.168.18.86/Zaidi_TradersBackend/api', // Husnain
	// baseURL: 'http://localhost/Zaidi_TradersBackend/api',

	// timeout: 900000,
	headers: { Authorization: `Bearer ${Cookies.get('userToken') ?? ''}` },
	// headers: { Authorization: `Bearer ${JSON.parse(Cookies.get('userToken')) ?? ''}` },
});

const _titleError = (
	<span className='d-flex align-items-center'>
		<Icon icon='Info' size='lg' className='me-1' />
		<span>Error Saving Record </span>
	</span>
);
apiClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response.data.message === 'Token has expired') {
			ClearCookies();
			showNotification(_titleError, error.response.data.message, 'danger');

			// Redirect user to login page
			window.location.href = '/Zaidi_Traders/auth-pages/login';
		}
		return Promise.reject(error);
	},
);

export default apiClient;
