const BASE_URL = 'https://restcountries.com/v3.1/';
let data = [];

async function get_all() {
  const url = BASE_URL + 'all?fields=name,capital,currencies,population,capital,region,subregion,languages,tld,flags';

  const res = await fetch(url);
  const j = await res.json();

  data = j;
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
    nm.textContent = data[i].name.common;

    const list = document.createElement('ul');
    const pop = document.createElement('li');
    const cur = document.createElement('li');
    const reg = document.createElement('li');

    pop.textContent = `Population: ${(+data[i].population).toLocaleString()}`;
    cur.textContent = `Capital: ${data[i].capital[0]}`;
    reg.textContent = `Region: ${data[i].region}`;

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
