// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-nested-ternary */
// import React from 'react';
// import PropTypes from 'prop-types';
// // import moment from 'moment';

// const Viewnew = ({ viewItem }) => {
// 	console.log(viewItem)
// 	let total2 = 0;
// 	let total = 0;
// 	let dis = 0;

// 	return (
// 		<div>
// 			<div className='row g-4 mt-2'>
// 				<div className='col-md-12'>
// 					<table className='table col-md-12'>
// 						<thead>
// 							<tr>
// 								<th>S No</th>
// 								<th>Item</th>
// 								<th>Pack</th>
// 								<th>Qty</th>
// 								<th>Rate</th>
// 								<th>Amount</th>
// 								<th>Discount</th>
// 								<th>Total</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{viewItem?.map((item, index) => (
// 								<>
// 									<tr>
// 										<td colSpan='8'>
// 											{' '}
// 											<div className='row'>
// 												<div className='col-6'>
// 													<h5>Invoice No: {item.invoice_no}</h5>
// 												</div>
// 												<div className='col-6 text-end'>
// 													{' '}
// 													<h5>Date: {item.date}</h5>
// 												</div>
// 											</div>
// 										</td>
// 									</tr>

// 									{item?.invoice_child.map((item2) => {
// 										const distotal =
// 											item2.quantity * item2.rate - item2.discount;
// 										total += distotal;
// 										const subtotal = item2.quantity * item2.rate;
// 										total2 += subtotal;

// 										dis += item2.discount;
// 										return (
// 											<tr key={item2.id}>
// 												<td>{index + 1}</td>
// 												<td>{item2.item.name}</td>
// 												<td>{item2.item.pack}</td>
// 												<td>{item2.quantity}</td>
// 												<td>{item2.rate}</td>
// 												<td>{item2.quantity * item2.rate}</td>
// 												<td>{item2.discount}</td>
// 												<td>{distotal}</td>
// 											</tr>
// 										);
// 									})}
// 								</>
// 							))}
// 							<tr>
// 								<td colSpan='7' className='fw-bold text-end'>
// 									{' '}
// 									Total:
// 								</td>
// 								<td className='fw-bold'>{total2}</td>
// 							</tr>
// 							<tr>
// 								<td colSpan='7' className='fw-bold text-end'>
// 									{' '}
// 									Discount:
// 								</td>
// 								<td className='fw-bold'>{dis}</td>
// 							</tr>
// 							<tr>
// 								<td colSpan='7' className='fw-bold text-end'>
// 									{' '}
// 									Total After Discount:
// 								</td>
// 								<td className='fw-bold'>{total}</td>
// 							</tr>
// 						</tbody>
// 					</table>
// 				</div>
// 			</div>
// 		</div>
// 	);
// };

// Viewnew.propTypes = {
// 	// eslint-disable-next-line react/forbid-prop-types
// 	viewItem: PropTypes.object.isRequired,
// };

// export default Viewnew;

// // eslint-disable-next-line eslint-comments/disable-enable-pair
// /* eslint-disable no-nested-ternary */
// import React from 'react';
// import PropTypes from 'prop-types';

// const Viewnew = ({ viewItem }) => {
// 	console.log(viewItem)
//   let total2 = 0;
//   let total = 0;
//   let dis = 0;

//   return (
//     <div>
//       <div className='row g-4 mt-2'>
//         <div className='col-md-12'>
//           <table className='table col-md-12'>
//             <thead>
//               <tr>
//                 <th>S No</th>
//                 <th>Item</th>
//                 <th>Pack</th>
//                 <th>Qty</th>
//                 <th>Rate</th>
//                 <th>Amount</th>
//                 <th>Discount</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {(Array.isArray(viewItem) ? viewItem : [viewItem]).map((item, index) => (
//                 <React.Fragment key={item.id}>
//                   <tr>
//                     <td colSpan='8'>
//                       {' '}
//                       <div className='row'>
//                         <div className='col-6'>
//                           <h5>Invoice No: {item.invoice_no}</h5>
//                         </div>
//                         <div className='col-6 text-end'>
//                           {' '}
//                           <h5>Date: {item.date}</h5>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>

//                   {item.invoice_child.map((item2) => {
//                     const distotal =
//                       item2.quantity * item2.rate - item2.discount;
//                     total += distotal;
//                     const subtotal = item2.quantity * item2.rate;
//                     total2 += subtotal;

//                     dis += item2.discount;
//                     return (
//                       <tr key={item2.id}>
//                         <td>{index + 1}</td>
//                         <td>{item2.item.name}</td>
//                         <td>{item2.item.pack}</td>
//                         <td>{item2.quantity}</td>
//                         <td>{item2.rate}</td>
//                         <td>{item2.quantity * item2.rate}</td>
//                         <td>{item2.discount}</td>
//                         <td>{distotal}</td>
//                       </tr>
//                     );
//                   })}
//                 </React.Fragment>
//               ))}

//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total:
//                 </td>
//                 <td className='fw-bold'>{total2}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Discount:
//                 </td>
//                 <td className='fw-bold'>{dis}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total After Discount:
//                 </td>
//                 <td className='fw-bold'>{total}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// Viewnew.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   viewItem: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
// };

// export default Viewnew;

// import React from 'react';
// import PropTypes from 'prop-types';

// const Viewnew = ({ viewItem }) => {
// 	console.log(viewItem)
//   let total2 = 0;
//   let total = 0;
//   let dis = 0;

//   return (
//     <div>
//       <div className='row g-4 mt-2'>
//         <div className='col-md-12'>
//           <table className='table col-md-12'>
//             <thead>
//               <tr>
//                 <th>S No</th>
//                 <th>Item</th>
//                 <th>Pack</th>
//                 <th>Qty</th>
//                 <th>Rate</th>
//                 <th>Amount</th>
//                 <th>Discount</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {Array.isArray(viewItem) ? (
//                 viewItem.map((item, index) => (
//                   <React.Fragment key={item.id}>
//                     <tr>
//                       <td colSpan='8'>
//                         {' '}
//                         <div className='row'>
//                           <div className='col-6'>
//                             <h5>Invoice No: {item.invoice_no}</h5>
//                           </div>
//                           <div className='col-6 text-end'>
//                             {' '}
//                             <h5>Date: {item.date}</h5>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>

//                     {item.invoice_child.map((item2) => {
//                       const distotal =
//                         item2.quantity * item2.rate - item2.discount;
//                       total += distotal;
//                       const subtotal = item2.quantity * item2.rate;
//                       total2 += subtotal;

//                       dis += item2.discount;
//                       return (
//                         <tr key={item2.id}>
//                           <td>{index + 1}</td>
//                           <td>{item2.item.name}</td>
//                           <td>{item2.item.pack}</td>
//                           <td>{item2.quantity}</td>
//                           <td>{item2.rate}</td>
//                           <td>{item2.quantity * item2.rate}</td>
//                           <td>{item2.discount}</td>
//                           <td>{distotal}</td>
//                         </tr>
//                       );
//                     })}
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <React.Fragment>
//                   <tr>
//                     <td>1</td>
//                     <td>{viewItem.item.name}</td>
//                     <td>{viewItem.item.pack}</td>
//                     <td>{viewItem.quantity}</td>
//                     <td>{viewItem.rate}</td>
//                     <td>{viewItem.amount}</td>
//                     <td>{viewItem.discount}</td>
//                     <td>{viewItem.total_amount}</td>
//                   </tr>
//                 </React.Fragment>
//               )}

//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total:
//                 </td>
//                 <td className='fw-bold'>{total2}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Discount:
//                 </td>
//                 <td className='fw-bold'>{dis}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total After Discount:
//                 </td>
//                 <td className='fw-bold'>{total}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// Viewnew.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   viewItem: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
// };

// export default Viewnew;

// import React from 'react';
// import PropTypes from 'prop-types';

// const Viewnew = ({ viewItem }) => {
// 	console.log(viewItem)
//   let total2 = 0;
//   let total = 0;
//   let dis = 0;

//   // Check if viewItem is an array, if not, convert it to an array with a single item
//   const items = Array.isArray(viewItem) ? viewItem : [viewItem];

//   return (
//     <div>
//       <div className='row g-4 mt-2'>
//         <div className='col-md-12'>
//           <table className='table col-md-12'>
//             <thead>
//               <tr>
//                 <th>S No</th>
//                 <th>Item</th>
//                 <th>Pack</th>
//                 <th>Qty</th>
//                 <th>Rate</th>
//                 <th>Amount</th>
//                 <th>Discount</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               {items.map((item, index) => (
//                 <React.Fragment key={item.id}>
//                   <tr>
//                     <td colSpan='8'>
//                       {' '}
//                       <div className='row'>
//                         <div className='col-6'>
//                           <h5>Invoice No: {item.invoice_no}</h5>
//                         </div>
//                         <div className='col-6 text-end'>
//                           {' '}
//                           <h5>Date: {item.date}</h5>
//                         </div>
//                       </div>
//                     </td>
//                   </tr>

//                   {item.invoice_child.map((item2) => {
//                     const distotal =
//                       item2.quantity * item2.rate - item2.discount;
//                     total += distotal;
//                     const subtotal = item2.quantity * item2.rate;
//                     total2 += subtotal;

//                     dis += item2.discount;
//                     return (
//                       <tr key={item2.id}>
//                         <td>{index + 1}</td>
//                         <td>{item2.item.name}</td>
//                         <td>{item2.item.pack}</td>
//                         <td>{item2.quantity}</td>
//                         <td>{item2.rate}</td>
//                         <td>{item2.quantity * item2.rate}</td>
//                         <td>{item2.discount}</td>
//                         <td>{distotal}</td>
//                       </tr>
//                     );
//                   })}
//                 </React.Fragment>
//               ))}

//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total:
//                 </td>
//                 <td className='fw-bold'>{total2}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Discount:
//                 </td>
//                 <td className='fw-bold'>{dis}</td>
//               </tr>
//               <tr>
//                 <td colSpan='7' className='fw-bold text-end'>
//                   {' '}
//                   Total After Discount:
//                 </td>
//                 <td className='fw-bold'>{total}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// Viewnew.propTypes = {
//   // eslint-disable-next-line react/forbid-prop-types
//   viewItem: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
// };

// export default Viewnew;

import React from 'react';
import PropTypes from 'prop-types';
// import WalkingIn from './WalkingIn';

const Viewnew = ({ viewItem }) => {
	console.log(viewItem);
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
							{/* Conditionally render SaleType1Data component */}
							{viewItem.sale_type === 1 ? (
								// <WalkingIn data={viewItem} />
								<>
									<tr>
										<td colSpan='8'>
											<div className='row'>
												<div className='col-6'>
													<h5>Invoice No: {viewItem.invoice_no}</h5>
												</div>
												<div className='col-6 text-end'>
													<h5>Date: {viewItem.date}</h5>
												</div>
											</div>
										</td>
									</tr>
									{viewItem.invoice_child.map((invoiceChildItem, index) => {
										const distotal =
											invoiceChildItem.quantity * invoiceChildItem.rate -
											invoiceChildItem.discount;
										total += distotal;
										const subtotal =
											invoiceChildItem.quantity * invoiceChildItem.rate;
										total2 += subtotal;

										dis += invoiceChildItem.discount;
										return (
											<tr key={invoiceChildItem.id}>
												<td>{index + 1}</td>
												<td>{invoiceChildItem.item.name}</td>
												<td>{invoiceChildItem.item.pack}</td>
												<td>{invoiceChildItem.quantity}</td>
												<td>{invoiceChildItem.rate}</td>
												<td>{invoiceChildItem.amount}</td>
												<td>{invoiceChildItem.discount}</td>
												<td>{invoiceChildItem.total_amount}</td>
											</tr>
										);
									})}
								</>
							) : (
								// Render the existing structure for other data
								viewItem.map((item, index) => (
									<React.Fragment key={item.id}>
										<tr>
											<td colSpan='8'>
												<div className='row'>
													<div className='col-6'>
														<h5>Invoice No: {item.invoice_no}</h5>
													</div>
													<div className='col-6 text-end'>
														<h5>Date: {item.date}</h5>
													</div>
												</div>
											</td>
										</tr>

										{item.invoice_child.map((invoiceChildItem, childIndex) => {
											const distotal =
												invoiceChildItem.quantity * invoiceChildItem.rate -
												invoiceChildItem.discount;
											total += distotal;
											const subtotal =
												invoiceChildItem.quantity * invoiceChildItem.rate;
											total2 += subtotal;

											dis += invoiceChildItem.discount;
											return (
												<tr key={invoiceChildItem.id}>
													<td>
														{index + 1}.{childIndex + 1}
													</td>
													<td>{invoiceChildItem.item.name}</td>
													<td>{invoiceChildItem.item.pack}</td>
													<td>{invoiceChildItem.quantity}</td>
													<td>{invoiceChildItem.rate}</td>
													<td>{invoiceChildItem.amount}</td>
													<td>{invoiceChildItem.discount}</td>
													<td>{invoiceChildItem.total_amount}</td>
												</tr>
											);
										})}
									</React.Fragment>
								))
							)}

							<tr>
								<td colSpan='7' className='fw-bold text-end'>
									Total:
								</td>
								<td className='fw-bold'>{total2}</td>
							</tr>
							<tr>
								<td colSpan='7' className='fw-bold text-end'>
									Discount:
								</td>
								<td className='fw-bold'>{dis}</td>
							</tr>
							<tr>
								<td colSpan='7' className='fw-bold text-end'>
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

// Viewnew.propTypes = {
// 	viewItem: PropTypes.arrayOf(
// 		PropTypes.shape({
// 			id: PropTypes.number.isRequired,
// 			invoice_id: PropTypes.number.isRequired,
// 			item: PropTypes.shape({
// 				name: PropTypes.string.isRequired,
// 				pack: PropTypes.string.isRequired,
// 			}).isRequired,
// 			quantity: PropTypes.number.isRequired,
// 			rate: PropTypes.number.isRequired,
// 			amount: PropTypes.number.isRequired,
// 			discount: PropTypes.number.isRequired,
// 			total_amount: PropTypes.number.isRequired,
// 			created_at: PropTypes.string.isRequired,
// 		}),
// 	).isRequired,
// };
Viewnew.propTypes = {
	viewItem: PropTypes.oneOfType([
	  PropTypes.arrayOf(
		PropTypes.shape({
		  id: PropTypes.number.isRequired,
		  invoice_id: PropTypes.number.isRequired,
		  item: PropTypes.shape({
			name: PropTypes.string.isRequired,
			pack: PropTypes.string.isRequired,
		  }).isRequired,
		  quantity: PropTypes.number.isRequired,
		  rate: PropTypes.number.isRequired,
		  amount: PropTypes.number.isRequired,
		  discount: PropTypes.number.isRequired,
		  total_amount: PropTypes.number.isRequired,
		  created_at: PropTypes.string.isRequired,
		  invoice_child: PropTypes.arrayOf(
			PropTypes.shape({
			  id: PropTypes.number.isRequired,
			  // Define other PropTypes for invoice_child properties here
			})
		  ).isRequired,
		})
	  ),
	  PropTypes.shape({
		invoice_no: PropTypes.string.isRequired,
		date: PropTypes.string.isRequired,
		invoice_child: PropTypes.arrayOf(
		  PropTypes.shape({
			id: PropTypes.number.isRequired,
			// Define other PropTypes for invoice_child properties here
		  })
		).isRequired,
	  }),
	]).isRequired,
  };

export default Viewnew;
