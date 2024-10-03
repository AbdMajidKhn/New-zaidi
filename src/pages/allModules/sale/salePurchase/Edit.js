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

import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
// import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	let errors = {};

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
		if (!data.quoted_rate) {
			errors = {
				...errors,
				[`childArray[${index}]quoted_rate`]: 'Required!',
			};
		}
	});

	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [saleRepDropDown, setSaleRepDropDownn] = useState([]);
	const [saleRepDropDownLoading, setSaleRepDropDownLoading] = useState([]);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [itemOptions, setItemOptions] = useState([]);
	const [itemOptionsLoading, setItemOptionsLoading] = useState(false);

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
			.post(`/updateSalePo`, data)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					handleStateEdit(false);
					setIsLoading(false);
					setLastSave(moment());
				}
				setIsLoading(false);
			})
			.catch(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
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

		apiClient.get(`/getItemsDropDown`).then((response) => {
			const rec = response.data.items.map(({ id, name, rate, strength, strengthunit }) => ({
				id,
				value: id,
				label: `${name}${strength ? `-${strength}` : ''}${
					strengthunit ? `-${strengthunit.name}` : ''
				}`,
				retail: rate,
			}));
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

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2  d-flex justify-content-start'>
						<div className='col-md-2'>
							<FormGroup id='po_no' label='Po NO' className='col-md-12'>
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
							<FormGroup label='Customer' id='customer_id'>
								<Select
									className='col-md-12'
									classNamePrefix='select'
									options={customerDropDown}
									isLoading={customerDropDownLoading}
									isClearable
									value={
										formik.values.customer_id
											? customerDropDown?.find(
													(c) => c.value === formik.values.customer_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('customer_id', val ? val.id : '');
									}}
									onBlur={formik.handleBlur}
									isValid={formik.isValid}
									isTouched={formik.touched.customer_id}
									invalidFeedback={formik.errors.customer_id}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
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
								<th className='col-md-3'>Item </th>

								<th className='col-md-2'>Quoted rate</th>
								<th className='col-md-2'>Rate</th>
								<th className='col-md-2'>Quantity</th>
								<th className='col-md-2'>Total</th>

								<th className='col-md-1'>Remove</th>
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
												id={`childArray[${index}].quoted_rate`}
												label=''
												className='col-md-12'>
												<Input
													type='number'
													onWheel={(e) => e.target.blur()}
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={items.quoted_rate}
													isValid={formik.isValid}
													isTouched={
														formik.touched.childArray
															? formik.touched.childArray[index]
																	?.quoted_rate
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
												id={`childArray[${index}].rate`}
												label=''
												type='number'
												onWheel={(e) => e.target.blur()}
												className='col-md-12'>
												<Input
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
													isTouched={formik.touched.rate}
													invalidFeedback={formik.errors.rate}
													//
												/>
											</FormGroup>
											{formik.errors[`childArray[${index}]rate`] && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#f35421',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors[`childArray[${index}]rate`]}
												</p>
											)}
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
														const inputValue = val.target.value;
														const isInteger = Number.isInteger(
															parseFloat(inputValue),
														);
														if (isInteger || inputValue === '') {
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
															? formik.touched.childArray[index]
																	?.quantity
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
										<td className='col-md-2 mt-1 border-start border-end '>
											<strong>
												{items.total?.toLocaleString(undefined, {
													maximumFractionDigits: 2,
												}) ?? 0}
											</strong>
										</td>

										<td className='col-md-1 mt-1'>
											<Button
												isDisable={formik.values.childArray.length === 1}
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
														formik.setFieldValue('childArray', [
															...formik.values.childArray,
															{
																item_id: '',
																rate: '',
																quantity: '',
																received_quantity: 0,

																pack: '',

																total: '',
															},
														]);
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
