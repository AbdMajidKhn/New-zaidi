// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
// import moment from 'moment';

const Viewnew = ({ viewItem }) => {
	let total2 = 0;
	let total = 0;
	let dis = 0;

	return (
		<div>
			<div className='row g-4 mt-2'>
				<div className='col-md-12'>
					<table className='table col-md-12'>
						<thead>
							<tr>
								<th>S No</th>
								<th>Item</th>
								<th>Pack</th>
								<th>Qty</th>
								<th>Rate</th>
								<th>Amount</th>
								<th>Discount</th>
								<th>Total</th>
							</tr>
						</thead>
						<tbody>
							{viewItem?.map((item, index) => (
								<>
									<tr>
										<td colSpan='8'>
											{' '}
											<div className='row'>
												<div className='col-6'>
													<h5>Invoice No: {item.invoice_no}</h5>
												</div>
												<div className='col-6 text-end'>
													{' '}
													<h5>Date: {item.date}</h5>
												</div>
											</div>
										</td>
									</tr>

									{item?.invoice_child.map((item2) => {
										const distotal =
											item2.quantity * item2.rate - item2.discount;
										total += distotal;
										const subtotal = item2.quantity * item2.rate;
										total2 += subtotal;

										dis += item2.discount;
										return (
											<tr key={item2.id}>
												<td>{index + 1}</td>
												<td>{item2.item.name}</td>
												<td>{item2.item.pack}</td>
												<td>{item2.quantity}</td>
												<td>{item2.rate}</td>
												<td>{item2.quantity * item2.rate}</td>
												<td>{item2.discount}</td>
												<td>{distotal}</td>
											</tr>
										);
									})}
								</>
							))}
							<tr>
								<td colSpan='7' className='fw-bold text-end'>
									{' '}
									Total:
								</td>
								<td className='fw-bold'>{total2}</td>
							</tr>
							<tr>
								<td colSpan='7' className='fw-bold text-end'>
									{' '}
									Discount:
								</td>
								<td className='fw-bold'>{dis}</td>
							</tr>
							<tr>
								<td colSpan='7' className='fw-bold text-end'>
									{' '}
									Total After Discount:
								</td>
								<td className='fw-bold'>{total}</td>
							</tr>
						</tbody>
					</table>
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
