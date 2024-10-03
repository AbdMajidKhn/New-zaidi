// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import apiClient from '../../../../baseURL/api';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
// import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';
// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';

import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	let errors = {};

	// if (!values.total) {
	// 	errors.total = 'Required';
	// }
	if (!values.receive_date) {
		errors.receive_date = 'Required';
	}

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}
		if (values.po_type === 1) {
			if (!data.manufacturer_id) {
				errors = {
					...errors,
					[`childArray[${index}]manufacturer_id`]: 'Required!',
				};
			}
		}
		// if (!data.purchase_price > 0) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]purchase_price`]: 'Required!',
		// 	};
		// }

		if (!data.quantity > 0) {
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
		if (data.received_quantity > data.quantity) {
			errors = {
				...errors,
				[`childArray[${index}]received_quantity`]: 'Insufficent Recieved Quantity',
			};
		}
		if (!data.received_quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]received_quantity`]: 'Required',
			};
		}

		if (data.expiry_date === '') {
			errors = {
				...errors,
				[`childArray[${index}].expiry_date`]: 'Expiry date is required',
			};
		}

		// if (!data.amount > 0) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]amount`]: 'Required',
		// 	};
		// }
	});
	return errors;
};

// eslint-disable-next-line react/prop-types
const Recieve = ({ editingItem, handleStateReceive }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const [triggerCalculatePrice, setTriggerCalculatePrice] = useState(0);
	const [staterefresh, setStateRefresh] = useState(false);

	const [manufacturererDropDown, setManufacturerDropDown] = useState([]);
	const [manufacturererDropDownLoading, setManufacturerDropDownLoading] = useState([]);
	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;
	// const expDate = getDatePlusMonths(2);

	const formik = useFormik({
		initialValues: {
			...editingItem,
			receive_date: todayDate,
			adv_tax_percentage: ''
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	console.log('forik', formik)

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};
	const submitForm = (data) => {
		apiClient
			.post(`/receivePurchaseOrder`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					handleStateReceive(false);
					setIsLoading(false);
					setLastSave(moment());
				} else {
					setIsLoading(false);
				}
			})
			.catch(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		apiClient.get(`/getItemsDropDown`).then((response) => {
			const rec = response.data.items.map(({ id, name, strength, strengthunit }) => ({
				id,
				value: id,
				label: `${name}${strength ? `-${strength}` : ''}${strengthunit ? `-${strengthunit.name}` : ''
					}`,
			}));
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManufacturerDropDown(rec);
			setManufacturerDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.amount = data.received_quantity * data.purchase_price;
		});
		formik.setFieldValue(`childArray`, arr);

		const price =
			arr !== null
				? Number(
					arr?.reduce(
						// eslint-disable-next-line no-return-assign
						(a, v) =>
							a +
							parseFloat(
								v !== undefined ? v.received_quantity * v.purchase_price : 0,
							),
						0,
					),
				)
				: 0;
		formik.setFieldValue(`total`, price);
	};
	const calculatePrice = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.purchase_price = data.amount / data.received_quantity;
		});
		formik.setFieldValue(`childArray`, arr);

		const totalPrice =
			arr !== null
				? Number(
					arr?.reduce(
						// eslint-disable-next-line no-return-assign
						(a, v) =>
							a +
							parseFloat(
								v !== undefined ? v.received_quantity / v.amount : 0,
							),
						0,
					),
				)
				: 0;
		formik.setFieldValue(`purchase_price`, totalPrice);
	};



	// const calculateOptions = () => {
	// 	const totalAfterDiscount = formik.values.total - formik.values.discount;
	// 	const taxInFigure = (totalAfterDiscount * formik.values.tax) / 100;
	// 	const totalAfterTax = totalAfterDiscount + taxInFigure;

	// 	const advanceTaxInFigure = (totalAfterDiscount * formik.values.adv_tax_percentage) / 100;
	// 	const totalAfterAdvanceTax = totalAfterTax + advanceTaxInFigure;

	// 	formik.setFieldValue(`total_after_discount`, totalAfterDiscount);
	// 	formik.setFieldValue(`tax_in_figure`, taxInFigure);
	// 	formik.setFieldValue(`total_after_tax`, totalAfterTax);

	// 	formik.setFieldValue(`adv_tax`, advanceTaxInFigure);
	// 	formik.setFieldValue(`total_after_adv_tax`, totalAfterAdvanceTax);
	// };

	const handleAmountChange = (index, val) => {
		const newAmount = val.target.value;
	
		// Update the specific item's amount
		formik.setFieldValue(`childArray[${index}].amount`, newAmount);
	
		// Use a callback function to ensure we're using the latest state
		const currentChildArray = formik.values.childArray;
	
		// Calculate the new total immediately
		const newTotal = currentChildArray.reduce((acc, item, idx) => {
			// Only sum up amounts that have valid numbers
			return acc + (parseFloat(idx === index ? newAmount : item.amount) || 0);
		}, 0);
	
		// Set the new total
		formik.setFieldValue('total', newTotal);
	
		// Increment trigger for calculating price
		setTriggerCalculatePrice(triggerCalculatePrice + 1);
	};
	
	
	
	const calculateOptions = () => {
		// Check if adv_tax_percentage is a valid number
		if (Number.isNaN(Number(formik.values.adv_tax_percentage))) {
			// Handle the case where adv_tax_percentage is not a valid number, e.g., set it to 0 or show an error message
			formik.setFieldValue(`adv_tax`, 0);
			formik.setFieldValue(`total_after_adv_tax`, formik.values.total_after_tax);
			return;
		}

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
		calculatePrice();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculatePrice]);

	useEffect(() => {
		calculateOptions();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions, formik.values.discount, formik.values.tax]);
	useEffect(() => {
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.total, formik.values.discount]);

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-start'>
						<div className='col-md-2'>
							<FormGroup
								id='invoice_no'
								label='Invoive No'
								type='number'
								className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.invoice_no}
									isValid={formik.isValid}
									isTouched={formik.touched.invoice_no}
									invalidFeedback={formik.errors.invoice_no}
								/>
							</FormGroup>

						</div>
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

						<div className='col-md-3'>
							<FormGroup id='supplier_id' label='Supplier' className='col-md-12'>
								<Select
									className='col-md-12'
									menuIsOpen={false}
									isSearchable={false}
									components={{
										DropdownIndicator: () => null,
										IndicatorSeparator: () => null,
									}}
									isLoading={supplierDropDownLoading}
									options={supplierDropDown}
									value={
										formik.values.supplier_id
											? supplierDropDown?.find(
												(c) => c.value === formik.values.supplier_id,
											)
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('supplier_id', val ? val.id : '');
									}}
									invalidFeedback={formik.errors.supplier_id}
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
						{formik.values.po_type === 2 && (
							<div className='col-md-3'>
								<FormGroup
									id='manufacturer_id'
									label='Manufacturer'
									className='col-md-12'>
									<Select
										className='col-md-12'
										menuIsOpen={false}
										isSearchable={false}
										components={{
											DropdownIndicator: () => null,
											IndicatorSeparator: () => null,
										}}
										isLoading={manufacturererDropDownLoading}
										options={manufacturererDropDown}
										value={
											formik.values.manufacturer_id
												? manufacturererDropDown?.find(
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
											);
										}}
										invalidFeedback={formik.errors.manufacturer_id}
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
						)}

						<div className='col-md-2'>
							<FormGroup id='request_date' label='Request Date'>
								<Input
									type='date'
									readOnly
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.request_date}
									isValid={formik.isValid}
									isTouched={formik.touched.request_date}
									invalidFeedback={formik.errors.request_date}
								/>
							</FormGroup>
						</div>
						<div className='col-md-2'>
							<FormGroup id='receive_date' label='Receive Date'>
								<Input
									type='date'
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.receive_date}
									isValid={formik.isValid}
									isTouched={formik.touched.receive_date}
									invalidFeedback={formik.errors.receive_date}
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
						</div>
					</div>
					<br />
					<hr />

					<table className='table  '>
						<thead>
							<tr className='row'>
								<th className='col-md-3'>Items</th>
								<th className='col-md-2'>Pack Size</th>
								<th className='col-md-1'>Batch</th>
								<th className='col-md-1'>Quantity</th>

								<th className='col-md-3 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-6'>Receieved Quantity</div>
										<div className='col-md-6'>Purchase Price</div>
									</div>
								</th>
								{/* <th className='col-md-1'>purchase_price</th> */}
								<th className='col-md-2 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-9'>Total Amount</div>
										<div className='col-md-3'> </div>
									</div>
								</th>
							</tr>
						</thead>

						<tbody>
							{formik.values.childArray.length > 0 &&
								formik.values.childArray.map((items, index) => (
									<tr className='row' key={items.index}>
										<td className='col-md-3'>
											<div>
												<FormGroup
													label=''
													id={`childArray[${index}].item_id`}>
													<Select
														// isClearable
														menuIsOpen={false}
														styles={customStyles}
														isSearchable={false}
														components={{
															DropdownIndicator: () => null,
															IndicatorSeparator: () => null,
														}}
														className='col-md-12'
														classNamePrefix='select'
														options={itemOptions}
														isLoading={itemOptionsLoading}
														value={
															items.item_id
																? itemOptions.find(
																	(c) =>
																		c.value ===
																		items.item_id,
																)
																: null
														}
														onChange={(val) => {
															formik.setFieldValue(
																`childArray[${index}].item_id`,
																val ? val.id : '',
															);
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
														{
															formik.errors[
															`childArray[${index}]item_id`
															]
														}
													</p>
												)}
											</div>
											{formik.values.po_type === 1 && (
												<div>
													<FormGroup
														label='Manufacturer'
														id={`childArray[${index}].manufacturer_id`}>
														<Select
															// isClearable
															// menuIsOpen={false}
															styles={customStyles}
															// isSearchable={false}
															// components={{
															// 	DropdownIndicator: () => null,
															// 	IndicatorSeparator: () => null,
															// }}
															className='col-md-12'
															classNamePrefix='select'
															options={items.manufacturerOptions}
															isLoading={itemOptionsLoading}
															value={
																items.manufacturer_id
																	? items.manufacturerOptions.find(
																		(c) =>
																			c.value ===
																			items.manufacturer_id,
																	)
																	: null
															}
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].manufacturer_id`,
																	val ? val.id : '',
																);
															}}
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
											)}
										</td>

										<td className='col-md-3'>
											<div className='row'>
												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].pack`}
														label=''
														className='col-md-12'>
														<InputGroup>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].pack`,
																		val.target.value,
																	);
																}}
																size='sm'
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
												</div>
												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].batch_no`}
														label=''
														className='col-md-12'>
														<Input
															// type='number'
															size='sm'
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
																	? formik.touched.childArray[
																		index
																	]?.batch_no
																	: ''
															}
															invalidFeedback={
																formik.errors[
																`childArray[${index}]batch_no`
																]
															}
														/>
													</FormGroup>
												</div>
											</div>

											<FormGroup id='expiry_date' label='Exp Date'>
												<Input
													type='date'
													onChange={(val) => {
														formik.setFieldValue(
															`childArray[${index}].expiry_date`,
															val.target.value,
														);
													}}
													onBlur={formik.handleBlur}
													value={
														formik.values.childArray[index].expiry_date
													}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																?.expiry_date
															: ''
													}
													invalidFeedback={
														formik.errors[
														`childArray[${index}].expiry_date`
														]
													}
												/>
											</FormGroup>
										</td>
										<td className='col-md-1  mt-2'>
											<strong>{items.quantity}</strong>
										</td>
										<td className='col-md-3 align-items-center justify-content-center'>
											<div className='row'>
												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].received_quantity`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															size='sm'
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].received_quantity`,
																	val.target.value,
																);

																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
															onBlur={formik.handleBlur}
															value={items.received_quantity}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																		index
																	]?.received_quantity
																	: ''
															}
															invalidFeedback={
																formik.errors[
																`childArray[${index}]received_quantity`
																]
															}
														/>
													</FormGroup>
												</div>
												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].purchase_price`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															size='sm'
															onChange={(val) => {
																formik.setFieldValue(
																	`childArray[${index}].purchase_price`,
																	val.target.value,
																);
																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
															onBlur={formik.handleBlur}
															value={
																formik.values.childArray[index]
																	.purchase_price
															}
															isValid={formik.isValid}
															isTouched={
																formik.touched.childArray
																	? formik.touched.childArray[
																		index
																	]?.purchase_price
																	: ''
															}
															invalidFeedback={
																formik.errors[
																`childArray[${index}]purchase_price`
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
												<FormGroup className='col-md-9 mt-2' id={`childArray[${index}].amount`}>
													<Input
														type='number'
														name={`childArray[${index}].amount`}
														value={items.amount ?? 0}
														// onChange={(val) => {
														// 	formik.setFieldValue(
														// 		`childArray[${index}].amount`,
														// 		val.target.value,
														// 	);
														// 	formik.setFieldValue(
														// 		`total`,
														// 		val.target.value,
														// 	);
														// 	setTriggerCalculatePrice(
														// 		triggerCalculatePrice + 1,
														// 	);
														// }}
														onChange={(val) => handleAmountChange(index, val)} // Updated handler

													/>
												</FormGroup>

												<Button
													className='col-md-3 mt-1'
													isDisable={
														formik.values.childArray.length === 1
													}
													icon='cancel'
													color='danger'
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
							<tr>
								<div className='row align-items-bottom justify-content-end'>
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
						<div className='col-md-2'>
							<FormGroup id='discount' label='Discount' className='col-md-12'>
								<Input
									onChange={(val) => {
										formik
											.setFieldValue(`discount`, val.target.value)
											.then(() => {
												setTriggerRefreshItemOptions(
													triggerRefreshItemOptions + 1,
												);

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
								className='col-md-9  mt-2'
								id='total_after_discount'
								label='Total after discount'>
								<p>
									<strong className=''>
										{formik.values.total_after_discount.toLocaleString(
											undefined,
											{
												maximumFractionDigits: 2,
											},
										) ?? 0}
									</strong>
								</p>
							</FormGroup>
						</div>
						<div className='col-md-2'>
							<FormGroup id='tax' label='Tax %' className='col-md-12'>
								<Input
									onChange={(val) => {
										formik.setFieldValue(`tax`, val.target.value).then(() => {
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
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
									<strong className=''>
										{formik.values.tax_in_figure.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</strong>
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
										{formik.values.total_after_tax.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</strong>
								</p>
							</FormGroup>
						</div>
						<div className='col-md-2'>
							<FormGroup
								id='adv_tax_percentage'
								label='Advance Tax %'
								className='col-md-12'>
								<Input
									onChange={(val) => {
										formik
											.setFieldValue(`adv_tax_percentage`, val.target.value)
											.then(() => {
												setTriggerRefreshItemOptions(
													triggerRefreshItemOptions + 1,
												);
											});
									}}
									onBlur={formik.handleBlur}
									value={formik.values.adv_tax_percentage || ''}
									isValid={formik.isValid}
									isTouched={formik.touched.adv_tax_percentage}
									invalidFeedback={formik.errors.adv_tax_percentage}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						{/* <div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='adv_tax_in_figure'
								label='Advance Tax in figures'>
								<p>
									<strong className=''>
										{formik?.values?.adv_tax_in_figure.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0}
									</strong>
								</p>
							</FormGroup>
						</div> */}

						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9 mt-2'
								id='adv_tax'
								label='Advance Tax in figures'>
								<p>
									<strong className=''>
										{formik?.values?.adv_tax !== undefined
											? formik.values.adv_tax.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})
											: '0'}
									</strong>
								</p>
							</FormGroup>
						</div>

						<div className='col-md-2 align-items-bottom justify-content-center'>
							<FormGroup
								className='col-md-9  mt-2'
								id='adv_tax_in_figure'
								label='Total after Advance Tax'>
								<p>
									<strong className=''>
										{formik.values.total_after_adv_tax !== undefined
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
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							isOutline
							onClick={() => {
								formik.resetForm();
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
Recieve.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Recieve;
