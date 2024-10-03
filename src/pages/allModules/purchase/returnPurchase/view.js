import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import moment from 'moment';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import apiClient from '../../../../baseURL/api';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';

import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';

import Spinner from '../../../../components/bootstrap/Spinner';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import purchaseRetrunPDF from './purchaseRetrunPDF';
import Edit from './edit';
import Viewnew from './viewDetails';
import ViewInvoice from './viewInvoice';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.purchase.return.perPage));
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};
	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/editReturnSale?id=${idd}`).then((res) => {
			const aa = res.data.data;

			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					item_discount: item.discount,
					item_total_after_discount:
						item.quantity * item.rate -
							(item.quantity * item.rate * (item.item_discount_per ?? 0)) / 100 || 0,
					batchDetails: { batchQty: 0, batchExpiry: '' },
				};
			});
			setEditingItem(aa);
			setEditingItemLoading(false);
		});
	};

	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
	};
	const [stateDelete, setStateDelete] = useState(false);

	const [staticBackdropStatusDelete, setStaticBackdropStatusDelete] = useState(false);
	const [scrollableStatusDelete, setScrollableStatusDelete] = useState(false);
	const [centeredStatusDelete, setCenteredStatusDelete] = useState(false);
	const [sizeStatusDelete, setSizeStatusDelete] = useState(null);
	const [fullScreenStatusDelete, setFullScreenStatusDelete] = useState(null);
	const [animationStatusDelete, setAnimationStatusDelete] = useState(true);

	const [headerCloseStatusDelete, setHeaderCloseStatusDelete] = useState(true);

	const initialStatusDelete = () => {
		setStaticBackdropStatusDelete(false);
		setScrollableStatusDelete(false);
		setCenteredStatusDelete(false);
		setSizeStatusDelete('md');
		setFullScreenStatusDelete(null);
		setAnimationStatusDelete(true);
		setHeaderCloseStatusDelete(true);
	};

	const deleteItem = (id) => {
		apiClient
			.delete(`/deleteReturnPO?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
					setStateDelete(false);
				}
				setDeleteLoading(false);
			})
			.catch(() => {
				setDeleteLoading(false);
			});
	};
	const printReportAll = (docType, id) => {
		apiClient.get(`/getReturnPoDetails?id=${id}`).then((response) => {
			purchaseRetrunPDF(response.data.po, docType);
		});
	};

	const [stateView, setStateView] = useState(false);

	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);
	const [scrollableStatusView, setScrollableStatusView] = useState(false);
	const [centeredStatusView, setCenteredStatusView] = useState(false);
	const [fullScreenStatusView, setFullScreenStatusView] = useState(null);
	const [animationStatusView, setAnimationStatusView] = useState(true);

	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);

	const initialStatusView = () => {
		setStaticBackdropStatusView(true);
		setScrollableStatusView(false);
		setCenteredStatusView(false);
		setFullScreenStatusView(false);
		setAnimationStatusView(true);
		setHeaderCloseStatusView(true);
	};
	const [viewItemLoading, setViewItemLoading] = useState(false);
	const [viewItem, setViewItem] = useState({});
	const getViewItem = (idd) => {
		setViewItemLoading(true);
		apiClient.get(`/getReturnPoDetails?id=${idd}`).then((res) => {
			setViewItem(res.data.po);
			setViewItemLoading(false);
		});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};
	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'purchase', 'return', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchase', 'return', 'pageNo']));
	};
	const [stateView2, setStateView2] = useState(false);

	const [staticBackdropStatusView2, setStaticBackdropStatusView2] = useState(true);
	const [scrollableStatusView2, setScrollableStatusView2] = useState(false);
	const [centeredStatusView2, setCenteredStatusView2] = useState(false);
	const [fullScreenStatusView2, setFullScreenStatusView2] = useState(null);
	const [animationStatusView2, setAnimationStatusView2] = useState(true);

	const [headerCloseStatusView2, setHeaderCloseStatusView2] = useState(true);

	const initialStatusView2 = () => {
		setStaticBackdropStatusView2(true);
		setScrollableStatusView2(false);
		setCenteredStatusView2(false);
		setFullScreenStatusView2(false);
		setAnimationStatusView2(true);
		setHeaderCloseStatusView2(true);
	};
	const [viewItemLoading2, setViewItemLoading2] = useState(false);
	const [viewItem2, setViewItem2] = useState({});
	const getViewItem2 = (idd) => {
		setViewItemLoading2(true);
		apiClient.get(`/ViewPurchaseOrderDetails?id=${idd}`).then((res) => {
			setViewItem2(res.data);
			setViewItemLoading2(false);
		});
	};
	const handleStateView2 = (status) => {
		setStateView2(status);
	};
	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Sr. No</th>

							<th>Po No</th>
							<th>Return Date</th>
							<th>Request Date</th>
							<th>Recieve Date</th>
							<th>Actions</th>
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
							{store.data.purchase.return.tableData.data?.map((item, index) => (
								<tr key={item.id}>
									<td>
										<Checks
											id={item.id.toString()}
											name='selectedList'
											value={item.id}
											onChange={selectTable.handleChange}
											checked={selectTable.values.selectedList.includes(
												item.id.toString(),
											)}
										/>
									</td>
									<td>{index + 1}</td>

									<td>{item.ret_po_no}</td>
									<td>
										{item.return_date
											? moment(item.receive_date).format('DD-MM-YYYY')
											: ''}
									</td>
									<td>
										{item.purchaseorder.request_date
											? moment(item.receive_date).format('DD-MM-YYYY')
											: ''}
									</td>
									<td>
										{item.purchaseorder.receive_date
											? moment(item.receive_date).format('DD-MM-YYYY')
											: ''}
									</td>
									<td>
										<ButtonGroup>
											<Button
												// isDisable={item.invoice.isApproved === 1}
												isDisable
												onClick={() => {
													getEditingItem(item.id);
													setItemId(item.id);

													initialStatusEdit();
													setStateEdit(true);
													setStaticBackdropStatusEdit(true);
												}}
												isOutline
												color='primary'
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Edit'>
												Edit
											</Button>
											<Button
												isOutline
												color='primary'
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Delete'
												onClick={() => {
													setItemId(item.id);

													initialStatusDelete();

													setStateDelete(true);
													setStaticBackdropStatusDelete(false);
												}}>
												Delete
											</Button>
											<Button
												onClick={() => {
													getViewItem(item.id);
													setItemId(item.id);

													initialStatusView();
													setStateView(true);
													setStaticBackdropStatusView(true);
												}}
												isOutline
												color='primary'
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon='Preview'>
												View
											</Button>

											<div className='row'>
												<div className='col'>
													<Dropdown>
														<DropdownToggle hasIcon={false}>
															<Button
																color='primary'
																isLight
																hoverShadow='default'
																icon='MoreVert'
															/>
														</DropdownToggle>
														<DropdownMenu isAlignmentEnd>
															<DropdownItem
																isHeader
																className='d-flex justify-content-end'>
																<Button
																	color='primary'
																	className={classNames(
																		'text-nowrap',
																		{
																			'col-md-8 border-light': true,
																		},
																	)}
																	onClick={() => {
																		printReportAll(2, item.id);
																	}}
																	isOutline
																	icon='FilePdfFill'
																	iconColor='info'
																	isActive>
																	Print
																</Button>
															</DropdownItem>
															<DropdownItem className='d-flex justify-content-end'>
																<Button
																	onClick={() => {
																		getViewItem2(item.po_id);
																		setItemId(item.po_id);

																		initialStatusView2();
																		setStateView2(true);
																		setStaticBackdropStatusView2(
																			true,
																		);
																	}}
																	isOutline
																	color='primary'
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Preview'>
																	View Original Invoice
																</Button>
															</DropdownItem>
														</DropdownMenu>
													</Dropdown>
												</div>
											</div>
										</ButtonGroup>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='Sales'
					from={store.data.purchase.return.tableData?.from ?? 1}
					to={store.data.purchase.return.tableData?.to ?? 1}
					total={store.data.purchase.return.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.purchase.return?.pageNo ?? 1}
							totalItemsCount={store.data.purchase.return?.tableData?.total ?? 0}
							itemsCountPerPage={Number(store.data.purchase.return?.perPage ?? 10)}
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
			<Modal
				isOpen={stateDelete}
				setIsOpen={setStateDelete}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusDelete}
				isScrollable={scrollableStatusDelete}
				isCentered={centeredStatusDelete}
				size={sizeStatusDelete}
				fullScreen={fullScreenStatusDelete}
				isAnimation={animationStatusDelete}>
				<ModalHeader setIsOpen={headerCloseStatusDelete ? setStateDelete : null}>
					<ModalTitle id='deltefile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Delete' iconColor='info'>
								<CardTitle>
									Deletion Confirmation
									<small> purchase Id: {itemId}</small>
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							<Card>
								<CardBody>
									<h5>
										Are you sure, you want to delete the selected purchase?{' '}
										<br />
										This cannot be undone!
									</h5>
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateDelete(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon={deleteLoading ? null : 'Delete'}
											color='danger'
											isDisable={deleteLoading}
											onClick={() => {
												setDeleteLoading(true);
												deleteItem(itemId);
											}}>
											{deleteLoading && <Spinner isSmall inButton />}
											{deleteLoading ? 'Deleting' : 'Yes, Delete!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			<Modal
				isOpen={stateEdit}
				setIsOpen={setStateEdit}
				titleId='EditVoucher'
				isStaticBackdrop={staticBackdropStatusEdit}
				isScrollable={scrollableStatusEdit}
				isCentered={centeredStatusEdit}
				size='xl'
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Direct purchase</CardTitle>
								<small> purchase Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{editingItemLoading ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<Edit editingItem={editingItem} handleStateEdit={handleStateEdit} />
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateEdit(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			{/* <Modalview  */}
			<Modal
				isOpen={stateView}
				setIsOpen={setStateView}
				titleId='ViewVoucher'
				isStaticBackdrop={staticBackdropStatusView}
				isScrollable={scrollableStatusView}
				isCentered={centeredStatusView}
				size='lg'
				fullScreen={fullScreenStatusView}
				isAnimation={animationStatusView}>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Purchase Return</CardTitle>
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
								<Viewnew viewItem={viewItem} handleStateView={handleStateView} />
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
				{/* <ModalFooter /> */}
			</Modal>

			{/* <Modalview2  */}
			<Modal
				isOpen={stateView2}
				setIsOpen={setStateView2}
				titleId='ViewVoucher'
				isStaticBackdrop={staticBackdropStatusView2}
				isScrollable={scrollableStatusView2}
				isCentered={centeredStatusView2}
				size='lg'
				fullScreen={fullScreenStatusView2}
				isAnimation={animationStatusView2}>
				<ModalHeader setIsOpen={headerCloseStatusView2 ? setStateView2 : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Original Invoice</CardTitle>
								<small> Id: {itemId}</small>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<div className='row g-4'>
						<div className='col-12'>
							{viewItemLoading2 ? (
								<div className='d-flex justify-content-center'>
									<Spinner color='primary' size='5rem' />
								</div>
							) : (
								<ViewInvoice
									viewItem2={viewItem2}
									handleStateView2={handleStateView2}
								/>
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateView2(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
		</>
	);
};
View.propTypes = {
	tableDataLoading: PropTypes.bool.isRequired,
	// eslint-disable-next-line react/forbid-prop-types
	tableData: PropTypes.array.isRequired,
	refreshTableData: PropTypes.func.isRequired,
};

export default View;
