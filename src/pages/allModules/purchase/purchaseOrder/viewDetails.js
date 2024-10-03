import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Viewnew = ({ viewItem }) => {
	console.log('view tem',viewItem)
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
			<div className='col-md-2'>
					<h5> Invoice NO</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.invoice_no}</p>
				</div>
				<div className='col-md-2'>
					<h5> PO NO</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.po_no}</p>
				</div>
				<div className='col-md-2'>
					<h5>{viewItem.purchaseOrder.po_type !== 3 ? 'Supplier' : 'Name'}</h5>
					<p className='text-primary fw-bold'>
						{viewItem.purchaseOrder.po_type !== 3
							? viewItem.purchaseOrder.supplier.name
							: viewItem.purchaseOrder.name}
					</p>
				</div>

				<div className='col-md-2'>
					<h5> Remarks</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.remarks}</p>
				</div>

				<div className='col-md-2'>
					<h5> Request Date</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.request_date}</p>
				</div>
				<div className='col-md-2'>
					<h5> Receive Date</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.receive_date}</p>
				</div>
			</div>

			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Category</th>
								<th>Sub Category</th>

								<th>Batch</th>
								<th>Pack Size</th>
								<th>Item</th>
								<th>Unit</th>
								<th>Quantity</th>

								<th>Rate</th>

								<th>Amount</th>
								<th>Expiry Date</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.poChild?.map((item) => (
								<tr key={item.id}>
									<td>{item.item?.category?.name}</td>
									<td>{item.item?.subcategory?.name}</td>
									<td>{item.batch_no}</td>
									<td>{item.pack}</td>
									<td>{item.item?.name}</td>
									<td>{item.item?.unit?.name}</td>
									<td>{item.quantity}</td>

									<td>{item.rate}</td>

									<td>
										{item.total.toLocaleString(undefined, {
											maximumFractionDigits: 2,
										})}
									</td>
									<td>
										{item.expiry_date
											? moment(item.expiry_date).format('DD-MM-YYYY')
											: ''}
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
							{viewItem.purchaseOrder.total.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold '>Discount:</div>
						<div className='col-6 text-end'>{viewItem.purchaseOrder.discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After Discount:</div>
						<div className='col-6 text-end'>
							{viewItem.purchaseOrder.total_after_discount.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Tax %:</div>
						<div className='col-6 text-end'>{viewItem.purchaseOrder.tax}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Tax In Figure:</div>
						<div className='col-6 text-end'>{viewItem.purchaseOrder.tax_in_figure}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Tax:</div>
						<div className='col-6 text-end'>
							{viewItem.purchaseOrder.total_after_tax.toLocaleString(undefined, {
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax %:</div>
						<div className='col-6 text-end'>
							{viewItem.purchaseOrder.adv_tax_percentage}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax In Figure:</div>
						<div className='col-6 text-end'>{viewItem.purchaseOrder.adv_tax}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Advance Tax:</div>
						<div className='col-6 text-end'>
							{(
								parseFloat(viewItem.purchaseOrder.total_after_tax) +
								parseFloat(viewItem.purchaseOrder.adv_tax)
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

Viewnew.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default Viewnew;
