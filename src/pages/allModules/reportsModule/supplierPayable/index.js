// import React, { useState, useEffect } from 'react';
// import classNames from 'classnames';
// import { useDispatch, useSelector } from 'react-redux';

// import Select, { createFilter } from 'react-select';
// import Flatpickr from 'react-flatpickr';

// import moment from 'moment'; // Import the moment library
// import { useFormik } from 'formik';
// import { updateSingleState } from '../../redux/tableCrud/index';
// import apiClient from '../../../../baseURL/api';

// import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// import Button from '../../../../components/bootstrap/Button';
// import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// import Page from '../../../../layout/Page/Page';
// import Card, {
//   CardBody,
//   CardHeader,
//   CardLabel,
//   CardTitle,
// } from '../../../../components/bootstrap/Card';
// import Spinner from '../../../../components/bootstrap/Spinner';
// import Input from '../../../../components/bootstrap/forms/Input';
// import GeneratePDF from './supplierPayable';
// import View from './view';

// require('flatpickr/dist/flatpickr.css');

// const Files = () => {
//   const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
//   const [customerOptions, setCustomerOptions] = useState([]);
//   const [customerOptionsLoading, setCustomerOptionsLoading] = useState(false);
//   const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
//   const saleTypeOptions = [
//     {
//       id: 1,
//       value: 1,
//       label: 'Walk-in Customer',
//     },
//     {
//       id: 2,
//       value: 2,
//       label: 'Registered Customer',
//     },
//   ];

//   // Initialize formik with default date set to current day
//   const formik = useFormik({
//     initialValues: {
//       supplier_id: '',
//       date: moment().format('DD-MM-YYYY'), // Set default date to current day
//       sale_type: 2,
//       walk_in_customer_name: '',
//     },
//   });

//   const dispatch = useDispatch();
//   const store = useSelector((state) => state.tableCrud);

//   const [tableData, setTableData] = useState([]);
//   const [tableData2, setTableData2] = useState([]);
//   const [tableDataLoading, setTableDataLoading] = useState(true);

//   const printReportAll = (docType) => {
//     return apiClient
//       .get(
//         `/getSupplierPayableBalance?supplier_id=${formik.values.supplier_id}&date=${formik.values.date || ''}`,
//       )
//       .then((response) => {
//         console.log(response);
//         setTableData(response.data.Receivables);
//         setTableDataLoading(false);
//         dispatch(
//           updateSingleState([
//             response.data.Receivables,
//             'purchase',
//             'stockReport',
//             'tableData',
//           ]),
//         );
//         return response.data;
//       });
//   };

//   const printReportAll2 = async (docType) => {
//     const response = await apiClient
// 		  .get(
// 			  `/getSupplierPayableBalance?supplier_id=${formik.values.supplier_id}&date=${formik.values.date || ''}`);
// 	  console.log(response);
// 	  setTableData(response.data.Receivables);
// 	  setTableDataLoading(false);
// 	  dispatch(
// 		  updateSingleState([
// 			  response.data.Receivables,
// 			  'purchase',
// 			  'stockReport',
// 			  'tableData',
// 		  ]));
// 	  GeneratePDF(response.data.Receivables, docType, formik.values.item_id);
// 	  return response.data;
//   };

//   useEffect(() => {
//     apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
//       const rec = response.data.persons.map(({ id, name }) => ({
//         id,
//         value: id,
//         label: name,
//       }));
//       setCustomerOptions(rec);
//       setCustomerOptionsLoading(false);
//     });
//   }, []);

//   useEffect(() => {
//     printReportAll();
//   }, [store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo]);

//   return (
//     <PageWrapper>
//       <Page container='fluid'>
//         <div className='row'>
//           <div className='col-12'>
//             <Card>
//               <CardHeader>
//                 <CardLabel icon='Assignment'>
//                   <CardTitle>Supplier Payable Report</CardTitle>
//                 </CardLabel>
//               </CardHeader>
//               <CardBody>
//                 <div className='row g-4 d-flex align-items-end justify-content-start'>
//                   {formik.values.sale_type === 2 ? (
//                     <div className='col-md-2'>
//                       <FormGroup label='Customers' id='supplier_id'>
//                         <Select
//                           className='col-md-12'
//                           classNamePrefix='select'
//                           options={customerOptions}
//                           isLoading={customerOptionsLoading}
//                           isClearable
//                           value={
//                             formik.values.supplier_id
//                               ? customerOptions?.find(
//                                   (c) => c.value === formik.values.supplier_id,
//                                 )
//                               : null
//                           }
//                           onChange={(val) => {
//                             formik.setFieldValue('supplier_id', val ? val.id : '');
//                           }}
//                         />
//                       </FormGroup>
//                     </div>
//                   ) : (
//                     ''
//                   )}
//                   {formik.values.sale_type === 1 ? (
//                     <div className='col-md-2'>
//                       <FormGroup
//                         id='walk_in_customer_name'
//                         label='Customer Name'
//                         className='col-md-12'>
//                         <Input
//                           type='text'
//                           onChange={formik.handleChange}
//                           onBlur={formik.handleBlur}
//                           value={formik.values.walk_in_customer_name}
//                           isValid={formik.isValid}
//                           isTouched={formik.touched.walk_in_customer_name}
//                           invalidFeedback={formik.errors.walk_in_customer_name}
//                         />
//                       </FormGroup>
//                     </div>
//                   ) : (
//                     ''
//                   )}
//                   <div className='col-md-3'>
//                     <FormGroup id='request' label='Request Date Range'>
//                       <Flatpickr
//                         className='form-control'
//                         value={formik.values.date || ''}
//                         options={{
//                           dateFormat: 'd-m-Y',
//                         }}
//                         onChange={(date, dateStr) => {
//                           setDateRange(dateStr);
//                           formik.setFieldValue('date', dateStr); // Update the formik field with the selected date
//                         }}
//                         id='default-picker'
//                       />
//                     </FormGroup>
//                   </div>
//                   <Button
//                     color='primary'
//                     className={classNames('text-nowrap', {
//                       'col-md-2 border-light': true,
//                     })}
//                     icon={!isPrintAllReportLoading && 'FilePdfFill'}
//                     isDisable={isPrintAllReportLoading}
//                     onClick={() => printReportAll2(2)}>
//                     {isPrintAllReportLoading && <Spinner isSmall inButton />}
//                     {isPrintAllReportLoading ? 'Generating PDF...' : 'View PDF'}
//                   </Button>
//                   <div className='col-md-2'>
//                     <Button color='primary' onClick={() => printReportAll()} isOutline isActive>
//                       Search
//                     </Button>
//                   </div>
//                 </div>
//               </CardBody>
//               <View
//                 tableData={tableData}
//                 tableDataLoading={tableDataLoading}
//               />
//             </Card>
//           </div>
//         </div>
//       </Page>
//     </PageWrapper>
//   );
// };

// export default Files;

import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

import moment from 'moment'; // Import the moment library
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
import GeneratePDF from './supplierPayable';
import View from './view';

require('flatpickr/dist/flatpickr.css');

const Files = () => {
	// eslint-disable-next-line no-unused-vars
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const [customerOptions, setCustomerOptions] = useState([]);
	const [customerOptionsLoading, setCustomerOptionsLoading] = useState(false);
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	// const saleTypeOptions = [
	//   {
	//     id: 1,
	//     value: 1,
	//     label: 'Walk-in Customer',
	//   },
	//   {
	//     id: 2,
	//     value: 2,
	//     label: 'Registered Customer',
	//   },
	// ];

	// Initialize formik with default date set to current day
	const formik = useFormik({
		initialValues: {
			supplier_id: '',
			date: moment().format('DD-MM-YYYY'), // Set default date to current day
			sale_type: 2,
			walk_in_customer_name: '',
		},
	});

	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	// const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);

	// const printReportAll = async () => {
	// 	const response = await apiClient
  //     .get(
  //       `/getSupplierPayableBalance?supplier_id=${formik.values.supplier_id}&date=${formik.values.date || ''}`);
  //   console.log(response);
  //   setTableData(response.data.Receivables);
  //   setTableDataLoading(false);
  //   dispatch(
  //     updateSingleState([
  //       response.data.Receivables,
  //       'purchase',
  //       'stockReport',
  //       'tableData',
  //     ]));
  //   return response.data;
	// };

    // Define printReportAll as a useCallback with its dependencies
    const printReportAll = useCallback(() => {
      return apiClient
        .get(
          `/getSupplierPayableBalance?supplier_id=${formik.values.supplier_id}&date=${formik.values.date || ''}`,
        )
        .then((response) => {
          console.log(response);
          setTableData(response.data.Receivables);
          setTableDataLoading(false);
          dispatch(
            updateSingleState([
              response.data.Receivables,
              'purchase',
              'stockReport',
              'tableData',
            ]),
          );
          // GeneratePDF(response.data, docType, formik.values.item_id);
          return response.data;
        });
    }, [formik.values.supplier_id, formik.values.date, dispatch]);

	const printReportAll2 = async (docType) => {
		const response = await apiClient.get(
			`/getSupplierPayableBalance?supplier_id=${formik.values.supplier_id}&date=${
				formik.values.date || ''
			}`,
		);
		console.log(response);
		setTableData(response.data.Receivables);
		setTableDataLoading(false);
		dispatch(
			updateSingleState([response.data.Receivables, 'purchase', 'stockReport', 'tableData']),
		);
		GeneratePDF(response.data.Receivables, docType, formik.values.item_id, formik.values.date);
		return response.data;
	};

	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCustomerOptions(rec);
			setCustomerOptionsLoading(false);
		});
	}, []);

	// useEffect(() => {
	// 	printReportAll();
	// }, [store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo]);
  useEffect(() => {
    printReportAll();
  }, [printReportAll, store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo]);
  

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Supplier Payable Report</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									{formik.values.sale_type === 2 ? (
										<div className='col-md-2'>
											<FormGroup label='Supplier' id='supplier_id'>
												<Select
													className='col-md-12'
													classNamePrefix='select'
													options={customerOptions}
													isLoading={customerOptionsLoading}
													isClearable
													value={
														formik.values.supplier_id
															? customerOptions?.find(
																	(c) =>
																		c.value ===
																		formik.values.supplier_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'supplier_id',
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
									<div className='col-md-3'>
										<FormGroup id='request' label='Request Date Range'>
											<Flatpickr
												className='form-control'
												value={formik.values.date || ''}
												options={{
													dateFormat: 'd-m-Y',
												}}
												onChange={(date, dateStr) => {
													setDateRange(dateStr);
													formik.setFieldValue('date', dateStr); // Update the formik field with the selected date
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
								date={dateRange}
								tableDataLoading={tableDataLoading}
							/>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Files;
