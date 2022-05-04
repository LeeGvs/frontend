const advice_url = 'https://api.adviceslip.com/advice';
const dice = document.getElementById('dice');
const out_id = document.getElementById('id');
const out_advice = document.getElementById('advice');

function roll(id = null) {
  url = advice_url + (id !== null ? '/' + id : '');
  console.log(url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const {
        slip: { id, advice },
      } = data;
      out_id.innerText = `Advice #${id}`;
      out_advice.innerText = `"${advice}"`;
    });
}

dice.onclick = (e) => roll();
roll('117');
