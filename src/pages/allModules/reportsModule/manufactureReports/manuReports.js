// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type, startDate, endDate) => {
	// initialize jsPDF

	// console.log(allInvoiceChildLengthGreaterThanZero);
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Invoice No',
		'Date',
		'Type',
		'Customer',
		'Item',
		// 'Store',
		// 'Invoice',
		'Pack Size',
		'Qty',
		'Rate',
		'Amount',
		// 'Ret Qty',

		// 'Profit',
	];
	const tableRows = [];

	let count = 0;
	// let count2 = 0;
	let count3 = 0;
	let totalSales = 0;
	// let totalDiscount = 0;
	// let totalRet = 0;
	// let totalCost = 0;
	// let totalProfit = 0;
	// const allInvoiceChildLengthGreaterThanZero = data1.every((itemObj) =>
	// 	itemObj.item_manufacture.every(
	// 		(manufactureObj) =>
	// 			manufactureObj.invoice_child && manufactureObj.invoice_child.length > 0,
	// 	),
	// );
	data1.forEach((item) => {
		const hasInvoiceChild = item.item_manufacture.some(
			(manufacture) => manufacture.invoice_child && manufacture.invoice_child.length > 0,
		);
		// console.log(item, hasInvoiceChild);
		// eslint-disable-next-line no-unsafe-optional-chaining
		if (
			item.item_manufacture &&
			item.item_manufacture.length > 0 &&
			// item.item_manufacture[0]?.invoice_child?.length > 0
			hasInvoiceChild
		) {
			count += 1;

			tableRows.push([
				{
					content: `${count}`,
					colSpan: 1,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Manufacture: ${item.name}`,
					colSpan: 9,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			let totalSalesBrand = 0;
			// let totalDiscountBrand = 0;
			// let totalRetBrand = 0;
			// let totalCostBrand = 0;
			// let totalProfitBrand = 0;
			item.item_manufacture.forEach((item2) => {
				if (item2.invoice_child.length > 0) {
					// count2 += 1;
					// tableRows.push([
					// 	{
					// 		content: `${count2}`,
					// 		colSpan: 1,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'center',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			fillColor: [222, 222, 222],
					// 		},
					// 	},
					// 	{
					// 		content: `Invoice No: ${item2.invoice_no}`,
					// 		colSpan: 1,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'left',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			fillColor: [222, 222, 222],
					// 		},
					// 	},
					// 	{
					// 		content: `Date: ${item2.date}`,
					// 		colSpan: 4,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			fillColor: [222, 222, 222],
					// 		},
					// 	},
					// ]);
					let totalSalesPart = 0;
					// let totalRetPart = 0;
					// let totalCostPart = 0;
					// let totalProfitPart = 0;
					item2.invoice_child.forEach((item3) => {
						count3 += 1;
						// Calculate
						totalSalesPart += item3.rate * item3.quantity;
						// totalRetPart += item3.rate * item3.returned_quantity;
						// totalCostPart +=
						// 	item3.total_amount * (item3.quantity - item3.returned_quantity);
						// totalProfitPart +=
						// 	item3.total_amount * (item3.quantity - item3.returned_quantity) -
						// 	item3.rate * (item3.quantity - item3.returned_quantity);

						// Calculate Ends
						const itemsData2 = [
							count3,
							item3.invoice.invoice_no,
							moment(item3.invoice.date).format('DD-MM-YYYY'),
							item3.invoice.sale_type === 1 ? 'Walk-in ' : 'Registered ',
							item3.invoice.sale_type === 1
								? item3.invoice?.walk_in_customer_name
								: item3.invoice?.customer?.name,
							item3.item.name,
							item3.item.pack,
							// moment(item2.invoice?.date).format('DD-MM-YYYY'),
							// `${item3.invoice?.invoice_no}-${
							// 	item3.invoice?.sale_type === 2
							// 		? item3.invoice?.customer.name
							// 		: item3.invoice?.walk_in_customer_name
							// }`,
							item3.quantity,
							item3.item.rate,
							item3.total_amount,
							// item3.rate * item3.quantity,
							// item3.returned_quantity,
							// item3.total_amount,

							// item3.rate * (item3.quantity - item3.returned_quantity) -
							// 	item3.total_amount * (item3.quantity - item3.returned_quantity),
						];

						tableRows.push(itemsData2);
					});
					tableRows.push([
						{
							content: `Total Amount`,
							colSpan: 6,
							rowSpan: 1,
							styles: {
								halign: 'right',
								fontStyle: 'bold',
								fontSize: 10,
								// fillColor: [175, 175, 175],
							},
						},
						{
							content: `${totalSalesPart.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 6,
							rowSpan: 1,
							styles: {
								halign: 'right',
								fontStyle: 'bold',
								fontSize: 10,
								// fillColor: [175, 175, 175],
							},
						},
					]);
					// tableRows.push([
					// 	{
					// 		content: `Discount`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// 	{
					// 		content: `${item2.discount}`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// ]);
					// tableRows.push([
					// 	{
					// 		content: `Total Returned`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// 	{
					// 		content: `${totalRetPart}`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// ]);
					// tableRows.push([
					// 	{
					// 		content: `Total Cost`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// 	{
					// 		content: `${totalCostPart}`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// ]);
					// tableRows.push([
					// 	{
					// 		content: `Total Profit`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// 	{
					// 		content: `${totalProfitPart}`,
					// 		colSpan: 6,
					// 		rowSpan: 1,
					// 		styles: {
					// 			halign: 'right',
					// 			fontStyle: 'bold',
					// 			fontSize: 10,
					// 			// fillColor: [175, 175, 175],
					// 		},
					// 	},
					// ]);
					count3 = 0;
					totalSalesBrand += totalSalesPart;
					// totalDiscountBrand += item2.discount;
					// totalRetBrand += totalRetPart;
					// totalCostBrand += totalCostPart;
					// totalProfitBrand += totalProfitPart;
				}
			});
			//  Here
			tableRows.push([
				{
					content: `Manufacture Summary: ${item.name}`,
					colSpan: 13,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			tableRows.push([
				{
					content: `Collective Total Amount`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
				{
					content: `${totalSalesBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						// fillColor: [175, 175, 175],
					},
				},
			]);
			// tableRows.push([
			// 	{
			// 		content: `Collective Total Discount`,
			// 		colSpan: 4,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// 	{
			// 		content: `${totalDiscountBrand}`,
			// 		colSpan: 6,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// ]);
			// tableRows.push([
			// 	{
			// 		content: `Total Returned`,
			// 		colSpan: 4,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// 	{
			// 		content: `${totalRetBrand}`,
			// 		colSpan: 6,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// ]);
			// tableRows.push([
			// 	{
			// 		content: `Total Cost`,
			// 		colSpan: 4,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// 	{
			// 		content: `${totalCostBrand}`,
			// 		colSpan: 6,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// ]);
			// tableRows.push([
			// 	{
			// 		content: `Total Profit`,
			// 		colSpan: 4,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// 	{
			// 		content: `${totalProfitBrand}`,
			// 		colSpan: 6,
			// 		rowSpan: 1,
			// 		styles: {
			// 			halign: 'right',
			// 			fontStyle: 'bold',
			// 			fontSize: 10,
			// 			// fillColor: [175, 175, 175],
			// 		},
			// 	},
			// ]);

			// count2 = 0;
			totalSales += totalSalesBrand;
			// totalDiscount += totalDiscountBrand;
			// totalRet += totalRetBrand;
			// totalCost += totalCostBrand;
			// totalProfit += totalProfitBrand;
		}
	});

	//  Summary

	tableRows.push([
		{
			content: `Complete Report Summary`,
			colSpan: 13,
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
			content: `Report Total Bill Amount`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
		{
			content: `${totalSales.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
				// fillColor: [175, 175, 175],
			},
		},
	]);
	// tableRows.push([
	// 	{
	// 		content: `Report Total Discount`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// 	{
	// 		content: `${totalDiscount}`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// ]);
	// tableRows.push([
	// 	{
	// 		content: `Total Returned`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// 	{
	// 		content: `${totalRet}`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// ]);
	// tableRows.push([
	// 	{
	// 		content: `Total Cost`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// 	{
	// 		content: `${totalCost}`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// ]);
	// tableRows.push([
	// 	{
	// 		content: `Total Profit`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// 	{
	// 		content: `${totalProfit}`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: {
	// 			halign: 'right',
	// 			fontStyle: 'bold',
	// 			fontSize: 10,
	// 			// fillColor: [175, 175, 175],
	// 		},
	// 	},
	// ]);

	//  Summary Ends
	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Manufacture Wise Sales Report', pageWidth / 2, 55, { align: 'center' });
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
	yPos = doc.lastAutoTable.finalY + 20;

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
		doc.save(`Report6${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
