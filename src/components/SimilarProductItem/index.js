// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {id, title, brand, rating, price} = productDetails
  return (
    <li className="similar-product-item">
      <img src={productDetails.image_url} alt="similar product" />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div className="price-rating-tab">
        <p>Rs {price}/-</p>
        <div className="rating-tab">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
