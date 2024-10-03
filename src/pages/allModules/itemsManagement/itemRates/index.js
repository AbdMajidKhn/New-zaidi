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

	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState('');
	const [subcategoryDropDown, setSubCategoryDropDown] = useState([]);
	const [subcategoryDropDownLoading, setSubCategoryDropDownLoading] = useState([]);
	const [selectedSubCategory, setSelectedSubCategory] = useState('');
	const [selectedItem, setSelectedItem] = useState('');
	const [itemDropDown, setItemDropDown] = useState([]);
	const [itemDropDownLoading, setItemDropDownLoading] = useState([]);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getItemsRates?records=${store.data.itemsManagement.itemRates.perPage}&pageNo=${
					store.data.itemsManagement.itemRates.pageNo
				}
				&colName=id&sort=desc&category_id=${selectedCategory ? selectedCategory.id : ''}
				&subcategory_id=${selectedSubCategory ? selectedSubCategory.id : ''}&item_id=${
					selectedItem ? selectedItem.id : ''
				}`,
			)
			.then((response) => {
				setTableData(response.data.PurchasePrice.data);
				setTableData2(response.data.PurchasePrice);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.PurchasePrice,
						'itemsManagement',
						'itemRates',
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
			setSubCategoryDropDown(rec);
			setSubCategoryDropDownLoading(false);
		});

		// eslint-disable-next-line no-console
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
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.itemsManagement.itemRates.perPage, store.data.itemsManagement.itemRates.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Item Rate List</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<br />
								<div className='row g-4 d-flex align-items-end'>
									<div className='col-md-2'>
										<FormGroup label=' Category' id='category_id'>
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
									<div className='col-md-2'>
										<FormGroup label='Sub Category' id='subcategory_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subcategoryDropDown}
												isLoading={subcategoryDropDownLoading}
												isClearable
												value={selectedSubCategory}
												onChange={(val) => {
													setSelectedSubCategory(val);
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
												options={itemDropDown}
												isLoading={itemDropDownLoading}
												isClearable
												value={selectedItem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
												filterOption={createFilter({ matchFrom: 'start' })}
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
