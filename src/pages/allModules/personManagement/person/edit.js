// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports
import ReactSelect, { createFilter } from 'react-select';
import moment from 'moment';
import PropTypes from 'prop-types';

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

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}

	if (!values.phone_no) {
		errors.phone_no = 'Required';
	}
	if (values.cnic && !/^\d{5}-\d{7}-\d$/.test(values.cnic)) {
		errors.cnic = 'Invalid cnic';
	}

	if (!/^\d{11}$/.test(values.phone_no)) {
		errors.phone_no = 'Invalid phone number';
	}
	if (!values.person_type) {
		errors.person_type = 'Required';
	}
	if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}
	return errors;
};

// eslint-disable-next-line react/prop-types
const Edit = ({ editingItem, handleStateEdit }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);
	const [personOptions, setPersonOptions] = useState([]);
	const [personOptionsLoading, setPersonOptionsLoading] = useState(false);
	const formatChars = {
		q: '[0123456789]',
	};

	const formik = useFormik({
		initialValues: { ...editingItem, person_type_id: editingItem.person_type.id },
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});

	const submitForm = (data) => {
		apiClient
			.post(`/updateperson`, data)
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
	useEffect(() => {
		apiClient.get(`/getPersonTypes`).then((response) => {
			const rec = response.data.personTypes.map(({ id, type }) => ({
				id,
				value: id,
				label: type,
			}));
			setPersonOptions(rec);
			setPersonOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
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
							<FormGroup id='name' label='Name (Company)' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
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
					<div className='row g-2'>
						<div className='col-md-6'>
							<FormGroup id='phone_no' label='Contact number' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
									formatChars={formatChars}
									// placeholder='03111111111'
									// mask='03qqqqqqqqq'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.phone_no}
									isValid={formik.isValid}
									isTouched={formik.touched.phone_no}
									invalidFeedback={formik.errors.phone_no}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>

						<div className='col-md-6'>
							<FormGroup id='cnic' label='ID Type: CNIC (or Passport Number, License Number, etc.)' className='col-md-12'>
								<Input
									// disabled={formik.values.disableFields}
									formatChars={formatChars}
									// placeholder='#####-#######-#'
									// mask='qqqqq-qqqqqqq-q'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.cnic}
									isValid={formik.isValid}
									isTouched={formik.touched.cnic}
									invalidFeedback={formik.errors.cnic}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
					</div>
					<div className='col-md-12'>
						<FormGroup id='email' label='Email' className='col-lg-12'>
							<Input
								// disabled={formik.values.disableFields}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.email}
								isValid={formik.isValid}
								isTouched={formik.touched.email}
								invalidFeedback={formik.errors.email}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					</div>
					<div className='col-md-12'>
						<FormGroup id='address' label='Address' className='col-lg-12'>
							<Input
								// disabled={formik.values.disableFields}
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.address}
								isValid={formik.isValid}
								isTouched={formik.touched.address}
								invalidFeedback={formik.errors.address}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					</div>
					<div className='row g-2'>
						<div className='col-md-6'>
							<FormGroup id='ntn' label='NTN' className='col-lg-12'>
								<Input
									// type='number'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.ntn}
									isValid={formik.isValid}
									isTouched={formik.touched.ntn}
									invalidFeedback={formik.errors.ntn}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-6'>
							<FormGroup id='gst' label='GST' className='col-lg-12'>
								<Input
									// type='number'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.gst}
									isValid={formik.isValid}
									isTouched={formik.touched.gst}
									invalidFeedback={formik.errors.gst}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
					</div>
					<div className='row g-2'>
						<div className='col-md-6'>
							<FormGroup id='dsl' label='DSL' className='col-lg-12'>
								<Input
									// type='number'
									onWheel={(e) => e.target.blur()}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.dsl}
									isValid={formik.isValid}
									isTouched={formik.touched.dsl}
									invalidFeedback={formik.errors.dsl}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-6'>
							<FormGroup label='Person type' id='person_type_id'>
								<ReactSelect
									className='col-md-12'
									classNamePrefix='select'
									options={personOptions}
									isLoading={personOptionsLoading}
									// isClearable
									menuIsOpen={false}
									value={
										formik.values.person_type_id
											? personOptions.find(
													(c) => c.value === formik.values.person_type_id,
											  )
											: null
									}
									onChange={(val) => {
										formik.setFieldValue(
											'person_type_id',
											val ? val.id : '',
											// setTableData(['']),
										);
									}}
								/>
							</FormGroup>
							{formik.errors.person_type_id && (
								// <div className='invalid-feedback'>
								<p
									style={{
										color: '#f35421',
										textAlign: 'left',
										marginTop: '0.25rem',
										fontSize: '0.875em',
									}}>
									{formik.errors.person_type_id}
								</p>
							)}
						</div>
						<div className='row g-2'>
									<div className='col-md-6'>
										<FormGroup id='opening_balance' label='Opening Balance' className='col-lg-12'>
											<Input
												type='number'
												onWheel={(e) => e.target.blur()}
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.opening_balance}
												isValid={formik.isValid}
												isTouched={formik.touched.opening_balance}
												invalidFeedback={formik.errors.opening_balance}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-6'>
										<FormGroup id='date' label='Date' className='col-lg-12'>
											<Input
												type='date'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.date}
												isValid={formik.isValid}
												isTouched={formik.touched.date}
												invalidFeedback={formik.errors.date}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
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
