import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import apiClient from '../../../../baseURL/api';

// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** ApiClient Imports

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';

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
import Edit from './edit';
import ViewDetails from './itemDetails';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.itemsManagement.itemParts.perPage));
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);

	const [editingItem, setEditingItem] = useState({});
	const [itemId, setItemId] = useState('');
	const [deleteLoading, setDeleteLoading] = useState(false);

	// Edit
	const [stateEdit, setStateEdit] = useState(false);
	const [viewItem, setViewItem] = useState();
	const [staticBackdropStatusEdit, setStaticBackdropStatusEdit] = useState(true);
	const [scrollableStatusEdit, setScrollableStatusEdit] = useState(false);
	const [centeredStatusEdit, setCenteredStatusEdit] = useState(false);
	const [fullScreenStatusEdit, setFullScreenStatusEdit] = useState(null);
	const [animationStatusEdit, setAnimationStatusEdit] = useState(true);
	const [viewItemLoading, setViewItemLoading] = useState(false);

	const [headerCloseStatusEdit, setHeaderCloseStatusEdit] = useState(true);
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
	const [stateView, setStateView] = useState(false);
	const getViewItem = (idd) => {
		setViewItemLoading(true);
		apiClient.get(`/itemDetails?id=${idd}`).then((res) => {
			setViewItem(res.data.Item);
			setViewItemLoading(false);
		});
	};
	const handleStateView = (status) => {
		setStateView(status);
	};
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
		apiClient.get(`/editItem?id=${idd}`).then((res) => {
			const aa = res.data.item;

			const a = [];
			res.data.item.manufacture.forEach((data) => {
				a.push({
					...data.manufacturedropdown,
					item_manufacture_id: data.id,
					item_id: data.item_id,
				});
			});
			aa.manufacture = a;

			setEditingItem(res.data.item);
			setEditingItemLoading(false);
		});
	};
	const handleStateEdit = (status) => {
		refreshTableData();
		setStateEdit(status);
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
			.delete(`/deleteItem?id=${id}`)
			.then((res) => {
				if (res.data.status === 'ok') {
					refreshTableData();
				}
				setStateDelete(false);
			})
			.catch(() => {
				setDeleteLoading(false);
			});
	};

	useEffect(
		() => {
			dispatch(updateSingleState([perPage, 'itemsManagement', 'itemParts', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);

	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'itemsManagement', 'itemParts', 'pageNo']));
	};

	const toggleStatus = (id) => {
		apiClient
			.post(`/activeUnactiveItem?id=${id}`)
			.then(() => {
				refreshTableData();
			})
			.catch((err) => {
				console.log(err);
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
							<th>Category</th>
							<th>Sub Category</th>
							<th>Item</th>
							<th>Nomenclature</th>
							<th>Manufacture</th>

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
							{store.data.itemsManagement.itemParts.tableData?.data.map(
								(item, index) => (
									<tr key={item.id}>
										<td>
											<div className='row justify-content-center'>
												<div className='col-md-6'>
													<Checks
														id={item.id.toString()}
														name='selectedList'
														value={item.id}
														onChange={selectTable.handleChange}
														checked={selectTable.values.selectedList.includes(
															item.id.toString(),
														)}
													/>
												</div>
												<div className='col-md-6 d-flex align-items-center'>
													<span
														className={classNames(
															'badge',
															'border border-2',
															[`border-`],
															'rounded-circle',
															'bg-success',
															'p-2 me-2',
															`bg-${item.isActive === 0
																? `danger`
																: `success`
															}`,
														)}>
														<span className='visually-hidden'>
															{item.isActive}
														</span>
													</span>
												</div>
											</div>
										</td>
										<td>{index + 1}</td>
										<td>{item.category?.name}</td>
										<td>{item.subcategory?.name}</td>

										<td>
											{item.name}-{item?.strength}-{item.strengthunit?.name}
										</td>
										<td>{item.nomenclature}</td>
										<td>{item.manufacture[0]?.manufacturedropdown?.label}</td>

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
															Actions
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
																onClick={() => {
																	toggleStatus(item.id);
																}}>
																{item.isActive === 0
																	? `Activate`
																	: `Deactivate`}
															</Button>
														</DropdownItem>
													</DropdownMenu>
												</Dropdown>
											</ButtonGroup>
										</td>
									</tr>
								),
							)}
						</tbody>
					)}
				</table>

				<PaginationButtons
					label='make'
					from={store.data.itemsManagement.itemParts.tableData?.from ?? 1}
					to={store.data.itemsManagement.itemParts.tableData?.to ?? 1}
					total={store.data.itemsManagement.itemParts.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.itemsManagement.itemParts?.pageNo ?? 1}
							totalItemsCount={
								store.data.itemsManagement.itemParts?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.itemsManagement.itemParts?.perPage ?? 10,
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
										Are you sure, you want to delete the selected Item? <br />
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
				size='lg'
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Item</CardTitle>
								<small> Item Id: {itemId}</small>
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
								<CardTitle>View </CardTitle>
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
								<ViewDetails
									viewItem={viewItem}
									handleStateView={handleStateView}
								/>
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
