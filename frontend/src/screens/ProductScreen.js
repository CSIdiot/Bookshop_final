import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  ListGroupItem,
  Form,
} from 'react-bootstrap'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import {
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_DETAILS_RESET,
} from '../contents/productConstents'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Meta from '../components/Meta'

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    success: successProductReview,
    error: errorProductReview,
  } = productReviewCreate

  useEffect(() => {
    if (successProductReview) {
      alert('Comment Successfully！')
      setRating(0)
      setComment('')
    }
    if (
      !product._id ||
      product._id !== match.params.id ||
      successProductReview
    ) {
      dispatch({ type: PRODUCT_DETAILS_RESET })
      dispatch(listProductDetails(match.params.id))
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
    // eslint-disable-next-line
  }, [dispatch, match, successProductReview])
  //add to Cart --event
  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`)
  }

  //add Comment Content
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createProductReview(match.params.id, { rating, comment }))
  }
  return (
    <>
      <Link className='btn btn-dark my-3' to='/'>
        Go Home
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} Comments`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>Price：¥{product.price}</ListGroup.Item>
                <ListGroup.Item>Description：¥{product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price：</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Stock：</Col>
                      <Col>{product.countInStock > 0 ? 'In Store' : 'Out of Store'}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Count</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          {/* Comment Area */}
          <Row>
            <Col md={6}>
              <h2>Comment</h2>
              {product.reviews && product.reviews.length === 0 && (
                <Message>No Comment</Message>
              )}
              <ListGroup variant='flush'>
                {product.reviews &&
                  product.reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.name}</strong>
                      <Rating value={review.rating} />
                      <p>{review.createdAt.substring(0, 10)}</p>
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))}
                <ListGroup.Item>
                  <h2>Add Comment</h2>
                  {loadingProductReview && <Loader />}
                  {errorProductReview && (
                    <Message variant='danger'>{errorProductReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group>
                        <Form.Label>Grade：</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Pls Select grade...</option>
                          <option value='1'>1 - very unsatisfied</option>
                          <option value='2'>2 - unsatisfied</option>
                          <option value='3'>3 - general</option>
                          <option value='4'>4 - satisfied</option>
                          <option value='5'>5 - very satisfied</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment'>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please<Link to='/login'> Login </Link>,Then Add Comment?
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreen
