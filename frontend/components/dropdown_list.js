import React from 'react';
import DropdownItem from './dropdown_item';
import _ from 'lodash';

const DropdownList = props => {
  let { searchTerm, allTitles } = props.searchResults;
  let titles = (searchTerm === "" ? [] : bestTitles(searchTerm, allTitles));
// console.log(titles);

  return (
    <ul id="search-results">
      { dropdownItems(titles) }
    </ul>
  );
};

const defaultSuggestions = [
  "Fresh Juice",
  "Coffee",
  "Happy Hour",
  "Bubble Tea",
  "Kava Lounge",
  "Wine Tasting"
];

const bestTitles = (searchTerm, allTitles)  => (
  _.uniq([].concat(exactMatches(searchTerm, allTitles))
    .concat(goodMatches(searchTerm, allTitles))
    .concat(defaultSuggestions).slice(0, 5))
);

const exactMatches = (searchTerm, allTitles) => {
  let result = [];
  let searchTermAlias = searchTerm.toLowerCase().replace(/[^0-9a-z]/g, "");

  allTitles.forEach( title => {
    let titleAlias = title.toLowerCase().replace(/[^0-9a-z]/g, "");
    let isExactMatch = (titleAlias === searchTermAlias);
    if (isExactMatch) result.push(title);
  });

  // console.log("exactMatches:");
  // console.log(result);
  return result;
};

const goodMatches = (searchTerm, allTitles) => {
  let titlesWithMatchingWord = [];
  let titlesWithSimilarWord = [];

  let searchWords = searchTerm.toLowerCase().split(/[^0-9a-z]/g);
  searchWords = searchWords.filter( word => word !== "");
console.log("searchWords:");
console.log(searchWords);

console.log("allTitles:");
console.log(allTitles);
  allTitles.forEach( title => {
    console.log("title:");
    console.log(title);
    let titleWords = title.toLowerCase().split(/[^0-9a-z]/g);

    let isMatchingWord = word => Boolean(searchWords.includes(word));
    let isSimilarWord = titleWord => {
      return searchWords.some( searchWord => {
        return titleWord.match(searchWord) && titleWord.match(searchWord).index === 0
      });
    };

    let hasMatchingWord = titleWords.some(word => isMatchingWord(word));
    let hasSimilarWord = titleWords.some(word => isSimilarWord(word));

    if (hasMatchingWord) titlesWithMatchingWord.push(title);
    if (hasSimilarWord) titlesWithSimilarWord.push(title);


  });
  console.log("titlesWithSimilarWord:");
  console.log(titlesWithSimilarWord);

  console.log("titlesWithMatchingWord:");
  console.log(titlesWithMatchingWord);

  return _.uniq(titlesWithMatchingWord.concat(titlesWithSimilarWord));
};

const dropdownItems = (titles) => (
  titles.map(title => {
    return <DropdownItem searchResultTitle={ title } key={ title }/>;
  })
);

export default DropdownList;
