// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
import React from 'react';
import * as XLSX from 'xlsx';
import * as XlsxPopulate from 'xlsx-populate/browser/xlsx-populate';
import moment from 'moment';
import Button from '../../../../components/bootstrap/Button';

const Excel = ({ dataExcel }) => {
	const createDownLoadData = () => {
		handleExport().then((url) => {
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute('href', url);
			downloadAnchorNode.setAttribute('download', `ItemsList${moment()}.xlsx`);
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

	const handleExport = () => {
		const title = [{ A: 'Item Report' }, {}];

		let table1 = [
			{
				A: 'S.No.',
				B: 'Category',
				C: 'Sub Category',
				D: 'Item',
				E: 'Nomenclature',
				F: 'Strength',
				G: 'Strength Unit',
				H: 'Pack Size',
				I: 'Pack Size Unit',
				J: 'Manufacturers',
				// J: 'Type',
				K: 'Status',
			},
		];

		let count = 0;
		dataExcel.forEach((row) => {
			// const mineDetails = row;
			count += 1;
			let manufacturers = '';
			row.manufacture.forEach((item) => {
				manufacturers = `${item.manufacture_id}-${item.manufacturedropdown?.label}\n`;
			});

			table1.push({
				A: count,
				B: row.category?.name,
				C: row.subcategory?.name,
				D: row.name,
				E: row.nomenclature,
				F: row.strength,
				G: row.strengthunit?.name || '',
				H: row.pack,
				I: row.unit?.name,
				J: manufacturers,
				// J: 'Type',
				K: row.isActive === 1 ? 'Active' : '     Inactive',
			});
		});

		table1 = [{ A: '' }].concat(table1).concat(['']);

		const finalData = [...title, ...table1];

		// create a new workbook
		const wb = XLSX.utils.book_new();

		const sheet = XLSX.utils.json_to_sheet(finalData, {
			skipHeader: true,
		});

		XLSX.utils.book_append_sheet(wb, sheet, 'Items List');

		const workbookBlob = workbook2blob(wb);

		const headerIndexes = [];
		finalData.forEach((data1, index) =>
			data1.A === 'Enrolment No.' ? headerIndexes.push(index) : null,
		);

		const dataInfo = {
			titleCell: 'A2',
			titleRange: 'A1:H2',
			heading: 'A4:J4',
			tbodyRange: `A3:J${finalData.length}`,
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
				sheet.column('B').width(25);
				sheet.column('C').width(25);
				sheet.column('D').width(20);
				sheet.column('E').width(15);
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
		// eslint-disable-next-line react/button-has-type
		<Button
			className='ml-2'
			color='success'
			onClick={() => {
				createDownLoadData();
			}}>
			Export Excel
		</Button>
	);
};

export default Excel;
