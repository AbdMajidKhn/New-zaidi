// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** apiClient Imports
import Select from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';

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
import apiClient from '../../../../baseURL/api';
import Button from '../../../../components/bootstrap/Button';

const validate = (values) => {
	const errors = {};
	if (!values.name) {
		errors.name = 'Required';
	}
	if (!values.category_id) {
		errors.category_id = 'Required';
	}
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [categoryOptions, setCategoryOptions] = useState();
	const [categoryOptionsLoading, setCategoryOptionsLoading] = useState(false);

	useEffect(() => {
		setCategoryOptionsLoading(true);
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
	}, []);

	const formik = useFormik({
		initialValues: editingItem,
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (data) => {
		apiClient
			.post(`/updateSubCategories`, data)
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
	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formik.handleSubmit}>
				<CardBody>
					<div className='row g-2'>
						<div className='col-md-12'>
							<FormGroup id='category_id' label='Category' className='col-md-12'>
								<Select
									className='col-md-12'
									isClearable
									isLoading={categoryOptionsLoading}
									options={categoryOptions}
									value={
										formik.values.category_id
											? categoryOptions?.find(
													(c) => c.value === formik.values.category_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue('category_id', val ? val.id : '');
									}}
									invalidFeedback={formik.errors.category_id}
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
							<FormGroup id='name' label='Name' className='col-md-12'>
								<Input
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.name}
									isValid={formik.isValid}
									isTouched={formik.touched.name}
									invalidFeedback={formik.errors.name}
									validFeedback='Looks good!'
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
