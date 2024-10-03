import React, { useEffect, useState } from 'react';
import JsPDF from 'jspdf';
import 'jspdf-autotable';
import PropTypes from 'prop-types';
import Button from '../../../../components/bootstrap/Button';

const PdfView = ({ tableDataForpdf, totalQtyIn, totalQtyOut }) => {
	console.log(tableDataForpdf, 'tableDataForpdf');
	console.log(totalQtyIn, 'totalQtyIn');
	const [pdfGenerated, setPdfGenerated] = useState(false);

	const generatePDF = () => {
		const Doc = new JsPDF();
		const pageWidth = Doc.internal.pageSize.width || Doc.internal.pageSize.getWidth();
		let yPos = 10;

		Doc.setFont(undefined, 'bold');
		Doc.setFontSize(16);
		Doc.text(`Stock Report`, pageWidth / 2, yPos, {
			align: 'center',
		});

		yPos += 10;
		const headers = [
			'Sr. No',
			// 'Category',
			// 'Sub Category',
			'Item',
			'Date',
			// 'Inventory Type',
			'Invoice No',
			'PO No',
			'Supplier Name',
			'Customer Name',
			// 'Size',
			// 'Unit',
			'QTY In/Out'
			// 'Total',
		];

		const tableDataForPDF = tableDataForpdf.map((item, index) => {
			console.log('item', item)
			// const total = Number(item.quantity_in) - Number(item.quantity_out);
			return [
				index + 1,
				// item.item.category?.name || '',
				// item.item.subcategory?.name || '',
				item.item?.name || '',
				item.date,
				// item.inventory_type?.name || '',
				item.invoicechild?.invoice.invoice_no,
				item.inventory_type?.name === 'Inventory In from Direct Purchase'
					? item.purchase_orderchild?.purchase_order.po_no
					: item.return_purchase_orderchild?.return_purchase_order.ret_po_no,
				// item.item?.strength || '',
				// item.item?.strengthunit?.name || '',
				item?.purchase_orderchild?.purchase_order?.name ||
				item?.purchase_orderchild?.purchase_order?.supplier?.name ||
				item?.return_purchase_orderchild?.return_purchase_order?.purchaseorder?.supplier?.name ||
				item?.return_purchase_order?.return_purchase_orderchild?.return_purchase_order?.purchaseorder?.name,
				item?.invoicechild?.invoice?.walk_in_customer_name ||
				item?.invoicechild?.invoice?.customer?.name ||
				item?.return_invoicechild?.invoice?.invoice?.customer?.name,
				item.quantity_in > 0 ? `+${item.quantity_in}` : `-${item.quantity_out}`

				// total,
			];
		});

		const columnStyles = {
			0: { cellWidth: 15 },
			1: { cellWidth: 40 },
			2: { cellWidth: 15 },
			3: { cellWidth: 20 },
			4: { cellWidth: 20 },
			5: { cellWidth: 20 },
			6: { cellWidth: 22 },
			7: { cellWidth: 35 },
			8: { cellWidth: 20 },
			9: { cellWidth: 15 },
		};

		Doc.autoTable({
			head: [headers],
			body: tableDataForPDF,
			startY: yPos,
			columnStyles,
			theme: 'striped',
			styles: {
				fontSize: 10,
			},
		});

		yPos += Doc.previousAutoTable.finalY + 10; // Adjust yPos to be below the table

		const totalDifference = totalQtyIn - totalQtyOut;
		console.log('tota diff', totalDifference)
		console.log('tota totalQtyOut', totalQtyOut)
		console.log('tota totalQtyIn', totalQtyIn)

		Doc.text(`Total Quantity In: ${totalQtyIn}`, pageWidth / 3, yPos, { align: 'left' });
		Doc.text(`Total Quantity Out: ${totalQtyOut}`, pageWidth / 3, yPos + 10, { align: 'left' });
		Doc.text(`Total: ${totalDifference}`, pageWidth / 3, yPos + 20, { align: 'left' });

		Doc.save('stock_report.pdf');
		setPdfGenerated(true);
	};

	useEffect(() => {
		if (tableDataForpdf && tableDataForpdf.length > 0 && !pdfGenerated) {
			generatePDF();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tableDataForpdf, totalQtyIn, totalQtyOut, pdfGenerated]);

	return (
		<div>
			<Button color='primary' onClick={generatePDF} isOutline isActive>
				Generate PDF
			</Button>
		</div>
	);
};

PdfView.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	tableDataForpdf: PropTypes.array.isRequired,
	totalQtyIn: PropTypes.number.isRequired,
	totalQtyOut: PropTypes.number.isRequired,
};
export default PdfView;
