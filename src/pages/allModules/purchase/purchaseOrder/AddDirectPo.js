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
import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';

const validate = (values) => {
	let errors = {};
	if (!values.po_no) {
		errors.po_no = 'Required';
	}

	if (!values.request_date) {
		errors.request_date = 'Required';
	}
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.childArray.length > 0) {
		errors.childArray = 'Required';
	}

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
		// if (!data.rate > 0) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]rate`]: 'Required!',
		// 	};
		// }

		if (!data.received_quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]received_quantity`]: 'Required',
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
		// if (!data.amount > 0) {
		// 	errors = {
		// 		...errors,
		// 		[`childArray[${index}]amount`]: 'Required',
		// 	};
		// }
	});

	return errors;
};
const Add = ({ refreshTableData }) => {
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
	const expDate = getDatePlusMonths(2);

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
			po_type: 3,
			name: '',
			po_no: PONUMBER,

			request_date: todayDate,
			remarks: '',
			invoice_no:'',
			total: 0,
			discount: 0,
			total_after_discount: 0,

			tax: 0,
			tax_in_figure: 0,
			total_after_tax: 0,

			adv_tax_percentage: 0,
			adv_tax: 0,
			total_after_adv_tax: 0,
			bank_amount_received: '',
			amount_received: '',
			bank_account_id: '',
			account_id: '',
			coa_sub_group_id: '',
			childArray: [],
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
			.post(`/directPurchaseOrder`, myFormik.values)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					getItemsDropDownPo();
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
	// useEffect(() => {
	// 	formik.setFieldValue('po_no', PONUMBER);
	// 	console.log(formik.values, 'formik.values');
	// 	console.log(PONUMBER, 'PONUMBER');
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [PONUMBER]);
	const getLatestPoNo = () => {
		apiClient.get(`/getLatestpono`).then((response) => {
			formik.setFieldValue('po_no', response.data.po_no);
			SetPONUMBER(response.data.po_no);
		});
	};
	useEffect(() => {
		if (state === true) {
			getLatestPoNo();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state]);
	const getItemsDropDownPo = () => {
		apiClient.get(`/getItemsDropDownPo`).then((response) => {
			const rec = response.data.items.map(
				({ id, name, strength, manufacturerOptions, unit, strengthunit, pack }) => ({
					id,
					value: id,
					label: `${name}${strength ? `-${strength}` : ''}${
						strengthunit ? `-${strengthunit.name}` : ''
					}`,
					unit,
					pack,
					manufacturerOptions,
				}),
			);
			setItemOptions(rec);
			setItemOptions2(rec);
			setItemOptionsLoading(false);
		});
	};
	useEffect(() => {
		getItemsDropDownPo();
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
			data.amount = data.received_quantity * data.rate;
		});
		formik.setFieldValue(`childArray`, arr);

		const price =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) =>
								a + parseFloat(v !== undefined ? v.received_quantity * v.rate : 0),
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

		const advTax = (totalAfterDiscount * formik.values.adv_tax_percentage) / 100;
		const totalAfterAdvTax = totalAfterTax + advTax;

		formik.setFieldValue(`total_after_discount`, totalAfterDiscount);
		formik.setFieldValue(`tax_in_figure`, taxInFigure);
		formik.setFieldValue(`total_after_tax`, totalAfterTax);
		formik.setFieldValue(`adv_tax`, advTax);
		formik.setFieldValue(`total_after_adv_tax`, totalAfterAdvTax);
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
		// refreshItemOptions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [triggerRefreshItemOptions]);
	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Button
					color='warning'
					icon='Add'
					hoverShadow='default'
					onClick={() => {
						initialStatus();
						setState(true);
						setStaticBackdropStatus(true);
					}}>
					Add Direct Purchase Order
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
						<ModalTitle id='exampleModalLabel'>Add Direct Purchase Order</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
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

									<div className='col-md-2'>
										<FormGroup id='name' label='Name' className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.name}
												isValid={formik.isValid}
												isTouched={formik.touched.name}
												invalidFeedback={formik.errors.name}
											/>
										</FormGroup>
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
									<div className='col-md-4'>
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
													<div className='col-md-6'>Qty</div>
													<div className='col-md-6'>Rate</div>
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
										<div>
											{formik.values.childArray.length > 0 &&
												formik.values.childArray.map((items, index) => (
													<tr className='row' key={items.index}>
														<td className='col-md-3'>
															<div>
																<FormGroup
																	label=''
																	id={`childArray[${index}].item_id`}>
																	<Select
																		isClearable
																		className='col-md-12'
																		classNamePrefix='select'
																		options={itemOptions}
																		isLoading={
																			itemOptionsLoading
																		}
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
																			formik
																				.setFieldValue(
																					`childArray[${index}].item_id`,
																					val
																						? val.id
																						: '',
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
																				`childArray[${index}].pack`,
																				val ? val.pack : '',
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
																			formik.touched
																				.childArray
																				? formik.touched
																						.childArray[
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
																		options={
																			items.manufacturerOptions
																		}
																		isLoading={
																			itemOptionsLoading
																		}
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
																			formik.touched
																				.childArray
																				? formik.touched
																						.childArray[
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
																			? formik.touched
																					.childArray[
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
														</td>
														<td className='col-md-2'>
															<FormGroup
																id={`childArray[${index}].pack`}
																label=''
																className='col-md-12'>
																<InputGroup>
																	<Input
																		type='number'
																		onWheel={(e) =>
																			e.target.blur()
																		}
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
																			formik.touched
																				.childArray
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
															<FormGroup
																id='expiry_date'
																label='Exp Date'>
																<Input
																	type='date'
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
																			? formik.touched
																					.childArray[
																					index
																			  ]?.expiry_date
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
																<div className='col-md-6'>
																	<FormGroup
																		id={`childArray[${index}].received_quantity`}
																		label=''
																		className='col-md-12'>
																		<Input
																			type='number'
																			size='sm'
																			onWheel={(e) =>
																				e.target.blur()
																			}
																			onChange={(val) => {
																				const inputValue =
																					val.target
																						.value;
																				const isInteger =
																					Number.isInteger(
																						parseFloat(
																							inputValue,
																						),
																					);
																				if (
																					isInteger ||
																					inputValue ===
																						''
																				) {
																					formik.setFieldValue(
																						`childArray[${index}].received_quantity`,
																						inputValue,
																					);
																				}

																				setTriggerCalculateTotal(
																					triggerCalculateTotal +
																						1,
																				);
																			}}
																			onBlur={
																				formik.handleBlur
																			}
																			value={
																				items.received_quantity
																			}
																			isValid={formik.isValid}
																			isTouched={
																				formik.touched
																					.childArray
																					? formik.touched
																							.childArray[
																							index
																					  ]
																							?.received_quantity
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
																		id={`childArray[${index}].rate`}
																		label=''
																		className='col-md-12'>
																		<Input
																			type='number'
																			onWheel={(e) =>
																				e.target.blur()
																			}
																			size='sm'
																			onChange={(val) => {
																				formik.setFieldValue(
																					`childArray[${index}].rate`,
																					val.target
																						.value,
																				);
																				setTriggerCalculateTotal(
																					triggerCalculateTotal +
																						1,
																				);
																			}}
																			onBlur={
																				formik.handleBlur
																			}
																			value={
																				formik.values
																					.childArray[
																					index
																				].rate
																			}
																			isValid={formik.isValid}
																			isTouched={
																				formik.touched
																					.childArray
																					? formik.touched
																							.childArray[
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
																		formik.values.childArray
																			.length === 1
																	}
																	icon='cancel'
																	color='danger'
																	onClick={() => {
																		removeRow(index);

																		setTriggerCalculateTotal(
																			triggerCalculateTotal +
																				1,
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
																				received_quantity:
																					'',
																				rate: '',
																				total: 0,
																				pack: '',
																				expiry_date:
																					expDate,
																				batch_no: '',
																			},
																		],
																	);
																}}>
																Add New Item
															</Button>
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<p className='col-md-9 mt-2' label=''>
															<strong>Total</strong>
														</p>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-center'>
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
										<FormGroup
											id='discount'
											label='Discount'
											className='col-md-12'>
											<Input
												onChange={(val) => {
													formik
														.setFieldValue(`discount`, val.target.value)
														.then(() => {
															setTriggerCalculation(
																triggerCalculation + 1,
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
													{formik.values.total_after_discount}
												</strong>
											</p>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup id='tax' label='Tax %' className='col-md-12'>
											<Input
												onChange={(val) => {
													formik
														.setFieldValue(`tax`, val.target.value)
														.then(() => {
															setTriggerCalculation(
																triggerCalculation + 1,
															);
														});
													// formik.setFieldValue(
													// 	`tax_in_figure`,
													// 	(formik.values.total_after_discount *
													// 		val.target.value) /
													// 		100,
													// );
													// formik.setFieldValue(
													// 	`total`,
													// 	formik.values.total_after_discount +
													// 		formik.values.tax_in_figure,
													// );
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
													{formik.values.tax_in_figure}
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

									<div className='row g-4 d-flex align-items-top'>
										<div className='col-md-2'>
											<FormGroup id='adv_tax_percentage' label='Advance Tax %' className='col-md-12'>
												<Input
													onChange={(val) => {
														formik
															.setFieldValue(`adv_tax_percentage`, val.target.value)
															.then(() => {
																setTriggerCalculation(
																	triggerCalculation + 1,
																);
															});
														// formik.setFieldValue(
														// 	`tax_in_figure`,
														// 	(formik.values.total_after_discount *
														// 		val.target.value) /
														// 		100,
														// );
														// formik.setFieldValue(
														// 	`total`,
														// 	formik.values.total_after_discount +
														// 		formik.values.tax_in_figure,
														// );
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
										<div className='col-md-3 align-items-bottom justify-content-center'>
											<FormGroup
												className='col-md-9  mt-2'
												id='adv_tax'
												label='Advance Tax in figures'>
												<p>
													<strong className=''>
														{formik.values.adv_tax}
													</strong>
												</p>
											</FormGroup>
										</div>
										<div className='col-md-3 align-items-bottom justify-content-center'>
											<FormGroup
												className='col-md-9  mt-2'
												id='total_after_adv_tax'
												label='Total after Advance Tax'>
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
								</div>
								<hr />
								<div className='row g-2  d-flex justify-content-start mt-2'>
									<div className='col-md-2'>
										<FormGroup
											id='amount_received'
											label='Paid Amount (Cash)'
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
													formik.setFieldValue(
														'account_id',
														val ? val.id : '',
													);
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
											label='Paid Amount (Bank)'
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
														(c) =>
															c.value ===
															formik.values.bank_account_id,
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
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
											setStateRefresh(!staterefresh);
											getLatestPoNo();
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
