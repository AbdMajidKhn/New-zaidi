// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import classNames from 'classnames';
import moment from 'moment';
import Button from '../../../../components/bootstrap/Button';

const Excel = ({ printReportAllExcel }) => {
	const createDownLoadData = () => {
		handleOnExport().then((url) => {
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', url);
			downloadAnchorNode.setAttribute('download', `Sale Invoice Report${moment()}.xlsx`);
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
			const response = await printReportAllExcel(); // Call the `printReportAllExcel` function without passing any arguments
			return response;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};
	const handleOnExport = async () => {
		const reportTitle = ['Sale Invoice','']; // Wrap the title in an array

		let data1; // Define the data1 variable
		let data3;
		try {
			const response = await printReport();
			data1 = response.childData;
			data3 = response.parentData;
		} catch (error) {
			console.log(error);
			throw error;
		}

		const table1 = [
			[ '','',  `Invoice No: ${data3.invoice_no}`, '', ''], // Invoice No
			[ '', '', `PO No: ${data3.pono}`,  '', '', ''], // PO No
			[ '', '', 
				data3.sale_type === 2 
					? `Register Customer: ${data3.customer.name}` 
					: `Walk-In Customer: ${data3.walk_in_customer_name}`, 
				'', '', ''], // Customer
			[ '', '', `Contact: ${data3.customer.phone_no}`, '',  '', ''], // Contact
			['S.No.', 'Item', 'Expiry Date', 'Quantity', "Batch No", 'Rate', 'Discount', 'Amount'],
		];
		

		let count = 0;
		let totalAmount = 0;
		let totalDiscount = 0;
		let totalAfterDiscount = 0;

		data1.forEach((row) => {
			count += 1;
			const rowData = [
				count,
				`${row.item.name} ${row.item.strength}`,
				moment(row.manufacturer.expiry_date).format('DD-MM-YYYY'),
				row.quantity,
				row.manufacturer.batch_no,
				row.rate,
				row.discount,
				row.total_amount,
			];
			table1.push(rowData);

			totalAmount += row.total_amount;
			totalDiscount += row.discount;
			totalAfterDiscount += row.total_amount - row.discount;
		});

		const emptyRow = [''];
		const totalAmountRow = ['', '', '', '', 'Total Amount:', totalAmount];
		const totalDiscountRow = ['', '', '', '', 'Discount:', totalDiscount];
		const totalAfterDiscountRow = ['', '', '', '', 'Total After Discount:', totalAfterDiscount];
		const Gst = ['', '', '', '', 'GST:', data3.gst];
		const totalAfterGst = ['', '', '', '', 'Total After GST:', data3.total_after_gst];
		table1.push(
			emptyRow,
			totalAmountRow,
			totalDiscountRow,
			totalAfterDiscountRow,
			Gst,
			totalAfterGst,
			emptyRow,
		);

		const finalData = [reportTitle, table1, ...table1]; // Update finalData array

		// create a new workbook
		const wb = XLSX.utils.book_new();

		const sheet = XLSX.utils.json_to_sheet(finalData, {
			skipHeader: true,
		});

		XLSX.utils.book_append_sheet(wb, sheet, 'Sale Invoice ');

		const workbookBlob = workbook2blob(wb);

		const dataInfo = {
			titleCell: 'A2',
			titleRange: 'A1:H2',
			heading: 'A3:J5',
			tbodyRange: `A4:J${finalData.length}`,
		};

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
				sheet.column('B').width(55);
				sheet.column('C').width(25);
				sheet.column('D').width(25);
				sheet.column('E').width(20);
				sheet.column('F').width(20);
				sheet.column('G').width(20);

				sheet.range(dataInfo.titleRange).merged(true).style({
					bold: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});
				sheet.range('C3:D3').merged(true).style({
					bold: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});
				sheet.range('C4:D4').merged(true).style({
					bold: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});
				sheet.range('C5:D5').merged(true).style({
					bold: true,
					horizontalAlignment: 'center',
					verticalAlignment: 'center',
				});
				sheet.range('C6:D6').merged(true).style({
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
		// eslint-disable-next-line react/button-has-type
		<Button
			color='primary'
			// isLight={darkModeStatus}
			className={classNames('text-nowrap', {
				'border-light': true,
			})}
			isOutline
			icon='FilePdfFill'
			iconColor='info'
			isActive
			onClick={() => {
				createDownLoadData();
			}}>
			Export Excel
		</Button>
	);
};

export default Excel;
