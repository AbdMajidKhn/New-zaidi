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
const GeneratePDF6 = (type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	// let totalAmount = 0;
	// let totalExpense = 0;
	// define the columns we want and their titles

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
	doc.addImage(logos, 'JPEG', pageWidth - 410, yPos - 100, 60, 60);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 43, { align: 'center' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'normal');
	doc.text('Details In:SALES & SERVICES OF ELECTRO MEDICAL EQUIPMEMT,', 140, 59, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('SURGICAL DIPOSABLES.LABS KITS,CHEMICALS', 170, 73, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('PHARMACEUTICALS INSTITUTIONAL SUPPLIERS', 170, 87, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('MANUFACTURE`S REPRESENTATIVE', 195, 100, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('REF. ____', 47, 140, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('To,', 47, 166, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('GM Purchase', 47, 180, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('POF Hospital', 47, 190, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Wah Cantt.', 47, 200, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sub:-', 47, 235, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Quotation', 77, 235, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('________', 77, 235, { align: 'left' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'bold');
	doc.text(`Date Printed:`, pageWidth - 180, 140, {
		align: 'right',
	});
	doc.text(`______________________`, pageWidth - 60, 140, {
		align: 'right',
	});
	doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 60, 140, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Tel:(051)-4417380`, pageWidth - 15, 35, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Fax:(051)-4850007`, pageWidth - 15, 45, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Mob:0321-5374265-6`, pageWidth - 15, 55, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`0321-5374265-6`, pageWidth - 15, 62, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Website:www.Zaidi_Traders.com`, pageWidth - 15, 72, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`info@Zaidi_Traders.com`, pageWidth - 15, 80, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Email:info@zaiditraders.com`, pageWidth - 15, 90, {
		align: 'right',
	});
	yPos += 90;
	yPos -= 20;

	yPos += 95;
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
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Thanking You.`, pageWidth - 490, yPos + 30, {
		align: 'right',
	});
	doc.setFontSize(10);
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

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF6;
