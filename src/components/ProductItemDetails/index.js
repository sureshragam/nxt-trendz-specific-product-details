// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstrains = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    cartCount: 1,
    productDetails: '',
    apiStatus: apiStatusConstrains.initial,
  }

  componentDidMount() {
    const {match} = this.props
    const {id} = match.params
    console.log(id)
    this.getProductItemDetails(id)
  }

  onSuccessFetch = data => {
    console.log(data)
    const updatedData = {
      id: data.id,
      availability: data.availability,
      brand: data.brand,
      description: data.description,
      imageUrl: data.image_url,
      rating: data.rating,
      price: data.price,
      similarProducts: data.similar_products,
      style: data.style,
      title: data.title,
      totalReviews: data.total_reviews,
    }

    this.setState({
      productDetails: updatedData,
      apiStatus: apiStatusConstrains.success,
    })
  }

  onFailureFetch = () => this.setState({apiStatus: apiStatusConstrains.failure})

  getProductItemDetails = async id => {
    const url = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      this.onSuccessFetch(data)
    } else {
      console.log('enter')
      this.onFailureFetch()
    }
  }

  onDecrement = () => {
    const {cartCount} = this.state
    if (cartCount > 1) {
      this.setState(prevState => ({cartCount: prevState.cartCount - 1}))
    }
  }

  onIncrement = () =>
    this.setState(prevState => ({cartCount: prevState.cartCount + 1}))

  renderFailureView = () => (
    <div className="error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button type="button" onClick={this.onClickContinue}>
        Continue Shopping
      </button>
    </div>
  )

  onClickContinue = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSuccessView = () => {
    const {productDetails, cartCount} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      totalReviews,
      brand,
      availability,
      rating,
      similarProducts,
    } = productDetails

    return (
      <>
        <div className="product-item-details-row-1">
          <div className="product-item-details-row-1-col-1">
            <img src={imageUrl} alt="product" />
          </div>
          <div className="product-item-details-row-1-col-2">
            <h1>{title}</h1>
            <p>Rs {price}/-</p>
            <div className="rating-review-tab">
              <div className="rating-tab">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                />
              </div>

              <p className="review">{totalReviews} Reviews</p>
            </div>
            <p>{description}</p>
            <p>
              <span>Available: </span> {availability}
            </p>
            <p>
              <span>Brand: </span> {brand}
            </p>
            <hr />
            <div className="add-cart-buttons-container">
              <button
                type="button"
                onClick={this.onDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="minus" />
              </button>

              <p>{cartCount}</p>
              <button
                type="button"
                data-testid="plus"
                onClick={this.onIncrement}
              >
                <BsPlusSquare className="plus" />
              </button>
            </div>
            <button type="button" className="cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>

        <ul className="product-item-details-row-2">
          {similarProducts.map(eachProduct => {
            const {id} = eachProduct
            return <SimilarProductItem key={id} productDetails={eachProduct} />
          })}
        </ul>
      </>
    )
  }

  renderView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstrains.initial:
        return this.renderLoadingView()
      case apiStatusConstrains.success:
        return this.renderSuccessView()
      case apiStatusConstrains.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-item-details-container">
        <Header className="header" />
        {this.renderView()}
      </div>
    )
  }
}
export default ProductItemDetails
