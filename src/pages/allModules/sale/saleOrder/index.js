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
import Select2 from '../../../../components/bootstrap/forms/Select';

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
import Add from './add';
import View from './view';

export const invoiceTypeDropDown = [
	{ id: 1, value: 1, label: 'Direct Invoices' },
	{ id: 2, value: 2, label: 'PO Invoices' },
	{ id: 3, value: 3, label: 'Quotation Invoices' },
	{ id: 4, value: 4, label: 'Deleted Invoices' },
];
require('flatpickr/dist/flatpickr.css');

export const searchByOptions = [
	{ value: 1, text: 'Invoice No' },
	{ value: 2, text: 'Walk In Customer Name' },
];

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

	const [searchNo, setSearchNo] = useState('');
	const [searchBy, setSearchBy] = useState('1');

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getSales?records=${store.data.sale.saleOrder.perPage}&pageNo=${
					store.data.sale.saleOrder.pageNo
				}&colName=id&sort=desc
				${searchBy === '1' ? `&invoice_no=${searchNo}` : ''}
				${searchBy === '2' ? `&walk_in_customer_name=${searchNo}` : ''}
				&customer_id=${selectedCustomer ? selectedCustomer.id : ''}
				&invoice_type=${selectedInvoiceType ? selectedInvoiceType.id : ''}
				&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.invoices.data);
				setTableData2(response.data.invoices);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([response.data.invoices, 'sale', 'saleOrder', 'tableData']),
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
	}, [store.data.sale.saleOrder.perPage, store.data.sale.saleOrder.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle> Direct sale List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
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
									<div className='col-md-4'>
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
								</div>
								<div className='row g-4 mt-2'>
									<div className='col-md-3'>
										<Select2
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setSearchBy(e.target.value);
											}}
											value={searchBy}
											list={searchByOptions}
										/>
									</div>
									<div className='col-md-3'>
										<Input
											id='searchFileNo'
											type='text'
											onChange={(e) => {
												setSearchNo(e.target.value);
											}}
											value={searchNo}
											validFeedback='Looks good!'
										/>
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
