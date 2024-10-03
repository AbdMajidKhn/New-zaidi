// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import Select, { createFilter } from 'react-select';
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
import View from './View';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [customerDropDown, setSupplierDropDown] = useState([]);
	const [customerDropDownLoading, setSupplierDropDownLoading] = useState([]);
	const [selectedCustomer, setSelectedCustomer] = useState('');
	const [poNo, setPoNo] = useState('');
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getSalesPolist?records=${store.data.sale.salePurchase.perPage}&pageNo=${
					store.data.sale.salePurchase.pageNo
				}&colName=id&sort=desc
				&customer_id=${selectedCustomer ? selectedCustomer.id : ''}&po_no=${poNo}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.purchaseorderlist.data);
				setTableData2(response.data.purchaseorderlist);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.purchaseorderlist,
						'sale',
						'salePurchase',
						'tableData',
					]),
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
			setSupplierDropDown(rec);
			setSupplierDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.sale.salePurchase.perPage, store.data.sale.salePurchase.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Sale PurchaseOrder List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
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
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Po No' id='poNo'>
											<Input
												id='invoice_no'
												onChange={(e) => {
													setPoNo(e.target.value);
												}}
												value={poNo}
												validFeedback='Looks good!'
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
