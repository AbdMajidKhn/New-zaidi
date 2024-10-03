// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import moment from 'moment';
// import logos from '../../../../assets/logos/logo1.png';
import Logo from '../../../../components/logo/logo.png';
// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const quotationPdf = (data1, type) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('p', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

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

	data1.quotChild.forEach((item, index) => {
		const itemsData = [
			index + 1,
			item.item?.name,
			item.manufacture?.name,
			item.quantity,
			item.retail_price,
			item.trade_price,
			item.quoted_price,
		];

		tableRows.push(itemsData);
	});

	// startY is basically margin-top

	let yPos = 100;
	doc.addImage(Logo, 'JPEG', 50, 40, 55, 55);
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 43, { align: 'center' });
	doc.setFontSize(9);
	// Add Ksol heading in the top of the page
	doc.setFont(undefined, 'bold');
	doc.setFontSize(7);
	doc.text('Powered By Koncept Solutions', pageWidth / 2, 10, { align: 'center' });
	doc.setFont(undefined, 'normal');
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('DEALS IN:SALES & SERVICES OF ELECTRO MEDICAL EQUIPMEMT,', pageWidth / 2, 65, {
		align: 'center',
	});
	doc.setFont(undefined, 'normal');
	doc.text('SURGICAL DIPOSABLES.LABS KITS,CHEMICALS', pageWidth / 2, 76, {
		align: 'center',
	});
	doc.setFont(undefined, 'normal');
	doc.text('PHARMACEUTICALS INSTITUTIONAL SUPPLIERS', pageWidth / 2, 87, { align: 'center' });
	doc.setFont(undefined, 'bold');
	doc.text('MANUFACTURE`S REPRESENTATIVE', pageWidth / 2, 98, { align: 'center' });
	doc.setFont(undefined, 'bold');
	doc.text('REF.    ________________', 40, 130, { align: 'left' });
	doc.text(data1.quotation.ref_no || '', 70, 130, {
		align: 'left',
	});
	yPos = 156;

	doc.setFont(undefined, 'normal');
	doc.text('To,', 40, yPos, { align: 'left' });
	doc.setFont(undefined, 'bold');
	yPos += 10;

	doc.text(
		data1.quotation.sale_type === 2
			? data1.quotation.customer.name
			: data1.quotation.walk_in_customer_name,
		40,
		yPos,
		{
			align: 'left',
		},
	);
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	yPos += 15;

	doc.text(
		data1.quotation.sale_type === 2 ? data1.quotation.customer.address || '' : '',
		40,
		yPos,
		{ align: 'left' },
	);
	if (data1.quotation.sale_type === 2) {
		yPos += 15;
	}

	doc.setFontSize(10);
	doc.text(
		data1.quotation.sale_type === 2
			? data1.quotation.customer.phone_no || ''
			: data1.quotation.walk_in_customer_phone || '',
		40,
		yPos,
		{
			align: 'left',
		},
	);
	yPos += 20;

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('Sub:-', 40, yPos, { align: 'left' });
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(data1.quotation.remarks || '', 77, yPos, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text('________', 77, yPos, { align: 'left' });
	doc.setFontSize(10);
	yPos += 5;

	// doc.setFont(undefined, 'bold');
	// doc.text(`Date Printed:`, pageWidth - 180, 140, {
	// 	align: 'right',
	// });
	// doc.text(`______________________`, pageWidth - 60, 140, {
	// 	align: 'right',
	// });
	// doc.text(`${moment().format('DD-MM-YYYY hh:mm:ss a')}`, pageWidth - 60, 140, {
	// 	align: 'right',
	// });
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Tel:(051)-4417380`, pageWidth - 40, 35, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Fax:(051)-4850007`, pageWidth - 40, 45, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Mob:0321-5374265-6`, pageWidth - 40, 55, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`0321-5374265-6`, pageWidth - 40, 62, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Website:www.Zaidi_Traders.com`, pageWidth - 40, 72, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`info@Zaidi_Traders.com`, pageWidth - 40, 80, {
		align: 'right',
	});
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');
	doc.text(`Email:info@zaiditraders.com`, pageWidth - 40, 90, {
		align: 'right',
	});

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
		bodyStyles: {
			textColor: [0, 0, 0],
			lineWidth: 0.2,
		},
	});

	yPos = doc.lastAutoTable.finalY + 20;
	yPos += 30;

	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	doc.text(`Zaidi Traders.`, 40, yPos, {
		align: 'left',
	});
	doc.setFontSize(10);
	doc.setFont(undefined, 'bold');
	yPos += 20;

	doc.text(`Syed Yousaf Raza Zaidi`, 40, yPos, {
		align: 'left',
	});
	yPos += 20;
	doc.setFontSize(8);
	doc.setFont(undefined, 'normal');

	doc.text(`${data1.quotation.termcondition}`, 40, yPos, {
		align: 'left',
	});

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

	if (type === 1) {
		doc.save(`TransferReport${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default quotationPdf;
