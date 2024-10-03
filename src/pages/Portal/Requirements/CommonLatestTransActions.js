// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable react/prop-types */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import Accordion, { AccordionItem } from '../../../components/bootstrap/Accordion';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import Spinner from '../../../components/bootstrap/Spinner';
import apiClient from '../../../baseURL/apiReqPortal';
import showNotification from '../../../components/extras/showNotification';
import { _titleSuccess, _titleError } from '../../../notifyMessages/erroSuccess';

import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import { priceFormat } from '../../../helpers/helpers';
import useDarkMode from '../../../hooks/useDarkMode';
import { demoPages } from '../../../menu';

const TransactionsItem = ({ name, date, description, countPending, countDone, countRejected }) => {
	const { darkModeStatus } = useDarkMode();

	const _status = 'warning';
	const status = 'Pending';
	// (status === 'Paid' && 'success') ||
	// (status === 'Pending' && 'warning') ||
	// (status === 'Failed' && 'danger');
	return (
		<div className='col-11'>
			<div className='row'>
				<div className='col d-flex align-items-center'>
					<div className='flex-grow-1'>
						<div className='fs-6'>{name}</div>
						<div className='text-muted'>
							<small>{description}</small>
						</div>
					</div>
				</div>
				<div className='col-auto text-end'>
					<div className='col d-flex align-items-center'>
						<div className='flex-shrink-100'>
							<div
								style={{ width: 50 }}
								className={classNames(
									`bg-l${
										darkModeStatus ? 'o25' : '10'
									}-${_status} text-${_status} fw-bold py-2 rounded-pill me-3 text-center`,
								)}>
								{countPending}
							</div>
						</div>
						<div className='flex-shrink-100'>
							<div
								style={{ width: 50 }}
								className={classNames(
									`bg-l${
										darkModeStatus ? 'o25' : '10'
									}-success text-success fw-bold py-2 rounded-pill me-3 text-center`,
								)}>
								{countDone}
							</div>
						</div>
						<div className='flex-shrink-100'>
							<div
								style={{ width: 50 }}
								className={classNames(
									`bg-l${
										darkModeStatus ? 'o25' : '10'
									}-danger text-danger fw-bold py-2 rounded-pill me-3 text-center`,
								)}>
								{countRejected}
							</div>
						</div>
					</div>
					<div className='text-muted'>
						{/* <small>Tax {priceFormat(tax)}</small> */}
						<small> {moment(date).format('DD/MM/YYYY')}</small>
					</div>
				</div>
			</div>
			<hr />
		</div>
	);
};
const CommentsItem = ({ description, updated_at, user, status_id }) => {
	const { darkModeStatus } = useDarkMode();
	let _status = 'warning';
	let status = 'Pending';
	if (status_id === 1) {
		_status = 'warning';
		status = 'Pending';
	}
	if (status_id === 2) {
		_status = 'success';
		status = 'Done';
	}
	if (status_id === 3) {
		_status = 'danger';
		status = 'Rejected';
	}

	// (status === 'Paid' && 'success') ||
	// (status === 'Pending' && 'warning') ||
	// (status === 'Failed' && 'danger');
	return (
		<div className='col-11'>
			<div className='row'>
				<div className='col d-flex align-items-center'>
					{/* <div className='flex-shrink-100'>
						<div
							style={{ width: 100 }}
							className={classNames(
								`bg-l${
									darkModeStatus ? 'o25' : '10'
								}-${_status} text-${_status} fw-bold py-2 rounded-pill me-3 text-center`,
							)}>
							{status}
						</div>
					</div> */}
					<div className='flex-grow-1'>
						<div className='fs-6'>{description}</div>
						<div className='text-muted'>
							<small>Posted By: {user.name}</small>
						</div>
					</div>
				</div>
				<div className='col-auto text-end'>
					<div>
						<strong>
							<div className='flex-shrink-100'>
								<div
									style={{ width: 100 }}
									className={classNames(
										`bg-l${
											darkModeStatus ? 'o25' : '10'
										}-${_status} text-${_status} fw-bold py-2 rounded-pill me-3 text-center`,
									)}>
									{status}
								</div>
							</div>
						</strong>
					</div>
					<div className='text-muted'>
						{/* <small>Tax {priceFormat(tax)}</small> */}
						<small> {moment(updated_at).format('DD/MM/YYYY')}</small>
					</div>
				</div>
			</div>
			<hr />
		</div>
	);
};

const CommonLatestTransActions = ({ data, refreshTableData }) => {
	const [newComment, setNewComment] = useState('');
	const [isLoading, setIsLoading] = useState('');
	const postComment = (id) => {
		if (newComment) {
			setIsLoading(true);
			apiClient
				.post(`/addTopicDescription`, { topic_id: id, description: newComment, user_id: 1 })
				.then((res) => {
					if (res.data.status === 'ok') {
						setNewComment('');

						refreshTableData();
						setIsLoading(false);
					} else {
						setIsLoading(false);
					}
					setIsLoading(false);
				})
				.catch((err) => {
					setIsLoading(false);

					setIsLoading(false);
				});
		}
	};
	return (
		<Card stretch>
			<CardHeader>
				<CardLabel>
					<CardTitle>Latest Updates</CardTitle>
				</CardLabel>
				<CardActions>
					{/* <Button
						color='info'
						isLink
						icon='Summarize'
						tag='a'
						to={`../${demoPages.sales.subMenu.transactions.path}`}>
						All Transactions
					</Button> */}
				</CardActions>
			</CardHeader>
			{/* <CardBody isScrollable> */}
			<CardBody>
				<div className='col-12'>
					<div className='row'>
						<div className='col align-items-center'>
							<Accordion id='accSample2' activeItemId={false} shadow='lg'>
								{data.map((i, index) => (
									<AccordionItem
										id={`item2${index}`}
										// eslint-disable-next-line react/no-array-index-key
										key={`item2${index}`}
										// icon='Person'
										// eslint-disable-next-line react/destructuring-assignment
										title={<TransactionsItem key={i.id} {...i} />}>
										{i?.topic_child?.map((ii) => (
											// eslint-disable-next-line react/jsx-props-no-spreading
											<CommentsItem key={ii.id} {...ii} />
										))}
										<div className='row'>
											<div className='col-9'>
												<FormGroup
													id='exampleTypesPlaceholder--textarea'
													label='New Comment'
													formText={
														<>
															Type your queries here
															<b>(Requirements)</b>
														</>
													}
													isColForLabel
													labelClassName='col-sm-2 text-capitalize'
													childWrapperClassName='col-sm-10'>
													<Textarea
														onChange={(e) => {
															setNewComment(e.target.value);
														}}
														value={newComment}
														className='col-8'
														placeholder='Type your queries here'
														aria-label='.form-control-lg example'
													/>
												</FormGroup>
												{/* <CardFooterRight> */}

												{/* </CardFooterRight> */}
											</div>
											<div className='col-3'>
												<Button
													className='me-3'
													icon={isLoading ? null : 'Post'}
													isLight
													color='primary'
													isDisable={isLoading}
													onClick={() => postComment(i.id)}>
													{isLoading && <Spinner isSmall inButton />}
													{isLoading ? 'Posting' : 'Post'}
												</Button>
											</div>
										</div>
										<hr />
									</AccordionItem>
								))}
							</Accordion>
						</div>
					</div>
				</div>
				{/* <div className='row g-4'>
					{data.map((i) => (
						// eslint-disable-next-line react/jsx-props-no-spreading
						<TransactionsItem key={i.id} {...i} />
					))}
				</div> */}
			</CardBody>
		</Card>
	);
};

export default CommonLatestTransActions;
