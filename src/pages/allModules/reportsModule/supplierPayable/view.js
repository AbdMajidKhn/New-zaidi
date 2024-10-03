
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import PropTypes from 'prop-types';
// import { updateSingleState } from '../../redux/tableCrud/index';
// import Spinner from '../../../../components/bootstrap/Spinner';
// import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
// import {
// 	CardBody,
// 	CardHeader,
// 	CardLabel,
// 	CardTitle,
// 	CardFooter,
// 	CardFooterRight,
// } from '../../../../components/bootstrap/Card';
// import Button from '../../../../components/bootstrap/Button';
// import Viewnew from './viewDetails';
// // import Checks from '../../../../components/bootstrap/forms/Checks';

// const View = ({ tableData, tableDataLoading }) => {
// 	const [viewItemLoading, setViewItemLoading] = useState(false);
// 	const dispatch = useDispatch();
// 	const store = useSelector((state) => state.tableCrud);
// 	const [perPage, setPerPage] = useState(Number(store.data.purchase.stockReport.perPage));

// 	useEffect(() => {
// 		dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
// 	}, [perPage]);

// 	const [editingItem, setEditingItem] = useState([]);
// 	const [stateView, setStateView] = useState(false);
// 	const [itemId, setItemId] = useState('');
// 	const [staticBackdropStatusView, setStaticBackdropStatusView] = useState(true);

// 	// const initialStatusView = () => {
// 	// 	setStaticBackdropStatusView(true);
// 	// };

// 	const handleStateView = (status) => {
// 		setStateView(status);
// 	};

// 	return (
// 		<>
// 			<CardBody className='table-responsive'>
// 				<table className='table table-modern'>
// 					<thead>
// 						<tr>
// 							{/* <th style={{ width: 50 }}>Select</th> */}
// 							<th>Sr. No</th>
// 							<th>Supplier</th>
// 							<th>Account</th>
// 							<th>Balance</th>
// 							{/* <th>Actions</th> */}
// 						</tr>
// 					</thead>
// 					<tbody>
// 						{tableData.map((item, index) => (
// 							<tr key={item.id}>
// 								<td>{index + 1}</td>
// 								<td>{item.person.name}</td>
// 								<td>{item.code} - {item.name}</td>
// 								<td>{item.balance ? item.balance.balance : 0}</td>
								
// 							</tr>
// 						))}
// 					</tbody>
// 				</table>
// 			</CardBody>
// 			<Modal
// 				isOpen={stateView}
// 				setIsOpen={setStateView}
// 				titleId='ViewVoucher'
// 				isStaticBackdrop={staticBackdropStatusView}
// 				size='lg'>
// 				<ModalHeader>
// 					<ModalTitle>
// 						<CardHeader>
// 							<CardLabel icon='Edit' iconColor='info'>
// 								<CardTitle>View Details</CardTitle>
// 								<small> Id: {itemId}</small>
// 							</CardLabel>
// 						</CardHeader>
// 					</ModalTitle>
// 				</ModalHeader>
// 				<ModalBody>
// 					<div className='row g-4'>
// 						<div className='col-12'>
// 							{viewItemLoading ? (
// 								<div className='d-flex justify-content-center'>
// 									<Spinner color='primary' size='5rem' />
// 								</div>
// 							) : (
// 								<Viewnew viewItem={editingItem} handleStateView={handleStateView} />
// 							)}
// 							<CardFooter>
// 								<CardFooterRight>
// 									<Button
// 										color='info'
// 										icon='cancel'
// 										isOutline
// 										className='border-0'
// 										onClick={() => setStateView(false)}>
// 										Cancel
// 									</Button>
// 								</CardFooterRight>
// 							</CardFooter>
// 						</div>
// 					</div>
// 				</ModalBody>
// 			</Modal>
// 		</>
// 	);
// };

// View.propTypes = {
// 	tableDataLoading: PropTypes.bool.isRequired,
// 	tableData: PropTypes.array.isRequired,
// };

// export default View;

import React from 'react';
// import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
// import { updateSingleState } from '../../redux/tableCrud/index';
// import Spinner from '../../../../components/bootstrap/Spinner';
// import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../../components/bootstrap/Modal';
import {
  CardBody,
  // CardHeader,
  // CardLabel,
  // CardTitle,
  // CardFooter,
  // CardFooterRight,
} from '../../../../components/bootstrap/Card';
// import Button from '../../../../components/bootstrap/Button';
// import Viewnew from './viewDetails';

const View = ({ tableData }) => {
  // const dispatch = useDispatch();

  // const [stateView, setStateView] = useState(false);
  // const [itemId, setItemId] = useState('');

  // const handleStateView = (status) => {
  //   setStateView(status);
  // };

  // useEffect(() => {
  //   dispatch(updateSingleState([perPage, 'purchase', 'stockReport', 'perPage']));
  // }, [dispatch, perPage]);

  return (
    <>
      <CardBody className='table-responsive'>
        <table className='table table-modern'>
          <thead>
            <tr>
              <th>Sr. No</th>
              <th>Supplier</th>
              <th>Account</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.person.name}</td>
                <td>{item.code} - {item.name}</td>
                <td>{item.balance ? item.balance.balance : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
      {/* <Modal
        isOpen={stateView}
        setIsOpen={setStateView}
        titleId='ViewVoucher'
        isStaticBackdrop={staticBackdropStatusView}
        size='lg'
      >
        <ModalHeader>
          <ModalTitle>
            <CardHeader>
              <CardLabel icon='Edit' iconColor='info'>
                <CardTitle>View Details</CardTitle>
                <small> Id: {itemId}</small>
              </CardLabel>
            </CardHeader>
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className='row g-4'>
            <div className='col-12'>
              {viewItemLoading ? (
                <div className='d-flex justify-content-center'>
                  <Spinner color='primary' size='5rem' />
                </div>
              ) : (
                <Viewnew viewItem={editingItem} handleStateView={handleStateView} />
              )}
              <CardFooter>
                <CardFooterRight>
                  <Button
                    color='info'
                    icon='cancel'
                    isOutline
                    className='border-0'
                    onClick={() => setStateView(false)}
                  >
                    Cancel
                  </Button>
                </CardFooterRight>
              </CardFooter>
            </div>
          </div>
        </ModalBody>
      </Modal> */}
    </>
  );
};

// View.propTypes = {
//   tableData: PropTypes.arrayOf(PropTypes.object).isRequired,
// };

View.propTypes = {
  tableData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      person: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      balance: PropTypes.shape({
        balance: PropTypes.number.isRequired,
      }),
    })
  ).isRequired,
};

export default View;
