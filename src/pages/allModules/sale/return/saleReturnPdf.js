// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import signature from '../../../../assets/signature/signature.png';
import Logo from '../../../../components/logo/logo.png';
// import pakLogo from '../../../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a saleReturnPdf function that accepts a tickets argument
const saleReturnPdf = (data1, type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let totalAmount = 0;

	const rowsMain = [];
	const columnsMain = [' '];
	rowsMain.push(['Bill To']);

	rowsMain.push([
		`${data1.invoice.sale_type === 2
			? data1.invoice.customer.name
			: data1.invoice.walk_in_customer_name
		}
${data1.invoice.sale_type === 2 ? '' : data1.invoice.walk_in_customer_phone}
${data1.invoice.sale_type === 1 ? '' : data1.invoice.customer.ntn}
${data1.invoice.sale_type === 1 ? '' : data1.invoice.customer.dsl}`,
	]);

	const rowsMain2 = [];
	const columnsMain2 = [' ', ' '];
	rowsMain2.push(['Invoice #', data1.invoice.invoice_no]);
	rowsMain2.push(['Date:', data1.invoice.date]);
	rowsMain2.push([
		'Po No',
		data1.invoice.posale === null && data1.invoice.quotation === null
			? ''
			: data1.invoice.posale === null
				? data1.invoice.quotation.quotation_no
				: data1.invoice.po_id,
	]);

	rowsMain2.push(['Order Date', data1.invoice.date]);
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
		'Item',
		'Batch No',
		'Expiry Date',
		'Qty',
		'Rate',

		'Sales Tax',
		'Amount',
	];

	const tableRowsIncome = [];

	let count = 0;

	data1.invoice_child.forEach((data) => {
		count += 1;
		totalAmount += Number(data.total_amount);

		const TableData = [
			// count,

			// `${data.item.name} ${data.item.strength}`,
			`${data.item.name} ${data.item.strength ?? ''} ${data.item.strengthunit?.name ?? ''}  `,

			data.manufacturer.batch_no,
			moment(data.manufacturer.expiry_date).format('DD-MM-YYYY'),
			data.quantity,
			data.rate,

			data.sales_tax,
			data.total_amount,
		];

		tableRowsIncome.push(TableData);
	});
	tableRowsIncome.push([
		{
			content: `Total`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 15 },
		},
		{
			content: `${totalAmount}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
		},
	]);
	if (data1.gst_percentage !== 0) {
		tableRowsIncome.push([
			{
				content: `GST: ${data1.gst_percentage.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})} %`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}
	if (data1.gst_percentage !== 0) {
		tableRowsIncome.push([
			{
				content: `Total After GST`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.total_after_gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}

	if (data1.adv_tax_percentage !== (0 || null)) {
		tableRowsIncome.push([
			{
				content: `Advance Tax: ${data1?.adv_tax_percentage
						? data1.adv_tax_percentage.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})
						: '0'
					}%`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1?.adv_tax
						? data1.adv_tax.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})
						: '0'
					}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}

	if (data1.adv_tax_percentage !== (0 || null)) {
		const totalAfterAdvTax = Number(data1.total_after_gst) + Number(data1.adv_tax);

		tableRowsIncome.push([
			{
				content: `Total After Advance Tax`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				//   content: `${data1.parentData?.total_after_adv_tax ? data1.parentData.total_after_adv_tax.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}`,
				content: totalAfterAdvTax,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}

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
	doc.addImage(Logo, 'JPEG', 15, 8, 45, 45);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 74, 26, { align: 'left' });
	doc.setFontSize(10);
	// Add Ksol heading in the top of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });
	doc.setFont(undefined, 'normal');
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
	doc.text('Drug Sale License No.01-374-0177-110744D', 74, 110, { align: 'left' });
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
	doc.text('Sale Invoice', pageWidth / 2, 140, { align: 'center' });
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
			0: { cellWidth: 80, halign: 'left' },
			1: { cellWidth: 100, halign: 'left' },
		},
		margin: {
			// left: pageWidth / 2,
			left: pageWidth - 220,
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

export default saleReturnPdf;
