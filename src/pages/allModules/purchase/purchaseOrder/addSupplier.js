// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
// ** Axios Imports

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
import Icon from '../../../../components/icon/Icon';

const validate = (values) => {
	const errors = {};

	if (!values.name) {
		errors.name = 'Required';
	}
	if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
		errors.email = 'Invalid email address';
	}

	if (values.cnic && !/^\d{5}-\d{7}-\d$/.test(values.cnic)) {
		errors.cnic = 'Invalid cnic';
	}

	if (!/^\d{11}$/.test(values.phone_no)) {
		errors.phone_no = 'Invalid phone number';
	}
	if (!values.phone_no) {
		errors.phone_no = 'Required';
	}
	if (!values.person_type_id) {
		errors.person_type_id = 'Required';
	}

	return errors;
};

const AddSupplier = ({ refresh }) => {
	const [state, setState] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [personOptions, setPersonOptions] = useState([]);
	const [personOptionsLoading, setPersonOptionsLoading] = useState(false);
	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	const formatChars = {
		q: '[0123456789]',
	};

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
			phone_no: '',
			email: '',
			cnic: '',
			address: '',
			brand: '',
			person_type_id: '',
			ntn: '',
			dsl: '',
			gst: '',
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
			.post(`/addPerson`, myFormik.values, {})
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refresh();
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
	// 	apiClient.get(`/getPersonTypes`).then((response) => {
	// 		const rec = response.data.personTypes.map(({ id, type }) => ({
	// 			id,
	// 			value: id,
	// 			label: type,
	// 		}));
	// 		setPersonOptions(rec);
	// 		setPersonOptionsLoading(false);
	// 	});

	// 	// eslint-disable-next-line no-console
	// }, []);

	useEffect(() => {
		apiClient.get(`/getPersonTypes`).then((response) => {
			if (response.data.personTypes.length > 0) {
				const firstPersonType = response.data.personTypes[3];
				const rec = [{
					id: firstPersonType.id,
					value: firstPersonType.id,
					label: firstPersonType.type,
				}];
				setPersonOptions(rec);
				console.log(rec)
				setPersonOptionsLoading(false);
			}
		});
	
		// eslint-disable-next-line no-console
	}, []);

	return (
		<div className='col-auto'>
			<div className='col-auto'>
				<Icon
					icon='GroupAdd'
					size='3x'
					className='me-1'
					color="primary"
					onClick={() => {
						initialStatus();

						setState(true);
						setStaticBackdropStatus(true);
					}}
				/>

				{/* <Button
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
				</Button> */}
			</div>
			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='md'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Add Person</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row g-2'>
									<div className='col-md-12'>
										<FormGroup
											id='name'
											label='Name (Company)'
											className='col-md-12'>
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
										<FormGroup
											id='phone_no'
											label='Phone number'
											className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
												formatChars={formatChars}
												placeholder='03111111111'
												mask='03qqqqqqqqq'
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
										<FormGroup id='cnic' label='CNIC' className='col-md-12'>
											<Input
												// disabled={formik.values.disableFields}
												formatChars={formatChars}
												placeholder='#####-#######-#'
												mask='qqqqq-qqqqqqq-q'
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
												value={
													formik.values.person_type_id
														? personOptions.find(
																(c) =>
																	c.value ===
																	formik.values.person_type_id,
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
AddSupplier.propTypes = {
	refresh: PropTypes.func.isRequired,
};

export default AddSupplier;
