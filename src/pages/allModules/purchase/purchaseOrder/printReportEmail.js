// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import apiClient from '../../../../baseURL/api';

// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, setMailModalLoader, id) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	let totalAmount = 0;

	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',

		'Item Name',
		'Batch',
		'Pack Size',

		'Qty',
		'Rate',

		'Total',

		// 'Amount Received',
	];
	const tableRows = [];

	data1.poChild.forEach((item, index) => {
		totalAmount += Number(item.total);

		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item?.name} ${item.item.strength}`,
			item.batch_no,
			`${item.pack} ${item.item?.unit?.name}`,

			item.quantity,
			item.rate,

			item.total,
		];

		tableRows.push(itemsData);
	});

	tableRows.push([
		{
			content: `Total`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: `${totalAmount}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);

	tableRows.push([
		{
			content: `Discount`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: data1.purchaseOrder.discount,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	tableRows.push([
		{
			content: `Total After Discount`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: data1.purchaseOrder.total_after_discount,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	tableRows.push([
		{
			content: `Tax`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: data1.purchaseOrder.tax,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	tableRows.push([
		{
			content: `Total After Tax`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: data1.purchaseOrder.total_after_tax,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	// startY is basically margin-top

	let yPos = 100;

	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 74, 26, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('DEALS IN: SALES & SERVICES OF ELECTROMEDICAL EQUIPMENT', 74, 50, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('SURGICAL DISPOSABLES.LABS CHEMICALS,GLASS WARE & GENERAL ORDER SUPPLIERS', 74, 65, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('House F-263 Satellite town, Rawalpindi.Phone# 051-4417380-1 Fax# 0514850007', 74, 80, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Mr Asif', 74, 95, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Matrix Pharma', 74, 110, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Karachi', 74, 125, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Sub:-', 47, 150, { align: 'left' });
	doc.text(data1.purchaseOrder.remarks ? data1.purchaseOrder.remarks : '', 74, 150, {
		align: 'left',
	});
	yPos -= 20;

	yPos += 70;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		headStyles: {
			fillColor: [217, 217, 214],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
	});
	yPos = doc.lastAutoTable.finalY + 40;
	doc.text(`Thanks and Regards.`, pageWidth - 480, yPos, {
		align: 'right',
	});
	doc.text(`Syed Yousaf Raza Zaidi.`, pageWidth - 455, yPos + 20, {
    align: 'right',
	});
	doc.text(`Date Printed:`, pageWidth - 180, yPos, {
		align: 'right',
	});
	doc.text(`__________________`, pageWidth - 40, yPos, {
		align: 'right',
	});
	doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 40, yPos, {
		align: 'right',
	});
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
	// const date = Date().split(' ');
	// we use a date string to generate our filename.
	// const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
	// let str = `Page ${doc.internal.getNumberOfPages()}`;
	// // Total page number plugin only available in jspdf v1.0+
	// if (typeof doc.putTotalPages === 'function') {
	// 	str = `${str} of ${doc.internal.getNumberOfPages()}`;
	// }
	// PageNumbering
	const pageCount = doc.internal.getNumberOfPages();
	for (let i = 1; i <= pageCount; i += 1) {
		doc.setPage(i); // nevigate to existing pages
		doc.text(
			`Page   ${i} of  ${pageCount}`,
			doc.internal.pageSize.width - 80,
			doc.internal.pageSize.height - 10,
		);
	}
	doc.setFontSize(10);

	// jsPDF 1.4+ uses getWidth, <1.4 uses .width
	// eslint-disable-next-line prefer-destructuring
	// const pageSize = doc.internal.pageSize;

	// doc.text(str, 40, pageHeight - 15);

	const pdfUriForEmail = doc.output('datauristring');

	apiClient
		.post(`/sendPOMail?id=${id}`, {
			link: pdfUriForEmail,
			id,
		})
		.then((res) => {
			if (res.data.status === 'ok') {
				setMailModalLoader(false);
			}
			setMailModalLoader(false);
		})
		.catch(() => {
			setMailModalLoader(false);
		});
};

export default GeneratePDF;
