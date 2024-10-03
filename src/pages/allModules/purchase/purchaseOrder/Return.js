// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import Select from 'react-select';
import moment from 'moment';

import PropTypes from 'prop-types';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

// import moment from 'moment';
// import { Cookies, useNavigate, demoPages } from '../../../../baseURL/authMultiExport';
import Spinner from '../../../../components/bootstrap/Spinner';
// import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import apiClient from '../../../../baseURL/api';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';

const validate = (values) => {
	let errors = {};
	if (!values.po_no) {
		errors.po_no = 'Required';
	}

	if (!values.return_date) {
		errors.return_date = 'Required';
	}
	if (values.po_type === 3) {
		if (!values.name) {
			errors.name = 'Required';
		}
	} else if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	if (!values.childArray.length > 0) {
		errors.childArray = 'Required';
	}

	if (values.po_type === 3) {
		if (values.bank_amount_received + values.amount_received > values.total_after_adv_tax) {
			errors.bank_amount_received = 'Amount exceeded';
			errors.amount_received = 'Amount exceeded';
		}
		if (values.bank_amount_received + values.amount_received < values.total_after_adv_tax) {
			errors.bank_amount_received = 'Insufficent Amount';
			errors.amount_received = 'Insufficent Amount';
		}

		if (values.amount_received && !values.account_id) {
			errors.account_id = 'Required';
		}
		if (values.bank_amount_received && !values.bank_account_id) {
			errors.bank_account_id = 'Required';
		}
	}
	if (values.amount_received && !values.account_id) {
		errors.account_id = 'Required';
	}
	if (values.bank_amount_received && !values.bank_account_id) {
		errors.bank_account_id = 'Required';
	}
	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}

		if (!data.manufacturer_id) {
			errors = {
				...errors,
				[`childArray[${index}]manufacturer_id`]: 'Required!',
			};
		}
		if (data.rate <= 0) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'Required!',
			};
		}
		if (data.quantity > data.purchased_qty - data.returned_qty) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'In-sufficent Quantity',
			};
		}

		if (data.quantity <= 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
		if (!data.batch_no) {
			errors = {
				...errors,
				[`childArray[${index}]batch_no`]: 'Required',
			};
		}
		if (!data.pack > 0) {
			errors = {
				...errors,
				[`childArray[${index}]pack`]: 'Required',
			};
		}

		if (!data.expiry_date) {
			errors = {
				...errors,
				[`childArray[${index}]expiry_date`]: 'Required',
			};
		}
		if (!data.amount > 0) {
			errors = {
				...errors,
				[`childArray[${index}]amount`]: 'Required',
			};
		}
	});
	console.log('errors', errors);
	return errors;
};
const Return = ({ editingItem, handleStateReturn }) => {
	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [categoryOptions, setSupplierOptions] = useState([]);
	const [manuOptions, setManuOptions] = useState([]);
	const [categoryOptionsLoading, setSupplierOptionsLoading] = useState(false);
	const [PONUMBER, SetPONUMBER] = useState('');
	// const [rate, SetPrice] = useState('');
	// const [total, SetUnit] = useState('');

	const [triggerCalculation, setTriggerCalculation] = useState(0);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

	const [lastSave, setLastSave] = useState(null);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);

		setHeaderCloseStatus(true);
	};

	const formik = useFormik({
		initialValues: {
			request_date: todayDate,
			bank_amount_received: '',
			amount_received: '',
			account_id: '',
			bank_account_id: '',
			name: '',
			return_date: todayDate,
			// childArray: [{ expiry_date: todayDate }],
			...editingItem,
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const handleSave = () => {
		setLastSave(moment());
		submitForm(formik);
	};

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};

	const submitForm = (myFormik) => {
		apiClient
			.post(`/purchaseOrderReturn`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					handleStateReturn(false);
					// refreshTableData();
					setIsLoading(false);
				} else {
					setIsLoading(false);
				}
			})
			.catch((err) => {
				setIsLoading(false);

				setIsLoading(false);
			});
	};
	useEffect(() => {
		if (state === true) {
			apiClient.get(`/getLatestpono`).then((response) => {
				// eslint-disable-next-line no-console
				formik.setFieldValue('po_no', response.data.po_no);
				SetPONUMBER(response.data.po_no);
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);
	useEffect(() => {
		apiClient.get(`/getItemsDropDownPo`).then((response) => {
			const rec = response.data.items.map(
				({ id, name, strength, manufacturerOptions, unit, strengthunit }) => ({
					id,
					value: id,
					label: `${name}${strength ? `-${strength}` : ''}${
						strengthunit ? `-${strengthunit.name}` : ''
					}`,
					unit,
					manufacturerOptions,
				}),
			);
			setItemOptions(rec);
			setItemOptions2(rec);
			setItemOptionsLoading(false);
		});

		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierOptions(rec);
			setSupplierOptionsLoading(false);
		});
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManuOptions(rec);
			setSupplierOptionsLoading(false);
		});
		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	useEffect(() => {
		apiClient.get(`/getAccountsBySubGroup?coa_sub_group_id=5`).then((response) => {
			const rec = response.data.coaAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
				// manufacturerOptions,
			}));
			setCashAccountsOptions(rec);

			setCrAccountLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getAccountsBySubGroup?coa_sub_group_id=6`).then((response) => {
			const rec = response.data.coaAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
				// manufacturerOptions,
			}));
			setCashAccountsOptions1(rec);

			setCrAccountLoading1(false);
		});

		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.amount = data.quantity * data.rate;
		});
		formik.setFieldValue(`childArray`, arr);

		const price =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => a + parseFloat(v !== undefined ? v.quantity * v.rate : 0),
							0,
						),
				  )
				: 0;
		formik.setFieldValue(`total`, price);
	};

	const calculateTotals = () => {
		const totalAfterDiscount = formik.values.total - formik.values.discount;
		const taxInFigure = (totalAfterDiscount * formik.values.tax) / 100;
		const totalAfterTax = totalAfterDiscount + taxInFigure;

		const advanceTaxInFigure = (totalAfterDiscount * formik.values.adv_tax_percentage) / 100;
		const totalAfterAdvanceTax = totalAfterTax + advanceTaxInFigure;

		formik.setFieldValue(`total_after_discount`, totalAfterDiscount);
		formik.setFieldValue(`tax_in_figure`, taxInFigure);
		formik.setFieldValue(`total_after_tax`, totalAfterTax);

		formik.setFieldValue(`adv_tax`, advanceTaxInFigure);
		formik.setFieldValue(`total_after_adv_tax`, totalAfterAdvanceTax);
	};
	useEffect(() => {
		calculateTotal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculateTotal]);
	useEffect(() => {
		calculateTotals();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculation]);
	useEffect(() => {
		setTriggerCalculation(triggerCalculation + 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.total]);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [itemOptions2, setItemOptions2] = useState([]);
	const refreshItemOptions = () => {
		const t = itemOptions2;

		const list = formik.values.childArray;
		const newArrayOptions = t.filter((option) => {
			return !list.some((child) => child.item_id === option.id);
		});
		setItemOptions(newArrayOptions);
	};
	useEffect(() => {
		refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-start'>
						<div className='col-md-2'>
							<FormGroup id='po_no' label='PO NO' className='col-md-12'>
								<Input
									readOnly
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.po_no}
									isValid={formik.isValid}
									isTouched={formik.touched.po_no}
									invalidFeedback={formik.errors.po_no}
								/>
							</FormGroup>
						</div>

						{formik.values.po_type !== 3 ? (
							<div className='col-md-3'>
								<FormGroup label='Supplier' id='supplier_id'>
									<Select
										className='col-md-12'
										classNamePrefix='select'
										menuIsOpen={false}
										isSearchable={false}
										components={{
											DropdownIndicator: () => null,
											IndicatorSeparator: () => null,
										}}
										options={categoryOptions}
										isLoading={categoryOptionsLoading}
										value={
											formik.values.supplier_id
												? categoryOptions.find(
														(c) =>
															c.value === formik.values.supplier_id,
												  )
												: null
										}
										onChange={(val) => {
											formik.setFieldValue(
												'supplier_id',
												val ? val.id : '',
												// setTableData(['']),
											);
										}}
									/>
								</FormGroup>
								{formik.errors.supplier_id && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: '#f35421',
											textAlign: 'left',
											marginTop: '0.25rem',
											fontSize: '0.875em',
										}}>
										{formik.errors.supplier_id}
									</p>
								)}
							</div>
						) : (
							<div className='col-md-2'>
								<FormGroup id='name' label='Name' className='col-md-12'>
									<Input
										readOnly
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.name}
										isValid={formik.isValid}
										isTouched={formik.touched.name}
										invalidFeedback={formik.errors.name}
									/>
								</FormGroup>
							</div>
						)}

						{formik.values.po_type === 2 ? (
							<div className='col-md-3'>
								<FormGroup label='Manufacturer' id='manufacturer_id'>
									<Select
										className='col-md-12'
										classNamePrefix='select'
										options={manuOptions}
										isLoading={categoryOptionsLoading}
										menuIsOpen={false}
										value={
											formik.values.manufacturer_id
												? manuOptions.find(
														(c) =>
															c.value ===
															formik.values.manufacturer_id,
												  )
												: null
										}
										onChange={(val) => {
											formik.setFieldValue(
												'manufacturer_id',
												val ? val.id : '',
												// setTableData(['']),
											);
										}}
									/>
								</FormGroup>
								{formik.errors.manufacturer_id && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: '#f35421',
											textAlign: 'left',
											marginTop: '0.25rem',
											fontSize: '0.875em',
										}}>
										{formik.errors.manufacturer_id}
									</p>
								)}
							</div>
						) : (
							''
						)}

						<div className='col-md-2'>
							<FormGroup id='return_date' label='Return Date'>
								<Input
									type='date'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.return_date}
									isValid={formik.isValid}
									isTouched={formik.touched.return_date}
									invalidFeedback={formik.errors.return_date}
								/>
							</FormGroup>
						</div>
						<div className='col-md-4'>
							<FormGroup id='remarks' label='Remarks' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.remarks}
									isValid={formik.isValid}
									isTouched={formik.touched.remarks}
									invalidFeedback={formik.errors.remarks}
								/>
							</FormGroup>
						</div>
					</div>
					<br />
					<hr />

					<table className='table  '>
						<thead>
							<tr className='row'>
								<th className='col-md-3'>Items</th>

								<th className='col-md-2'>Batch</th>
								<th className='col-md-2'>Pack Size</th>
								<th className='col-md-3 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-7'>Qty</div>

										<div className='col-md-5'>Rate</div>
									</div>
								</th>
								{/* <th className='col-md-1'>Rate</th> */}
								<th className='col-md-2 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-9'>Total </div>
										<div className='col-md-3'> </div>
									</div>
								</th>
							</tr>
						</thead>

						<tbody>
							<div
							// className='overflow-y-scroll'
							>
								{formik.values.childArray.length > 0 &&
									formik.values.childArray.map((items, index) => (
										<tr className='row' key={items.index}>
											<td className='col-md-3'>
												<div className='mb-2'>
													<FormGroup id={`childArray[${index}].item_id`}>
														<Select
															styles={customStyles}
															className='col-md-12'
															classNamePrefix='select'
															menuIsOpen={false}
															isSearchable={false}
															components={{
																DropdownIndicator: () => null,
																IndicatorSeparator: () => null,
															}}
															options={itemOptions}
															isLoading={itemOptionsLoading}
															value={
																formik.values.childArray[index]
																	.item_id
																	? itemOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.childArray[
																					index
																				].item_id,
																	  )
																	: null
															}
															onChange={(val) => {
																formik
																	.setFieldValue(
																		`childArray[${index}].item_id`,
																		val ? val.id : '',
																	)
																	.then(() => {
																		setTriggerRefreshItemOptions(
																			triggerRefreshItemOptions +
																				1,
																		);
																	});
																formik.setFieldValue(
																	`childArray[${index}].unit`,
																	val ? val.unit : '',
																);
																formik.setFieldValue(
																	`childArray[${index}].manufacturerOptions`,
																	val
																		? val.manufacturerOptions
																		: [],
																);
															}}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																			index
																	  ]?.item_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}].item_id`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`childArray[${index}]item_id`
													] && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: '#f35421',
																textAlign: 'left',
																marginTop: '0.25rem',
																fontSize: '0.875em',
															}}>
															{
																formik.errors[
																	`childArray[${index}]item_id`
																]
															}
														</p>
													)}
												</div>

												<div>
													<FormGroup
														label='Manufacture'
														id={`childArray[${index}].manufacturer_id`}>
														<Select
															styles={customStyles}
															className='col-md-12'
															classNamePrefix='select'
															menuIsOpen={false}
															isSearchable={false}
															components={{
																DropdownIndicator: () => null,
																IndicatorSeparator: () => null,
															}}
															options={items.manufacturerOptions}
															value={
																formik.values.childArray[index]
																	.manufacturer_id
																	? items.manufacturerOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.childArray[
																					index
																				].manufacturer_id,
																	  )
																	: null
															}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																			index
																	  ]?.manufacturer_id
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}].manufacturer_id`
																]
															}
														/>
													</FormGroup>
													{formik.errors[
														`childArray[${index}]manufacturer_id`
													] && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: '#f35421',
																textAlign: 'left',
																marginTop: '0.25rem',
																fontSize: '0.875em',
															}}>
															{
																formik.errors[
																	`childArray[${index}]manufacturer_id`
																]
															}
														</p>
													)}
												</div>
											</td>

											<td className='col-md-2'>
												<FormGroup
													id={`childArray[${index}].batch_no`}
													label=''
													className='col-md-12'>
													<Input
														// type='number'
														size='sm'
														readOnly
														onChange={(val) => {
															formik.setFieldValue(
																`childArray[${index}].batch_no`,
																val.target.value,
															);
														}}
														onBlur={formik.handleBlur}
														value={items.batch_no}
														isValid={formik.isValid}
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]
																		?.batch_no
																: ''
														}
														invalidFeedback={
															formik.errors[
																`childArray[${index}]batch_no`
															]
														}
													/>
												</FormGroup>
											</td>
											<td className='col-md-2'>
												<FormGroup
													id={`childArray[${index}].pack`}
													label=''
													className='col-md-12'>
													<InputGroup>
														<Input
															type='number'
															readOnly
															onWheel={(e) => e.target.blur()}
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].pack`,
																	val.target.value,
																);
															}}
															onBlur={formik.handleBlur}
															value={items.pack}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																			index
																	  ]?.pack
																	: ''
															}
															invalidFeedback={
																formik.errors[
																	`childArray[${index}]pack`
																]
															}
														/>
														<InputGroupText id='addon2'>
															{items.unit}
														</InputGroupText>
													</InputGroup>
												</FormGroup>
												<FormGroup id='expiry_date' label='Exp Date'>
													<Input
														type='date'
														readOnly
														onChange={(val) => {
															formik.setFieldValue(
																`childArray[${index}].expiry_date`,
																val.target.value,
															);
														}}
														onBlur={formik.handleBlur}
														value={items.expiry_date}
														isValid={formik.isValid}
														// isTouched
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]
																		?.expiry_date
																: ''
														}
														invalidFeedback={
															formik.errors[
																`childArray[${index}]expiry_date`
															]
														}
													/>
												</FormGroup>
											</td>

											<td className='col-md-3 align-items-center justify-content-center'>
												<div className='row'>
													<div className='col-md-7'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].quantity`,
																		val.target.value,
																	);

																	setTriggerCalculateTotal(
																		triggerCalculateTotal + 1,
																	);
																}}
																onBlur={formik.handleBlur}
																value={items.quantity}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																				index
																		  ]?.quantity
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]quantity`
																	]
																}
															/>
														</FormGroup>
														<div className='fs-6 ms-2'>
															Purchase Qty{' '}
															{items.purchased_qty ?? 'None'}
														</div>
														<div className='fs-6 ms-2'>
															Returned Qty{' '}
															{items.returned_qty ?? 'None'}
														</div>
														<div className='fs-6'>
															Remained Qty{' '}
															{items.purchased_qty -
																items.returned_qty ?? 'None'}
														</div>
													</div>
													<div className='col-md-5'>
														<FormGroup
															id={`childArray[${index}].rate`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].rate`,
																		val.target.value,
																	);
																	setTriggerCalculateTotal(
																		triggerCalculateTotal + 1,
																	);
																}}
																onBlur={formik.handleBlur}
																value={
																	formik.values.childArray[index]
																		.rate
																}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																				index
																		  ]?.rate
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]rate`
																	]
																}
															/>
														</FormGroup>
													</div>
												</div>
											</td>
											{/* <td className='col-md-2'>
											
										</td> */}
											<td className='col-md-2 align-items-center justify-content-center'>
												<div className='row'>
													<FormGroup
														className='col-md-9 mt-2'
														id={`childArray[${index}].amount`}
														label=''
														type='number'>
														<strong>
															{items.amount
																? items.amount.toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		},
																  )
																: 0}
														</strong>
													</FormGroup>
													<Button
														className='col-md-3 mt-1'
														isDisable={
															formik.values.childArray.length === 1
														}
														icon='cancel'
														color='danger'
														// onClick={() => removeRow(index)}
														onClick={() => {
															removeRow(index);

															setTriggerCalculateTotal(
																triggerCalculateTotal + 1,
															);
														}}
													/>
												</div>
											</td>
										</tr>
									))}
							</div>
							<tr>
								<div className='row align-items-bottom justify-content-end'>
									{/* 		<td className='col-md-6 align-items-center justify-content-start'>
										<div className='row g-4 d-flex align-items-end'>
											<div className='col-md-12 d-flex align-items-center'>
												<br />
												<Button
													color='primary'
													icon='add'
													onClick={() => {
														formik.setFieldValue('childArray', [
															...formik.values.childArray,
															{
																item_id: '',
																quantity: '',
																rate: '',
																total: 0,
																pack: '',
																expiry_date: '',
																batch_no: '',
															},
														]);
													}}>
													Add New Item
												</Button>
											</div>
										</div>
									</td> */}
									<td className='col-md-2 align-items-center justify-content-end'>
										<div className='row'>
											<p className='col-md-9 mt-2' label=''>
												<strong>Total</strong>
											</p>
										</div>
									</td>
									<td className='col-md-2 align-items-center justify-content-center'>
										<div className='row'>
											<FormGroup className='col-md-9 mt-2' label=''>
												<strong>
													{formik.values.total
														? formik.values.total.toLocaleString(
																undefined,
																{
																	maximumFractionDigits: 2,
																},
														  )
														: 0}
												</strong>
											</FormGroup>
										</div>
									</td>
								</div>
							</tr>
							<hr />
						</tbody>
					</table>

					<br />
					<div className='row g-2  d-flex justify-content-start'>
						{/* <div className='col-md-2 align-items-bottom justify-content-center'>
										<FormGroup
											className='col-md-9'
											id='total'
											label='Total Amount'>
											<p>
												<strong className=''>{formik.values.total}</strong>
											</p>
										</FormGroup>
									</div> */}
						<div className='col-md-2'>
							<FormGroup id='discount' label='Deduction' className='col-md-12'>
								<Input
									onChange={(val) => {
										formik
											.setFieldValue(`discount`, val.target.value)
											.then(() => {
												setTriggerCalculation(triggerCalculation + 1);
											});
										// formik.setFieldValue(
										// 	`total_after_discount`,
										// 	formik.values.total - val.target.value,
										// );
									}}
									onBlur={formik.handleBlur}
									value={formik.values.discount}
									isValid={formik.isValid}
									isTouched={formik.touched.discount}
									invalidFeedback={formik.errors.discount}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-10  mt-2'
								id='total_after_discount'
								label='Total after deduction'>
								<p>
									<strong className=''>
										{formik.values.total_after_discount}
									</strong>
								</p>
							</FormGroup>
						</div>
						<div className='col-md-2'>
							<FormGroup id='tax' label='Tax %' className='col-md-12'>
								<Input
									onChange={(val) => {
										formik.setFieldValue(`tax`, val.target.value).then(() => {
											setTriggerCalculation(triggerCalculation + 1);
										});
										
									}}
									onBlur={formik.handleBlur}
									value={formik.values.tax}
									isValid={formik.isValid}
									isTouched={formik.touched.tax}
									invalidFeedback={formik.errors.tax}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='tax_in_figure'
								label='Tax in figures'>
								<p>
									<strong className=''>{formik.values.tax_in_figure}</strong>
								</p>
							</FormGroup>
						</div>
						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='tax_in_figure'
								label='Total after Tax'>
								<p>
									<strong className=''>
										{formik.values.total_after_tax
											? formik.values.total_after_tax.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
											  )
											: 0}
									</strong>
								</p>
							</FormGroup>
						</div>

						{/* advance tax */}
						<div className='col-md-2'>
							<FormGroup id='adv_tax_percentage' label='Advance Tax %' className='col-md-12'>
								<Input
									onChange={(val) => {
										formik.setFieldValue(`adv_tax_percentage`, val.target.value).then(() => {
											setTriggerCalculation(triggerCalculation + 1);
										});
										
									}}
									onBlur={formik.handleBlur}
									value={formik.values.adv_tax_percentage}
									isValid={formik.isValid}
									isTouched={formik.touched.adv_tax_percentage}
									invalidFeedback={formik.errors.adv_tax_percentage}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='adv_tax'
								label='Tax in figures'>
								<p>
									<strong className=''>{formik.values.adv_tax}</strong>
								</p>
							</FormGroup>
						</div>
						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='adv_tax'
								label='Total after Tax'>
								<p>
									<strong className=''>
										{formik.values.total_after_adv_tax
											? formik.values.total_after_adv_tax.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
											  )
											: 0}
									</strong>
								</p>
							</FormGroup>
						</div>
					</div>
					<hr />
					<div className='row g-2  d-flex justify-content-start mt-2'>
						<div className='col-md-2'>
							<FormGroup
								id='amount_received'
								label='Received Amount (Cash)'
								className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onBlur={formik.handleBlur}
									// readOnly={formik.values.sale_type === 1}
									onChange={formik.handleChange}
									value={formik.values.amount_received}
									isValid={formik.isValid}
									isTouched={formik.touched.amount_received}
									invalidFeedback={formik.errors.amount_received}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='account_id' label='Cash Account'>
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
										formik.setFieldValue('account_id', val ? val.id : '');
										formik.setFieldValue(
											'coa_sub_group_id',
											val.coa_sub_group_id,
										);
										if (val.coa_sub_group_id !== 2) {
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
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.account_id}
								</p>
							)}
						</div>
						<div className='col-md-2'>
							<FormGroup
								id='bank_amount_received'
								label='Received Amount (Bank)'
								className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onBlur={formik.handleBlur}
									// readOnly={formik.values.sale_type === 1}
									onChange={formik.handleChange}
									value={formik.values.bank_amount_received}
									isValid={formik.isValid}
									isTouched={formik.touched.bank_amount_received}
									invalidFeedback={formik.errors.bank_amount_received}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='bank_account_id' label='Bank Account'>
								<Select
									className='col-md-12 '
									classNamePrefix='select'
									options={cashAccountsOptions1}
									isLoading={crAccountLoading1}
									value={
										formik.values.bank_account_id &&
										cashAccountsOptions1.find(
											(c) => c.value === formik.values.bank_account_id,
										)
									}
									onChange={(val) => {
										formik.setFieldValue('bank_account_id', val.id);
										formik.setFieldValue(
											'coa_sub_group_id',
											val.coa_sub_group_id,
										);
										if (val.coa_sub_group_id !== 2) {
											formik.setFieldValue('cheque_no', '');
										}
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.bank_account_id}
									invalidFeedback={formik.errors.bank_account_id}
									validFeedback='Looks good!'
								/>
							</FormGroup>
							{formik.errors.bank_account_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.bank_account_id}
								</p>
							)}
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							onClick={() => {
								formik.resetForm();
								setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);

								setStateRefresh(!staterefresh);
							}}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							className='me-3'
							icon={isLoading ? null : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading
								? (lastSave && 'Updating') || 'Updating'
								: (lastSave && 'Update') || 'Update'}
						</Button>
					</CardFooterRight>
				</CardFooter>
			</Card>
		</div>
	);
};

Return.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	handleStateReturn: PropTypes.func.isRequired,
};

export default Return;
