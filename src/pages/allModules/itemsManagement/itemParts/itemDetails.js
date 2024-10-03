import React from 'react';
import PropTypes from 'prop-types';

const ViewDetails = ({ viewItem }) => {
	return (
		<div>
			<hr />
			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-3'>
					<h5>Name</h5>
					<p className='text-primary fw-bold'>{viewItem.name}</p>
				</div>
				<div className='col-md-3'>
					<h5>Strength</h5>
					<p className='text-primary fw-bold'>{viewItem.strength}</p>
				</div>
				<div className='col-md-3'>
					<h5>Pack Size</h5>
					<p className='text-primary fw-bold'>{viewItem.pack}</p>
				</div>
				<div className='col-md-3'>
					<h5>Rate</h5>
					<p className='text-primary fw-bold'>{viewItem.rate}</p>
				</div>
			</div>

			<hr />
			<br />

			<div className='row g-2 mt-1 ms-1 mb-5'>
				<div className='col-md-3'>
					<h5>Category</h5>

					{viewItem.category === null ? '' : viewItem.category.name}
				</div>
				<div className='col-md-3'>
					<h5>Sub Category</h5>
					<p className='text-primary fw-bold'>
						{viewItem.subcategory === null ? '' : viewItem.subcategory.name}
					</p>
				</div>
				<div className='col-md-3'>
					<h5>Nomenclature</h5>
					<p className='text-primary fw-bold'>
						{viewItem.nomenclature === null ? '' : viewItem.nomenclature}
					</p>
				</div>
				<div className='col-md-3'>
					<h5>Unit</h5>
					<p className='text-primary fw-bold'>
						{viewItem.unit === null ? '' : viewItem.unit.name}
					</p>
				</div>
			</div>
			<hr />
		</div>
	);
};
ViewDetails.propTypes = {
	// eslint-disable-next-line react/forbid-prop-types
	viewItem: PropTypes.object.isRequired,
};

export default ViewDetails;
