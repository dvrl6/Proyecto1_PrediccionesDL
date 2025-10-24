import numpy as np
import pandas as pd
import joblib  # Para cargar el preprocessor
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS

# Inicializar la aplicación Flask
app = Flask(__name__)
# Habilitar CORS para permitir peticiones desde el front-end
CORS(app)

# Rutas a los artefactos 
MODEL_PATH = 'liver_cancer_model.keras'
PREPROCESSOR_PATH = 'preprocessor.joblib'

# Cargar el modelo y el preprocesador al iniciar la app
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    print("✅ Modelo y preprocesador cargados correctamente.")
except Exception as e:
    print(f"❌ Error al cargar los artefactos: {e}")
    model = None
    preprocessor = None

# Definir las columnas de entrada
FEATURE_COLUMNS = [
    'age', 'gender', 'bmi', 'alcohol_consumption', 'smoking_status',
    'hepatitis_b', 'hepatitis_c', 'liver_function_score',
    'alpha_fetoprotein_level', 'cirrhosis_history',
    'family_history_cancer', 'physical_activity_level', 'diabetes'
]


#Endpoint de predicción
@app.route('/predict', methods=['POST'])
def predict():
    # Validar que los modelos se hayan cargado
    if not model or not preprocessor:
        return jsonify({'error': 'Modelo o preprocesador no están disponibles.'}), 500

    try:
        #Obtener los datos JSON de la solicitud
        data_json = request.get_json()

        if not data_json:
            return jsonify({'error': 'No se recibieron datos (JSON vacío).'}), 400

        #Convertir el JSON en un DataFrame de Pandas
        input_data = pd.DataFrame([data_json], columns=FEATURE_COLUMNS)

        # Aplicar el preprocesamiento
        # - Convierte 'Female'/'Male' a números (OneHotEncoder)
        # - Escala los números (StandardScaler)
        input_data_preprocessed = preprocessor.transform(input_data)

        # Realizar la predicción con el modelo de Keras
        # El [0][0] es para obtener la probabilidad de la predicción, que Keras devuelve como un array 2D.
        probabilidad = model.predict(input_data_preprocessed)[0][0]

        # 2.6. Aplicar la Lógica de Negocio (Regla Clínica)
        riesgo_pct = round(float(probabilidad) * 100, 2)

        if riesgo_pct <= 50:
            mensaje = "Recomendación de seguimiento/chequeos."
        else:
            mensaje = "Alerta: Cita clínica inmediata."

        # Devolver la respuesta en formato JSON
        return jsonify({
            'porcentaje_riesgo': riesgo_pct,
            'mensaje_accion': mensaje
        })

    except KeyError as e:
        # Captura error si falta una columna en el JSON
        return jsonify({'error': f'Falta el dato en la solicitud: {str(e)}'}), 400
    except Exception as e:
        # Captura cualquier otro error durante la predicción
        return jsonify({'error': f'Error en el servidor: {str(e)}'}), 500


# --- 3. EJECUTAR LA APLICACIÓN ---

if __name__ == '__main__':
    # Ejecutar el servidor Flask en el puerto 5000
    # debug=True reinicia el servidor automáticamente con cada cambio.
    app.run(port=5000, debug=True)

#http://127.0.0.1:5000/predict