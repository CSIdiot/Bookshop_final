import React, { useState, useEffect } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import { Link } from 'react-router-dom'
import {
  Form,
  Button,
  ListGroup,
  Row,
  Col,
  Image,
  Card,
  Modal,
} from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from '../actions/orderActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import axios from 'axios'
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from '../contents/orderContents'
import { v4 as uuidv4 } from 'uuid'

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [image, setImage] = useState('')
  const [text, setText] = useState('plz scan')
  //SDK
  const [SDK, setSDK] = useState(false)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { loading: loadingPay, error: errorPay, success: successPay } = orderPay

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver

  //calculate total price
  if (!loading) {
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2)
    }
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    )
  }
  useEffect(() => {
    //dynamic create paypalscript
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get('/api/config/paypal')
      console.log(clientId)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true

      script.onload = () => {
        setSDK(true)
      }
      document.body.appendChild(script)
    }
    if (!userInfo) {
      history.push('/login')
    }
    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSDK(true)
      }
    }

    // eslint-disable-next-line
  }, [dispatch, history, userInfo, order, orderId, successPay, successDeliver])



  const handleClose = () => {
    setShow(false)
  }

  const handlePayment = () => {
    //wechat
    setImage('https://www.thenewstep.cn/pay/index.php?' + 'pid=' + order._id)
    setShow(true)

    //set up timer see payment
    let timer = setInterval(() => {
      //????????????status
      axios.get('/status').then((res) => {
        //????????????????????????
        const paymentResult = {
          id: uuidv4(),
          status: 2,
          updata_time: Date.now(),
          email_address: order.user.email,
        }
        //???????????????????????????
        dispatch(payOrder(orderId, paymentResult))
        setText('Pay successfully???Waiting for Shipping')
        setShow(false)
        clearTimeout(timer)
      })
    }, 1000)
  }

  //??????paypal??????btn?????????
  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
  }

  //??????????????????btn?????????
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }
  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <h1>Order No???{order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping Address</h2>
              <p>
                <strong>Recipient Address???</strong>
              </p>
              <p>
                <strong>Name:</strong>
                {order.user.name}
              </p>
              <p>
                {' '}
                <strong>Address:</strong>
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                {order.shippingAddress.province},{order.shippingAddress.city},
                {order.shippingAddress.address},
                {order.shippingAddress.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivery Time???{order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Unshipped</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Payment Method???</strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Payment Time???{order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Unpaid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2> Product Order</h2>
              {order.orderItems.length === 0 ? (
                <Message>Shopping cart empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} X {item.price} = {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Orderdetail</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col> Price</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Freight</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>total prices</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* PayPal??????BTN */}
              {!order.isPaid && order.paymentMethod === 'PayPal' && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!SDK ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    ></PayPalButton>
                  )}
                </ListGroup.Item>
              )}
              {!order.isPaid && order.paymentMethod === '??????' && (
                <ListGroup.Item>
                  {/* ????????????BTN */}
                  <Button
                    type='button'
                    className='btn-block'
                    onClick={handlePayment}
                    disabled={order.orderItems === 0}
                  >
                    Go Pay
                  </Button>
                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Order No???{order._id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p>Payment Amount??? ??{order.totalPrice}</p>
                      <p>Payment Method??? {order.paymentMethod}</p>
                      <Row>
                        <Col md={6} style={{ textAlign: 'center' }}>
                          <Image src={image} />
                          <p
                            style={{
                              backgroundColor: '#00C800',
                              color: 'white',
                            }}
                          >
                            {text}
                          </p>
                        </Col>
                        <Col>
                          <Image src='/images/saoyisao.jpg' />
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant='primary' onClick={handleClose}>
                        Close
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </ListGroup.Item>
              )}

              {/* ??????BTN */}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn-block'
                      onClick={deliverHandler}
                    >
                      Go Ship
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default OrderScreen
