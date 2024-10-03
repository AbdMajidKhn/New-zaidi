// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import apiClient from '../../../../baseURL/api';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../../components/bootstrap/Dropdown';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** Axios Imports

// eslint-disable-next-line no-unused-vars
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

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [editingItemLoading, setEditingItemLoading] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	const [perPage, setPerPage] = useState(Number(store.data.personManagement.person.perPage));

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
		apiClient.get(`/editPerson?id=${idd}`).then((res) => {
			setEditingItem(res.data.person);
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
			.delete(`/deletePerson?id=${id}`)
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
			dispatch(updateSingleState([perPage, 'personManagement', 'person', 'perPage']));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[perPage],
	);
	const handlePageChange = (e) => {
		dispatch(updateSingleState([e, 'personManagement', 'person', 'pageNo']));
	};

	const toggleStatus = (id) => {
		apiClient
			.post(`/activeUnactivePerson?id=${id}`)
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
							<th>Name</th>

							<th>Person Type</th>
							<th>Phone No</th>

							<th>Address</th>
							<th>CNIC</th>
							<th>Status</th>
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
							{store.data.personManagement.person.tableData?.data.map(
								(item, index) => (
									<tr key={item.id}>
										<td>
											{/* <Checks
												id={item.id.toString()}
												name='selectedList'
												value={item.id}
												onChange={selectTable.handleChange}
												checked={selectTable.values.selectedList.includes(
													item.id.toString(),
												)}
											/> */}
											<div className='d-flex align-items-center'>
												<span
													className={classNames(
														'badge',
														'border border-2',
														[`border-`],
														'rounded-circle',
														'bg-success',
														'p-2 me-2',
														`bg-${
															item.isActive === 0
																? `danger`
																: `success`
														}`,
													)}>
													<span className='visually-hidden'>
														{item.isActive}
													</span>
												</span>
											</div>
										</td>
										<td>{index + 1} </td>
										<td>{item.name}</td>

										<td>{item.person_type?.type}</td>
										<td>{item.phone_no}</td>

										<td>{item.address}</td>
										<td>{item.cnic}</td>
										<td>
											<div className='d-flex align-items-center'>
												<span
													className={classNames(
														'badge',
														'border border-2',
														[`border`],
														'rounded-circle',
														'bg-success',
														'p-2 me-2',
														`bg-${
															item.isActive === 0
																? `danger`
																: `success`
														}`,
													)}>
													<span className='visually-hidden'>
														{item.isActive}
													</span>
												</span>
												<span className='text-nowrap'>
													{item.isActive === 0 ? `Inactive` : `Active`}
												</span>
											</div>
										</td>
										<td>
											<ButtonGroup>
												<Button
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
					label='Sales'
					from={store.data.personManagement.person.tableData?.from ?? 1}
					to={store.data.personManagement.person.tableData?.to ?? 1}
					total={store.data.personManagement.person.tableData?.total ?? 0}
					perPage={Number(perPage ?? 10)}
					setPerPage={setPerPage}
				/>

				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<Pagination
							activePage={store.data.personManagement.person?.pageNo ?? 1}
							totalItemsCount={
								store.data.personManagement.person?.tableData?.total ?? 0
							}
							itemsCountPerPage={Number(
								store.data.personManagement.person?.perPage ?? 10,
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
										Are you sure, you want to delete the selected Person?
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
				size='md'
				fullScreen={fullScreenStatusEdit}
				isAnimation={animationStatusEdit}>
				<ModalHeader setIsOpen={headerCloseStatusEdit ? setStateEdit : null}>
					<ModalTitle id='editVoucher'>
						{' '}
						<CardHeader>
							<CardLabel icon='Edit' iconColor='info'>
								<CardTitle>Editing Person</CardTitle>
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
