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
	if (!values.rate) {
		errors.rate = 'Required';
	}
	if (!values.avg_cost) {
		errors.avg_cost = 'Required';
	}
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

	const formik = useFormik({
		// initialValues: { ...editingItem, category_id: editingItem.subcategories.category_id },
		initialValues: editingItem,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (data) => {
		apiClient
			.post(`/updateItemPrices`, data)
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

	const handleSave = () => {
		submitForm(formik.values);
		setLastSave(moment());
	};
	const removeRow = (i) => {
		formik.setFieldValue('kitchild', [
			...formik.values.kitchild.slice(0, i),
			...formik.values.kitchild.slice(i + 1),
		]);
	};
	useEffect(() => {
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

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup id='rate' label='rate' className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values?.rate}
									isValid={formik.isValid}
									isTouched={formik.touched.rate}
									invalidFeedback={formik.errors.rate}
								/>
							</FormGroup>
						</div>
						<div className='col-md-12'>
							<FormGroup id='avg_cost' label='average Cost' className='col-md-12'>
								<Input
									type='number'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values?.avg_cost}
									isValid={formik.isValid}
									isTouched={formik.touched.avg_cost}
									invalidFeedback={formik.errors.avg_cost}
								/>
							</FormGroup>
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
