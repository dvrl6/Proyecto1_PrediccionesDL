import pandas as pd
from tensorflow.keras.models import load_model
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score, confusion_matrix
import joblib
import seaborn as sns
import matplotlib.pyplot as plt

# --- Configuración ---
DATA_PATH = 'datos/synthetic_liver_cancer_dataset.csv'
PREPROCESSOR_PATH = 'artefactos_guardados/preprocessor.joblib'
MODEL_PATH = 'artefactos_guardados/liver_cancer_model.keras'
TARGET = 'liver_cancer'

print("Iniciando script de evaluación final...")

# 1. Cargar Artefactos
try:
    model = load_model(MODEL_PATH)
    preprocessor = joblib.load(PREPROCESSOR_PATH)
    print("Modelo y preprocesador cargados exitosamente.")
except Exception as e:
    print(f"Error cargando artefactos: {e}")
    exit()
    
# 2. Cargar y dividir datos
df = pd.read_csv(DATA_PATH)
X = df.drop(columns=[TARGET])
y = df[TARGET]

# Usamos la misma división para obtener el mismo set de prueba
_, X_test, _, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 3. Preprocesar datos de prueba
X_test_processed = preprocessor.transform(X_test)

# 4. Generar Predicciones
# model.predict() devuelve probabilidades (por la sigmoide)
y_pred_proba = model.predict(X_test_processed).flatten()

# Convertir probabilidades a clases (0 o 1) usando el umbral de 0.5
y_pred_class = (y_pred_proba > 0.5).astype(int)

# 5. Mostrar Métricas de Evaluación
print("\n--- Métricas de Evaluación en Set de Prueba ---")

# Accuracy
accuracy = accuracy_score(y_test, y_pred_class)
print(f"Accuracy (Exactitud): {accuracy:.4f}")

# AUC
auc = roc_auc_score(y_test, y_pred_proba)
print(f"AUC-ROC: {auc:.4f}")

# Reporte de Clasificación (Precisión, Recall, F1-Score)
print("\nReporte de Clasificación:")
print(classification_report(y_test, y_pred_class, target_names=['Riesgo Bajo (0)', 'Riesgo Alto (1)']))

# Matriz de Confusión
print("\nMatriz de Confusión:")
cm = confusion_matrix(y_test, y_pred_class)
print(cm)

# Visualización de la Matriz de Confusión
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=['Pred. Bajo (0)', 'Pred. Alto (1)'], 
            yticklabels=['Real Bajo (0)', 'Real Alto (1)'])
plt.ylabel('Valor Real')
plt.xlabel('Valor Predicho')
plt.title('Matriz de Confusión')
plt.show()