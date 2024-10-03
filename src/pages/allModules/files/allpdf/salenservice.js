// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logos from '../../../../assets/logos/logo1.png';
// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF5 = (type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');

	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// let totalAmount = 0;
	// let totalExpense = 0;
	// define the columns we want and their titles

	const tableColumns = [
		'S.No.',
		'Product',
		'Nomen',
		'Price',
		'Quantity',

		// 'Amount Received',
	];
	const tableRows = [];

	// data1.forEach((item, index) => {
	// totalAmount += item.season_income?.income ?? 0;
	// totalExpense += item.season_expense?.expense ?? 0;

	// eslint-disable-next-line no-unsafe-optional-chaining

	// const itemsData = [
	// index + 1,
	// item.name,
	// item.start_date ? moment(item.start_date).format('DD-MM-YYYY') : 'None',
	// item.end_date ? moment(item.end_date).format('DD-MM-YYYY') : 'None',
	// item.type?.name,
	// item.crop?.name,
	// item.season_income?.income ?? 0,
	// item.season_expense?.expense ?? 0,
	// 	];

	// 	tableRows.push(itemsData);
	// });

	tableRows.push([
		// {
		// 	content: `Total`,
		// 	colSpan: 6,
		// 	rowSpan: 1,
		// 	styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
		// },
		// {
		// 	content: `${totalAmount}`,
		// 	colSpan: 1,
		// 	rowSpan: 1,
		// 	styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		// },
		// {
		// 	content: `${totalExpense}`,
		// 	colSpan: 1,
		// 	rowSpan: 1,
		// 	styles: { halign: 'left', fontStyle: 'bold', fontSize: 10 },
		// },
	]);

	// doc.autoTable(tableColumns, tableRows, {
	// 	startY: yPos,
	// 	theme: 'grid',
	// 	columnStyles: { 4: { fillColor: '#f2f2f2' } },
	// 	styles: { fontSize: 8, theme: 'grid' },
	// 	headStyles: { fillColor: '#019B53' },
	// });

	// let count = 0;
	// let count2 = 0;

	// data1.forEach((data) => {
	// 	count += 1;

	// 	tableRowsPayments.push([
	// 		{
	// 			content: `${count}`,
	// 			colSpan: 1,
	// 			rowSpan: 1,
	// 			styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
	// 		},
	// 		{
	// 			content: `Transfer: ${data.registry_no}`,
	// 			colSpan: 3,
	// 			rowSpan: 1,
	// 			styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
	// 		},

	// 	]);
	// 	count2 = 0;
	// 	data.files.forEach((data2) => {
	// 		count2 += 1;
	// 		data2.purchasers.forEach((d) => {
	// 			purchasers = `${purchasers}${d.id}-${d.purchaser_name},\n`;
	// 		});
	// 		data2.sellers.forEach((d) => {
	// 			owners = `${owners}${d.id}-${d.seller_name},\n`;
	// 		});

	// 		// totalLand += (data2.totalLand);
	// 		const TableData = [
	// 			count2,

	// 			data2.mouza_name,
	// 			data2.file_no,
	// 			data2.file_name,
	// 			purchasers,
	// 			// owners,
	// 			// `${data2.totalLand.kanal}-${data2.totalLand.marla}-${data2.totalLand.sarsai}-${data2.totalLand.feet}`,
	// 			// moment(data.lands.purchase_date).format('DD-MM-YYYY'),
	// 		];
	// 		// owners = '';
	// 		purchasers = '';
	// 		tableRowsPayments.push(TableData);
	// 	});
	// });

	// tableRowsPayments.push([
	// 	{
	// 		content: `Total`,
	// 		colSpan: 6,
	// 		rowSpan: 1,
	// 		styles: { halign: 'center', fontStyle: 'bold', fontSize: 10 },
	// 	},

	// ]);

	// startY is basically margin-top

	let yPos = 100;
	doc.addImage(logos, 'JPEG', pageWidth - 590, yPos - 100, 60, 60);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 74, 26, { align: 'left' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'normal');
	doc.text('DETAILS IN:SALES & SERVICES OF ELECTRO MEDICAL EQUIPMEMT,', 74, 50, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('SURGICAL DIPOSABLES.LABS CHEMICALS,GLASS WARE & GENERAL ORDER', 74, 65, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('SUPPLIERS', 74, 80, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('NTN# 0892285-3', 74, 95, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('TEL# 051-4417380-1', 74, 110, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('FAX# 051-4417380-1', 74, 123, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('REF. ____', 74, 136, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('ALI GOHAR & COMPANY', 74, 166, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('ISLAMABD', 74, 180, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sub:-', 74, 200, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Order', 105, 200, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('_____', 105, 200, { align: 'left' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'bold');
	doc.text(`Date Printed:`, pageWidth - 180, 160, {
		align: 'right',
	});
	doc.text(`____________________`, pageWidth - 60, 160, {
		align: 'right',
	});
	doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 60, 160, {
		align: 'right',
	});
	yPos += 90;
	yPos -= 20;

	yPos += 65;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		headStyles: {
			fillColor: [217, 217, 214],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		styles: { fontSize: 10 },
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});

	yPos = doc.lastAutoTable.finalY + 20;
	doc.setFont(undefined, 'bold');
	doc.text(`Thanking You.`, pageWidth - 490, yPos + 30, {
		align: 'right',
	});
	doc.setFont(undefined, 'bold');
	doc.text(`Syed Yousaf Raza Zaidi`, pageWidth - 440, yPos + 45, {
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
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

	// Footer
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

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF5;
