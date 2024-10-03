// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions
import Logo from '../../../../components/logo/logo.png';
// define a purchaseRetrunPDF function that accepts a tickets argument
const purchaseRetrunPDF = (data1, type) => {
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

		'Returned Qty',
		'Recieved Qty',
		'Rate',

		'Total',

		// 'Amount Received',
	];
	const tableRows = [];

	data1.pochild.forEach((item, index) => {
		totalAmount += Number(item.total);

		// eslint-disable-next-line no-irregular-whitespace
		const itemName = `${item.item?.name} ${item.item?.strengthunit?.name ?? ''}`;

		const itemsData = [
			index + 1,
			// item.item?.name,
			itemName,
			item.batch_no,

			item.returned_quantity,
			item.received_quantity,
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
	if (data1.discount !== 0) {
		tableRows.push([
			{
				content: `Discount`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.discount,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.discount !== 0) {
		tableRows.push([
			{
				content: `Total After Discount`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.total_after_discount,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.tax !== 0) {
		tableRows.push([
			{
				content: `Tax %`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.tax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.tax !== 0) {
		tableRows.push([
			{
				content: `Tax In Figure`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.tax_in_figure,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.tax !== 0) {
		tableRows.push([
			{
				content: `Total After Tax`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.total_after_tax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}

	if (data1.adv_tax_percentage !== null && data1.adv_tax_percentage !== 0) {
		tableRows.push([
			{
				content: `Advance Tax %`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.adv_tax_percentage,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.adv_tax_percentage !== null && data1.adv_tax_percentage !== 0) {
		tableRows.push([
			{
				content: `Advance Tax In Figure`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: data1.adv_tax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	if (data1.adv_tax_percentage !== null && data1.adv_tax_percentage !== 0) {
		tableRows.push([
			{
				content: `Total After Advance Tax`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: `${(
					(parseFloat(data1?.total_after_gst) || 0) + (parseFloat(data1?.adv_tax) || 0)
				).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}
	// startY is basically margin-top

	let yPos = 100;
	doc.addImage(Logo, 'JPEG', 15, 8, 45, 45);
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
	doc.text(
		'House F-263 Satellite town, Rawalpindi.Phone# 051-4417380-1 Fax# 0514850007',
		74,
		80,
		{
			align: 'left',
		},
	);
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
	doc.text(data1.purchaseorder.remarks ? data1.purchaseorder.remarks : '', 74, 150, {
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
	const date = Date().split(' ');
	// we use a date string to generate our filename.
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

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

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default purchaseRetrunPDF;
