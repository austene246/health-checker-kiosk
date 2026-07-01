const GOOGLE_APP_URL = 'https://script.google.com/macros/s/AKfycbzNbuhfDoJpfsgg-49hzpPa5RPohWtmVBMQk484miYLf1u5OTEgRToycXY8xpM1Wz9d/exec';

document.getElementById('bmiForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const elements = [
        { id: 'name', tag: 'Identifier' }, { id: 'age', tag: 'Age' },
        { id: 'sex', tag: 'Sex' }, { id: 'weight', tag: 'Mass' },
        { id: 'height', tag: 'Height' }
    ];

    let passed = true;
    let alerts = [];

    elements.forEach(i => {
        const inputNode = document.getElementById(i.id);
        const textVal = inputNode.value.trim();
        if (!textVal) { passed = false; alerts.push(`Missing: ${i.tag}`); }
        else if (inputNode.type === 'number' && parseFloat(textVal) <= 0) { passed = false; alerts.push(`Invalid: ${i.tag}`); }
    });

    if (!passed) return alert(alerts.join('\n'));

    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const heightCm = parseFloat(document.getElementById('height').value);
    const bmi = +(weight / ((heightCm / 100) ** 2)).toFixed(1);

    let cat = '', msg = '', clr = '';

    switch (true) {
        case (bmi < 18.5):
            cat = 'Underweight'; clr = '#38bdf8';
            msg = 'Consider a balanced, calorie-sufficient diet.';
            break;
        case (bmi < 25.0):
            cat = 'Normal'; clr = '#4ade80';
            msg = 'Great! Keep up your healthy habits.';
            break;
        case (bmi < 30.0):
            cat = 'Overweight'; clr = '#facc15';
            msg = 'Consider more physical activities.';
            break;
        default:
            cat = 'Obese'; clr = '#f87171';
            msg = 'Consult a healthcare provider.';
    }

    const paneDefault = document.getElementById('displayStateDefault');
    const paneActive = document.getElementById('displayStateActive');

    paneActive.innerHTML = `
        <h3>Metric Evaluation</h3>
        <div class="name-output">${name}</div>
        <div class="stat-grid">
            <span class="bmi-num">${bmi}</span>
            <span class="badge" style="background:${clr}">${cat}</span>
        </div>
        <p class="msg-output">${msg}</p>
    `;

    paneDefault.classList.add('hidden');
    paneActive.classList.remove('hidden');

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerText = 'Syncing...';

    fetch(GOOGLE_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, sex, weight, heightCm, bmi, category: cat })
    })
    .catch(err => console.error(err))
    .finally(() => {
        btn.disabled = false;
        btn.innerText = 'Execute Run';
    });
});