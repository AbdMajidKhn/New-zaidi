import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
// import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// import moment from 'moment';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

// import Checks from '../../../../components/bootstrap/forms/Checks';
import PaginationButtons from '../../../../components/PaginationButtons';
// import useSelectTable from '../../../../hooks/useSelectTable';
import { CardBody } from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';

const View = ({ tableDataLoading, tableData }) => {
	console.log(tableDataLoading, tableData);
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.purchase.stockReport.perPage));

	// const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	// Edit
	// console.log(tableData);
	// console.log(store.data.purchase.stockReport?.pageNo);

	// dispose

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchase', 'stockReport', 'pageNo']));
	};

	// console.log('From:', totalDataCount?.from ?? 1);
	// console.log('To:', totalDataCount?.to ?? 1);
	// console.log('totaldata:', totalDataCount);
	// console.log('data:', tableData2);
	// console.log('total:', totalDataCount.total)
	// console.log('total: ', store.data.purchase.stockReport.tableData?.total);
	return (
		<CardBody className='table-responsive'>
			<table className='table table-modern'>
				<thead>
					<tr>
						{/* <th style={{ width: 50 }}>{SelectAllCheck}</th> */}
						<th>Sr. No</th>
						<th>Category</th>
						{/* <th>Sub Category</th> */}
						<th style={{ width: '10%' }}>Item</th>
						<th>Inventory Type</th>
						<th>Invoice NO</th>
						<th>PO NO</th>
						{/* <th>Manufacturer</th> */}
						<th style={{ width: '20%' }}>Date</th>
						<th>Supplier Name</th>
						<th>Customer Name</th>
						<th>Quantity In/Out</th>
					</tr>
				</thead>
				{tableDataLoading ? (
					<tbody>
						<tr>
							<td colSpan='10'>
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='3rem' />
								</div>
							</td>
						</tr>
					</tbody>
				) : (
					<tbody>
						{tableData?.map((item, index) => {
							console.log('item', item);
							return (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item.item?.category?.name}</td>
									<td style={{ width: '10%' }}>
										{item.item?.name}-{item.item?.strength}
									</td>
									<td>{item.inventory_type?.name}</td>
									<td>{item.invoicechild?.invoice.invoice_no}</td>
									<td>
										{item.inventory_type?.name === 'Inventory In from Direct Purchase'
											? item.purchase_orderchild?.purchase_order.po_no
											: item.return_purchase_orderchild?.return_purchase_order.ret_po_no}
									</td>
									{/* <td>{item.manufacture?.name}</td> */}
									<td style={{ width: '20%' }}>{item.date}</td>
									<td>
										{item?.purchase_orderchild?.purchase_order?.name ||
											item?.purchase_orderchild?.purchase_order?.supplier?.name ||
											item?.return_purchase_orderchild?.return_purchase_order?.purchaseorder?.supplier?.name ||
											item?.return_purchase_order?.return_purchase_orderchild?.return_purchase_order?.purchaseorder?.name}
									</td>
									<td>
										{item?.invoicechild?.invoice?.walk_in_customer_name ||
											item?.invoicechild?.invoice?.customer?.name ||
											item?.return_invoicechild?.invoice?.invoice?.customer?.name}
									</td>
									<td>{item.quantity_in > 0 ? `+${item.quantity_in}` : `-${item.quantity_out}`}</td>
								</tr>
							);
						})}
					</tbody>
				)}
			</table>


			<PaginationButtons
				label='Sales'
				from={store.data.purchase.stockReport.tableData?.from ?? 1}
				to={store.data.purchase.stockReport.tableData?.to ?? 1}
				total={store.data.purchase.stockReport.tableData?.total ?? 0}
				perPage={Number(perPage ?? 10)}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-md-4'>
					<Pagination
						activePage={store.data.purchase.stockReport?.pageNo ?? 1}
						totalItemsCount={store.data.purchase.stockReport?.tableData?.total ?? 0}
						itemsCountPerPage={Number(store.data.purchase.stockReport?.perPage ?? 10)}
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

			{/* <PaginationButtons
				label='Sales'
				from={store.data.purchase.stockReport.tableData?.from ?? 1}
				to={store.data.purchase.stockReport.tableData?.to ?? 1}
				// from={totalDataCount?.from ?? 1}
				// to={totalDataCount?.to ?? 1}
				// total={totalDataCount?.total}
				total={store.data.purchase.stockReport.tableData?.total ?? 0}

				perPage={Number(perPage ?? 10)}
				setPerPage={setPerPage}
			/>

			<div className='row d-flex justify-content-end'>
				<div className='col-md-4'>
					<Pagination
						// activePage={store.data.purchase.stockReport?.pageNo ?? 1}
						// totalItemsCount={totalDataCount}
						// itemsCountPerPage={Number(store.data.purchase.stockReport.tableData?.perPage ?? 10)}

						activePage={totalDataCount?.current_page ?? 1}
						totalItemsCount={totalDataCount?.total}
						itemsCountPerPage={Number(store.data.purchase.stockReport?.perPage ?? 10)}
						onChange={(e) => handlePageChange(e)}
						itemClass='page-item'
						linkClass='page-link'
						firstPageText='First'
						lastPageText='Last'
						nextPageText='Next'
						prevPageText='Prev'
					/>
				</div>
			</div> */}
		</CardBody>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,

	// tableData2: PropTypes.object.isRequired,
	// from: PropTypes.number.isRequired,
	// to: PropTypes.number.isRequired,

	// totalDataCount: PropTypes.number.isRequired, // Add this prop validation
};

export default View;
