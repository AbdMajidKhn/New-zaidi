// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
import moment from 'moment';
import Select, { createFilter } from 'react-select';
import * as XLSX from 'xlsx';
import apiClient from '../../../../baseURL/api';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardTitle,
	CardLabel,
} from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import Input from '../../../../components/bootstrap/forms/Input';

import GeneratePDF from './purchaseReports';
// import Excel from './excel';

require('flatpickr/dist/flatpickr.css');

const Files = () => {
	const [supplierDropdown, setSupplierDropDown] = useState([]);
	const [supplierDropdownLoading, setSupplierDropDownLoading] = useState([]);
	const [selectedSupplier, setSelectedCustomer] = useState('');
	const [itemDropdown, setItemDropDown] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [itemDropdownLoading, setItemDropDownLoading] = useState([]);
	const [selectedItem, setSelectedItem] = useState('');
	const poTypeOptions = [
		{ id: 1, value: 1, label: 'PO' },
		{ id: 2, value: 2, label: 'Supplier PO' },
		{ id: 3, value: 3, label: 'Direct PO' },
	];
	const [selectedPoType, setSelectedPoType] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const [toDate, setToDate] = useState('');
	const [fromDate, setFromDate] = useState('');
	// const [poType, setPoType] = useState('');

	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const printReportAll = (docType) => {
		apiClient
			.get(
				`/getPurchaseReportSupplierWise?supplier_id=${
					selectedSupplier ? selectedSupplier.id : ''
				}&item_id=${selectedItem ? selectedItem.id : ''}
				&po_type=${selectedPoType ? selectedPoType.id : ''}
				&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
			)
			.then((response) => {
				setTableData(response.data.purchaseorder);
				GeneratePDF(
					response.data.purchaseorder,
					docType,
					selectedSupplier,
					selectedItem,
					dateRange.from,
					dateRange.to,
					selectedPoType,
				);
			});
	};

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

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=2`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	// const printReport = async () => {
	// 	try {
	// 		const response = await apiClient.get('/getPurchaseReport');
	// 		const purchaseOrderList = response.data.purchaseorderlist;
	// 		const reportData = [];

	// 		purchaseOrderList.forEach((purchaseOrder) => {
	// 			purchaseOrder.purchaseorderchild.forEach((item) => {
	// 				const rowData = {
	// 					pack: item.pack,
	// 					quantity: item.quantity,
	// 					item: item.item.name,
	// 					rate: item.item.rate,
	// 					total: item.total,
	// 				};
	// 				reportData.push(rowData);
	// 			});
	// 		});

	//
	// 		return reportData;
	// 	} catch (error) {
	//
	// 		throw error;
	// 	}
	// };
	// const handleOnExport = () => {
	// 	const reportTitle = 'Purchase Order Report';
	// 	printReport()
	// 		.then((reportData) => {
	// 			const table1 = [['S.No.', 'Item', 'Pack Size', 'Quantity', 'Rate', 'Amount']];

	// 			let count = 0;
	// 			reportData.forEach((row) => {
	// 				count += 1;
	// 				table1.push([count, row.item, row.pack, row.quantity, row.rate, row.total]);
	// 			});
	// 			const wb = XLSX.utils.book_new();
	// 			const ws = XLSX.utils.json_to_sheet(table1);
	// 			ws['!cols'] = [
	// 				{ width: 5 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 				{ width: 15 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 				{ width: 20 },
	// 			];

	// 			const merge = {
	// 				s: {
	// 					r: 0,
	// 					c: 0,
	// 				},
	// 				e: {
	// 					r: 0,
	// 					c: table1[0].length - 1,
	// 				},
	// 			};
	// 			XLSX.utils.sheet_add_aoa(ws, [[reportTitle]], { origin: 'A1' });
	// 			ws['!merges'] = [merge];
	// 			// ws['!cols'][0].hidden = true;

	// 			XLSX.utils.book_append_sheet(wb, ws, 'SHEET 1');
	// 			XLSX.writeFile(wb, 'MyExcel.xlsx');
	// 		})
	// 		.catch((err) => {
	// 			console.error('Error exporting report:', err);
	// 			// handle error
	// 		});
	// };

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Purchase Report Supplier wise</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<div className='col-md-2'>
										<FormGroup label='Supplier' id='supplier_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={supplierDropdown}
												isLoading={supplierDropdownLoading}
												isClearable
												value={selectedSupplier}
												onChange={(val) => {
													setSelectedCustomer(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
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

									<div className='col-md-3'>
										<FormGroup label='PO Type' id='po_type'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={poTypeOptions}
												isClearable
												value={selectedPoType}
												onChange={(val) => {
													setSelectedPoType(val);
												}}
											/>
										</FormGroup>
									</div>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading ? 'Generating PDF...' : 'View PDF'}
									</Button>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Files;
