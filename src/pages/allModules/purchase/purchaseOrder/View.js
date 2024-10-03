// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

import apiClient from '../../../../baseURL/api';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** Axios Imports
// import Icon from '../../../../components/icon/Icon';
import getDatePlusMonths from '../../../../baseURL/getDatePlusMonths';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
// import Icon from '../../../../components/icon/Icon';
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
import Dropdown, {
	// DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import Edit from './Edit';
import Viewnew from './viewDetails';
import Recieve from './Recieve';
import purchasePdf from './purchasePdf';
import Return from './Return';
import GeneratePDF2 from './GenerateHistoryPdf';
import emailPDF from './printReportEmail';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const [mailModalLoader, setMailModalLoader] = useState(false);

	const store = useSelector((state) => state.tableCrud);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [perPage, setPerPage] = useState(Number(store.data.purchase.purchaseOrder.perPage));

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [itemStatus, setItemStatus] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [stateStatus, setStateStatus] = useState(false);

	const [staticBackdropStatusStatus, setStaticBackdropStatusStatus] = useState(false);
	const [scrollableStatusStatus, setScrollableStatusStatus] = useState(false);
	const [centeredStatusStatus, setCenteredStatusStatus] = useState(false);
	const [sizeStatusStatus, setSizeStatusStatus] = useState(null);
	const [fullScreenStatusStatus, setFullScreenStatusStatus] = useState(null);
	const [animationStatusStatus, setAnimationStatusStatus] = useState(true);

	const [headerCloseStatusStatus, setHeaderCloseStatusStatus] = useState(true);
	const initialStatusStatus = () => {
		setStaticBackdropStatusStatus(false);
		setScrollableStatusStatus(false);
		setCenteredStatusStatus(false);
		setSizeStatusStatus('md');
		setFullScreenStatusStatus(null);
		setAnimationStatusStatus(true);
		setHeaderCloseStatusStatus(true);
	};
	// Edit
	const [stateEdit, setStateEdit] = useState(false);

	const [completeLoading, setCompleteLoading] = useState(false);
	const [stateComplete, setStateComplete] = useState(false);

	// eslint-disable-next-line no-unused-vars
	const [staticBackdropStatusComplete, setStaticBackdropStatusComplete] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [scrollableStatusComplete, setScrollableStatusComplete] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [centeredStatusComplete, setCenteredStatusComplete] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [sizeStatusComplete, setSizeStatusComplete] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const [fullScreenStatusComplete, setFullScreenStatusComplete] = useState(null);
	// eslint-disable-next-line no-unused-vars
	const [animationStatusComplete, setAnimationStatusComplete] = useState(true);
	// eslint-disable-next-line no-unused-vars
	const [headerCloseStatusComplete, setHeaderCloseStatusComplete] = useState(true);

	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);
	const [progressLoading, setProgressLoading] = useState(false);

	const initialStatusEdit = () => {
		setStaticBackdropStatusEdit(true);
		setScrollableStatusEdit(false);
		setCenteredStatusEdit(false);
		setFullScreenStatusEdit(false);
		setAnimationStatusEdit(true);
		setHeaderCloseStatusEdit(true);
	};

	const getCompleteOrder = (id) => {
		setCompleteLoading(true);

		apiClient
			.post(`/receivePurchaseOrderComplete`, { id })
			.then((res) => {
				if (res.data.status === 'ok') {
					setStateComplete(false);
					setCompleteLoading(false);
					refreshTableData();
					// setLastCompleteSave(moment());
				} else {
					setCompleteLoading(false);
					// showNotification(_titleError, res.data.message, 'Danger');
				}
			})
			.catch((err) => {
				setCompleteLoading(false);
				// showNotification(_titleError, err.message, 'Danger');
				if (err.response.status === 401) {
					// showNotification(_titleError, err.response.data.message, 'Danger');
				}
				setCompleteLoading(false);
			});
	};

	const getEditingItem = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/editPurchaseOrder?id=${idd}`).then((res) => {
			const aa = res.data.data;
			const expDate = getDatePlusMonths(2);
			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					expiry_date: item.expiry_date !== null ? item.expiry_date : expDate,
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

	// Return

	const getReturnPurchase = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/getPurchaseOrderForReturn?id=${idd}`).then((res) => {
			const aa = res.data.data;

			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					discount: item.discount,
					total_after_discount:
						item.quantity * item.rate -
						((item.quantity * item.rate * (item.discount ?? 0)) / 100 || 0),
				};
			});

			setEditingItem(aa);
			setEditingItemLoading(false);
		});
	};

	const [stateReturn, setStateReturn] = useState(false);

	const [staticBackdropStatusReturn, setStaticBackdropStatusReturn] = useState(true);
	const [scrollableStatusReturn, setScrollableStatusReturn] = useState(false);
	const [centeredStatusReturn, setCenteredStatusReturn] = useState(false);
	const [fullScreenStatusReturn, setFullScreenStatusReturn] = useState(null);
	const [animationStatusReturn, setAnimationStatusReturn] = useState(true);

	const [headerCloseStatusReturn, setHeaderCloseStatusReturn] = useState(true);

	const initialStatusReturn = () => {
		setStaticBackdropStatusReturn(true);
		setScrollableStatusReturn(false);
		setCenteredStatusReturn(false);
		setFullScreenStatusReturn(false);
		setAnimationStatusReturn(true);
		setHeaderCloseStatusReturn(true);
	};

	const handleStateReturn = (status) => {
		refreshTableData();
		setStateReturn(status);
	};
	// Receive
	const [stateReceive, setStateReceive] = useState(false);

	const [staticBackdropStatusReceive, setStaticBackdropStatusReceive] = useState(true);
	const [scrollableStatusReceive, setScrollableStatusReceive] = useState(false);
	const [centeredStatusReceive, setCenteredStatusReceive] = useState(false);
	const [fullScreenStatusReceive, setFullScreenStatusReceive] = useState(null);
	const [animationStatusReceive, setAnimationStatusReceive] = useState(true);

	const [headerCloseStatusReceive, setHeaderCloseStatusReceive] = useState(true);

	const initialStatusReceive = () => {
		setStaticBackdropStatusReceive(true);
		setScrollableStatusReceive(false);
		setCenteredStatusReceive(false);
		setFullScreenStatusReceive(false);
		setAnimationStatusReceive(true);
		setHeaderCloseStatusReceive(true);
	};

	const handleStateReceive = (status) => {
		refreshTableData();
		setStateReceive(status);
	};
	// status
	const statusItem = (id) => {
		apiClient
			.get(`/approveOrUnapprovePO?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
					setStateStatus(false);
					setProgressLoading(false);
				}
			})
			.catch(() => {
				setProgressLoading(false);
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
		apiClient.get(`/ViewPurchaseOrderDetails?id=${idd}`).then((res) => {
			setViewItem(res.data);
			setViewItemLoading(false);
		});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};
	const printReportAll = (docType, id) => {
		apiClient.get(`/ViewPurchaseOrderDetails?id=${id}`).then((response) => {
			purchasePdf(response.data, docType);
		});
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
			.delete(`/deletePurchaseOrder?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
					setStateDelete(false);
				}
			})
			.catch(() => {
				setDeleteLoading(false);
			});
	};

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'purchase', 'purchaseOrder', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);
	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'purchase', 'purchaseOrder', 'pageNo']));
	};
	// eslint-disable-next-line no-unused-vars
	const [historyDataLoading, setHistoryDataLoading] = useState(false);
	const getHistoryData = (id, docType) => {
		setHistoryDataLoading(true);
		apiClient
			.get(`getPoHistory?id=${id}`)
			.then((response) => {
				GeneratePDF2(response.data, docType);
				setHistoryDataLoading(false);
			})
			.catch((err) => {
				console.log('Error:', err);
			});
	};
	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Invoice No</th>
							<th>Po No</th>
							<th>Supplier</th>

							<th>Date</th>
							<th>Remarks</th>
							<th>Total</th>
							<th className='align-items-center justify-content-center'> Action</th>
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
							{store.data.purchase.purchaseOrder.tableData?.data?.map((item) => (
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
									<td>{item.invoice_no}</td>
									<td>{item.po_no}</td>
									<td>
										{item.po_type !== 3 ? item.supplier?.name : item.name}
										<div className='small text-muted'>
											{item.po_type !== 3 ? 'Registered ' : 'Walk in '}
										</div>
									</td>

									<td>
										<p>{moment(item.request_date).format('DD-MM-YYYY')}</p>
										<p>
											{item.receive_date
												? moment(item.receive_date).format('DD-MM-YYYY')
												: ''}
										</p>
									</td>
									<td>{item.remarks}</td>

									<td>
										{item.total.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>

									<td>
										<ButtonGroup>
											<Button
												// isDisable={item.isApproved === 1}
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
											<Button
												color={
													item.is_approved === 1 ? 'success' : 'danger'
												}
												isDisable={item.is_received === 1}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												isOutline
												icon={
													item.is_approved === 1
														? 'DoneOutline'
														: 'PendingActions'
												}
												onClick={() => {
													setItemId(item.id);
													setItemStatus(
														// eslint-disable-next-line no-unneeded-ternary
														item.is_approved === 0 ? false : true,
													);

													initialStatusStatus();

													setStateStatus(true);
													setStaticBackdropStatusStatus(false);
												}}>
												{item.is_approved === 1 ? 'Approved' : 'Pending'}
											</Button>
											<Button
												isDisable={
													item.is_approved === 0 ||
													// || item.is_received === 1
													item?.is_completed === 1
												}
												onClick={() => {
													getEditingItem(item.id);
													setItemId(item.id);

													initialStatusReceive();
													setStateReceive(true);
													setStaticBackdropStatusReceive(true);
												}}
												color={
													item.is_received === 1 ? 'success' : 'warning'
												}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon={
													item.is_received === 1
														? 'DoneOutline'
														: 'PendingActions'
												}>
												{item.is_received === 0 ? 'Receive' : 'Received'}
											</Button>
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
													<ButtonGroup>
														{item?.is_received === 1 && (
															// item?.is_completed === '0' &&
															// <DropdownItem>
															<Button
																isOutline
																icon='DoneAll'
																color='info'
																className={classNames(
																	'text-nowrap',
																	{
																		'border-light': true,
																	},
																)}
																isDisable={completeLoading}
																onClick={() => {
																	setItemId(item.id);
																	setStateComplete(true);
																}}>
																Complete Order
															</Button>
															// </DropdownItem>
														)}
														<Button
															isDisable={item.is_approved === 1}
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
															color='danger'
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Delete'
															isDisable={item.is_approved === 1}
															onClick={() => {
																setItemId(item.id);

																initialStatusDelete();

																setStateDelete(true);
																setStaticBackdropStatusDelete(
																	false,
																);
															}}>
															Delete
														</Button>
														<Button
															isOutline
															color='primary'
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='pdf'
															onClick={() => {
																printReportAll(2, item.id);
															}}>
															Print
														</Button>

														<Button
															isDisable={
																item.is_approved === 0 ||
																item.is_received === 0
															}
															// isDisable={item.isApproved === 1}
															onClick={() => {
																getReturnPurchase(item.id);
																setItemId(item.id);

																initialStatusReturn();
																setStateReturn(true);
																setStaticBackdropStatusReturn(true);
															}}
															isOutline
															color='primary'
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Edit'>
															Return
														</Button>
														<Button
															isOutline
															color='info'
															// isLight={darkModeStatus}
															className={classNames('text-nowrap', {
																'border-light': true,
															})}
															icon='Preview'
															onClick={() =>
																getHistoryData(item.id, 2)
															}>
															History
														</Button>
													</ButtonGroup>
												</DropdownMenu>
											</Dropdown>
										</ButtonGroup>
									</td>
								</tr>
							))}
						</tbody>
					)}
				</table>
				<PaginationButtons
					label='Sales'
					from={store.data.purchase.purchaseOrder.tableData?.from ?? 1}
					to={store.data.purchase.purchaseOrder.tableData?.to ?? 1}
					total={store.data.purchase.purchaseOrder.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.purchase.purchaseOrder?.pageNo ?? 1}
							totalItemsCount={
								store.data.purchase.purchaseOrder?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.purchase.purchaseOrder?.perPage ?? 10,
							)}
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
									<small> Item Id: {itemId}</small>
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
										Are you sure, you want to delete the selected Order? <br />
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
								<CardTitle>Editing Purchase Order</CardTitle>
								<small> Id: {itemId}</small>
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

			{/* <Return /> */}

			<Modal
				isOpen={stateReturn}
				setIsOpen={setStateReturn}
				titleId='EditVoucher'
				isStaticBackdrop={staticBackdropStatusReturn}
				isScrollable={scrollableStatusReturn}
				isCentered={centeredStatusReturn}
				size='xl'
				fullScreen={fullScreenStatusReturn}
				isAnimation={animationStatusReturn}>
				<ModalHeader setIsOpen={headerCloseStatusReturn ? setStateReturn : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Return' iconColor='info'>
								<CardTitle>Returning Purchase Order</CardTitle>
								<small> Id: {itemId}</small>
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
								<Return
									editingItem={editingItem}
									handleStateReturn={handleStateReturn}
								/>
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateReturn(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			{/* <Status /> */}
			<Modal
				isOpen={stateStatus}
				setIsOpen={setStateStatus}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusStatus}
				isScrollable={scrollableStatusStatus}
				isCentered={centeredStatusStatus}
				size={sizeStatusStatus}
				fullScreen={fullScreenStatusStatus}
				isAnimation={animationStatusStatus}>
				<ModalHeader setIsOpen={headerCloseStatusStatus ? setStateStatus : null}>
					<ModalTitle id='progressfile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Progress' iconColor='info'>
								<CardTitle>
									Approval Confirmation
									<small> Id: {itemId}</small>
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
									{itemStatus === true ? (
										<h5>Are you sure, you want to disapprove ?</h5>
									) : (
										<h5>Are you sure, you want to approve?</h5>
									)}
								</CardBody>
								<CardFooter>
									<CardFooterLeft>
										<Button
											color='info'
											icon='cancel'
											isOutline
											className='border-0'
											onClick={() => setStateStatus(false)}>
											Cancel
										</Button>
									</CardFooterLeft>

									<CardFooterRight>
										<Button
											icon={progressLoading ? null : 'Progress'}
											color={itemStatus === true ? 'danger' : 'primary'}
											onClick={() => {
												setProgressLoading(true);
												statusItem(itemId);
											}}>
											{progressLoading && <Spinner isSmall inButton />}
											{progressLoading
												? 'Progressing'
												: `${
														itemStatus === true
															? 'Yes, Dispprove!'
															: 'Yes, Approve!'
												  }`}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
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
				size='xl'
				fullScreen={fullScreenStatusView}
				isAnimation={animationStatusView}>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Purchase Order</CardTitle>
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
								<>
									<CardFooterLeft>
										{viewItem.purchaseOrder?.po_type !== 3 && (
											<Button
												color={
													viewItem.purchaseOrder?.is_mailsent === 1
														? 'warning'
														: 'success'
												}
												isDisable={mailModalLoader}
												onClick={() => {
													setMailModalLoader(true);
													emailPDF(viewItem, setMailModalLoader, itemId);
												}}>
												{mailModalLoader && <Spinner isSmall inButton />}
												{viewItem.purchaseOrder?.is_mailsent === 1
													? 'Send again'
													: 'Send Email'}
											</Button>
										)}
									</CardFooterLeft>
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
								</>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>
			<Modal
				isOpen={stateReceive}
				setIsOpen={setStateReceive}
				titleId='ReceiveVoucher'
				isStaticBackdrop={staticBackdropStatusReceive}
				isScrollable={scrollableStatusReceive}
				isCentered={centeredStatusReceive}
				size='xl'
				fullScreen={fullScreenStatusReceive}
				isAnimation={animationStatusReceive}>
				<ModalHeader setIsOpen={headerCloseStatusReceive ? setStateReceive : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Receive' iconColor='info'>
								<CardTitle>Receiveing Purchase Order</CardTitle>
								<small> Id: {itemId}</small>
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
								<Recieve
									editingItem={editingItem}
									handleStateReceive={handleStateReceive}
								/>
							)}
							<CardFooter>
								<CardFooterRight>
									<Button
										color='info'
										icon='cancel'
										isOutline
										className='border-0'
										onClick={() => setStateReceive(false)}>
										Cancel
									</Button>
								</CardFooterRight>
							</CardFooter>
						</div>
					</div>
				</ModalBody>
				{/* <ModalFooter /> */}
			</Modal>

			<Modal
				isOpen={stateComplete}
				setIsOpen={setStateComplete}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusComplete}
				isScrollable={scrollableStatusComplete}
				isCentered={centeredStatusComplete}
				size={sizeStatusComplete}
				fullScreen={fullScreenStatusComplete}
				isAnimation={animationStatusComplete}>
				<ModalHeader setIsOpen={headerCloseStatusComplete ? setStateComplete : null}>
					<ModalTitle id='deltefile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Delete' iconColor='info'>
								<CardTitle>
									Completion Confirmation
									<small> Item Id: {itemId}</small>
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
										Are you sure, you want to Complete the selected Purchase
										Order? <br />
										The PO will be finalized, you will not be able to make
										further changes. <br />
										All related pending invoices will be initiated. <br />
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
											onClick={() => setStateComplete(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon={completeLoading ? null : 'DoneAll'}
											color='danger'
											onClick={() => {
												getCompleteOrder(itemId);
											}}
											disabled={completeLoading}>
											{completeLoading && <Spinner isSmall inButton />}
											{completeLoading ? 'Initiating' : 'Yes, Complete!'}
										</Button>
									</CardFooterRight>
								</CardFooter>
							</Card>
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
