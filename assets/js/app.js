const estado = {
  d1: { atrapados: 0, total: 0, porcentaje: 0 },
  d2: {},
  d3: ''
};

const colores = ['rojo', 'azul', 'verde'];
const atrapados = { rojo: 0, azul: 0, verde: 0 };

function mostrarPantalla(idPantalla) {
  document.querySelectorAll('main section').forEach(sec => sec.classList.add('oculto'));
  document.getElementById(idPantalla).classList.remove('oculto');
}

document.getElementById('btn-empezar').onclick = () => {
  mostrarPantalla('pantalla-indice');
};

document.getElementById('btn-siguiente-indice').onclick = () => {
  iniciarDesafio1();
};

document.getElementById('btn-finalizar-d1').onclick = () => {
  mostrarPantalla('pantalla-desafio2');
};

// ----------------------------------- Desafío 1: Atrapa los cometas ---------------------------------------- //
let consignaInterval;

function iniciarDesafio1() {
  mostrarPantalla('pantalla-desafio1');
  const contenedor = document.getElementById('juego-cometas');
  contenedor.innerHTML = '';

  Object.keys(atrapados).forEach(color => atrapados[color] = 0);
  actualizarContadores();

  cambiarConsigna(); // primera vez
  consignaInterval = setInterval(cambiarConsigna, 4000);

  let totalCometas = 0;
  const tiempoMax = 40;
  let tiempo = 0;

  const interval = setInterval(() => {
    crearCometa(contenedor);
    totalCometas++;
    tiempo++;

    if (tiempo >= tiempoMax) {
      clearInterval(interval);
      clearInterval(consignaInterval); // detener consignas
      finalizarDesafio1(totalCometas);
    }
  }, 1000);
}

function cambiarConsigna() {
  const colorRandom = colores[Math.floor(Math.random() * colores.length)];
  document.getElementById('consigna').textContent = `Atrapa los ${colorRandom}s`;
}


function crearCometa(contenedor) {
  const color = colores[Math.floor(Math.random() * colores.length)];
  const cometa = document.createElement('div');
  cometa.classList.add('cometa', color);
  cometa.style.top = Math.random() * 260 + 'px';
  cometa.style.backgroundColor = getColorHex(color);

  cometa.onclick = () => {
  const recipiente = document.querySelector(`.recipiente.${color}`);
  const rectDestino = recipiente.getBoundingClientRect();
  const rectOrigen = cometa.getBoundingClientRect();

  const deltaX = rectDestino.left - rectOrigen.left;
  const deltaY = rectDestino.top - rectOrigen.top;

  cometa.style.transition = 'transform 0.8s ease-out, opacity 0.8s';
  cometa.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
  cometa.style.opacity = 0.1;

  // Bloquear clicks dobles
  cometa.style.pointerEvents = 'none';

  setTimeout(() => {
    atrapados[color]++;
    actualizarContadores();
    cometa.remove();
  }, 800);
};
  contenedor.appendChild(cometa);
}

function actualizarContadores() {
  colores.forEach(color => {
    document.querySelector(`.recipiente.${color} .contador`).textContent = atrapados[color];
  });
}

function getColorHex(color) {
  return {
    rojo: '#e74c3c',
    azul: '#3498db',
    verde: '#2ecc71'
  }[color];
}

function finalizarDesafio1(total) {
  const atrapadosTotal = Object.values(atrapados).reduce((a, b) => a + b, 0);
  const porcentaje = Math.round((atrapadosTotal / total) * 100);
  estado.d1 = { atrapados: atrapadosTotal, total, porcentaje };

  console.log("Resultado Desafío 1:", estado.d1);
  document.getElementById('btn-finalizar-d1').classList.remove('oculto');
}

// ----------------------------------- Desafío 2: Drag and Drop ----------------------------------- //
const asociaciones = [];

function iniciarDragDrop() {
  const frases = document.querySelectorAll('.frase');
  const cajas = document.querySelectorAll('.imagen-box');

  frases.forEach(f => {
    f.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', f.dataset.frase);
    });
  });

  cajas.forEach(box => {
    box.addEventListener('dragover', e => e.preventDefault());
    box.addEventListener('drop', e => {
      e.preventDefault();
      const fraseId = e.dataTransfer.getData('text/plain');
      const fraseEl = document.querySelector(`[data-frase="${fraseId}"]`);
      if (!box.querySelector('.frase')) {
        box.appendChild(fraseEl);
        verificarAsociaciones();
      }
    });
  });
}

function verificarAsociaciones() {
  const cajas = document.querySelectorAll('.imagen-box');
  asociaciones.length = 0;

  cajas.forEach(box => {
    const img = box.dataset.img;
    const fraseEl = box.querySelector('.frase');
    if (fraseEl) {
      asociaciones.push({
        imagen: img,
        frase: fraseEl.textContent.trim()
      });
    }
  });

  if (asociaciones.length === 3) {
    estado.d2 = asociaciones;
    console.log("Asociaciones guardadas:", estado.d2);
    document.getElementById('btn-finalizar-d2').classList.remove('oculto');
  }
}

document.getElementById('btn-finalizar-d2').onclick = () => {
  mostrarPantalla('pantalla-desafio3');
};

document.addEventListener('DOMContentLoaded', () => {
  iniciarDragDrop(); // asegurar que se active
});


document.getElementById('btn-finalizar-d2').onclick = () => {
  iniciarDesafio3();
};


document.getElementById('btn-finalizar-d2').onclick = () => {
  iniciarDesafio3();
};

document.getElementById('btn-finalizar-d2').onclick = () => {
  iniciarDesafio3();
};

// ----------------------------------- Desafío 3: Bitácora de Viaje v3 -----------------------------------
function iniciarDesafio3() {
  mostrarPantalla('pantalla-desafio3');
  
  const textarea = document.getElementById('bitacora-texto');
  const contadorElement = document.getElementById('caracteres-actuales');
  const btnFinalizar = document.getElementById('btn-finalizar-d3');
  const maxCaracteres = 500;

  // Contador de caracteres en tiempo real
  textarea.addEventListener('input', () => {
    const caracteresActuales = textarea.value.length;
    contadorElement.textContent = caracteresActuales;
    
    // Cambiar color si se acerca al límite
    const contadorContainer = document.getElementById('contador-caracteres');
    if (caracteresActuales > maxCaracteres * 0.8) {
      contadorContainer.classList.add('limite');
    } else {
      contadorContainer.classList.remove('limite');
    }
    
    // Mostrar botón cuando tenga contenido mínimo
    if (caracteresActuales >= 50) {
      btnFinalizar.classList.remove('oculto');
    } else {
      btnFinalizar.classList.add('oculto');
    }
  });

  // Limitar caracteres
  textarea.addEventListener('keydown', (e) => {
    if (textarea.value.length >= maxCaracteres && 
        e.key !== 'Backspace' && 
        e.key !== 'Delete' && 
        e.key !== 'ArrowLeft' && 
        e.key !== 'ArrowRight' && 
        e.key !== 'ArrowUp' && 
        e.key !== 'ArrowDown') {
      e.preventDefault();
    }
  });
}

// ----------------------------------- Envío automático al agente AI -----------------------------------
async function enviarAnalisisAI() {
  try {
    const jsonAnalisis = generarResumenParaAnalisis();
    
    console.log('Enviando análisis al agente AI...');
    
    const response = await fetch('http://localhost:8000/execute-task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(jsonAnalisis)
    });

    if (response.ok) {
      const resultado = await response.json();
      estado.analisisAI = resultado;
      console.log('Respuesta del agente AI recibida y almacenada');
    } else {
      console.error('Error al enviar análisis:', response.status);
      estado.analisisAI = {
        error: `Error ${response.status}: No se pudo conectar con el agente AI`
      };
    }
  } catch (error) {
    console.error('Error de conexión:', error);
    estado.analisisAI = {
      error: 'Error de conexión: No se pudo conectar con el servicio de análisis'
    };
  }
}

function finalizarDesafio3() {
  const bitacora = document.getElementById('bitacora-texto').value.trim();
  
  if (bitacora.length >= 50) {
    estado.d3 = bitacora;
    console.log("Bitácora guardada:", estado.d3);
    
    // Enviar análisis al agente AI de manera automática y silenciosa
    enviarAnalisisAI();
    
    mostrarPantalla('pantalla-final');
  } else {
    alert('Por favor, escribe al menos 50 caracteres en tu bitácora.');
  }
}

document.getElementById('btn-finalizar-d3').onclick = finalizarDesafio3;

// ----------------------------------- Pantalla Final y Resultados -----------------------------------
function generarResumenParaAnalisis() {
  // Generar resumen estructurado de los 3 desafíos
  const resumen = `DESAFÍO 1 - ATRAPA COMETAS: El usuario jugó durante 40 segundos atrapando cometas de colores que cambiaban según las instrucciones. Logró atrapar ${estado.d1.atrapados} cometas de ${estado.d1.total} totales (${estado.d1.porcentaje}% de efectividad). Las consignas cambiaban cada 4 segundos requiriendo atención sostenida y flexibilidad cognitiva. 

DESAFÍO 2 - ASOCIACIONES: El usuario asoció 3 frases con imágenes espaciales usando drag & drop. Las asociaciones fueron: ${estado.d2.map(item => `"${item.frase}" con imagen ${item.imagen}`).join(', ')}. Esta tarea evaluó capacidad de organización, toma de decisiones y procesamiento visual-textual.

DESAFÍO 3 - BITÁCORA: El usuario escribió una reflexión de ${estado.d3.length} caracteres sobre su experiencia: "${estado.d3.substring(0, 200)}${estado.d3.length > 200 ? '...' : ''}". Esta escritura libre permite evaluar patrones de pensamiento, autoregulación emocional y capacidad de introspección.`;

  // JSON para enviar al agente AI
  const jsonParaAnalisis = {
    "objective": `Hoy el usuario realizó las siguientes actividades de evaluación: '${resumen}'`,
    "task_name": "mental-health-analysis",
    "task_objective": "Detectar señales de TDAH o ansiedad",
    "instructions": "Analizar los resultados expuestos por el usuario y determinar si muestra indicios de TDAH, ansiedad o ambos. Identificar los patrones de comportamiento o emociones expresados. La respuesta debe ser una oración simple enfatizando si es verdadero o falso."
  };

  return jsonParaAnalisis;
}

function mostrarResultados() {
  const claveSecreta = document.getElementById('clave-secreta').value;
  const claveCorrecta = 'galaxia2025'; // Puedes cambiar esta clave
  
  if (claveSecreta === claveCorrecta) {
    // Resumen original completo de la misión
    const resultados = {
      mision: "Exploración de la Galaxia Interior",
      fecha: new Date().toLocaleDateString('es-ES'),
      hora: new Date().toLocaleTimeString('es-ES'),
      explorador: "Viajero Estelar",
      desafios: {
        desafio1_cometas: {
          cometas_atrapados: estado.d1.atrapados,
          cometas_totales: estado.d1.total,
          porcentaje_exito: estado.d1.porcentaje + '%',
          tiempo_juego: '40 segundos'
        },
        desafio2_asociaciones: {
          asociaciones_realizadas: estado.d2.length,
          detalles: estado.d2.map(item => ({
            imagen: item.imagen,
            frase_asociada: item.frase
          }))
        },
        desafio3_bitacora: {
          caracteres_escritos: estado.d3.length,
          contenido: estado.d3
        }
      },
      resumen: {
        desafios_completados: 3,
        estado_mision: "COMPLETADA",
        puntuacion_general: calcularPuntuacionGeneral()
      }
    };
    
    // Generar JSON para análisis de salud mental
    const jsonAnalisis = generarResumenParaAnalisis();
    
    // Incluir la respuesta del agente AI si está disponible
    let resultadosCompletos = {
      "=== RESUMEN ORIGINAL DE LA MISIÓN ===": resultados,
      "=== JSON ENVIADO PARA ANÁLISIS AI ===": jsonAnalisis
    };

    // Agregar respuesta del agente AI si está disponible
    if (estado.analisisAI) {
      resultadosCompletos["=== RESPUESTA DEL AGENTE AI (ANÁLISIS DE SALUD MENTAL) ==="] = estado.analisisAI;
    } else {
      resultadosCompletos["=== RESPUESTA DEL AGENTE AI (ANÁLISIS DE SALUD MENTAL) ==="] = {
        estado: "Procesando análisis... o no disponible"
      };
    }
    
    document.getElementById('resultados-json').textContent = JSON.stringify(resultadosCompletos, null, 2);
    document.getElementById('resultados-container').classList.remove('oculto');
    
    // También mostrar en consola separadamente para mayor claridad
    console.log('=== RESULTADOS COMPLETOS DE LA MISIÓN ===');
    console.log(JSON.stringify(resultados, null, 2));
    console.log('\n=== JSON ENVIADO PARA ANÁLISIS AI ===');
    console.log(JSON.stringify(jsonAnalisis, null, 2));
    
    if (estado.analisisAI) {
      console.log('\n=== RESPUESTA DEL AGENTE AI ===');
      console.log(JSON.stringify(estado.analisisAI, null, 2));
    }
    
  } else {
    alert('Clave secreta incorrecta. Intenta con: galaxia2025');
  }
}

function calcularPuntuacionGeneral() {
  let puntuacion = 0;
  
  // Puntuación por cometas (máximo 40 puntos)
  puntuacion += Math.min(estado.d1.porcentaje * 0.4, 40);
  
  // Puntuación por asociaciones (30 puntos si completó todas)
  if (estado.d2.length === 3) {
    puntuacion += 30;
  }
  
  // Puntuación por bitácora (30 puntos por participación)
  if (estado.d3.length >= 50) {
    puntuacion += 30;
  }
  
  return Math.round(puntuacion) + '/100';
}

document.getElementById('btn-mostrar-resultados').onclick = mostrarResultados;

document.addEventListener('DOMContentLoaded', () => {
  iniciarDragDrop(); // asegurar que se active
});

// Permitir presionar Enter en el campo de clave secreta
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('clave-secreta').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      mostrarResultados();
    }
  });
});






// ----------------------------------- Desafío 3: Bitácora de Viaje v2 -----------------------------------
// function iniciarDesafio3() {
//   mostrarPantalla('pantalla-desafio3');
  
//   const textarea = document.getElementById('bitacora-texto');
//   const contadorElement = document.getElementById('caracteres-actuales');
//   const btnFinalizar = document.getElementById('btn-finalizar-d3');
//   const maxCaracteres = 500;

//   // Contador de caracteres en tiempo real
//   textarea.addEventListener('input', () => {
//     const caracteresActuales = textarea.value.length;
//     contadorElement.textContent = caracteresActuales;
    
//     // Cambiar color si se acerca al límite
//     const contadorContainer = document.getElementById('contador-caracteres');
//     if (caracteresActuales > maxCaracteres * 0.8) {
//       contadorContainer.classList.add('limite');
//     } else {
//       contadorContainer.classList.remove('limite');
//     }
    
//     // Mostrar botón cuando tenga contenido mínimo
//     if (caracteresActuales >= 50) {
//       btnFinalizar.classList.remove('oculto');
//     } else {
//       btnFinalizar.classList.add('oculto');
//     }
//   });

//   // Limitar caracteres
//   textarea.addEventListener('keydown', (e) => {
//     if (textarea.value.length >= maxCaracteres && 
//         e.key !== 'Backspace' && 
//         e.key !== 'Delete' && 
//         e.key !== 'ArrowLeft' && 
//         e.key !== 'ArrowRight' && 
//         e.key !== 'ArrowUp' && 
//         e.key !== 'ArrowDown') {
//       e.preventDefault();
//     }
//   });
// }

// function finalizarDesafio3() {
//   const bitacora = document.getElementById('bitacora-texto').value.trim();
  
//   if (bitacora.length >= 50) {
//     estado.d3 = bitacora;
//     console.log("Bitácora guardada:", estado.d3);
//     mostrarPantalla('pantalla-final');
//   } else {
//     alert('Por favor, escribe al menos 50 caracteres en tu bitácora.');
//   }
// }

// document.getElementById('btn-finalizar-d3').onclick = finalizarDesafio3;

// // ----------------------------------- Pantalla Final y Resultados -----------------------------------
// function generarResumenParaAnalisis() {
//   // Generar resumen estructurado de los 3 desafíos
//   const resumen = `DESAFÍO 1 - ATRAPA COMETAS: El usuario jugó durante 40 segundos atrapando cometas de colores que cambiaban según las instrucciones. Logró atrapar ${estado.d1.atrapados} cometas de ${estado.d1.total} totales (${estado.d1.porcentaje}% de efectividad). Las consignas cambiaban cada 4 segundos requiriendo atención sostenida y flexibilidad cognitiva. 

// DESAFÍO 2 - ASOCIACIONES: El usuario asoció 3 frases con imágenes espaciales usando drag & drop. Las asociaciones fueron: ${estado.d2.map(item => `"${item.frase}" con imagen ${item.imagen}`).join(', ')}. Esta tarea evaluó capacidad de organización, toma de decisiones y procesamiento visual-textual.

// DESAFÍO 3 - BITÁCORA: El usuario escribió una reflexión de ${estado.d3.length} caracteres sobre su experiencia: "${estado.d3.substring(0, 200)}${estado.d3.length > 200 ? '...' : ''}". Esta escritura libre permite evaluar patrones de pensamiento, autoregulación emocional y capacidad de introspección.`;

//   // JSON para enviar al agente AI
//   const jsonParaAnalisis = {
//     "objective": `Hoy el usuario realizó las siguientes actividades de evaluación: '${resumen}'`,
//     "task_name": "mental-health-analysis",
//     "task_objective": "Detectar señales de TDAH o ansiedad",
//     "instructions": "Analizar los resultados expuestos por el usuario y determinar si muestra indicios de TDAH, ansiedad o ambos. Identificar los patrones de comportamiento o emociones expresados. La respuesta debe ser una oración simple enfatizando si es verdadero o falso."
//   };

//   return jsonParaAnalisis;
// }

// function mostrarResultados() {
//   const claveSecreta = document.getElementById('clave-secreta').value;
//   const claveCorrecta = 'galaxia2025'; // Puedes cambiar esta clave
  
//   if (claveSecreta === claveCorrecta) {
//     // Resumen original completo de la misión
//     const resultados = {
//       mision: "Exploración de la Galaxia Interior",
//       fecha: new Date().toLocaleDateString('es-ES'),
//       hora: new Date().toLocaleTimeString('es-ES'),
//       explorador: "Viajero Estelar",
//       desafios: {
//         desafio1_cometas: {
//           cometas_atrapados: estado.d1.atrapados,
//           cometas_totales: estado.d1.total,
//           porcentaje_exito: estado.d1.porcentaje + '%',
//           tiempo_juego: '40 segundos'
//         },
//         desafio2_asociaciones: {
//           asociaciones_realizadas: estado.d2.length,
//           detalles: estado.d2.map(item => ({
//             imagen: item.imagen,
//             frase_asociada: item.frase
//           }))
//         },
//         desafio3_bitacora: {
//           caracteres_escritos: estado.d3.length,
//           contenido: estado.d3
//         }
//       },
//       resumen: {
//         desafios_completados: 3,
//         estado_mision: "COMPLETADA",
//         puntuacion_general: calcularPuntuacionGeneral()
//       }
//     };
    
//     // Generar JSON para análisis de salud mental
//     const jsonAnalisis = generarResumenParaAnalisis();
    
//     // Mostrar ambos resultados organizados
//     const resultadosCompletos = {
//       "=== RESUMEN ORIGINAL DE LA MISIÓN ===": resultados,
//       "=== JSON PARA ANÁLISIS AI (SALUD MENTAL) ===": jsonAnalisis
//     };
    
//     document.getElementById('resultados-json').textContent = JSON.stringify(resultadosCompletos, null, 2);
//     document.getElementById('resultados-container').classList.remove('oculto');
    
//     // También mostrar en consola separadamente para mayor claridad
//     console.log('=== RESULTADOS COMPLETOS DE LA MISIÓN ===');
//     console.log(JSON.stringify(resultados, null, 2));
//     console.log('\n=== JSON PARA ANÁLISIS AI ===');
//     console.log(JSON.stringify(jsonAnalisis, null, 2));
    
//   } else {
//     alert('Clave secreta incorrecta. Intenta con: galaxia2025');
//   }
// }

// function calcularPuntuacionGeneral() {
//   let puntuacion = 0;
  
//   // Puntuación por cometas (máximo 40 puntos)
//   puntuacion += Math.min(estado.d1.porcentaje * 0.4, 40);
  
//   // Puntuación por asociaciones (30 puntos si completó todas)
//   if (estado.d2.length === 3) {
//     puntuacion += 30;
//   }
  
//   // Puntuación por bitácora (30 puntos por participación)
//   if (estado.d3.length >= 50) {
//     puntuacion += 30;
//   }
  
//   return Math.round(puntuacion) + '/100';
// }

// document.getElementById('btn-mostrar-resultados').onclick = mostrarResultados;

// document.addEventListener('DOMContentLoaded', () => {
//   iniciarDragDrop(); // asegurar que se active
// });

// // Permitir presionar Enter en el campo de clave secreta
// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('clave-secreta').addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       mostrarResultados();
//     }
//   });
// });




// // ----------------------------------- Desafío 3: Bitácora de Viaje v1 -----------------------------------
// function iniciarDesafio3() {
//   mostrarPantalla('pantalla-desafio3');
  
//   const textarea = document.getElementById('bitacora-texto');
//   const contadorElement = document.getElementById('caracteres-actuales');
//   const btnFinalizar = document.getElementById('btn-finalizar-d3');
//   const maxCaracteres = 500;

//   // Contador de caracteres en tiempo real
//   textarea.addEventListener('input', () => {
//     const caracteresActuales = textarea.value.length;
//     contadorElement.textContent = caracteresActuales;
    
//     // Cambiar color si se acerca al límite
//     const contadorContainer = document.getElementById('contador-caracteres');
//     if (caracteresActuales > maxCaracteres * 0.8) {
//       contadorContainer.classList.add('limite');
//     } else {
//       contadorContainer.classList.remove('limite');
//     }
    
//     // Mostrar botón cuando tenga contenido mínimo
//     if (caracteresActuales >= 50) {
//       btnFinalizar.classList.remove('oculto');
//     } else {
//       btnFinalizar.classList.add('oculto');
//     }
//   });

//   // Limitar caracteres
//   textarea.addEventListener('keydown', (e) => {
//     if (textarea.value.length >= maxCaracteres && 
//         e.key !== 'Backspace' && 
//         e.key !== 'Delete' && 
//         e.key !== 'ArrowLeft' && 
//         e.key !== 'ArrowRight' && 
//         e.key !== 'ArrowUp' && 
//         e.key !== 'ArrowDown') {
//       e.preventDefault();
//     }
//   });
// }

// function finalizarDesafio3() {
//   const bitacora = document.getElementById('bitacora-texto').value.trim();
  
//   if (bitacora.length >= 50) {
//     estado.d3 = bitacora;
//     console.log("Bitácora guardada:", estado.d3);
//     mostrarPantalla('pantalla-final');
//   } else {
//     alert('Por favor, escribe al menos 50 caracteres en tu bitácora.');
//   }
// }

// document.getElementById('btn-finalizar-d3').onclick = finalizarDesafio3;

// // ----------------------------------- Pantalla Final y Resultados -----------------------------------
// function mostrarResultados() {
//   const claveSecreta = document.getElementById('clave-secreta').value;
//   const claveCorrecta = 'galaxia2025'; // Puedes cambiar esta clave
  
//   if (claveSecreta === claveCorrecta) {
//     const resultados = {
//       mision: "Exploración de la Galaxia Interior",
//       fecha: new Date().toLocaleDateString('es-ES'),
//       hora: new Date().toLocaleTimeString('es-ES'),
//       explorador: "Viajero Estelar",
//       desafios: {
//         desafio1_cometas: {
//           cometas_atrapados: estado.d1.atrapados,
//           cometas_totales: estado.d1.total,
//           porcentaje_exito: estado.d1.porcentaje + '%',
//           tiempo_juego: '40 segundos'
//         },
//         desafio2_asociaciones: {
//           asociaciones_realizadas: estado.d2.length,
//           detalles: estado.d2.map(item => ({
//             imagen: item.imagen,
//             frase_asociada: item.frase
//           }))
//         },
//         desafio3_bitacora: {
//           caracteres_escritos: estado.d3.length,
//           contenido: estado.d3
//         }
//       },
//       resumen: {
//         desafios_completados: 3,
//         estado_mision: "COMPLETADA",
//         puntuacion_general: calcularPuntuacionGeneral()
//       }
//     };
    
//     document.getElementById('resultados-json').textContent = JSON.stringify(resultados, null, 2);
//     document.getElementById('resultados-container').classList.remove('oculto');
    
//     // También mostrar en consola
//     console.log('=== RESULTADOS COMPLETOS DE LA MISIÓN ===');
//     console.log(JSON.stringify(resultados, null, 2));
    
//   } else {
//     alert('Clave secreta incorrecta. Intenta con: galaxia2025');
//   }
// }

// function calcularPuntuacionGeneral() {
//   let puntuacion = 0;
  
//   // Puntuación por cometas (máximo 40 puntos)
//   puntuacion += Math.min(estado.d1.porcentaje * 0.4, 40);
  
//   // Puntuación por asociaciones (30 puntos si completó todas)
//   if (estado.d2.length === 3) {
//     puntuacion += 30;
//   }
  
//   // Puntuación por bitácora (30 puntos por participación)
//   if (estado.d3.length >= 50) {
//     puntuacion += 30;
//   }
  
//   return Math.round(puntuacion) + '/100';
// }

// document.getElementById('btn-mostrar-resultados').onclick = mostrarResultados;

// document.addEventListener('DOMContentLoaded', () => {
//   iniciarDragDrop(); // asegurar que se active
// });

// // Permitir presionar Enter en el campo de clave secreta
// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('clave-secreta').addEventListener('keypress', (e) => {
//     if (e.key === 'Enter') {
//       mostrarResultados();
//     }
//   });
// });