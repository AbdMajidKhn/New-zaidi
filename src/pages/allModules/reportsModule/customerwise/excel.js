import React from 'react';
import classNames from 'classnames';
import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import moment from 'moment';
import Button from '../../../../components/bootstrap/Button';
import apiClient from '../../../../baseURL/api';

const Excel = () => {
	const printReport = async () => {
		try {
			const response = await apiClient.get('/getSalesReportCustomerWise');
			const purchaseOrderList = response.data.invoices;
			const reportData = [];

			purchaseOrderList.forEach((purchaseOrder) => {
				purchaseOrder.invoice.forEach((item) => {
					item.invoice_child.forEach((child) => {
						const rowData = {
							item: child.item.name,

							pack: child.item.pack,
							rate: child.rate,
							quantity: child.quantity,
							total: child.total_amount,
							return: child.returned_quantity,
							totalAmount: purchaseOrder.total_amount,
							discount: purchaseOrder.discount,
							afterDiscount: purchaseOrder.total_after_discount,
							tax: purchaseOrder.gst,
							afterTax: purchaseOrder.total_after_gst,
						};
						reportData.push(rowData);
					});
				});
			});

			return reportData;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	const createDownLoadData = () => {
		handleOnExport().then((url) => {
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', url);
			downloadAnchorNode.setAttribute('download', `CustomerReport${moment()}.xlsx`);
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
			view[i] = s.charCodeAt(i);
		}

		return buf;
	};
	const handleOnExport = () => {
		const reportTitle = ['Customer Order Report']; // Wrap the title in an array
		printReport()
			.then((reportData) => {
				const table1 = [
					[
						'S.No.',
						'Item',
						'Pack Size',
						'Quantity',
						'Returned Quantity',
						'Rate',
						'Amount',
					],
				];

				let count = 0;
				let totalSale = 0;
				let totalReturned = 0;
				let totalMultiplier = 0;
				let totalDiscount = 0;
				let totalAfterDiscount = 0;
				let totalGstAmount = 0;
				let totalAmountAfterGst = 0;

				reportData.forEach((row) => {
					count += 1;
					const rowData = [
						count,
						row.item,
						row.pack,
						row.quantity,
						row.return,
						row.rate,
						row.total,
					];
					table1.push(rowData);

					// Calculate totals for each row
					totalSale += row.total;
					totalReturned += row.return;
					totalMultiplier += row.total;
					totalDiscount += parseFloat(row.discount) || 0;
					totalAfterDiscount += parseFloat(row.afterDiscount) || 0;
					totalGstAmount += row.tax;
					totalAmountAfterGst += parseFloat(row.afterTax) || 0;
				});

				// Individual rows for each table data row
				const emptyRow = [''];
				const totalAmountRow = ['', '', '', '', '', 'Total Amount:', totalSale];
				const discountRow = ['', '', '', '', '', 'Discount:', totalDiscount];
				const discountAfterRow = [
					'',
					'',
					'',
					'',
					'',
					'Total After Discount:',
					totalAfterDiscount,
				];
				const gst = ['', '', '', '', '', 'Tax:', totalGstAmount];
				const afterGst = ['', '', '', '', '', 'Total After Tax:', totalAmountAfterGst];
				const emptyRow2 = [''];
				table1.push(
					emptyRow,
					totalAmountRow,
					discountRow,
					discountAfterRow,
					gst,
					afterGst,
					emptyRow2,
				);

				const Summary = ['', '', '', 'Summary', ''];
				const totalSaleRow = ['', '', '', 'Total Sale:', totalSale];
				const totalReturnedRow = ['', '', '', 'Total Returned:', totalReturned];
				const totalMultiplierRow = ['', '', '', 'Total *:', totalMultiplier];
				const totalDiscountRow = ['', '', '', 'Discount:', totalDiscount];
				const totalAfterDiscountRow = [
					'',
					'',
					'',
					'Total After Discount:',
					totalAfterDiscount,
				];
				const totalGstAmountRow = ['', '', '', 'GST Amount:', totalGstAmount];
				const totalAmountAfterGstRow = [
					'',
					'',
					'',
					'Total Amount After GST:',
					totalAmountAfterGst,
				];

				const finalData = [
					reportTitle,
					table1,
					...table1,
					Summary,
					totalSaleRow,
					totalReturnedRow,
					totalMultiplierRow,
					totalDiscountRow,
					totalAfterDiscountRow,
					totalGstAmountRow,
					totalAmountAfterGstRow,
				];

				// create a new workbook
				const wb = XLSX.utils.book_new();

				const sheet = XLSX.utils.json_to_sheet(finalData, {
					skipHeader: true,
				});

				XLSX.utils.book_append_sheet(wb, sheet, 'Customer Report');

				const workbookBlob = workbook2blob(wb);

				const dataInfo = {
					titleCell: 'A2',
					titleRange: 'A1:H2',
					heading: 'A3:J3',

					tbodyRange: `A4:J${finalData.length}`,
				};

				return addStyle(workbookBlob, dataInfo);
			})
			.then((url) => {
				const downloadAnchorNode = document.createElement('a');
				downloadAnchorNode.setAttribute('href', url);
				downloadAnchorNode.setAttribute('download', `SaleReport${moment()}.xlsx`);
				downloadAnchorNode.click();
				downloadAnchorNode.remove();
			})
			.catch((err) => {
				console.error('Error exporting report:', err);
				// handle error
			});
	};

	const addStyle = (workbookBlob, dataInfo) => {
		return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
			workbook.sheets().forEach((sheet) => {
				sheet.usedRange().style({
					fontFamily: 'Arial',
					verticalAlignment: 'center',
				});

				sheet.column('A').width(5);
				sheet.column('B').width(40);
				sheet.column('C').width(25);
				sheet.column('D').width(20);
				sheet.column('E').width(25);
				sheet.column('F').width(25);
				sheet.column('G').width(25);
				sheet.column('H').width(15);
				sheet.column('I').width(15);
				sheet.column('J').width(15);

				sheet.range(dataInfo.titleRange).merged(true).style({
					bold: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});

				if (dataInfo.tbodyRange) {
					sheet.range(dataInfo.tbodyRange).style({
						horizontalAlignment: 'center',
					});
				}

				if (dataInfo.heading) {
					sheet.range(dataInfo.heading).style({
						bold: true,
						horizontalAlignment: 'center',
						verticalAlignment: 'center',
					});
				}
			});

			// eslint-disable-next-line no-shadow
			return workbook.outputAsync().then((workbookBlob) => URL.createObjectURL(workbookBlob));
		});
	};
	return (
		<Button
			color='primary'
			className={classNames('text-nowrap', {
				'col-md-2 ms-2 border-light': true,
			})}
			onClick={() => {
				createDownLoadData();
			}}
			isOutline
			icon='FilePdfFill'
			iconColor='info'
			isActive>
			Excel
		</Button>
	);
};

export default Excel;
