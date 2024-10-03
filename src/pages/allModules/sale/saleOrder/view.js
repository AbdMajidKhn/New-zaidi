import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';

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
import salePdf from './salePdf';
import SalePdfWithoutSign from './salePdfWithoutSign'
import GeneratePDF7 from './dcReport';
import Edit from './edit';
import Return from './return';
import GeneratePDF2 from './GenerateHistoryPdf';
import Viewnew from './viewDetails';
import Excel from './excel';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.sale.saleOrder.perPage));
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
		apiClient.get(`/editSale?id=${idd}`).then((res) => {
			console.log('res', res);
			const aa = res.data.data;
			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					item_discount: item.discount,
					item_total_after_discount:
						item.quantity * item.rate -
							(item.quantity * item.rate * (item.item_discount_per ?? 0)) / 100 || 0,
					// batchDetails: { batchQty: 0, batchExpiry: '', batch_no: '' },
				};
			});
			setEditingItem(aa);
			setEditingItemLoading(false);
		});
	};
	const getReturnInvoice = (idd) => {
		setEditingItemLoading(true);
		apiClient.get(`/getInvoiceForReturn?id=${idd}`).then((res) => {
			const aa = res.data.data;

			aa.childArray.forEach((item, index) => {
				aa.childArray[index] = {
					...aa.childArray[index],
					item_discount: item.discount,
					item_total_after_discount:
						item.quantity * item.rate -
							(item.quantity * item.rate * (item.item_discount_per ?? 0)) / 100 || 0,
					// batchDetails: { batchQty: 0, batchExpiry: '' },
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
	const handleStateReturn = (status) => {
		refreshTableData();
		setStateReturn(status);
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
			.delete(`/deleteSale?id=${id}`)
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
		apiClient.get(`/getInvoiceDetail?id=${id}`).then((response) => {
			salePdf(response.data, docType);
		});
	};
	const printWithoutSign = (docType, id) => {
		apiClient.get(`/getInvoiceDetail?id=${id}`).then((response) => {
			SalePdfWithoutSign(response.data, docType);
		});
	};
	const printReportAll2 = (docType, id) => {
		apiClient.get(`/getInvoiceDetail?id=${id}`).then((response) => {
			GeneratePDF7(response.data, docType);
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
		apiClient.get(`/getInvoiceDetail?id=${idd}`).then((res) => {
			setViewItem(res.data);
			setViewItemLoading(false);
		});
	};
	const printReportAllExcel = (id) => {
		return apiClient
			.get(`/getInvoiceDetail?id=${id}`)
			.then((response) => {
				return response.data; // Return the response to be passed to printReport
			})
			.catch((err) => {
				throw err; // Throw the error to be caught in printReport
			});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};
	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'sale', 'saleOrder', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'sale', 'saleOrder', 'pageNo']));
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
	// eslint-disable-next-line no-unused-vars
	const [historyDataLoading, setHistoryDataLoading] = useState(false);
	const getHistoryData = (id, docType) => {
		setHistoryDataLoading(true);
		apiClient
			.get(`getSalesHistory?id=${id}`)
			.then((response) => {
				GeneratePDF2(response.data.parentData, docType);
				setHistoryDataLoading(false);
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
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
							<th>Sr. No</th>

							<th>Customer</th>
							<th>PO NO</th>
							<th>Invoice No</th>
							<th>Date</th>
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
							{store.data.sale.saleOrder.tableData?.data.map((item, index) => (
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

									<td>
										{item.sale_type === 1
											? item.walk_in_customer_name
											: item.customer?.name}
										<div className='small text-muted'>
											{item.sale_type === 1 ? 'Walk-in ' : 'Registered '}
										</div>
									</td>
									<td>{(item.pono)}</td>
									
									<td>
										{item.is_dummy === 1 ? (
											<div className='d-flex align-items-center'>
												<span
													className={classNames(
														'badge',
														'border border-2',
														[`border-`],
														'rounded-circle',
														'bg-danger',
														'p-2 me-2',
														`bg-danger'																	}`,
													)}>
													<span className='visually-hidden'>
														{item.is_dummy}
													</span>
												</span>
												<span className='text-nowrap'>
													<strong>{item.invoice_no}</strong>
												</span>
											</div>
										) : (
											<strong>{item.invoice_no}</strong>
										)}
									</td>

									<td>{moment(item.date).format('DD-MM-YYYY')}</td>
									<td>
										<ButtonGroup>
											<Button
												// isDisable={item.isApproved === 1}
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
															<DropdownItem isHeader>
																<div className='d-flex justify-content-end'>
																	<Button
																		color='primary'
																		className={classNames(
																			'text-nowrap',
																			{
																				' me-2 col-md-6 border-light': true,
																			},
																		)}
																		onClick={() => {
																			printReportAll(
																				2,
																				item.id,
																			);
																		}}
																		isOutline
																		icon='FilePdfFill'
																		iconColor='info'
																		isActive>
																		Print
																	</Button>
																	<Button
																		color='primary'
																		className={classNames(
																			'text-nowrap',
																			{
																				'col-md-6 border-light': true,
																			},
																		)}
																		onClick={() => {
																			printReportAll2(
																				2,
																				item.id,
																			);
																		}}
																		isOutline
																		icon='FilePdfFill'
																		iconColor='info'
																		isActive>
																		DC
																	</Button>
																</div>
															</DropdownItem>
															<DropdownItem>
																<Button
																	color='primary'
																	className={classNames(
																		'text-nowrap',
																		{
																			' me-2 col-md-6 border-light': true,
																		},
																	)}
																	onClick={() => {
																		printWithoutSign(2, item.id);
																	}}
																	isOutline
																	icon='FilePdfFill'
																	iconColor='info'
																	isActive>
																	Print Without Sign
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	// isDisable={item.isApproved === 1}
																	onClick={() => {
																		getReturnInvoice(item.id);
																		setItemId(item.id);

																		initialStatusReturn();
																		setStateReturn(true);
																		setStaticBackdropStatusReturn(
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
																	icon='Edit'>
																	Return
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Button
																	isOutline
																	color='primary'
																	// isLight={darkModeStatus}
																	className={classNames(
																		'text-nowrap',
																		{
																			'border-light': true,
																		},
																	)}
																	icon='Preview'
																	onClick={() =>
																		getHistoryData(item.id, 2)
																	}>
																	History
																</Button>
															</DropdownItem>
															<DropdownItem>
																<Excel
																	printReportAllExcel={() =>
																		printReportAllExcel(item.id)
																	}
																/>
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
					from={store.data.sale.saleOrder.tableData?.from ?? 1}
					to={store.data.sale.saleOrder.tableData?.to ?? 1}
					total={store.data.sale.saleOrder.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.sale.saleOrder?.pageNo ?? 1}
							totalItemsCount={store.data.sale.saleOrder?.tableData?.total ?? 0}
							itemsCountPerPage={Number(store.data.sale.saleOrder?.perPage ?? 10)}
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
									<small> sale Id: {itemId}</small>
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
										Are you sure, you want to delete the selected sale? <br />
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
								<CardTitle>Editing Direct sale</CardTitle>
								<small> sale Id: {itemId}</small>
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
				size='xl'
				fullScreen={fullScreenStatusView}
				isAnimation={animationStatusView}>
				<ModalHeader setIsOpen={headerCloseStatusView ? setStateView : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>View Invoice</CardTitle>
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
			{/* Return Model */}
			<Modal
				isOpen={stateReturn}
				setIsOpen={setStateReturn}
				titleId='ReturnVoucher'
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
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle> Sale Return</CardTitle>
								<small> sale Id: {itemId}</small>
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
