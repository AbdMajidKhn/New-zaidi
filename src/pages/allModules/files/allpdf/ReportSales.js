import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import logos from '../../../../assets/logos/logo1.png';
// import Logo from '../../../../../assets/logos/logo.png';
// import pakLogo from '../../../../assets/images/logo/size-2.png';
// Date Fns is used to format the dates we receive
// from our API call
// import { format } from "date-fns"
// ** Store & Actions

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF3 = (data1, type, specificItem, startDate, endDate) => {
	// initialize jsPDF

	// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	// const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
	let grossProfit = 0;
	// define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Oem',
		'Item',
		'Brand',
		'Model',
		'Uom',
		'Type',
		'Qty',
		'Rate',
		'Amount',
		'Ret Qty',

		'Cost/Unit',

		'Profit',
	];
	const tableRows = [];
	let total = 0;
	let count = 0;
	let tAmount = 0;
	let tReturned = 0;
	let tTotal = 0;
	let tDiscount = 0;
	let tAfterDiscount = 0;
	let tGst = 0;
	let tAfterGst = 0;
	let tGrossProfit = 0;

	data1.forEach((item) => {
		// eslint-disable-next-line no-unsafe-optional-chaining
		// total += item?.total_after_discount ?? 0 + item.gst ?? 0;
		if (item.invoice_child && item.invoice_child.length > 0) {
			tableRows.push([
				{
					content: `Invoice No: ${item.invoice_no}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer:${
						item.sale_type === 1 ? item.walk_in_customer_name : item.customer.name
					}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Store: ${item.store.name}`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Date: ${moment(item.date).format('DD-MM-YYYY')}`,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: ``,
					colSpan: 2,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			grossProfit = 0;
			total = 0;
			count = 0;
			item.invoice_child.forEach((item2) => {
				count += 1;
				total += item2.price * item2.quantity;
				grossProfit +=
					item2.price * (item2.quantity - item2.returned_quantity) -
					item2.cost * (item2.quantity - item2.returned_quantity);

				const itemsData2 = [
					item2.returned_quantity > 0 ? `${count} *` : count,
					item2.item.machine_part_oem_part.oem_part_number.number1,
					item2.item.machine_part_oem_part.machine_part.name,
					item2.item.brand.name,
					item2.item.machine_part_oem_part.machine_partmodel.name,
					item2.item.machine_part_oem_part.machine_part.unit.name,

					item2.item.machine_part_oem_part.machine_part.type.name,

					item2.quantity?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,

					item2.price?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(item2.price * item2.quantity)?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					item2.returned_quantity?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					item2.cost?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
					(
						item2.price * (item2.quantity - item2.returned_quantity) -
						item2.cost * (item2.quantity - item2.returned_quantity)
					)?.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					}) ?? 0,
				];

				tableRows.push(itemsData2);
			});
			// Summary Calculation Start
			tReturned += total - item.total_amount;
			// Summary Calculation Ends
			// Summary Calculation Start
			tAmount += total;

			tTotal += item.total_amount;
			tDiscount += item.discount;
			tAfterDiscount += item.total_after_discount;
			tGst += item.gst;
			tAfterGst += item.total_after_gst;
			tGrossProfit += grossProfit;
			// Summary Calculation End
			if (!specificItem) {
				tableRows.push([
					{
						content: `Total:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},

					{
						content: `${total.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${grossProfit.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);

				if (total - item.total_amount !== 0) {
					tableRows.push([
						{
							content: `Returned Amount:`,
							colSpan: 6,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${(total - item.total_amount).toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 4,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
					tableRows.push([
						{
							content: `Total:`,
							colSpan: 6,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
						{
							content: `${item.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}`,
							colSpan: 4,
							rowSpan: 1,
							styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
						},
					]);
				}
				tableRows.push([
					{
						content: `Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: ``,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${(grossProfit - item.discount).toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 1,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total After Discount:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.total_after_discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `GST %:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${((item.gst / item.total_after_discount) * 100).toLocaleString(
							undefined,
							{
								maximumFractionDigits: 2,
							},
						)}`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `GST Amount:`,
						colSpan: 2,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${item.gst.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
				tableRows.push([
					{
						content: `Total after Tax:`,
						colSpan: 6,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
					{
						content: `${
							item.total_after_gst
								? item.total_after_gst.toLocaleString(undefined, {
										maximumFractionDigits: 2,
								  })
								: 0
						}`,
						colSpan: 4,
						rowSpan: 1,
						styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
					},
				]);
			}
		}
	});
	//  Summary
	if (!specificItem) {
		tableRows.push([
			{
				content: `Summary`,
				colSpan: 12,
				rowSpan: 1,
				styles: {
					halign: 'center',
					fontStyle: 'bold',
					fontSize: 12,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Sale:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAmount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Returned:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tReturned.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total *:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tTotal.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Discount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total After Discount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `GST Amount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Total Amount After GST:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tAfterGst.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `***Gross Profit***:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${tGrossProfit.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
		tableRows.push([
			{
				content: ``,
				colSpan: 4,
				rowSpan: 1,
				styles: { halign: 'right', fontStyle: 'bold', fontSize: 10 },
			},
			{
				content: `Gross Profit After Discount:`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
			{
				content: `${(tGrossProfit - tDiscount).toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})}`,
				colSpan: 3,
				rowSpan: 1,
				styles: {
					halign: 'right',
					fontStyle: 'bold',
					fontSize: 10,
					fillColor: [175, 175, 175],
				},
			},
		]);
	}
	//  Summary Ends
	let yPos = 100;

	// doc.addImage(Logo, 'JPEG', 720, 20, 110, 80);
	doc.addImage(logos, 'JPEG', pageWidth - 539, yPos - 100, 60, 60);
	yPos += 10;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.text('Sales Report', pageWidth / 2, 55, { align: 'center' });
	doc.text(
		`From ${startDate !== '' ? moment(startDate).format('MMMM D, YYYY') : 'Start'} To ${
			endDate !== '' ? moment(endDate).format('MMMM D, YYYY') : 'End'
		}`,
		pageWidth / 2,
		70,
		{ align: 'center' },
	);
	doc.text(`As on  ${moment().format('MMMM D, YYYY')}`, pageWidth / 2, 85, { align: 'center' });
	yPos += 15;
	doc.autoTable(tableColumns, tableRows, {
		startY: yPos,
		theme: 'grid',
		styles: { fontSize: 10, rowHeight: 10, cellPadding: 1 },
		bodyStyles: {
			fillColor: [255, 255, 255],
			textColor: [0, 0, 0],
		},
		headStyles: {
			fillColor: [225, 225, 225],
			textColor: [0, 0, 0],
			lineWidth: 1,
		},
		columnStyles: {
			0: { cellWidth: 40 },
		},
	});
	yPos = doc.lastAutoTable.finalY + 20;

	yPos = doc.lastAutoTable.finalY + 20;

	doc.setFontSize(12);

	doc.setFontSize(24);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');

	doc.setFontSize(10);
	doc.setFont('arial');
	doc.setFont(undefined, 'bold');
	// doc.text('ABC Near GT Road Rawalpindi', 47, 26);

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
		doc.save(`Report1${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};

export default GeneratePDF3;
