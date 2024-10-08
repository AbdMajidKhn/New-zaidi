// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import Cookies from 'js-cookie';
import { ToWords } from 'to-words';
import 'jspdf-autotable';
import moment from 'moment';
import logo from '../../../../../components/logo/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type) => {
	// initialize jsPDF
	const toWords = new ToWords({
		localeCode: 'en-US',
		converterOptions: {
			currency: true,
			ignoreDecimal: false,
			ignoreZeroCurrency: false,
			doNotAddOnly: false,
			currencyOptions: {
				// can be used to override defaults for the selected locale
				name: 'Rupee',
				plural: 'Rupees',
				symbol: 'PKR',
				fractionalUnit: {
					name: 'Paisa',
					plural: 'Paise',
					symbol: '',
				},
			},
		},
	});
	//* *********************** Fuctions */

	//* *********************** Fuctions */
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');

	// ****************** Top  Details
	// const rowsTopDetails = [];
	// const topDetails = [
	// 	{
	// 		content: `Paid To   `,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
	// 	},
	// 	// {
	// 	// 	content: `${data1.name} `,
	// 	// 	colSpan: 1,
	// 	// 	rowSpan: 1,
	// 	// 	styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
	// 	// },
	// 	// {
	// 	// 	content: `Date `,
	// 	// 	colSpan: 1,
	// 	// 	rowSpan: 1,
	// 	// 	styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
	// 	// },
	// 	{
	// 		content: `${data1.date} `,
	// 		colSpan: 2,
	// 		rowSpan: 1,
	// 		styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
	// 	},
	// ];
	// rowsTopDetails.push(topDetails);
	// ****************** Top Details Ends

	// ****************** Table Details Starts
	const rowsLand = [];
	const columnsLand = [
		'Account No',
		'Account Title/Transaction Narration',
		'Ref No &Dt',
		'Dr Amount',
		'Cr Amount',
	];

	data1.voucher_transactions.forEach((data) => {
		const dataLand = [
			`${data.coa_account.code}`,

			data.land !== null
				? `${data.coa_account.name} \n File: ${data.land?.file_no}-${data.land?.file_name}\n  ${data.land_payment_head?.name}\n   ${data.description}`
				: `${data.coa_account.name} \n ${data.description}`,
			``,
			data.debit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data.credit.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
		];
		rowsLand.push(dataLand);
	});

	const landTotal = [
		{
			content: `Total`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${data1.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})} `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
		{
			content: `${data1.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})} `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	rowsLand.push(landTotal);
	const landTotal2 = [
		{
			content: `Cheque date:`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		},
		{
			content: `${data1.cheque_no !== null ? data1.cheque_date : 'none'}`,
			colSpan: 3,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'normal', fontSize: 10 },
		},
	];

	// ****************** Land Details Ends
	// ****************** Get Land Details Starts
	let creditAccountName = '';
	data1.voucher_transactions.forEach((data) => {
		if (data.credit !== 0) {
			creditAccountName = `${data.coa_account.code}-${data.coa_account.name}`;
		}
	});
	// ****************** Cleared Land Details Ends
	// ****************** Summary   Details Starts
	const tableRowsSummary = [];
	const tableColumnSummary = ['Signatures'];
	const TableDataSummary = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Prepared by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary);
	const TableDataSummary2 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Verified by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary2);
	const TableDataSummary3 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Approved by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary3);
	const TableDataSummary4 = [
		{
			// content: `Total Land in marlas:   ${data1.form1.file_no}`,
			content: `Received by: `,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	];
	tableRowsSummary.push(TableDataSummary4);

	// ****************** Summary  Details Ends

	// 	// doc.addImage(rehbarLogo, 'JPEG', 25, 20, 80, 80);

	let yPos = 5;

	doc.setFont(undefined, 'normal');
	doc.text('Zaidi Traders', 240, 40);
	doc.setFontSize(12);
	doc.setFont(undefined, 'bold');

	// doc.text('Phone No: 051 512622', 230, 55);
	doc.text('Payments Voucher', 215, 55);

	doc.setFont(undefined, 'normal');

	// yPos += 20;
	// doc.text(`Received From:`, 45, yPos);
	// doc.text(`${data1.name}`, 135, yPos);
	// doc.text(`______________________________`, 135, yPos);
	doc.setFontSize(11);
	doc.text(`Voucher No.  `, 230, 70);
	doc.text(` ${data1.voucher_no}`, 300, 70);
	yPos += 35;
	doc.setFontSize(9);
	doc.text(`Status:`, 450, yPos);
	doc.text(data1.isApproved === 0 ? 'Pending' : 'Approved', 490, yPos);
	yPos += 20;
	doc.text(`Date:`, 450, yPos);
	doc.text(`${moment(data1.date).format('DD/MM/YYYY')}`, 490, yPos);
	yPos += 20;
	doc.text(`Print by:`, 450, yPos);
	doc.text(`${Cookies.get('name')}`, 490, yPos);
	yPos += 20;

	// doc.text(`Account (Cr): ${creditAccountName}`, 47, yPos);
	// yPos += 20;
	doc.setFontSize(12);

	// ****************** Main Details
	// doc.autoTable(['ddd', 'ddd', 'ddd'], rowsTopDetails, { startY: yPos, styles: { fontSize: 8 } });
	// yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Total Land', 47, yPos);
	// yPos += 10;
	// ****************** Land Details
	doc.autoTable(columnsLand, rowsLand, {
		theme: 'grid',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 1,
			lineColor: [0, 0, 0],
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 1,
			lineColor: [0, 0, 0],
		},
		startY: yPos,
		styles: { fontSize: 8 },
	});
	yPos = doc.lastAutoTable.finalY + 20;
	// doc.text('Cleared  Land', 47, yPos);
	// yPos += 10;
	// ****************** Cleared Land Details
	// ****************** Summary
	// doc.autoTable(tableColumnSummary, tableRowsSummary, {
	// 	startY: yPos,
	// 	styles: { fontSize: 8, height: 80 },
	// });
	// yPos = doc.lastAutoTable.finalY + 20;
	// ****************** Summary ends

	yPos -= 7;
	doc.text(`The sum of Amount: ${toWords.convert(data1.total_amount)} `, 45, yPos);
	doc.text(
		`____________________________________________________________________________`,
		45,
		yPos,
	);
	yPos += 50;

	doc.text(
		'______________             ______________             ______________                ______________',
		45,
		yPos,
	);
	yPos += 15;
	doc.text(
		`       Post by                         Check by                          Approved by                         Received by `,
		45,
		yPos,
	);
	yPos += 20;

	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(12);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	// doc.text('Payment Voucher', 47, 32);
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
	const pageSize = doc.internal.pageSize;
	const pageHeight = pageSize.getHeight();
	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Voucher_${data1.voucher_no}_${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF;
