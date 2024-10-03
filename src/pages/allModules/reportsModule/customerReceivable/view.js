// import React, { useEffect, useState } from 'react';
// import Pagination from 'react-js-pagination';
// // import classNames from 'classnames';
// import { useDispatch, useSelector } from 'react-redux';
// import PropTypes from 'prop-types';

// // import moment from 'moment';
// import classNames from 'classnames';
// // eslint-disable-next-line import/no-unresolved

// import { updateSingleState } from '../../redux/tableCrud/index';
// // ** apiClient Imports

// import Checks from '../../../../components/bootstrap/forms/Checks';
// import PaginationButtons from '../../../../components/PaginationButtons';
// import useSelectTable from '../../../../hooks/useSelectTable';
// import Spinner from '../../../../components/bootstrap/Spinner';
// import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
// import {
// 	CardBody,
// 	CardHeader,
// 	CardLabel,
// 	CardTitle,
// 	CardFooter,
// 	CardFooterRight,
// } from '../../../../components/bootstrap/Card';
// import Button from '../../../../components/bootstrap/Button';

// import Viewnew from './viewDetails';
// // import apiClient from '../../../../baseURL/api';

// const View = ({ tableData, tableDataLoading }) => {
// 	console.log(tableData)
// 	// eslint-disable-next-line no-unused-vars
// 	const [viewItemLoading, setViewItemLoading] = useState(false);

// 	const dispatch = useDispatch();
// 	const store = useSelector((state) => state.tableCrud);
// 	const [perPage, setPerPage] = useState(Number(store.data.purchase.stockReport.perPage));

// 	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
// 	// Edit

// 	// dispose

// 	useEffect(
// 		() => {
// 			dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
// 		},
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 		[perPage],
// 	);

// 	const handlePageChange = (e) => {
// 		dispatch(updateSingleState([e, 'purchase', 'stockReport', 'pageNo']));
// 	};

// 	const [editingItem, setEditingItem] = useState({});
// 	const [stateView, setStateView] = useState(false);
// 	const [itemId, setItemId] = useState('');
// 	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);
// 	const [scrollableStatusView, setScrollableStatusView] = useState(false);
// 	const [centeredStatusView, setCenteredStatusView] = useState(false);
// 	const [fullScreenStatusView, setFullScreenStatusView] = useState(null);
// 	const [animationStatusView, setAnimationStatusView] = useState(true);

// 	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);

// 	const initialStatusView = () => {
// 		setStaticBackdropStatusView(true);
// 		setScrollableStatusView(false);
// 		setCenteredStatusView(false);
// 		setFullScreenStatusView(false);
// 		setAnimationStatusView(true);
// 		setHeaderCloseStatusView(true);
// 	};

// 	const handleStateView = (status) => {
// 		setStateView(status);
// 	};
// 	return (
// 		<>
// 			<CardBody className='table-responsive'>
// 				<table className='table table-modern'>
// 					<thead>
// 						<tr>
// 							<th style={{ width: 50 }}>{SelectAllCheck}</th>
// 							<th>Sr. No</th>
// 							<th>Customer</th>
// 							<th>Account</th>
// 							<th>Balance</th>
// 							<th>Actions</th>
// 						</tr>
// 					</thead>
// 					{tableDataLoading ? (
// 						<tbody>
// 							<tr>
// 								<td colSpan='12'>
// 									<div className='d-flex justify-content-center'>
// 										<Spinner color='primary' size='3rem' />
// 									</div>
// 								</td>
// 							</tr>
// 						</tbody>
// 					) : (
// 						<tbody>
// 							{(() => {
// 								let counter = 0;
// 								return store.data.purchase.stockReport.tableData?.map((item) => {
// 									if (
// 										item.Receivables &&
// 										item.Receivables.length > 0 &&
// 										item.Receivables[0]?.invoice_child?.length > 0
// 									) {
// 										counter += 1;
// 										// const total = item.invoice.reduce(
// 										// 	(acc, item2) => acc + item2.total_amount,
// 										// 	0,
// 										// );
// 										return (
// 											<tr key={item.id}>
// 												<td>
// 													<Checks
// 														id={item.id?.toString()}
// 														name='selectedList'
// 														value={item.id}
// 														onChange={selectTable.handleChange}
// 														checked={selectTable.values.selectedList.includes(
// 															item.id?.toString(),
// 														)}
// 													/>
// 												</td>
// 												<td>{counter}</td>
// 												<td>{item.name}</td>
// 												<td>{item?.account}</td>
// 												<td>
// 													{item?.balance?.balance}
// 												</td>
// 												<td>
// 													<Button
// 														onClick={() => {
// 															setEditingItem(item.invoice);
// 															setItemId(item.id);
// 															initialStatusView();
// 															setStateView(true);
// 															setStaticBackdropStatusView(true);
// 														}}
// 														isOutline
// 														color='primary'
// 														className={classNames('text-nowrap', {
// 															'border-light': true,
// 														})}
// 														icon='Preview'>
// 														View
// 													</Button>
// 												</td>
// 											</tr>
// 										);
// 									}
// 									return null;
// 								});
// 							})()}
// 						</tbody>
// 					)}
// 				</table>
// {/*
// 				<PaginationButtons
// 					label='make'
// 					from={store.data.purchase.stockReport.tableData?.from ?? 1}
// 					to={store.data.purchase.stockReport.tableData?.to ?? 1}
// 					total={store.data.purchase.stockReport.tableData?.total ?? 0}
// 					perPage={Number(perPage ?? 10)}
// 					setPerPage={setPerPage}
// 				/> */}

// 				{/* <div className='row d-flex justify-content-end'>
// 					<div className='col-md-4'>
// 						<Pagination
// 							activePage={store.data.purchase.stockReport?.pageNo ?? 1}
// 							totalItemsCount={store.data.purchase.stockReport?.tableData?.total ?? 0}
// 							itemsCountPerPage={Number(
// 								store.data.purchase.stockReport?.perPage ?? 10,
// 							)}
// 							onChange={(e) => handlePageChange(e)}
// 							itemClass='page-item'
// 							linkClass='page-link'
// 							firstPageText='First'
// 							lastPageText='Last'
// 							nextPageText='Next'
// 							prevPageText='Prev'
// 						/>
// 					</div>
// 				</div> */}
// 			</CardBody>
// 			<Modal
// 				isOpen={stateView}
// 				setIsOpen={setStateView}
// 				titleId='ViewVoucher'
// 				isStaticBackdrop={staticBackdropStatusView}
// 				isScrollable={scrollableStatusView}
// 				isCentered={centeredStatusView}
// 				size='lg'
// 				fullScreen={fullScreenStatusView}
// 				isAnimation={animationStatusView}>
// 				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
// 					<ModalTitle id='editVoucher'>
// 						{' '}
// 						<CardHeader>
// 							<CardLabel icon='Edit' iconColor='info'>
// 								<CardTitle>View Details</CardTitle>
// 								<small> Id: {itemId}</small>
// 							</CardLabel>
// 						</CardHeader>
// 					</ModalTitle>
// 				</ModalHeader>
// 				<ModalBody>
// 					<div className='row g-4'>
// 						<div className='col-12'>
// 							{viewItemLoading ? (
// 								<div className='d-flex justify-content-center'>
// 									<Spinner color='primary' size='5rem' />
// 								</div>
// 							) : (
// 								<Viewnew viewItem={editingItem} handleStateView={handleStateView} />
// 							)}
// 							<CardFooter>
// 								<CardFooterRight>
// 									<Button
// 										color='info'
// 										icon='cancel'
// 										isOutline
// 										className='border-0'
// 										onClick={() => setStateView(false)}>
// 										Cancel
// 									</Button>
// 								</CardFooterRight>
// 							</CardFooter>
// 						</div>
// 					</div>
// 				</ModalBody>
// 				{/* <ModalFooter /> */}
// 			</Modal>
// 		</>
// 	);
// };
// View.propTypes = {
// 	tableDataLoading: PropTypes.bool.isRequired,
// 	// eslint-disable-next-line react/forbid-prop-types
// 	tableData: PropTypes.array.isRequired,

// 	// printReportAll: PropTypes.func.isRequired,
// };

// export default View;

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { updateSingleState } from '../../redux/tableCrud/index';
import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Button from '../../../../components/bootstrap/Button';
import Viewnew from './viewDetails';
// import Checks from '../../../../components/bootstrap/forms/Checks';

const View = ({ tableData }) => {
	// eslint-disable-next-line no-unused-vars
	const [viewItemLoading, setViewItemLoading] = useState(false);
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	// eslint-disable-next-line no-unused-vars
	const [perPage, setPerPage] = useState(Number(store.data.purchase.stockReport.perPage));

	// useEffect(() => {
	// 	dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
	// }, [perPage]);
	useEffect(() => {
		dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
	}, [dispatch, perPage]);

	// eslint-disable-next-line no-unused-vars
	const [editingItem, setEditingItem] = useState([]);
	const [stateView, setStateView] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [itemId, setItemId] = useState('');
	// eslint-disable-next-line no-unused-vars
	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);

	// const initialStatusView = () => {
	// 	setStaticBackdropStatusView(true);
	// };

	const handleStateView = (status) => {
		setStateView(status);
	};

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							{/* <th style={{ width: 50 }}>Select</th> */}
							<th>Sr. No</th>
							<th>Customer</th>
							<th>Account</th>
							<th>Balance</th>
							{/* <th>Actions</th> */}
						</tr>
					</thead>
					<tbody>
						{tableData.map((item, index) => (
							<tr key={item.id}>
								{/* <td>
									<Checks
										id={item.id?.toString()}
										name='selectedList'
										value={item.id}
										onChange={selectTable.handleChange}
										checked={selectTable.values.selectedList.includes(
											item.id?.toString(),
										)}
									/>{' '}
								</td> */}
								<td>{index + 1}</td>
								<td>{item?.person?.name}</td>
								<td>
									{item.code} - {item.name}
								</td>
								<td>{item.balance ? item.balance.balance : 0}</td>
								{/* <td>
                  <Button
                    onClick={() => {
                      setEditingItem(item);
                      setItemId(item.id);
                      initialStatusView();
                      setStateView(true);
                    }}
                    isOutline
                    color="primary"
                  >
                    View
                  </Button>
                </td> */}
							</tr>
						))}
					</tbody>
				</table>
			</CardBody>
			<Modal
				isOpen={stateView}
				setIsOpen={setStateView}
				titleId='ViewVoucher'
				isStaticBackdrop={staticBackdropStatusView}
				size='lg'>
				<ModalHeader>
					<ModalTitle>
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Details</CardTitle>
								<small> Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{viewItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Viewnew viewItem={editingItem} handleStateView={handleStateView} />
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateView(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
			</Modal>
		</>
	);
};

View.propTypes = {
	// tableDataLoading: PropTypes.bool.isRequired,
	tableData: PropTypes.isRequired,
};

export default View;
