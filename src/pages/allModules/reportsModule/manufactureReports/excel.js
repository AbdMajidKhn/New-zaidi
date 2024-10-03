// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import moment from 'moment';
import Button from '../../../../components/bootstrap/Button';

const Excel = ({ printReportAllExcel }) => {
	const createDownLoadData = () => {
		handleOnExport().then((url) => {
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', url);
			downloadAnchorNode.setAttribute(
				'download',
				`Manufacturer Sales Report${moment()}.xlsx`,
			);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		});
	};

	const workbook2blob = (workbook) => {
		const wopts = {
			bookType: 'xlsx',
			bookSST: false,
			type: 'binary',
		};

		const wbout = XLSX.write(workbook, wopts);

		const blob = new Blob([s2ab(wbout)], {
			type: 'application/octet-stream',
		});

		return blob;
	};

	const s2ab = (s) => {
		const buf = new ArrayBuffer(s.length);

		// create a 8 bit integer array
		const view = new Uint8Array(buf);

		// charCodeAt The charCodeAt() method returns an integer between 0 and 65535 representing the UTF-16 code
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i !== s.length; ++i) {
			// console.log(s.charCodeAt(i));
			view[i] = s.charCodeAt(i);
		}

		return buf;
	};

	const printReport = async () => {
		try {
			const response = await printReportAllExcel();
			return response;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
	const handleOnExport = async () => {
		let data1 = '';

		const prom = await printReport().then((response) => {
			data1 = response.invoices;
		});

		const title = [{ A: 'Manufacture Sales Report' }, {}];
		const myBoldRanges = [];
		let table1 = [
			{
				A: 'S.No.',
				B: 'Item',
				C: 'Pack Size',
				D: 'Strength',
				E: 'Unit',
				F: 'Quantity',
				G: 'Rate',
				H: 'Amount',
				I: 'Profit',
			},
		];
		console.log('data1', data1);

		let count = 0;

		// let count2 = 0;
		let count3 = 0;
		let totalSales = 0;
		let totalRet = 0;
		let totalCost = 0;
		let totalProfit = 0;
		data1.forEach((item, index) => {
			// const mineDetails = row;
			if (
				item.item2 &&
				item.item2.length > 0 &&
				item.item2[0]?.invoice_child_count?.length > 0
			) {
				count += 1;
				table1.push({
					A: count,

					B: `Manufacture${item.name}`,
				});

				myBoldRanges.push(`A${table1.length + 5}:I${table1.length + 5}`);
				let totalSalesBrand = 0;
				let totalRetBrand = 0;
				let totalCostBrand = 0;
				let totalProfitBrand = 0;
				item.item2.forEach((item2) => {
					if (item2.invoice_child_count.length > 0) {
						let totalSalesPart = 0;
						let totalRetPart = 0;
						let totalCostPart = 0;
						let totalProfitPart = 0;
						item2.invoice_child_count.forEach((item3) => {
							if (item3) {
								count3 += 1;
								// Calculate
								totalSalesPart += item3.rate_sum * item3.quantity_sum;
								totalRetPart += item3.rate_sum * (item3.returned_quantity ?? 0);
								totalCostPart +=
									item3.amount_sum *
									(item3.quantity_sum - (item3.returned_quantity ?? 0));
								totalProfitPart +=
									item3.rate_sum *
										(item3.quantity_sum - (item3.returned_quantity ?? 0)) -
									item3.amount_sum *
										(item3.quantity_sum - (item3.returned_quantity ?? 0));

								// Calculate Ends
								const itemsData3 = {
									A: count3,
									B: item3.item.name,
									C: item3.item.pack,
									D: item3.item.strength,
									E: item3.item.unit.name,

									F:
										item3.quantity_sum?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0,

									G:
										item3.rate_sum?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? 0,
									H:
										(item3.quantity_sum * item3.rate_sum)?.toLocaleString(
											undefined,
											{
												maximumFractionDigits: 2,
											},
										) ?? 0,

									I:
										(
											item3.rate_sum *
												(item3.quantity_sum -
													(item3.returned_quantity ?? 0)) -
											item3.amount_sum *
												(item3.quantity_sum -
													(item3.returned_quantity ?? 0))
										)?.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										}) ?? '0',
								};

								table1.push(itemsData3);
							}
						});
						if (count3 > 0) {
							table1.push({
								F: 'Total Sales',
								G: `${totalSalesPart.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
							});

							table1.push({
								F: 'Total Returned',
								G: `${totalRetPart.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
							});

							table1.push({
								F: 'Total Cost',
								G: `${totalCostPart.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
							});

							table1.push({
								F: 'Total Profit',
								G: `${totalProfitPart.toLocaleString(undefined, {
									maximumFractionDigits: 2,
								})}`,
							});
						}
						count3 = 0;
						totalSalesBrand += totalSalesPart;
						totalRetBrand += totalRetPart;
						totalCostBrand += totalCostPart;
						totalProfitBrand += totalProfitPart;
					}
				});
				//  Here Manufacture Summary
				table1.push({
					F: `Manufacture Summary: ${item.name}`,
				});
				table1.push({
					F: `Total Sales: ${item.name}`,
					G: `${totalSalesBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
				});
				table1.push({
					F: `Total Returned: ${item.name}`,
					G: `${totalRetBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
				});
				table1.push({
					F: `Total Cost: ${item.name}`,
					G: `${totalCostBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
				});
				table1.push({
					F: `Total Profit: ${item.name}`,
					G: `${totalProfitBrand.toLocaleString(undefined, {
						maximumFractionDigits: 2,
					})}`,
				});

				// count2 = 0;
				totalSales += totalSalesBrand;
				totalRet += totalRetBrand;
				totalCost += totalCostBrand;
				totalProfit += totalProfitBrand;
			}
		});

		table1 = [{ A: '' }].concat(table1).concat(['']);

		const finalData = [...title, ...table1];

		// create a new workbook
		const wb = XLSX.utils.book_new();

		const sheet = XLSX.utils.json_to_sheet(finalData, {
			skipHeader: true,
		});

		XLSX.utils.book_append_sheet(wb, sheet, 'Sales Report');

		const workbookBlob = workbook2blob(wb);

		const headerIndexes = [];
		finalData.forEach((data2, index) =>
			data2.A === 'Enrolment No.' ? headerIndexes.push(index) : null,
		);

		const dataInfo = {
			titleCell: 'A1',
			titleRange: 'A1:I2',
			heading: 'A4:I4',
			tbodyRange: `A5:I${finalData.length}`,
			boldRanges: myBoldRanges,
		};
		console.log('dataInfo', dataInfo);
		return addStyle(workbookBlob, dataInfo);
	};

	const addStyle = (workbookBlob, dataInfo) => {
		return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
			workbook.sheets().forEach((sheet) => {
				sheet.usedRange().style({
					fontFamily: 'Arial',
					verticalAlignment: 'center',
				});

				sheet.column('A').width(5);
				sheet.column('B').width(50);
				sheet.column('C').width(10);
				sheet.column('D').width(10);
				sheet.column('E').width(10);
				sheet.column('F').width(20);
				sheet.column('G').width(20);
				sheet.column('H').width(20);
				sheet.column('I').width(15);
				sheet.column('J').width(15);

				sheet.range(dataInfo.titleRange).merged(true).style({
					bold: true,
					border: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});

				if (dataInfo.tbodyRange) {
					sheet.range(dataInfo.tbodyRange).style({
						horizontalAlignment: 'center',
						border: true,
					});
				}

				if (dataInfo.heading) {
					sheet.range(dataInfo.heading).style({
						bold: true,
						border: true,
						horizontalAlignment: 'center',
						verticalAlignment: 'center',
					});
				}
				if (dataInfo.boldRanges) {
					dataInfo.boldRanges.forEach((range) => {
						sheet.range(range).style({
							bold: true,
							border: true,
							horizontalAlignment: 'center',
							verticalAlignment: 'center',
						});
					});
				}
			});

			// eslint-disable-next-line no-shadow
			return workbook.outputAsync().then((workbookBlob) => URL.createObjectURL(workbookBlob));
		});
	};

	return (
		// eslint-disable-next-line react/button-has-type
		<Button
			className='ml-2'
			color='success'
			onClick={() => {
				createDownLoadData();
			}}>
			Export Excell
		</Button>
	);
};

export default Excel;
