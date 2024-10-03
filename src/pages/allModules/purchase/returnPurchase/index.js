// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import Select, { createFilter } from 'react-select';
import Flatpickr from 'react-flatpickr';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';

import Input from '../../../../components/bootstrap/forms/Input';
// import Add from './add';
import View from './view';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const invoiceTypeDropDown = [
	{ id: 1, value: 1, label: 'Direct Invoices' },
	{ id: 2, value: 2, label: 'PO Invoices' },
	{ id: 3, value: 3, label: 'Quotation Invoices' },
	{ id: 4, value: 4, label: 'Deleted Invoices' },
];
require('flatpickr/dist/flatpickr.css');

export const poTypeOptions = [
	{ id: 1, value: 1, label: 'PO' },
	{ id: 2, value: 2, label: 'Supplier PO' },
	{ id: 3, value: 3, label: 'Direct PO' },
];
const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [selectedSupplier, setSelectedSupplier] = useState('');

	const [selectedPoType, setSelectedPoType] = useState('');

	const [poNo, setPoNo] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const [dateRange2, setDateRange2] = useState({ from: '', to: '', fulldate: '' });
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getReturnPurchaseOrders?records=${store.data.purchase.return.perPage}&pageNo=${
					store.data.purchase.return.pageNo
				}&colName=id&sort=desc
				&supplier_id=${selectedSupplier ? selectedSupplier.id : ''}&po_no=${poNo}&po_type=${
					selectedPoType ? selectedPoType.id : ''
				}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}&receive_from=${
					dateRange2.from || ''
				}&receive_to=${dateRange2.to || ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.purchaseorderlist.data);
				setTableData2(response.data.purchaseorderlist);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.purchaseorderlist,
						'purchase',
						'return',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
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

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.purchase.return.perPage, store.data.purchase.return.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Purchase Return List</CardTitle>
								</CardLabel>
								<CardActions>
									{/* <Add refreshTableData={refreshTableData} /> */}
								</CardActions>
							</CardHeader>
							<CardBody>
								<br />

								<br />
								<div className='row g-4 d-flex align-items-end'>
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
									<div className='col-md-3'>
										<FormGroup label='Supplier' id='supplier_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={supplierDropDown}
												isLoading={supplierDropDownLoading}
												isClearable
												value={selectedSupplier}
												onChange={(val) => {
													setSelectedSupplier(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Po No' id='po_no'>
											<Input
												id='quotation_no'
												onChange={(e) => {
													setPoNo(e.target.value);
												}}
												value={poNo}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup id='Expiry_date' label='Request Date Range'>
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
										<FormGroup id='Expiry_date' label='Receive Date Range'>
											<Flatpickr
												className='form-control'
												value={dateRange2.fullDate || ''}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													mode: 'range',
													dateFormat: 'd-m-Y',
													// defaultDate: ['2021-10-10', '2022-10-20'],
													// disable:
												}}
												onChange={(date, dateStr) => {
													setDateRange2({
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
													setDateRange2({
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
							</CardBody>
							<View
								tableData={tableData}
								tableData2={tableData2}
								// lastRecord={lastRecord}
								refreshTableData={refreshTableData}
								tableDataLoading={tableDataLoading}
							/>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Categories;
