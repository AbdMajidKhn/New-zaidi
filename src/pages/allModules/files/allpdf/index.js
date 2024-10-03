// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable prettier/prettier */
// eslint-disable-next-line eslint-comments/disable-enable-pair
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import classNames from 'classnames';
import GeneratePDF from './purchasepdf';
import GeneratePDF2 from './ReportPurchases';
import GeneratePDF3 from './ReportSales';
import Button from '../../../../components/bootstrap/Button';
import PageWrapper from '../../../../layout/PageWrapper/PageWrapper';
import Page from '../../../../layout/Page/Page';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import Spinner from '../../../../components/bootstrap/Spinner';
import dataDummyPurchase from './dummyData/ReportPurchases';
import dataDummySale from './dummyData/ReportSales';
import GeneratePDF4 from './newpdf';
import GeneratePDF5 from './salenservice';
import GeneratePDF6 from './manufacture';
import GeneratePDF7 from './nationaltax';

const Files = () => {
	const [isPrintAllReportLoading, setIsPrintAllReportLoading] = useState(false);
	const printReportAll = (docType) => {
		GeneratePDF(docType);
	};

	const printReportAll2 = (docType) => {
		GeneratePDF2(dataDummyPurchase, docType, '', '', '');
	};
	const printReportAll3 = (docType) => {
		GeneratePDF3(dataDummySale, docType, '', '', '');
	};
	const printReportAll4 = (docType) => {
		GeneratePDF4(docType);
	};
	const printReportAll5 = (docType) => {
		GeneratePDF5(docType);
	};
	const printReportAll6 = (docType) => {
		GeneratePDF6(docType);
	};
	const printReportAll7 = (docType) => {
		GeneratePDF7(docType);
	};
	return (
		<PageWrapper>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-12'>
						<Card>
							<CardBody>
								{/* <div className='row g-4'>
									<FormGroup className='col-md-2' label='Category'>
										<Select
											ariaLabel='Default select example'
											placeholder='Open this select menu'
											onChange={(e) => {
												setCategoryOptionsSelected({
													value: e.target.value,
												});
											}}
											value={categoryOptionsSelected.value}
											list={categoryOptions}
										/>
									</FormGroup>
								</div> */}
								<br />

								<br />
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Purchase Order Report'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll2(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Purchase Report'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll3(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Sale Report'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll4(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Dummmy Report 2'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll5(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Sale N Service Report 1'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll6(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'Manufacture Report 3'}
									</Button>
								</div>
								<div className='row g-4 d-flex align-items-end justify-content-start'>
									<Button
										color='primary'
										// isLight={darkModeStatus}
										className={classNames('text-nowrap', {
											'col-md-2 border-light': true,
										})}
										icon={!isPrintAllReportLoading && 'FilePdfFill'}
										isDisable={isPrintAllReportLoading}
										onClick={() => printReportAll7(2)}>
										{isPrintAllReportLoading && <Spinner isSmall inButton />}
										{isPrintAllReportLoading
											? 'Generating PDF...'
											: 'National Report 4'}
									</Button>
								</div>
							</CardBody>
						</Card>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Files;
