// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** ApiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import Select, { createFilter } from 'react-select';
import apiClient from '../../../../baseURL/api';

import Button from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import Input from '../../../../components/bootstrap/forms/Input';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardBody,
	CardHeader,
	CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import View from './view';
import Add from './add';
import StockReportExcell from './excel';

export const searchByOptions = [{ value: 1, text: 'Id' }];
// export const categoryOptions = [
// 	{ value: 0, text: 'qqq' },
// 	{ value: 1, text: 'www' },
// 	{ value: 2, text: 'eee' },
// ];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [name2, setName2] = useState('');
	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [unitDropDown, setUnitDropDown] = useState([]);
	const [unitDropDownLoading, setUnitDropDownLoading] = useState([]);
	const [selectedUnit, setSelectedUnit] = useState('');
	const [strengthunitDropDown, setStrengthUnitDropDown] = useState([]);
	const [strengthunitDropDownLoading, setStrengthUnitDropDownLoading] = useState([]);
	const [selectedStrengthUnit, setSelectedStrengthUnit] = useState('');
	const [manufactureDropDown, setManufactureDropDown] = useState([]);
	const [manufactureDropDownLoading, setManufactureDropDownLoading] = useState([]);
	const [selectedManufacture, setSelectedManufacture] = useState('');
	const [selectedStatus, setSelectedStatus] = useState({ id: 2, value: 2, label: 'All' });
	const statusDropDown = [
		{ id: 2, value: 2, label: 'All' },
		{ id: 1, value: 1, label: 'Active' },
		{ id: 0, value: 0, label: 'Incative' },
	];
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getItems?records=${store.data.itemsManagement.itemParts.perPage}&pageNo=${
					store.data.itemsManagement.itemParts.pageNo
				}
			&colName=id&sort=desc&subcategory_id=${selectedCategory ? selectedCategory.id : ''}
			&unit_id=${selectedUnit ? selectedUnit.id : ''}&manufacture_id=${
					selectedManufacture ? selectedManufacture.id : ''
				}&status=${selectedStatus !== 2 ? selectedStatus.id : ''}
			&name=${name2 || ''}&strength_unit_id=${selectedStrengthUnit ? selectedStrengthUnit.id : ''}
			`,
			)
			.then((response) => {
				const tableData3 = response.data.Items.data.map((item, manufacture) => ({
					...item,
					manufacture,
				}));
				setTableData(tableData3);
				setTableData2(response.data.Items);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.Items,
						'itemsManagement',
						'itemParts',
						'tableData',
					]),
				);
			});
	};

	useEffect(() => {
		apiClient.get(`/getSubCategoriesDropDown`).then((response) => {
			const rec = response.data.subcategories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryDropDown(rec);
			setCategoryDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getUnitDropdown`).then((response) => {
			const rec = response.data.Uom.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setUnitDropDown(rec);
			setUnitDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/StrengthUnitDropdown`).then((response) => {
			const rec = response.data.StrengthUnit.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setStrengthUnitDropDown(rec);
			setStrengthUnitDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
		apiClient.get(`/getPersonsDropDown?person_type=3`).then((response) => {
			const rec = response.data.persons.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setManufactureDropDown(rec);
			setManufactureDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.itemsManagement.itemParts.perPage, store.data.itemsManagement.itemParts.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Item List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								<br />
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-3'>
										<FormGroup label='sub Category' id='category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryDropDown}
												isLoading={categoryDropDownLoading}
												isClearable
												value={selectedCategory}
												onChange={(val) => {
													setSelectedCategory(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Unit' id='unit_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={unitDropDown}
												isLoading={unitDropDownLoading}
												isClearable
												value={selectedUnit}
												onChange={(val) => {
													setSelectedUnit(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Strength Unit' id='strength_unit_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={strengthunitDropDown}
												isLoading={strengthunitDropDownLoading}
												isClearable
												value={selectedStrengthUnit}
												onChange={(val) => {
													setSelectedStrengthUnit(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>
									<div className='col-md-3'>
										<FormGroup label='Manufacture' id='manufacture_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={manufactureDropDown}
												isLoading={manufactureDropDownLoading}
												isClearable
												value={selectedManufacture}
												onChange={(val) => {
													setSelectedManufacture(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
											/>
										</FormGroup>
									</div>

									<div className='col-md-3'>
										<FormGroup label='Status' id='status'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={statusDropDown}
												value={selectedStatus}
												onChange={(val) => {
													setSelectedStatus(val);
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup id='name' label='Name' className='col-md-12'>
											<Input
												onChange={(e) => {
													setName2(e.target.value);
												}}
												value={name2}
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
									<div className='col-md-2'>
										<StockReportExcell dataExcel={tableData} />
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
