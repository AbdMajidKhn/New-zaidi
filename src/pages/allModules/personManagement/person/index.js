// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';

// ** Axios Imports
import { useDispatch, useSelector } from 'react-redux';
import Select, { createFilter } from 'react-select';
import Select2 from '../../../../components/bootstrap/forms/Select';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Input from '../../../../components/bootstrap/forms/Input';

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

export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];

export const searchByOptions = [
	{ value: 1, text: 'ID' },
	{ value: 2, text: 'Name' },
	{ value: 3, text: 'CNIC' },
	{ value: 4, text: 'Contact' },
	{ value: 5, text: 'NTN' },
	{ value: 6, text: 'GST' },
	{ value: 7, text: 'DSL' },
];

const Categories = () => {
	const dispatch = useDispatch();
	const statusDropDown = [
		{ id: '', value: 2, label: 'All' },
		{ id: 1, value: 1, label: 'Active' },
		{ id: 0, value: 0, label: 'Incative' },
	];
	const [selectedStatus, setSelectedStatus] = useState('');
	const store = useSelector((state) => state.tableCrud);
	const [personOptions, setPersonOptions] = useState([]);
	const [personOptionsLoading, setPersonOptionsLoading] = useState(false);
	const [selectedPerson, setSelectedPerson] = useState('');
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);

	const [searchNo, setSearchNo] = useState('');
	const [searchBy, setSearchBy] = useState('1');

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getPersons?records=${store.data.personManagement.person.perPage}&pageNo=${
					store.data.personManagement.person.pageNo
				}&colName=id&sort=asc
				${searchBy === '1' ? `&id=${searchNo}` : ''}
				${searchBy === '2' ? `&name=${searchNo}` : ''}
				${searchBy === '3' ? `&cnic=${searchNo}` : ''}
				${searchBy === '4' ? `&phone_no=${searchNo}` : ''}
				${searchBy === '5' ? `&ntn=${searchNo}` : ''}
				${searchBy === '6' ? `&gst=${searchNo}` : ''}
				${searchBy === '7' ? `&dsl=${searchNo}` : ''}
				&person_type=${selectedPerson ? selectedPerson.id : ''}&status=${
					selectedStatus ? selectedStatus.id : ''
				}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.persons.data);
				setTableData2(response.data.persons);

				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.persons,
						'personManagement',
						'person',
						'tableData',
					]),
				);
			});
	};

	// useEffect(() => {
	// 	apiClient
	// 		.get(`/getUnitsDropDown`)
	// 		.then((response) => {
	// 			// eslint-disable-next-line no-console
	// 			// eslint-disable-next-line camelcase
	// 			const rec = response.data.units.map(({ id, name }) => ({
	// 				id,
	// 				value: id,
	// 				// eslint-disable-next-line camelcase
	// 				label: name,
	// 			}));
	// 			setUnitOptions(rec);
	// 			setUnitOptionsLoading(false);
	// 		})
	// 		// eslint-disable-next-line no-console
	// 		.catch((err) => {
	//
	// 		});
	// }, []);
	useEffect(() => {
		apiClient.get(`/getPersonTypes`).then((response) => {
			const rec = response.data.personTypes.map(({ id, type }) => ({
				id,
				value: id,
				label: type,
			}));
			setPersonOptions(rec);
			setPersonOptionsLoading(false);
		});

		// eslint-disable-next-line no-console
	}, []);
	useEffect(() => {
		refreshTableData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [store.data.personManagement.person.perPage, store.data.personManagement.person.pageNo]);

	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>person Management List</CardTitle>
								</CardLabel>
								<CardActions>
									<Add refreshTableData={refreshTableData} />
								</CardActions>
							</CardHeader>
							<div className='row ms-2 align-items-top justify-content-start'>
								<div className='col-md-3   mt-4'>
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
								<div className='col-md-3     mt-4'>
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
								<div className='col-md-2 '>
									<FormGroup label='Person Type' id='person_type'>
										<Select
											className='col-md-12'
											classNamePrefix='select'
											options={personOptions}
											isLoading={personOptionsLoading}
											isClearable
											value={selectedPerson}
											onChange={(val) => {
												setSelectedPerson(val);
											}}
											filterOption={createFilter({ matchFrom: 'start' })}
										/>
									</FormGroup>
								</div>
								<div className='col-md-2'>
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
								<div className='col-md-2    mt-4'>
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
