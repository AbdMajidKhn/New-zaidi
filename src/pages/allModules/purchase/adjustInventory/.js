// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-lone-blocks */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-expressions */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports
import ReactSelect from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import apiClient from '../../../../baseURL/api';
// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import Checks from '../../../../components/bootstrap/forms/Checks';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const validate = (values) => {
	let errors = {};

	if (!values.date) {
		errors.request_date = 'Required';
	}

	values.adjustInventoryChild?.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`adjustInventoryChild[${index}]item_id`]: 'Required!',
			};
		}

		if (!data.purchase_price) {
			errors = {
				...errors,
				[`adjustInventoryChild[${index}]purchase_price`]: 'Required!',
			};
		}
	});
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit, editingItemChild, batchDetails }) => {
	// console.log('editingItem', editingItem)
	// console.log('editingItemChild', editingItemChild)
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [manufacture, setManufacture] = useState([]);
	const [batchOptions, setBatchOption] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);

	// const [itemId, setItemId] = useState(null)
	// const [meterSizeOptions, setMeterSizeOptions] = useState([]);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);

	// const [itemIds, setItemIds] = useState(null)

	const formik = useFormik({
		initialValues: {
			...editingItem,
			adjustInventoryChild: editingItemChild,
			batchQuantity: batchDetails
		}, validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	console.log(formik, 'formik')
	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('adjustInventoryChild', [
			...formik.values.adjustInventoryChild.slice(0, i),
			...formik.values.adjustInventoryChild.slice(i + 1),
		]);
	};
	const submitForm = (data) => {
		apiClient
			.post(`/updateAdjustInventory`, data)
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
			.catch(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		apiClient.get(`/getItemsDropDownPo`).then((response) => {
			console.log('reso', response)
			const rec = response.data.items.map(
				// eslint-disable-next-line camelcase
				({ id, name, pack, manufacturerOptions, unit }) => ({
					id,
					value: id,
					label: `${name}`,
					pack,
					unit,
					// eslint-disable-next-line camelcase
					manufactureOptions: manufacturerOptions.map((d) => ({
						id: Number(`${d.id}`),
						value: Number(`${d.id}`),
						label: `${d.label}`,

					})),

				}),
			);
			const rec2 = response.data.manufactures.map(({ id, name }) => ({
				id,
				value: id,
				label: `${name}`,
			}));
			// eslint-disable-next-line camelcase
			const rec3 = response.data.batchDetails.map(({ id, batch_no }) => ({
				id,
				value: id,
				// eslint-disable-next-line camelcase
				label: `${batch_no}`,
			}));
			// const rec2 = response.data.meterSizes.map(({ id, name }) => ({
			// 	id,
			// 	value: id,
			// 	label: `${name}`,
			// }));
			setManufacture(rec2)
			setItemOptions(rec);
			setBatchOption(rec3)
			// setMeterOptions(rec2);
			setItemOptionsLoading(false);
		});

	}, []);

	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.adjustInventoryChild;

		if (formik.values.adjust_type === 'add') {
			arr?.forEach((data) => {
				console.log('ssssssssssssss', data);
				data.total = data.quantity_in * data.purchase_price;
			});
		} else {
			arr?.forEach((data) => {
				console.log('ssssssssssssss', data);
				data.total = data.quantity_out * data.purchase_price;
			});
		}

		formik.setFieldValue('adjustInventoryChild', arr);

		const total =
			arr !== null
				? Number(
					arr?.reduce(
						(a, v) => a + parseFloat(v !== undefined ? v.total : 0),
						0,
					),
				)
				: 0;
		formik.setFieldValue('total_amount', total);
	};


	useEffect(() => {
		calculateTotal();
	}, [triggerCalculateTotal]);

	const getItemLastPriceAvlQantity = (id, index) => {
		apiClient.get(`/getAdjustItemId?item_id=${id}`).then((response) => {
			formik.setFieldValue(
				`adjustInventoryChild[${index}].avl_quantity`,
				response.data?.getLastPurchasePrice?.quantity,
			);
			formik.setFieldValue(
				`adjustInventoryChild[${index}].last_purchase_price`,
				response.data?.getRate,
			);
			formik.setFieldValue(
				`adjustInventoryChild[${index}].avl_quantity`,
				response.data?.getLastPurchasePrice?.quantity,
			);
			formik.setFieldValue(
				`adjustInventoryChild[${index}].last_purchase_price`,
				response.data?.getRate,
			);
		});
	};
	// useEffect(() => {
	// 	apiClient.get(`/getItemMeterSize?item_id=${itemIds}`)
	// 		.then((response) => {
	// 			// console.log("The response of rec is:", response)
	// 			setMeterSizeOptions(response.data.item[0].meter_size)
	// 			// setMeterSizeOptionsLoading(response.data.item[0])

	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			// setMeterSizeOptionsLoading(false);
	// 		});

	// }, [itemIds])
	useEffect(() => {
		formik.values?.adjustInventoryChild?.forEach((item, index) => {
			const itemId = item.item_id;
			if (itemId) {
				getItemLastPriceAvlQantity(itemId, index);
			}
		});
		console.log(formik.values)
	}, [formik.values.adjustInventoryChild]);
	const getExistingQty = (idx, val) => {
		if (val) {
			formik.setFieldValue(`adjustInventoryChild[${idx}].qty_available_loading`, true);

			apiClient.get(`/itemInventory?item_id=${val ? val.id : ''}`).then((response) => {
				console.log(response, 'resp')

				const batchOptions = response.data.items.iteminventory.map((d) => ({
					value: Number(`${d.item_id}`),
					label: `${d.batch_no}`,
					batchExpiry: d.expiry_date,
				}))



				formik.setFieldValue(`childArray[${idx}].batch_no`, '');
				formik.setFieldValue(`childArray[${idx}].batchDetails`, batchOptions);

				formik.setFieldValue(`adjustInventoryChild[${idx}].qty_available_loading`, false);

				formik.setFieldValue(
					`adjustInventoryChild[${idx}].qty_available`,
					response.data.itemsInv.item_avaiable_inventory?.item_available ?? 0,
				);
				formik.setFieldValue(`adjustInventoryChild[${idx}].avg_price`, response.data.AvgPrice ?? 0);

				// formik.setFieldValue(`adjustInventoryChild[${idx}].expiry_date`, expiryDate);

				// formik.setFieldValue(
				// 	`list[${idx}].last_sale_price`,
				// 	response.data.data.last_sale_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`list[${idx}].min_price`,
				// 	response.data.data.min_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`list[${idx}].max_price`,
				// 	response.data.data.max_price ?? 0,
				// );
				setReRender(ReRender + 1);
			});

			// eslint-disable-next-line no-console
		}
	};
	const getBatchNo = (idx, val) => {
		if (val) {
			apiClient.get(`/getbatchNo?manufacture_id=${formik.values.adjustInventoryChild[idx]?.manufacture.id}&item_id=${formik.values.adjustInventoryChild[idx]?.item_id}`)
				.then((response) => {
					console.log(response, 'respbatch');

					const batchOption = response.data.batch_no.map((d) => ({
						id: d.manufacture_id,
						label: `${d.batch_no}`,
						batchExpiry: d.expiry_date,
						manufacture: d.manufacture_id,
						item_available: d.item_available // Add item_available to batchOption
					}));

					formik.setFieldValue(`adjustInventoryChild[${idx}].batchDetails`, batchOption);

					// Set the batchQty from the batch details
					const selectedBatch = batchOption.find(batch => batch.label === val.label);
					if (selectedBatch) {
						formik.setFieldValue(`batchQuantity[${idx}].item_available`, selectedBatch.item_available);
					}

					setReRender(ReRender + 1);
				});
		}
	};

	// const handleMeterSizeChange = (val, index) => {
	// 	console.log("val", val)

	// 	formik.setFieldValue(`adjustInventoryChild[${index}].meter_size.id`, val ? val.id : '').then(() => {
	// 		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);

	// 	});
	// 	formik.setFieldValue(`adjustInventoryChild[${index}].meter_size.name`, val ? val.label : '').then(() => {
	// 		setTriggerCalculateTotal(triggerCalculateTotal + 1);

	// 	});
	// 	formik.setFieldValue(`adjustInventoryChild[${index}].meter_size_id`, val ? val.id : '').then(() => {
	// 		setTriggerCalculateTotal(triggerCalculateTotal + 1);

	// 	});
	// };
	// console.log('metersizeoption', meterOptions)
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row '>
						<Checks
							type='switch'
							id='adjust_type'
							label={
								formik.values?.adjust_type === 'add'
									? 'Add Inventory'
									: 'Remove Inventory'
							}
							name='checkedCheck'
							onChange={(e) => {
								const newAdjustType = e.target.checked ? 'add' : 'remove';
								formik.setFieldValue('adjust_type', newAdjustType);
								setTriggerCalculateTotal(triggerCalculateTotal + 1);
							}}
							isValid={formik.isValid}
							checked={formik.values.adjust_type === 'add'} // Set checked based on adjust_type value
						/>
					</div>
					<div className='row g-2  d-flex justify-content-start'>
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
						<div className='col-md-4'>
							<FormGroup id='remarks' label='Subject' className='col-md-12'>
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

					<table className='table text-center '>
						<thead>
							<tr className='row'>
								<th className='col-md-3'>Item </th>
								<th className='col-md-1'>Qty in Stock</th>

								<th className='col-md-2'>Quantity</th>
								<th className='col-md-2'>Rate</th>
								<th className='col-md-1'>Last Purhase Rate</th>

								<th className='col-md-2'>Total</th>
								<th className='col-md-1'>Remove</th>
							</tr>
						</thead>
						<tbody>
							{formik.values.adjustInventoryChild?.length > 0 && (
								formik.values.adjustInventoryChild.map((items, index) => {
									const batchQtyOption = formik.values.batchQuantity?.[index] || {};
									return (
										// eslint-disable-next-line react/no-array-index-key
										<tr className='row' key={items.index}>
											{console.log('items adjust', items)}
											<td className='col-md-3'>
												<FormGroup
													label=''
													id={`adjustInventoryChild[${index}].item_id`}>
													<ReactSelect
														isClearable
														styles={customStyles}
														className='col-md-12'
														classNamePrefix='select'
														options={itemOptions}
														// isLoading={
														// 	items.items_options_loading
														// }
														value={
															formik?.values?.adjustInventoryChild[index]
																?.item_id
																? itemOptions?.find(
																	(c) =>
																		c.value ===
																		formik?.values
																			?.adjustInventoryChild[index]
																			.item_id,
																)
																: null
														}
														onChange={(val) => {
															console.log(val, 'val')

															formik.setFieldValue(
																`adjustInventoryChild[${index}].item_id`,
																val ? val.id : '',
															);
															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].batch_no`,
															// 	'',
															// );
															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].batchDetails`,
															// 	'',
															// );
															formik.setFieldValue(
																`adjustInventoryChild[${index}].manufactureOptions`,
																val ? val.manufactureOptions : '',
															);
															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].batchOptions`,
															// 	val ? val.batchOptions : '',
															// );
															formik.setFieldValue(
																`adjustInventoryChild[${index}].item_name`,
																val !== null && val.label,
															);
															formik.setFieldValue(
																`adjustInventoryChild[${index}].unit`,
																val ? val.unit : '',
															);
															formik.setFieldValue(
																`adjustInventoryChild[${index}].pack`,
																val ? val.pack : '',
															);

															getItemLastPriceAvlQantity(
																val.id,
																index,
															);


															getExistingQty(index, val);
														}}

														isValid={formik.isValid}
														isTouched={
															formik.touched.adjustInventoryChild
																? formik.touched.adjustInventoryChild[
																	index
																]?.item_id
																: ''
														}
														invalidFeedback={
															formik.errors[
															`adjustInventoryChild[${index}].item_id`
															]
														}
													/>
												</FormGroup>
												{formik.errors[
													`adjustInventoryChild[${index}]item_id`
												] && (
														// <div className='invalid-feedback'>
														<p
															style={{
																color: '#f35421',
																fontSize: '0.875em',
																marginTop: '0.25rem',
															}}>
															{
																formik.errors[
																`adjustInventoryChild[${index}]item_id`
																]
															}
														</p>
													)}
												<FormGroup
													className='mt-2'
													label='Manufacture'
													id={`adjustInventoryChild[${index}].manufacturer_id`}>
													<ReactSelect
														styles={customStyles}
														className='col-md-12'
														classNamePrefix='select'
														options={items.manufactureOptions}
														// isLoading={itemOptionsLoading}
														// isClearable
														// value={
														// 	formik.values.adjustInventoryChild[index]
														// 		.manufacture.name
														// 		? items?.manufactureOptions?.find(
														// 			(c) =>
														// 				c.id ===
														// 				formik.values
														// 					.adjustInventoryChild[index]
														// 					.manufacturer_id,
														// 		)
														// 		: null
														// }
														// value={
														// 	formik?.values?.adjustInventoryChild[index]
														// 		?.manufacture_id
														// 		? manufacture?.find(
														// 			(c) =>
														// 				c.value ===
														// 				formik?.values
														// 					?.adjustInventoryChild[index]
														// 					.manufacture_id,
														// 		)
														// 		: null
														// }
														value={items?.manufacture?.id ? manufacture?.find(c => c?.id === items?.manufacture?.id) : null}

														onChange={(val) => {
															console.log(val, 'valww')
															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].batch_no`,
															// 	val ? val.label : '',
															// );
															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].batchDetails`,
															// 	val,
															// );
															formik.setFieldValue(
																`adjustInventoryChild[${index}].manufacture.id`,
																val ? val.id : '',
															);
															formik.setFieldValue(`adjustInventoryChild[${index}].batch_no`, val ? val.label : '');

															// formik.setFieldValue(
															// 	`adjustInventoryChild[${index}].expiry_date`,
															// 	val.batchExpiry,
															// );
															getBatchNo(index, val);


														}}
														isValid={formik.isValid}
														isTouched={
															formik.touched.adjustInventoryChild
																? formik.touched.adjustInventoryChild[index]
																	?.batch_no
																: ''
														}
														invalidFeedback={
															formik.errors[
															`adjustInventoryChild[${index}].batch_no`
															]
														}
													/>
												</FormGroup>
												{formik.errors[
													`adjustInventoryChild[${index}]batch_no`
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
																`adjustInventoryChild[${index}]batch_no`
																]
															}
														</p>
													)}
												<FormGroup
													label='Batch No'
													id={`adjustInventoryChild[${index}].batch_no`}>
													{formik.values.adjust_type === 'add' ? (
														<Input
															type='text'
															value={formik.values.adjustInventoryChild[index].batch_no || ''}
															onChange={(val) => {
																formik.setFieldValue(`adjustInventoryChild[${index}].batch_no`, val.target.value);
															}}
															onBlur={formik.handleBlur}
															isValid={formik.isValid}
															isTouched={formik.touched.adjustInventoryChild ? formik.touched.adjustInventoryChild[index]?.batch_no : ''}
															invalidFeedback={formik.errors[`adjustInventoryChild[${index}].batch_no`]}
														/>
													) : (
														<ReactSelect
															styles={customStyles}
															className='col-md-12'
															classNamePrefix='select'
															options={items.batchDetails}
															value={items.batch_no ? batchOptions?.find(c => c.label === items.batch_no) : null}

															onChange={(val) => {
																console.log(val, 'batch val')
																formik.setFieldValue(`adjustInventoryChild[${index}].batch_no`, val ? val.label : '');
																formik.setFieldValue(`adjustInventoryChild[${index}].expiry_date`, val.batchExpiry);
																formik.setFieldValue(`batchQuantity[${index}].item_available`, val.item_available);
															}}
															isValid={formik.isValid}
															isTouched={formik.touched.adjustInventoryChild ? formik.touched.adjustInventoryChild[index]?.batch_no : ''}
															invalidFeedback={formik.errors[`adjustInventoryChild[${index}].batch_no`]}
														/>
													)}
												</FormGroup>
												{formik.errors[`adjustInventoryChild[${index}].batch_no`] && (
													<p
														style={{
															color: '#f35421',
															textAlign: 'left',
															marginTop: '0.25rem',
															fontSize: '0.875em',
														}}>
														{formik.errors[`adjustInventoryChild[${index}].batch_no`]}
													</p>
												)}
												<FormGroup
													id={`adjustInventoryChild[${index}].pack`}
													label='Pack Size'
													className='col-md-12'>
													<InputGroup>
														<Input
															type='number'
															step='1'
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
																		`adjustInventoryChild[${index}].pack`,
																		inputValue,
																	);
																}
																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
															onBlur={formik.handleBlur}
															value={items.pack}
															isValid={formik.isValid}
															isTouched={
																formik.touched.adjustInventoryChild
																	? formik.touched
																		.adjustInventoryChild[
																		index
																	]?.pack
																	: ''
															}
															invalidFeedback={
																formik.errors[
																`adjustInventoryChild[${index}]pack`
																]
															}
														/>
														<InputGroupText id='addon2'>
															{items.unit}
														</InputGroupText>
													</InputGroup>
												</FormGroup>
												{formik.values.adjust_type === 'add' ? (
													<FormGroup label='Expiry Date' id={`adjustInventoryChild[${index}].expiry_date`}>
														<Input
															type='date'
															onChange={formik.handleChange}
															onBlur={formik.handleBlur}
															value={formik.values.adjustInventoryChild[index].expiry_date}
															isValid={formik.isValid}
															isTouched={formik.touched.adjustInventoryChild ? formik.touched.adjustInventoryChild[index]?.expiry_date : ''}
															invalidFeedback={formik.errors[`adjustInventoryChild[${index}].expiry_date`]}
														/>
													</FormGroup>
												) : (
													<p className='fs-6'>
														Batch Exp{' '}
														{items.expiry_date ? items.expiry_date : 'None'}
													</p>
												)}

												
												{formik.values.adjust_type === 'remove' && (
													<p className='fs-6'>
														Batch qty{' '}
														{batchQtyOption.item_available ? batchQtyOption.item_available
															: 'none'}
													</p>
												)}
											</td>
											<td className='col-md-1'>
												{items?.avl_quantity}
											</td>

											<td className='col-md-2'>
												<FormGroup
													id={`adjustInventoryChild[${index}].quantity`}
													label=''
													className='col-md-12'>
													<Input
														type='number'
														onWheel={(e) => e.target.blur()}
														size='sm'
														onChange={(val) => {
															const inputValue = val.target.value;
															if (inputValue === '0') {
																// Quantity cannot be 0
																formik.setFieldError(
																	`adjustInventoryChild[${index}].quantity`,
																	'Quantity cannot be 0',
																);
															} else {
																// Clear the error message if quantity is greater than 0
																formik.setFieldError(
																	`adjustInventoryChild[${index}].quantity`,
																	'',
																);

																// Determine whether to set quantity_in or quantity_out
																if (formik.values.adjust_type === 'add') {
																	formik.setFieldValue(
																		`adjustInventoryChild[${index}].quantity_in`,
																		inputValue,
																	);
																} else {
																	formik.setFieldValue(
																		`adjustInventoryChild[${index}].quantity_out`,
																		inputValue,
																	);
																}

																// Trigger any necessary calculations or updates
																setTriggerCalculateTotal(prev => prev + 1);
															}
														}}
														onBlur={formik.handleBlur}
														value={formik.values.adjust_type === 'add'
															? items.quantity_in
															: items.quantity_out}
														isValid={formik.isValid}
														isTouched={
															formik.touched.childArray
																? formik.touched.childArray[index]?.quantity
																: ''
														}
														invalidFeedback={
															formik.errors[`childArray[${index}].quantity`]
														}
													/>
												</FormGroup>
											</td>


											<td className='col-md-2'>
												<FormGroup
													id={`adjustInventoryChild[${index}].purchase_price`}
													label=''
													className='col-md-12'>
													<Input
														onWheel={(e) => e.target.blur()}
														type='number'
														size='sm'
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
																	`adjustInventoryChild[${index}].purchase_price`,
																	inputValue,
																);
															}
															setTriggerCalculateTotal(
																triggerCalculateTotal + 1,
															);
														}}
														onBlur={formik.handleBlur}
														value={items.purchase_price}
														isValid={formik.isValid}
														isTouched={
															formik.touched.adjustInventoryChild
																? formik.touched.adjustInventoryChild[
																	index
																]?.purchase_price
																: ''
														}
														invalidFeedback={
															formik.errors[
															`adjustInventoryChild[${index}]purchase_price`
															]
														}
													/>
												</FormGroup>
											</td>
											<td className='col-md-1'>
												{items?.last_purchase_price}
											</td>


											<td className='col-md-2'>
												<FormGroup
													id={`adjustInventoryChild[${index}].total`}
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
													`adjustInventoryChild[${index}]total`
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
																`adjustInventoryChild[${index}]total`
																]
															}
														</p>
													)}
											</td>
											<td className='col-md-1'>
												<Button
													icon='cancel'
													color='danger'
													onClick={() => {
														removeRow(index);

														setTriggerCalculateTotal(
															triggerCalculateTotal + 1,
														);
													}}
												/>{' '}
											</td>
										</tr>
									);
								})
							)}
							<tr>
								<div className="row align-items-bottom justify-content-end">
									<td className="col-md-2 align-items-center justify-content-start">
										<div className="row g-4 d-flex align-items-start">
											<div className="col-md-12 d-flex align-items-center mt-4">
												<Button
													color="primary"
													icon="add"
													onClick={() => {
														formik.setFieldValue("adjustInventoryChild", [
															...formik.values.adjustInventoryChild,
															{
																item_id: "",
																purchase_price: "",
																quantity: "",
																received_quantity: 0,
																cost: 0,
																amount: "",
																manufactureOptions: [],
																batch_no: '',
																batchDetails: [],

															},
														]);
													}}
												>
													Add
												</Button>
											</div>
										</div>
									</td>

									<td className="col-md-2 align-items-center justify-content-end">
										<div className="row">
											<p className="col-md-12 mt-4" label="">
												<strong>Total Amount</strong>
											</p>
										</div>
									</td>
									<td className="col-md-3 align-items-center justify-content-center">
										<div className="row">
											<FormGroup className="col-md-9 mt-4" label="">
												<strong>
													{formik.values.total_amount
														? formik.values.total_amount.toLocaleString(undefined, {
															maximumFractionDigits: 2,
														})
														: 0}
												</strong>
											</FormGroup>
										</div>
									</td>
								</div>
							</tr>
						</tbody>

					</table>
					<div className='row g-4'>
						<div className='col-md-4'>
							<Button
								color='primary'
								icon='add'
								onClick={() => {
									formik.setFieldValue('adjustInventoryChild', [
										...formik.values.adjustInventoryChild,
										{
											item_id: '',
											purchase_price: '',
											quantity: '',
											received_quantity: 0,
											cost: 0,

											amount: '',
										},
									]);
								}}>
								Add
							</Button>
						</div>
					</div>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							isOutline
							onClick={() => {
								formik.resetForm();
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
Edit.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	editingItem: PropTypes.object.isRequired,
	// handleStateEdit: PropTypes.function.isRequired,
};

export default Edit