// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */

// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';
import Flatpickr from 'react-flatpickr';

import Select from 'react-select';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Spinner from '../../../../components/bootstrap/Spinner';

// import AddCoeSubGroup from './modals/AddCoeSubGroup';
// import AddAccount from './modals/AddAccount';

import Button from '../../../../components/bootstrap/Button';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';

const validate = (values) => {
	const errors = {};

	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	if (!values.po_id) {
		errors.po_id = 'Required';
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
	const [state, setState] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [sizeStatus, setSizeStatus] = useState(null);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setSizeStatus('md');
		setFullScreenStatus(null);
		setAnimationStatus(true);
		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			supplier_id: '',
			po_id: '',
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
	const [supplierOptions, setSupplierOptions] = useState([]);
	const [supplierOptionsLoading, setSupplierOptionsLoading] = useState(true);
	const [customerInvoices, setCustomerInvoices] = useState([]);
	const [customerInvoicesLoading, setCustomerInvoicesLoading] = useState(true);

	useEffect(() => {
		formik.setFieldValue('po_id', '');
		setCustomerInvoicesLoading(true);
		if (formik.values.supplier_id) {
			apiClient
				.get(`/getPoBySupplier?supplier_id=${formik.values.supplier_id}`)
				.then((response) => {
					const rec = response.data.PurchaseOrders.map(
						({ id, po_no, receive_date, total_after_tax }) => ({
							id,
							value: id,
							label: `${po_no}-${receive_date}-(${total_after_tax})`,
						}),
					);
					setCustomerInvoices(rec);
					setCustomerInvoicesLoading(false);

					//   setLoading(false)
				})
				.catch((err) => console.log(err));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.supplier_id]);

	useEffect(() => {
		setSupplierOptionsLoading(true);
		setCrAccountLoading(true);

		apiClient
			.get(`/getPersonsDropDown?person_type=2`)
			.then((response) => {
				const rec = response.data.persons.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSupplierOptions(rec);
				setSupplierOptionsLoading(false);

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
			.post(`/poPaymentVoucher`, myFormik.values, {})
			.then((res) => {
				if (res.data.status === 'ok') {
					setState(false);
					myFormik.resetForm();
				}
				setIsLoading(false);

				setLastSave(moment());
			})
			.catch((err) => {
				setIsLoading(false);
			});
	};
	// Booking End

	// const [coaAccountsView, setCoaAccountsView] = useState([]);
	// const [coaMainAccountsView, setCoaMainAccountsView] = useState([]);

	return (
		<div className='row'>
			<div className='col-12'>
				<Card stretch tag='form' onSubmit={formik.handleSubmit}>
					<div className='row g-4'>
						<CardBody className='col-md-6 border-end'>
							<div className='row g-4'>
								<div className='col-md-4'>
									<FormGroup
										id='supplier_id'
										label='Supplier'
										className='col-md-12'>
										<Select
											className='col-md-12'
											// isClearable
											classNamePrefix='select'
											options={supplierOptions}
											isLoading={supplierOptionsLoading}
											value={
												formik.values.supplier_id &&
												supplierOptions.find(
													(c) => c.value === formik.values.supplier_id,
												)
											}
											// value={formik.values.mouza_id}
											onChange={(val) => {
												formik.setFieldValue('supplier_id', val.id);
											}}
											isValid={formik.isValid}
											isTouched={formik.touched.supplier_id}
											invalidFeedback={formik.errors.supplier_id}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.supplier_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.supplier_id}
										</p>
									)}
								</div>
								<div className='col-md-4'>
									<FormGroup id='po_id' label='PO' className='col-md-12'>
										<Select
											className='col-md-12'
											isMulti
											// isClearable
											classNamePrefix='select'
											options={customerInvoices}
											isLoading={customerInvoicesLoading}
											value={
												formik.values.po_id &&
												customerInvoices.find(
													(c) => c.value === formik.values.po_id,
												)
											}
											// value={formik.values.mouza_id}
											onChange={(val) => {
												formik.setFieldValue(
													'po_id',
													val.map(option => option.id)
												);
											}}
											
											isValid={formik.isValid}
											isTouched={formik.touched.po_id}
											invalidFeedback={formik.errors.po_id}
											validFeedback='Looks good!'
										/>
									</FormGroup>
									{formik.errors.po_id && (
										// <div className='invalid-feedback'>
										<p
											style={{
												color: 'red',
											}}>
											{formik.errors.po_id}
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
											onChange={(date, dateStr) => {
												formik.setFieldValue('date', dateStr);
											}}
											onClose={(date, dateStr) => {
												formik.setFieldValue('date', dateStr);
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
										<FormGroup id='account_id' label='Paid From'>
											<Select
												className='col-md-12 '
												classNamePrefix='select'
												options={cashAccountsOptions}
												isLoading={crAccountLoading}
												value={
													formik.values.account_id &&
													cashAccountsOptions.find(
														(c) => c.value === formik.values.account_id,
													)
												}
												onChange={(val) => {
													formik.setFieldValue('account_id', val.id);
													formik.setFieldValue(
														'coa_sub_group_id',
														val.coa_sub_group_id,
													);
													if (val.coa_sub_group_id !== 6) {
														formik.setFieldValue('cheque_no', '');
													}
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.account_id}
												invalidFeedback={formik.errors.account_id}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										{formik.errors.account_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: 'red',
												}}>
												{formik.errors.account_id}
											</p>
										)}
									</div>
									<div className='col-md-6'>
										<FormGroup id='amount' label='Amount'>
											<Input
												type='number'
												min='0'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.amount}
												isValid={formik.isValid}
												isTouched
												invalidFeedback={formik.errors.amount}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										<br />
									</div>
								</div>
							</div>
							<br />
							<div className='row g-4'>
								{formik.values.coa_sub_group_id === 6 && (
									<>
										<div className='col-md-4'>
											<br />
											<FormGroup id='cheque_no' label='Cheque no' isFloating>
												<Input
													type='text'
													placeholder=''
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.cheque_no}
													isValid={formik.isValid}
													isTouched={formik.touched.cheque_no}
													invalidFeedback={formik.errors.cheque_no}
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
													value={formik.values.cheque_date}
													disabled={!formik.values.cheque_no && true}
													options={{
														dateFormat: 'd/m/y',
														allowInput: true,
														defaultDate: new Date(),
													}}
													onChange={(date, dateStr) => {
														formik.setFieldValue(
															'cheque_date',
															dateStr,
														);
													}}
													onClose={(date, dateStr) => {
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
							<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
								Reset
							</Button>
						</CardFooterLeft>
						<CardFooterRight>
							<Button
								icon={isLoading ? null : 'Pay Amount'}
								isLight
								color={lastSave ? 'info' : 'danger'}
								isDisable={isLoading}
								onClick={formik.handleSubmit}>
								{isLoading && <Spinner isSmall inButton />}
								{isLoading
									? (lastSave && 'Saving') || 'Saving'
									: (lastSave && 'Pay Amount') || 'Pay Amount'}
							</Button>
						</CardFooterRight>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
};

export default TablePage;
