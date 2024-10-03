// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';
import Flatpickr from 'react-flatpickr';

import Select from 'react-select';
import 'flatpickr/dist/themes/light.css';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Spinner from '../../../../components/bootstrap/Spinner';

import Button from '../../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardTabItem,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';

// import Icon from '../../../../components/icon/Icon';
import InvestmentVoucher from './investmentVoucher';

const validate = (values) => {
	const errors = {};

	if (!values.customer_id) {
		errors.customer_id = 'Required';
	}
	if (!values.invoice_id) {
		errors.invoice_id = 'Required';
	}

	if (!values.date) {
		errors.date = 'Required';
	}
	if (!values.amount > 0) {
		errors.amount = 'Required';
	}
	if (!values.account_id) {
		errors.account_id = 'Required';
	}
	if (values.cheque_no) {
		if (!values.cheque_date) errors.cheque_date = 'Required';
	}
	return errors;
};
const TablePage = () => {
	// Booking
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const formik = useFormik({
		initialValues: {
			customer_id: '',
			invoice_id: '',
			amount: '',
			coa_sub_group_id: '',
			date: moment().format('DD/MM/YY'),
			cheque_no: '',
			cheque_date: moment().format('DD/MM/YY'),
			is_post_dated: 0,
			account_id: '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
		setLastSave(moment());
	};
	const [customerOptions, setCustomerOptions] = useState([]);
	const [customerOptionsLoading, setCustomerOptionsLoading] = useState(true);
	const [customerInvoices, setCustomerInvoices] = useState([]);
	const [customerInvoicesLoading, setCustomerInvoicesLoading] = useState(true);

	useEffect(() => {
		formik.setFieldValue('invoice_id', '');
		setCustomerInvoicesLoading(true);
		if (formik.values.customer_id) {
			apiClient
				.get(`/getInoicesByCutomer?customer_id=${formik.values.customer_id}`)
				.then((response) => {
					const rec = response.data.invoices.map(
						({ id, invoice_no, date, total_after_gst }) => ({
							id,
							value: id,
							label: `${invoice_no}-${date}-(${total_after_gst})`,
						}),
					);
					setCustomerInvoices(rec);
					setCustomerInvoicesLoading(false);

					//   setLoading(false)
				})
				.catch((err) => console.log(err));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.customer_id]);

	useEffect(() => {
		setCustomerOptionsLoading(true);
		setCrAccountLoading(true);

		apiClient
			.get(`/getPersonsDropDown?person_type=1`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCustomerOptions(rec);
				setCustomerOptionsLoading(false);

				//   setLoading(false)
			})
			.catch((err) => console.log(err));

		apiClient
			.get(`/getCashAccounts`)
			.then((response) => {
				const rec = response.data.coaAccounts.map(
					({ id, name, code, coa_sub_group_id }) => ({
						id,
						coa_sub_group_id,
						value: id,
						label: `${code}-${name}`,
					}),
				);
				setCashAccountsOptions(rec);
				setCrAccountLoading(false);
			})
			.catch((err) => console.log(err));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitForm = (myFormik) => {
		apiClient
			.post(`/invoicePaymentVoucher`, myFormik.values, {})
			.then((res) => {
				if (res.data.status === 'ok') {
					// setState(false);
					myFormik.resetForm();
				}
				setIsLoading(false);

				setLastSave(moment());
			})
			.catch((err) => {
				setIsLoading(false);
			});
	};

	return (
		<PageWrapper title='View Accounts'>
			<div className='row'>
				<div className='col-12'>
					<Card stretch>
						<Card hasTab tabButtonColor='info'>
							<CardTabItem
								id='tab-item-1'
								title='Customer Receivings'
								icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<div className='row'>
										<div className='col-12'>
											<Card stretch tag='form' onSubmit={formik.handleSubmit}>
												<div className='row g-4'>
													<CardBody className='col-md-6 border-end'>
														<div className='row g-4'>
															<div className='col-md-4'>
																<FormGroup
																	id='customer_id'
																	label='Customer'
																	className='col-md-12'>
																	<Select
																		className='col-md-12'
																		// isClearable
																		classNamePrefix='select'
																		options={customerOptions}
																		isLoading={
																			customerOptionsLoading
																		}
																		value={
																			formik.values
																				.customer_id &&
																			customerOptions.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.customer_id,
																			)
																		}
																		// value={formik.values.mouza_id}
																		onChange={(val) => {
																			formik.setFieldValue(
																				'customer_id',
																				val.id,
																			);
																		}}
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched
																				.customer_id
																		}
																		invalidFeedback={
																			formik.errors
																				.customer_id
																		}
																		validFeedback='Looks good!'
																	/>
																</FormGroup>
																{formik.errors.customer_id && (
																	// <div className='invalid-feedback'>
																	<p
																		style={{
																			color: 'red',
																		}}>
																		{formik.errors.customer_id}
																	</p>
																)}
															</div>
															<div className='col-md-4'>
																<FormGroup
																	id='invoice_id'
																	label='Invoice'
																	className='col-md-12'>
																	<Select
																		className='col-md-12'
																		// isClearable
																		isMulti
																		classNamePrefix='select'
																		options={customerInvoices}
																		isLoading={
																			customerInvoicesLoading
																		}
																		value={
																			formik.values
																				.invoice_id &&
																			customerInvoices.find(
																				(c) =>
																					c.value ===
																					formik.values
																						.invoice_id,
																			)
																		}
																		// value={formik.values.mouza_id}
																		onChange={(val) => {
																			formik.setFieldValue(
																				'invoice_id',
																				val.map(option => option.id)
																			);
																		}}
																		isValid={formik.isValid}
																		isTouched={
																			formik.touched
																				.invoice_id
																		}
																		invalidFeedback={
																			formik.errors.invoice_id
																		}
																		validFeedback='Looks good!'
																	/>
																</FormGroup>
																{formik.errors.invoice_id && (
																	// <div className='invalid-feedback'>
																	<p
																		style={{
																			color: 'red',
																		}}>
																		{formik.errors.invoice_id}
																	</p>
																)}
															</div>

															<div className='col-md-4'>
																<FormGroup label='Date'>
																	<Flatpickr
																		className='form-control'
																		value={formik.values.date}
																		// eslint-disable-next-line react/jsx-boolean-value

																		options={{
																			dateFormat: 'd/m/y',
																			allowInput: true,
																		}}
																		onChange={(
																			date,
																			dateStr,
																		) => {
																			formik.setFieldValue(
																				'date',
																				dateStr,
																			);
																		}}
																		onClose={(
																			date,
																			dateStr,
																		) => {
																			formik.setFieldValue(
																				'date',
																				dateStr,
																			);
																		}}
																		id='default-picker'
																	/>
																</FormGroup>
																{formik.errors.date && (
																	// <div className='invalid-feedback'>
																	<p
																		style={{
																			color: 'red',
																		}}>
																		{formik.errors.date}
																	</p>
																)}
															</div>
															<div className='row'>
																<div className='col-md-4'>
																	<FormGroup
																		id='account_id'
																		label='Received Account'>
																		<Select
																			className='col-md-12 '
																			classNamePrefix='select'
																			options={
																				cashAccountsOptions
																			}
																			isLoading={
																				crAccountLoading
																			}
																			value={
																				formik.values
																					.account_id &&
																				cashAccountsOptions.find(
																					(c) =>
																						c.value ===
																						formik
																							.values
																							.account_id,
																				)
																			}
																			onChange={(val) => {
																				formik.setFieldValue(
																					'account_id',
																					val.id,
																				);
																				formik.setFieldValue(
																					'coa_sub_group_id',
																					val.coa_sub_group_id,
																				);
																				if (
																					val.coa_sub_group_id !==
																					6
																				) {
																					formik.setFieldValue(
																						'cheque_no',
																						'',
																					);
																				}
																			}}
																			onBlur={
																				formik.handleBlur
																			}
																			isValid={formik.isValid}
																			isTouched={
																				formik.touched
																					.account_id
																			}
																			invalidFeedback={
																				formik.errors
																					.account_id
																			}
																			validFeedback='Looks good!'
																		/>
																	</FormGroup>
																	{formik.errors.account_id && (
																		// <div className='invalid-feedback'>
																		<p
																			style={{
																				color: 'red',
																			}}>
																			{
																				formik.errors
																					.account_id
																			}
																		</p>
																	)}
																</div>
																<div className='col-md-6'>
																	<FormGroup
																		id='amount'
																		label='Amount'>
																		<Input
																			type='number'
																			min='0'
																			onWheel={(e) =>
																				e.target.blur()
																			}
																			onChange={
																				formik.handleChange
																			}
																			onBlur={
																				formik.handleBlur
																			}
																			value={
																				formik.values.amount
																			}
																			isValid={formik.isValid}
																			isTouched
																			invalidFeedback={
																				formik.errors.amount
																			}
																			validFeedback='Looks good!'
																		/>
																	</FormGroup>
																	<br />
																</div>
															</div>
														</div>
														<br />
														<div className='row g-4'>
															{formik.values.coa_sub_group_id ===
																6 && (
																<>
																	<div className='col-md-4'>
																		<br />
																		<FormGroup
																			id='cheque_no'
																			label='Cheque no'
																			isFloating>
																			<Input
																				type='text'
																				placeholder=''
																				onChange={
																					formik.handleChange
																				}
																				onBlur={
																					formik.handleBlur
																				}
																				value={
																					formik.values
																						.cheque_no
																				}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched
																						.cheque_no
																				}
																				invalidFeedback={
																					formik.errors
																						.cheque_no
																				}
																				validFeedback='Looks good!'
																			/>
																		</FormGroup>
																	</div>
																	<div className='col-md-4'>
																		<br />
																		<FormGroup
																			id='cheque_date'
																			label='Cheque date'
																			isFloating>
																			<Flatpickr
																				className='form-control'
																				value={
																					formik.values
																						.cheque_date
																				}
																				disabled={
																					!formik.values
																						.cheque_no &&
																					true
																				}
																				options={{
																					dateFormat:
																						'd/m/y',
																					allowInput: true,
																					defaultDate:
																						new Date(),
																				}}
																				onChange={(
																					date,
																					dateStr,
																				) => {
																					formik.setFieldValue(
																						'cheque_date',
																						dateStr,
																					);
																				}}
																				onClose={(
																					date,
																					dateStr,
																				) => {
																					formik.setFieldValue(
																						'cheque_date',
																						dateStr,
																					);
																				}}
																				id='default-picker'
																			/>
																		</FormGroup>
																	</div>
																</>
															)}
														</div>
													</CardBody>
												</div>
												<CardFooter>
													<CardFooterLeft>
														<Button
															type='reset'
															color='info'
															isOutline
															onClick={formik.resetForm}>
															Reset
														</Button>
													</CardFooterLeft>
													<CardFooterRight>
														<Button
															icon={
																isLoading ? null : 'Receive Amount'
															}
															isLight
															color={lastSave ? 'info' : 'success'}
															isDisable={isLoading}
															onClick={formik.handleSubmit}>
															{isLoading && (
																<Spinner isSmall inButton />
															)}
															{isLoading
																? (lastSave && 'Saving') || 'Saving'
																: (lastSave && 'Receive Amount') ||
																  'Receive Amount'}
														</Button>
													</CardFooterRight>
												</CardFooter>
											</Card>
										</div>
									</div>
									{/* <CardFooter className='px-0 pb-0'>
										<CardFooterLeft>
											<Button color='info' isOutline icon='DocumentScanner'>
												Action
											</Button>
										</CardFooterLeft>
										<CardFooterRight>
											<Button color='info' icon='CleaningServices'>
												Other Action
											</Button>
										</CardFooterRight>
									</CardFooter> */}
								</Card>
							</CardTabItem>
							<CardTabItem
								id='tab-item-2'
								title='Supplier Payment'
								icon='Architecture'>
								<Card shadow='none' className='border-0'>
									<InvestmentVoucher />
								</Card>
							</CardTabItem>
						</Card>

						<CardFooter />
					</Card>
				</div>
			</div>
		</PageWrapper>
	);
};

export default TablePage;
