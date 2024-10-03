import JsPDF from 'jspdf';
import 'jspdf-autotable';
// import moment from 'moment';

const GeneratePDF = (tableData, type, id, date) => {
	// console.log(tableData);
	// Create a new PDF document
	const doc = new JsPDF('p', 'pt', 'a4');
	const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
	const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

	// Calculate total balance
	// eslint-disable-next-line no-unused-vars
	let totalBalance = 0;
	tableData.forEach((item) => {
		totalBalance += item.balance ? item.balance : 0;
	});

	// Start building the content
	doc.setFont(undefined, 'bold');
	doc.text('Zaidi Traders', pageWidth / 2, 55, { align: 'center' });
	doc.setFontSize(12);
	doc.setFont(undefined, 'normal');

	doc.setFont(undefined, 'normal');
	doc.text('Supplier Payable', pageWidth / 2, 70, { align: 'center' });

	doc.setFontSize(10);
	doc.setFont(undefined, 'normal');
	doc.text(`From begining to ${date}`, pageWidth / 2, 80, { align: 'center' });

	// Define table columns and rows
	const columns = ['Sr. No', 'Supplier', 'Account', 'Balance'];
	const rows = tableData.map((item, index) => [
		index + 1,
		item.name,
		`${item.code} - ${item.name}`, // Combine code and name
		item.balance ? item.balance?.balance : 0,
	]);

	// Add the table to the PDF
	doc.autoTable({
		startY: 90, // Adjust the starting Y position
		head: [columns],
		body: rows,
		theme: 'grid', // Add grid lines to the table
		columnStyles: {
			0: { cellWidth: 50 }, // Adjust column widths if needed
			1: { cellWidth: 150 },
			2: { cellWidth: 150 },
			3: { cellWidth: 80 },
		},
		tableWidth: 'wrap',
	});

	// // Add a total balance line
	// doc.setFont('helvetica', 'bold');
	// doc.setFontSize(12);
	// doc.text('Total Balance:', pageWidth - 150, doc.autoTable.previous.finalY + 20);
	// doc.text(
	//   totalBalance.toFixed(2), // Format the total balance with 2 decimal places
	//   pageWidth - 50,
	//   doc.autoTable.previous.finalY + 20
	// );

	// Footer
	// const date1 = Date().split(' ');
	// const dateStr = date1[0] + date1[1] + date1[2] + date1[3] + date1[4];
	let str = `Page ${doc.internal.getNumberOfPages()}`;
	if (typeof doc.putTotalPages === 'function') {
		str = `${str} of ${doc.internal.getNumberOfPages()}`;
	}
	doc.setFontSize(10);
	doc.text(str, 40, pageHeight - 15);

	// Save or display the PDF based on your type parameter
	// doc.save(`BalanceSheet_${dateStr}.pdf`); // Save the PDF with a unique filename

	// Generate a data URL for the PDF
	const pdfDataUri = doc.output('datauristring');

	// Open the PDF in a new tab
	const newTab = window.open();
	newTab.document.write(`<iframe src="${pdfDataUri}" width="100%" height="100%"></iframe>`);
};

export default GeneratePDF;
