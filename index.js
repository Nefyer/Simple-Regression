document.getElementById('submit').addEventListener('click', function() {
    document.getElementById('loading').style.display = 'block';

    let albedoInput = document.getElementById('albedo').value;
    let energyInput = document.getElementById('energy').value;

    let albedoValues = albedoInput.split(',').map(num => parseFloat(num.trim()));
    let energyValues = energyInput.split(',').map(num => parseFloat(num.trim()));

    if (albedoValues.length === energyValues.length && albedoValues.length > 0) {
        let regressionResult = performLinearRegression(albedoValues, energyValues);
        document.getElementById('results').innerHTML = `Slope: ${regressionResult.slope}, Intercept: ${regressionResult.intercept}`;
        let regressionLine = albedoValues.map(x => regressionResult.slope * x + regressionResult.intercept);
        updateChart(albedoValues, energyValues, regressionLine);
        addToHistory(albedoValues, energyValues, regressionResult.slope, regressionResult.intercept);
        document.getElementById('loading').style.display = 'none';
    } else {
        alert("Pastikan nilai albedo dan energi memiliki panjang yang sama.");
        document.getElementById('loading').style.display = 'none';
    }
});

function performLinearRegression(x, y) {
    let n = x.length;
    let sumX = x.reduce((acc, curr) => acc + curr, 0);
    let sumY = y.reduce((acc, curr) => acc + curr, 0);
    let sumXY = x.reduce((acc, curr, idx) => acc + (curr * y[idx]), 0);
    let sumX2 = x.reduce((acc, curr) => acc + (curr * curr), 0);
    let slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let intercept = (sumY - slope * sumX) / n;
    return { slope, intercept };
}

function updateChart(albedo, energi, garisRegresi) {
    if (window.myChart) {
        window.myChart.destroy();
    }

    let ctx = document.getElementById('plot').getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Titik Data',
                data: albedo.map((x, idx) => ({ x: x, y: energi[idx] })),
                backgroundColor: 'rgba(255, 99, 132, 1)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Garis Regresi',
                data: albedo.map((x, idx) => ({ x: x, y: garisRegresi[idx] })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: { 
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Albedo'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Energi'
                    }
                }
            },
            responsive: true
        }
    });
}

function addToHistory(albedo, energi, slope, intercept) {
    const historyList = document.getElementById('historyList');
    const historyItem = document.createElement('li');
    historyItem.textContent = `Albedo: [${albedo.join(', ')}], Energi: [${energi.join(', ')}], Slope: ${slope}, Intercept: ${intercept}`;
    historyList.appendChild(historyItem);
}
