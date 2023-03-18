import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';
import listCountry from './templates/list-country.hbs';
import countryInfo from './templates/country-info.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchArray: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.searchArray.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function onInputCountry() {
  const countryName = refs.searchArray.value.trim();
  if (!countryName) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(countryName)
    .then(countrys => {
      if (countrys.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
      }

      if (countrys.length >= 2) {
        const listMarkup = countrys.map(country => listCountry(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countrys.length === 1) {
        const markup = countrys.map(country => countryInfo(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
        console.log(markup);
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}

// function listCountry({ flags, name }) {
//   return `<li class='list-item'>
//   <img class='img-item' src='${flags.svg}' alt='${name.official}' width='30' />
//   <span>${name.official}</span>
// </li>`;
// }

// function countryInfo({ flags, name, capital, population, languages }) {
//   return `<div class='country-info-box'>
//   <img
//     class='country-info__icon'
//     src='${flags.svg}'
//     alt='${name.official}'
//     width='50'
//   />
//   <h2 class='title'>${name.official}</h2>

//   <p class='country-info__description'><span>Capital:</span>
//     ${capital}</p>
//   <p class='country-info__description'><span>Population:</span>
//     ${population}$</p>
//   <p class='country-info__description'><span>Languages:</span>
//     ${Object.values(languages)}
//   </p>
// </div>`;
// }
