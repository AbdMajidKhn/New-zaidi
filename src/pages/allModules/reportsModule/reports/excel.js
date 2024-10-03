import React from 'react';
import classNames from 'classnames';
import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import moment from 'moment';
import Button from '../../../../components/bootstrap/Button';
import apiClient from '../../../../baseURL/api';
import { _titleError } from '../../../../notifyMessages/erroSuccess';
import showNotification from '../../../../components/extras/showNotification';

const Excel = () => {
	const printReport = async () => {
		try {
			const response = await apiClient.get('/getPurchaseReport');
			const purchaseOrderList = response.data.purchaseorderlist;
			const reportData = [];

			purchaseOrderList.forEach((purchaseOrder) => {
				purchaseOrder.purchaseorderchild.forEach((item) => {
					const rowData = {
						pack: item.pack,
						quantity: item.quantity,
						item: item.item.name,
						rate: item.item.rate,
						total: item.total,
						totalAmount: purchaseOrder.total,
						discount: purchaseOrder.discount,
						afterDiscount: purchaseOrder.total_after_discount,
					};
					reportData.push(rowData);
				});
			});

			return reportData;
		} catch (error) {
			showNotification(_titleError, error.message, 'Danger');
			throw error;
		}
	};
	const createDownLoadData = () => {
		handleOnExport().then((url) => {
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', url);
			downloadAnchorNode.setAttribute('download', `PurchaseReport${moment()}.xlsx`);
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
		const reportTitle = ['Purchase Order Report']; // Wrap the title in an array
		printReport()
			.then((reportData) => {
				const table1 = [['S.No.', 'Item', 'Pack Size', 'Quantity', 'Rate', 'Amount']];

				let count = 0;
				reportData.forEach((row) => {
					count += 1;
					const rowData = [count, row.item, row.pack, row.quantity, row.rate, row.total];
					table1.push(rowData);

					// Individual rows for each table data row
					const emptyRow = [''];
					const { totalAmount, discount, afterDiscount } = row;
					const totalAmountRow = ['', '', '', '', 'Total Amount:', totalAmount];
					const discountRow = ['', '', '', '', 'Discount:', discount];
					const discountAfterRow = [
						'',
						'',
						'',
						'',
						'Total After Discount:',
						afterDiscount,
					];

					const emptyRow2 = [''];
					table1.push(
						emptyRow,
						totalAmountRow,
						discountRow,
						discountAfterRow,

						emptyRow2,
					);
				});

				// const Summary = ['', '', '', 'Summary', ''];

				// table1.push(Summary);

				const finalData = [reportTitle, table1, ...table1]; // Update finalData array

				// create a new workbook
				const wb = XLSX.utils.book_new();

				const sheet = XLSX.utils.json_to_sheet(finalData, {
					skipHeader: true,
				});

				XLSX.utils.book_append_sheet(wb, sheet, 'Purchase Report');

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
				downloadAnchorNode.setAttribute('download', `Purchase${moment()}.xlsx`);
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
				sheet.column('B').width(60);
				sheet.column('C').width(25);
				sheet.column('D').width(25);
				sheet.column('E').width(25);
				sheet.column('F').width(25);
				sheet.column('G').width(25);

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
