// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Viewnew = ({ viewItem }) => {
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-2'>
					<h5> Invoice NO</h5>
					<p className='text-primary fw-bold'>{viewItem.invoice.invoice_no}</p>
				</div>
				<div className='col-md-3'>
					<h5> {viewItem.invoice.sale_type === 1 ? 'Walk-in ' : 'Registered '}</h5>
					<p className='text-primary fw-bold'>
						{viewItem.invoice?.sale_type === 1
							? viewItem.invoice?.walk_in_customer_name
							: viewItem.invoice?.customer?.name}
					</p>
				</div>
				<div className='col-md-2'>
					<h5>Sale Type</h5>
					<p className='text-primary fw-bold'>{viewItem.invoice.sale_type}</p>
				</div>
				<div className='col-md-2'>
					<h5>Return Date</h5>
					<p className='text-primary fw-bold'>
						{moment(viewItem.return_date).format('DD-MM-YYYY')}
					</p>
				</div>
				<div className='col-md-2'>
					<h5>Remarks</h5>
					<p className='text-primary fw-bold'>
						{viewItem.invoice.posale === null && viewItem.invoice.quotation === null
							? 'Direct Sale'
							: viewItem.invoice.posale === null && viewItem.invoice.quotation
							? 'Quotation No'
							: 'Po No'}
					</p>
				</div>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Item</th>
								<th>Strength</th>
								<th>Manufacturer</th>
								<th>Batch</th>

								<th>Rate</th>
								<th>Quantity</th>
								<th>Amount</th>
								<th>Discount</th>
								<th>Total</th>
								<th>Expiry Date</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.invoice_child?.map((item) => (
								<tr key={item.id}>
									<td>{item.item.name}</td>
									<td>{item.item.strength}</td>
									<td>{item?.manufacturer?.manufacture?.name}</td>
									<td>{item?.manufacturer?.batch_no}</td>

									<td>{item.rate}</td>
									<td>{item.quantity}</td>
									<td>{item.amount}</td>
									<td>
										({item.item_discount_per}%) {item.discount}
									</td>
									<td>{item.total_amount}</td>

									<td>
										{moment(item?.manufacturer?.expiry_date).format(
											'DD-MM-YYYY',
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
			<br />
			<br />
			<div className='row justify-content-end mt-3'>
				<div className='col-md-4 border border-5 px-3 py-2 me-3'>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total:</div>
						<div className='col-6 text-end'>
							{viewItem.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold '>Deduction:</div>
						<div className='col-6 text-end'>{viewItem.discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After Deduction:</div>
						<div className='col-6 text-end'>
							{viewItem.total_after_discount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST:</div>
						<div className='col-6 text-end'>{viewItem.gst}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST%:</div>
						<div className='col-6 text-end'>{viewItem.gst_percentage}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After GST:</div>
						<div className='col-6 text-end'>
							{viewItem?.total_after_gst?.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax:</div>
						<div className='col-6 text-end'>{viewItem.adv_tax}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax%:</div>
						<div className='col-6 text-end'>{viewItem.adv_tax_percentage}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Advance Tax:</div>
						<div className='col-6 text-end'>
							{(viewItem.adv_tax + viewItem.total_after_gst).toLocaleString(
								undefined,
								{
									maximumFractionDigits: 2,
								},
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
Viewnew.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default Viewnew;
