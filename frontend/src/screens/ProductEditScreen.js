import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listProductDetails, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../contents/productConstents'

const ProductEditScreen = ({ match, history }) => {
  const productId = match.params.id

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  
  
    const [publisher, setPublisher] = useState('')
    const [publishDate, setPublishDate] = useState('')
	const [author, setAuthor] = useState('')
	const [language, setLanguage] = useState('')
    const [page, setPage] = useState(0)

  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productCreate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      history.push('/admin/productlist')
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId))
      } else {
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
		setPublisher(product.publisher)
		setPublishDate(product.publishDate)
		setAuthor(product.author)
		setLanguage(product.language)
		setPage(product.page)
      }
    }
  }, [dispatch, history, productId, product, successUpdate])
  //form submit
  const submitHandler = (e) => {
    e.preventDefault()
    //dispatch update product
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
		publisher,
		publishDate,
		page,
		author,
		language
      })
    )
  }

  //处理文件上传
  const uploadFileHandler = async (e) => {
    //获取用户选择上传的文件
    const file = e.target.files[0]
    //实例化formdata表单数据对象
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multerpart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.log(error)
      setUploading(false)
    }
  }
  return (
    <FormContainer>
      <Link to='/admin/productlist' className='btn btn-dark my-3'>
       Go Back
      </Link>
      <h1>Edit Product</h1>
      {loadingUpdate && <Loader />}
      {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name：</Form.Label>
            <Form.Control
              type='name'
              placeholder='Pls Input Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='price'>
            <Form.Label>Price(US$)：</Form.Label>
            <Form.Control
              type='text'
              placeholder='Pls Input Price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='image'>
            <Form.Label>Image：</Form.Label>
            <Form.Control
              type='text'
              placeholder='Image Path'
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.File
              id='image-file'
              label='Upload Image'
              custom
              onChange={uploadFileHandler}
            ></Form.File>
            {uploading && <Loader />}
          </Form.Group>
          {' '}
          <Form.Group controlId='countInStock'>
            <Form.Label>Inventory：</Form.Label>
            <Form.Control
              type='number'
              placeholder='Pls Input Inventory'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='description'>
            <Form.Label>Introduction：</Form.Label>
            <Form.Control
              type='text'
              placeholder='Pls Input Introduction'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>
		  
		  
		  
		  <Form.Group controlId='publisher'>
		    <Form.Label>Publisher：</Form.Label>
		    <Form.Control
		      type='text'
		      placeholder='Pls Input Publisher'
		      value={publisher}
		      onChange={(e) => setPublisher(e.target.value)}
		    ></Form.Control>
		  </Form.Group>
		  <Form.Group controlId='publishDate'>
		    <Form.Label>PublishDate：</Form.Label>
		    <Form.Control
		      type='text'
		      placeholder='Pls Input PublishDate'
		      value={publishDate}
		      onChange={(e) => setPublishDate(e.target.value)}
		    ></Form.Control>
		  </Form.Group>
		  <Form.Group controlId='author'>
		    <Form.Label>Author：</Form.Label>
		    <Form.Control
		      type='text'
		      placeholder='Pls Input Author'
		      value={author}
		      onChange={(e) => setAuthor(e.target.value)}
		    ></Form.Control>
		  </Form.Group>
		  <Form.Group controlId='language'>
		    <Form.Label>Language：</Form.Label>
		    <Form.Control
		      type='text'
		      placeholder='Pls Input Language'
		      value={language}
		      onChange={(e) => setLanguage(e.target.value)}
		    ></Form.Control>
		  </Form.Group>
		  
		  <Form.Group controlId='page'>
		    <Form.Label>Page：</Form.Label>
		    <Form.Control
		      type='text'
		      placeholder='Pls Input Page'
		      value={page}
		      onChange={(e) => setPage(e.target.value)}
		    ></Form.Control>
		  </Form.Group>
		  
		  
          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      )}
    </FormContainer>
  )
}

export default ProductEditScreen
