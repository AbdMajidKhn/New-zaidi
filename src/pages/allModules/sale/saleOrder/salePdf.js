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
// import logos from '../../../../assets/logos/logo1.png';
import Logo from '../../../../components/logo/logo.png';
// import pakLogo from '../../../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a salePdf function that accepts a tickets argument
const salePdf = (data1, type) => {
	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	let totalAmount = 0;

	const rowsMain = [];
	const columnsMain = ['', ''];
	rowsMain.push(['Bill To']);

	rowsMain.push([
		'Name',
		`${data1.parentData.sale_type === 2
			? data1.parentData.customer.name
			: data1.parentData.walk_in_customer_name
		}`,
	]);
	rowsMain.push([
		'Contact',
		`${data1.parentData.sale_type === 2
			? data1.parentData.customer.phone_no === '03000000000'
				? '-'
				: data1.parentData.customer.phone_no
			: data1.parentData.walk_in_customer_phone === '03000000000'
				? '-'
				: data1.parentData.walk_in_customer_phone || '-'
		}`,
	]);

	if (data1.parentData.sale_type === 2) {
		if (data1.parentData.customer.cnic) {
			rowsMain.push(['CNIC', data1.parentData.customer.cnic]);
		}
		if (data1.parentData.customer?.address) {
			rowsMain.push(['Address', data1.parentData.customer.address]);
		}
	} else if (data1.parentData.sale_type === 1) {
		if (data1.parentData.customer?.ntn) {
			rowsMain.push(['NTN', data1.parentData.customer.ntn]);
		}
		if (data1.parentData.customer?.dsl) {
			rowsMain.push(['GST', data1.parentData.customer.dsl]);
		}
	}

	const rowsMain2 = [];
	const columnsMain2 = [' ', ' '];
	rowsMain2.push(['Invoice #', data1.parentData.invoice_no]);
	rowsMain2.push(['Date:', data1.parentData.date]);
	rowsMain2.push([
		'Po No',
		data1.parentData.pono
	]);

	rowsMain2.push(['Order Date', data1.parentData.date]);

	const tableColumnIncome = [
		'Item',
		'S-No',
		'Batch No',
		'Expiry Date',
		'Qty',
		'Rate',
		'Discount',
		'Amount',
	];

	const tableRowsIncome = [];

	let count = 0;

	data1.childData.forEach((data) => {
		count += 1;
		totalAmount += Number(data.total_amount);

		const TableData = [
			// count,

			`${data.item.name} ${data.item.strength ?? ''} ${data.item.strengthunit?.name ?? ''}  `,
			data.sNo,

			data.manufacturer.batch_no,
			moment(data.manufacturer.expiry_date).format('DD-MM-YYYY'),
			data.quantity.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data?.rate?.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),

			data?.discount?.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
			data?.total_amount?.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			}),
		];

		tableRowsIncome.push(TableData);
	});
	tableRowsIncome.push([
		{
			content: `Total`,
			colSpan: 6,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
		},
		{
			content: `${data1.parentData.total_amount.toLocaleString(undefined, {
				maximumFractionDigits: 2,
			})}`,
			colSpan: 1,
			rowSpan: 1,
			styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
		},
	]);
	if (data1.parentData.discount !== 0) {
		tableRowsIncome.push([
			{
				content: `Discount`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.parentData.discount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}
	if (data1.parentData.discount !== 0) {
		tableRowsIncome.push([
			{
				content: `Total After Discount`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.parentData.total_after_discount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}
	if (data1.parentData.gst_percentage !== 0) {
		tableRowsIncome.push([
			{
				content: `GST: ${data1.parentData.gst_percentage.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})} %`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.parentData.gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}
	if (data1.parentData.gst_percentage !== 0) {
		tableRowsIncome.push([
			{
				content: `Total After GST`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.parentData.total_after_gst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 1,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
		]);
	}

	if (data1.parentData.adv_tax_percentage !== (0 || null)) {
		tableRowsIncome.push([
			{
				content: `Advance Tax: ${data1.parentData?.adv_tax_percentage
						? data1.parentData.adv_tax_percentage.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})
						: '0'
					}%`,
				colSpan: 6,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 12 },
			},
			{
				content: `${data1.parentData?.adv_tax
						? data1.parentData.adv_tax.toLocaleString(undefined, {
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

	const totalAfterAdvTax =
		Number(data1.parentData.total_after_gst) + Number(data1.parentData.adv_tax);

	if (data1.parentData.adv_tax_percentage !== (0 || null)) {
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

	let yPos = 100;
	doc.addImage(Logo, 'JPEG', 40, 30, 55, 50);
	doc.setFontSize(20);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', 95, 40, { align: 'left' });
	doc.setFontSize(10);
	// Add Ksol heading in the top of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('House F-263 Satellite town, Rawalpindi', 95, 60, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('E-mail.info@zaiditraders.com', 95, 70, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('National Tax No. B689409-0', 95, 80, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sales Tax Reg.No.3277876322952', 95, 90, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Drug Sale License No.01-374-0177-110744D', 95, 100, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`Phone# 051-4417380-1`, pageWidth - 40, 36, {
		align: 'right',
	});
	doc.text(`Cell# 0321-5560504`, pageWidth - 40, 46, {
		align: 'right',
	});
	doc.text(`      0321-5374265`, pageWidth - 40, 56, {
		align: 'right',
	});
	// doc.text(`Fax# 051-4850007`, pageWidth - 40, 66, {
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
			lineWidth: 0,
		},
		styles: {
			halign: 'left',
			// fontStyle: 'bold',
			fontSize: 10,
			lineWidth: 0,
			lineColor: [0, 0, 0],
		},
		columnStyles: {
			0: { cellWidth: 60 },
			1: { cellWidth: 120 },
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
			0: { cellWidth: 90, halign: 'left' },
			1: { cellWidth: 90, halign: 'left' },
		},
		margin: {
			// left: pageWidth / 2,
			left: pageWidth - 220, // Adjust this value as needed

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
		styles: {
			lineWidth: 1,
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

	function addNextPageContent() {
		doc.addPage();
		yPos = 50;
		doc.setFont(undefined, 'normal');
		doc.text(40, yPos, `From  2A (See Rules 19 & 30)`);
		yPos += 13;
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		doc.text(40, yPos, `Warrenty Under section 23 (1) (1) of the Drugs Act 1976`);
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		yPos += 10;
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
		doc.setFontSize(10);
		doc.setFontSize(10);
		doc.setFontSize(10);

		// Add space between the paragraphs
		yPos += 30;  // Increase this value to increase the space

		doc.setFont(undefined, 'normal');
		yPos += 10;
		doc.text(
			40,
			yPos,
			`Syed Masood Akhtar Zaidi being a person, resident in Pakistan carrying on business at House #263`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`F-Block Satellite Town Rawalpindi, under the name of Zaidi Traders holding valid license no.`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`ELI-00328 issued by DRAP hereby give this warranty that the medical devices here-under described as`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`sold by me and contained in the bill of sale invoice, bill of lading, or other document describing the`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`medical devices referred to herein do not contravene in any way the provisions of the DRAP Act 2012`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`and the rules framed there under.`,
		);
		yPos += 100; // Adjust for the new passage placement
		doc.setFont(undefined, 'normal');
		doc.text(
			40,
			yPos,
			`Cold chain products will not be returned or exchanged. Similarly, no return or`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`replacement will be allowed for products expired subsequent to sales.`,
		);
		yPos += 83;
		doc.setFont(undefined, 'bold');
		doc.text(40, yPos, `Syed Yousaf Raza Zaidi`);
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		doc.text(155, yPos, `___________________`);

		doc.addImage(signature, 'JPEG', pageWidth - 440, yPos - 60, 90, 60);
	}

	if (yPos + 190 > pageHeight) {
		addNextPageContent();
	} else {
		yPos += 50;
		doc.setFont(undefined, 'normal');
		doc.text(40, yPos, `From  2A (See Rules 19 & 30)`);
		yPos += 13;
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		doc.text(40, yPos, `Warrenty Under section 23 (1) (1) of the Drugs Act 1976`);
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		yPos += 10;
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
		doc.setFontSize(10);
		doc.setFontSize(10);
		doc.setFontSize(10);

		// Add space between the paragraphs
		yPos += 30;  // Increase this value to increase the space

		doc.setFont(undefined, 'normal');
		yPos += 10;
		doc.text(
			40,
			yPos,
			`I, Syed Masood Akhtar Zaidi being a person, resident in Pakistan carrying on business at House #263`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`F-Block Satellite Town Rawalpindi, under the name of Zaidi Traders holding valid license no.`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`ELI-00328 issued by DRAP hereby give this warranty that the medical devices here-under described as`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`sold by me and contained in the bill of sale invoice, bill of lading, or other document describing the`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`medical devices referred to herein do not contravene in any way the provisions of the DRAP Act 2012`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`and the rules framed there under.`,
		);
		yPos += 30; // Adjust for the new passage placement
		doc.setFont(undefined, 'normal');
		doc.text(
			40,
			yPos,
			`Cold chain products will not be returned or exchanged. Similarly, no return or`,
		);
		yPos += 10;
		doc.text(
			40,
			yPos,
			`replacement will be allowed for products expired subsequent to sales.`,
		);
		yPos += 83;
		doc.setFont(undefined, 'bold');
		doc.text(40, yPos + 20, `Syed Yousaf Raza Zaidi`);
		doc.setFontSize(10);
		doc.setFont(undefined, 'normal');
		doc.text(175, yPos + 20, `___________________`);

		// doc.addImage(signature, 'JPEG', pageWidth - 425, yPos - 60, 90, 60);
		doc.addImage(signature, 'JPEG', pageWidth - 425, yPos - 60, 120, 80); // Increase width to 120 and height to 80
	}

	// doc.save('output.pdf');

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

export default salePdf;
