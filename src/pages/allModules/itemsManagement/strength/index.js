// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';

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
export const strengthOptions = [
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

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getStrengthUnits?records=${store.data.itemsManagement.strength.perPage}&pageNo=${store.data.itemsManagement.strength.pageNo}&colName=id&sort=desc`,
				{},
			)
			.then((response) => {
				setTableData(response.data.StrengthUnit.data);
				setTableData2(response.data.StrengthUnit);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.StrengthUnit,
						'itemsManagement',
						'strength',
						'tableData',
					]),
				);
			});
	};

	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.itemsManagement.strength.perPage, store.data.itemsManagement.strength.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Strength List</CardTitle>
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
											value={strengthOptionsSelected.value}
											list={strengthOptions}
										/>
									</FormGroup>
								</div> */}
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
