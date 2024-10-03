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
import customStyles from '../../../customStyles/ReactSelectCustomStyle';
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
import AddSupplier from './addSupplier';

const validate = (values) => {
	let errors = {};

	if (!values.po_no) {
		errors.po_no = 'Required';
	}
	if (!values.manufacturer_id) {
		errors.manufacturer_id = 'Required';
	}
	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}
	if (!values.request_date) {
		errors.request_date = 'Required';
	}

	if (!values.childArray.length > 0) {
		errors.childArray = 'Required';
	}

	// if (!values.manufacturer_id) {
	// 	errors.manufacturer_id = 'Required';
	// }

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
		if (!data.pack) {
			errors = {
				...errors,

				[`childArray[${index}]pack`]: 'Required!',
			};
		}

		if (data.quantity <= 0) {
			errors = {
				...errors,

				[`childArray[${index}]quantity`]: 'Insufficent quantity!',
			};
		}
	});
	return errors;
};
const Supplier = ({ refreshTableData }) => {
	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [isLoading, setIsLoading] = useState(false);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);

	const [manufacturererDropDown, setManufacturerDropDown] = useState([]);
	const [manufacturererDropDownLoading, setManufacturerDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);

	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.total = data.quantity * data.rate;
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
	

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

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
			invoice_no:'',
			po_type: 2,
			po_no: '',
			manufacturer_id: '',
			total: '',
			is_cancel: 0,
			is_approved: 0,
			is_received: 0,
			request_date: todayDate,
			remarks: '',

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

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addPurchaseOrder`, myFormik.values)
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

	const getLatestPoNo = () => {
		apiClient.get(`/getLatestpono`).then((response) => {
			formik.setFieldValue('po_no', response.data.po_no);
		});
	};
	useEffect(() => {
		if (state === true) {
			getLatestPoNo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);
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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (formik.values.manufacturer_id) {
			apiClient
				.get(`/supplierPurchaseOrder?manufacturer_id=${formik.values.manufacturer_id}`)
				.then((response) => {
					const rec = response.data.items.map(({ item_id, id, item }) => ({
						id: item_id,

						value: item_id,
						item_id,
						label: `${item.name}${item.strength ? `-${item.strength}` : ''}${
							item.strength_unit ? `-${item.strength_unit.name}` : ''
						}`,
						name: item.name,
						unit: item.unit.name,
						pack: item.pack,

						quantity: '',
						rate: '',
						total: '',
					}));
					// formik.setFieldValue('childArray', rec);
					formik.setFieldValue('childArray', []);
					setItemOptions([]);
					setItemOptions2(rec);
					setItemOptionsLoading(false);
				});

			// eslint-disable-next-line no-console
		} else {
			formik.setFieldValue('childArray', []);
			setItemOptions([]);
			setItemOptions2([]);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik.values.manufacturer_id]);

	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [itemOptions2, setItemOptions2] = useState([]);
	const refreshItemOptions = () => {
		const t = itemOptions2;

		const list = formik.values.childArray;
		const newArrayOptions = t.filter((option) => {
			return !list.some((child) => child.item_id === option.id);
		});
		setItemOptions2(newArrayOptions);
	};
	useEffect(() => {
		// refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='secondary'
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Add SupplierPurchase Order
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
						<ModalTitle id='exampleModalLabel'>Add Supplier Purchase Order</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2  d-flex justify-content-start'>
								{/* <div className='col-md-2'>
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
										
									</div> */}
									<div className='col-md-1'>
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
										<FormGroup
											id='supplier_id'
											label='Supplier'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
												isLoading={supplierDropDownLoading}
												options={supplierDropDown}
												value={
													formik.values.supplier_id
														? supplierDropDown?.find(
																(c) =>
																	c.value ===
																	formik.values.supplier_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'supplier_id',
														val ? val.id : '',
													);
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
									<div className='col-md-1' style={{ marginTop: '37px' }}>
                                       <AddSupplier />
                                         </div>
									<div className='col-md-2'>
										<FormGroup
											id='manufacturer_id'
											label='Manufacturer'
											className='col-md-12'>
											<ReactSelect
												className='col-md-12'
												isClearable
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

									<div className='col-md-2'>
										<FormGroup id='request_date' label='Request Date'>
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
									<div className='col-md-3'>
										<FormGroup
											id='remarks'
											label='Remarks'
											className='col-md-12'>
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

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-4'>Item </th>
											<th className='col-md-4'>Pack Size</th>
											<th className='col-md-3'>Quantity</th>
											{/* <th className='col-md-2'>Rate</th> */}

											{/* <th className='col-md-2'>Total</th> */}
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
																options={itemOptions2}
																isLoading={itemOptionsLoading}
																styles={customStyles}
																value={
																	items.item_id
																		? itemOptions2.find(
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
																	formik
																		.setFieldValue(
																			`childArray[${index}].pack`,
																			val ? val.pack : '',
																		)
																		.then(() => {
																			setTriggerRefreshItemOptions(
																				triggerRefreshItemOptions +
																					1,
																			);
																		});
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

													<td className='col-md-4'>
														<FormGroup
															id={`childArray[${index}].pack`}
															label=''
															className='col-md-12'>
															<InputGroup>
																<Input
																	type='number'
																	onWheel={(e) => e.target.blur()}
																	onChange={(val) => {
																		const inputValue =
																			val.target.value;
																		const isInteger =
																			Number.isInteger(
																				parseFloat(
																					inputValue,
																				),
																			);
																		if (
																			isInteger ||
																			inputValue === ''
																		) {
																			formik.setFieldValue(
																				`childArray[${index}].pack`,
																				inputValue,
																			);
																		}
																	}}
																	onBlur={formik.handleBlur}
																	value={items.pack}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																					.childArray[
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
													</td>

													<td className='col-md-3'>
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
													{/* <td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].rate`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
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
																value={items.rate}
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
													</td>
													<td className='col-md-3 align-items-center justify-content-center'>
														<div className='row'>
															<FormGroup
																className='col-md-9 mt-2'
																id={`childArray[${index}].total`}
																label=''
																type='number'>
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
															<Button
																className='col-md-3 mt-1'
																isDisable={
																	formik.values.childArray
																		.length === 1
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
													</td> */}
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
																				quantity: '',
																				rate: '',
																				total: 0,
																				pack: '',
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
									</tbody>
								</table>

								<hr />
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
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
											getLatestPoNo();
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

Supplier.propTypes = {
	refreshTableData: PropTypes.func.isRequired,
};

export default Supplier;
