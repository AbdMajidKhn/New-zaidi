import ClearCookies from '../../../baseURL/clearCookies';

import apiClient from '../../../baseURL/api';

import showNotification from '../../../components/extras/showNotification';

const Logout = async () => {
	apiClient
		.post(`/logout`, {})
		.then(() => {
			ClearCookies();
		})
		.catch((err) => {
			showNotification('Error', err.message, 'danger');
		});
};
export default Logout;
