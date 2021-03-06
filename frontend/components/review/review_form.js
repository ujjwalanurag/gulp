import React from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import { withRouter } from 'react-router';

import { starsImgUrl } from '../yelp/stars';
import ErrorMsgs from '../error_msgs';

class ReviewForm extends React.Component {
  constructor(props) {
    super(props);

    this.starsImgUrl = starsImgUrl[this.props.currentReview.rating];

    this.nullState = {
      review: {
        id: null,
        content: '',
        rating: 0,
        userId: (props.currentUser ? props.currentUser.id : ''),
        businessId: props.businessId
      }
    };

    this.state = this.nullState;

    this.renderSubmitBtn = this.renderSubmitBtn.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRatingMouseOver = this.handleRatingMouseOver.bind(this);
    this.handleRatingMouseOut = this.handleRatingMouseOut.bind(this);
    this.handleRatingClick = this.handleRatingClick.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.currentReview.id, this.state.id)) {
      this.setState(this.props.currentReview);
      this.starsImgUrl = starsImgUrl[this.props.currentReview.rating];
    }
  }

  handleRatingMouseOver(e){
    const num = e.target.innerHTML;
    document.getElementById('stars-img').src = starsImgUrl[num];
  }

  handleRatingMouseOut(e){
    if (this.starsImgUrl === starsImgUrl[0]) {
      document.getElementById('stars-img').src = starsImgUrl[0];
    } else {
      document.getElementById('stars-img').src = this.starsImgUrl;
    }
  }

  handleRatingClick(e){
    const num = e.target.innerHTML;
    this.setState({ rating: num });
    this.starsImgUrl = starsImgUrl[num];
  }

  renderSubmitBtn(isLoggedIn){
    if (isLoggedIn) {
      return (
        <div className='review-form-end'>
          <input
            className="gray-btn review-form-submit"
            type="submit"
            value={`${window.location.hash.match('edit')? 'Edit' : 'Submit'} Review`} />
        </div>
      );
    } else {
      return (
        <div className='review-form-end'>
          Wanna write a review? {<Link to="login">Log in</Link>} or {<Link to="signup">sign up</Link>}
        </div>
      );
    }
  }

  renderRatingInput(isLoggedIn){
    if (isLoggedIn) {
      return (
        <div
          id="rating-mouseover-numbers"
          onMouseOut={this.handleRatingMouseOut}>
          <span
            onMouseOver={this.handleRatingMouseOver}
            onClick={this.handleRatingClick}>1</span>
          <span
            onMouseOver={this.handleRatingMouseOver}
            onMouseOut={this.handleRatingOMouseut}
            onClick={this.handleRatingClick}>2</span>
          <span
            onMouseOver={this.handleRatingMouseOver}
            onClick={this.handleRatingClick}>3</span>
          <span
            onMouseOver={this.handleRatingMouseOver}
            onClick={this.handleRatingClick}>4</span>
          <span
            onMouseOver={this.handleRatingMouseOver}
            onClick={this.handleRatingClick}>5</span>
        </div>
      );
    }
  }

  handleSubmit(e){
    e.preventDefault();

    let submitFunction;
    if(window.location.hash.match('edit')) {
      submitFunction = this.props.editReview;
    } else {
      submitFunction = this.props.createReview;
    }

    submitFunction(this.state)
      .then( () => {
        this.starsImgUrl = starsImgUrl[0];
        this.props.clearReviewErrors();
        this.setState({
          id: null,
          businessId: this.state.businessId,
          userId: this.state.userId,
          content: '',
          rating: 0
      });
    }).then( () => this.props.refreshUser(this.props.currentUser.id))
    .then( () => {
      this.props.router.replace(`business/${this.props.businessId}`);
  });
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  render() {
    let isLoggedIn = this.props.currentUser;
    if (this.state) {
      return (
        <div
          className={`review-form-section ${this.props.className ? this.props.className : ''}`}>

          <h2>Write a Review</h2>
          <ErrorMsgs id='review-errors' errors={this.props.errors} />
          <div className="review-form">
            <form onSubmit={ e => this.handleSubmit(e)}>
              <input
                type='hidden'
                value={this .state.userId}
                />

              <input
                type='hidden'
                value={this.state.businessId}
                />

              <div id='review-form-stars'>
                <img id='stars-img' src={this.starsImgUrl} />
                {this.renderRatingInput(isLoggedIn)}
              </div>

              <br/>

              <textarea
                className='review-form-content'
                type='text'
                value={this.state.content}
                onChange={this.update("content")}
                placeholder='Holy flying fruitcakes! This place is totes my new favorite sodales tellus justo, laoreet consectetur enim ultricies id.'
                disabled={isLoggedIn ? false : 'disabled'} />

              <br/>

              {this.renderSubmitBtn(isLoggedIn)}

              <br/>
            </form>
          </div>
        </div>
      );
    }

  }

}

export default withRouter(ReviewForm);
