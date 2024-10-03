// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import Logo from '../../../../components/logo/logo.png';
// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a purchasePdf function that accepts a tickets argument
const purchasePdf = (data1, type) => {
	console.log(data1);
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	let totalAmount = 0;

	//  Original PO Start
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
	const totalRows = [];
	const footerRows = [];

	data1.poChild.forEach((item, index) => {
		totalAmount += Number(item.total);

		// eslint-disable-next-line no-unsafe-optional-chaining

		const itemsData = [
			index + 1,
			`${item.item?.name} ${item.item.strength || ''}${item?.item?.strengthunit ? `-${item?.item?.strengthunit.name}` : ''}`,
			item.batch_no,
			`${item.pack} ${item.item?.unit?.name}`,

			item.quantity,
			item.rate,

			item.total,
		];

		tableRows.push(itemsData);
	});

	totalRows.push([
		{
			content: `Total`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
		{
			content: `${totalAmount}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
		},
	]);

	if (data1.purchaseOrder.discount > 0) {
		totalRows.push([
			{
				content: `Discount`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.discount,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);

		totalRows.push([
			{
				content: `Total After Discount`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.total_after_discount,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);
	}

	if (data1.purchaseOrder.tax > 0) {
		totalRows.push([
			{
				content: `Tax %`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.tax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);

		totalRows.push([
			{
				content: `Tax`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.tax_in_figure,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);

		totalRows.push([
			{
				content: `Total After Tax`,
				colSpan: 1,
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
	}

	if (data1.purchaseOrder.adv_tax > 0) {

		totalRows.push([
			{
				content: `Advance Tax %`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.adv_tax_percentage,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);
		totalRows.push([
			{
				content: `Advance Tax`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: data1.purchaseOrder.adv_tax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		]);


		const totalAfterAdvTax = parseFloat(data1.purchaseOrder.total_after_tax) + parseFloat(data1.purchaseOrder.adv_tax);

		totalRows.push([
			{
				content: `Total After Advance Tax`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
			{
				content: totalAfterAdvTax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
			},
		]);
	}



	footerRows.push([
		{
			content: `Thanks and Regards`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 11 },
		},
		{
			content: `Date Printed: ${moment().format('DD-MM-YYYY hh:mm:ss a')}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	footerRows.push([
		{
			content: `Syed Yousaf Raza Zaidi`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'left', fontStyle: 'bold', fontSize: 11 },
		},
	]);
	//  Original PO End

	let yPos = 100;
	doc.addImage(Logo, 'JPEG', 40, 30, 50, 50);
	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 100, 50, { align: 'left' });

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('E-mail.info@zaiditraders.com', 100, 70, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('National Tax No.B689409-0', 100, 80, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sales Tax Reg.No.3277876322952', 100, 90, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Drug Sale License No.01-374-0177-110744D', 100, 100, { align: 'left' });
	// Add GRN heading in the center of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(16);
	doc.text('Goods Recieving Note', pageWidth / 2, 30, { align: 'center' });
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	// Add Ksol heading in the top of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	// doc.text('NTN # 0892285-3', pageWidth - 40, 40, { align: 'right' });
	doc.text('DEALS IN: SALES & SERVICES OF ELECTROMEDICAL EQUIPMENT', 100, 120, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('SURGICAL DISPOSABLES.LABS CHEMICALS,GLASS WARE & GENERAL ORDER SUPPLIERS', 100, 135, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('House F-263 Satellite town, Rawalpindi', 100, 150, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');


	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	const requestDate = moment(data1.purchaseOrder.request_date).format('DD/MM/YYYY');
	const recieveDate = moment(data1.purchaseOrder.receive_date).format('DD/MM/YYYY');
	const dateRows = [
		[
			{
				content: `Request Date`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: requestDate,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		],
		[
			{
				content: `Recieve Date`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: recieveDate,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		],
		[
			{
				content: `Invoice No`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
			{
				content: `${data1.purchaseOrder.invoice_no}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'normal', fontSize: 11 },
			},
		],
	];
	
	// Render the date table above the invoice number
	yPos = 185; // Adjust based on your layout
	doc.autoTable(['', ''], dateRows, {
		startY: yPos,
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
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		margin: {
			left: pageWidth - 250,
		},
		columnStyles: {
			0: { cellWidth: 100 },
			1: { cellWidth: 100 },
		},
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`Phone# 051-4417380-1`, pageWidth - 40, 46, {
		align: 'right',
	});
	doc.text(`Cell# 0321-5560504`, pageWidth - 40, 56, {
		align: 'right',
	});
	doc.text(`      0321-5374265`, pageWidth - 40, 66, {
		align: 'right',
	});
	// doc.text(`Fax# 051-4850007`, pageWidth - 40, 66, {
	// 	align: 'right',
	// });

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		`${data1.purchaseOrder.po_type === 3 ? '' : data1.purchaseOrder.supplier.address}`,
		100,
		170,
		{ align: 'left' },
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Sub:-', 40, 170, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(
		`${data1.purchaseOrder.po_type === 3
			? data1.purchaseOrder.name
			: data1.purchaseOrder.supplier.name
		}`,
		100,
		170,
		{ align: 'left' },
	);
	// doc.text(data1.purchaseOrder.remarks ? data1.purchaseOrder.remarks : '', 74, 170, {
	// 	align: 'left',
	// });

	doc.setFontSize(10);

	// Display DSL if it exists
	if (data1.purchaseOrder.supplier?.dsl) {
		doc.setFont(undefined, 'normal');
		doc.text('DSL:-', 40, 180, { align: 'left' });
		doc.text(data1.purchaseOrder.supplier.dsl, 100, 180, {
			align: 'left',
		});
	}

	// Display GST if it exists
	if (data1.purchaseOrder.supplier?.gst) {
		doc.setFont(undefined, 'normal');
		doc.text('GST:-', 40, 190, { align: 'left' });
		doc.text(data1.purchaseOrder.supplier.gst, 100, 190, {
			align: 'left',
		});
	}

	// Display NTN if it exists
	if (data1.purchaseOrder.supplier?.ntn) {
		doc.setFont(undefined, 'normal');
		doc.text('NTN:-', 40, 200, { align: 'left' });
		doc.text(data1.purchaseOrder.supplier.ntn, 100, 200, {
			align: 'left',
		});
	}

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text('Remarks:-', 40, 220, { align: 'left' });
	doc.text(data1.purchaseOrder.remarks ? data1.purchaseOrder.remarks : '', 100, 220, {
		align: 'left',
	});

	// yPos -= 20;
	yPos += 120;
	doc.autoTable(tableColumns, tableRows, {
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
	doc.autoTable(['', ''], totalRows, {
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
	doc.autoTable(['', ''], footerRows, {
		startY: yPos,
		theme: 'grid',
		headStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
			lineWidth: 0,
		},
		styles: {
			halign: 'right',
			// fontStyle: 'bold',
			fontSize: 12,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},

		columnStyles: {
			1: { cellWidth: 250 },
		},
	});
	yPos = doc.lastAutoTable.finalY;
	console.log('yPos', yPos);

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
			doc.internal.pageSize.width - 40,
			doc.internal.pageSize.height - 30,
			{
				align: 'right',
			},
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

export default purchasePdf;
