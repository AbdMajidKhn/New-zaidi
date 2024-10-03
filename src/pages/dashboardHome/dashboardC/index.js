// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import apiClient from '../../../baseURL/api';

import GeneralInfo from './generalInfo/generalInfo';
import PoInfo from './generalInfo/poInfo';
import Revenue from './IncomeStatement/Revenue';
import Income from './IncomeStatement/Income';
import IncomingsOutgoings from './IncomeStatement/IncomingsOutgoings';

const Chart = () => {
	const [notificationsData, setNotificationsData] = useState([]);
	const [notificationsDataLoading, setNotificationsDataLoading] = useState([]);
	const [dataforRevenueExpensesCostLoading, setDataforRevenueExpensesCostLoading] =
		useState(true);
	const [dataforRevenueExpensesCost, setDataforRevenueExpensesCost] = useState([]);

	useEffect(() => {
		refreshData();
		getDataforRevenueExpensesCost();
		getDataForPlotsReceivable();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getDataforRevenueExpensesCost = () => {
		setDataforRevenueExpensesCostLoading(true);

		apiClient
			.get(`/getTrailBalanceForDash`)
			.then((response) => {
				setDataforRevenueExpensesCost(response.data);
				setDataforRevenueExpensesCostLoading(false);
			})
			.catch((err) => console.log(err));
	};
	const refreshData = () => {
		setNotificationsDataLoading(true);

		apiClient
			.get(`/getNotifications`)
			.then((response) => {
				setNotificationsData(response.data);
				setNotificationsDataLoading(false);
			})
			.catch((err) => console.log(err));
	};

	const getDataForPlotsReceivable = () => {};
	return notificationsDataLoading ? (
		<h5>Loading...</h5>
	) : (
		<div className='col-lg-12'>
			<Card stretch>
				<CardHeader>
					<CardLabel icon='PieChart'>
						<CardTitle>
							Overview <small>Business</small>
						</CardTitle>
						<CardSubTitle>Overview</CardSubTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<div className='row'>
						<GeneralInfo data={notificationsData} />
						<PoInfo data={notificationsData} />
					</div>
					<div className='row'>
						<Revenue
							dataMain={dataforRevenueExpensesCost}
							dataLoading={dataforRevenueExpensesCostLoading}
						/>
						<IncomingsOutgoings
							dataMain={dataforRevenueExpensesCost}
							dataLoading={dataforRevenueExpensesCostLoading}
						/>
					</div>
					<div className='row justify-content-center'>
						<Income
							dataMain={dataforRevenueExpensesCost}
							dataLoading={dataforRevenueExpensesCostLoading}
						/>
					</div>
					<div className='row'>
						{/* <PlotData data={tableRecords?.PlotsData} /> */}
						{/* <PlotDataType data={tableRecords?.PlotsData} /> */}
					</div>
					{/* {dataForPlotsReceivableLoading ? (
						<p>...</p>
					) : (
						<div className='row'>
							<PlotsRecievables
								data={dataForPlotsReceivable}
								// isLoading={dataForPlotsReceivableLoading}
							/>
						</div>
					)} */}
				</CardBody>
			</Card>
		</div>
	);
};

export default Chart;
