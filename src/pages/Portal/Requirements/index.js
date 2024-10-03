// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import Axios from 'axios';

import apiClient from '../../../baseURL/apiReqPortal';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import HumansWebp from '../../../assets/img/scene8.webp';
import Humans from '../../../assets/img/scene8.png';
import { layoutMenu } from '../../../menu';
import CommonLatestTransActions from './CommonLatestTransActions';

const Blank = () => {
	const [data, setData] = useState([]);
	const [dataLoading, setDataLoading] = useState(true);
	useEffect(() => {
		refreshTableData();
	}, []);
	const refreshTableData = () => {
		setDataLoading(true);
		apiClient
			.get(`/getTopics`)
			.then((response) => {
				const result = response.data.topics;
				let countArray = 0;

				response.data.topics.forEach((record, index) => {
					countArray = record.topic_child.filter((item) => item.status_id === 1);
					result[index] = { ...result[index], countPending: countArray.length };
				});
				response.data.topics.forEach((record, index) => {
					countArray = record.topic_child.filter((item) => item.status_id === 2);
					result[index] = { ...result[index], countDone: countArray.length };
				});
				response.data.topics.forEach((record, index) => {
					countArray = record.topic_child.filter((item) => item.status_id === 3);
					result[index] = { ...result[index], countRejected: countArray.length };
				});

				// setData(response.data.topics);
				setData(result);
				console.log(result, 'rrr');

				setDataLoading(false);
			})
			.catch((err) => console.log(err));
	};
	return (
		<PageWrapper title={layoutMenu.blank.text}>
			<Page>
				<div className='row d-flex align-items-top h-200'>
					<div
						className='col-12 d-flex justify-content-center'
						style={{ fontSize: 'calc(3rem + 3vw)' }}>
						<p>Zaidi Traders</p>
					</div>
					<div className='col-12 align-items-top justify-content-center'>
						{/* <img
							srcSet={HumansWebp}
							src={Humans}
							alt='Humans'
							style={{ height: '70vh' }}
						/> */}
						<CommonLatestTransActions data={data} refreshTableData={refreshTableData} />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Blank;
