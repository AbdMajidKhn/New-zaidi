// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** ApiClient Imports

import moment from 'moment';
import ReactSelect, { createFilter } from 'react-select';
import CreatableSelect from 'react-select/creatable';

import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/api';

// eslint-disable-next-line import/no-unresolved
import Spinner from '../../../../components/bootstrap/Spinner';

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

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}

	if (!values.subcategory_id) {
		errors.subcategory_id = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}

	// if (!values.date) {
	// 	errors.date = 'Required';
	// }

	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [subCategoryOptionsLoading, setSubCategoryOptionsLoading] = useState(false);
	const [manufacturedropdown, setmanufacturedropdown] = useState([]);
	const [manufacturedropdownLoading, setmanufacturedropdownLoading] = useState(false);
	const [unitOptions, setUnitOptions] = useState([]);
	const [unitOptionsLoading, setUnitOptionsLoading] = useState(false);
	const [typeOptionsLoading, setTypeOptionsLoading] = useState(false);
	const [typeOptions, setTypeOptions] = useState([]);
	const [categoryOptions, setCategoryOptions] = useState([]);
	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);
	const [newCategoryInput, setNewCategoryInput] = useState('');
	const [addingSubcategory, setAddingSubcategory] = useState(false);
	const [newSubcategoryInput, setNewSubcategoryInput] = useState('');
	const [newUnitInput, setNewUnitInput] = useState('');
	const [addingUnit, setAddingUnit] = useState(false);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const [addingCategory, setAddingCategory] = useState(false);
	const [strengthUnitOptions, setStrengthUnitOptions] = useState([]);
	const [strengthUnitOptionsLoading, setStrengthUnitOptionsLoading] = useState(false);

	const formik = useFormik({
		initialValues: {
			...editingItem,
			rate: editingItem.rate || 0,
			quantity: editingItem.quantity || 0,
			total: editingItem.total || 0,
			date: editingItem.date || '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
console.log(formik,'formik')
	const submitForm = (data) => {
		apiClient
			.post(`/updateItem`, data)
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
			});
	};

	const handleSave = () => {
		formik.setFieldValue('total', formik.values.rate * formik.values.quantity);
		submitForm(formik.values);
		setLastSave(moment());
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

		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setmanufacturedropdown(rec);
			setmanufacturedropdownLoading(false);
		});

		apiClient.get(`/getUnitDropdown`).then((response) => {
			const rec = response.data.Uom.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setUnitOptions(rec);
			setUnitOptionsLoading(false);
		});
		
		apiClient.get(`/StrengthUnitDropdown`).then((response) => {
			const rec = response.data.StrengthUnit.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setStrengthUnitOptions(rec);
			setStrengthUnitOptionsLoading(false);
		});

		apiClient.get(`/getItemTypeDropDown`).then((response) => {
			const rec = response.data.itemtype.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setTypeOptions(rec);
			setTypeOptionsLoading(false);
		});
	}, []);

	useEffect(() => {
		setSubCategoryOptionsLoading(true);

		if (formik.values.category_id) {
			setSubCategoryOptionsLoading(true);

			apiClient
				.get(`/getSubCategoriesDropDown?category_id=${formik.values.category_id}`)
				.then((response) => {
					const rec = response.data.subcategories.map(({ id, name }) => ({
						id,
						value: id,
						label: name,
					}));
					setSubCategoryOptions(rec);
					setSubCategoryOptionsLoading(false);
				});
		} else {
			setSubCategoryOptions([]);
		}
	}, [formik.values.category_id]);

	const handleInputChange = (inputValue) => {
		setNewCategoryInput(inputValue);
		formik.setFieldValue('Category', inputValue);
	};

	const handleCreateOption = (inputValue) => {
		setAddingCategory(true);
		apiClient.post('/addCategory', { name: inputValue, can_sale: 'no' })
			.then((res) => {
				if (res.data.status === 'ok') {
					apiClient.get('/getCategoriesDropDown')
						.then((response) => {
							const updatedCategories = response.data.categories.map(({ id, name }) => ({
								id,
								value: id,
								label: name,
							}));
							const data3 = updatedCategories.filter(data => data.label === formik.values.Category);
							formik.setFieldValue('category_id', data3[0] ? data3[0].value : '');
							formik.setFieldValue('Category', data3[0] ? data3[0].label : '');
							formik.setFieldValue('subcategory_id', '');
							setCategoryOptions(updatedCategories);
							setNewCategoryInput('');
							setAddingCategory(false);
						})
						.catch((error) => {
							console.error('Failed to fetch updated categories', error);
							setAddingCategory(false);
						});
				} else {
					console.error('Failed to add category:', res.data.error);
					setAddingCategory(false);
				}
			})
			.catch((error) => {
				console.error('Failed to add category:', error);
				setAddingCategory(false);
			});
	};

	const handleInputChangeSubcategory = (inputValue) => {
		setNewSubcategoryInput(inputValue);
		formik.setFieldValue('Sub_Category', inputValue);
	};

	const handleCreateSubcategory = (inputValue) => {
		setAddingSubcategory(true);

		apiClient
			.post('/addSubCategories', { name: inputValue, category_id: formik.values.category_id })
			.then((res) => {
				if (res.data.status === 'ok') {
					apiClient
						.get(`/getSubCategoriesDropDown?category_id=${formik.values.category_id}`)
						.then((response) => {
							const updatedSubcategories = response.data.subcategories.map(({ id, name }) => ({
								id,
								value: id,
								label: name,
							}));
							const data3 = updatedSubcategories.filter(data => data.label === formik.values.Sub_Category);
							formik.setFieldValue('subcategory_id', data3[0] ? data3[0].value : '');
							formik.setFieldValue('Sub_Category', data3[0] ? data3[0].label : '');
							setSubCategoryOptions(updatedSubcategories);
							setNewSubcategoryInput('');
							setAddingSubcategory(false);
						})
						.catch((error) => {
							console.error('Failed to fetch updated subcategories', error);
							setAddingSubcategory(false);
						});
				} else {
					console.error('Failed to add subcategory:', res.data.error);
					setAddingSubcategory(false);
				}
			})
			.catch((error) => {
				console.error('Failed to add subcategory:', error);
				setAddingSubcategory(false);
			});
	};

	const handleInputChangeUnit = (inputValue) => {
		setNewUnitInput(inputValue);
		formik.setFieldValue('Unit', inputValue);
	};

	const handleCreateUnit = (inputValue) => {
		setAddingUnit(true);

		apiClient.post('/addStrengthUnit', { name: inputValue })
			.then((res) => {
				if (res.data.status === 'ok') {
					apiClient.get('/StrengthUnitDropdown')
						.then((response) => {
							const updatedUnits = response.data.StrengthUnit.map(({ id, name }) => ({
								id,
								value: id,
								label: name,
							}));
							const data3 = updatedUnits.filter(data => data.label === formik.values.Unit);
							formik.setFieldValue('strength_unit_id', data3[0] ? data3[0].value : '');
							formik.setFieldValue('Unit', data3[0] ? data3[0].label : '');
							setStrengthUnitOptions(updatedUnits);
							setNewUnitInput('');
							setAddingUnit(false);
						})
						.catch((error) => {
							console.error('Failed to fetch updated units', error);
							setAddingUnit(false);
						});
				} else {
					console.error('Failed to add unit:', res.data.error);
					setAddingUnit(false);
				}
			})
			.catch((error) => {
				console.error('Failed to add unit:', error);
				setAddingUnit(false);
			});
	};

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-6'>
							<FormGroup label='Category' id='category_id'>
								<CreatableSelect
									className='col-md-12'
									classNamePrefix='select'
									options={categoryOptions}
									isLoading={categoryOptionsLoading || addingCategory}
									value={
										formik.values.category_id
											? categoryOptions.find(
												(c) => c.value === formik.values.category_id,
											)
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('category_id', val ? val.id : '');
										formik.setFieldValue('subcategory_id', '');
									}}
									onInputChange={handleInputChange}
									onCreateOption={handleCreateOption}
									inputValue={newCategoryInput}
								/>
							</FormGroup>
							{formik.errors.category_id && (
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
						<div className='col-md-6'>
							<FormGroup label='Sub_Category' id='subcategory_id'>
								<CreatableSelect
									className='col-md-12'
									classNamePrefix='select'
									options={subCategoryOptions}
									isLoading={subCategoryOptionsLoading || addingSubcategory}
									value={
										formik.values.subcategory_id
											? subCategoryOptions.find(
												(c) => c.value === formik.values.subcategory_id,
											)
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('subcategory_id', val ? val.id : '');
									}}
									onInputChange={handleInputChangeSubcategory}
									onCreateOption={(inputValue) => handleCreateSubcategory(inputValue)}
									inputValue={newSubcategoryInput}
								/>
							</FormGroup>
							{formik.errors.subcategory_id && (
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
						<div className='col-md-6'>
							<FormGroup label='Manufacture' id='manufactute\'>
								<CreatableSelect
									className='col-md-12'
									classNamePrefix='select'
									isMulti
									options={manufacturedropdown}
										isLoading={manufacturedropdownLoading}
										value={formik.values.manufacture}
										onChange={(val) => {
											formik.setFieldValue('manufacture', val);
										}}
								/>
							</FormGroup>
							
							{formik.errors.manufacture_id && (
								<p style={{ color: '#f35421', textAlign: 'left', marginTop: '0.25rem', fontSize: '0.875em' }}>
									{formik.errors.manufacture_id}
								</p>
							)}
						</div>
						<div className='col-md-6'>
							<FormGroup id='name' label='Item Name' className='col-md-12'>
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
						<div className='col-md-6'>
							<FormGroup id='nomenclature' label='Nomenclature' className='col-md-12'>
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
						<div className='col-md-6'>
							<FormGroup id='strength' label='Size'>
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
						<div className='col-md-6'>
							<FormGroup label='Unit' id='unit_id'>
								<CreatableSelect
									className='col-md-12'
									classNamePrefix='select'
									options={strengthUnitOptions}
									isLoading={strengthUnitOptionsLoading || addingUnit}
									value={
										formik.values.strength_unit_id
											? strengthUnitOptions.find(
												(c) =>
													c.value === formik.values.strength_unit_id,
											)
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('strength_unit_id', val ? val.id : '');
									}}
									onInputChange={handleInputChangeUnit}
									onCreateOption={handleCreateUnit}
									inputValue={newUnitInput}
								/>
							</FormGroup>
							{formik.errors.unit_id && (
								<p style={{ color: '#f35421', textAlign: 'left', marginTop: '0.25rem', fontSize: '0.875em' }}>
									{formik.errors.unit_id}
								</p>
							)}
						</div>
						{/* <div className='col-md-6'>
							<FormGroup id='quantity' label='Quantity' className='col-md-12'>
								<Input
									type='number'
									onChange={(e) => {
										formik.setFieldValue('quantity', e.target.value);
										formik.setFieldValue('total', e.target.value * formik.values.rate);
									}}
									onBlur={formik.handleBlur}
									value={formik.values.quantity}
									isValid={formik.isValid}
									isTouched={formik.touched.quantity}
									invalidFeedback={formik.errors.quantity}
								/>
							</FormGroup>
						</div>
						<div className='col-md-6'>
							<FormGroup id='rate' label='Rate' className='col-md-12'>
								<Input
									type='number'
									onChange={(e) => {
										formik.setFieldValue('rate', e.target.value);
										formik.setFieldValue('total', e.target.value * formik.values.quantity);
									}}
									onBlur={formik.handleBlur}
									value={formik.values.rate}
									isValid={formik.isValid}
									isTouched={formik.touched.rate}
									invalidFeedback={formik.errors.rate}
								/>
							</FormGroup>
						</div>
						<div className='col-md-6'>
							<FormGroup id='total' label='Total' className='col-md-12'>
								<Input
									type='number'
									readOnly
									value={formik.values.total}
									isValid={formik.isValid}
									isTouched={formik.touched.total}
									invalidFeedback={formik.errors.total}
								/>
							</FormGroup>
						</div> */}
						<div className='col-md-6'>
							<FormGroup id='minimumlevel' label='minimumlevel' className='col-md-12'>
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
						{/* <div className='col-md-6'>
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
						</div> */}
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
