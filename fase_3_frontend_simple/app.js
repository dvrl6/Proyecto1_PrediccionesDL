document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('prediction-form');
    const resultContainer = document.getElementById('result-container');
    const riesgoDisplay = document.getElementById('riesgo-display');
    const mensajeDisplay = document.getElementById('mensaje-display');
    const submitButton = document.getElementById('submit-button');

    const API_URL = 'http://127.0.0.1:5000/predict';

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        submitButton.disabled = true;
        submitButton.textContent = 'Calculando...';

        const formData = {
            "age": parseFloat(document.getElementById('age').value),
            "gender": document.getElementById('gender').value,
            "bmi": parseFloat(document.getElementById('bmi').value),
            "alcohol_consumption": document.getElementById('alcohol_consumption').value,
            "smoking_status": document.getElementById('smoking_status').value,
            "hepatitis_b": parseInt(document.getElementById('hepatitis_b').value),
            "hepatitis_c": parseInt(document.getElementById('hepatitis_c').value),
            "liver_function_score": parseFloat(document.getElementById('liver_function_score').value),
            "alpha_fetoprotein_level": parseFloat(document.getElementById('alpha_fetoprotein_level').value),
            "cirrhosis_history": parseInt(document.getElementById('cirrhosis_history').value),
            "family_history_cancer": parseInt(document.getElementById('family_history_cancer').value),
            "physical_activity_level": document.getElementById('physical_activity_level').value,
            "diabetes": parseInt(document.getElementById('diabetes').value)
        };

        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            riesgoDisplay.textContent = `${data.porcentaje_riesgo}%`;
            mensajeDisplay.textContent = data.mensaje_accion;
            
            if (data.porcentaje_riesgo > 50) {
                resultContainer.className = 'riesgo-alto';
            } else {
                resultContainer.className = 'riesgo-bajo';
            }
            resultContainer.classList.remove('hidden'); 
        })
        .catch(error => {
            console.error('Error en el fetch:', error);
            riesgoDisplay.textContent = 'Error';
            mensajeDisplay.textContent = `No se pudo conectar a la API. ${error.message}`;
            resultContainer.className = 'riesgo-alto'; 
            resultContainer.classList.remove('hidden');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Predecir Riesgo';
        });
    });
});