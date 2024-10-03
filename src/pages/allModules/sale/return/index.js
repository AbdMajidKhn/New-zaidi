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

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [customerDropDown, setCustomerDropDown] = useState([]);

	const [customerDropDownLoading, setCustomerDropDownLoading] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState('');
	const [selectedInvoiceType, setSelectedInvoiceType] = useState('');
	const [invoiceNo, setInvoiceNo] = useState('');
	const [walkin, setWalkin] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getReturnInvoices?records=${store.data.sale.saleReturn.perPage}&pageNo=${
					store.data.sale.saleReturn.pageNo
				}&colName=id&sort=desc
				&customer_id=${selectedCustomer ? selectedCustomer.id : ''}&invoice_no=${invoiceNo}
				&invoice_type=${selectedInvoiceType ? selectedInvoiceType.id : ''}
				&walk_in_customer_name=${walkin}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.invoices.data);
				setTableData2(response.data.invoices);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([response.data.invoices, 'sale', 'saleReturn', 'tableData']),
				);
			});
	};
	useEffect(() => {
		apiClient.get(`/getPersonsDropDown?person_type=1`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCustomerDropDown(rec);
			setCustomerDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.sale.saleReturn.perPage, store.data.sale.saleReturn.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Sales Return List</CardTitle>
								</CardLabel>
								<CardActions>
									{/* <Add refreshTableData={refreshTableData} /> */}
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label='InvoiceType' id='selectedInvoiceType'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={invoiceTypeDropDown}
												isLoading={customerDropDownLoading}
												isClearable
												value={selectedInvoiceType}
												onChange={(val) => {
													setSelectedInvoiceType(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Customer' id='customer_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={customerDropDown}
												isLoading={customerDropDownLoading}
												isClearable
												value={selectedCustomer}
												onChange={(val) => {
													setSelectedCustomer(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Invoice No' id='invoice_no'>
											<Input
												id='invoice_no'
												onChange={(e) => {
													setInvoiceNo(e.target.value);
												}}
												value={invoiceNo}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup
											label='Walk In Customer'
											id='walk_in_customer_name'>
											<Input
												id='walk_in_customer_name'
												onChange={(e) => {
													setWalkin(e.target.value);
												}}
												value={walkin}
												validFeedback='Looks good!'
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup id='request' label='Return Date Range'>
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

								<br />
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
