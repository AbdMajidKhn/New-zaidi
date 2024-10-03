// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-shadow */

import React, { useEffect, useState } from 'react';

// ** apiClient Imports
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import ReactSelect from 'react-select';
import InputGroup, { InputGroupText } from '../../../../components/bootstrap/forms/InputGroup';
import { updateSingleState } from '../../redux/tableCrud/index';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	// CardActions,
	CardLabel,
	CardTitle,
} from '../../../../components/bootstrap/Card';

import apiClient from '../../../../baseURL/api';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../../components/bootstrap/Modal';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Button, { ButtonGroup } from '../../../../components/bootstrap/Button';
import View from './view';
import 'flatpickr/dist/themes/light.css';
import Checks from '../../../../components/bootstrap/forms/Checks';
import Spinner from '../../../../components/bootstrap/Spinner';
import Input from '../../../../components/bootstrap/forms/Input';
import customStyles from '../../../customStyles/ReactSelectCustomStyle';

const validate = (values) => {
	// console.log(values, 'values');
	const errors = {};
  
	if (!values.date) {
	  errors.request_date = 'Required';
	}
  
	values.childArray.forEach((data, index) => {
	  // Uncomment and update these checks as necessary
	  // if (!data.item_id) {
	  //   errors[`list[${index}]item_id`] = 'Required';
	  // }
  
	  // if (!data.selectedBatch && values.is_dummy === 0) {
	  //   errors[`list[${index}]selectedBatch`] = 'Required';
	  // }
  
	  // if (!data.quantity > 0) {
	  //   errors[`list[${index}]quantity`] = 'Required';
	  // }
  
	  // // if (!Number(data.rate) > 0) {
	  // //   errors[`list[${index}]rate`] = 'Required';
	  // // }
  
	//   if (data.quantity > data.batchQty) {
	// 	errors[`childArray[${index}]quantity`] = 'Insufficient quantity';
	//   }
	});
  
	return errors;
  };
  
export const searchByOptions = [{ value: 1, text: 'Id' }];
export const categoryOptions = [
	{ value: 0, text: 'qqq' },
	{ value: 1, text: 'www' },
	{ value: 2, text: 'eee' },
];
// require('flatpickr/dist/plugins/monthSelect/style.css');
require('flatpickr/dist/flatpickr.css');

const Categories = () => {
	const dispatch = useDispatch();
	const store = useSelector((state) => state.tableCrud);

	let todayDate = new Date();
	const dd = String(todayDate.getDate()).padStart(2, '0');
	const mm = String(todayDate.getMonth() + 1).padStart(2, '0');
	const yyyy = todayDate.getFullYear();

	todayDate = `${yyyy}-${mm}-${dd}`;

	const formik = useFormik({
		initialValues: {
			adjust_type: 'add',
			total_amount: '',
			date: todayDate,
			// item_id: "",
			quantity: '',
			// rate: '',
			childArray: [],
			manufacturer_id: '',
		},
		validate,
		onSubmit: () => {
			setIsLoading(true);
			setTimeout(handleSave, 2000);
		},
	});
	// console.log('forik', formik)
	const [tableData, setTableData] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [tableDataLoading, setTableDataLoading] = useState(true);
	const [categoryDropDown, setCategoryDropDown] = useState([]);
	const [categoryDropDownLoading, setCategoryDropDownLoading] = useState([]);
	const [selectedcategory, setSelectedCategory] = useState('');
	const [subcategoryDropDown, setSubcategoryDropDown] = useState([]);
	const [subcategoryDropDownLoading, setSubcategoryDropDownLoading] = useState([]);
	const [selectedsubcategory, setSelectedSubcategory] = useState('');
	const [itemDropDown, setItemDropDown] = useState([]);
	const [itemDropDownLoading, setItemDropDownLoading] = useState([]);
	const [selecteditem, setSelectedItem] = useState('');
	const [itemIds, setItemIds] = useState(null)
	const [itemOptions, setItemOptions] = useState([]);

	const [CapitalAccounts, setCapitalAccounts] = useState([]);
	const [CapitalAccountsLoading, setCapitalAccountsLoading] = useState([]);
	const [triggerRefreshItemOptions, setTriggerRefreshItemOptions] = useState(0);
	const [triggerCalculateTotal, setTriggerCalculateTotal] = useState(0);

	const [state, setState] = useState(false);
	const [staterefresh, setStateRefresh] = useState(false);

	const [itemId, setItemId] = useState('');
	const [item, setItem] = useState('');

	const [isLoading, setIsLoading] = useState(false);
	// const [meterSizeOptions, setMeterSizeOptions] = useState([]);

	const [staticBackdropStatus, setStaticBackdropStatus] = useState(false);
	const [scrollableStatus, setScrollableStatus] = useState(false);
	const [centeredStatus, setCenteredStatus] = useState(false);
	const [fullScreenStatus, setFullScreenStatus] = useState(null);
	const [animationStatus, setAnimationStatus] = useState(true);
	const [headerCloseStatus, setHeaderCloseStatus] = useState(true);
	// states for accounts
	const [disposalAccounts, setDisposalAccounts] = useState([]);
	const [disposalAccountsLoading, setDisposalAccountsLoading] = useState(false);
	const [capitalAccountOptions, setCapitalAccountOptions] = useState([]);
	const [capitalAccountOptionsLoading, setCapitalAccountOptionsLoading] = useState(false);
	const [ReRender, setReRender] = useState(0);

	const [categoriesOptions, setCategoriesOptions] = useState([]);
	const [categoriesOptionsLoading, setCategoriesOptionsLoading] = useState(false);
	const [subOption, setSubOptions] = useState([]);
	const [subOptionsLoading, setSubOptionsLoading] = useState(false);

	useEffect(() => {
		formik.setFieldValue('sub_category_id', '');
		setSubOptionsLoading(true);
		apiClient
			.get(
				`/getSubCategoriesDropDown?category_id=${formik.values.category_id ? formik.values.category_id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories?.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubOptions(rec);
				setSubOptionsLoading(false);
			});
	}, [formik.values.category_id]);
	useEffect(() => {
		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoriesOptions(rec);
			setCategoriesOptionsLoading(false);
		});
	}, []);

	const initialStatus = () => {
		setStaticBackdropStatus(false);
		setScrollableStatus(false);
		setCenteredStatus(false);
		setFullScreenStatus(null);
		setAnimationStatus(true);
		setHeaderCloseStatus(true);
	};

	const handleSave = () => {
		submitForm(formik.values);
	};

	const submitForm = (myFormik) => {
		console.log(myFormik);
		apiClient
			.post(`/addAdjustItemStock`, myFormik)
			.then((res) => {
				if (res.data.status === 'ok') {
					formik.resetForm();

					setState(false);
					refreshTableData();
					setIsLoading(false);
					// getItemsOptions();
				} else {
					setIsLoading(false);
				}
			})
			.catch(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		apiClient.get(`/getDisposeAccounts`).then((response) => {
			const rec = response.data.disposeAccounts.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setDisposalAccounts(rec);
			setDisposalAccountsLoading(false);
		});

		apiClient.get(`/getCapitalAccounts`).then((response) => {
			const rec = response.data.capitalAccounts?.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCapitalAccountOptions(rec);
			setCapitalAccountOptionsLoading(false);
		});
	}, []);

	const refreshTableData = () => {
		setTableDataLoading(true);
		apiClient
			.get(
				`/getAdjustInventory?records=${store.data.purchase.inventory.perPage}&pageNo=${store.data.purchase.inventory.pageNo
				}&colName=id&sort=desc
				&subcategory_id=${selectedsubcategory ? selectedsubcategory.id : ''}&category_id=${selectedcategory ? selectedcategory.id : ''
				}&item_id=${selecteditem ? selecteditem.id : ''}`,
				{},
			)
			.then((response) => {
				setTableData(response.data.itemsInventory?.data || []);
				setTableData2(response.data.itemsInventory);
				setTableDataLoading(false);
				dispatch(
					updateSingleState([
						response.data.itemsInventory,
						'purchase',
						'inventory',
						'tableData',
					]),
				);
			});
	};
	useEffect(() => {
		setCategoryDropDownLoading(true);

		apiClient.get(`/getCategoriesDropDown`).then((response) => {
			const rec = response.data.categories.map(({ id, name }) => ({
				id,
				value: id,
				label: name,
			}));
			setCategoryDropDown(rec);
			setCategoryDropDownLoading(false);
		});
	}, []);

	useEffect(() => {
		setSubcategoryDropDownLoading(true);
		apiClient
			.get(
				`/getSubCategoriesDropDown?category_id=${selectedcategory ? selectedcategory.id : ''
				}`,
			)
			.then((response) => {
				const rec = response.data.subcategories.map(({ id, name }) => ({
					id,
					value: id,
					label: name,
				}));
				setSubcategoryDropDown(rec);
				setSubcategoryDropDownLoading(false);
			});
	}, [selectedcategory]);
	// useEffect(() => {
	// 	apiClient.get(`/getItemMeterSize?item_id=${itemIds}`)
	// 		.then((response) => {
	// 			// console.log("The response of rec is:", response)
	// 			setMeterSizeOptions(response.data.item[0].meter_size)
	// 			// setMeterSizeOptionsLoading(response.data.item[0])

	// 		})
	// 		.catch((error) => {
	// 			console.error(error);
	// 			// setMeterSizeOptionsLoading(false);
	// 		});

	// }, [itemIds])
	// useEffect(() => {
	// 	setItemDropDownLoading(true);

	// 	// eslint-disable-next-line no-console
	// 	apiClient
	// 		.get(
	// 			`/getItemsDropDown?category_id=${selectedcategory ? selectedcategory.id : ''
	// 			}&sub_category_id=${selectedsubcategory ? selectedsubcategory.id : ''}`,
	// 		)
	// 		.then((response) => {
	// 			const rec = response.data.items.map(({ id, name, subcategory, category }) => ({
	// 				id,
	// 				value: id,
	// 				label: `${category.name}-${subcategory.name}-${name}`,
	// 			}));
	// 			setItemDropDown(rec);
	// 			setItemDropDownLoading(false);
	// 		});

	// 	// eslint-disable-next-line no-console
	// }, [selectedcategory, selectedsubcategory]);

	useEffect(() => {
		refreshTableData();
	}, [store.data.purchase.inventory.perPage, store.data.purchase.inventory.pageNo]);
	const getItemsDropDownSale = () => {
		apiClient.get(`/getItemsDropDownPo`).then((response) => {
			// console.log(response, 'res')
			const rec = response.data.items.map(
				// eslint-disable-next-line camelcase
				({ id, name, pack, manufacturerOptions, unit, strengthunit, strength }) => ({
					id,
					value: id,
					label: `${name}-${strength}${strengthunit ? `-${strengthunit.name}` : ''}`,
					pack,
					unit,
					// eslint-disable-next-line camelcase
					manufactureOptions: manufacturerOptions.map((d) => ({
						id: Number(`${d.id}`),
						value: Number(`${d.id}`),
						label: `${d.label}`,

					})),

				}),
			);
			setItemOptions(rec);
			// setItemOptionsLoading(false);
		});
	};

	const getExistingQty = (idx, val) => {
		if (val) {
			formik.setFieldValue(`childArray[${idx}].qty_available_loading`, true);

			apiClient.get(`/itemInventory?item_id=${val ? val.id : ''}`).then((response) => {
				// console.log(response, 'resp')
				// console.log(val, 'valss')
				const batchOptions = response.data.items.iteminventory.map((d) => ({
					value: Number(`${d.item_id}`),
					label: `${d.batch_no}`,
					batchExpiry: d.expiry_date,
				}))

				formik.setFieldValue(`childArray[${idx}].qty_available_loading`, false);

				formik.setFieldValue(
					`childArray[${idx}].qty_available`,
					response.data.itemsInv.item_avaiable_inventory?.item_available ?? 0,
				);
				formik.setFieldValue(`childArray[${idx}].avg_price`, response.data.AvgPrice ?? 0);
				formik.setFieldValue(`childArray[${idx}].batch_no`, '');
				formik.setFieldValue(`childArray[${idx}].batchDetails`, batchOptions);
				// formik.setFieldValue(`childArray[${idx}].expiry_date`, expiryDate);

				// formik.setFieldValue(
				// 	`list[${idx}].last_sale_price`,
				// 	response.data.data.last_sale_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`list[${idx}].min_price`,
				// 	response.data.data.min_price ?? 0,
				// );
				// formik.setFieldValue(
				// 	`list[${idx}].max_price`,
				// 	response.data.data.max_price ?? 0,
				// );
				setReRender(ReRender + 1);
			});

			// eslint-disable-next-line no-console
		}
	};
	const getBatchNo = (idx, val) => {
		if (val) {
			// formik.setFieldValue(`childArray[${idx}].qty_available_loading`, true);

			apiClient.get(`/getbatchNo?manufacture_id=${formik.values.childArray[0]?.manufactureOptions[0]
				?.id}&item_id=${formik.values.childArray[0]?.item_id}`).then((response) => {
					// console.log(response, 'resp')
					// console.log(val, 'valss')
					const batchOptions = response.data.batch_no.map((d) => ({
						value: Number(`${d.item_id}`),
						label: `${d.batch_no}`,
						batchExpiry: d.expiry_date,
						manufacture: d.manufacture_id,
						itemAvailabe: d.item_available

					}))

					// formik.setFieldValue(`childArray[${idx}].qty_available_loading`, false);

					// formik.setFieldValue(
					// 	`childArray[${idx}].qty_available`,
					// 	response.data.itemsInv.item_avaiable_inventory?.item_available ?? 0,
					// );
					// formik.setFieldValue(`childArray[${idx}].avg_price`, response.data.AvgPrice ?? 0);
					formik.setFieldValue(`childArray[${idx}].batch_no`, '');
					formik.setFieldValue(`childArray[${idx}].batchDetails`, batchOptions);
					// formik.setFieldValue(`childArray[${idx}].expiry_date`, expiryDate);

					// formik.setFieldValue(
					// 	`list[${idx}].last_sale_price`,
					// 	response.data.data.last_sale_price ?? 0,
					// );
					// formik.setFieldValue(
					// 	`list[${idx}].min_price`,
					// 	response.data.data.min_price ?? 0,
					// );
					// formik.setFieldValue(
					// 	`list[${idx}].max_price`,
					// 	response.data.data.max_price ?? 0,
					// );
					setReRender(ReRender + 1);
				});

			// eslint-disable-next-line no-console
		}
	};
	const calculateTotal = () => {
		const arr = [...formik.values.childArray]; // Copy array to avoid mutation
		arr.forEach((data) => {
			// Make sure both quantity and rate are numbers and handle undefined cases
			const quantity = parseFloat(data?.quantity) || 0;
			const rate = parseFloat(data?.rate) || 0;
			data.total = quantity * rate;
		});
	
		formik.setFieldValue('childArray', arr);
	
		const totalPrice = arr.reduce((acc, item) => acc + (item.total || 0), 0);
		const totalQty = arr.reduce((acc, item) => acc + (item.quantity || 0), 0);
	
		// Update Formik values for total and quantity
		formik.setFieldValue('total', totalPrice);
		formik.setFieldValue('quantity', totalQty);
		formik.setFieldValue('total_amount', totalPrice); // Assuming total_amount is intended for total
	
		// If you have a separate state for 'total_amount', you may set it similarly
	};
	
	useEffect(() => {
		calculateTotal();
	}, [triggerCalculateTotal]);
	
	// const calculateTotal = () => {
	// 	let arr = [];
	// 	arr = formik.values.childArray;
	// 	arr.forEach((data) => {
	// 		console.log('data', data)
	// 		// eslint-disable-next-line no-unsafe-optional-chaining
	// 		// data.quantity = (data?.meter_size_label ? data?.meter_size_label : data.meter_size_label) * data.thaan;
	// 		// eslint-disable-next-line no-unsafe-optional-chaining
	// 		data.total = data.quantity * data.rate;
	// 	});
	// 	formik.setFieldValue(`childArray`, arr);

	// 	const price = arr?.reduce((a, v) => a + (v.quantity * v.rate || 0), 0) || 0;
	// 	const Qty = arr?.reduce((a, v) => a + (v.quantity || 0), 0) || 0;

	// 	formik.setFieldValue('total', price);
	// 	formik.setFieldValue('quantity', Qty);
	// 	formik.values.total = total;
	// 	const total =
	// 		arr !== null
	// 			? Number(
	// 				arr?.reduce(
	// 					// eslint-disable-next-line no-return-assign
	// 					(a, v) => a + parseFloat(v !== undefined ? v.total : 0),
	// 					0,
	// 				),
	// 			)
	// 			: 0;
	// 	formik.values.total_amount = total;
	// };

	// useEffect(() => {
	// 	calculateTotal();
	// }, [triggerCalculateTotal]);

	const getItemLastPriceAvlQantity = (id, index) => {
		apiClient.get(`/getAdjustItemId?item_id=${id}`).then((response) => {
			formik.setFieldValue(
				`childArray[${index}].avl_quantity`,
				response.data?.getLastPurchasePrice?.quantity,
			);
			formik.setFieldValue(
				`childArray[${index}].last_purchase_price`,
				response.data?.getRate,
			);
		});
	};

	const removeRow = (i) => {
		formik.setFieldValue('childArray', [
			...formik.values.childArray.slice(0, i),
			...formik.values.childArray.slice(i + 1),
		]);
		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	};
	// const handleMeterSizeChange = (val, index) => {
	// 	formik.setFieldValue(`childArray[${index}].meter_size`, val ? val.id : '').then(() => {
	// 		setTriggerRefreshItemOptions(triggerRefreshItemOptions + 1);
	// 		formik.setFieldValue(`childArray[${index}].meter_size_label`, val ? val.label : '').then(() => {
	// 			setTriggerCalculateTotal(triggerCalculateTotal + 1);
	// 		});
	// 	});
	// };


	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardHeader>
								<CardLabel icon='Assignment'>
									<CardTitle>Adjust Inventory</CardTitle>
								</CardLabel>
								<CardActions className='row g-4'>
									<ButtonGroup>
										<div className='col-auto'>
											<Button
												color='primary'
												icon='Add'
												hoverShadow='default'
												onClick={() => {
													initialStatus();
													setState(true);
													setStaticBackdropStatus(true);
													// setItem(
													// 	`${item?.item?.category.name}-${item?.item?.subcategory.name}-${item?.item?.name}`,
													// );
													setItemId(item?.id);
												}}>
												Adjust
											</Button>
										</div>
									</ButtonGroup>
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 d-flex align-items-end'>
									{/* <div className='col-md-2'>
										<FormGroup label='Category' id='category_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={categoryDropDown}
												isLoading={categoryDropDownLoading}
												isClearable
												value={selectedcategory}
												onChange={(val) => {
													setSelectedCategory(val);
													setSelectedSubcategory('');
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Sub Category' id='subcategory_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={subcategoryDropDown}
												isLoading={subcategoryDropDownLoading}
												isClearable
												value={selectedsubcategory}
												onChange={(val) => {
													setSelectedSubcategory(val);
													setSelectedItem('');
												}}
											/>
										</FormGroup>
									</div>
									<div className='col-md-2'>
										<FormGroup label='Item' id='item_id'>
											<Select
												className='col-md-12'
												classNamePrefix='select'
												options={itemDropDown}
												isLoading={itemDropDownLoading}
												isClearable
												value={selecteditem}
												onChange={(val) => {
													setSelectedItem(val);
												}}
											/>
										</FormGroup>
									</div> */}

									{/* <div className='col-md-2'>
										<Button
											color='primary'
											onClick={() => refreshTableData()}
											isOutline
											// isDisable={landsViewLoading}
											isActive>
											Search
										</Button>
									</div> */}
								</div>
								<br />

								<View
									tableData={tableData}
									tableData2={tableData2}
									refreshTableData={refreshTableData}
									tableDataLoading={tableDataLoading}
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>

			<Modal
				isOpen={state}
				setIsOpen={setState}
				titleId='exampleModalLabel'
				isStaticBackdrop={staticBackdropStatus}
				isScrollable={scrollableStatus}
				isCentered={centeredStatus}
				size='xl'
				fullScreen={fullScreenStatus}
				isAnimation={animationStatus}>
				<ModalHeader setIsOpen={headerCloseStatus ? setState : null}>
					<CardLabel icon='Add'>
						<ModalTitle id='exampleModalLabel'>Adjust Item Stock</ModalTitle>
					</CardLabel>
				</ModalHeader>
				<ModalBody>
					<div className='col-12'>
						<Card stretch tag='form' onSubmit={formik.handleSubmit}>
							<CardBody>
								<div className='row '>
									<Checks
										type='switch'
										id='adjust_type'
										label={
											formik.values.adjust_type === 'add'
												? 'Add Inventory'
												: 'Remove Inventory'
										}
										name='checkedCheck'
										onChange={(e) => {
											const newAdjustType = e.target.checked
												? 'add'
												: 'remove';
											formik.setFieldValue('adjust_type', newAdjustType);
										}}
										isValid={formik.isValid}
										checked={formik.values.adjust_type === 'add'} // Set checked based on adjust_type value
									/>
								</div>
								<div className='row g-2  d-flex justify-content-start'>
									{/* {formik.values.adjust_type === 'remove' && (
										<div className='col-md-3'>
											<FormGroup
												id='dispose_account_id'
												label='Dispose'
												className='col-md-12'>
												<ReactSelect
													className='col-md-12'
													isClearable
													isLoading={disposalAccountsLoading}
													options={disposalAccounts}
													value={
														formik.values.dispose_account_id
															? disposalAccounts?.find(
																	(c) =>
																		c.value ===
																		formik.values
																			.dispose_account_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'dispose_account_id',
															val ? val.id : '',
														);
													}}
													invalidFeedback={
														formik.errors.dispose_account_id
													}
												/>
											</FormGroup>
											{formik.errors.dispose_account_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#f35421',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors.dispose_account_id}
												</p>
											)}
										</div>
									)}

									{formik.values.adjust_type === 'add' && (
										<div className='col-md-3'>
											<FormGroup
												id='capital_account_id'
												label='Capital'
												className='col-md-12'>
												<ReactSelect
													className='col-md-12'
													isClearable
													isLoading={capitalAccountOptionsLoading}
													options={capitalAccountOptions}
													value={
														formik.values.capital_account_id
															? capitalAccountOptions?.find(
																	(c) =>
																		c ===
																		formik.values
																			.capital_account_id,
															  )
															: null
													}
													onChange={(val) => {
														formik.setFieldValue(
															'capital_account_id',
															val ? val?.id : '',
														);
													}}
													invalidFeedback={
														formik.errors.capital_account_id
													}
												/>
											</FormGroup>
											{formik.errors.capital_account_id && (
												// <div className='invalid-feedback'>
												<p
													style={{
														color: '#f35421',
														textAlign: 'left',
														marginTop: '0.25rem',
														fontSize: '0.875em',
													}}>
													{formik.errors.capital_account_id}
												</p>
											)}
										</div>
									)} */}

									<div className='col-md-2'>
										<FormGroup id='date' label='Date'>
											<Input
												type='date'
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.date}
												isValid={formik.isValid}
												isTouched={formik.touched.date}
												invalidFeedback={formik.errors.date}
											/>
										</FormGroup>
									</div>
									<div className='col-md-4'>
										<FormGroup
											id='remarks'
											label='Subject'
											className='col-md-12'>
											<Input
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.remarks}
												isValid={formik.isValid}
												isTouched={formik.touched.remarks}
												invalidFeedback={formik.errors.remarks}
											/>
										</FormGroup>
									</div>
								</div>

								<hr />
								{/* <CardBody className='table-responsive'> */}
								<table className='table text-center '>
									<thead>
										<tr className='row'>
											<th className='col-md-3'>Item </th>
											<th className='col-md-2'>Qty in Stock</th>

											<th className='col-md-2'>Quantity</th>
											<th className='col-md-1'>Last Purhase Rate</th>
											<th className='col-md-2'>Rate</th>
											<th className='col-md-2'>Total</th>
										</tr>
									</thead>
									<tbody>
										{formik.values.childArray.length > 0 &&
											formik.values.childArray.map((items, index) => (
												<tr className='row' key={items.index}>
													{/* {console.log('items adjust', items)} */}
													<td className='col-md-3'>
														<FormGroup
															label=''
															id={`childArray[${index}].item_id`}>
															<ReactSelect

																styles={customStyles}
																className='col-md-12'
																classNamePrefix='select'
																options={itemOptions}
																// isLoading={
																// 	items.items_options_loading
																// }
																value={
																	formik.values.childArray[index]
																		.item_id
																		? itemOptions.find(
																			(c) =>
																				c.value ===
																				formik.values
																					.childArray[index]
																					.item_id,
																		)
																		: null
																}
																onChange={(val) => {
																	// console.log(val, 'valwq')

																	formik.setFieldValue(
																		`childArray[${index}].item_id`,
																		val ? val.id : '',
																	);
																	// formik.setFieldValue(
																	// 	`childArray[${index}].batch_no`,
																	// 	'',
																	// );
																	// formik.setFieldValue(
																	// 	`childArray[${index}].batchDetails`,
																	// 	'',
																	// );
																	formik.setFieldValue(
																		`childArray[${index}].manufactureOptions`,
																		val ? val.manufactureOptions : '',
																	);
																	// formik.setFieldValue(
																	// 	`childArray[${index}].batchOptions`,
																	// 	val ? val.batchOptions : '',
																	// );
																	formik.setFieldValue(
																		`childArray[${index}].item_name`,
																		val !== null && val.label,
																	);
																	formik.setFieldValue(
																		`childArray[${index}].unit`,
																		val ? val.unit : '',
																	);
																	formik.setFieldValue(
																		`childArray[${index}].pack`,
																		val ? val.pack : '',
																	);

																	getItemLastPriceAvlQantity(
																		val.id,
																		index,
																	);

																	getExistingQty(index, val);
																}}

																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																			index
																		]?.item_id
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																	`childArray[${index}].item_id`
																	]
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]item_id`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: '#f35421',
																		fontSize: '0.875em',
																		marginTop: '0.25rem',
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]item_id`
																		]
																	}
																</p>
															)}
														<FormGroup
															className='mt-2'
															label='Manufacture'
															id={`childArray[${index}].manufacturer_id`}>
															<ReactSelect
																styles={customStyles}
																className='col-md-12'
																classNamePrefix='select'
																options={items.manufactureOptions}
																// isLoading={itemOptionsLoading}
																// isClearable
																value={
																	formik.values.childArray[index]
																		.manufacturer_id
																		? items?.manufactureOptions?.find(
																			(c) =>
																				c.id ===
																				formik.values
																					.childArray[index]
																					.manufacturer_id,
																		)
																		: null
																}

																onChange={(val) => {
																	// console.log(val, 'valww')
																	// formik.setFieldValue(
																	// 	`childArray[${index}].batch_no`,
																	// 	val ? val.label : '',
																	// );
																	// formik.setFieldValue(
																	// 	`childArray[${index}].batchDetails`,
																	// 	val,
																	// );
																	formik.setFieldValue(
																		`childArray[${index}].manufacturer_id`,
																		val.id,
																	);

																	// formik.setFieldValue(
																	// 	`childArray[${index}].expiry_date`,
																	// 	val.batchExpiry,
																	// );
																	getBatchNo(index, val);


																}}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[index]
																			?.batch_no
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																	`childArray[${index}].batch_no`
																	]
																}
															/>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]batch_no`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: '#f35421',
																		textAlign: 'left',
																		marginTop: '0.25rem',
																		fontSize: '0.875em',
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]batch_no`
																		]
																	}
																</p>
															)}
														<FormGroup
															label='Batch No'
															id={`childArray[${index}].batch_no`}>
															{formik.values.adjust_type === 'add' ? (
																<Input
																	type='text'
																	value={formik.values.childArray[index].batch_no || ''}
																	onChange={(val) => {
																		formik.setFieldValue(`childArray[${index}].batch_no`, val.target.value);
																	}}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	isTouched={formik.touched.childArray ? formik.touched.childArray[index]?.batch_no : ''}
																	invalidFeedback={formik.errors[`childArray[${index}].batch_no`]}
																/>
															) : (
																<ReactSelect
																	styles={customStyles}
																	className='col-md-12'
																	classNamePrefix='select'
																	options={items.batchDetails}
																	value={formik.values.childArray[index].batch_no ? items.batchDetails.find(
																		(c) => c.id === formik.values.childArray[index].batch_no
																	) : null}
																	onChange={(val) => {
																		formik.setFieldValue(`childArray[${index}].batch_no`, val ? val.label : '');
																		formik.setFieldValue(`childArray[${index}].expiry_date`, val.batchExpiry);
																		formik.setFieldValue(`childArray[${index}].batchQty`, val.itemAvailabe);
																	}}
																	isValid={formik.isValid}
																	isTouched={formik.touched.childArray ? formik.touched.childArray[index]?.batch_no : ''}
																	invalidFeedback={formik.errors[`childArray[${index}].batch_no`]}
																/>
															)}
														</FormGroup>
														{formik.errors[`childArray[${index}].batch_no`] && (
															<p
																style={{
																	color: '#f35421',
																	textAlign: 'left',
																	marginTop: '0.25rem',
																	fontSize: '0.875em',
																}}>
																{formik.errors[`childArray[${index}].batch_no`]}
															</p>
														)}
														<FormGroup
															id={`childArray[${index}].pack`}
															label='Pack Size'
															className='col-md-12'>
															<InputGroup>
																<Input
																	type='number'
																	step='1'
																	onWheel={(e) => e.target.blur()}
																	onChange={(val) => {
																		const inputValue =
																			val.target.value;
																		const isInteger =
																			Number.isInteger(
																				parseFloat(
																					inputValue,
																				),
																			);
																		if (
																			isInteger ||
																			inputValue === ''
																		) {
																			formik.setFieldValue(
																				`childArray[${index}].pack`,
																				inputValue,
																			);
																		}
																	}}
																	onBlur={formik.handleBlur}
																	value={items.pack}
																	isValid={formik.isValid}
																	isTouched={
																		formik.touched.childArray
																			? formik.touched
																				.childArray[
																				index
																			]?.pack
																			: ''
																	}
																	invalidFeedback={
																		formik.errors[
																		`childArray[${index}]pack`
																		]
																	}
																/>
																<InputGroupText id='addon2'>
																	{items.unit}
																</InputGroupText>
															</InputGroup>
														</FormGroup>
													

													</td>
													<td className='col-md-2'>
														{items?.avl_quantity}
														{formik.values.adjust_type === 'add' ? (
															<FormGroup label='Expiry Date' id={`childArray[${index}].expiry_date`}>
																<Input
																	type='date'
																	onChange={formik.handleChange}
																	onBlur={formik.handleBlur}
																	value={formik.values.childArray[index].expiry_date}
																	isValid={formik.isValid}
																	isTouched={formik.touched.childArray ? formik.touched.childArray[index]?.expiry_date : ''}
																	invalidFeedback={formik.errors[`childArray[${index}].expiry_date`]}
																/>
															</FormGroup>
														) : (
															<p className='fs-6'>
																Batch Exp{' '}
																{items.expiry_date ? items.expiry_date : 'None'}
															</p>
														)}
														{formik.values.adjust_type === 'remove' ? <p className='fs-6'>
															Batch qty{' '}
															{items.batchQty ? items.batchQty : 'None'}

														</p>
															: ''}
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].quantity`}
															label=''
															className='col-md-12'>
															<Input
																type='number'
																onWheel={(e) => e.target.blur()}
																size='sm'
																onChange={(val) => {
																	const inputValue =
																		val.target.value;
																	if (inputValue === '0') {
																		// Quantity cannot be 0
																		formik.setFieldError(
																			`childArray[${index}].quantity`,
																			'Quantity cannot be 0',
																		);
																	} else {
																		formik.setFieldValue(
																			`childArray[${index}].quantity`,
																			inputValue,
																		);
																		// Trigger any necessary calculations or updates
																		setTriggerCalculateTotal(
																			triggerCalculateTotal +
																			1,
																		);
																	}
																}}
																onBlur={formik.handleBlur}
																value={items.quantity}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																			index
																		]?.quantity
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																	`childArray[${index}]quantity`
																	]
																}
															/>
														</FormGroup>
													</td>
													<td className='col-md-1'>
														{items?.last_purchase_price}
													</td>
													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].rate`}
															label=''
															className='col-md-12'>
															<Input
																onWheel={(e) => e.target.blur()}
																type='number'
																size='sm'
																onChange={(val) => {
																	formik.setFieldValue(
																		`childArray[${index}].rate`,
																		val.target.value,
																	);
																	setTriggerCalculateTotal(
																		triggerCalculateTotal + 1,
																	);
																}}
																onBlur={formik.handleBlur}
																value={items.rate}
																isValid={formik.isValid}
																isTouched={
																	formik.touched.childArray
																		? formik.touched.childArray[
																			index
																		]?.rate
																		: ''
																}
																invalidFeedback={
																	formik.errors[
																	`childArray[${index}]rate`
																	]
																}
															/>
														</FormGroup>
													</td>

													<td className='col-md-2'>
														<FormGroup
															id={`childArray[${index}].total`}
															label=''
															type='number'
															className='col-md-12'>
															<strong>
																{items.total
																	? items.total.toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		},
																	)
																	: 0}
															</strong>
														</FormGroup>
														{formik.errors[
															`childArray[${index}]total`
														] && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: '#f35421',
																		textAlign: 'left',
																		marginTop: '0.25rem',
																		fontSize: '0.875em',
																	}}>
																	{
																		formik.errors[
																		`childArray[${index}]total`
																		]
																	}
																</p>
															)}
															<Button
															icon='cancel'
															color='danger'
															onClick={() => {
																removeRow(index);

																setTriggerCalculateTotal(
																	triggerCalculateTotal + 1,
																);
															}}
														/>{' '}
													</td>
													{/* <td className='col-md-1'>
														
													</td> */}
												</tr>
											))}
										<tr>
											<div className='row align-items-bottom justify-content-end'>
												<td className='col-md-2 align-items-center justify-content-start'>
													<div className='row g-4 d-flex align-items-start'>
														<div className='col-md-12 d-flex align-items-center mt-4'>
															<Button
																color='primary'
																icon='add'
																className='mt-4'
																onClick={() => {
																	formik
																		.setFieldValue(
																			'childArray',
																			[
																				...formik.values
																					.childArray,
																				{
																					item_id: '',
																					quantity: '',
																					rate: '',
																					total: 0,
																					items_options_loading: true,
																					manufacturer_id: '',
																					manufactureOptions: [],
																					items_options:
																						[],
																					// batchOptions: [],
																					pack: '',
																					batchDetails: [],
																					expiry_date: '',
																					batchQty: '',



																				},
																			],
																		)
																		.then(
																			getItemsDropDownSale(
																				formik.values
																					.childArray
																					.length,
																			),
																		);
																}}>
																Add
															</Button>
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<div>
															<FormGroup
																id='category_id'
																label='Category'>
																<ReactSelect
																	isLoading={
																		categoriesOptionsLoading
																	}
																	options={categoriesOptions}
																	value={
																		formik.values.category_id
																			? categoriesOptions?.find(
																				(c) =>
																					c.value ===
																					formik
																						.values
																						.category_id,
																			)
																			: null
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			'category_id',
																			val !== null && val.id,
																		);
																		formik.setFieldValue(
																			'category_name',
																			val !== null &&
																			val.label,
																		);

																		// getSubCategoriesDropDown(val.id);
																	}}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
															{formik.errors.category_id && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																	}}>
																	{formik.errors.category_id}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<div>
															<FormGroup
																id='sub_category_id'
																label='Sub Category'>
																<ReactSelect
																	isLoading={subOptionsLoading}
																	options={subOption}
																	isClearable
																	value={
																		formik.values
																			.sub_category_id
																			? subOption?.find(
																				(c) =>
																					c.value ===
																					formik
																						.values
																						.sub_category_id,
																			)
																			: null
																	}
																	onChange={(val) => {
																		formik.setFieldValue(
																			'sub_category_id',
																			val !== null && val.id,
																		);

																		// getSubCategoriesDropDown(val.id);
																	}}
																	onBlur={formik.handleBlur}
																	isValid={formik.isValid}
																	validFeedback='Looks good!'
																/>
															</FormGroup>
															{formik.errors.sub_category_id && (
																// <div className='invalid-feedback'>
																<p
																	style={{
																		color: 'red',
																	}}>
																	{formik.errors.sub_category_id}
																</p>
															)}
														</div>
													</div>
												</td>
												<td className='col-md-2 align-items-center justify-content-end'>
													<div className='row'>
														<p className='col-md-12 mt-4' label=''>
															<strong>Total Amount</strong>
														</p>
													</div>
												</td>
												<td className='col-md-3 align-items-center justify-content-center'>
													<div className='row'>
														<FormGroup
															className='col-md-9 mt-4'
															label=''>
															<strong>
																{formik.values.total_amount
																	? formik.values.total_amount.toLocaleString(
																		undefined,
																		{
																			maximumFractionDigits: 2,
																		},
																	)
																	: 0}
															</strong>
														</FormGroup>
													</div>
												</td>
											</div>
										</tr>

										<hr />
									</tbody>
								</table>
							</CardBody>
							<CardFooter>
								<CardFooterLeft>
									<Button
										type='reset'
										color='info'
										isOutline
										onClick={() => {
											setStateRefresh(!staterefresh);
											formik.resetForm();
											setTriggerRefreshItemOptions(
												triggerRefreshItemOptions + 1,
											);
											// getLatestPoNo();
										}}>
										Reset
									</Button>
								</CardFooterLeft>
								<CardFooterRight>
									<Button
										className='me-3'
										icon={isLoading ? null : 'Save'}
										isLight
										color='success'
										isDisable={isLoading}
										onClick={formik.handleSubmit}>
										{isLoading && <Spinner isSmall inButton />}
										{isLoading ? 'Saving' : 'Save'}
									</Button>
								</CardFooterRight>
							</CardFooter>
						</Card>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						color='info'
						isOutline
						className='border-0'
						onClick={() => setState(false)}>
						Close
					</Button>
				</ModalFooter>
			</Modal>
		</PageWrapper>
	);
};

export default Categories;
