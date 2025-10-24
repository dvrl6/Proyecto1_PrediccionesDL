// --- Lógica del SDK de Canva (Sin cambios) ---
// Configuración por defecto
const defaultConfig = {
  app_title: "Predictor de Riesgo Hepático",
  welcome_subtitle:
    "Tecnología de IA avanzada para evaluación médica precisa y personalizada",
  cta_button_text: "Comenzar Evaluación",
  background_color: "#667eea",
  surface_color: "#ffffff",
  text_color: "#1A202C",
  accent_color: "#764ba2",
  alert_color: "#e53e3e",
  font_family: "Inter",
};

// Función de renderizado
async function render(config) {
  const customFont = config.font_family || defaultConfig.font_family;
  const baseFontStack =
    '-webkit-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

  // Aplicar fuente
  document.body.style.fontFamily = `${customFont}, ${baseFontStack}`;

  // Actualizar textos editables
  const titleElement = document.querySelector(".main-title");
  if (titleElement) {
    titleElement.textContent = config.app_title || defaultConfig.app_title;
  }

  const subtitleElement = document.querySelector(".welcome-subtitle");
  if (subtitleElement) {
    subtitleElement.textContent =
      config.welcome_subtitle || defaultConfig.welcome_subtitle;
  }

  const ctaButton = document.querySelector(".cta-button");
  if (ctaButton) {
    ctaButton.textContent =
      config.cta_button_text || defaultConfig.cta_button_text;
  }

  // Aplicar colores
  const backgroundColor =
    config.background_color || defaultConfig.background_color;
  const accentColor = config.accent_color || defaultConfig.accent_color;

  // Actualizar gradientes
  const welcomeScreen = document.querySelector(".welcome-screen");
  if (welcomeScreen) {
    welcomeScreen.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor} 100%)`;
  }

  const resultsScreen = document.querySelector(".results-screen");
  if (resultsScreen) {
    resultsScreen.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor} 100%)`;
  }

  const formHeader = document.querySelector(".form-header");
  if (formHeader) {
    formHeader.style.background = `linear-gradient(135deg, ${backgroundColor} 0%, ${accentColor} 100%)`;
  }
}

// Mapeo de capacidades
function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.background_color || defaultConfig.background_color,
        set: (value) => {
          config.background_color = value;
          window.elementSdk.setConfig({ background_color: value });
        },
      },
      {
        get: () => config.surface_color || defaultConfig.surface_color,
        set: (value) => {
          config.surface_color = value;
          window.elementSdk.setConfig({ surface_color: value });
        },
      },
      {
        get: () => config.text_color || defaultConfig.text_color,
        set: (value) => {
          config.text_color = value;
          window.elementSdk.setConfig({ text_color: value });
        },
      },
      {
        get: () => config.accent_color || defaultConfig.accent_color,
        set: (value) => {
          config.accent_color = value;
          window.elementSdk.setConfig({ accent_color: value });
        },
      },
      {
        get: () => config.alert_color || defaultConfig.alert_color,
        set: (value) => {
          config.alert_color = value;
          window.elementSdk.setConfig({ alert_color: value });
        },
      },
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (value) => {
        config.font_family = value;
        window.elementSdk.setConfig({ font_family: value });
      },
    },
    fontSizeable: undefined,
  };
}

// Mapeo de valores del panel de edición
function mapToEditPanelValues(config) {
  return new Map([
    ["app_title", config.app_title || defaultConfig.app_title],
    [
      "welcome_subtitle",
      config.welcome_subtitle || defaultConfig.welcome_subtitle,
    ],
    [
      "cta_button_text",
      config.cta_button_text || defaultConfig.cta_button_text,
    ],
  ]);
}

// Inicializar SDK
if (window.elementSdk) {
  window.elementSdk.init({
    defaultConfig,
    render,
    mapToCapabilities,
    mapToEditPanelValues,
  });
}

// --- Lógica del Front-End (de app canva.js) ---

// Variables globales
let currentStep = 1;
const totalSteps = 4;
const formData = {}; // Almacenará todos los datos del formulario

// *** INICIO DE LÓGICA DE 'app compañeros.js' ***
// URL de la API de tus compañeros
const API_URL = "http://127.0.0.1:5000/predict";
// *** FIN DE LÓGICA DE 'app compañeros.js' ***

// Elementos del DOM
const welcomeScreen = document.getElementById("welcomeScreen");
const formScreen = document.getElementById("formScreen");
const analysisScreen = document.getElementById("analysisScreen");
const resultsScreen = document.getElementById("resultsScreen");
const startButton = document.getElementById("startButton");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");

const stepTitle = document.getElementById("stepTitle");
const stepDescription = document.getElementById("stepDescription");

// Títulos y descripciones de los pasos
const stepInfo = {
  1: {
    title: "Información Personal",
    description: "Comencemos con algunos datos básicos",
  },
  2: {
    title: "Estilo de Vida",
    description: "Cuéntanos sobre tus hábitos diarios",
  },
  3: {
    title: "Historial Médico",
    description: "Información sobre tu salud previa",
  },
  4: {
    title: "Valores de Laboratorio",
    description: "Últimos resultados de análisis",
  },
};

// Event Listeners
startButton.addEventListener("click", () => {
  welcomeScreen.style.display = "none";
  formScreen.style.display = "block";
  formScreen.classList.add("active");

  // Asegurar que empezamos desde el paso 1
  currentStep = 1;
  showStep(1);
  updateProgress();
  updateNavigation();
});

backButton.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
    updateProgress();
    updateNavigation();
  }
});

nextButton.addEventListener("click", () => {
  // Validamos solo el paso actual
  if (validateCurrentStep()) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      updateProgress();
      updateNavigation();
    } else {
      // Estamos en el último paso, llamamos a la lógica real
      calculateAndShowResults();
    }
  }
});

// Manejar selección de opciones (radios)
document.addEventListener("change", (e) => {
  if (e.target.type === "radio") {
    // Actualizar estilos visuales
    const cards = e.target
      .closest(".option-grid")
      .querySelectorAll(".option-card");
    cards.forEach((card) => card.classList.remove("selected"));
    e.target.closest(".option-card").classList.add("selected");

    // Guardar datos en nuestro objeto global
    formData[e.target.name] = e.target.value;
    updateNextButton(); // Re-validar al cambiar
  }
});

// Manejar inputs numéricos
document.addEventListener("input", (e) => {
  if (e.target.type === "number") {
    validateNumericInput(e.target); // Validación visual
    formData[e.target.id] = e.target.value; // Guardar dato
    updateNextButton(); // Re-validar al escribir
  }
});

// Función para validar inputs numéricos (Visual)
function validateNumericInput(input) {
  const value = parseFloat(input.value);
  const fieldId = input.id;
  let isValid = true;
  let errorElement = null;

  input.classList.remove("error");

  switch (fieldId) {
    case "age":
      errorElement = document.getElementById("ageError");
      if (
        input.value &&
        (value < 1 || value > 120 || !Number.isInteger(value))
      ) {
        isValid = false;
      }
      break;

    case "bmi":
      errorElement = document.getElementById("bmiError");
      if (input.value && value <= 0) {
        isValid = false;
      }
      break;

    // --- CORRECCIÓN ---
    // Los IDs 'liverFunction' y 'afpLevel' fueron cambiados en el HTML
    case "liver_function_score":
      errorElement = document.getElementById("liverFunctionError");
      if (input.value && value < 0) {
        isValid = false;
      }
      break;

    case "alpha_fetoprotein_level":
      errorElement = document.getElementById("afpLevelError");
      if (input.value && value < 0) {
        isValid = false;
      }
      break;
  }

  if (errorElement) {
    if (!isValid) {
      input.classList.add("error");
      errorElement.classList.add("show");
    } else {
      errorElement.classList.remove("show");
    }
  }

  return isValid;
}

// Funciones auxiliares de UI (Sin cambios)
function showStep(step) {
  document.querySelectorAll(".step").forEach((s) => {
    s.classList.remove("active");
  });
  document.getElementById(`step${step}`).classList.add("active");
  stepTitle.textContent = stepInfo[step].title;
  stepDescription.textContent = stepInfo[step].description;
}

function updateProgress() {
  for (let i = 1; i <= totalSteps; i++) {
    const circle = document.getElementById(`stepCircle${i}`);
    const connector = document.getElementById(`connector${i}`);

    if (i < currentStep) {
      circle.className = "step-circle completed";
      circle.textContent = "";
      if (connector) connector.classList.add("completed");
    } else if (i === currentStep) {
      circle.className = "step-circle active";
      circle.textContent = i;
      if (connector) connector.classList.remove("completed");
    } else {
      circle.className = "step-circle";
      circle.textContent = i;
      if (connector) connector.classList.remove("completed");
    }
  }
}

function updateNavigation() {
  backButton.style.display = currentStep > 1 ? "block" : "none";
  nextButton.textContent =
    currentStep === totalSteps ? "Calcular Riesgo" : "Siguiente";
  updateNextButton();
}

function updateNextButton() {
  const isValid = validateCurrentStep();
  nextButton.disabled = !isValid;
}

// Función de validación por paso (Corregida con los names/IDs correctos)
function validateCurrentStep() {
  // --- CORRECCIÓN ---
  // Actualizado para usar los 'name' y 'id' correctos del HTML
  switch (currentStep) {
    case 1:
      const ageInput = document.getElementById("age");
      const bmiInput = document.getElementById("bmi");
      const hasAllFields = formData.age && formData.gender && formData.bmi;
      return (
        hasAllFields &&
        validateNumericInput(ageInput) &&
        validateNumericInput(bmiInput)
      );

    case 2:
      return (
        formData.alcohol_consumption &&
        formData.smoking_status &&
        formData.physical_activity_level
      );

    case 3:
      return (
        formData.hepatitis_b &&
        formData.hepatitis_c &&
        formData.cirrhosis_history &&
        formData.diabetes &&
        formData.family_history_cancer
      );

    case 4:
      const liverFunctionInput = document.getElementById(
        "liver_function_score"
      );
      const afpLevelInput = document.getElementById("alpha_fetoprotein_level");
      const hasAllLabFields =
        formData.liver_function_score && formData.alpha_fetoprotein_level;
      return (
        hasAllLabFields &&
        validateNumericInput(liverFunctionInput) &&
        validateNumericInput(afpLevelInput)
      );

    default:
      return false;
  }
}

// --- INICIO DE LÓGICA DE 'app compañeros.js' (Modificada y fusionada) ---

// Esta función reemplaza tu `displayResults` y usa la data REAL de la API
function displayResults(data) {
  const config = window.elementSdk ? window.elementSdk.config : defaultConfig;
  const percentageElement = document.getElementById("riskPercentage");
  const messageElement = document.getElementById("riskMessage");
  const descriptionElement = document.getElementById("riskDescription");
  const iconElement = document.getElementById("resultsIcon");

  // Manejar caso de error primero
  if (data.porcentaje_riesgo === "Error") {
    const alertColor = config.alert_color || defaultConfig.alert_color;
    percentageElement.className = "risk-percentage risk-high";
    messageElement.className = "risk-message risk-high";
    iconElement.className = "results-icon risk-high";
    percentageElement.style.color = alertColor;
    messageElement.style.color = alertColor;
    iconElement.style.backgroundColor = alertColor;

    percentageElement.textContent = "Error";
    messageElement.textContent = "Error de Conexión";
    descriptionElement.textContent = data.mensaje_accion; // Mensaje de error real
    iconElement.textContent = "🚫";
    return;
  }

  const riskScore = data.porcentaje_riesgo; // Data real de la API
  percentageElement.textContent = `${riskScore}%`;
  descriptionElement.textContent = data.mensaje_accion; // Data real de la API

  // Lógica visual basada en el riesgo (similar a tu lógica de prueba)
  if (riskScore >= 60) {
    const alertColor = config.alert_color || defaultConfig.alert_color;
    percentageElement.className = "risk-percentage risk-high";
    messageElement.className = "risk-message risk-high";
    iconElement.className = "results-icon risk-high";
    percentageElement.style.color = alertColor;
    messageElement.style.color = alertColor;
    iconElement.style.backgroundColor = alertColor;
    messageElement.textContent = "Riesgo Alto Detectado";
    iconElement.textContent = "⚠️";
  } else if (riskScore >= 30) {
    percentageElement.className = "risk-percentage risk-moderate";
    messageElement.className = "risk-message risk-moderate";
    iconElement.className = "results-icon risk-moderate";
    percentageElement.style.color = "#ed8936";
    messageElement.style.color = "#ed8936";
    iconElement.style.backgroundColor = "#ed8936";
    messageElement.textContent = "Riesgo Moderado";
    iconElement.textContent = "⚡";
  } else {
    percentageElement.className = "risk-percentage risk-low";
    messageElement.className = "risk-message risk-low";
    iconElement.className = "results-icon risk-low";
    percentageElement.style.color = "#38a169";
    messageElement.style.color = "#38a169";
    iconElement.style.backgroundColor = "#38a169";
    messageElement.textContent = "Riesgo Bajo";
    iconElement.textContent = "✅";
  }
}

// Esta función se mantiene de tu `app canva.js`
function startAnalysisAnimation(callback) {
  const steps = document.querySelectorAll(".analysis-step");
  let currentStepIndex = 0;

  steps.forEach((step) => {
    step.classList.remove("active", "completed");
  });

  function animateStep() {
    if (currentStepIndex < steps.length) {
      steps[currentStepIndex].classList.add("active");
      if (currentStepIndex > 0) {
        steps[currentStepIndex - 1].classList.remove("active");
        steps[currentStepIndex - 1].classList.add("completed");
      }
      currentStepIndex++;
      setTimeout(animateStep, 800);
    } else {
      if (steps.length > 0) {
        steps[steps.length - 1].classList.remove("active");
        steps[steps.length - 1].classList.add("completed");
      }
      setTimeout(callback, 1000); // Llama al callback (la llamada a la API)
    }
  }
  setTimeout(animateStep, 500);
}

// Esta función reemplaza tu `calculateAndShowResults`
// Ahora contiene la lógica de 'app compañeros.js'
function calculateAndShowResults() {
  // 1. Construir el payload para la API desde el objeto formData global
  // Se usan parseFloat y parseInt como en 'app compañeros.js'
  const apiPayload = {
    age: parseFloat(formData.age),
    gender: formData.gender,
    bmi: parseFloat(formData.bmi),
    alcohol_consumption: formData.alcohol_consumption,
    smoking_status: formData.smoking_status,
    hepatitis_b: parseInt(formData.hepatitis_b),
    hepatitis_c: parseInt(formData.hepatitis_c),
    liver_function_score: parseFloat(formData.liver_function_score),
    alpha_fetoprotein_level: parseFloat(formData.alpha_fetoprotein_level),
    cirrhosis_history: parseInt(formData.cirrhosis_history),
    family_history_cancer: parseInt(formData.family_history_cancer),
    physical_activity_level: formData.physical_activity_level,
    diabetes: parseInt(formData.diabetes),
  };

  // 2. Mostrar pantalla de análisis (lógica de 'app canva.js')
  formScreen.classList.remove("active");
  formScreen.style.display = "none";
  analysisScreen.style.display = "flex";
  analysisScreen.classList.add("active");

  // 3. Iniciar animación y pasar la llamada a la API como callback
  startAnalysisAnimation(() => {
    // 4. Lógica de FETCH de 'app compañeros.js'
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiPayload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Éxito: Ocultar análisis y mostrar resultados
        analysisScreen.classList.remove("active");
        analysisScreen.style.display = "none";

        setTimeout(() => {
          displayResults(data); // Llamar a la nueva función de display
          resultsScreen.style.display = "flex";
          resultsScreen.classList.add("active");
        }, 300);
      })
      .catch((error) => {
        console.error("Error en el fetch:", error);
        // Error: Ocultar análisis y mostrar resultados de error
        analysisScreen.classList.remove("active");
        analysisScreen.style.display = "none";

        // Preparar un objeto de error para nuestra función displayResults
        const errorData = {
          porcentaje_riesgo: "Error",
          mensaje_accion: `No se pudo conectar a la API. Verifica la conexión. (${error.message})`,
        };

        setTimeout(() => {
          displayResults(errorData); // Mostrar el error en la UI
          resultsScreen.style.display = "flex";
          resultsScreen.classList.add("active");
        }, 300);
      });
  });
}
// --- FIN DE LÓGICA FUSIONADA ---

// --- Lógica de botones de resultado (de app canva.js) ---

// Botón nueva evaluación (Sin cambios en la lógica, solo resetea el front-end)
document.getElementById("newEvaluationBtn").addEventListener("click", () => {
  currentStep = 1;
  for (let key in formData) {
    delete formData[key];
  }

  document.querySelectorAll("input").forEach((input) => {
    if (input.type === "radio") {
      input.checked = false;
    } else {
      input.value = "";
      input.classList.remove("error");
    }
  });

  document.querySelectorAll(".option-card").forEach((card) => {
    card.classList.remove("selected");
  });

  document.querySelectorAll(".error-message").forEach((msg) => {
    msg.classList.remove("show");
  });

  document.querySelectorAll(".analysis-step").forEach((step) => {
    step.classList.remove("active", "completed");
  });

  showStep(1);

  document.getElementById("stepCircle1").className = "step-circle active";
  document.getElementById("stepCircle1").textContent = "1";
  for (let i = 2; i <= totalSteps; i++) {
    const circle = document.getElementById(`stepCircle${i}`);
    const connector = document.getElementById(`connector${i - 1}`);
    circle.className = "step-circle";
    circle.textContent = i;
    if (connector) connector.classList.remove("completed");
  }

  backButton.style.display = "none";
  nextButton.textContent = "Siguiente";
  nextButton.disabled = true;

  resultsScreen.classList.remove("active");
  resultsScreen.style.display = "none";
  analysisScreen.classList.remove("active");
  analysisScreen.style.display = "none";

  setTimeout(() => {
    welcomeScreen.style.display = "flex";
  }, 300);
});

// 🗑️ ELIMINA EL BLOQUE 'downloadBtn' ANTERIOR Y PÉGALO ESTE EN SU LUGAR:

// ===================================================================
// === SECCIÓN MODIFICADA: Botón "Descargar Reporte" (Versión 2.0) ===
// ===================================================================
document.getElementById("downloadBtn").addEventListener("click", () => {
  // 1. Obtener los datos actuales de la pantalla de resultados
  const riskPercentage = document.getElementById("riskPercentage").textContent;
  const riskMessage = document.getElementById("riskMessage").textContent;
  const riskDescription =
    document.getElementById("riskDescription").textContent;
  const riskIcon = document.getElementById("resultsIcon").textContent.trim();

  // Determinar la clase de riesgo para los colores
  const riskClass = document.getElementById("resultsIcon").className;
  let colorClass = "risk-low"; // Default
  if (riskClass.includes("risk-high")) colorClass = "risk-high";
  else if (riskClass.includes("risk-moderate")) colorClass = "risk-moderate";

  // 2. Construir el HTML del reporte (Sin cambios en el HTML)
  const reportHTML = `
        <div id="print-report" class="print-container ${colorClass}">
            <div class="print-header">
                <div class="print-logo">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" fill="white"></path></svg>
                </div>
                <h1>Reporte de Evaluación de Riesgo Hepático</h1>
            </div>
            <div class="print-body">
                <div class="print-risk-summary">
                    <div class="print-risk-icon">${riskIcon}</div>
                    <div class="print-risk-value">${riskPercentage}</div>
                    <div class="print-risk-message">${riskMessage}</div>
                </div>
                <div class="print-recommendation">
                    <h2>Recomendación Médica</h2>
                    <p>${riskDescription}</p>
                </div>
                <div class="print-details">
                    <h2>Detalles de la Evaluación</h2>
                    <div class="print-grid">
                        <div><strong>Edad:</strong> ${formData.age} años</div>
                        <div><strong>Género:</strong> ${formData.gender}</div>
                        <div><strong>IMC:</strong> ${formData.bmi}</div>
                        <div><strong>Alcohol:</strong> ${
                          formData.alcohol_consumption
                        }</div>
                        <div><strong>Tabaquismo:</strong> ${
                          formData.smoking_status
                        }</div>
                        <div><strong>Actividad Física:</strong> ${
                          formData.physical_activity_level
                        }</div>
                        <div><strong>Hepatitis B:</strong> ${
                          formData.hepatitis_b === "1" ? "Sí" : "No"
                        }</div>
                        <div><strong>Hepatitis C:</strong> ${
                          formData.hepatitis_c === "1" ? "Sí" : "No"
                        }</div>
                        <div><strong>Cirrosis:</strong> ${
                          formData.cirrhosis_history === "1" ? "Sí" : "No"
                        }</div>
                        <div><strong>Diabetes:</strong> ${
                          formData.diabetes === "1" ? "Sí" : "No"
                        }</div>
                        <div><strong>Historial Familiar:</strong> ${
                          formData.family_history_cancer === "1" ? "Sí" : "No"
                        }</div>
                        <div><strong>Función Hepática:</strong> ${
                          formData.liver_function_score
                        }</div>
                        <div><strong>Alfa-fetoproteína:</strong> ${
                          formData.alpha_fetoprotein_level
                        } ng/mL</div>
                    </div>
                </div>
            </div>
            <div class="print-footer">
                <p>Fecha del Reporte: ${new Date().toLocaleDateString()}</p>
                <p>* Este reporte es generado por una herramienta de evaluación y no sustituye el diagnóstico médico profesional.</p>
            </div>
        </div>
    `;

  // 3. Crear los estilos para el reporte (CON CORRECCIONES)
  // Se añade !important, -webkit-print-color-adjust, y flexbox
  const printCSS = `
        /* --- ESTILOS MEJORADOS PARA IMPRESIÓN --- */
        .print-container {
            font-family: 'Inter', sans-serif;
            color: #1A202C;
            width: 210mm; /* Ancho A4 */
            height: 297mm; /* Alto A4 */
            margin: 0 auto;
            border: 1px solid #eee;
            display: flex; /* Usar Flexbox para la estructura general */
            flex-direction: column; /* Estructura vertical */
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important; /* Forzar colores en Chrome */
            print-color-adjust: exact !important; /* Forzar colores en Firefox/Edge */
        }
        .print-header {
            display: flex;
            align-items: center;
            padding: 20px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            flex-shrink: 0; /* Evitar que el header se encoja */
        }
        .print-logo {
            background: rgba(255,255,255,0.2) !important;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 16px;
            flex-shrink: 0;
        }
        .print-logo svg { width: 30px; height: 30px; fill: white !important; }
        .print-header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            line-height: 1.2;
            color: white !important;
        }
        .print-body {
            padding: 24px;
            flex-grow: 1; /* Ocupar el espacio restante */
        }
        .print-risk-summary {
            text-align: center;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            page-break-inside: avoid; /* Evitar que se parta */
        }
        .risk-high .print-risk-summary { border-color: #e53e3e !important; }
        .risk-moderate .print-risk-summary { border-color: #ed8936 !important; }
        .risk-low .print-risk-summary { border-color: #38a169 !important; }

        .print-risk-icon {
            font-size: 48px;
            line-height: 1;
            margin-bottom: 12px;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px auto;
        }
        .risk-high .print-risk-icon { background-color: #e53e3e !important; color: white !important; }
        .risk-moderate .print-risk-icon { background-color: #ed8936 !important; color: white !important; }
        .risk-low .print-risk-icon { background-color: #38a169 !important; color: white !important; }

        .print-risk-value {
            font-size: 52px;
            font-weight: 800;
            line-height: 1;
        }
        .risk-high .print-risk-value { color: #e53e3e !important; }
        .risk-moderate .print-risk-value { color: #ed8936 !important; }
        .risk-low .print-risk-value { color: #38a169 !important; }

        .print-risk-message {
            font-size: 20px;
            font-weight: 600;
            margin-top: 8px;
        }
        .risk-high .print-risk-message { color: #e53e3e !important; }
        .risk-moderate .print-risk-message { color: #ed8936 !important; }
        .risk-low .print-risk-message { color: #38a169 !important; }

        .print-recommendation, .print-details {
            margin-bottom: 24px;
            page-break-inside: avoid; /* Evitar que se parta */
        }
        .print-recommendation h2, .print-details h2 {
            font-size: 18px;
            font-weight: 700;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
            margin-bottom: 12px;
            color: #1A202C !important;
        }
        .print-recommendation p {
            font-size: 16px;
            line-height: 1.6;
            background-color: #f7fafc !important;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
        }
        .print-grid {
            display: grid !important; /* Forzar el layout de Grid */
            grid-template-columns: 1fr 1fr !important; /* Forzar las 2 columnas */
            gap: 12px;
            font-size: 15px;
        }
        .print-grid div {
            padding: 10px;
            background-color: #f7fafc !important;
            border-radius: 6px;
            page-break-inside: avoid;
        }
        .print-grid div strong {
            font-weight: 600;
        }
        .print-footer {
            text-align: center;
            font-size: 12px;
            color: #718096 !important;
            border-top: 1px solid #e2e8f0;
            padding: 20px 24px;
            flex-shrink: 0; /* Evitar que el footer se encoja */
            page-break-before: avoid; /* Intentar no ponerlo en pág. nueva */
        }
    `;

  // 4. Crear los estilos de impresión (@media print)
  const mediaPrintCSS = `
        @media print {
            @page {
                size: A4;
                margin: 0; /* Quitar márgenes de impresión del navegador */
            }
            body {
                margin: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            body * {
                visibility: hidden; /* Ocultar todo */
            }
            /* Mostrar solo el contenedor del reporte */
            #print-report-container, #print-report-container * {
                visibility: visible;
            }
            #print-report-container {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            .print-container {
                box-shadow: none;
                border: none;
                width: 100%;
                height: 100vh; /* Ocupar la página completa */
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
            }
            .print-body {
                flex-grow: 1; /* El cuerpo crece para empujar el footer */
            }
            .print-footer {
                flex-shrink: 0;
                page-break-before: avoid;
            }
        }
    `;

  // 5. Crear elementos temporales para imprimir (Sin cambios)
  const reportContainer = document.createElement("div");
  reportContainer.id = "print-report-container";
  reportContainer.innerHTML = reportHTML;

  const styleElement = document.createElement("style");
  styleElement.id = "print-report-styles";
  styleElement.innerHTML = printCSS + mediaPrintCSS;

  // 6. Añadirlos al DOM (Sin cambios)
  document.head.appendChild(styleElement);
  document.body.appendChild(reportContainer);

  // 7. Llamar a la función de impresión del navegador (Sin cambios)
  window.print();

  // 8. Limpiar el DOM después de imprimir (Sin cambios)
  document.head.removeChild(styleElement);
  document.body.removeChild(reportContainer);
});

// Inicializar estado de botones
updateNavigation();
