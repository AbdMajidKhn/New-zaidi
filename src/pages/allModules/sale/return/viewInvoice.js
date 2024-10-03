// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';

const ViewInvoice = ({ viewItem2 }) => {
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-2'>
					<h5> Invoice NO</h5>
					<p className='text-primary fw-bold'>{viewItem2.parentData.invoice_no}</p>
				</div>
				<div className='col-md-3'>
					<h5> {viewItem2.parentData.sale_type === 1 ? 'Walk-in ' : 'Registered '}</h5>
					<p className='text-primary fw-bold'>
						{viewItem2.parentData?.sale_type === 1
							? viewItem2.parentData?.walk_in_customer_name
							: viewItem2.parentData?.customer?.name}
					</p>
				</div>

				<div className='col-md-2'>
					<h5>Date</h5>
					<p className='text-primary fw-bold'>{viewItem2.parentData.date}</p>
				</div>
				<div className='col-md-2'>
					<h5>Remarks</h5>
					<p className='text-primary fw-bold'>
						{viewItem2.parentData.posale === null &&
						viewItem2.parentData.quotation === null
							? 'Direct Sale'
							: viewItem2.parentData.posale === null && viewItem2.parentData.quotation
							? 'Quotation No'
							: 'Po No'}
					</p>
				</div>
			</div>

			<br />
			<br />
			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Manufacturer</th>
								<th>Batch</th>
								<th>Item</th>

								<th>Unit</th>

								<th>Rate</th>
								<th>Quantity</th>
								<th>Amount</th>
								<th>Expiry Date</th>
							</tr>
						</thead>
						<tbody>
							{viewItem2?.childData?.map((item) => (
								<tr key={item.id}>
									<td>{item?.manufacturer?.manufacture?.name}</td>
									<td>{item?.manufacturer?.batch_no}</td>
									<td>{item.item.name}</td>

									<td>{item.item?.unit?.name}</td>

									<td>{item.rate}</td>
									<td>{item.quantity}</td>
									<td>{item.amount}</td>

									<td>{item?.manufacturer?.expiry_date}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<br />
			<br />
			<div className='row justify-content-end mt-1 mb-5'>
				<div className='col-md-4 border border-5 my-3 me-2'>
					<div className='row mb-2 '>
						<div className='col-6 fw-bold'>Total:</div>
						<div className='col-6 text-end'>
							{viewItem2.parentData.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Discount:</div>
						<div className='col-6 text-end'>{viewItem2.parentData.discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After Discount:</div>
						<div className='col-6 text-end'>
							{viewItem2.parentData.total_after_discount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST:</div>
						<div className='col-6 text-end'>{viewItem2.parentData.gst}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST %:</div>
						<div className='col-6 text-end'>{viewItem2.parentData.gst_percentage}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After GST:</div>
						<div className='col-6 text-end'>
							{viewItem2.parentData.total_after_gst.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax:</div>
						<div className='col-6 text-end'>{viewItem2.parentData.adv_tax}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax%:</div>
						<div className='col-6 text-end'>{viewItem2.parentData.adv_tax_percentage}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Advance Tax:</div>
						<div className='col-6 text-end'>
							{(
								(parseFloat(viewItem2.parentData.adv_tax) || 0) +
								(parseFloat(viewItem2.parentData.total_after_gst) || 0)
							).toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
ViewInvoice.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem2: PropTypes.object.isRequired,
};

export default ViewInvoice;
