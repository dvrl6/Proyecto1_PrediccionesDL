import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.model_selection import train_test_split
import keras_tuner as kt
import joblib
import os

print("Iniciando script de Búsqueda de Hiperparámetros y Entrenamiento...")

# --- Configuración de Rutas y Constantes ---
DATA_PATH = 'datos/synthetic_liver_cancer_dataset.csv'
PREPROCESSOR_PATH = 'artefactos_guardados/preprocessor.joblib'
MODEL_PATH = 'artefactos_guardados/liver_cancer_model.keras' # Nuevo formato de la bd con Keras
TUNER_DIR = 'tuner_results' # Directorio para guardar los resultados de la búsqueda
PROJECT_NAME = 'liver_cancer_tuning'
TARGET = 'liver_cancer'

# --- Carga y Preparación de Datos ---
try:
    # 1. Cargar datos
    df = pd.read_csv(DATA_PATH)

    # 2. Cargar preprocesador "entrenado"
    preprocessor = joblib.load(PREPROCESSOR_PATH)

    # 3. Preparar datos, separar X e y
    X = df.drop(columns=[TARGET])
    y = df[TARGET]

    # 4. Dividir en entrenamiento y prueba con random_state
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # 5. Aplicar el preprocesamiento (Solo transform)
    print("Aplicando preprocesamiento a los datos...")
    X_train_processed = preprocessor.transform(X_train)
    X_test_processed = preprocessor.transform(X_test)
    
    # 6. Definir la forma de entrada para Keras
    # El número de columnas de salida del preprocesador
    input_dim = X_train_processed.shape[1]
    print(f"Número de features de entrada al modelo: {input_dim}")

except Exception as e:
    print(f"Error al cargar o preprocesar los datos: {e}")
    exit()

# --- Función Constructora del Modelo para KerasTuner ---
def build_model(hp):
    """
    Función que KerasTuner usará para construir y compilar modelos
    con diferentes hiperparámetros.
    """
    model = Sequential()
    model.add(Input(shape=(input_dim,), name='input_layer'))

    # Hiperparámetro: Número de neuronas en la primera capa densa
    hp_units_1 = hp.Int('units_1', min_value=32, max_value=128, step=32)
    
    # Hiperparámetro: Tasa de dropout
    hp_dropout = hp.Float('dropout', min_value=0.2, max_value=0.5, step=0.1)

    # Hiperparámetro: Número de neuronas en la segunda capa densa
    hp_units_2 = hp.Int('units_2', min_value=16, max_value=64, step=16)

    # Construcción de las capas
    model.add(Dense(units=hp_units_1, activation='relu', name='hidden_layer_1'))
    model.add(Dropout(rate=hp_dropout, name='dropout_layer'))
    model.add(Dense(units=hp_units_2, activation='relu', name='hidden_layer_2'))
    model.add(Dense(1, activation='sigmoid', name='output_layer'))

    # Compilación del modelo
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', tf.keras.metrics.AUC(name='auc')]
    )
    return model

# --- Configuración y Ejecución del Tuner ---
# Usaremos Hyperband, un algoritmo eficiente para la búsqueda
tuner = kt.Hyperband(
    build_model,
    objective=kt.Objective("val_auc", direction="max"), # Objetivo: maximizar el AUC en validación
    max_epochs=30,  # Máximo de épocas a entrenar por modelo
    factor=3,
    directory=TUNER_DIR,
    project_name=PROJECT_NAME,
    overwrite=True # Sobrescribe búsquedas anteriores
)

# Callback para detener el entrenamiento si no hay mejora
early_stopping = EarlyStopping(
    monitor='val_loss',
    patience=10,
    verbose=1,
    restore_best_weights=True # Se queda con los mejores pesos del modelo
)

print("\n--- Iniciando Búsqueda de Hiperparámetros ---")
# La búsqueda se realiza aquí. 
tuner.search(
    X_train_processed, 
    y_train, 
    epochs=50, # KerasTuner y Hyperband gestionan el número real de épocas
    validation_data=(X_test_processed, y_test), 
    callbacks=[early_stopping]
)

# --- Obtención y Guardado del Mejor Modelo ---
print("\n--- Búsqueda Finalizada ---")
best_hps = tuner.get_best_hyperparameters(num_trials=1)[0] # Obtener los mejores hiperparámetros encontrados
print(f"""
Resumen de los mejores hiperparámetros encontrados:
- Neuronas en Capa 1: {best_hps.get('units_1')}
- Tasa de Dropout: {best_hps.get('dropout'):.2f}
- Neuronas en Capa 2: {best_hps.get('units_2')}
""")

# Obtener el mejor modelo directamente desde el tuner
best_model = tuner.get_best_models(num_models=1)[0]

# Guardar el modelo final
best_model.save(MODEL_PATH)
print(f"\n✅ ¡Mejor modelo guardado exitosamente en: {MODEL_PATH}!")
