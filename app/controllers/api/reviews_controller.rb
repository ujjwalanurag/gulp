class Api::ReviewsController < ApplicationController
  def index
    @reviews = Review.joins(:business).where('reviews.business_id = ?', params[:businessId])
    render :index
  end

  def create
    @review = Review.new(
      business_id: params[:review][:businessId],
      user_id: params[:review][:userId],
      content: params[:review][:content],
      rating: params[:review][:rating]
    )

    if @review.save
      render "api/businesses/#{params[:businessId]}"
    else
      render(
        json: ['Invalid credentials'],
        status: 401
      )
    end
  end

  def destroy
  end
end
