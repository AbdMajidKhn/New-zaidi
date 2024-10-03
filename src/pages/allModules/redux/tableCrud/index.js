// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit';

export const addProjectSlice = createSlice({
	name: 'tableCrud',
	initialState: {
		data: {
			level1: {
				level2: {
					parameter: 10,
				},
			},

			// itemsManagementModule

			itemsManagement: {
				category: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				strength: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				subcategory: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				itemParts: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				itemRates: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			storeManagement: {
				store: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			personManagement: {
				person: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			purchase: {
				purchaseOrder: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				exposedStock: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				stockReport: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				return: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				directPurchase: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				inventory: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			quotations: {
				quotation: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				invoice: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
			sale: {
				salePurchase: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				saleOrder: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
				saleReturn: {
					tableData: null,
					tableDataLoading: false,
					pageNo: 1,
					perPage: 10,
					searchNo: null,
					others: null,
				},
			},
		},

		cookies: {
			userToken: '',
		},
	},
	reducers: {
		updateSingleState: (state, action) => {
			return {
				...state,
				data: {
					...state.data,
					[action.payload[1]]: {
						...state.data[action.payload[1]],
						[action.payload[2]]: {
							...state.data[action.payload[1]][action.payload[2]],
							[action.payload[3]]: action.payload[0],
						},
					},
				},
			};
		},
		updateCookies: (state, action) => {
			return {
				...state,
				cookies: {
					...state.cookies,
					[action.payload[1]]: action.payload[0],
				},
			};
		},
		// eslint-disable-next-line no-unused-vars
		resetStore: (state, action) => {
			return {
				data: {
					inventory: {
						items: {
							tableData: null,
							tableDataLoading: false,
							pageNo: 1,
							perPage: 10,
						},
					},
				},
				cookies: {
					userRights: [],
					branchName: 'null',
				},
			};
		},
	},
});

export const { updateWholeObject, updateSingleState, resetStore, updateCookies } =
	addProjectSlice.actions;
export default addProjectSlice.reducer;
