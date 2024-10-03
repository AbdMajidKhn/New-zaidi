import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ReactRoundedImage from 'react-rounded-image';
import Icon from '../../components/icon/Icon';
// import Logo from '../../components/Logo';
import logo from '../../components/logo/logo.png';

const Brand = ({ asideStatus, setAsideStatus }) => {
	return (
		<div className='brand'>
			<div className='brand-logo'>
				<h1 className='brand-title '>
					<Link to='/' aria-label='Logo' alt='REHBAR Logo'>
						<ReactRoundedImage
							roundedColor='#66A5CC'
							imageWidth='55'
							imageHeight='55'
							roundedSize='5'
							borderRadius='45'
							image={logo}
						/>
					</Link>
				</h1>
			</div>
			<button
				type='button'
				className='btn brand-aside-toggle'
				aria-label='Toggle Aside'
				onClick={() => setAsideStatus(!asideStatus)}>
				<Icon icon='FirstPage' className='brand-aside-toggle-close' />
				<Icon icon='LastPage' className='brand-aside-toggle-open' />
			</button>
		</div>
	);
};
Brand.propTypes = {
	asideStatus: PropTypes.bool.isRequired,
	setAsideStatus: PropTypes.func.isRequired,
};

export default Brand;
