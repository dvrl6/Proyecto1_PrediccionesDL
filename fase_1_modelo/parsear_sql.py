import re
import pandas as pd
import numpy as np
import os

print("Iniciando parseo de SQL...")

# --- Configuración ---
SQL_FILE_PATH = 'synthetic_liver_cancer_dataset.sql'
OUTPUT_DIR = 'datos'
OUTPUT_CSV = os.path.join(OUTPUT_DIR, 'synthetic_liver_cancer_dataset.csv')

# --- Definición de Columnas (basado en CREATE TABLE) ---
COLUMNS = [
    'age', 'gender', 'bmi', 'alcohol_consumption', 'smoking_status', 
    'hepatitis_b', 'hepatitis_c', 'liver_function_score', 
    'alpha_fetoprotein_level', 'cirrhosis_history', 'family_history_cancer', 
    'physical_activity_level', 'diabetes', 'liver_cancer'
]

# --- Regex para extraer los valores de las tuplas ---
# Esto busca patrones como (valor1, 'valor2', 12.3, ...)
#insert_regex = re.compile(r"\((.*?)\);", re.IGNORECASE)
# LÍNEA CORREGIDA
insert_regex = re.compile(r"VALUES\s*\((.*?)\);", re.IGNORECASE)

# --- Lectura y Parseo ---
all_rows = []
try:
    with open(SQL_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    matches = insert_regex.finditer(content)
    
    for match in matches:
        values_str = match.group(1)
        
        # Limpia y divide los valores
        # Asume que los valores están separados por comas
        # y maneja las comillas de los strings
        values = [val.strip().strip("'") for val in values_str.split(',')]
        
        # Reemplaza valores 'punto' (.) por NaN
        values = [np.nan if v == '.' else v for v in values]
        
        if len(values) == len(COLUMNS):
            all_rows.append(values)
        else:
            print(f"Advertencia: Fila omitida. Se esperaban {len(COLUMNS)} valores, se obtuvieron {len(values)}.")

    print(f"Se procesaron {len(all_rows)} filas.")

    # --- Creación del DataFrame ---
    if not all_rows:
        print("Error: No se encontraron datos para parsear.")
    else:
        df = pd.DataFrame(all_rows, columns=COLUMNS)
        
        # Asegurar tipos de datos correctos
        # Columnas numéricas
        numeric_cols = ['age', 'bmi', 'liver_function_score', 'alpha_fetoprotein_level']
        # Columnas binarias (BIT)
        binary_cols = [
            'hepatitis_b', 'hepatitis_c', 'cirrhosis_history', 
            'family_history_cancer', 'diabetes', 'liver_cancer'
        ]
        
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce')
            
        for col in binary_cols:
            df[col] = pd.to_numeric(df[col], errors='coerce').astype('Int64') # Usamos Int64 para soportar NaNs

        # --- Guardado ---
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        df.to_csv(OUTPUT_CSV, index=False)
        
        print(f"\n¡Éxito! Datos guardados en: {OUTPUT_CSV}")
        print("\n--- Resumen de los datos cargados (primeras 5 filas) ---")
        print(df.head())
        print("\n--- Información del DataFrame ---")
        df.info()

except FileNotFoundError:
    print(f"Error: No se encontró el archivo {SQL_FILE_PATH}.")
except Exception as e:
    print(f"Ocurrió un error inesperado: {e}")