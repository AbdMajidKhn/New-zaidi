// import React, { useEffect, useState } from 'react';

// // ** apiClient Imports
// import { useDispatch, useSelector } from 'react-redux';

// import { updateSingleState } from '../../redux/tableCrud/index';

// import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// import Page from '../../../../layout/Page/Page';
// import Card, {
// 	// CardBody,
// 	CardHeader,
// 	CardActions,
// 	CardLabel,
// 	CardTitle,
// } from '../../../../components/bootstrap/Card';

// import apiClient from '../../../../baseURL/api';

// import View from './view';
// import 'flatpickr/dist/themes/light.css';

// export const searchByOptions = [{ value: 1, text: 'Id' }];
// export const categoryOptions = [
// 	{ value: 0, text: 'qqq' },
// 	{ value: 1, text: 'www' },
// 	{ value: 2, text: 'eee' },
// ];
// // require('flatpickr/dist/plugins/monthSelect/style.css');
// require('flatpickr/dist/flatpickr.css');

// const Categories = () => {
// 	const dispatch = useDispatch();
// 	const store = useSelector((state) => state.tableCrud);

// 	const [tableData, setTableData] = useState([]);
// 	const [tableData2, setTableData2] = useState([]);
// 	const [tableDataLoading, setTableDataLoading] = useState(true);
// 	const [totalDataCount, setTotalDataCount] = useState({
// 		total: '',
// 		from: '',
// 		to: '',
// 		per_page: '',
// 		current_page: '',
// 	});

// 	const refreshTableData = () => {
// 		setTableDataLoading(true);
// 		apiClient
// 			.get(
// 				`/getStockReport?records=${store.data.purchase.return.perPage}&pageNo=${store.data.purchase.return.pageNo}&colName=id&sort=desc
// 				`,
// 				{},
// 			)
// 			.then((response) => {
// 				// console.log(response.data)
// 				setTotalDataCount({
// 					total: response.data.itemsInventory.total,
// 					from: response.data.itemsInventory.from,
// 					to: response.data.itemsInventory.to,
// 					per_page: response.data.itemsInventory.per_page,
// 					current_page: response.data.itemsInventory.current_page
// 				});
// 				setTableData(response.data.itemsInventory.data);
// 				setTableData2(response.data.itemsInventory);
// 				setTableDataLoading(false);
// 				dispatch(
// 					updateSingleState([
// 						response.data.itemsInventory,
// 						'purchase',
// 						'return',
// 						'tableData',
// 					]),
// 				);
// 			});
// 	};

// 	useEffect(() => {
// 		refreshTableData();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [store.data.purchase.return.perPage, store.data.purchase.return.pageNo]);

// 	return (
// 		<PageWrapper>
// 			<Page container='fluid'>
// 				<div className='row'>
// 					<div className='col-12'>
// 						<Card>
// 							<CardHeader>
// 								<CardLabel icon='Assignment'>
// 									<CardTitle>Stock Report </CardTitle>
// 								</CardLabel>
// 								<CardActions />
// 							</CardHeader>
// 							<View
// 								totalDataCount={totalDataCount}
// 								tableData={tableData}
// 								tableData2={tableData2}
// 								refreshTableData={refreshTableData}
// 								tableDataLoading={tableDataLoading}
// 							/>
// 						</Card>
// 					</div>
// 				</div>
// 			</Page>
// 		</PageWrapper>
// 	);
// };

// export default Categories;

// import React, { useEffect, useState } from 'react';

// // ** apiClient Imports
// import { useDispatch, useSelector } from 'react-redux';
// import Select from 'react-select';
// import Flatpickr from 'react-flatpickr';
// import moment from 'moment';

// import { updateSingleState } from '../../redux/tableCrud/index';

// import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
// import Page from '../../../../layout/Page/Page';
// import Card, {
// 	// CardBody,
// 	CardHeader,
// 	CardActions,
// 	CardLabel,
// 	CardTitle,
// 	CardBody,
// } from '../../../../components/bootstrap/Card';

// import apiClient from '../../../../baseURL/api';

// import View from './view';
// import 'flatpickr/dist/themes/light.css';
// import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// import Button from '../../../../components/bootstrap/Button';
// import PdfView from './stockPdf';

// export const searchByOptions = [{ value: 1, text: 'Id' }];
// export const categoryOptions = [
// 	{ value: 0, text: 'qqq' },
// 	{ value: 1, text: 'www' },
// 	{ value: 2, text: 'eee' },
// ];
// // require('flatpickr/dist/plugins/monthSelect/style.css');
// require('flatpickr/dist/flatpickr.css');

// const Categories = () => {
// 	const dispatch = useDispatch();
// 	const store = useSelector((state) => state.tableCrud);

// 	const [tableData, setTableData] = useState([]);
// 	const [tableData2, setTableData2] = useState([]);
// 	const [tableDataLoading, setTableDataLoading] = useState(true);
// 	const [totalDataCount, setTotalDataCount] = useState({
// 		total: '',
// 		from: '',
// 		to: '',
// 		per_page: '',
// 		current_page: '',
// 	});

// 	const [categoryDropDown, setCategoryDropDown] = useState([]);
// 	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
// 	const [selectedcategory, setSelectedCategory] = useState('');
// 	const [subcategoryDropDown, setSubcategoryDropDown] = useState([]);
// 	const [subcategoryDropDownLoading, setSubcategoryDropDownLoading] = useState([]);
// 	const [selectedsubcategory, setSelectedSubcategory] = useState('');
// 	const [itemDropDown, setItemDropDown] = useState([]);
// 	const [itemDropDownLoading, setItemDropDownLoading] = useState([]);
// 	const [selecteditem, setSelectedItem] = useState('');

// 	const [dateRange, setDateRange] = useState({
// 		from: '',
// 		to: '',
// 		fullDate: '',
// 	});

// 	// const refreshTableData = () => {
// 	// 	setTableDataLoading(true);

// 	// 	apiClient
// 	// 		.get(
// 	// 			`/getStockReport?records=${store.data.purchase.return.perPage}&pageNo=${
// 	// 				store.data.purchase.return.pageNo
// 	// 			}&colName=id&sort=desc
// 	// 		&subcategory_id=${selectedsubcategory ? selectedsubcategory.id : ''}&category_id=${
// 	// 				selectedcategory ? selectedcategory.id : ''
// 	// 			}&item_id=${selecteditem ? selecteditem.id : ''}`,
// 	// 			{},
// 	// 		)
// 	// 		.then((response) => {
// 	// 			// Fetch all data from the API
// 	// 			const allData = response.data.itemsInventory.data;

// 	// 			// Filter the data based on the selected date range if a date range is selected
// 	// 			let filteredData = allData;
// 	// 			if (dateRange.from && dateRange.to) {
// 	// 				filteredData = allData.filter((item) => {
// 	// 					const itemDate = moment(item.date, 'YYYY-MM-DD'); // Replace 'date' with your date field
// 	// 					const fromDate = moment(dateRange.from, 'YYYY-MM-DD');
// 	// 					const toDate = moment(dateRange.to, 'YYYY-MM-DD');
// 	// 					return itemDate.isBetween(fromDate, toDate, null, '[]'); // '[]' includes both fromDate and toDate
// 	// 				});
// 	// 			}

// 	// 			// Set the filtered data
// 	// 			console.log(response.data)
// 	// 			console.log(filteredData)
// 	// 			setTotalDataCount({
// 	// 				total: response.data.itemsInventory.total,
// 	// 				from: response.data.itemsInventory.from,
// 	// 				to: response.data.itemsInventory.to,
// 	// 				per_page: response.data.itemsInventory.per_page,
// 	// 				current_page: response.data.itemsInventory.current_page,
// 	// 			});
// 	// 			setTableData(filteredData);
// 	// 			setTableData2(response.data.itemsInventory);
// 	// 			setTableDataLoading(false);
// 	// 			dispatch(
// 	// 				updateSingleState([
// 	// 					response.data.itemsInventory,
// 	// 					'purchase',
// 	// 					'return',
// 	// 					'tableData',
// 	// 				]),
// 	// 			);
// 	// 		});
// 	// };

// 	const refreshTableData = () => {
// 		setTableDataLoading(true);

// 		apiClient
// 			.get(
// 				`/getStockReport?records=${store.data.purchase.return.perPage}&pageNo=${
// 					store.data.purchase.return.pageNo
// 				}&colName=id&sort=desc&subcategory_id=${
// 					selectedsubcategory ? selectedsubcategory.id : ''
// 				}&category_id=${selectedcategory ? selectedcategory.id : ''}&item_id=${
// 					selecteditem ? selecteditem.id : ''
// 				}`,
// 				{},
// 			)
// 			.then((response) => {
// 				// Fetch all data from the API
// 				const allData = response.data.itemsInventory.data;

// 				// Filter the data based on the selected date range if a date range is selected
// 				let filteredData = allData;

// 				if (dateRange.from && dateRange.to) {
// 					filteredData = filteredData.filter((item) => {
// 						const itemDate = moment(item.date, 'YYYY-MM-DD'); // Replace 'date' with your date field
// 						const fromDate = moment(dateRange.from, 'YYYY-MM-DD');
// 						const toDate = moment(dateRange.to, 'YYYY-MM-DD');
// 						return itemDate.isBetween(fromDate, toDate, null, '[]'); // '[]' includes both fromDate and toDate
// 					});
// 				}

// 				console.log(filteredData);

// 				// Filter the data based on the selected category if a category is selected
// 				if (selectedcategory) {
// 					filteredData = filteredData.filter((item) => {
// 						return item.item.category_id === selectedcategory.id;
// 					});
// 				}

// 				// Set the filtered data
// 				console.log(response.data);
// 				console.log(filteredData);
// 				setTotalDataCount({
// 					total: response.data.itemsInventory.total,
// 					from: response.data.itemsInventory.from,
// 					to: response.data.itemsInventory.to,
// 					per_page: response.data.itemsInventory.per_page,
// 					current_page: response.data.itemsInventory.current_page,
// 				});
// 				setTableData(filteredData);
// 				setTableData2(response.data.itemsInventory);
// 				setTableDataLoading(false);
// 				dispatch(
// 					updateSingleState([
// 						response.data.itemsInventory,
// 						'purchase',
// 						'return',
// 						'tableData',
// 					]),
// 				);
// 			});
// 	};

// 	useEffect(() => {
// 		setCategoryDropDownLoading(true);

// 		apiClient.get(`/getCategoriesDropDown`).then((response) => {
// 			const rec = response.data.categories.map(({ id, name }) => ({
// 				id,
// 				value: id,
// 				label: name,
// 			}));
// 			setCategoryDropDown(rec);
// 			setCategoryDropDownLoading(false);
// 		});
// 	}, []);

// 	useEffect(() => {
// 		setSubcategoryDropDownLoading(true);
// 		apiClient
// 			.get(
// 				`/getSubCategoriesDropDown?category_id=${
// 					selectedcategory ? selectedcategory.id : ''
// 				}`,
// 			)
// 			.then((response) => {
// 				const rec = response.data.subcategories.map(({ id, name }) => ({
// 					id,
// 					value: id,
// 					label: name,
// 				}));
// 				setSubcategoryDropDown(rec);
// 				setSubcategoryDropDownLoading(false);
// 			});
// 	}, [selectedcategory]);

// 	useEffect(() => {
// 		setItemDropDownLoading(true);

// 		// eslint-disable-next-line no-console
// 		apiClient
// 			.get(
// 				`/getItemsDropDown?category_id=${
// 					selectedcategory ? selectedcategory.id : ''
// 				}&sub_category_id=${selectedsubcategory ? selectedsubcategory.id : ''}`,
// 			)
// 			.then((response) => {
// 				const rec = response.data.items.map(({ id, name, subcategory, category }) => ({
// 					id,
// 					value: id,
// 					label: `${category.name}-${subcategory.name}-${name}`,
// 				}));
// 				setItemDropDown(rec);
// 				setItemDropDownLoading(false);
// 			});

// 		// eslint-disable-next-line no-console
// 	}, [selectedcategory, selectedsubcategory]);

// 	useEffect(() => {
// 		refreshTableData();
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [store.data.purchase.return.perPage, store.data.purchase.return.pageNo]);

// 	return (
// 		<PageWrapper>
// 			<Page container='fluid'>
// 				<div className='row'>
// 					<div className='col-12'>
// 						<Card>
// 							<CardHeader>
// 								<CardLabel icon='Assignment'>
// 									<CardTitle>Stock Report </CardTitle>
// 								</CardLabel>
// 								<CardActions />
// 							</CardHeader>
// 							<CardBody>
// 								<div className='row g-4 d-flex align-items-end'>
// 									<div className='col-md-2'>
// 										<FormGroup label='Category' id='category_id'>
// 											<Select
// 												className='col-md-12'
// 												classNamePrefix='select'
// 												options={categoryDropDown}
// 												isLoading={categoryDropDownLoading}
// 												isClearable
// 												value={selectedcategory}
// 												onChange={(val) => {
// 													setSelectedCategory(val);
// 													// setSelectedSubcategory('');
// 													// setSelectedItem('');
// 												}}
// 											/>
// 										</FormGroup>
// 									</div>
// 									<div className='col-md-2'>
// 										<FormGroup label='Sub Category' id='subcategory_id'>
// 											<Select
// 												className='col-md-12'
// 												classNamePrefix='select'
// 												options={subcategoryDropDown}
// 												isLoading={subcategoryDropDownLoading}
// 												isClearable
// 												value={selectedsubcategory}
// 												onChange={(val) => {
// 													setSelectedSubcategory(val);
// 													// setSelectedItem('');
// 												}}
// 											/>
// 										</FormGroup>
// 									</div>
// 									<div className='col-md-2'>
// 										<FormGroup label='Item' id='item_id'>
// 											<Select
// 												className='col-md-12'
// 												classNamePrefix='select'
// 												options={itemDropDown}
// 												isLoading={itemDropDownLoading}
// 												isClearable
// 												value={selecteditem}
// 												onChange={(val) => {
// 													setSelectedItem(val);
// 												}}
// 											/>
// 										</FormGroup>
// 									</div>
// 									<div className='col-md-3'>
// 										<FormGroup id='date_range' label='Request Date Range'>
// 											<Flatpickr
// 												className='form-control'
// 												value={dateRange.fullDate}
// 												options={{
// 													mode: 'range',
// 													dateFormat: 'd-m-Y',
// 												}}
// 												onChange={(selectedDates, dateStr) => {
// 													const [from, to] = dateStr.split(' to ');
// 													setDateRange({
// 														from: from
// 															? moment(from, 'DD-MM-YYYY').format(
// 																	'YYYY-MM-DD',
// 															  )
// 															: '',
// 														to: to
// 															? moment(to, 'DD-MM-YYYY').format(
// 																	'YYYY-MM-DD',
// 															  )
// 															: '',
// 														fullDate: dateStr,
// 													});
// 												}}
// 												id='date-range-picker'
// 											/>
// 										</FormGroup>
// 									</div>

// 									<div className='col-md-2'>
// 										<Button
// 											color='primary'
// 											onClick={() => refreshTableData()}
// 											isOutline
// 											// isDisable={landsViewLoading}
// 											isActive>
// 											Search
// 										</Button>
// 									</div>

// 									<div className='col-md-2'>
// 										<PdfView tableData={tableData} />
// 									</div>
// 								</div>
// 								<br />

// 								<View
// 									totalDataCount={totalDataCount}
// 									tableData={tableData}
// 									tableData2={tableData2}
// 									refreshTableData={refreshTableData}
// 									tableDataLoading={tableDataLoading}
// 								/>
// 							</CardBody>
// 						</Card>
// 					</div>
// 				</div>
// 			</Page>
// 		</PageWrapper>
// 	);
// };

// export default Categories;

import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';

import { updateSingleState } from '../../redux/tableCrud/index';

import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	// CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';
import PdfView from './stockPdf';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import View from './view';
import 'flatpickr/dist/themes/light.css';
// import PdfView from './stockPdf';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];
// require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const currentMoment = moment();
	const formattedDate = currentMoment.format('YYYY-MM-DD');

	const defaultTodate = formattedDate;
	const defaultFromdate = '2023-10-01';
	const [tableData, setTableData] = useState([]);
	const [tableDataForpdf, setTableDataForpdf] = useState([]);
	const [totalQtyIn, setTotalQtyIn] = useState(0);
	const [totalRecords, setTotalRecords] = useState(0);
	const [totalQtyOut, setTotalQtyOut] = useState(0);

	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [selectedcategory, setSelectedCategory] = useState('');
	const [subcategoryDropDown, setSubcategoryDropDown] = useState([]);
	const [subcategoryDropDownLoading, setSubcategoryDropDownLoading] = useState([]);
	const [selectedsubcategory, setSelectedSubcategory] = useState('');
	const [itemDropDown, setItemDropDown] = useState([]);
	const [itemDropDownLoading, setItemDropDownLoading] = useState([]);
	const [selecteditem, setSelectedItem] = useState('');
	const [dateRange, setDateRange] = useState({
		from: '',
		to: '',
		fulldate: `${defaultFromdate} to ${defaultTodate}`,
	});
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getStockReport?records=${store.data.purchase.stockReport.perPage}&pageNo=${store.data.purchase.stockReport.pageNo}&colName=id&sort=desc&subcategory_id=${selectedsubcategory ? selectedsubcategory.id : ''}&category_id=${selectedcategory ? selectedcategory.id : ''}&item_id=${selecteditem ? selecteditem.id : ''}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.itemsInventory?.data || []);
				setTableData2(response.data.itemsInventory);
				setTableDataLoading(false);
				setTotalRecords(response.data.itemsInventory.total);
	
				let qtyIn = 0;
				let qtyOut = 0;
	
				response.data.itemsInventory.data.forEach((item) => {
					qtyIn += Number(item.quantity_in);
					qtyOut += Number(item.quantity_out);
				});
	
				setTotalQtyIn(qtyIn);
				setTotalQtyOut(qtyOut);
				console.log(totalQtyIn, totalQtyOut);
	
				dispatch(
					updateSingleState([
						response.data.itemsInventory,
						'purchase',
						'stockReport',
						'tableData',
					]),
				);
			});
	};
	const [pdfRendered, setPdfRendered] = useState(false);

	const handlePdfButtonClick = () => {
		apiClient
			.get(
				`/getStockReport?records=${totalRecords}&pageNo=${store.data.purchase.stockReport.pageNo}&colName=id&sort=desc&subcategory_id=${selectedsubcategory ? selectedsubcategory.id : ''}&category_id=${selectedcategory ? selectedcategory.id : ''}&item_id=${selecteditem ? selecteditem.id : ''}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
				{},
			)
			.then((response) => {
				console.log('here response',response);

				console.log(response.data.itemsInventory.data);
				setTableDataForpdf(response.data.itemsInventory?.data);
				console.log(tableDataForpdf);
			});
		// printPdf();
		setPdfRendered(true);
	};
	
	useEffect(() => {
		setCategoryDropDownLoading(true);

		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryDropDown(rec);
			setCategoryDropDownLoading(false);
		});
	}, []);

	useEffect(() => {
		setSubcategoryDropDownLoading(true);
		apiClient
			.get(
				`/getSubCategoriesDropDown?category_id=${
					selectedcategory ? selectedcategory.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubcategoryDropDown(rec);
				setSubcategoryDropDownLoading(false);
			});
	}, [selectedcategory]);

	useEffect(() => {
		setItemDropDownLoading(true);

		// eslint-disable-next-line no-console
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

		// eslint-disable-next-line no-console
	}, [selectedcategory, selectedsubcategory]);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.purchase.stockReport.perPage, store.data.purchase.stockReport.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Stock Report</CardTitle>
								</CardLabel>
								{/* <CardActions /> */}
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label='Category' id='category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryDropDown}
												isLoading={categoryDropDownLoading}
												isClearable
												value={selectedcategory}
												onChange={(val) => {
													setSelectedCategory(val);
													setSelectedSubcategory('');
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Sub Category' id='subcategory_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subcategoryDropDown}
												isLoading={subcategoryDropDownLoading}
												isClearable
												value={selectedsubcategory}
												onChange={(val) => {
													setSelectedSubcategory(val);
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Item' id='item_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={itemDropDown}
												isLoading={itemDropDownLoading}
												isClearable
												value={selecteditem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='request' label='Request Date Range'>
											<Flatpickr
												className='form-control'
												// value={dateRange.fulldate || ''}
												// value={[dateRange.from, dateRange.to]}
												options={{
													mode: 'range',
													dateFormat: 'Y-m-d',
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
									<div className='col-md-2'>
										{pdfRendered ? (
											<PdfView
												tableDataForpdf={tableDataForpdf}
												totalQtyIn={totalQtyIn}
												totalQtyOut={totalQtyOut}
											/>
										) : (
											// <button type='button' onClick={handlePdfButtonClick}>
											// 	Render PDF
											// </button>
											<Button
												color='primary'
												onClick={handlePdfButtonClick}
												isOutline
												isActive>
												Generate PDF
											</Button>
										)}
									</div>
									{/* <div className='col-md-2'>
										<PdfView tableData={tableData} />
									</div> */}

									<div className='col-md-2'>
										<Button
											color='primary'
											onClick={() => refreshTableData()}
											isOutline
											// isDisable={landsViewLoading}
											isActive>
											Search
										</Button>
									</div>
								</div>
								<br />

								<View
									tableData={tableData}
									tableData2={tableData2}
									refreshTableData={refreshTableData}
									tableDataLoading={tableDataLoading}
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Categories;
