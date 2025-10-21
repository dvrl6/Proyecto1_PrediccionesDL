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

🐍 Fase 2: Desarrollo del Back-end (API en Python)
-----

## 📂 Estructura del Directorio
El código para el back-end se encuentra en la carpeta fase_2_backend/:

```
fase_2_backend/
│
├── 📂 venv-backend/                 # Entorno virtual (Ignorado por .gitignore)
│
├── 📜 app.py                         # Servidor Flask con la lógica de la API.
├── 📋 requirements.txt             # Dependencias de Python para el back-end.
│
├── 📦 liver_cancer_model.keras    # Copia del modelo entrenado (de Fase 1).
└── 📦 preprocessor.joblib         # Copia del preprocesador (de Fase 1).
```

-----
## 🛠️ Instalación y Configuración

El back-end utiliza su propio entorno virtual, separado del de la Fase 1.

**1. Navegar a la Carpeta**

Abre una terminal en la raíz del proyecto y navega a la carpeta del back-end:

```bash

cd fase_2_backend
```
**2. Configurar el Entorno Virtual**

```
# Crea el entorno virtual (solo la primera vez), puedes usar python o python3
python3 -m venv venv-backend

# Activa el entorno virtual
# En Windows:
.\venv-backend\Scripts\activate
# En macOS/Linux:
source venv-backend/bin/activate
```

**3. Instalar Dependencias con el entorno (venv-backend) activado**

```bash

# En macOS puede ser necesario usar pip3
pip3 install -r requirements.txt
```

-----
## 🚀 Uso y Ejecución

Una vez instaladas las dependencias, puedes iniciar el servidor de la API.

```bash

# Asegúrate de estar en fase_2_backend/ y con venv-backend activado
python3 app.py
```

El servidor comenzará a ejecutarse y quedará "escuchando" peticiones en http://127.0.0.1:5000.

-----
## 📡 Endpoint de Predicción

La API expone un único endpoint para las predicciones:

URL: http://127.0.0.1:5000/predict

Método: POST

Cuerpo (Body) de la Petición: Un JSON con los 13 features del paciente.

**JSON**
```
{
    "age": 65,
    "gender": "Female",
    "bmi": 28.5,
    "alcohol_consumption": "Regular",
    "smoking_status": "Former",
    "hepatitis_b": 0,
    "hepatitis_c": 0,
    "liver_function_score": 75.5,
    "alpha_fetoprotein_level": 120.7,
    "cirrhosis_history": 1,
    "family_history_cancer": 0,
    "physical_activity_level": "Low",
    "diabetes": 1
}
```

Respuesta Exitosa (JSON):

**JSON**
```
{
    "porcentaje_riesgo": 82.15,
    "mensaje_accion": "Alerta: Cita clínica inmediata."
}
```

## 🌐 Fase 3: Diseño del Front-end (Web App)
-----

## 📂 Estructura del Directorio (Prototipo Simple)

El código para la prueba de front-end se encuentra en fase_3_frontend_simple/:

```
fase_3_frontend_simple/
│
├── 📜 index.html        # Estructura del formulario de entrada.
├── 🎨 style.css         # Estilos mínimos para el formulario.
└── 🧠 app.js            # Lógica JS (fetch) para llamar a la API.
```

## 🛠️ Instalación

No se requiere instalación. Esta interfaz es una aplicación web estática (HTML/CSS/JS) que se ejecuta directamente en el navegador.

## 🚀 Uso y Ejecución
Para que el front-end funcione, la API de Back-end (Fase 2) debe estar ejecutándose.

Asegúrate de que el servidor de fase_2_backend esté corriendo (python3 app.py).

Navega a la carpeta fase_3_frontend_simple/.

Abre el archivo index.html directamente en tu navegador web (ej. Chrome, Firefox).

Llena el formulario y presiona "Predecir Riesgo" para ver el resultado.

## 🏁 Fase 4: Demostración de la Aplicación Completa
Para ejecutar el proyecto de extremo a extremo (End-to-End), sigue estos pasos:

**1. Terminal 1: Iniciar el Back-end (API)**

```bash

# Ir a la carpeta del back-end
cd fase_2_backend

# Activar el entorno
source venv-backend/bin/activate

# Ejecutar el servidor
python3 app.py
```

**2. Paso 2: Abrir el Front-end**

Navega a la carpeta fase_3_frontend_simple/.

Haz doble clic en el archivo index.html.

**3. Paso 3: Probar**

La página web se abrirá en tu navegador.

Ingresa los datos del paciente (o usa los valores por defecto).

Presiona "Predecir Riesgo".

El resultado de la predicción (porcentaje y mensaje) aparecerá en la página.