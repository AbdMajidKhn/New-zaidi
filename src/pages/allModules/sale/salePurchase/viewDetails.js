import React from 'react';
import PropTypes from 'prop-types';

const Viewnew = ({ viewItem }) => {
	return (
		<div>
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-2'>
					<h5> PO NO</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.po_no}</p>
				</div>

				<div className='col-md-3'>
					<h5> Customer</h5>
					<p className='text-primary fw-bold'>{viewItem.purchaseOrder.customer?.name}</p>
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
								<th>Quoted Rate</th>
								<th>Quantity</th>

								<th>Rate</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.poChild?.map((item) => (
								<tr key={item.id}>
									<td>{item.item?.name}</td>

									<td>{item?.batch_no}</td>
									<td>{item.pack}</td>
									<td>{item.quoted_rate}</td>
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
			<div className='row g-2 mt-1 mb-5'>
				<div className='col-md-8' />
				<div className='col-md-4'>
					<h5> Total: {viewItem.purchaseOrder.total} </h5>
					<h5> Discount: {viewItem.purchaseOrder.discount} </h5>
					<h5> Total After Discount: {viewItem.purchaseOrder.total_after_discount} </h5>
					<h5> Tax %: {viewItem.purchaseOrder.tax} </h5>
					<h5> Tax : {viewItem.purchaseOrder.tax_in_figure} </h5>
					<h5> Total After Tax: {viewItem.purchaseOrder.total_after_tax} </h5>
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
