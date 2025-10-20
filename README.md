# Proyecto1_PrediccionesDL
Modelo de Deep Learning y WebApp para la predicción de riesgo de cáncer de hígado. 

## 📝 Descripción del Proyecto

Este repositorio contiene el código fuente para una aplicación web diseñada para predecir el riesgo de un paciente de desarrollar cáncer de hígado. La solución completa abarca desde la ingeniería de datos y el entrenamiento de un modelo de Deep Learning hasta el despliegue de una API REST y una interfaz web para el usuario final.

El objetivo principal es proporcionar una herramienta funcional que asista al personal clínico, ofreciendo una predicción probabilística y una recomendación de acción clara basada en el riesgo calculado.

🎯 Fase 1: Ingeniería de Datos y Desarrollo del Modelo DL (Python)
-----

## 📂 Estructura del Directorio

El código para esta fase se encuentra íntegramente en la carpeta `fase_1_modelo/` y está organizado de la siguiente manera:

```
fase_1_modelo/
│
├── 📂 datos/
│   └── liver_cancer_dataset.csv      # Dataset limpio y procesado.
│
├── 📂 artefactos_guardados/
│   ├── preprocessor.joblib           # Pipeline de preprocesamiento listo para usar.
│   └── liver_cancer_model.keras      # Modelo de Keras entrenado.
│
├── 📜 00_parsear_sql.py             # Script para convertir el .sql inicial a .csv.
├── 📓 01_eda.ipynb                   # Notebook con el Análisis Exploratorio de Datos (EDA).
├── 📜 02_preprocesamiento.py         # Script que define y guarda el pipeline de preprocesamiento.
├── 📜 03_entrenamiento.py            # Script que busca hiperparámetros y entrena el modelo final.
├── 📜 04_evaluacion.py               # Script para evaluar el rendimiento del modelo guardado.
└── 📋 requirements.txt              # Dependencias de Python para esta fase.
```

-----

## 🛠️ Instalación y Configuración

Sigue estos pasos para configurar el entorno y poder ejecutar los scripts de esta fase.

**1. Prerrequisitos**

  * Python 3.8+
  * Git y GitHub Desktop instalados.

**2. Clonar el Repositorio**
Abre GitHub Desktop, ve a `File > Clone Repository` y selecciona este repositorio para descargarlo a tu máquina local.

**3. Configurar el Entorno Virtual**
Es fundamental trabajar dentro de un entorno virtual para no afectar otras instalaciones de Python. Abre una terminal en la raíz del proyecto y ejecuta:

```bash
# Navega a la carpeta de la fase 1
cd fase_1_modelo

# Crea el entorno virtual (solo la primera vez)
python -m venv venv

# Activa el entorno virtual
# En Windows:
venv\Scripts\activate
# En macOS/Linux:
source venv/bin/activate
```

**4. Instalar Dependencias**
Con el entorno activado, instala todas las librerías necesarias ejecutando:

```bash
pip install -r requirements.txt
```

-----

## 🚀 Uso y Ejecución de Scripts

Para replicar los resultados de la Fase 1, ejecuta los scripts en el siguiente orden desde la terminal, asegurándote de estar ubicado en la carpeta `fase_1_modelo/`.

**Paso 1: Parsear los Datos**
Este script convierte el archivo `.sql` en un `.csv` limpio. Solo necesitas ejecutarlo una vez.

```bash
python 00_parsear_sql.py
```

**Paso 2: Explorar los Datos (Opcional)**
Para visualizar el análisis, abre el archivo `01_eda.ipynb` en VS Code o Jupyter.

**Paso 3: Crear el Pipeline de Preprocesamiento**
Este script aprende las transformaciones de los datos de entrenamiento y guarda el pipeline.

```bash
python 02_preprocesamiento.py
```

**Paso 4: Entrenar el Modelo**
Este es el paso principal. Ejecuta la búsqueda de hiperparámetros y guarda el mejor modelo encontrado. **Este proceso puede tardar varios minutos.**

```bash
python 03_entrenamiento.py
```

**Paso 5: Evaluar el Modelo Final**
Este script carga los artefactos guardados (`preprocessor` y `model`) y muestra las métricas de rendimiento (Accuracy, AUC, Matriz de Confusión) sobre el conjunto de datos de prueba.

```bash
python 04_evaluacion.py
```

-----

## ✅ Entregables para la Fase 2 (Back-end)

La ejecución exitosa de los scripts de esta fase genera los siguientes artefactos, ubicados en la carpeta `fase_1_modelo/artefactos_guardados/`. Estos son los únicos archivos que el equipo de Back-end necesita para construir la API de predicción:

1.  **`preprocessor.joblib`**: Objeto `ColumnTransformer` que contiene toda la lógica para transformar los datos de entrada del usuario al formato que el modelo espera.
2.  **`liver_cancer_model.keras`**: El modelo de Deep Learning final, entrenado, optimizado y listo para hacer predicciones.
