// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import Select, { createFilter } from 'react-select';
import Flatpickr from 'react-flatpickr';

import moment from 'moment';
import { useFormik } from 'formik';
import { updateSingleState } from '../../redux/tableCrud/index';
import apiClient from '../../../../baseURL/api';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import Input from '../../../../components/bootstrap/forms/Input';
import Excel from './excel';
import GeneratePDF from './customersale';
import View from './view';

require('flatpickr/dist/flatpickr.css');

const Files = () => {
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [customerOptionsLoading, setCustomerOptionsLoading] = useState(false);
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const saleTypeOptions = [
		{
			id: 1,
			value: 1,
			label: 'Walk-in Customer',
		},
		{
			id: 2,
			value: 2,
			label: 'Registered Customer',
		},
	];
	const formik = useFormik({
		initialValues: {
			customer_id: '',
			sale_type: '',
			walk_in_customer_name: '',
		},
	});
	
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [itemDropdown, setItemDropDown] = useState([]);
	const [itemDropdownLoading, setItemDropDownLoading] = useState([]);
	const [selectedItem, setSelectedItem] = useState('');

	const printReportAll = (docType) => {
		return apiClient
			.get(
				`/getSalesReportCustomerWise?sale_type=${formik.values.sale_type}&customer_id=${
					formik.values.customer_id
				}&item_id=${selectedItem ? selectedItem.id : ''}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
			)
			.then((response) => {
				setTableData(response.data.invoices);
				setTableData2(response.data.invoices);
				setTableDataLoading(false);
				GeneratePDF(
					response.data.invoices,
					selectedItem,
					dateRange.from,
					dateRange.to,
					docType
				);
				dispatch(
					updateSingleState([
						response.data.invoices,
						'purchase',
						'stockReport',
						'tableData',
					]),
				);
				return response.data.invoices;
			});
	};

	const printReportAll2 = (docType) => {
		return apiClient
			.get(
				`/getSalesReportCustomerWise?sale_type=${formik.values.sale_type}&customer_id=${
					formik.values.customer_id
				}&item_id=${selectedItem ? selectedItem.id : ''}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
			)
			.then((response) => {
				setTableData(response.data.invoices);
				setTableData2(response.data.invoices);
				GeneratePDF(
					response.data.invoices,
					selectedItem,
					dateRange.from,
					dateRange.to,
					docType
				);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.invoices,
						'purchase',
						'stockReport',
						'tableData',
					]),
				);
				GeneratePDF(response.data.invoices, docType, formik.values.item_id);
				return response.data.invoices;
			});
	};

	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCustomerOptions(rec);
			setCustomerOptionsLoading(false);
		});
	}, []);

	useEffect(() => {
		apiClient.get(`/getItemsDropDown`).then((response) => {
			const rec = response.data.items.map(({ id, name, strength, strengthunit }) => ({
				id,
				value: id,
				label: `${name}${strength ? `-${strength}` : ''}${
					strengthunit ? `-${strengthunit.name}` : ''
				}`,
			}));
			setItemDropDown(rec);
			setItemDropDownLoading(false);
		});
	}, []);

	useEffect(() => {
		printReportAll();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo, formik.values.sale_type]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>CustomerWise Sale Order Report</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<div className='col-md-2'>
										<FormGroup label='Sale Type' id='sale_type'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												isClearable
												options={saleTypeOptions}
												value={
													formik.values.sale_type
														? saleTypeOptions?.find(
																(c) =>
																	c.value ===
																	formik.values.sale_type,
														  )
														: null
												}
												onChange={(val) => {
													formik.setFieldValue(
														'sale_type',
														val ? val.id : '',
													);
												}}
											/>
										</FormGroup>
									</div>
									{formik.values.sale_type === 2 ? (
										<div className='col-md-2'>
											<FormGroup label='Customers' id='customer_id'>
												<Select
													className='col-md-12'
													classNamePrefix='select'
													options={customerOptions}
													isLoading={customerOptionsLoading}
													isClearable
													value={
														formik.values.customer_id
															? customerOptions?.find(
																	(c) =>
																		c.value ===
																		formik.values.customer_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'customer_id',
															val ? val.id : '',
														);
													}}
												/>
											</FormGroup>
										</div>
									) : (
										''
									)}
									{formik.values.sale_type === 1 ? (
										<div className='col-md-2'>
											<FormGroup
												id='walk_in_customer_name'
												label='Customer Name'
												className='col-md-12'>
												<Input
													type='text'
													onChange={formik.handleChange}
													onBlur={formik.handleBlur}
													value={formik.values.walk_in_customer_name}
													isValid={formik.isValid}
													isTouched={formik.touched.walk_in_customer_name}
													invalidFeedback={
														formik.errors.walk_in_customer_name
													}
												/>
											</FormGroup>
										</div>
									) : (
										''
									)}
										<div className='col-md-2'>
										<FormGroup label='Item' id='item_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={itemDropdown}
												isLoading={itemDropdownLoading}
												isClearable
												value={selectedItem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='request' label='Request Date Range'>
											<Flatpickr
												className='form-control'
												value={dateRange.fullDate || ''}
												options={{
													mode: 'range',
													dateFormat: 'd-m-Y',
												}}
												onChange={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												onClose={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('YYYY-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('YYYY-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												id='default-picker'
											/>
										</FormGroup>
									</div>
									<Button
										color='primary'
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll2(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading ? 'Generating PDF...' : 'View PDF'}
									</Button>
									<div className='col-md-2'>
										<Button
											color='primary'
											onClick={() => printReportAll()}
											isOutline
											isActive>
											Search
										</Button>
									</div>
								</div>
							</CardBody>
							<View
								tableData={tableData}
								tableData2={tableData2}
								tableDataLoading={tableDataLoading}
								printReportAll={() => printReportAll(formik.values.customer_id)}
							/>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};


export default Files;


// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable prettier/prettier */
// // eslint-disable-next-line eslint-comments/disable-enable-pair
// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames';
// import { useDispatch, useSelector } from 'react-redux';

// import Select, { createFilter } from 'react-select';
// import Flatpickr from 'react-flatpickr';

// import moment from 'moment';
// import { useFormik } from 'formik';
// import { updateSingleState } from '../../redux/tableCrud/index';
// import apiClient from '../../../../baseURL/api';

// import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// import Button from '../../../../components/bootstrap/Button';
// import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// import Page from '../../../../layout/Page/Page';
// import Card, {
// 	CardBody,
// 	CardHeader,
// 	CardLabel,
// 	CardTitle,
// } from '../../../../components/bootstrap/Card';
// import Spinner from '../../../../components/bootstrap/Spinner';
// import Input from '../../../../components/bootstrap/forms/Input';
// import Excel from './excel';
// import GeneratePDF from './customersale';
// import View from './view';

// require('flatpickr/dist/flatpickr.css');

// const Files = () => {
// 	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
// 	const [customerOptions, setCustomerOptions] = useState([]);
// 	const [customerOptionsLoading, setCustomerOptionsLoading] = useState(false);
// 	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
// 	const saleTypeOptions = [
// 		{
// 			id: 1,
// 			value: 1,
// 			label: 'Walk-in Customer',
// 		},
// 		{
// 			id: 2,
// 			value: 2,
// 			label: 'Registered Customer',
// 		},
// 	];
// 	const formik = useFormik({
// 		initialValues: {
// 			customer_id: '',

// 			sale_type: '',
// 			walk_in_customer_name: '',
// 		},
// 	});
// 	const dispatch = useDispatch();
// 	const store = useSelector((state) => state.tableCrud);

// 	const [tableData, setTableData] = useState([]);
// 	const [tableData2, setTableData2] = useState([]);
// 	const [tableDataLoading, setTableDataLoading] = useState(true);


// 	const printReportAll = async (docType) => {
// 		// Clear the table data when a new search is initiated
// 		setTableData([]);
// 		setIsPrintAllReportLoading(true); // Optionally set loading state while fetching data
	  
// 		try {
// 			const response = await apiClient
// 				.get(
// 					`/getSalesReportCustomerWise?sale_type=${formik.values.sale_type}&customer_id=${formik.values.customer_id}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`);
// 			console.log(response.data);
// 			// Handle response data correctly
// 			const responseData = response.data.invoices;

// 			// Update table data state and loading state
// 			setTableData(responseData);
// 			setIsPrintAllReportLoading(false);

// 			// Dispatch or perform other necessary actions
// 			// Generate PDF or other actions
// 			GeneratePDF(responseData, docType, formik.values.item_id);
// 			return responseData;
// 		} catch (error) {
// 			console.error(error);
// 			setIsPrintAllReportLoading(false); // Handle errors and loading state
// 		}
// 	  };

// 	  const search = async (docType) => {
// 		// Clear the table data when a new search is initiated
// 		setTableData([]);
// 		setIsPrintAllReportLoading(true); // Optionally set loading state while fetching data
	  
// 		try {
// 			  const response = await apiClient
// 				  .get(
// 					  `/getSalesReportCustomerWise?sale_type=${formik.values.sale_type}&customer_id=${formik.values.customer_id}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`);
// 			  console.log(response.data);
// 			  // Handle response data correctly
// 			  const responseData = response.data.invoices;

// 			  // Update table data state and loading state
// 			  setTableData(responseData);
// 			  setTableDataLoading(false)
// 			  setIsPrintAllReportLoading(false);
// 			  return responseData;
// 		  } catch (error) {
// 			  console.error(error);
// 			  setIsPrintAllReportLoading(false); // Handle errors and loading state
// 		  }
// 	  };
	  

// 	useEffect(() => {
// 		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
// 			const rec = response.data.persons.map(({ id, name }) => ({
// 				id,
// 				value: id,
// 				label: name,
// 			}));
// 			setCustomerOptions(rec);
// 			setCustomerOptionsLoading(false);
// 		});

// 		// eslint-disable-next-line no-console
// 	}, []);
// 	useEffect(() => {
// 		search();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo]);
// 	return (
// 		<PageWrapper>
// 			<Page container='fluid'>
// 				<div className='row'>
// 					<div className='col-12'>
// 						<Card>
// 							<CardHeader>
// 								<CardLabel icon='Assignment'>
// 									<CardTitle>CustomerWise Sale Order Report</CardTitle>
// 								</CardLabel>
// 							</CardHeader>
// 							<CardBody>
// 								<div className='row g-4 d-flex align-items-end justify-content-start'>
// 									<div className='col-md-2'>
// 										<FormGroup label='Sale Type' id='sale_type'>
// 											<Select
// 												className='col-md-12'
// 												classNamePrefix='select'
// 												isClearable
// 												options={saleTypeOptions}
// 												// isLoading={purchaseTypeOptionsLoading}
// 												value={
// 													formik.values.sale_type
// 														? saleTypeOptions?.find(
// 																(c) =>
// 																	c.value ===
// 																	formik.values.sale_type,
// 														  )
// 														: null
// 												}
// 												onChange={(val) => {
// 													formik.setFieldValue(
// 														'sale_type',
// 														val ? val.id : '',
// 													);
// 												}}
// 											/>
// 										</FormGroup>
// 									</div>
// 									{formik.values.sale_type === 2 ? (
// 										<div className='col-md-2'>
// 											<FormGroup label='Customers' id='customer_id'>
// 												<Select
// 													className='col-md-12'
// 													classNamePrefix='select'
// 													options={customerOptions}
// 													isLoading={customerOptionsLoading}
// 													isClearable
// 													value={
// 														formik.values.customer_id
// 															? customerOptions?.find(
// 																	(c) =>
// 																		c.value ===
// 																		formik.values.customer_id,
// 															  )
// 															: null
// 													}
// 													onChange={(val) => {
// 														formik.setFieldValue(
// 															'customer_id',
// 															val ? val.id : '',
// 														);
// 													}}
// 												/>
// 											</FormGroup>
// 										</div>
// 									) : (
// 										''
// 									)}
// 									{formik.values.sale_type === 1 ? (
// 										<div className='col-md-2'>
// 											<FormGroup
// 												id='walk_in_customer_name'
// 												label='Customer Name'
// 												className='col-md-12'>
// 												<Input
// 													type='text'
// 													onChange={formik.handleChange}
// 													onBlur={formik.handleBlur}
// 													value={formik.values.walk_in_customer_name}
// 													isValid={formik.isValid}
// 													isTouched={formik.touched.walk_in_customer_name}
// 													invalidFeedback={
// 														formik.errors.walk_in_customer_name
// 													}
// 												/>
// 											</FormGroup>
// 										</div>
// 									) : (
// 										''
// 									)}
// 									<div className='col-md-3'>
// 										<FormGroup id='request' label='Request Date Range'>
// 											<Flatpickr
// 												className='form-control'
// 												value={dateRange.fullDate || ''}
// 												options={{
// 													mode: 'range',
// 													dateFormat: 'd-m-Y',
// 												}}
// 												onChange={(date, dateStr) => {
// 													setDateRange({
// 														from: date[0]
// 															? moment(date[0]).format('YYYY-MM-DD')
// 															: '',
// 														to: date[1]
// 															? moment(date[1]).format('YYYY-MM-DD')
// 															: '',
// 														fullDate: dateStr,
// 													});
// 												}}
// 												onClose={(date, dateStr) => {
// 													setDateRange({
// 														from: date[0]
// 															? moment(date[0]).format('YYYY-MM-DD')
// 															: '',
// 														to: date[1]
// 															? moment(date[1]).format('YYYY-MM-DD')
// 															: '',
// 														fullDate: dateStr,
// 													});
// 												}}
// 												id='default-picker'
// 											/>
// 										</FormGroup>
// 									</div>
// 									<Button
// 										color='primary'
// 										// isLight={darkModeStatus}
// 										className={classNames('text-nowrap', {
// 											'col-md-2 border-light': true,
// 										})}
// 										icon={!isPrintAllReportLoading && 'FilePdfFill'}
// 										isDisable={isPrintAllReportLoading}
// 										onClick={() => printReportAll(2)}>
// 										{isPrintAllReportLoading && <Spinner isSmall inButton />}
// 										{isPrintAllReportLoading ? 'Generating PDF...' : 'View PDF'}
// 									</Button>
// 									<div className='col-md-2'>
// 										<Button
// 											color='primary'
// 											onClick={() => search()}
// 											isOutline
// 											// isDisable={landsViewLoading}
// 											isActive>
// 											Search
// 										</Button>
// 									</div>
// 									{/* <Excel /> */}
// 								</div>
// 							</CardBody>
// 							<View
// 								tableData={tableData}
// 								tableData2={tableData2}
// 								tableDataLoading={tableDataLoading}
// 								printReportAll={() => printReportAll(formik.values.customer_id)}
// 							/>
// 						</Card>
// 					</div>
// 				</div>
// 			</Page>
// 		</PageWrapper>
// 	);
// };

// export default Files;
