// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF2 function that accepts a tickets argument
const GeneratePDF2 = (data1, type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	//  Original PO Start
	let totalAmountOriginalPo = 0;
	let totalHistorySummarytotalReturned = 0;
	let totalHistorySummarydiscount = 0;
	let totalHistorySummaryTotalAfterDiscount = 0;
	let totalHistorySummaryTaxInFigure = 0;
	let totalHistorySummaryTotalAfterTax = 0;

	let totalHistorySummaryAdvanceTaxInFigure = 0;
	let totalHistorySummaryTotalAfterAdvanceTax = 0;

	const tableColumnsOriginalPo = [
		'S.No.',
		'ITEM',
		'Batch',
		'Pack Size',

		'Rate',
		' Quantity',

		'Discount',

		'Total',

		// 'Amount Received',
	];

	const tableRowsOriginalPo = [];
	const totalRowsOriginalPo = [];
	const totalRowsHistorySummary = [];

	data1.childData.forEach((item, index) => {
		totalAmountOriginalPo += Number(item.total_amount);

		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item?.name} ${item.item.strength || ''} ${item.item?.strengthunit?.name || ''}`,
			item.manufacturer.batch_no,
			`${item.item.pack} ${item.item?.unit?.name} `,

			item.quantity.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}) ?? 0,
			item.rate.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}) ?? 0,

			item.discount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}) ?? 0,
			item.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}) ?? 0,
		];

		tableRowsOriginalPo.push(itemsData);
	});

	totalRowsOriginalPo.push([
		{
			content: `Total`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: `${
				totalAmountOriginalPo.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0
			}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsOriginalPo.push([
		{
			content: `Discount`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content:
				data1.discount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsOriginalPo.push([
		{
			content: `Total After Discount`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content:
				data1.total_after_discount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsOriginalPo.push([
		{
			content: `Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content:
				data1.gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsOriginalPo.push([
		{
			content: `Tax %`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content:
				data1.gst_percentage.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsOriginalPo.push([
		{
			content: `Total After Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content:
				data1.total_after_gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	totalRowsOriginalPo.push([
		{
			content: `Advance Tax %`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: (data1?.adv_tax_percentage ?? 0).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsOriginalPo.push([
		{
			content: `Advance Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: (data1?.adv_tax ?? 0).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsOriginalPo.push([
		{
			content: `Total After Advance Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: (
				(parseFloat(data1?.total_after_gst) || 0) + (parseFloat(data1?.adv_tax) || 0)
			).toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);

	//  Original PO End

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'ITEM',
		'Batch',
		'Pack Size',
		'Ret QTY',
		'Return Price',
		'Total',
	];
	const tableRows = [];

	let count = 0;
	let count2 = 0;
	data1.Salehistory.forEach((item) => {
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
				content: `Inv No: ${item.ret_invoice_no}  Return Date: ${
					moment(item.return_date).format('DD/MM/YYYY') || ''
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
				colSpan: 4,
				rowSpan: 1,
				styles: {
					halign: 'left',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);

		console.log(1111);
		count2 = 0;
		let totalReturned = 0;
		totalHistorySummaryTotalAfterDiscount += item.total_after_discount;
		totalHistorySummaryTaxInFigure += item.gst;
		totalHistorySummaryTotalAfterTax += item.total_after_gst;

		totalHistorySummaryAdvanceTaxInFigure += item.adv_tax;
		totalHistorySummaryTotalAfterAdvanceTax += item.adv_tax + item.total_after_gst;

		item.invoice_child.forEach((item3) => {
			count2 += 1;
			totalReturned += item3.quantity * item3.rate;
			totalHistorySummarytotalReturned += item3.quantity * item3.rate;
			totalHistorySummarydiscount += item3.discount;

			const itemsData = [
				`    ${count2}`,
				item3.item?.name,
				item3.batch_no,
				item3.pack,
				item3.quantity.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) || 0,
				item3.rate.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) || '',
				(item3.quantity * item3.rate).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				}) ?? 0,
			];
			tableRows.push(itemsData);
		});
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Total`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${
					totalReturned.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Deduction`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${
					item.discount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Total After Deduction`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${
					item.total_after_discount.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0
				}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Tax (${item.gst_percentage ?? 0})%`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${item.gst}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Total After Tax `,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${item.total_after_gst ?? 0}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);

		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Advance Tax (${item.adv_tax_percentage ?? 0})%`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${item.adv_tax}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 5,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					// fillColor: [225, 225, 225],
				},
			},
			{
				content: `Total After Advance Tax `,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
			{
				content: `${(
					(parseFloat(item?.total_after_gst) || 0) +
					(parseFloat(item?.adv_tax) || 0)
				).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [225, 225, 225],
				},
			},
		]);
	});

	// totalRowsHistorySummary Starts
	totalRowsHistorySummary.push([
		{
			content: `Total`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: `${totalHistorySummarytotalReturned ?? 0}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsHistorySummary.push([
		{
			content: `Deduction`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: totalHistorySummarydiscount ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsHistorySummary.push([
		{
			content: `Total After Deduction`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: totalHistorySummaryTotalAfterDiscount ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);
	totalRowsHistorySummary.push([
		{
			content: `Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: totalHistorySummaryTaxInFigure ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsHistorySummary.push([
		{
			content: `Total After Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: totalHistorySummaryTotalAfterTax ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);

	totalRowsHistorySummary.push([
		{
			content: `Advance Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: totalHistorySummaryAdvanceTaxInFigure ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	totalRowsHistorySummary.push([
		{
			content: `Total After Advance Tax`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: totalHistorySummaryTotalAfterAdvanceTax ?? 0,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	// totalRowsHistorySummary Ends

	let yPos = 60;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');
	doc.text('Return Sale History', pageWidth / 2, 55, { align: 'center' });

	doc.setFontSize(12);
	doc.setFont(undefined, 'bold');
	doc.text(`Invoice No: ${data1.invoice_no}`, 40, 70, { align: 'left' });
	doc.text(
		`${
			data1.sale_type === 2
				? `Registered Customer ${data1.customer.name}`
				: `Walk-in Customer ${data1.walk_in_customer_name}`
		}`,

		40,
		85,
		{
			align: 'left',
		},
	);
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	doc.text(
		`Date: ${data1.date ? moment(data1.date).format('DD/MM/YYYY') : ''}`,
		pageWidth - 40,
		70,
		{ align: 'right' },
	);

	yPos += 30;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(12);
	// Original PO Starts
	doc.text(`Original Invoice`, pageWidth / 2, yPos, { align: 'center' });
	yPos += 5;

	doc.autoTable(tableColumnsOriginalPo, tableRowsOriginalPo, {
		startY: yPos,
		headStyles: {
			fillColor: [217, 217, 214],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		bodyStyles: {
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
	});
	yPos = doc.lastAutoTable.finalY + 1;
	doc.autoTable(['', ''], totalRowsOriginalPo, {
		startY: yPos,
		// theme: 'grid',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		bodyStyles: {
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
		styles: {
			halign: 'right',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		margin: {
			left: pageWidth - 340,
		},
		columnStyles: {
			0: { cellWidth: 150 },
			1: { cellWidth: 150 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 1;
	// Original PO Ends

	yPos += 15;
	doc.text(`Returned History`, pageWidth / 2, yPos, { align: 'center' });
	yPos += 5;
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
	yPos = doc.lastAutoTable.finalY + 1;
	doc.autoTable(['Returned ', 'Summary'], totalRowsHistorySummary, {
		startY: yPos,
		// theme: 'grid',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		bodyStyles: {
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
		styles: {
			halign: 'right',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		margin: {
			left: pageWidth - 340,
		},
		columnStyles: {
			0: { cellWidth: 150, halign: 'right' },
			1: { cellWidth: 150, halign: 'left' },
		},
	});

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
		doc.save(`Returned PO History${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF2;
