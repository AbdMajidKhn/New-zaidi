// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
// list/tablePDF.js

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';

// import Logo from '../../../../../assets/logos/logo.png';

// define a GeneratePDF function that accepts a tickets argument
const GeneratePDF = (data1, type,selectedItem, startDate, endDate) => {
	// Filter the data based on the selected item
	if (selectedItem) {
		data1 = data1.filter(item => 
			item.invoice.some(invoice => 
				invoice.invoice_child.some(child => 
					child.item.id === selectedItem.id
				)
			)
		);
	}

	console.log(data1);
	// Initialize jsPDF
		// eslint-disable-next-line new-cap
	const doc = new jsPDF('l', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// Define the columns we want and their titles
	const tableColumns = [
		'S.No.',
		'Item',
		'Pack Size',
		'Qty',
		'Rate',
		'Amount',
		'Discount',
		'Total',
	];
	const tableRows = [];

	let count = 0;
	let count2 = 0;
	let count3 = 0;
	let totalSales = 0;
	let totalDiscount = 0;
	let totalAftDiscount = 0;
	let totalSalesAmount = 0;
	let totalDiscount2 = 0;
	let totalAfterDiscount = 0;
	let totalReturned = 0;
	let totalRet = 0;

	data1.forEach((item) => {
		if (
			(item.invoice &&
				item.invoice.length > 0 &&
				item.invoice[0]?.invoice_child?.length > 0) ||
			item.invoice_child
		) {
			count += 1;
			tableRows.push([
				{
					content: `${count}`,
					colSpan: 1,
					rowSpan: 1,
					styles: {
						halign: 'left',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
				{
					content: `Customer: ${
						item.sale_type === 1 ? item.walk_in_customer_name : item.name
					}`,
					colSpan: 9,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			let totalSalesBrand = 0;
			let totalDiscountBrand = 0;
			let totalDiscountBrand2 = 0;
			let totalRetBrand = 0;
	// eslint-disable-next-line no-unused-expressions
			item?.invoice &&
				item.invoice.forEach((item2) => {
					if (item2.invoice_child.length > 0) {
						count2 += 1;
						tableRows.push([
							{
								content: `${count2}`,
								colSpan: 1,
								rowSpan: 1,
								styles: {
									halign: 'center',
									fontStyle: 'bold',
									fontSize: 10,
									fillColor: [222, 222, 222],
								},
							},
							{
								content: `Invoice No: ${item2.invoice_no}`,
								colSpan: 1,
								rowSpan: 1,
								styles: {
									halign: 'left',
									fontStyle: 'bold',
									fontSize: 10,
									fillColor: [222, 222, 222],
								},
							},
							{
								content: `Date: ${item2.date}`,
								colSpan: 4,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
									fillColor: [222, 222, 222],
								},
							},
						]);
						let totalSalesPart = 0;
						let totalRetPart = 0;
						let totalAfterDis = 0;
						item2.invoice_child.forEach((item3) => {
							count3 += 1;
							totalSalesPart += item3.quantity * item3.rate;
							totalAfterDis = totalSalesPart - item3.discount;
							totalRetPart += item3.rate * item3.returned_quantity;

							const itemsData2 = [
								count3,
								item3.item.name,
								item3.item.pack,
								item3.quantity,
								item3.rate,
								item3.quantity * item3.rate,
								item3.discount,
								item3.quantity * item3.rate - item3.discount,
							];

							tableRows.push(itemsData2);
						});
						tableRows.push([
							{
								content: `Total Amount`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
							{
								content: `${totalSalesPart.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
						]);
						tableRows.push([
							{
								content: `Discount`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
							{
								content: `${item2.discount.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
						]);
						tableRows.push([
							{
								content: `Total After Discount`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
							{
								content: `${totalAfterDis.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
						]);
						tableRows.push([
							{
								content: `Total Returned`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
							{
								content: `${totalRetPart}`,
								colSpan: 6,
								rowSpan: 1,
								styles: {
									halign: 'right',
									fontStyle: 'bold',
									fontSize: 10,
								},
							},
						]);

						count3 = 0;
						totalSalesBrand += totalSalesPart;
						totalDiscountBrand += item2.discount;
						totalDiscountBrand2 += totalAfterDis;
						totalRetBrand += totalRetPart;
					}
				});

			if (item.invoice_child && item.invoice_child.length > 0) {
				let totalSalesPart = 0;
				let totalRetPart = 0;
				let totalAfterDis = 0;

				tableRows.push([
					{
						content: `${count2}`,
						colSpan: 1,
						rowSpan: 1,
						styles: {
							halign: 'center',
							fontStyle: 'bold',
							fontSize: 10,
							fillColor: [222, 222, 222],
						},
					},
					{
						content: `Invoice No: ${item.invoice_no}`,
						colSpan: 1,
						rowSpan: 1,
						styles: {
							halign: 'left',
							fontStyle: 'bold',
							fontSize: 10,
							fillColor: [222, 222, 222],
						},
					},
					{
						content: `Date: ${item.date}`,
						colSpan: 4,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
							fillColor: [222, 222, 222],
						},
					},
				]);

				item.invoice_child.forEach((item3) => {
					count3 += 1;
					totalSalesPart += item3.quantity * item3.rate;
					totalAfterDis = totalSalesPart - item3.discount;
					totalRetPart += item3.rate * item3.returned_quantity;

					const itemsData2 = [
						count3,
						item3.item.name,
						item3.item.pack,
						item3.quantity,
						item3.rate,
						item3.quantity * item3.rate,
						item3.discount,
						item3.quantity * item3.rate - item3.discount,
					];

					tableRows.push(itemsData2);
				});

				totalSalesAmount += totalSalesPart;
				totalDiscount2 += item.discount;
				totalAfterDiscount += totalAfterDis;
				totalReturned += totalRetPart;

				tableRows.push([
					{
						content: `Total Amount`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
					{
						content: `${totalSalesPart.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
				]);
				tableRows.push([
					{
						content: `Discount`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
					{
						content: `${item.discount.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
				]);
				tableRows.push([
					{
						content: `Total After Discount`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
					{
						content: `${totalAfterDis.toLocaleString(undefined, {
							maximumFractionDigits: 2,
						})}`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
				]);
				tableRows.push([
					{
						content: `Total Returned`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
					{
						content: `${totalRetPart}`,
						colSpan: 6,
						rowSpan: 1,
						styles: {
							halign: 'right',
							fontStyle: 'bold',
							fontSize: 10,
						},
					},
				]);
			}

			tableRows.push([
				{
					content: `Customer Summary: ${item.name || item.walk_in_customer_name}`,
					colSpan: 13,
					rowSpan: 1,
					styles: {
						halign: 'center',
						fontStyle: 'bold',
						fontSize: 10,
						fillColor: [175, 175, 175],
					},
				},
			]);
			tableRows.push([
				{
					content: `Collective Total Amount`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
				{
					content: `${totalSalesBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
			]);
			tableRows.push([
				{
					content: `Collective Total Discount`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
				{
					content: `${totalDiscountBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
			]);
			tableRows.push([
				{
					content: `Total After Discount`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
				{
					content: `${totalDiscountBrand2.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 7,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
			]);
			tableRows.push([
				{
					content: `Total Returned`,
					colSpan: 4,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
				{
					content: `${totalRetBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
					colSpan: 6,
					rowSpan: 1,
					styles: {
						halign: 'right',
						fontStyle: 'bold',
						fontSize: 10,
					},
				},
			]);

			count2 = 0;
			totalSales += totalSalesBrand;
			totalDiscount += totalDiscountBrand;
			totalAftDiscount += totalDiscountBrand2;
			totalRet += totalRetBrand;
		}
	});

	// Summary
	tableRows.push([
		{
			content: `Complete Report Summary`,
			colSpan: 13,
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
			content: `Report Total Bill Amount`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
		{
			content: `${
				totalSales ||
				totalSalesAmount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})
			}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
	]);
	tableRows.push([
		{
			content: `Report Total Discount`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
		{
			content: `${
				totalDiscount ||
				totalDiscount2.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})
			}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
	]);
	tableRows.push([
		{
			content: `Report Total After Discount`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
		{
			content: `${
				totalAftDiscount ||
				totalAfterDiscount.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})
			}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
	]);
	tableRows.push([
		{
			content: `Total Returned`,
			colSpan: 4,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
		{
			content: `${
				totalRet ||
				totalReturned.toLocaleString(undefined, {
					maximumFractionDigits: 2,
				})
			}`,
			colSpan: 6,
			rowSpan: 1,
			styles: {
				halign: 'right',
				fontStyle: 'bold',
				fontSize: 10,
			},
		},
	]);

	let yPos = 100;
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 40, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');
	doc.text('Customer Wise Sales Report', pageWidth / 2, 55, { align: 'center' });
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
	doc.setFontSize(10);
	doc.setFont('normal');
	doc.setFont(undefined, 'normal');
	doc.page = 1;
	doc.page += 1;
	const date = Date().split(' ');
	const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];
	let str = `Page ${doc.internal.getNumberOfPages()}`;
	if (typeof doc.putTotalPages === 'function') {
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.text(str, 40, pageHeight - 15);

	if (type === 1) {
		doc.save(`Report6${dateStr}.pdf`);
	} else if (type === 2) {
		doc.output('dataurlnewwindow');
	}
};


export default GeneratePDF;
