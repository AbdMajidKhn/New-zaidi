// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type, specificItem, startDate, endDate) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	let grossProfit = 0;
	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',

		'Item',
		'Strength',
		'Pack Size',
		'Quantity',
		'Rate',
		'Amount',
		'Discount',
		'Total',
		// 'Ret Qty',

		// 'Profit',
	];
	const tableRows = [];
	const tableRows2 = [];
	let total = 0;
	let count = 0;
	let tAmount = 0;
	let tReturned = 0;
	let tTotal = 0;
	let tDiscount = 0;
	let tAfterDiscount = 0;
	let tGst = 0;
	let aTax = 0;
	let tAfterAdvTax = 0;
	// let tGst = 0;
	// eslint-disable-next-line no-unused-vars
	let tAfterGst = 0;
	// eslint-disable-next-line no-unused-vars
	let tGrossProfit = 0;
	const tableColumns2 = [
		'S.No.',

		'Item',
		'Strength',
		'Pack Size',
		'Quantity',
		'Rate',

		'Amount',
		// 'Ret Qty',

		// 'Profit',
	];
	data1.salesReport.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		// total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		if (item.invoice_child && item.invoice_child.length > 0) {
			tableRows.push([
				{
					content: `Invoice No: ${item.invoice_no}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer: ${
						item.sale_type === 1 ? item.walk_in_customer_name : item.customer.name
					}`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date: ${item?.date}`,
					colSpan: 3,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			grossProfit = 0;
			total = 0;
			count = 0;
			item.invoice_child.forEach((item2) => {
				count += 1;
				total += item2.rate * item2.quantity;
				grossProfit +=
					item2.rate * (item2.quantity - item2.returned_quantity) -
					item2.cost * (item2.quantity - item2.returned_quantity);

				const itemsData2 = [
					item2.returned_quantity > 0 ? `${count} *` : count,
					item2.item.name,
					item2.item.strength,
					item2.item.pack,
					item2.quantity,
					item2.rate,
					item2.quantity * item2.rate,
					item2.discount,
					item2.quantity * item2.rate - item2.discount,
					// item2.returned_quantity,

					// Profit column commented
					// item2.total_amount * (item2.quantity - item2.returned_quantity) -
					// 	item2.total_amount * (item2.quantity - item2.returned_quantity),
				];

				tableRows.push(itemsData2);
			});
			// Summary Calculation Start
			tReturned += (item?.invoice_return?.length > 0 ? item.invoice_return[0].total_amount : 0);

			tAmount += total;

			tTotal = tAmount - tReturned;
			tDiscount += item.discount;
			tAfterDiscount += item.total_after_discount;
			tGst += item.gst;
			
			aTax += item.adv_tax;
			tAfterAdvTax += item.total_after_adv_tax;
			tAfterGst += item.total_after_gst;
			tGrossProfit += grossProfit;
			// Summary Calculation End
			if (!specificItem) {
				tableRows.push([
					{
						content: `Total:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					{
						content: `${total.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					// {
					// 	content: `${grossProfit}`,
					// 	colSpan: 1,
					// 	rowSpan: 1,
					// 	styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// },
				]);

				if (total - item.total_amount !== 0) {
					tableRows.push([
						{
							content: `Returned Amount:`,
							colSpan: 5,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${
								total.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								}) -
								item.total_amount.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})
							}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
					tableRows.push([
						{
							content: `Total:`,
							colSpan: 5,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${item.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
				}
				
				tableRows.push([
					{
						content: `Discount:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					// {
					// 	content: `${grossProfit - item.discount}`,
					// 	colSpan: 1,
					// 	rowSpan: 1,
					// 	styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// },
				]);
				tableRows.push([
					{
						content: `Total After Discount:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `GST:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item?.gst?.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total After GST:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item?.total_after_gst?.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				// tableRows.push([
				// 	{
				// 		content: `Advance Tax %:`,
				// 		colSpan: 5,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${item?.adv_tax_percentage?.toLocaleString(undefined, {
				// 			maximumFractionDigits: 2,
				// 		})}`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// ]);
				tableRows.push([
					{
						content: `Advance Tax In Figure:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item?.adv_tax?.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total After Advance Tax:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item?.total_after_adv_tax?.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				
				
		
				// tableRows.push([
				// 	{
				// 		content: `GST %:`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${((item.gst / item.total_after_discount) * 100).toLocaleString(
				// 			undefined,
				// 			{
				// 				maximumFractionDigits: 2,
				// 			},
				// 		)}`,
				// 		colSpan: 1,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `GST Amount:`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${item.gst}`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// ]);
				// tableRows.push([
				// 	{
				// 		content: `Total after Gst:`,
				// 		colSpan: 5,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${
				// 			item.total_after_gst
				// 				? item.total_after_gst.toLocaleString(undefined, {
				// 						maximumFractionDigits: 2,
				// 				  })
				// 				: 0
				// 		}`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// ]);
			}
		}
		if (item.invoice_return && item.invoice_return.length > 0) {
			tableRows2.push([
				{
					content: `Invoice No: ${item.invoice_no}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer:${
						item.sale_type === 1 ? item.walk_in_customer_name : item.customer.name
					}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: ``,
					colSpan: 3,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			grossProfit = 0;
			total = 0;
			count = 0;
			item.invoice_child.forEach((item2) => {
				count += 1;
				total += item2.rate * item2.quantity;
				grossProfit +=
					item2.rate * (item2.quantity - item2.returned_quantity) -
					item2.cost * (item2.quantity - item2.returned_quantity);

				const itemsData2 = [
					item2.returned_quantity > 0 ? `${count} *` : count,
					item2.item.name,
					item2.item.strength,
					item2.item.pack,
					item2.quantity,
					item2.item.rate,
					item2.total_amount,
					// item2.returned_quantity,

					// Profit column commented
					// item2.total_amount * (item2.quantity - item2.returned_quantity) -
					// 	item2.total_amount * (item2.quantity - item2.returned_quantity),
				];

				tableRows2.push(itemsData2);
			});
			// Summary Calculation Start
			// tReturned += total - item.total_amount;
			// // Summary Calculation Ends
			// // Summary Calculation Start
			// tAmount += total;

			// tTotal += item.total_amount;
			// tDiscount += item.discount;
			// tAfterDiscount += item.total_after_discount;
			// tGst += item.gst;
			// tAfterGst += item.total_after_gst;
			// tGrossProfit += grossProfit;
			// Summary Calculation End
			if (!specificItem) {
				tableRows2.push([
					{
						content: `Total:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					{
						content: `${total.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					// {
					// 	content: `${grossProfit}`,
					// 	colSpan: 1,
					// 	rowSpan: 1,
					// 	styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// },
				]);

				if (total - item.total_amount !== 0) {
					tableRows2.push([
						{
							content: `Returned Amount:`,
							colSpan: 5,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${
								total.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								}) -
								item.total_amount.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})
							}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
					tableRows2.push([
						{
							content: `Total:`,
							colSpan: 5,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${item.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 2,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
				}
				tableRows2.push([
					{
						content: `Discount:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					// {
					// 	content: `${grossProfit - item.discount}`,
					// 	colSpan: 1,
					// 	rowSpan: 1,
					// 	styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					// },
				]);
				tableRows2.push([
					{
						content: `Total After Discount:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				// tableRows2.push([
				// 	{
				// 		content: `GST %:`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${((item.gst / item.total_after_discount) * 100).toLocaleString(
				// 			undefined,
				// 			{
				// 				maximumFractionDigits: 2,
				// 			},
				// 		)}`,
				// 		colSpan: 1,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `GST Amount:`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${item.gst}`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// ]);
				// tableRows2.push([
				// 	{
				// 		content: `Total after Gst:`,
				// 		colSpan: 5,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// 	{
				// 		content: `${
				// 			item.total_after_gst
				// 				? item.total_after_gst.toLocaleString(undefined, {
				// 						maximumFractionDigits: 2,
				// 				  })
				// 				: 0
				// 		}`,
				// 		colSpan: 2,
				// 		rowSpan: 1,
				// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
				// 	},
				// ]);
			}
		}
	});

	//  Summary
	if (!specificItem) {
		tableRows.push([
			{
				content: `Summary`,
				colSpan: 9,
				rowSpan: 1,
				styles: {
					halign: 'center',
					fontStyle: 'bold',
					fontSize: 12,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Sale:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAmount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Discount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total After Discount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total GST:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Overall Total After GST:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: ` Overall Advance Tax:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${aTax.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Overall Total After Advance Tax:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterAdvTax.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Returned:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tReturned.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total After Return:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tTotal.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `GST Amount:`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tGst.toLocaleString(undefined, {
		// 			maximumFractionDigits: 2,
		// 		})}`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `Total Amount After GST:`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tAfterGst.toLocaleString(undefined, {
		// 			maximumFractionDigits: 2,
		// 		})}`,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
		// Gross Profit Commented
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `***Gross Profit***:`,
		// 		colSpan: 2,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tGrossProfit}`,
		// 		colSpan: 2,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// 	{
		// 		content: `Gross Profit After Discount:`,
		// 		colSpan: 2,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// 	{
		// 		content: `${tGrossProfit - tDiscount}`,
		// 		colSpan: 2,
		// 		rowSpan: 1,
		// 		styles: {
		// 			halign: 'right',
		// 			fontStyle: 'bold',
		// 			fontSize: 10,
		// 			fillColor: [175, 175, 175],
		// 		},
		// 	},
		// ]);
	}
	//  Summary Ends
	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Tarders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Sales Report', pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate !== '' ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate !== '' ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	doc.text(`As on  ${moment().format('MMMM D, YYYY')}`, pageWidth / 2, 85, { align: 'center' });
	yPos += 15;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		theme: 'grid',
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		headStyles: {
			fillColor: [225, 225, 225],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 50;

	doc.setFont(undefined, 'bold');
	doc.text('Return Sales Report', pageWidth / 2, yPos - 5, { align: 'center' });
	doc.autoTable(tableColumns2, tableRows2, {
		startY: yPos,
		theme: 'grid',
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		headStyles: {
			fillColor: [225, 225, 225],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 50;

	yPos = doc.lastAutoTable.finalY + 20;

	doc.setFontSize(12);

	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(10);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(10);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');

	// Footer Starts
	doc.page = 1;

	doc.page += 1;
	// Footer Ends
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
	let str = `Page ${doc.internal.getNumberOfPages()}`;
	// Total page number plugin only available in jspdf v1.0+
	if (typeof doc.putTotalPages === 'function') {
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.setFontSize(10);

	// eslint-disable-next-line prefer-destructuring
	// const pageSize = doc.internal.pageSize;
	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Report1${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
