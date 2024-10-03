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
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
import Edit from './Edit';
import Viewnew from './viewDetails';
import salePurchasePdf from './salePurchasePdf';
import Invoice from './invoice';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [perPage, setPerPage] = useState(Number(store.data.sale.salePurchase.perPage));

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

	const [childModal, setChildModal] = useState(false);
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
		apiClient.get(`/editSalePurchaseOrderForInitiate?id=${idd}`).then((res) => {
			const aa = res.data.data;

			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					item_discount_per: '',
					item_discount: '',
					item_total_after_discount: '',
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

	// View
	const [stateView, setStateView] = useState(false);

	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);
	const [scrollableStatusView, setScrollableStatusView] = useState(false);
	const [centeredStatusView, setCenteredStatusView] = useState(false);
	const [fullScreenStatusView, setFullScreenStatusView] = useState(null);
	const [animationStatusView, setAnimationStatusView] = useState(true);

	const [headerCloseStatusView, setHeaderCloseStatusView] = useState(true);

	// eslint-disable-next-line no-unused-vars
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
	// eslint-disable-next-line no-unused-vars
	const getViewItem = (idd) => {
		setViewItemLoading(true);
		apiClient.get(`/ViewSalePODetails?id=${idd}`).then((res) => {
			setViewItem(res.data);
			setViewItemLoading(false);
		});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};
	// delete
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
			.delete(`/deleteSalePo?id=${id}`)
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
	const [stateStatus, setStateStatus] = useState(false);

	const [staticBackdropStatusStatus, setStaticBackdropStatusStatus] = useState(false);
	const [scrollableStatusStatus, setScrollableStatusStatus] = useState(false);
	const [centeredStatusStatus, setCenteredStatusStatus] = useState(false);
	const [sizeStatusStatus, setSizeStatusStatus] = useState(null);
	const [fullScreenStatusStatus, setFullScreenStatusStatus] = useState(null);
	const [animationStatusStatus, setAnimationStatusStatus] = useState(true);
	const [progressLoading, setProgressLoading] = useState(false);
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
	const statusItem = (id) => {
		apiClient
			.post(`/approveSalePo?id=${id}`)
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
	const printReportAll = (docType, id) => {
		apiClient.get(`/ViewSalePODetails?id=${id}`).then((response) => {
			salePurchasePdf(response.data, docType);
		});
	};
	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'sale', 'salePurchase', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);
	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'sale', 'salePurchase', 'pageNo']));
	};

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

	return (
		<>
			<CardBody className='table-responsive'>
				<table className='table table-modern'>
					<thead>
						<tr>
							<th style={{ width: 50 }}>{SelectAllCheck}</th>
							<th>Sr. No</th>
							<th>Po No</th>

							<th>Customer</th>
							<th>Date</th>

							<th>Action</th>
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
							{store.data.sale.salePurchase.tableData?.data?.map((item, index) => (
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
									<td>{item.po_no}</td>
									<td>{item.customer?.name}</td>
									<td>{moment(item.request_date).format('DD-MM-YYYY')}</td>

									<td>
										<ButtonGroup>
											<Button
												color={
													item.is_approved === 1 ? 'success' : 'danger'
												}
												isDisable={item.is_inv_generated === 1}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon={
													item.is_approved === 1
														? 'DoneOutline'
														: 'PendingActions'
												}
												onClick={() => {
													setItemId(item.id);

													initialStatusStatus();

													setStateStatus(true);
													setStaticBackdropStatusStatus(false);
												}}>
												{item.is_approved === 1 ? 'Approved' : 'Pending'}
											</Button>
											<Button
												isDisable={
													item.is_approved === 0 ||
													item.is_inv_generated === 1
												}
												color={
													item.is_inv_generated === 1
														? 'success'
														: 'warning'
												}
												className={classNames('text-nowrap', {
													'border-light': true,
												})}
												icon={
													item.is_inv_generated === 1
														? 'DoneOutline'
														: 'PendingActions'
												}
												onClick={() => {
													getEditingItem(item.id);
													setItemId(item.id);

													initialStatusReceive();
													setStateReceive(true);
													setStaticBackdropStatusReceive(true);
												}}>
												{item.is_inv_generated === 1
													? 'Initiated'
													: 'Initiate'}
											</Button>
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
												isDisable={item.is_approved === 1}
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
													<DropdownItem isHeader>
														<Button
															color='primary'
															className={classNames('text-nowrap', {
																'col-md-7 border-light': true,
															})}
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
					from={store.data.sale.salePurchase.tableData?.from ?? 1}
					to={store.data.sale.salePurchase.tableData?.to ?? 1}
					total={store.data.sale.salePurchase.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.sale.salePurchase?.pageNo ?? 1}
							totalItemsCount={store.data.sale.salePurchase?.tableData?.total ?? 0}
							itemsCountPerPage={Number(store.data.sale.salePurchase?.perPage ?? 10)}
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
								<CardTitle>Invoice </CardTitle>
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
								<Invoice
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
									<h5>
										Are you sure, you want to delete the selected Purchase
										Order?
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
								<CardTitle>Editing sale Purchase Order</CardTitle>
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
			<Modal
				isOpen={childModal}
				setIsOpen={setChildModal}
				titleId='exampleModalLabel'
				size='xl'>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setChildModal : null}>
					<ModalTitle id='editVoucher2'>
						{' '}
						<CardHeader>
							<CardLabel icon='Preview' iconColor='info'>
								<CardTitle>
									Purchase Order <br />
								</CardTitle>
							</CardLabel>
						</CardHeader>
					</ModalTitle>
				</ModalHeader>
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
									Progress Complete Confirmation
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
									<h5>
										Are you sure, you want to approve?
										<br />
									</h5>
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
											color='danger'
											onClick={() => {
												setProgressLoading(true);
												statusItem(itemId);
											}}>
											{progressLoading && <Spinner isSmall inButton />}
											{progressLoading ? 'Progressing' : 'Yes, Approve!'}
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
				size='lg'
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
