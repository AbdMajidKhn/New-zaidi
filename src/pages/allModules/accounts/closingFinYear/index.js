// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';

import moment from 'moment';
import Cookies from 'js-cookie';

// eslint-disable-next-line import/order
// eslint-disable-next-line import/order
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import Spinner from '../../../../components/bootstrap/Spinner';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';

import Page from '../../../../layout/Page/Page';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';

import Button from '../../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';

require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const TablePage = () => {
	const [isEdit, setIsEdit] = useState(false);
	const [tableRecordsLoading, setTableRecordsLoading] = useState(false);
	const [dateClosing, setDateClosing] = useState('');

	const getDataForPayrole = () => {
		setTableRecordsLoading(true);
		const data = { to_date: moment(dateClosing, 'DD-MM-YYYY').format('YYYY-MM-DD') };
		apiClient
			.post(`/closefinanceyear`, data, {})
			.then(() => {
				// setIsLoading(false);
				setIsEdit(false);
				getDateClosing();
				setTableRecordsLoading(false);
			})
			.catch(() => {
				setTableRecordsLoading(false);
			});
	};
	const getDateClosing = () => {
		apiClient
			.get(`/getclosefinanceyear`)
			.then((response) => {
				setDateClosing(
					moment(response.data.FinYearClosingDate.to_date, 'YYYY-MM-DD').format(
						'DD-MM-YYYY',
					),
				);
			})
			.catch((err) => console.log(err));
	};

	// jhjhjhk

	useEffect(() => {
		getDateClosing();
	}, []);

	return (
		<PageWrapper>
			<Page>
				<Card>
					<CardHeader>
						<CardLabel icon='Lock' iconColor='danger'>
							<CardTitle>Financial Year Closing</CardTitle>
						</CardLabel>
						{/* <CardActions></CardActions> */}
					</CardHeader>
					<CardBody>
						<div className='row'>
							{Cookies.get('roleId') === '1' && isEdit === true ? (
								<FormGroup label='Date' className='col-md-4' id='dateClosing'>
									<Flatpickr
										size='lg'
										className='form-control'
										value={dateClosing}
										// eslint-disable-next-line react/jsx-boolean-value

										options={{
											dateFormat: 'd-m-Y',
											allowInput: true,
										}}
										onChange={(date, dateStr) => {
											setDateClosing(dateStr);
										}}
										onClose={(date, dateStr) => {
											setDateClosing(dateStr);
										}}
										id='default-picker'
									/>
								</FormGroup>
							) : (
								<div className='col-md-4 strong fs-1'>{dateClosing}</div>
							)}

							<FormGroup className='col-md-4'>
								<br />
								<Button
									className='col-md-12'
									color={isEdit ? 'success' : 'danger'}
									isOutline
									size='lg'
									isActive
									icon={isEdit ? (tableRecordsLoading ? null : 'Save') : 'Edit'}
									isDisable={tableRecordsLoading}
									hoverShadow='default'
									onClick={() => {
										if (isEdit === true) {
											getDataForPayrole();
										} else {
											setIsEdit(true);
										}
									}}>
									{tableRecordsLoading && <Spinner isSmall inButton />}

									{isEdit
										? tableRecordsLoading
											? 'Setting up Lock Date Payroll'
											: 'Set Lock Date'
										: 'Change'}
								</Button>
							</FormGroup>
						</div>
					</CardBody>
				</Card>
			</Page>
		</PageWrapper>
	);
};

export default TablePage;
