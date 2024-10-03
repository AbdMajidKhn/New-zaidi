// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';

import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/api';

// import { priceFormat } from '../../../../helpers/helpers';

import Icon from '../../../../components/icon/Icon';
import useDarkMode from '../../../../hooks/useDarkMode';

// import CommonStoryBtn from '../../../../components/common/CommonStoryBtn';

const PieBasic = ({ data }) => {
	const { darkModeStatus } = useDarkMode();
	const [notificationsLoading, setNotificationsLoading] = useState(false);
	const [notificationsData, setNotificationsData] = useState([]);
	const [notificationsCount, setNotificationsCount] = useState(0);
	useEffect(() => {
		// setNotificationsLoading(true);
		// apiClient
		// 	.get(`/getNotifications`)
		// 	.then((response) => {
		// 		setNotificationsData(response.data.data);
		// 		setNotificationsCount(
		// 			0,
		// 			// response.data.data.vouchers.length +
		// 			// 	response.data.data.totalPayable.length +
		// 			// 	response.data.data.totalReceivable.length +
		// 			// 	response.data.data.postdatedVouchers.length +
		// 			// 	response.data.data.upcommingPostDatedVouchers.length,
		// 		);
		// 		setNotificationsLoading(false);
		// 	})
		// 	.catch((err) => console.log(err));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<div className='col-lg-6'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='Notifications'>
						<CardTitle>Overview</CardTitle>
					</CardLabel>
					<CardActions>
						Current <strong>Status</strong>.
					</CardActions>
				</CardHeader>
				<CardBody>
					{notificationsLoading === true ? (
						<h1>...</h1>
					) : (
						<div className='row g-4 align-items-center'>
							<div className='col-xl-6'>
								<div
									className={`d-flex align-items-center bg-l${
										darkModeStatus ? 'o25' : '10'
									}-warning rounded-2 p-3`}>
									<div className='flex-shrink-0'>
										<Icon icon='DoneAll' size='3x' color='warning' />
									</div>
									<div className='flex-grow-1 ms-3'>
										<div className='fw-bold fs-3 mb-0'>
											{data.activecustomers}
										</div>
										<div className='text-muted mt-n2 truncate-line-1'>
											Active Customers
										</div>
									</div>
								</div>
							</div>
							<div className='col-xl-6'>
								<div
									className={`d-flex align-items-center bg-l${
										darkModeStatus ? 'o25' : '10'
									}-info rounded-2 p-3`}>
									<div className='flex-shrink-0'>
										<Icon icon='Analytics' size='3x' color='info' />
									</div>
									<div className='flex-grow-1 ms-3'>
										<div className='fw-bold fs-3 mb-0'>
											{data.activesuppliers}
										</div>
										<div className='text-muted mt-n2 truncate-line-1'>
											Active Suppliers
										</div>
									</div>
								</div>
							</div>
							<div className='col-xl-6'>
								<div
									className={`d-flex align-items-center bg-l${
										darkModeStatus ? 'o25' : '10'
									}-primary rounded-2 p-3`}>
									<div className='flex-shrink-0'>
										<Icon icon='Bank' size='3x' color='primary' />
									</div>
									<div className='flex-grow-1 ms-3'>
										<div className='fw-bold fs-3 mb-0'>{data.activeitems}</div>
										<div className='text-muted mt-n2 truncate-line-1'>
											Active Items
										</div>
									</div>
								</div>
							</div>
							<div className='col-xl-6'>
								<div
									className={`d-flex align-items-center bg-l${
										darkModeStatus ? 'o25' : '10'
									}-success rounded-2 p-3`}>
									<div className='flex-shrink-0'>
										<Icon icon='Timer' size='3x' color='success' />
									</div>
									<div className='flex-grow-1 ms-3'>
										<div className='fw-bold fs-3 mb-0'>
											{data.below_min_level_stock}
										</div>
										<div className='text-muted mt-n2'>
											Items Below Min Level
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
};

export default PieBasic;
