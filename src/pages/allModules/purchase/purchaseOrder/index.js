// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair

import React, { useEffect, useState } from 'react';

// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import Select from 'react-select';
import Flatpickr from 'react-flatpickr';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';

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

import View from './View';
import Add from './Add';
import AddSupplierPo from './AddSupplierPo';
import AddDirectPo from './AddDirectPo';

export const searchByOptions = [{ value: 1, text: 'Id' }];

export const poTypeOptions = [
	{ id: 1, value: 1, label: 'PO' },
	{ id: 2, value: 2, label: 'Supplier PO' },
	{ id: 3, value: 3, label: 'Direct PO' },
];
require('flatpickr/dist/flatpickr.css');

const Categories = () => {
	const dispatch = useDispatch();
	const [selectedR,setSelectedR] = useState(null)
	const store = useSelector((state) => state.tableCrud);
console.log('store',store)
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [supplierDropDown, setSupplierDropDown] = useState([]);
	const [supplierDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [selectedSupplier, setSelectedSupplier] = useState('');

	const [selectedPoType, setSelectedPoType] = useState('');

	const [poNo, setPoNo] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const [dateRange2, setDateRange2] = useState({ from: '', to: '', fulldate: '' });

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getPolist?records=${store.data.purchase.purchaseOrder.perPage}&pageNo=${
					store.data.purchase.purchaseOrder.pageNo
				}&colName=id&sort=desc
			&supplier_id=${selectedSupplier ? selectedSupplier.id : ''}&po_no=${poNo}&po_type=${
					selectedPoType ? selectedPoType.id : ''
				}&from_date=${dateRange.from || ''}&to_date=${dateRange.to || ''}&receive_from=${
					dateRange2.from || ''
				}&receive_to=${dateRange2.to || ''}`,
				{},
			)
			.then((response) => {
				console.log('responsepaginations',response)
				setTableData(response.data.purchaseorderlist.data);
				setTableData2(response.data.purchaseorderlist);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.purchaseorderlist,
						'purchase',
						'purchaseOrder',

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dateRange]);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.purchase.purchaseOrder.perPage, store.data.purchase.purchaseOrder.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Purchase Order List</CardTitle>
								</CardLabel>
								<CardActions className='row g-4'>
									<ButtonGroup>
										<Add refreshTableData={refreshTableData} />
										<AddSupplierPo refreshTableData={refreshTableData} />
										<AddDirectPo refreshTableData={refreshTableData} />
									</ButtonGroup>
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
							setSelectedR={setSelectedR}
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
