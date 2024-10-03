// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Viewnew = ({ viewItem }) => {
	return (
		<>
			<div className='row g-2  ms-1'>
				<div className='col-md-2'>
					<h6> Invoice NO</h6>
					<p className='text-primary fw-bold'>{viewItem.parentData.invoice_no}</p>
				</div>
				{/* <div className='col-md-2'>
					<h6> PO NO</h6>
					<p className='text-primary fw-bold'>{viewItem?.data1?.parentData?.pono}</p>
				</div> */}
				<div className='col-md-3'>
					<h6> {viewItem.parentData.sale_type === 1 ? 'Walk-in ' : 'Registered '}</h6>
					<p className='text-primary fw-bold'>
						{viewItem.parentData?.sale_type === 1
							? viewItem.parentData?.walk_in_customer_name
							: viewItem.parentData?.customer?.name}
					</p>
				</div>

				<div className='col-md-2'>
					<h6>Date</h6>
					<p className='text-primary fw-bold'>
						{moment(viewItem.parentData.date).format('DD-MM-YYYY')}
					</p>
				</div>
				<div className='col-md-2'>
					<h6>Sale Type</h6>
					<p className='text-primary fw-bold'>
						{viewItem.parentData.posale === null &&
						viewItem.parentData.quotation === null
							? 'Direct Sale'
							: viewItem.parentData.posale === null && viewItem.parentData.quotation
							? 'Quotation No'
							: 'Po No'}
					</p>
				</div>
				<div className='col-md-2'>
					<h6>Remarks</h6>
					<p className='text-primary fw-bold'>{viewItem.parentData.remarks}</p>
				</div>
			</div>

			<div className='row g-4'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Sr no</th>
								<th>Item</th>
								<th>Strngth</th>

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
							{viewItem?.childData?.map((item, index) => (
								<tr key={item.id}>
									<td>{index + 1}</td>
									<td>{item.item.name}</td>
									<td>
										{item.item?.strength}-{item.item?.strengthunit?.name}
									</td>

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
			<div className='row justify-content-end mt-1'>
				<div className='col-md-4 border border-5 my-3 me-2'>
					<div className='row mb-2 '>
						<div className='col-6 fw-bold'>Total:</div>
						<div className='col-6 text-end'>
							{viewItem.parentData.total_amount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Discount:</div>
						<div className='col-6 text-end'>{viewItem.parentData.discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After Discount:</div>
						<div className='col-6 text-end'>
							{viewItem.parentData.total_after_discount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST %:</div>
						<div className='col-6 text-end'>{viewItem.parentData.gst_percentage}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>GST:</div>
						<div className='col-6 text-end'>{viewItem.parentData.gst}</div>
					</div>

					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After GST:</div>
						<div className='col-6 text-end'>
							{viewItem.parentData.total_after_gst.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>

					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax %:</div>
						<div className='col-6 text-end'>
							{viewItem.parentData.adv_tax_percentage}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax In Figure:</div>
						<div className='col-6 text-end'>{viewItem.parentData.adv_tax}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Advance Tax:</div>
						<div className='col-6 text-end'>
							{(
								(parseFloat(viewItem.parentData?.total_after_gst) || 0) +
								(parseFloat(viewItem.parentData?.adv_tax) || 0)
							).toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
Viewnew.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default Viewnew;
