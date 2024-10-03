// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import signature from '../../../../assets/signature/signature.png';
// import logos from '../../../../assets/logos/logo1.png';
import Logo from '../../../../components/logo/logo.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF7 = (data1, type) => {
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
	rowsMain.push([data1.parentData.invoice_no]);
	rowsMain.push([``]);
	const tableColumns = ['S.No.', 'Description', 'Pack Size', 'Batch', 'Exp', 'Quantity'];
	const tableRows = [];

	data1.childData.forEach((data, index) => {
		// count += 1;
		// totalAmount += Number(data.income);

		const TableData = [
			// count,
			index + 1,
			`${data.item.name}-${data?.item.strength || ''}-${data.item.strengthunit?.name || ''}`,
			// data.item?.pack,
			'',
			data.manufacturer?.batch_no,

			moment(data.manufacturer.expiry_date).format('DD-MM-YYYY'),
			data.quantity,
		];

		tableRows.push(TableData);
	});

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

	
	let yPos = 80;
	doc.addImage(Logo, 'JPEG', 40, 30, 55, 50);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 95, 60, { align: 'left' });
	// Add Ksol heading in the top of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('House F-263 Satellite town, Rawalpindi', 90, 85, { align: 'left' });
	doc.setFontSize(10);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('National Tax No.B689409-0', 90, 100, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Voice No. 0551-4417380-1', 90, 115, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Customer Name', 60, 150, { align: 'left' });

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		data1.parentData.sale_type === 1 ? '' : data1.parentData.customer.ntn || '',
		210,
		120,
		{
			align: 'left',
		},
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		data1.parentData.sale_type === 1 ? '' : data1.parentData.customer.dsl || '',
		210,
		193,
		{
			align: 'left',
		},
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		data1.parentData.sale_type === 2
			? data1.parentData.customer.name
			: data1.parentData.walk_in_customer_name,
		160,
		150,
		{
			align: 'left',
		},
	);

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		data1.parentData.sale_type === 2
			? data1.parentData.customer.phone_no
			: data1.parentData.walk_in_customer_phone,
		160,
		163,
		{
			align: 'left',
		},
	);

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('_____________', 160, 150, { align: 'left' });
	doc.setFontSize(10);

	doc.setFont(undefined, 'bold');
	doc.text('________________', 160, 163, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	if (data1.parentData.sale_type === 1) {
		doc.text('________________', 160, 168, {
			align: 'left',
		});
	} else {
		doc.text('________________', 160, 180, {
			align: 'left',
		});
	}
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Delivery Challan No.', 330, 140, { align: 'left' });
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
			minCellHeight: 10,
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
	doc.text(`From 2 A(See Rules 19 & 30).`, 40, yPos + 30, {
		align: 'left',
	});
	doc.setFontSize(9);
	doc.setFont(undefined, 'bold');
	doc.text(`Warranty Under Section 23(1)(1) of the drugs act 1976`, 40, yPos + 45, {
		align: 'left',
	});
	// doc.setFontSize(10);
	// doc.setFont(undefined, 'normal');
	// doc.text(`We Zaidi Traders House F-263 Satellite town, Rawalpindi.`, 40, yPos + 65, {
	// 	align: 'left',
	// });

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	yPos += 60;
	doc.text(
		40,
		yPos,
		`We Zaidi Traders House F-263 Satellite town, Rawalpindi do hereby this warranty that the Drugs`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`and medicine describe on this invoice sold by us do not contravene in any way the`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(40, yPos, `provisions of section 23 of the Drugs Act 1976`);
	// Add space between the paragraphs
	yPos += 20;  // Increase this value to increase the space

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`Syed Masood Akhtar Zaidi being a person, resident in Pakistan carrying on business at House #263`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`F-Block Satellite Town Rawalpindi, under the name of Zaidi Traders holding valid license no.`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`ELI-00328 issued by DRAP hereby give this warranty that the medical devices here-under described as`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`sold by me and contained in the bill of sale invoice, bill of lading, or other document describing the`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`medical devices referred to herein do not contravene in any way the provisions of the DRAP Act 2012`,
	);
	yPos += 10;
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(
		40,
		yPos,
		`and the rules framed there under.`,
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`Terms and Conditions:`, pageWidth - 210, yPos + 75, {
		align: 'left',
	});

	doc.setFontSize(10);
	doc.text(``, 40, yPos + 85, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Syed Yousaf Raza Zaidi`, 40, yPos + 160, {
		align: 'left',
	});
	doc.addImage(signature, 'JPEG', pageWidth - 410, yPos + 82, 120, 80);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`________________________`, pageWidth - 410, yPos + 160, {
		align: 'left',
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
