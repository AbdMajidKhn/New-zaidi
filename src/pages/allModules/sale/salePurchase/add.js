// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
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

import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
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
import Checks from '../../../../components/bootstrap/forms/Checks';
import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';

const validate = (values) => {
	let errors = {};
	// if (!values.sales_rep_id) {
	// 	errors.sales_rep_id = 'Required';
	// }
	if (!values.customer_id) {
		errors.customer_id = 'Required';
	}
	if (!values.childArray.length > 0) {
		errors.childArray = 'Required';
	}

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}
		if (!data.quantity) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required!',
			};
		}
	});

	return errors;
};

const Add = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);
	const [saleRepDropDown, setSaleRepDropDownn] = useState([]);
	const [saleRepDropDownLoading, setSaleRepDropDownLoading] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);

	const [manufactureOptions, setManufactureOptions] = useState([]);
	const [manufactureOptionsLoading, setManufactureOptionsLoading] = useState(false);

	// const [rate, SetPrice] = useState('');
	// const [total, SetUnit] = useState('');

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;
	const expDate = getDatePlusMonths(2);
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
			customer_id: '',
			po_no:'',
			sales_rep_id: '',
			remarks: '',
			total: '',
			end_date: expDate,
			request_date: todayDate,

			childArray: [],
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	const handleSave = () => {
		submitForm(formik);
	};
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.total = data.quantity * data.quoted_rate;
		});
		formik.setFieldValue(`childArray`, arr);

		const total =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => a + parseFloat(v !== undefined ? v.total : 0),
							0,
						),
				  )
				: 0;
		formik.values.total = total;
	};

	useEffect(() => {
		calculateTotal();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerCalculateTotal]);

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addSalePurchaseOrder`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refreshTableData();
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
		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManufactureOptions(rec);
			setManufactureOptionsLoading(false);
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

		apiClient.get(`/getItemsDropDown`).then((response) => {
			const rec = response.data.items.map(
				({ id, name, strength, rate, unit, strengthunit }) => ({
					id,
					value: id,
					unit: unit.name,
					label: `${name}${strength ? `-${strength}` : ''}${
						strengthunit ? `-${strengthunit.name}` : ''
					}`,

					retail: rate,
				}),
			);
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='danger'
					isLight
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Add Sale Purchase Order
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='xl'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Sale Purchase Order</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2  d-flex justify-content-start'>
								<div className='col-md-2'>
										<FormGroup
											id='po_no'
											label='PO NO'
											type='number'
											className='col-md-12'>
											<Input
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
										<FormGroup
											id='customer_id'
											label='Customer'
											className='col-md-12'>
											<ReactSelect
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
												}}
												invalidFeedback={formik.errors.customer_id}
											/>
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
									<div className='col-md-3'>
										<FormGroup
											id='sales_rep_id'
											label='Sales Rep'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
												isLoading={saleRepDropDownLoading}
												options={saleRepDropDown}
												value={
													formik.values.sales_rep_id
														? saleRepDropDown?.find(
																(c) =>
																	c.value ===
																	formik.values.sales_rep_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sales_rep_id',
														val ? val.id : '',
													);
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
										<FormGroup id='request_date' label='Date'>
											<Input
												type='date'
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
										<FormGroup id='end_date' label='End Date'>
											<Input
												type='date'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.end_date}
												isValid={formik.isValid}
												isTouched={formik.touched.end_date}
												invalidFeedback={formik.errors.end_date}
											/>
										</FormGroup>
									</div>
									<div className='col-md-4'>
										<FormGroup id='remarks' label=' Remarks'>
											<Input
												type='remarks'
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

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-4'>Item </th>

											<th className='col-md-2'>Quoted rate</th>
											<th className='col-md-2'>Quantity</th>
											<th className='col-md-2'>Total</th>

											<th className='col-md-1'>Remove</th>
										</tr>
									</thead>
									<tbody>
										{formik.values.childArray.length > 0 &&
											formik.values.childArray.map((items, index) => (
												<tr className='row' key={items.index}>
													<td className='col-md-4'>
														<FormGroup
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect
																isClearable
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
																	formik.setFieldValue(
																		`childArray[${index}].unit`,
																		val ? val.unit : '',
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
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quoted_rate`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].quoted_rate`,
																		val.target.value,
																	);
																	setTriggerCalculateTotal(
																		triggerCalculateTotal + 1,
																	);
																}}
																onBlur={formik.handleBlur}
																value={items.quoted_rate}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																				index
																		  ]?.quoted_rate
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																		`childArray[${index}]quoted_rate`
																	]
																}
															/>
														</FormGroup>
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																onChange={(val) => {
																	const inputValue =
																		val.target.value;
																	const isInteger =
																		Number.isInteger(
																			parseFloat(inputValue),
																		);
																	if (
																		isInteger ||
																		inputValue === ''
																	) {
																		formik.setFieldValue(
																			`childArray[${index}].quantity`,
																			inputValue,
																		);
																	}
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
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].total`}
															label=''
															type='number'
															className='col-md-12'>
															<strong>
																{items.total
																	? items.total.toLocaleString(
																			undefined,
																			{
																				maximumFractionDigits: 2,
																			},
																	  )
																	: 0}
															</strong>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]total`
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
																		`childArray[${index}]total`
																	]
																}
															</p>
														)}
													</td>
													<td className='col-md-1 mt-1'>
														<Button
															icon='cancel'
															color='danger'
															onClick={() => {
																removeRow(index);

																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
														/>
													</td>
												</tr>
											))}

										<tr>
											<div className='row align-items-bottom justify-content-end'>
												<td className='col-md-6 align-items-center justify-content-start'>
													<div className='row g-4 d-flex align-items-end'>
														<div className='col-md-12 d-flex align-items-center'>
															<br />
															<Button
																color='primary'
																icon='add'
																onClick={() => {
																	formik.setFieldValue(
																		'childArray',
																		[
																			...formik.values
																				.childArray,
																			{
																				item_id: '',
																				batch_no: '',
																				rate: '',
																				quantity: '',
																				pack: '',
																				trade_price: '',
																				quoted_rate: '',
																				total: '',
																			},
																		],
																	);
																}}>
																Add New Item
															</Button>
														</div>
													</div>
												</td>
												<td className='col-md-3 align-items-center justify-content-end'>
													<div className='row'>
														<p className='col-md-9 mt-2' label=''>
															<strong>Total</strong>
														</p>
													</div>
												</td>
												<td className='col-md-3 align-items-center justify-content-center'>
													<div className='row'>
														<FormGroup
															className='col-md-9 mt-2'
															label=''>
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
							</CardBody>
							<CardFooter>
								<CardFooterLeft>
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={() => {
											setStateRefresh(!staterefresh);
											formik.resetForm();
										}}>
										Reset
									</Button>
								</CardFooterLeft>
								<CardFooterRight>
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
				</ModalBody>
				<ModalFooter>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setState(false)}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

Add.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Add;
