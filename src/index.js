import './css/styles.css';

import Notiflix from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const infoCountry = document.querySelector('.country-info');
// const fetchCountries = new fetchCountries();

// очищуємо розмітку
function clearMarkup() {
    listCountry.innerHTML = ''; //отр. зміст HTMLелемена у вигляді рядка
    infoCountry.innerHTML = '';
}

inputCountry.addEventListener('input', debounce(onSubmitInput, DEBOUNCE_DELAY));

//функція пошуку країни
function onSubmitInput(evt) {
    const countriesList = evt.target.value.trim(); //отримуємо значення 
    if (!countriesList) { //якщо це не країна зі списку
        return;
    }
    fetchCountries(countriesList) //активуємо функцію зі списками країн
        //перевіряємо і обробляємо
        .then(country => {
            if (country.length > 10) {
                Notiflix.Notify.failure('Too many matches found. Please enter a more specific name.');
                resetMarkup();
            }
            else if (country.length <= 10 && country.length >= 2) {
                createMarkupForCountries(country);
            }
            else {
                createCardForCountry(country);
            }
        })
        .catch(error => {
            Notiflix.Notify.failure('Oops, there is no country with that name');
            clearMarkup();
        });
}

//будуємо розмітку
function createMarkupForCountries(countriesArray) { //розмітка для масиву країн
        const markup = countriesArray
        .map(({ name, flags }) => { //перебираємо масив з країнами і пов. масив результатів
            return`<li class="country_item">
        <img class="country_flag" src="${flags.svg}" alt="flags" width = "50" height = "30">
        <h2 class="country_name">${name.official}</h2> 
        </li>`;
        })
   .join(''); //перетв. рядок в масив
    clearMarkup();
    
    //вставляємо фрагмент HTML в element в кінець розмітки
   return listCountry.insertAdjacentHTML('beforeend', markup); 
    }

    function createCardForCountry(countriesArray) {
        const markup = countriesArray //масив країн
            .map(({ name, capital, population, flags, languages }) => {
                return `
            <div class="country_main">
        <img class="country_flag" src="${flags.svg}" alt="flags" width = "30" height = "20">
            <h2 >${name.official}</h2> 
            </div>            
            <ul class="country_info">
            <li class="country_item"> <b>Capital</b>:
          <span class="country_span">${capital}</span>
            </li>
            <li class="country_item"> <b>Population</b>:
          <span class="country_span">${population}</span>
            </li>
            <li class="country_item"> <b>Languages</b>:
          <span class="country_span">${Object.values(languages).join(', ')}</span>
            </li>
        </ul>`;
            })
            .join('');
        clearMarkup();
        return infoCountry.insertAdjacentHTML('beforeend', markup);
    }
