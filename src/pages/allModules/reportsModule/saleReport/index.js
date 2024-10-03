// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Select, { createFilter } from 'react-select';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import { useFormik } from 'formik';
import apiClient from '../../../../baseURL/api';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import Input from '../../../../components/bootstrap/forms/Input';
import Excel from './excel';
import GeneratePDF from './sale';

require('flatpickr/dist/flatpickr.css');

const Files = () => {
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [customerOptionsLoading, setCustomerOptionsLoading] = useState(true);
	const [itemOptions, setitemOptions] = useState([]);
	const [itemOptionsLoading, setitemOptionsLoading] = useState(true);
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const saleTypeOptions = [
		{
			id: 1,
			value: 1,
			label: 'Walk-in Customer',
		},
		{
			id: 2,
			value: 2,
			label: 'Registered Customer',
		},
	];
	const formik = useFormik({
		initialValues: {
			customer_id: '',
			item_id: '',
			sale_type: '',
			walk_in_customer_name: '',
		},
	});
	const printReportAll = (docType) => {
		apiClient
			.get(
				`/getSalesReport?sale_type=${formik.values.sale_type}&customer_id=${
					formik.values.customer_id
				}
				&item_id=${formik.values.item_id}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
			)
			.then((response) => {
				GeneratePDF(
					response.data,
					docType,

					formik.values.item_id,
					dateRange.from,
					dateRange.to,
				);
			});
	};
	useEffect(() => {
		apiClient
			.get(`/getItemsDropDown`)

			.then((response) => {
				const rec = response.data.items.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setitemOptions(rec);
				setitemOptionsLoading(false);
			});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCustomerOptions(rec);
			setCustomerOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Sale Report</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<div className='col-md-2'>
										<FormGroup label='Sale Type' id='sale_type'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												isClearable
												options={saleTypeOptions}
												// isLoading={purchaseTypeOptionsLoading}
												value={
													formik.values.sale_type
														? saleTypeOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.sale_type,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sale_type',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div>
									{formik.values.sale_type === 2 ? (
										<div className='col-md-2'>
											<FormGroup label='Customers' id='customer_id'>
												<Select
													className='col-md-12'
													classNamePrefix='select'
													options={customerOptions}
													isLoading={customerOptionsLoading}
													isClearable
													value={
														formik.values.customer_id
															? customerOptions?.find(
																	(c) =>
																		c.value ===
																		formik.values.customer_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'customer_id',
															val ? val.id : '',
														);
													}}
												/>
											</FormGroup>
										</div>
									) : (
										''
									)}
									{formik.values.sale_type === 1 ? (
										<div className='col-md-2'>
											<FormGroup
												id='walk_in_customer_name'
												label='Customer Name'
												className='col-md-12'>
												<Input
													type='text'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.walk_in_customer_name}
													isValid={formik.isValid}
													isTouched={formik.touched.walk_in_customer_name}
													invalidFeedback={
														formik.errors.walk_in_customer_name
													}
												/>
											</FormGroup>
										</div>
									) : (
										''
									)}
									<div className='col-md-2'>
										<FormGroup label='item' id='item_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												isClearable
												options={itemOptions}
												isLoading={itemOptionsLoading}
												value={
													formik.values.item_id
														? itemOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.item_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'item_id',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='request' label='Request Date Range'>
											<Flatpickr
												className='form-control'
												value={dateRange.fullDate || ''}
												options={{
													mode: 'range',
													dateFormat: 'd-m-Y',
												}}
												onChange={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												onClose={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>
									<ButtonGroup className='col-md-2'>
										<Button
											color='primary'
											// isLight={darkModeStatus}
											className={classNames('text-nowrap', {
												'col-md-2 border-light': true,
											})}
											icon={!isPrintAllReportLoading && 'FilePdfFill'}
											isDisable={isPrintAllReportLoading}
											onClick={() => printReportAll(2)}>
											{isPrintAllReportLoading && (
												<Spinner isSmall inButton />
											)}
											{isPrintAllReportLoading
												? 'Generating PDF...'
												: 'View PDF'}
										</Button>
										{/* <Excel /> */}
									</ButtonGroup>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Files;
