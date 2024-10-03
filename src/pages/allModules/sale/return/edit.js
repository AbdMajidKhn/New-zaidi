// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import apiClient from '../../../../baseURL/api';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';

import InputGroup from '../../../../components/bootstrap/forms/InputGroup';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	let errors = {};

	if (values.sale_type === 1) {
		if (!values.walk_in_customer_name) {
			errors.walk_in_customer_name = 'Required';
		}
	}
	if (values.sale_type === 2) {
		if (!values.customer_id) {
			errors.customer_id = 'Required';
		}
	}

	if (!values.date) {
		errors.date = 'Required';
	}
	// if (!values.total_amount) {
	// 	errors.total_amount = 'Required';
	// }

	// if (!values.total_after_discount) {
	// 	errors.total_after_discount = 'Required';
	// }
	if (!values.childArray.length > 0) {
		errors.childArray = 'Add Items In childArray';
	}
	// if (!values.account_id) {
	// 	errors.account_id = 'Required';
	// }
	// if (values.discount < 0) {
	// 	errors.discount = 'Required';
	// }
	// if (values.total_after_discount < 0) {
	// 	errors.total_after_discount = 'Required';
	// }

	if (values.tax_type === 2 && values.sale_type === 1) {
		if (values.bank_amount_received + values.amount_received > values.total_after_gst) {
			errors.bank_amount_received = 'Amount exceeded';
			errors.amount_received = 'Amount exceeded';
		}
		if (values.bank_amount_received + values.amount_received < values.total_after_gst) {
			errors.bank_amount_received = 'Insufficent Amount';
			errors.amount_received = 'Insufficent Amount';
		}

		if (values.amount_received && !values.account_id) {
			errors.account_id = 'Required';
		}
		if (values.bank_amount_received && !values.bank_account_id) {
			errors.bank_account_id = 'Required';
		}
	} else if (values.tax_type === 1 && values.sale_type === 1) {
		if (values.bank_amount_received + values.amount_received > values.total_after_discount) {
			errors.bank_amount_received = 'Amount exceeded';
			errors.amount_received = 'Amount exceeded';
		}
		if (values.bank_amount_received + values.amount_received < values.total_after_discount) {
			errors.bank_amount_received = 'Insufficent Amount';
			errors.amount_received = 'Insufficent Amount';
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
				[`childArray[${index}]item_id`]: 'Required',
			};
		}

		if (!data.selectedBatch) {
			errors = {
				...errors,
				[`childArray[${index}]selectedBatch`]: 'Required',
			};
		}

		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
		if (!Number(data.rate) > 0) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'Required',
			};
		}
		// if (data.quantity > data.btachNumber.batchQty) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]quantity`]: 'Insufficient quantity',
		// 	};
		// }

		if (data.rate < data.min_price) {
			errors = {
				...errors,
				[`childArray[${index}]rate`]: 'Low rate',
			};
		}
	});

	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [showStats, setShowStats] = useState(true);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [saleRepDropDown, setSaleRepDropDownn] = useState([]);
	const [saleRepDropDownLoading, setSaleRepDropDownLoading] = useState([]);
	const [staterefresh, setStateRefresh] = useState(false);
	const [ReRender, setReRender] = useState(0);
	const [stateCustomer, setStateCustomer] = useState(false);
	const [customerDetails, setCustomerDetails] = useState([]);
	const [customerDetailsLoading, setCustomerDetailsLoading] = useState(false);
	const [cashAccountsOptions1, setCashAccountsOptions1] = useState([]);
	const [crAccountLoading1, setCrAccountLoading1] = useState(true);
	const [cashAccountsOptions, setCashAccountsOptions] = useState([]);
	const [crAccountLoading, setCrAccountLoading] = useState(true);

	const [customerDropDown, setCustomerDropDown] = useState([]);
	const [customerDropDownLoading, setCustomerDropDownLoading] = useState([]);
	const saleTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Walk in Customer',
		},
		{
			id: 2,
			value: 2,
			label: 'Registered Customer',
		},
	];
	const taxTypesOptions = [
		{
			id: 1,
			value: 1,
			label: 'Without GST',
		},
		{
			id: 2,
			value: 2,
			label: 'With GST',
		},
	];
	const formik = useFormik({
		initialValues: {
			...editingItem,
			bank_amount_received: '',
			amount_received: '',
			account_id: '',
			bank_account_id: '',
		},

		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};

	const calculateTotal = async () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data, index) => {
			data.total = data.quantity * data.rate;
			formik.values.childArray[index].total = data.quantity * data.rate || 0;
			formik.values.childArray[index].item_discount =
				(data.quantity * data.rate * data.item_discount_per) / 100 || 0;
			formik.values.childArray[index].item_total_after_discount =
				data.quantity * data.rate -
					(data.quantity * data.rate * (data.item_discount_per ?? 0)) / 100 || 0;
		});
		// formik.setFieldValue(`childArray`, arr);
		const p =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v ? v.total ?? 0 : 0)),
							0,
						),
				  )
				: 0;
		const d =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => (a += parseFloat(v ? v.item_discount ?? 0 : 0)),
							0,
						),
				  )
				: 0;
		formik.values.discount = d;
		formik.values.total_amount = p;
		formik.values.total_after_discount = Number(p ?? 0) - Number(formik.values.discount ?? 0);
		formik.values.gst =
			(Number(p ?? 0) - Number(formik.values.discount ?? 0)) *
			(Number(formik.values.gst_percentage ?? 0) / 100);
		formik.values.total_after_gst =
			Number(p ?? 0) - Number(formik.values.discount ?? 0) + Number(formik.values.gst ?? 0);
		// //  formik.setFieldValue('total', rate);
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 10)); // Wait for 1 second before returning
	};

	useEffect(() => {
		if (formik.values.tax_type === 1) {
			formik.setFieldValue('gst_percentage', 0);
		} else {
			formik.setFieldValue('gst_percentage', 18);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.tax_type]);
	useEffect(() => {
		formik.setFieldValue(
			`gst`,
			(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
		formik.setFieldValue(
			`total_after_gst`,
			Number(formik.values.total_after_discount) +
				(formik.values.total_after_discount * formik.values.gst_percentage) / 100,
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.gst_percentage]);
	useEffect(() => {
		const calculate = async () => {
			await calculateTotal();
			// code to run after the calculations are done
		};

		calculate();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculateTotal]);

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
	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCustomerDropDown(rec);
			setCustomerDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=4`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSaleRepDropDownn(rec);
			setSaleRepDropDownLoading(false);
		});

		// eslint-disable-next-line no-console

		apiClient.get(`/getItemsDropDownSale`).then((response) => {
			const rec = response.data.items.map(
				({ id, name, price, strength, iteminventory, strengthunit }) => ({
					id,
					value: id,
					label: `${name}${strength ? `-${strength}` : ''}${
						strengthunit ? `-${strengthunit.name}` : ''
					}`,
					retail: price,
					batchOptions: iteminventory.map((d) => ({
						id: Number(`${d.manufacture.id}${d.batch_no}`),
						value: Number(`${d.manufacture.id}${d.batch_no}`),
						label: `${d.manufacture.id}-${d.manufacture.name}-${d.batch_no}-(${d.item_available})`,
						batchQty: d.item_available,
						batchExpiry: d.expiry_date,
						manufacturer_id: d.manufacture.id,
						batch_no: d.batch_no,
					})),
				}),
			);
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
		// .catch((err) => {
		//
		// 	if (err.response.status === 401) {
		// 		showNotification(_titleError, err.response.data.message, 'Danger');
		// 	}
		// });

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const submitForm = (data) => {
		apiClient
			.post(`/updateSale`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
				}
			})
			.catch((err) => {
				setIsLoading(false);

				setIsLoading(false);
			});
	};

	const getExistingQty = (idx, val) => {
		if (val) {
			formik.setFieldValue(`childArray[${idx}].qty_available_loading`, true);

			apiClient.get(`/itemInventory?item_id=${val ? val.id : ''}`).then((response) => {
				formik.setFieldValue(`childArray[${idx}].qty_available_loading`, false);
				// formik.setFieldValue(`childArray[${idx}].rate`, response.data.data?.sale_price ?? 0);
				formik.setFieldValue(
					`childArray[${idx}].qty_available`,
					response.data.itemsInv.item_avaiable_inventory?.item_available ?? 0,
				);
				formik.setFieldValue(`childArray[${idx}].avg_price`, response.data.AvgPrice ?? 0);
				// formik.setFieldValue(
				// 	`childArray[${idx}].last_sale_price`,
				// 	response.data.data.last_sale_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`childArray[${idx}].min_price`,
				// 	response.data.data.min_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`childArray[${idx}].max_price`,
				// 	response.data.data.max_price ?? 0,
				// );
				setReRender(ReRender + 1);
			});

			// eslint-disable-next-line no-console
		}
	};
	const getPartSoldHistory = (item_id) => {
		if (formik.values.store_id && item_id) {
			setCustomerDetailsLoading(true);
			apiClient
				.get(
					`/getItemSaleHistory?item_id=${item_id}&customer_id=${
						formik.values.sale_type === 2 && formik.values.customer_id
							? formik.values.customer_id
							: ''
					}`,
				)
				.then((res) => {
					setCustomerDetails(res.data);
					setCustomerDetailsLoading(false);
				});
		}
	};
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-center align-items-top'>
						<div className='col-md-1 fs-4  d-flex justify-content-center align-items-top'>
							<strong>Type:</strong>
						</div>
						<div className='col-md-3'>
							<FormGroup label='' id='name'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
									options={saleTypesOptions}
									// isLoading={saleTypesOptionsLoading}
									value={
										formik.values.sale_type
											? saleTypesOptions?.find(
													(c) => c.value === formik.values.sale_type,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('sale_type', val ? val.id : '');
										formik.setFieldValue('customer_id', '');
										formik.setFieldValue('walk_in_customer_name', '');
									}}
								/>
							</FormGroup>
						</div>
						<div className='col-md-1 fs-4 d-flex justify-content-center align-items-top'>
							<strong>Tax:</strong>
						</div>
						<div className='col-md-3'>
							<FormGroup label='' id='name'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
									options={taxTypesOptions}
									// isLoading={saleTypesOptionsLoading}
									value={
										formik.values.tax_type
											? taxTypesOptions?.find(
													(c) => c.value === formik.values.tax_type,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('tax_type', val ? val.id : '');
									}}
								/>
							</FormGroup>
						</div>
					</div>
					<hr />
					<div className='row g-2  d-flex justify-content-start'>
						{formik.values.sale_type === 2 ? (
							<div className='col-md-4'>
								<FormGroup id='customer_id' label='Customer' className='col-md-12'>
									<InputGroup>
										<Select
											className='col-md-12'
											isClearable
											isLoading={customerDropDownLoading}
											options={customerDropDown}
											value={
												formik.values.customer_id
													? customerDropDown?.find(
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
												formik.setFieldValue(
													'customer_name',
													val !== null && val.label,
												);
											}}
											invalidFeedback={formik.errors.customer_id}
										/>
									</InputGroup>
								</FormGroup>
								{formik.errors.customer_id && (
									// <div className='invalid-feedback'>
									<p
										style={{
											color: '#f35421',
											textAlign: 'left',
											marginTop: '0.25rem',
											fontSize: '0.875em',
										}}>
										{formik.errors.customer_id}
									</p>
								)}
							</div>
						) : (
							<div className='col-md-4'>
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
										invalidFeedback={formik.errors.walk_in_customer_name}
									/>
								</FormGroup>
							</div>
						)}
						<div className='col-md-3'>
							<FormGroup id='sales_rep_id' label='Sales Rep' className='col-md-12'>
								<Select
									className='col-md-12'
									isClearable
									isLoading={saleRepDropDownLoading}
									options={saleRepDropDown}
									value={
										formik.values.sales_rep_id
											? saleRepDropDown?.find(
													(c) => c.value === formik.values.sales_rep_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('sales_rep_id', val ? val.id : '');
									}}
									invalidFeedback={formik.errors.sales_rep_id}
								/>
							</FormGroup>
							{formik.errors.sales_rep_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.sales_rep_id}
								</p>
							)}
						</div>
						<div className='col-md-2'>
							<FormGroup id='date' label='Date'>
								<Input
									type='date'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.date}
									isValid={formik.isValid}
									isTouched={formik.touched.date}
									invalidFeedback={formik.errors.date}
								/>
							</FormGroup>
						</div>
						<div className='col-md-2'>
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
							{formik.errors.remarks && (
								<p
									style={{
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.remarks}
								</p>
							)}
						</div>
					</div>
					<hr />
					{/* <CardBody className='table-responsive'> */}
					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-4'>Product</th>
								<th className='col-md-1'>In Stock</th>
								<th className='col-md-2'>Quantity</th>
								<th className='col-md-2'> price</th>
								<th className='col-md-2'> Total</th>
								<th
									className='col-md-1'
									// role='button'
									// tabIndex={0}
									onClick={() => {
										if (showStats === false) {
											setShowStats(true);
										} else {
											setShowStats(false);
										}
									}}>
									Remove
								</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.childArray.length > 0 &&
								formik.values.childArray.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-4 border-start border-end '>
											<FormGroup id={`childArray[${index}].item_id`}>
												<Select
													styles={customStyles}
													className='col-md-12'
													classNamePrefix='select'
													options={itemOptions}
													isLoading={itemOptionsLoading}
													// isClearable
													value={
														formik.values.childArray[index].item_id
															? itemOptions.find(
																	(c) =>
																		c.value ===
																		formik.values.childArray[
																			index
																		].item_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_id`,
															val ? val.id : '',
														);
														formik.setFieldValue(
															`childArray[${index}].selectedBatch`,
															'',
														);
														formik.setFieldValue(
															`childArray[${index}].batchDetails`,
															'',
														);
														formik.setFieldValue(
															`childArray[${index}].batchOptions`,
															val ? val.batchOptions : '',
														);
														formik.setFieldValue(
															`childArray[${index}].item_name`,
															val !== null && val.label,
														);

														getExistingQty(index, val);
													}}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																	?.item_id
															: ''
													}
													invalidFeedback={
														formik.errors[
															`childArray[${index}].item_id`
														]
													}
												/>
											</FormGroup>
											{formik.errors[`childArray[${index}]item_id`] && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#f35421',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors[`childArray[${index}]item_id`]}
												</p>
											)}

											<FormGroup
												className='mt-2'
												label='Batch'
												id={`childArray[${index}].selectedBatch`}>
												<Select
													styles={customStyles}
													className='col-md-12'
													classNamePrefix='select'
													options={items.batchOptions}
													isLoading={itemOptionsLoading}
													// isClearable
													value={
														formik.values.childArray[index]
															.selectedBatch
															? items.batchOptions.find(
																	(c) =>
																		c.id ===
																		formik.values.childArray[
																			index
																		].selectedBatch,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].selectedBatch`,
															val ? val.label : '',
														);
														formik.setFieldValue(
															`childArray[${index}].batchDetails`,
															val,
														);

														// formik.setFieldValue(
														// 	`childArray[${index}].quantity`,
														// 	'',
														// );
														// formik.setFieldValue(
														// 	`childArray[${index}].total`,
														// 	0,
														// );
													}}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																	?.selectedBatch
															: ''
													}
													invalidFeedback={
														formik.errors[
															`childArray[${index}].selectedBatch`
														]
													}
												/>
											</FormGroup>
											{formik.errors[`childArray[${index}]selectedBatch`] && (
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
															`childArray[${index}]selectedBatch`
														]
													}
												</p>
											)}
										</td>

										<td className='col-md-1 border-start border-end '>
											<FormGroup
												id={`childArray[${index}].qty_available`}
												label=''
												className='col-md-12'>
												<h5>
													{items.qty_available_loading ? (
														<h5>...</h5>
													) : (
														<>
															<p className='fs-6'>
																{items.qty_available ?? 0}
															</p>
															<hr />
															<p className='fs-6'>
																Batch qty{' '}
																{items.batchDetails.batchQty
																	? items.batchDetails.batchQty.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																	  )
																	: 0}
															</p>
															<p>
																{showStats && (
																	<div className='small text-muted'>
																		Avg Cost:
																		<br />
																		{items.avg_price
																			? items.avg_price.toLocaleString(
																					undefined,
																					{
																						maximumFractionDigits: 2,
																					},
																			  )
																			: 0}
																	</div>
																)}
															</p>
														</>
													)}
												</h5>
											</FormGroup>
										</td>

										<td className='col-md-2 border-start border-end '>
											<FormGroup
												id={`childArray[${index}].quantity`}
												label=''>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													min='0'
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].quantity`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);

														// setReRender(ReRender + 1);
													}}
													isTouched
													value={formik.values.childArray[index].quantity}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[
															`childArray[${index}]quantity`
														]
													}
												/>
											</FormGroup>
											<p className='fs-6'>
												Batch Exp {items.batchDetails.batchExpiry ?? 'None'}
											</p>
										</td>
										<td className='col-md-2 border-start border-end '>
											<FormGroup id={`childArray[${index}].rate`} label=''>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].rate`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);

														// setReRender(ReRender + 1);
													}}
													isTouched
													value={formik.values.childArray[index].rate}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[`childArray[${index}]rate`]
													}
												/>
											</FormGroup>
											<FormGroup
												id={`childArray[${index}].item_discount_per`}
												label='Discount%'>
												<Input
													size='sm'
													type='number'
													onWheel={(e) => e.target.blur()}
													onBlur={formik.handleBlur}
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].item_discount_per`,
															val.target.value,
														);
														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
														// setReRender(ReRender + 1);
													}}
													isTouched
													value={
														formik.values.childArray[index]
															.item_discount_per
													}
													isValid={formik.isValid}
													invalidFeedback={
														formik.errors[
															`childArray[${index}]item_discount_per`
														]
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-2 mt-1 border-start border-end '>
											<strong>
												{items.item_total_after_discount?.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
												) ?? 0}
											</strong>
											<hr />
											{formik.values.childArray[index].item_discount_per >
												0 && (
												<>
													<small>
														Tot:{' '}
														{items.total
															? items.total.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )
															: 0}
													</small>
													<hr />
													<small>
														Dis(
														{items.item_discount
															? items.item_discount.toLocaleString(
																	undefined,
																	{
																		maximumFractionDigits: 2,
																	},
															  )
															: 0}
														)
													</small>
												</>
											)}
										</td>
										<td className='col-md-1 align-items-center '>
											<Button
												// isDisable={
												// 	formik.values.childArray.length === 1
												// }
												icon='cancel'
												color='danger'
												onClick={() => removeRow(index)}
											/>
										</td>
									</tr>
								))}
						</tbody>
					</table>
					<hr />
					<div className='row g-4 d-flex align-items-top'>
						<div className='col-md-2 d-flex align-items-center'>
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
											batch_no: '',
											total_amount: '',
											item_discount: 0,
											item_total_after_discount: 0,
											expiry_date: '',
											rate: '',
											sales_tax: '',
											amount: 0,
											available_area_loading: '',
											item_available: '0',
											selectedBatch: '',
											items_options: [],
											items_options_loading: true,
											// item_id: '',
											qty_available: 0,
											total: 0,

											avg_price: 0,
											last_sale_price: 0,
											max_price: 0,
											min_price: 0,
											qty_available_loading: false,
											batchOptions: [],

											batchDetails: '',
										},
									]);
								}}>
								Add New Item
							</Button>
						</div>
						<div className='col-md-3'>
							<FormGroup id='total_amount' label='Total Amount' className='col-md-12'>
								<Input
									value={
										formik.values.total_amount
											? formik.values.total_amount.toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.total_amount}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='discount' label='Discount' className='col-md-12'>
								<Input
									value={
										formik.values.discount
											? formik.values.discount.toLocaleString(undefined, {
													maximumFractionDigits: 2,
											  })
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.discount}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup
								id='total_after_discount'
								label='Amount After Discount'
								className='col-md-12'>
								<Input
									value={
										formik.values.total_after_discount
											? formik.values.total_after_discount.toLocaleString(
													undefined,
													{
														maximumFractionDigits: 2,
													},
											  )
											: 0
									}
									disabled
									readOnly
									isValid={formik.isValid}
									isTouched
									invalidFeedback={formik.errors.total_after_discount}
								/>
							</FormGroup>
						</div>
					</div>
					<div className='row g-4 d-flex align-items-top'>
						{formik.values.tax_type === 2 && (
							<>
								<div className='col-md-2' />

								<div className='col-md-3'>
									<FormGroup
										id='gst_percentage'
										label='GST in %'
										className='col-md-12'>
										<Input
											onChange={(val) => {
												formik.setFieldValue(
													`gst_percentage`,
													val.target.value,
												);
												// formik.setFieldValue(
												// 	`gst`,
												// 	(formik.values
												// 		.total_after_discount *
												// 		val.target.value) /
												// 		100,
												// );
												// formik.setFieldValue(
												// 	`total_after_gst`,
												// 	Number(
												// 		formik.values
												// 			.total_after_discount,
												// 	) +
												// 		(formik.values
												// 			.total_after_discount *
												// 			val.target.value) /
												// 			100,
												// );

												setReRender(ReRender + 1);
											}}
											onBlur={formik.handleBlur}
											value={
												formik.values.gst_percentage
													? formik.values.gst_percentage.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
													  )
													: 0
											}
											isValid={formik.isValid}
											isTouched={formik.touched.discount}
											invalidFeedback={formik.errors.discount}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup readOnly id='GST' label='GST' className='col-md-12'>
										<Input
											readOnly
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={
												formik.values.gst
													? formik.values.gst.toLocaleString(undefined, {
															maximumFractionDigits: 2,
													  })
													: 0
											}
											isValid={formik.isValid}
											isTouched={formik.touched.gst}
											invalidFeedback={formik.errors.gst}
										/>
									</FormGroup>
								</div>
								<div className='col-md-3'>
									<FormGroup
										id='total_after_gst'
										label='Amount with GST'
										className='col-md-12'>
										<Input
											value={
												formik.values.total_after_gst
													? formik.values.total_after_gst.toLocaleString(
															undefined,
															{
																maximumFractionDigits: 2,
															},
													  )
													: 0
											}
											disabled
											readOnly
											isValid={formik.isValid}
											isTouched
											invalidFeedback={formik.errors.total_after_gst}
										/>
									</FormGroup>
								</div>
							</>
						)}
					</div>
					<div className='row g-4 d-flex align-items-top mt-3'>
						<div className='col-md-3'>
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
						<div className='col-md-4'>
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
										formik.setFieldValue('account_id', val.id);
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
					</div>
					<div className='row g-4 d-flex align-items-top'>
						<div className='col-md-3'>
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
						<div className='col-md-4'>
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
						<Button type='reset' color='info' isOutline onClick={formik.resetForm}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							className='mr-0'
							color='primary'
							onClick={() => {
								// generatePDF1(formik, 2);
							}}>
							Print
						</Button>
						<Button
							className='me-3'
							icon={isLoading ? null : 'Save'}
							isLight
							color='success'
							isDisable={isLoading}
							onClick={formik.handleSubmit}>
							{isLoading && <Spinner isSmall inButton />}
							{isLoading ? 'Saving' : 'Save'}
						</Button>
					</CardFooterRight>
				</CardFooter>
			</Card>
		</div>
	);
};
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit;
