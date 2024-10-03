// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** ApiClient Imports

import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/api';

import Spinner from '../../../../components/bootstrap/Spinner';
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
	CardHeader,
	CardLabel,
} from '../../../../components/bootstrap/Card';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

import Button from '../../../../components/bootstrap/Button';
import baseURL from '../../../../baseURL/baseURL';

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}

	if (!values.manufacture.length > 0) {
		errors.manufacture = 'Required';
	}
	if (!values.subcategory_id) {
		errors.subcategory_id = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}
	if (!values.unit_id) {
		errors.unit_id = 'Required';
	}

	// if (!values.manufacture_id) {
	// 	errors.manufacture_id = 'Required';
	// }
	// if (!values.unit_id) {
	// 	errors.unit_id = 'Required';
	// }
	return errors;
};

const Add = ({ refreshTableData }) => {
	const [typeOptions, setTypeOptions] = useState([]);
	const [typeOptionsLoading, setTypeOptionsLoading] = useState(false);

	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [subCategoryOptionsLoading, setSubCategoryOptionsLoading] = useState(false);
	const [manufacturedropdown, setmanufacturedropdown] = useState([]);
	const [manufacturedropdownLoading, setmanufacturedropdownLoading] = useState(false);

	const [unitOptions, setUnitOptions] = useState([]);
	const [unitOptionsLoading, setUnitOptionsLoading] = useState(false);
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);

	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);

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
			name: '',
			subcategory_id: '',
			type: '',
			category_id: '',
			unit_id: '',
			strength: '',
			minimumlevel: '',
			nomenclature: '',
			manufacture: [],
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

	const submitForm = (myFormik) => {
		apiClient
			.post(`/addItem`, myFormik.values)
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
		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryOptions(rec);
			setCategoryOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getSubCategoriesDropDown`).then((response) => {
			const rec = response.data.subcategories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSubCategoryOptions(rec);
			setSubCategoryOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setmanufacturedropdown(rec);
			setmanufacturedropdownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getUnitDropdown`).then((response) => {
			const rec = response.data.Uom.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setUnitOptions(rec);
			setUnitOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getItemTypeDropDown`).then((response) => {
			const rec = response.data.itemtype.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setTypeOptions(rec);
			setTypeOptionsLoading(false);
		});

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// const getSubcatByCat = (idd) => {
	// 	setSubCategoryOptionsLoading(true);
	// 	apiClient
	// 		.get(`/getSubCategoriesByCategory?category_id=${idd}`)
	// 		.then((response) => {
	// 			const rec = response.data.subcategories.map(({ id, name }) => ({
	// 				id,
	// 				value: id,
	// 				// label: `${name} - ${existingkit_inventory.kits_available}`,
	// 				label: name,
	// 			}));
	// 			setSubCategoryOptions(rec);
	// 			setSubCategoryOptionsLoading(false);
	// 		})
	// 		// eslint-disable-next-line no-console
	// 		.catch((err) => {});
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// };

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
					Add New
				</Button>
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='lg'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Item</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
										<FormGroup label='Category' id='category_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={categoryOptions}
												isLoading={categoryOptionsLoading}
												isClearable
												value={
													formik.values.category_id
														? categoryOptions.find(
																(c) =>
																	c.value ===
																	formik.values.category_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'category_id',
														val ? val.id : '',
														// setTableData(['']),
													);
												}}
											/>
										</FormGroup>
										{formik.errors.category_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#f35421',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.category_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup label='Sub Category' id='subcategory_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={subCategoryOptions}
												isLoading={subCategoryOptionsLoading}
												isClearable
												value={
													formik.values.subcategory_id
														? subCategoryOptions.find(
																(c) =>
																	c.value ===
																	formik.values.subcategory_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'subcategory_id',
														val ? val.id : '',
														// setTableData(['']),
													);
												}}
											/>
										</FormGroup>
										{formik.errors.subcategory_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#f35421',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.subcategory_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
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
									<div className='col-md-12'>
										<FormGroup
											id='strength'
											label='strength'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.strength}
												isValid={formik.isValid}
												isTouched={formik.touched.strength}
												invalidFeedback={formik.errors.strength}
											/>
										</FormGroup>
									</div>

									<div className='col-md-12'>
										<FormGroup label='Manufacture' id='manufacture'>
											<ReactSelect
												className='col-md-12'
												isClearable
												isMulti
												classNamePrefix='select'
												options={manufacturedropdown}
												// isLoading={manufacture}
												value={formik.values.manufacture}
												onChange={(val) => {
													formik.setFieldValue('manufacture', val);
												}}
												onBlur={formik.handleBlur}
												isValid={formik.isValid}
												isTouched={formik.touched.manufacture}
												invalidFeedback={formik.errors.manufacture}
												validFeedback='Looks good!'
											/>
										</FormGroup>
										{formik.errors.manufacture && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#f35421',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.manufacture}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup
											id='nomenclature'
											label='Nomenclature'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.nomenclature}
												isValid={formik.isValid}
												isTouched={formik.touched.nomenclature}
												invalidFeedback={formik.errors.nomenclature}
											/>
										</FormGroup>
									</div>
									<div className='col-md-12'>
										<FormGroup
											id='minimumlevel'
											label='minimumlevel'
											className='col-md-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.minimumlevel}
												isValid={formik.isValid}
												isTouched={formik.touched.minimumlevel}
												invalidFeedback={formik.errors.minimumlevel}
											/>
										</FormGroup>
									</div>
									<div className='col-md-12'>
										<FormGroup label='unit' id='unit_id'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={unitOptions}
												isLoading={unitOptionsLoading}
												isClearable
												value={
													formik.values.unit_id
														? unitOptions.find(
																(c) =>
																	c.value ===
																	formik.values.unit_id,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'unit_id',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
										{formik.errors.unit_id && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#f35421',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.unit_id}
											</p>
										)}
									</div>
									<div className='col-md-12'>
										<FormGroup label='Type' id='type'>
											<ReactSelect
												className='col-md-12'
												classNamePrefix='select'
												options={typeOptions}
												isLoading={typeOptionsLoading}
												isClearable
												value={
													formik.values.type
														? typeOptions.find(
																(c) =>
																	c.value === formik.values.type,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'type',
														val ? val.id : '',
														// setTableData(['']),
													);
												}}
											/>
										</FormGroup>
										{formik.errors.type && (
											// <div className='invalid-feedback'>
											<p
												style={{
													color: '#f35421',
													textAlign: 'left',
													marginTop: '0.25rem',
													fontSize: '0.875em',
												}}>
												{formik.errors.type}
											</p>
										)}
									</div>

									{/* table 
									{formik.values.type === 2 ? (
										<div>
											<table
												className='table text-center table-modern'
												style={{ overflow: 'scrollY' }}>
												<thead>
													<tr
														className='row mt-2'
														style={{ marginLeft: 2 }}>
														<th className='col-6 col-sm-5 col-md-6'>
															Items Name
														</th>
														<th className='col-4 col-sm-5 col-md-5'>
															Required Quantity
														</th>
													</tr>
												</thead>
												{formik.errors.kitchild && (
													// <div className='invalid-feedback'>
													<p
														style={{
															color: '#f35421',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
														}}>
														{formik.errors.kitchild}
													</p>
												)}
												<tbody>
													{formik.values.kitchild.length > 0 &&
														formik.values.kitchild.map(
															(items, index) => (
																<tr
																	className='d-flex align-items-center'
																	key={
																		formik.values.kitchild[
																			index
																		].item_id
																	}>
																	<td className='col-6 col-sm-6 col-md-7'>
																		<FormGroup
																			label=''
																			id={`kitchild[${index}].item_id`}>
																			<ReactSelect
																				className='col-md-12'
																				classNamePrefix='select'
																				options={
																					kitItemDropdownOptions
																				}
																				isLoading={
																					kitItemDropDownLoading
																				}
																				isClearable
																				value={
																					formik.values
																						.kitchild[
																						index
																					].item_id
																						? kitItemDropdownOptions.find(
																								(
																									c,
																								) =>
																									c.value ===
																									formik
																										.values
																										.kitchild[
																										index
																									]
																										.item_id,
																						  )
																						: null
																				}
																				onChange={(val) => {
																					formik.setFieldValue(
																						`kitchild[${index}].item_id`,
																						val !==
																							null &&
																							val.id,
																					);
																				}}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched
																						.item_id
																				}
																				invalidFeedback={
																					formik.errors[
																						`kitchild[${index}].item_id`
																					]
																				}
																				filterOption={createFilter(
																					{
																						matchFrom:
																							'start',
																					},
																				)}
																			/>
																		</FormGroup>
																		{formik.errors[
																			`kitchild[${index}]item_id`
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
																						`kitchild[${index}]item_id`
																					]
																				}
																			</p>
																		)}
																	</td>
																	<td
																		className='col-4 col-sm-4 col-md-4'
																		style={{ marginLeft: 3 }}>
																		<FormGroup
																			id={`kitchild[${index}].quantity`}
																			label=''
																			className='col-md-12'>
																			<Input
																				onChange={
																					formik.handleChange
																				}
																				onBlur={
																					formik.handleBlur
																				}
																				value={
																					items.quantity
																				}
																				isValid={
																					formik.isValid
																				}
																				isTouched={
																					formik.touched
																						.quantity
																				}
																				invalidFeedback={
																					formik.errors
																						.quantity
																				}
																				validFeedback='Looks good!'
																			/>
																		</FormGroup>
																		{formik.errors[
																			`kitchild[${index}]quantity`
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
																						`kitchild[${index}]quantity`
																					]
																				}
																			</p>
																		)}
																	</td>
																	<td className='col-md-1 mt-1'>
																		<Button
																			icon='cancel'
																			color='danger'
																			onClick={() =>
																				removeRow(index)
																			}
																		/>
																	</td>
																</tr>
															),
														)}
												</tbody>
											</table>
										</div>
									) : (
										''
									)}
									*/}
								</div>
							</CardBody>
							<CardFooter>
								<CardFooterLeft>
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={formik.resetForm}>
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
