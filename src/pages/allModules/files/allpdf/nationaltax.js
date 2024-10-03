// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import signature from '../../../../assets/signature/signature.png';
import logos from '../../../../assets/logos/logo1.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF7 = (type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// let totalAmount = 0;
	// let totalExpense = 0;
	// define the columns we want and their titles
	const rowsMain = [];
	const columnsMain = [' '];
	rowsMain.push(['5143']);
	rowsMain.push([``]);
	const tableColumns = [
		'S.No.',
		'Item Name',
		'Manufacturer',
		'Pack Size',
		'Retail Price',
		'Trade Price',
		'Quoted Price',
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
	doc.addImage(logos, 'JPEG', pageWidth - 450, yPos - 80, 60, 60);
	doc.setFontSize(25);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 63, { align: 'center' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'normal');
	doc.text('House F-263 Satellite town, Rawalpindi,', 240, 79, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('National Tax No. B689409-0', 240, 93, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Voice No. 0551-4417380-1', 240, 107, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Vendor Name', 47, 160, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('PAEC Hospital', 210, 150, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('_____________', 210, 150, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Chasma Mianwali', 210, 163, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('________________', 210, 163, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('________________', 210, 168, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Delivery Challan No.', 330, 160, { align: 'left' });
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
			cellPadding: 1,
			rowHeight: 10,
			halign: 'left',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		columnStyles: {
			0: { cellWidth: 130, halign: 'center', cellHeight: '10' },
			1: { cellWidth: 130, halign: 'center' },
		},
		margin: {
			left: pageWidth - 150,
		},
		startY: yPos + 30,
	});
	yPos = doc.lastAutoTable.finalY + 25;
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Date Printed:`, pageWidth - 150, 24, {
		align: 'right',
	});
	doc.text(`______________________`, pageWidth - 30, 24, {
		align: 'right',
	});
	doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 30, 24, {
		align: 'right',
	});

	yPos += 40;
	yPos -= 20;

	yPos += 15;
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
	doc.setFont(undefined, 'normal');
	doc.text(`From 2 A(See Rules 19 & 30).`, pageWidth - 440, yPos + 30, {
		align: 'right',
	});
	doc.setFontSize(9);
	doc.setFont(undefined, 'bold');
	doc.text(`Warranty Under Section 23(1)(1) of the drugs act 1976`, pageWidth - 350, yPos + 45, {
		align: 'right',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`We Zaidi Traders House F-263 Satellite town, Rawalpindi.`, pageWidth - 390, yPos + 65, {
		align: 'right',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		`do hereby this warranty that the drugs and medicine described on this invoice as sold`,
		pageWidth - 210,
		yPos + 75,
		{
			align: 'right',
		},
	);

	doc.setFontSize(10);
	doc.text(
		`by us do not contravene in any way the provisions of section 23 of drug act 1976.`,
		pageWidth - 226,
		yPos + 85,
		{
			align: 'right',
		},
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Syed Masoor Akhtar Zaidi`, pageWidth - 440, yPos + 140, {
		align: 'right',
	});
	doc.addImage(signature, 'JPEG', pageWidth - 410, yPos + 90, 90, 60);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`________________________`, pageWidth - 305, yPos + 140, {
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

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF7;
