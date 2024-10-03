// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useCookies } from 'react-cookie';

// import { useCookies } from 'react-cookie';

// eslint-disable-next-line import/no-extraneous-dependencies, no-unused-vars
import Cookies from 'js-cookie';

import moment from 'moment';
// import { setAuthToken } from '../../../baseURL/jwtUtils';
// eslint-disable-next-line no-unused-vars
import subDirForNavigation from '../../../baseDirectory/subDirForNavigation';
import showNotification from '../../../components/extras/showNotification';
// eslint-disable-next-line no-unused-vars
import { _titleSuccess, _titleError, _titleWarning } from '../../../notifyMessages/erroSuccess';

// import subDirForNavigation from '../../../baseDirectory/subDirForNavigation';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/logo/logo1.png';
// import useDarkMode from '../../../hooks/useDarkMode';
import baseURL from '../../../baseURL/baseURL';
import Spinner from '../../../components/bootstrap/Spinner';

// eslint-disable-next-line react/prop-types
const LoginHeader = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
				<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Welcome,</div>
			<div className='text-center h4 text-muted mb-5'>Sign in to continue!</div>
		</>
	);
};

const Login = () => {
	// eslint-disable-next-line no-unused-vars
	const [cookies, setCookie, removeCookie] = useCookies(['userToken']);

	// eslint-disable-next-line no-unused-vars

	// const { darkModeStatus } = useDarkMode();

	// eslint-disable-next-line no-unused-vars
	const [usernameInput, setUsernameInput] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [isNewUser, setIsNewUser] = useState(0);
	const [lastSave, setLastSave] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// eslint-disable-next-line no-unused-vars
	const navigate = useNavigate();
	const handleOnClick = (e) => {
		setIsLoading(true);

		e.preventDefault();

		if (email === '') {
			showNotification(_titleWarning, 'Please Provide Email Address', 'Warning');

			setIsLoading(false);
		} else if (password === '') {
			showNotification(_titleWarning, 'Please Provide Password', 'Warning');

			setIsLoading(false);
		} else if (email !== '' && password !== '') {
			fetch(`${baseURL}/login`, {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email,
					password,
				}),
			})
				.then((res) => res.json())
				.then(async (data) => {
					setIsLoading(false);
					if (data?.status === 'ok') {
						setCookie('userToken', data.token, { path: '/' });
						// eslint-disable-next-line no-unused-vars
						// await setAuthToken(data.token);

						Cookies.set('name', data.role.name);
						Cookies.set('role_name', data.role.role_name);
						Cookies.set('role_id', data.role.role_id);

						// Cookies.set('userID', data.user_id);
						showNotification(_titleSuccess, 'Login Success', 'Success');

						navigate(`${subDirForNavigation}`, { replace: true });
						// window.location.reload();
						setLastSave(moment());
					} else {
						showNotification(_titleError, data.message, 'Danger');
					}

					setIsLoading(false);
				})
				.catch((err) => {
					console.log(err, '	 Error');
					setIsLoading(false);
					showNotification(_titleError, 'Network Error', 'Danger');
				});
		} else {
			showNotification(_titleWarning, 'Fill out fields', 'Warning');

			setIsLoading(false);
		}
	};

	return (
		<PageWrapper
			title={isNewUser ? 'Sign Up' : 'Login'}
			className={classNames({ 'bg-success': !isNewUser, 'bg-info': !!isNewUser })}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div className='col-xl-4 col-lg-6 col-md-8 shadow-3d-container'>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									{/* <Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}>
									</Link> */}
									<img alt='Logo' src={Logo} width={300} />
								</div>

								<LoginHeader isNewUser={isNewUser} />

								<form className='row g-4'>
									{isNewUser ? (
										<>
											<div className='col-12'>
												<FormGroup
													id='signup-email'
													isFloating
													label='Your email'>
													<Input type='email' autoComplete='email' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-name'
													isFloating
													label='Your name'>
													<Input autoComplete='given-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-surname'
													isFloating
													label='Your surname'>
													<Input autoComplete='family-name' />
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='signup-password'
													isFloating
													label='Password'>
													<Input
														type='password'
														autoComplete='password'
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={handleOnClick}>
													Sign Up
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup
													id='login-username'
													isFloating
													label='Your email or username'>
													<Input
														autoComplete='username'
														onChange={(e) => setEmail(e.target.value)}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<FormGroup
													id='login-password'
													isFloating
													label='Password'>
													<Input
														type='password'
														autoComplete='password'
														onChange={(e) =>
															setPassword(e.target.value)
														}
													/>
												</FormGroup>
											</div>

											<div className='col-12'>
												<Button
													icon={isLoading ? null : 'Login'}
													isDisable={isLoading}
													color='success'
													type='submit'
													className='w-100 py-3'
													onClick={handleOnClick}>
													{isLoading && <Spinner isSmall inButton />}
													{isLoading
														? (lastSave && 'Signing in') || 'Signing in'
														: (lastSave && 'Sign in') || 'Sign in'}
												</Button>
											</div>
										</>
									)}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='https://koncept-solutions.com/'
								className={classNames('link-light text-decoration-none', {
									'link-light': isNewUser,
									'link-dark': !isNewUser,
								})}>
								Powered by Koncept Solutions
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

Login.defaultProps = {
	isSignUp: false,
};

export default Login;
