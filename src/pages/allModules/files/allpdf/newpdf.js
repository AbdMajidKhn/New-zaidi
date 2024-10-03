// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import signature from '../../../../assets/signature/signature.png';
import logos from '../../../../assets/logos/logo1.png';
// import pakLogo from '../../../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF4 = (type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// let totalAmount = 0;

	// let totalReceived = 0;
	// let openingBalance = 0;
	// // define the columns we want and their titles
	// const totalCredit = data1.loanReturnedOrReceived.reduce(
	// 	// eslint-disable-next-line no-return-assign
	// 	(a, v) => (a += parseFloat(v.credit)),
	// 	0,
	// );
	// const totalDebit = data1.loanReturnedOrReceived.reduce(
	// 	// eslint-disable-next-line no-return-assign
	// 	(a, v) => (a += parseFloat(v.debit)),
	// 	0,
	// );
	// const totalProfit = data1.profit.reduce(
	// 	// eslint-disable-next-line no-return-assign
	// 	(a, v) => (a += parseFloat(v.debit)),
	// 	0,
	// );

	const rowsMain = [];
	const columnsMain = [' '];
	rowsMain.push(['Bill To']);
	rowsMain.push([``]);
	const rowsMain2 = [];
	const columnsMain2 = [' ', ' '];
	rowsMain2.push(['Invoice #', ``]);
	rowsMain2.push(['Date:', ``]);
	rowsMain2.push(['Po No', ``]);
	rowsMain2.push(['Order Date', ``]);
	// rowsMain.push([
	// 	'Total Investment Amount:',
	// 	`${(totalCredit - totalDebit).toLocaleString(undefined, {
	// 		maximumFractionDigits: 2,
	// 	})}`,
	// 	'Profit Paid',
	// 	`${totalProfit.toLocaleString(undefined, {
	// 		maximumFractionDigits: 2,
	// 	})}`,
	// ]);

	const tableColumnIncome = [
		'Description & Packaging',
		'Batch No',
		'Expiry Date',
		'Qty',
		'Rate',
		'Sales Tax',
		'Amount',
	];

	const tableRowsIncome = [];

	// let count = 0;

	// data1.seasonIncome.forEach((data) => {
	// 	count += 1;
	// 	totalAmount += Number(data.income);

	// 	const TableData = [
	// 		count,

	// 		data.quantity,
	// 		data.unit,
	// 		moment(data.date).format('DD-MM-YYYY'),
	// 		data.income.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),

	// 		data.remarks,

	// 		// data.debit.toLocaleString(undefined, {
	// 		// 	maximumFractionDigits: 2,
	// 		// }),
	// 		// data.credit.toLocaleString(undefined, {
	// 		// 	maximumFractionDigits: 2,
	// 		// }),
	// 	];

	// 	tableRowsIncome.push(TableData);
	// });
	tableRowsIncome.push([
		{
			content: `Total`,
			colSpan: 5,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 15 },
		},
		{
			content: ``,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		},
	]);

	// // startY is basically margin-top

	// count = 0;
	// totalAmount = 0;
	// data1.profit.forEach((data) => {
	// 	count += 1;
	// 	totalAmount += Number(data.debit);
	// 	openingBalance = openingBalance + data.debit - data.credit;
	// 	const TableData = [
	// 		count,
	// 		data.voucher.voucher_no,
	// 		data.description,
	// 		moment(data.date).format('DD-MM-YYYY'),

	// 		data.debit.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		}),
	// 	];

	// 	tableRowsPaymen.push(TableData);
	// });

	// tableRowsPayments2.push([
	// 	{
	// 		content: `{data1.crop.name}`,
	// 		colSpan: 4,
	// 		rowSpan: 1,
	// 		styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
	// 	},

	// 	{
	// 		content: `${totalAmount.toLocaleString(undefined, {
	// 			maximumFractionDigits: 2,
	// 		})}`,
	// 		colSpan: 1,
	// 		rowSpan: 1,
	// 		styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
	// 	},

	let yPos = 80;
	doc.addImage(logos, 'JPEG', pageWidth - 590, yPos - 80, 60, 60);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 74, 26, { align: 'left' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'normal');
	doc.text('House F-263 Satellite town, Rawalpindi', 74, 50, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('E-mail.info@zaiditraders.com', 74, 65, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('National Tax No.B689409-0', 74, 80, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sales Tax Reg.No.3277876322952', 74, 95, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Drug Sale License No.01-374-0177-110744D ', 74, 110, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	// doc.text('Phone# 051-4417380-1', 7, 26, { align: 'right' });
	// doc.setFontSize(10);
	// doc.setFont(undefined, 'normal');
	doc.text(`Phone# 051-4417380-1`, pageWidth - 80, 36, {
		align: 'right',
	});
	doc.text(`Cell# 0321-5560504`, pageWidth - 80, 56, {
		align: 'right',
	});
	doc.text(`      0321-5374265`, pageWidth - 80, 66, {
		align: 'right',
	});
	// doc.text(`Fax# 051-4850007`, pageWidth - 80, 86, {
	// 	align: 'right',
	// });

	yPos += 70;
	doc.setFont(undefined, 'bold');
	doc.setFontSize(18);
	doc.text('Invoice', pageWidth / 2, 140, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.autoTable(columnsMain, rowsMain, {
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
		styles: {
			halign: 'left',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		columnStyles: {
			0: { cellWidth: 200 },
		},
		startY: yPos,
	});

	// seconttable

	doc.autoTable(columnsMain2, rowsMain2, {
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
		styles: {
			halign: 'left',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		columnStyles: {
			0: { cellWidth: 130, halign: 'left' },
			1: { cellWidth: 130, halign: 'left' },
		},
		margin: {
			left: pageWidth / 2,
		},
		startY: yPos,
	});
	yPos = doc.lastAutoTable.finalY + 40;

	doc.autoTable(tableColumnIncome, tableRowsIncome, {
		startY: yPos,
		headStyles: {
			fillColor: [217, 217, 214],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;
	doc.setFont(undefined, 'normal');
	doc.setFont(undefined, 'normal');

	doc.setFont(undefined, 'normal');
	doc.text(25, yPos + 50, `From  2A (See Rules 19 & 30)`);

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(25, yPos + 63, `Warrenty Under section 23 (1) (1) of the Drugs Act 1976`);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		25,
		yPos + 73,
		`We Zaidi Traders House F-263 Satellite town, Rawalpindi do hereby this warranty that the Drugs`,
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		25,
		yPos + 83,
		`and medicine describe on this invoice sold by us do not contravene in any way the`,
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(25, yPos + 93, `provisions of section 23 of the Drugs Act 1976`);
	doc.setFontSize(10);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(25, yPos + 170, `Syed Yousaf Raza Zaidi`);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(155, yPos + 170, `___________________`);
	doc.addImage(signature, 'JPEG', pageWidth - 440, yPos + 111, 90, 60);

	// Footer Starts
	doc.page = 1;

	doc.page += 1;
	// Footer Ends
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// PageNumbering
	const pageCount = doc.internal.getNumberOfPages();
	for (let i = 1; i <= pageCount; i += 1) {
		doc.setPage(i);
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

	if (type === 1) {
		doc.save(`Report_III${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF4;
