// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';

import Select, { createFilter } from 'react-select';
import Button from '../../../../components/bootstrap/Button';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
// eslint-disable-next-line import/no-unresolved
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

import View from './view';

import Add from './add';

export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [selectedCategory, setSelectedCategory] = useState('');
	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getCategories?records=${store.data.itemsManagement.category.perPage}&pageNo=${
					store.data.itemsManagement.category.pageNo
				}&colName=id&sort=desc&category_id=${selectedCategory ? selectedCategory.id : ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.categories.data);
				setTableData2(response.data.categories);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.categories,
						'itemsManagement',
						'category',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
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
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.itemsManagement.category.perPage, store.data.itemsManagement.category.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Category List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<CardBody>
								{/* <div className='row g-4'>
									<FormGroup className='col-md-2' label='Category'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setCategoryOptionsSelected({
													value: e.target.value,
												});
											}}
											value={categoryOptionsSelected.value}
											list={categoryOptions}
										/>
									</FormGroup>
								</div> */}
								<br />

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
