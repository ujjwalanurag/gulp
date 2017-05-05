import React from 'react';
import ReviewIndex from './review_index';
import ReviewForm from './review_form';

class ReviewSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      review: {
        content: '',
        rating: '',
        userId: (props.currentUser ? props.currentUser.id : ''),
        businessId: props.businessId
      }
    };

    this.sendReviewForEdit = this.sendReviewForEdit.bind(this);
  }

  sendReviewForEdit(review){
    this.setState({review: review});
  }

  render() {
    return (
      <div className="review-section">
        <ReviewForm
          currentUser={this.props.currentUser}
          createReview={this.props.createReview}
          errors={this.props.errors}
          clearReviewErrors={this.props.clearReviewErrors}
          currentReview={this.state.review}
          deleteReview={this.props.deleteReview}/>
        <ReviewIndex
          reviews={this.props.reviews}
          fetchUser={this.props.fetchUser}
          currentUser={this.props.currentUser}
          deleteReview={this.props.deleteReview}
          sendReviewForEdit={this.sendReviewForEdit}/>
      </div>
    );
  }

}

export default ReviewSection;
