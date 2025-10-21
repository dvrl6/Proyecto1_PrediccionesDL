import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
import joblib
import os

print("Iniciando script de preprocesamiento...")

# --- Configuración ---
DATA_PATH = 'datos/synthetic_liver_cancer_dataset.csv'
ARTIFACTS_DIR = 'artefactos_guardados'
PREPROCESSOR_PATH = os.path.join(ARTIFACTS_DIR, 'preprocessor.joblib')
TARGET = 'liver_cancer'

# --- Identificación de Features ---
# Basado en el EDA y el .sql
NUMERIC_FEATURES = ['age', 'bmi', 'liver_function_score', 'alpha_fetoprotein_level']
CATEGORICAL_FEATURES = ['gender', 'alcohol_consumption', 'smoking_status', 'physical_activity_level']
# Estas ya son 0/1, solo necesitan imputación por si acaso
BINARY_FEATURES = [
    'hepatitis_b', 'hepatitis_c', 'cirrhosis_history', 
    'family_history_cancer', 'diabetes'
]

# Carga los datos, define, entrena y guarda el pipeline de preprocesamiento.
def crear_y_guardar_pipeline(data_path, output_path):
    try:
        df = pd.read_csv(data_path)
        
        # 1. Separar X (features) e y (target)
        X = df.drop(columns=[TARGET])
        y = df[TARGET]

        # 2. Definir los pipelines de transformación
        
        # Pipeline para datos numéricos:
        # 1. Imputar faltantes (NaN) con la mediana
        # 2. Escalar los datos 
        numeric_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ])

        # Pipeline para datos categóricos:
        # 1. Imputar faltantes (NaN) con la moda 
        # 2. Convertir a One-Hot Encoding
        categorical_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ])
        
        # Pipeline para datos binarios:
        # 1. Imputar faltantes (NaN) con la moda (0 o 1)
        binary_transformer = Pipeline(steps=[
            ('imputer', SimpleImputer(strategy='most_frequent'))
        ])

        # 3. Combinar pipelines en un ColumnTransformer
        # Este es el procesador que usará la API
        preprocessor = ColumnTransformer(
            transformers=[
                ('num', numeric_transformer, NUMERIC_FEATURES),
                ('cat', categorical_transformer, CATEGORICAL_FEATURES),
                ('bin', binary_transformer, BINARY_FEATURES)
            ],
            remainder='passthrough' # Dejar cualquier otra columna (aunque no debería haber)
        )

        # 4. Dividir los datos ANTES de fitear el preprocesador
        # Solo aprendemos del set de entrenamiento para evitar fuga de datos
        X_train, _, _, _ = train_test_split(X, y, test_size=0.2, random_state=42)

        # 5. Entrenar el preprocesador
        # Aquí aprende las medianas, modas, y parámetros de escalado
        print("Entrenando el preprocesador...")
        preprocessor.fit(X_train)

        # 6. Guardar el preprocesador
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        joblib.dump(preprocessor, output_path)
        
        print(f"\n¡Éxito! Preprocesador guardado en: {output_path}")

    except FileNotFoundError:
        print(f"Error: No se encontró el archivo de datos en {data_path}")
    except Exception as e:
        print(f"Ocurrió un error: {e}")

if __name__ == "__main__":
    crear_y_guardar_pipeline(DATA_PATH, PREPROCESSOR_PATH)