class Api::CategoriesController < ApplicationController
  def index
    @categories = Category.where("alias LIKE ?", search_term)
    render :index
  end

  def search_term
    term = params[:term].downcase.gsub(/[^a-z]/, "")
    term === "bars" ? "bars" : "%#{term}%"
  end
end
