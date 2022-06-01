const BASE_URL = 'https://restcountries.com/v3.1/';
let data = [];

async function get_all() {
  const url = BASE_URL + 'all?fields=name,capital,currencies,population,capital,region,subregion,languages,tld,flags';

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
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  }
}

function search() {
  const cards = document.querySelectorAll('.country_card');
  const input = document.querySelector('#search');
  const txt = input.value.toUpperCase();

  for (let card of cards) {
    const nm = card.querySelector('h2.name').textContent;
    if (nm.toUpperCase().indexOf(txt) > -1) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  }
}

function home() {
  const home_panel = document.getElementById('home');

  if (!data) return;

  const len = data.length;

  for (let i = 0; i < len; ++i) {
    const el = document.createElement('div');
    el.setAttribute('class', 'country_card');

    const flag = document.createElement('img');
    flag.setAttribute('src', data[i].flags.png);
    flag.setAttribute('class', 'flag');

    const nm = document.createElement('h2');
    nm.setAttribute('class', 'name');
    nm.textContent = data[i].name.common;

    const list = document.createElement('ul');
    const pop = document.createElement('li');
    const cur = document.createElement('li');
    const reg = document.createElement('li');

    pop.textContent = `Population: ${(+data[i].population).toLocaleString()}`;
    cur.textContent = `Capital: ${data[i].capital[0]}`;
    reg.textContent = `Region: ${data[i].region}`;
    reg.setAttribute('class', 'region');

    list.appendChild(pop);
    list.appendChild(cur);
    list.appendChild(reg);

    el.appendChild(flag);
    el.appendChild(nm);
    el.appendChild(list);
    home_panel.appendChild(el);
  }

  return 0;
}

get_all().then(home);
