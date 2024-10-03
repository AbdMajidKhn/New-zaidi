// SaleType1Data.js
import React from 'react';
import PropTypes from 'prop-types';

const WalkingIn = ({ data }) => {
    // console.log(data)
  return (
    <div>
      <h5>Invoice No: {data.invoice_no}</h5>
      <table className=''>
        <tbody>
        {data.invoice_child.map((invoiceChildItem, index) => (
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
              ))}
        </tbody>
      </table>
    </div>
  );
};

WalkingIn.propTypes = {
  data: PropTypes.shape({
    invoice_no: PropTypes.string.isRequired,
    invoice_child: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        item: PropTypes.shape({
          name: PropTypes.string.isRequired,
          pack: PropTypes.string.isRequired,
        }).isRequired,
        quantity: PropTypes.number.isRequired,
        rate: PropTypes.number.isRequired,
        amount: PropTypes.number.isRequired,
        discount: PropTypes.number.isRequired,
        total_amount: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default WalkingIn;
