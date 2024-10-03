// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a purchaseReportPDF function that accepts a tickets argument
const purchaseReportPDF = (data1, type, specificItem, specificSupplier, startDate, endDate) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// define the columns we want and their titles
	const tableColumns = ['S.No.', 'Item', 'strength', 'Pack Size', 'Quantity', 'Rate', 'Amount'];
	const tableRows = [];
	// const total = 0;

	// let tAmount = 0;
	// let tReturned = 0;
	let tTotal = 0;
	let tDiscount = 0;
	let tAfterDiscount = 0;
	let tGst = 0;
	let tAfterGst = 0;
	let count = 0;
	data1.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		// total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		if (item.purchaseorderchild && item.purchaseorderchild.length > 0) {
			tableRows.push([
				{
					content: `PO No: ${item.po_no}`,
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
					content:
						// item.po_type === ' '
						// 	? ''
						// 	: item.po_type === 2
						// 	? `Supplier:${item.supplier?.name}`
						// 	: item.po_type === 3
						// 	? 'Direct Purchase'
						// 	: 'Purchase Order',
						item.po_type === ' '
							? ''
							: item.po_type === 1 || 2
							? `Supplier:${item.supplier?.name}`
							: item.po_type === 3
							? 'Direct Purchase'
							: 'Purchase Order',
					colSpan: 3,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date:${item?.receive_date}`,
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

			// const totalExpenses =
			// 	item.purchase_expenses !== null
			// 		? parseFloat(
			// 				item.purchase_expenses.reduce(
			// 					// eslint-disable-next-line no-return-assign
			// 					(a, v) => (a += parseFloat(v !== undefined ? v.amount : 0)),
			// 					0,
			// 				),
			// 		  )
			// 		: 0;

			count = 0;
			item.purchaseorderchild.forEach((item2) => {
				count += 1;
				// percentAge: (item2.amount * 100) / item.total ?? 0,
				// cost: (((item.amount * 100) / item.total) * t) / 100,
				// const costPerItem =
				// 	(((item2.amount * 100) / item.total) * totalExpenses) /
				// 		100 /
				// 		item2.received_quantity ?? 0;

				const itemsData2 = [
					count,
					item2.item?.name,
					item2.item?.strength,
					item2.item?.pack,
					item2.quantity,
					item2.item?.rate,
					item2.total,
				];

				tableRows.push(itemsData2);
			});
			// Summary Calculation Start

			// tReturned += total - item.total;
			// Summary Calculation Ends
			// Summary Calculation Start
			// tAmount += total;

			tTotal += item.total;
			tDiscount += item.discount;
			tAfterDiscount += item.total_after_discount;
			tGst += item.tax_in_figure;
			tAfterGst += item.total_after_tax;
			// tGrossProfit += grossProfit;
			// Summary Calculation End
			if ((!specificItem, !specificSupplier)) {
				tableRows.push([
					{
						content: `Total:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);

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
						content: `Tax:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.tax_in_figure.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total After Tax:`,
						colSpan: 5,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_tax.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
			}
		}
	});

	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);
	//  Summary
	if (!specificItem) {
		tableRows.push([
			{
				content: `Summary`,
				colSpan: 7,
				rowSpan: 1,
				styles: {
					halign: 'center',
					fontStyle: 'bold',
					fontSize: 12,
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
		// {
		// 	content: `Total Purchase:`,
		// 	colSpan: 2,
		// 	rowSpan: 1,
		// 	styles: {
		// 		halign: 'right',
		// 		fontStyle: 'bold',
		// 		fontSize: 10,
		// 		fillColor: [175, 175, 175],
		// 	},
		// },
		// {
		// 	content: `${tAmount}`,
		// 	colSpan: 2,
		// 	rowSpan: 1,
		// 	styles: {
		// 		halign: 'right',
		// 		fontStyle: 'bold',
		// 		fontSize: 10,
		// 		fillColor: [175, 175, 175],
		// 	},
		// },
		// ]);
		// tableRows.push([
		// 	{
		// 		content: ``,
		// 		colSpan: 3,
		// 		rowSpan: 1,
		// 		styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// 	},
		// {
		// 	content: `Total Returned:`,
		// 	colSpan: 2,
		// 	rowSpan: 1,
		// 	styles: {
		// 		halign: 'right',
		// 		fontStyle: 'bold',
		// 		fontSize: 10,
		// 		fillColor: [175, 175, 175],
		// 	},
		// },
		// {
		// 	content: `${tReturned}`,
		// 	colSpan: 2,
		// 	rowSpan: 1,
		// 	styles: {
		// 		halign: 'right',
		// 		fontStyle: 'bold',
		// 		fontSize: 10,
		// 		fillColor: [175, 175, 175],
		// 	},
		// },
		// ]);
		tableRows.push([
			{
				content: ``,
				colSpan: 3,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total *:`,
				colSpan: 2,
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
				colSpan: 2,
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
				colSpan: 2,
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
				colSpan: 2,
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
				colSpan: 2,
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
				colSpan: 2,
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
				content: `Tax:`,
				colSpan: 2,
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
				colSpan: 2,
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
				content: `Total Amount After Tax:`,
				colSpan: 2,
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
				colSpan: 2,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
	}
	//  Summary Ends
	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Purchase Report', pageWidth / 2, 55, { align: 'center' });
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
		doc.save(`Report1${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default purchaseReportPDF;
