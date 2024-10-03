// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-unused-vars */

import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports

import moment from 'moment';
import PropTypes from 'prop-types';
import Select from 'react-select';
import apiClient from '../../../../baseURL/api';

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

	if (!values.po_no) {
		errors.po_no = 'Required';
	}
	if (!values.supplier_id) {
		errors.supplier_id = 'Required';
	}

	if (!values.request_date) {
		errors.request_date = 'Required';
	}

	values.childArray.forEach((data, index) => {
		if (!data.item_id) {
			errors = {
				...errors,
				[`childArray[${index}]item_id`]: 'Required!',
			};
		}
		if (!data.pack) {
			errors = {
				...errors,
				[`childArray[${index}]pack`]: 'Required!',
			};
		}
		if (!data.purchase_price) {
			errors = {
				...errors,
				[`childArray[${index}]purchase_price`]: 'Required!',
			};
		}
		if (!data.quantity > 0) {
			errors = {
				...errors,
				[`childArray[${index}]quantity`]: 'Required',
			};
		}
	});
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);
	const [manufacturererDropDown, setManufacturerDropDown] = useState([]);
	const [manufacturererDropDownLoading, setManufacturerDropDownLoading] = useState([]);
	const formik = useFormik({
		initialValues: editingItem,
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
	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
	};
	const submitForm = (data) => {
		apiClient
			.post(`/updatePurchaseOrder`, data)
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
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManufacturerDropDown(rec);
			setManufacturerDropDownLoading(false);
		});

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
		apiClient.get(`/getItemsDropDown`).then((response) => {
			const rec = response.data.items.map(
				({ id, name, strength, strengthunit, pack, unit }) => ({
					id,
					value: id,
					label: `${name}${strength ? `-${strength}` : ''}${
						strengthunit ? `-${strengthunit.name}` : ''
					}`,
					pack,
					unit: unit.name,
				}),
			);
			setItemOptions(rec);
			setItemOptionsLoading(false);
		});

		// eslint-disable-next-line no-console

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);
	const calculateTotal = () => {
		let arr = [];
		arr = formik.values.childArray;
		arr.forEach((data) => {
			data.amount = data.quantity * data.purchase_price;
		});
		formik.setFieldValue(`childArray`, arr);

		const total =
			arr !== null
				? Number(
						arr?.reduce(
							// eslint-disable-next-line no-return-assign
							(a, v) => a + parseFloat(v !== undefined ? v.amount : 0),
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
						<div className='col-md-3'>
							<FormGroup id='po_no' label='PO NO' className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
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
							<FormGroup label='Supplier' id='supplier_id'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
									options={supplierDropDown}
									isLoading={supplierDropDownLoading}
									isClearable
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
									onBlur={formik.handleBlur}
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
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.supplier_id}
								</p>
							)}
						</div>
						{formik.values.po_type === 2 ? (
							<div className='col-md-3'>
								<FormGroup
									id='manufacturer_id'
									label='Manufacturer'
									className='col-md-12'>
									<Select
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
						) : (
							''
						)}
						<div className='col-md-3'>
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
								<th className='col-md-3'>Items</th>
								<th className='col-md-2'>Pack Size</th>

								<th className='col-md-4 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-6'>Rate</div>
										<div className='col-md-6'>Quantity</div>
									</div>
								</th>

								<th className='col-md-3 align-items-center justify-content-center'>
									<div className='row'>
										<div className='col-md-9'>Total </div>
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
											<FormGroup label='' id={`childArray[${index}].item_id`}>
												<Select
													isClearable
													className='col-md-12'
													classNamePrefix='select'
													options={itemOptions}
													isLoading={itemOptionsLoading}
													value={
														items.item_id
															? itemOptions.find(
																	(c) =>
																		c.value === items.item_id,
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
														formik.setFieldValue(
															`childArray[${index}].pack`,
															val ? val.pack : '',
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
													{formik.errors[`childArray[${index}]item_id`]}
												</p>
											)}
										</td>

										<td className='col-md-2'>
											<FormGroup
												id={`childArray[${index}].pack`}
												label=''
												className='col-md-12'>
												<InputGroup>
													<Input
														type='number'
														onWheel={(e) => e.target.blur()}
														onChange={(val) => {
															const inputValue = val.target.value;
															const isInteger = Number.isInteger(
																parseFloat(inputValue),
															);
															if (isInteger || inputValue === '') {
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
																? formik.touched.childArray[index]
																		?.pack
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

										<td className='col-md-4 align-items-center justify-content-center'>
											<div className='row'>
												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].purchase_price`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															onWheel={(e) => e.target.blur()}
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
																formik.touched.purchase_price
															}
															invalidFeedback={
																formik.errors.purchase_price
															}
														/>
													</FormGroup>
													{formik.errors[
														`childArray[${index}]purchase_price`
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
																	`childArray[${index}]purchase_price`
																]
															}
														</p>
													)}
												</div>

												<div className='col-md-6'>
													<FormGroup
														id={`childArray[${index}].quantity`}
														label=''
														className='col-md-12'>
														<Input
															type='number'
															onWheel={(e) => e.target.blur()}
															onChange={(val) => {
																const inputValue = val.target.value;
																const isInteger = Number.isInteger(
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

													{formik.errors[
														`childArray[${index}]quantity`
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
																	`childArray[${index}]quantity`
																]
															}
														</p>
													)}
												</div>
											</div>
										</td>

										<td className='col-md-3 align-items-center justify-content-center'>
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
						</tbody>
					</table>
					<div className='row g-4'>
						<div className='col-md-4'>
							<Button
								color='primary'
								icon='add'
								onClick={() => {
									formik.setFieldValue('childArray', [
										...formik.values.childArray,
										{
											item_id: '',
											purchase_price: '',
											quantity: '',
											received_quantity: 0,
											cost: 0,
											pack: '',

											amount: '',
										},
									]);
								}}>
								Add
							</Button>
						</div>
					</div>
					<hr />
					<div className='row g-2  d-flex justify-content-start mt-2'>
						<div className='col-md-4'>
							<FormGroup id='total' label='Total' className='col-md-12'>
								<Input
									readOnly
									type='number'
									onWheel={(e) => e.target.blur()}
									// onChange={formik.handleChange}
									onChange={(val) => {
										formik.setFieldValue(`total`, val.target.value);
									}}
									onBlur={formik.handleBlur}
									value={formik.values.total}
									isValid={formik.isValid}
									isTouched={formik.touched.total}
									invalidFeedback={formik.errors.total}
								/>
							</FormGroup>
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

export default Edit;
