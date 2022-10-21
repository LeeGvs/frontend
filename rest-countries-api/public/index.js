const BASE_URL = 'https://restcountries.com/v3.1/';
let data = [];
let country_lookup = {};

async function get_all() {
  const url =
    BASE_URL +
    'all?fields=name,capital,currencies,population,capital,region,subregion,languages,tld,flags,borders,cca3';

  const res = await fetch(url);
  const j = await res.json();

  data = j;
}

function filter_region() {
  const cards = document.querySelectorAll('.country_card');
  const input = document.querySelector('#filter');
  const txt = input.value.toUpperCase();

  for (let card of cards) {
    const nm = card.querySelector('.region').textContent;
    if (txt === '-1' || nm.toUpperCase().indexOf(txt) > -1) {
      card.classList.remove('filtered');
    } else {
      card.classList.add('filtered');
    }
  }
}

function search() {
  const filter = document.querySelector('#filter').value.toUpperCase();
  const cards = document.querySelectorAll('.country_card' + (filter === '-1' ? '' : ':not(.filtered)'));
  const txt = document.querySelector('#search').value.toUpperCase();

  for (let card of cards) {
    const nm = card.querySelector('h2.name').textContent;
    if (nm.toUpperCase().indexOf(txt) > -1) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  }
}

function detail(id) {
  const home_panel = document.querySelector('#home');
  const detail_panel = document.querySelector('#detail');

  console.log(id, data[id].name.common);

  // load data into detail
  document.querySelector(
    '.detail__flag'
  ).innerHTML = `<img src="${data[id].flags.svg}" alt="flag of ${data[id].name.common}" />`;

  document.querySelector('.detail__name').textContent = data[id].name.common;
  document.querySelector('#det_native').textContent = data[id].name.native;
  document.querySelector('#det_population').textContent = (+data[id].population).toLocaleString();
  document.querySelector('#det_region').textContent = data[id].region;
  document.querySelector('#det_sub_region').textContent = data[id].subregion;
  document.querySelector('#det_capital').textContent = data[id].capital;
  document.querySelector('#det_tld').textContent = data[id].tld;
  document.querySelector('#det_currency').textContent = Object.keys(data[id].currencies).join(', ');
  document.querySelector('#det_languages').textContent = Object.keys(data[id].languages).join(', ');

  const borders = document.querySelector('#det_borders');
  borders.innerHTML = '';
  const len = data[id].borders.length;
  if (len != 0) {
    for (let i = 0; i < len; ++i) {
      const border_data_id = country_lookup[data[id].borders[i]];
      const border = document.createElement('button');
      border.classList.add('detail__btn');
      border.textContent = data[border_data_id].name.common;
      border.setAttribute('onclick', `detail(${border_data_id});`);
      borders.appendChild(border);
    }
  } else {
    borders.innerHTML = 'None';
  }

  //borders;
  // show detail + hide home
  detail_panel.classList.remove('hidden');
  home_panel.classList.add('hidden');
}

function detail_back() {
  const home_panel = document.querySelector('#home');
  const detail_panel = document.querySelector('#detail');

  home_panel.classList.remove('hidden');
  detail_panel.classList.add('hidden');
}

function home() {
  const home_panel = document.getElementById('home_panel');

  if (!data) return;

  const len = data.length;

  for (let i = 0; i < len; ++i) {
    const el = document.createElement('div');
    el.classList.add('country_card');
    el.setAttribute('onclick', `detail(${i});`);

    const flag = document.createElement('img');
    flag.setAttribute('src', data[i].flags.png);
    flag.classList.add('flag');

    const info = document.createElement('div');
    info.classList.add('q');

    const nm = document.createElement('h2');
    nm.classList.add('name');
    nm.textContent = data[i].name.common;

    const list = document.createElement('ul');
    const pop = document.createElement('li');
    const cur = document.createElement('li');
    const reg = document.createElement('li');

    pop.textContent = `Population: ${(+data[i].population).toLocaleString()}`;
    cur.textContent = `Capital: ${data[i].capital[0]}`;
    reg.textContent = `Region: ${data[i].region}`;
    reg.classList.add('region');
    info.appendChild(nm);
    info.appendChild(list);

    list.appendChild(pop);
    list.appendChild(cur);
    list.appendChild(reg);

    el.appendChild(flag);
    el.appendChild(info);
    home_panel.appendChild(el);

    country_lookup[data[i].cca3] = i;
  }

  return 0;
}

get_all().then(home);
