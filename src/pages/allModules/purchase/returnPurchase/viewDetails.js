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
					<h5> PO NO</h5>
					<p className='text-primary fw-bold'>{viewItem.ret_po_no}</p>
				</div>

				<div className='col-md-2'>
					<h5>Return Date</h5>
					<p className='text-primary fw-bold'>
						{moment(viewItem.return_date).format('DD-MM-YYYY')}
					</p>
				</div>

				<div className='col-md-2'>
					<h5>{viewItem.purchaseorder.po_type !== 3 ? 'Supplier' : 'Name'}</h5>
					<p className='text-primary fw-bold'>
						{viewItem.purchaseorder.po_type !== 3
							? viewItem.purchaseorder.supplier.name
							: viewItem.purchaseorder.name}
					</p>
				</div>
				<div className='col-md-2'>
					<h5>Remarks</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseorder.remarks}</p>
				</div>
			</div>

			<br />
			<br />
			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table table-modern col-md-12'>
						<thead>
							<tr>
								<th>Item</th>
								<th>Batch</th>
								<th>Pack Size</th>
								<th>Returned quantity</th>

								<th>Rate</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.pochild?.map((item) => (
								<tr key={item.id}>
									<td>{item.item.name}</td>
									<td>{item.batch_no}</td>
									<td>{item.pack}</td>
									<td>{item.quantity}</td>

									<td>{item.rate}</td>
									<td>{item.total}</td>
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
						<div className='col-6 text-end'>{viewItem.total}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold '>Deduction:</div>
						<div className='col-6 text-end'>{viewItem.discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Total After Deduction:</div>
						<div className='col-6 text-end'>{viewItem.total_after_discount}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Tax:</div>
						<div className='col-6 text-end'>{viewItem.tax}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Tax%:</div>
						<div className='col-6 text-end'>{viewItem.tax_in_figure}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Tax:</div>
						<div className='col-6 text-end'>{viewItem.total_after_tax}</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax %:</div>
						<div className='col-6 text-end'>
							{viewItem.adv_tax_percentage}
						</div>
					</div>
					<div className='row mb-2'>
						<div className='col-6 fw-bold'>Advance Tax In Figure:</div>
						<div className='col-6 text-end'>{viewItem.adv_tax}</div>
					</div>
					<div className='row'>
						<div className='col-6 fw-bold'>Total After Advance Tax:</div>
						<div className='col-6 text-end'>
							{(
								(parseFloat(viewItem?.total_after_tax) || 0) +
								(parseFloat(viewItem?.adv_tax) || 0)
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
