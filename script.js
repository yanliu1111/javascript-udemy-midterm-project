'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();
    // we are gone catch event listener to DOM element, so we need to bind this to the method
    form.addEventListener('submit', this._newWorkout.bind(this)); //this would point form element, no longer App element
    inputType.addEventListener('change', this._toggleElevationField); //no need to bind this, because it is not a method call, it is a regular function call
  }
  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this), //callback function, to the position argument(line27); _loadmap is regular function call not a method call; if it is regular function call, this is undefined, so bind this to the function
        function () {
          alert('Could not get your position');
        }
      );
    }
  }
  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude}`);
    const coords = [latitude, longitude];
    console.log(this);
    this.#map = L.map('map').setView(coords, 13);
    //L is namespace for leaflet library
    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this)); //bind this to the method
  }
  _showForm(mapE) {
    this.#mapEvent = mapE; //try to write mapEvent on the map object
    form.classList.remove('hidden');
    inputDistance.focus();
    //console.log(mapEvent);
    const { lat, lng } = this.#mapEvent.latlng;
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden'); //closest is used to select the parent element
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }
  _newWorkout(e) {
    e.preventDefault();

    // Clear input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';
    //display marker
    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        })
      )
      .setPopupContent('Workout')
      .openPopup();
  }
}

const app = new App(); //when app is called, the constructor is called simultaneously, so put the _getPosition() method in the constructor
