// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';

import moment from 'moment';

import Select from 'react-select';
import Spinner from '../../../../../components/bootstrap/Spinner';

import baseURL from '../../../../../baseURL/baseURL';

import apiClient from '../../../../../baseURL/api';
import Card, {
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	// eslint-disable-next-line no-unused-vars
	CardHeader,

	// eslint-disable-next-line no-unused-vars
	CardLabel,
} from '../../../../../components/bootstrap/Card';

import FormGroup from '../../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../../components/bootstrap/forms/Input';

import Button from '../../../../../components/bootstrap/Button';
import showNotification from '../../../../../components/extras/showNotification';

const validate = (values) => {
	const errors = {};

	if (!values.coa_group_id) {
		errors.coa_group_id = 'Required';
	}
	if (!values.coa_sub_group_id) {
		errors.coa_sub_group_id = 'Required';
	}

	if (!values.name) {
		errors.name = 'PLease provide name';
	}

	return errors;
};

const AddAccount = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [lastSave, setLastSave] = useState(null);

	const submitForm = (myFormik) => {
		const url = `${baseURL}/updateCoaAccount`;

		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify(myFormik.values),
		};
		fetch(url, options)
			.then((response) => response.json())
			.then((res) => {
				setIsLoading(false);

				if (res.status === 'ok') {
					// props.setRefreshAccountsView(props.refreshAccountsView + 1);
					// setState(false);
					setLastSave(moment());
					myFormik.resetForm();
					props.handleStateEdit(false);
				}
				setState(false);
			});
	};

	const formikAddPurchaser = useFormik({
		initialValues: props.editingAccountData,
		validate,
		onSubmit: (values) => {
			// eslint-disable-next-line no-alert
			alert(JSON.stringify(values, null, 2));
		},
	});
	const [coeSubGroupOptions, setCoeSubGroupOptions] = useState([]);
	const [coaGroups, setCoaGroups] = useState([]);
	useEffect(() => {
		apiClient
			.get(`/getCoaGroups`)
			.then((response) => {
				const rec = response.data.coaGroup.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setCoaGroups(rec);
				//   setLoading(false)
			})
			.catch((err) => console.log(err));
	}, []);
	useEffect(() => {
		if (formikAddPurchaser.values.coa_group_id !== null) {
			apiClient
				.get(`/coaSubGroupsByGroup?coa_group_id=${formikAddPurchaser.values.coa_group_id}`)
				.then((response) => {
					const rec = response.data.coaSubGroups.map(({ id, name, code }) => ({
						id,
						value: id,
						label: `${code}-${name}`,
					}));
					setCoeSubGroupOptions(rec);
					//   setLoading(false)
				})
				.catch((err) => console.log(err));
		}
	}, [formikAddPurchaser.values.coa_group_id]);

	return (
		<div className='col-12'>
			<Card stretch tag='form' onSubmit={formikAddPurchaser.handleSubmit}>
				<CardBody>
					<div className='row g-4'>
						<FormGroup id='coa_group_id' label='Main group ' className='col-md-12'>
							<Select
								className='col-md-11'
								isClearable
								classNamePrefix='select'
								options={coaGroups}
								value={coaGroups.find(
									(c) => c.value === formikAddPurchaser.values.coa_group_id,
								)}
								// value={formikAddPurchaser.values.mouza_id}
								onChange={(val) => {
									formikAddPurchaser.setFieldValue('coa_group_id', val.id);
								}}
								isValid={formikAddPurchaser.isValid}
								isTouched={formikAddPurchaser.touched.coa_group_id}
								invalidFeedback={formikAddPurchaser.errors.coa_group_id}
								validFeedback='Looks good!'
							/>
						</FormGroup>
						<FormGroup id='coa_sub_group_id' label='Sub group' className='col-md-12'>
							<Select
								className='col-md-11'
								classNamePrefix='select'
								options={coeSubGroupOptions}
								value={coeSubGroupOptions.find(
									(c) => c.value === formikAddPurchaser.values.coa_sub_group_id,
								)}
								// value={formikAddPurchaser.values.mouza_id}
								onChange={(val) => {
									formikAddPurchaser.setFieldValue('coa_sub_group_id', val.id);
								}}
							/>
						</FormGroup>

						<FormGroup id='name' label='Account Name  ' className='col-md-12'>
							<Input
								onChange={formikAddPurchaser.handleChange}
								onBlur={formikAddPurchaser.handleBlur}
								value={formikAddPurchaser.values.name}
								isValid={formikAddPurchaser.isValid}
								isTouched={formikAddPurchaser.touched.name}
								invalidFeedback={formikAddPurchaser.errors.name}
								validFeedback='Looks good!'
							/>
						</FormGroup>
						<FormGroup id='description' label='description  ' className='col-md-12'>
							<Input
								onChange={formikAddPurchaser.handleChange}
								onBlur={formikAddPurchaser.handleBlur}
								value={formikAddPurchaser.values.description}
								isValid={formikAddPurchaser.isValid}
								isTouched={formikAddPurchaser.touched.description}
								invalidFeedback={formikAddPurchaser.errors.description}
								validFeedback='Looks good!'
							/>
						</FormGroup>
					</div>
				</CardBody>
				<CardFooter>
					<CardFooterLeft>
						<Button
							type='reset'
							color='info'
							isOutline
							onClick={formikAddPurchaser.resetForm}>
							Reset
						</Button>
					</CardFooterLeft>
					<CardFooterRight>
						<Button
							icon={isLoading ? null : 'Update'}
							isLight
							color={lastSave ? 'info' : 'success'}
							isDisable={isLoading}
							onClick={() => {
								// eslint-disable-next-line no-plusplus
								if (formikAddPurchaser.isValid) {
									setIsLoading(true);
									submitForm(formikAddPurchaser);
								} else {
									showNotification(
										'Provide values',
										'Please Fill Form',
										'warning',
									);
								}
							}}>
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

export default AddAccount;
