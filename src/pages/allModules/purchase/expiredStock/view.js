import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import moment from 'moment';
import { GenerateUniqueKey } from '../../../../baseURL/GenerateUniqueKey';

import apiClient from '../../../../baseURL/api';
// eslint-disable-next-line import/no-unresolved
import { updateSingleState } from '../../redux/tableCrud/index';
// ** apiClient Imports

import Checks from '../../../../components/bootstrap/forms/Checks';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import PaginationButtons from '../../../../components/PaginationButtons';
import useSelectTable from '../../../../hooks/useSelectTable';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
} from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import Button from '../../../../components/bootstrap/Button';

const View = ({ tableDataLoading, tableData, refreshTableData }) => {
	// const navigate = useNavigate();
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);
	const [perPage, setPerPage] = useState(Number(store.data.purchase.inventory.perPage));
	const [itemId, setItemId] = useState('');
	const [batchNo, setBatchNo] = useState('');
	const [manufactureId, setManufactureId] = useState('');
	const [quantity, setQuantity] = useState('');
	const [expDtae, setExpDate] = useState('');

	const { selectTable, SelectAllCheck } = useSelectTable(tableData);
	// Edit

	// dispose
	const [disposeLoading, setDisposeLoading] = useState(false);

	const [stateDispose, setStateDispose] = useState(false);

	const [staticBackdropStatusDispose, setStaticBackdropStatusDispose] = useState(false);
	const [scrollableStatusDispose, setScrollableStatusDispose] = useState(false);
	const [centeredStatusDispose, setCenteredStatusDispose] = useState(false);
	const [sizeStatusDispose, setSizeStatusDispose] = useState(null);
	const [fullScreenStatusDispose, setFullScreenStatusDispose] = useState(null);
	const [animationStatusDispose, setAnimationStatusDispose] = useState(true);

	const [headerCloseStatusDispose, setHeaderCloseStatusDispose] = useState(true);

	const initialStatusDispose = () => {
		setStaticBackdropStatusDispose(false);
		setScrollableStatusDispose(false);
		setCenteredStatusDispose(false);
		setSizeStatusDispose('md');
		setFullScreenStatusDispose(null);
		setAnimationStatusDispose(true);
		setHeaderCloseStatusDispose(true);
	};

	const disposeItem = (id, batch, manu, quant, exp) => {
		apiClient
			.post(
				`/disposeExpiredStock?item_id=${id}&batch_no=${batch}&manufacture_id=${manu}&quantity=${quant}&expiry_date=${exp}`,
			)
			.then((res) => {
				if (res.data.status === 'ok') {
					setStateDispose(false);
					refreshTableData();
					setDisposeLoading(false);
				}
			})
			.catch(() => {
				setDisposeLoading(false);
			});
	};

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
							<th>Manufacturer</th>

							<th>Batch</th>
							<th>Expiry</th>
							<th>Unit</th>

							<th>Quantity</th>
							<th>Disposed</th>
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
										<td>{item.item.category?.name}</td>
										<td>{item.item.subcategory?.name}</td>
										<td>
											{item.item?.name}-{item.item.strength}-
											{item.item.strengthunit?.name}
										</td>
										<td>{item.manufacture?.name}</td>
										<td>{item.batch_no}</td>
										<td>
											{item.expiry_date
												? moment(item.expiry_date).format('DD-MM-YYYY')
												: 'None'}
										</td>
										<td>{item.item.unit.name}</td>
										<td>
											{item.quantity.toLocaleString(undefined, {
												maximumFractionDigits: 2,
											})}
										</td>
										<td>
											<Button
												isOutline
												color='danger'
												className={classNames('text-nowrap', {
													'my-2 border-light': true,
												})}
												icon='Dispose'
												isDisable={item.is_approved === 1}
												onClick={() => {
													setItemId(item.id);
													setBatchNo(item.batch_no);
													setManufactureId(item.manufacture_id);
													setQuantity(item.quantity);
													setExpDate(item.expiry_date);
													initialStatusDispose();

													setStateDispose(true);
													setStaticBackdropStatusDispose(false);
												}}>
												Dispose
											</Button>
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
			<Modal
				isOpen={stateDispose}
				setIsOpen={setStateDispose}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatusDispose}
				isScrollable={scrollableStatusDispose}
				isCentered={centeredStatusDispose}
				size={sizeStatusDispose}
				fullScreen={fullScreenStatusDispose}
				isAnimation={animationStatusDispose}>
				<ModalHeader setIsOpen={headerCloseStatusDispose ? setStateDispose : null}>
					<ModalTitle id='deltefile'>
						{' '}
						<CardHeader>
							<CardLabel icon='Dispose' iconColor='info'>
								<CardTitle>
									Dispose Confirmation
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
										Are you sure, you want to dipose the selected stock? <br />
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
											onClick={() => setStateDispose(false)}>
											Cancel
										</Button>
									</CardFooterLeft>
									<CardFooterRight>
										<Button
											icon={disposeLoading ? null : 'Dispose'}
											color='danger'
											onClick={() => {
												setDisposeLoading(true);
												disposeItem(
													itemId,
													batchNo,
													manufactureId,
													quantity,
													expDtae,
												);
											}}>
											{disposeLoading && <Spinner isSmall inButton />}
											{disposeLoading ? 'Disposing' : 'Yes, Dispose!'}
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
