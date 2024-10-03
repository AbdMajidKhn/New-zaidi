import Cookies from 'js-cookie';

const ClearCookies = async () => {
	Cookies.remove('userToken');
	Cookies.remove('name');
	Cookies.remove('role_name');
	Cookies.remove('role_id');
};
export default ClearCookies;
