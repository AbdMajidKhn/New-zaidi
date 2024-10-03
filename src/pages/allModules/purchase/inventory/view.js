import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import { GenerateUniqueKey } from '../../../../baseURL/GenerateUniqueKey';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import Checks from '../../../../components/bootstrap/forms/Checks';

import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';

import { CardBody } from '../../../../components/bootstrap/Card';

const View = ({ tableDataLoading, tableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.purchase.inventory.perPage));

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	// Edit

	// delete

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'purchase', 'inventory', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchase', 'inventory', 'pageNo']));
	};
	return (
		<CardBody className='table-responsive'>
			<table className='table table-modern'>
				<thead>
					<tr>
						<th style={{ width: 50 }}>{SelectAllCheck}</th>
						<th>Sr. No</th>

						<th>Category</th>
						<th>Sub Category</th>
						<th>Item</th>
						<th>Manufacturer</th>

						<th>Batch</th>
						<th>Expiry</th>
						<th>Unit</th>

						<th>Quantity</th>
					</tr>
				</thead>
				{tableDataLoading ? (
					<tbody>
						<tr>
							<td colSpan='12'>
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='3rem' />
								</div>
							</td>
						</tr>
					</tbody>
				) : (
					<tbody>
						{store.data.purchase.inventory.tableData.data?.map((item, index) => {
							const uniqueKey = GenerateUniqueKey();

							return (
								<tr key={uniqueKey}>
									<td>
										<Checks
											id={item.id?.toString()}
											name='selectedList'
											value={item.id}
											onChange={selectTable.handleChange}
											checked={selectTable.values.selectedList.includes(
												item.id?.toString(),
											)}
										/>
									</td>
									<td>{index + 1}</td>
									<td>{item.item?.category?.name}</td>
									<td>{item.item?.subcategory?.name}</td>
									<td>
										{item.item?.name}-{item.item?.strength}-
										{item.item?.strengthunit?.name}
									</td>
									<td>{item.manufacture?.name}</td>
									<td>{item?.batch_no}</td>
									<td>
										{item.expiry_date
											? moment(item.expiry_date).format('DD-MM-YYYY')
											: 'None'}
									</td>
									<td>{item.item?.unit?.name}</td>
									<td>
										{item.quantity.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
								</tr>
							);
						})}
					</tbody>
				)}
			</table>

			<PaginationButtons
				label='make'
				from={store.data.purchase.inventory.tableData?.from ?? 1}
				to={store.data.purchase.inventory.tableData?.to ?? 1}
				total={store.data.purchase.inventory.tableData?.total ?? 0}
				perPage={Number(perPage ?? 10)}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-md-4'>
					<Pagination
						activePage={store.data.purchase.inventory?.pageNo ?? 1}
						totalItemsCount={store.data.purchase.inventory?.tableData?.total ?? 0}
						itemsCountPerPage={Number(store.data.purchase.inventory?.perPage ?? 10)}
						onChange={(e) => handlePageChange(e)}
						itemClass='page-item'
						linkClass='page-link'
						firstPageText='First'
						lastPageText='Last'
						nextPageText='Next'
						prevPageText='Prev'
					/>
				</div>
			</div>
		</CardBody>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
};

export default View;
