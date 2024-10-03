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
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';

import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Button from '../../../../components/bootstrap/Button';
import View from './view';
import 'flatpickr/dist/themes/light.css';

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

	const [tableData, setTableData] = useState([]);
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
	const [manufacturerDropDown, setManufacturerDropDown] = useState([]);
	const [manufacturerDropDownLoading, setManufacturerDropDownLoading] = useState([]);
	const [selectedmanufacturer, setSelectedManufacturer] = useState('');
	const [dateRange, setDateRange] = useState({ from: '', to: '', fulldate: '' });
	const [batchNo, setBatchNo] = useState('');
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getDisposedStockItemsInventory?records=${store.data.purchase.exposedStock.perPage}&pageNo=${store.data.purchase.exposedStock.pageNo}&colName=id&sort=desc`,
				{},
			)
			.then((response) => {
				setTableData(response.data.itemsInventory.data);
				setTableData2(response.data.itemsInventory);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.itemsInventory,
						'purchase',
						'exposedStock',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
		setItemDropDownLoading(true);

		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryDropDown(rec);
			setCategoryDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getSubCategoriesDropDown`).then((response) => {
			const rec = response.data.subcategories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setSubcategoryDropDown(rec);
			setSubcategoryDropDownLoading(false);
		});

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
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManufacturerDropDown(rec);
			setManufacturerDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.purchase.exposedStock.perPage, store.data.purchase.exposedStock.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Disposed Stock </CardTitle>
								</CardLabel>
								<CardActions />
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
									<div className='col-md-2'>
										<FormGroup label='Manufacturer' id='manufacturer_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={manufacturerDropDown}
												isLoading={manufacturerDropDownLoading}
												isClearable
												value={selectedmanufacturer}
												onChange={(val) => {
													setSelectedManufacturer(val);
												}}
											/>
										</FormGroup>
									</div>

									<div className='col-md-2'>
										<FormGroup
											id='remarks'
											label='Batch No'
											className='col-md-12'>
											<Input
												onChange={(e) => {
													setBatchNo(e.target.value);
												}}
												value={batchNo}
											/>
										</FormGroup>
									</div>
									<div className='col-md-4'>
										<FormGroup id='Expiry_date' label='Expiry Date Range'>
											<Flatpickr
												className='form-control'
												value={dateRange.fullDate || ''}
												// eslint-disable-next-line react/jsx-boolean-value

												options={{
													mode: 'range',
													dateFormat: 'd-m-Y',
													// defaultDate: ['2021-10-10', '2022-10-20'],
													// disable:
												}}
												onChange={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('yyyy-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('yyyy-MM-DD')
															: '',
														fullDate: dateStr,
													});
												}}
												onClose={(date, dateStr) => {
													setDateRange({
														from: date[0]
															? moment(date[0]).format('yyyy-MM-DD')
															: '',
														to: date[1]
															? moment(date[1]).format('yyyy-MM-DD')
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
