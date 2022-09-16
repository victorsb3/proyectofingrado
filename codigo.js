// CANVAS
const canvas = document.querySelector('canvas');
const entorno = canvas.getContext('2d');

// Tamaño recomendado para que pueda visualizarlo cualquier pantalla
canvas.width = 1024;
canvas.height = 576;

// Recoger las colisiones de 70 en 70
const colisionesMapa = [];
for (let i = 0; i < colisiones.length; i += 70) {
	colisionesMapa.push(colisiones.slice(i, 70 + i));
}

// Recoger las hierbas altas de 70 en 70
const hierbaAltaMapa = [];
for (let i = 0; i < hierbaAltaData.length; i += 70) {
	hierbaAltaMapa.push(hierbaAltaData.slice(i, 70 + i));
}

// INICIO DEL PERSONAJE
const inicioJuego = {
	x: -3500,
	y: -850
}

// Array para las colisiones
const limites = [];

// Recorrer el array en busca de las colisiones
colisionesMapa.forEach((fila, i) => {
	fila.forEach((simbolo, j) => {
		// 2672 = colision
		if (simbolo === 2672) {
			limites.push(
				new Perimetro({
					posicion: {
						x: j * Perimetro.width + inicioJuego.x,
						y: i * Perimetro.height + inicioJuego.y
					}
				})
			)
		}
	})
})

// Array con las hierbas altas
const hierbaAlta = []

hierbaAltaMapa.forEach((fila, i) => {
	fila.forEach((simbolo, j) => {
		// 2000 = hierba alta
		if (simbolo === 2000) {
			hierbaAlta.push(
				new Perimetro({
					posicion: {
						x: j * Perimetro.width + inicioJuego.x,
						y: i * Perimetro.height + inicioJuego.y
					}
				})
			)
		}
	})
})

// Cargar imagen del mapa
const imagen = new Image();
imagen.src = './imagenes/MapaCesFuencarral.png';

// Cargar imagen del primer plano
const imagenPrimerPlano = new Image();
imagenPrimerPlano.src = './imagenes/objetosPrimerPlano.png';

// Cargar imagen del personaje abajo
const imagenPersonajeAbajo = new Image();
imagenPersonajeAbajo.src = './imagenes/jugadorAbajo.png';

// Cargar imagen del personaje arriba
const imagenPersonajeArriba = new Image();
imagenPersonajeArriba.src = './imagenes/jugadorArriba.png';

// Cargar imagen del personaje izquierda
const imagenPersonajeIzquierda = new Image();
imagenPersonajeIzquierda.src = './imagenes/jugadorIzquierda.png';

// Cargar imagen del personaje derecha
const imagenPersonajeDerecha = new Image();
imagenPersonajeDerecha.src = './imagenes/jugadorDerecha.png';

// PERSONAJE
const personaje = new Sprite({
	posicion: {
		x: canvas.width / 2 - 255 / 4 / 1.6,
		y: canvas.height / 2 - 90 / 2
	},
	imagen: imagenPersonajeAbajo,
	frames: {
		max: 4,
		velocidad: 20
	},
	direccion: {
		arriba: imagenPersonajeArriba,
		abajo: imagenPersonajeAbajo,
		izquierda: imagenPersonajeIzquierda,
		derecha: imagenPersonajeDerecha
	}
})

// Mapa
const fondo = new Sprite({
	posicion: {
		x: inicioJuego.x,
		y: inicioJuego.y
	},
	imagen: imagen
})

// Primer plano
const primerPlano = new Sprite({
	posicion: {
		x: inicioJuego.x,
		y: inicioJuego.y
	},
	imagen: imagenPrimerPlano
})

// Declarar las teclas( w, s, a, d )
const teclas = {
	w: {
		presionado: false
	},
	s: {
		presionado: false
	},
	a: {
		presionado: false
	},
	d: {
		presionado: false
	}
}

// Todos los elementos movibles ( para que se muevan con el movimiento del personaje )
const movibles = [fondo, ...limites, primerPlano, ...hierbaAlta];

// Para reconocer cuando entra a una colision (rectangulo 1=personaje, rectangulo 2=colision)
function conlisionRectangular({ rectangulo1, rectangulo2 }) {
	// Retornar las condiciones
	return (
		// Cuando la posicion x + la anchura del personaje sea mayor o igual que el lado izquierdo del cuadro de colision
		rectangulo1.posicion.x + rectangulo1.width >= rectangulo2.posicion.x &&
		// Cuando la posicion x del personaje sea menor o igual que el lado derecho del cuadro de colision
		rectangulo1.posicion.x <= rectangulo2.posicion.x + rectangulo2.width &&
		// Cuando la posicion y del personaje sea menor o igual que la parte inferior del cuadro de colision
		rectangulo1.posicion.y <= rectangulo2.posicion.y + rectangulo2.height &&
		// Cuando la posicion y + la altura del personaje sea mayor o igual que la parte superior del cuadro de colision
		rectangulo1.posicion.y + rectangulo1.height >= rectangulo2.posicion.y
	)
}

const combate = {
	iniciado: false
}

function animacion() {
	// Generar un loop para cargar constatemente las imagenes
	const animacionId = window.requestAnimationFrame(animacion);
	// Dibujar el fondo
	fondo.dibujar();
	// Dibujar el perimetro
	limites.forEach((perimetro) => {
		perimetro.dibujar();
	});
	// Dibujar hierba alta
	hierbaAlta.forEach((hierbaAlta) => {
		hierbaAlta.dibujar();
	});
	// Dibujar el personaje
	personaje.dibujar();
	// Dibujar el primer plano
	primerPlano.dibujar();
	
	let movimiento = true;

	// No hay animacion si no se mueve
	personaje.animado = false;

	if (combate.iniciado) return

	// Si alguna tecla esta presionada
	if (teclas.w.presionado || teclas.s.presionado || teclas.a.presionado || teclas.d.presionado) {
		// Detectar si esta en hierba alta
		for (let i = 0; i < hierbaAlta.length; i++) {
			const hierbasAltas = hierbaAlta[i];
			const areaPisada = 
				// Definir lado derecho del personaje y lado derecho del cuadrado de hierba alta
				(Math.min(personaje.posicion.x + personaje.width, hierbasAltas.posicion.x + hierbasAltas.width) -
				// Definir lado izquierdo del personaje y lado izquierdo del cuadrado de hierba alta
				Math.max(personaje.posicion.x, hierbasAltas.posicion.x)) *
				// Definir lado de abajo del personaje y lado de abajo del cuadrado de hierba alta
				(Math.min(personaje.posicion.y + personaje.height, hierbasAltas.posicion.y + hierbasAltas.height) -
				// Definir lado de arriba del personaje y lado de arriba del cuadrado de hierba alta
				Math.max(personaje.posicion.y, hierbasAltas.posicion.y))
			if (conlisionRectangular({
				rectangulo1: personaje,
				rectangulo2: hierbasAltas
				// Si el area pisada es mayor a la mitad del tamaño del jugador
			}) && areaPisada > (personaje.width * personaje.height) / 2 && Math.random() < 0.01) {
				//Para de entrar a animacion()
				window.cancelAnimationFrame(animacionId);

				// Para el audio del mapa
				audio.Mapa.stop()
				// Sonido de comezar combate
				audio.InicioCombate.play()
				// Comienza el audio del combate
				audio.Combate.play()

				// Definir que ha empezado el combate
				combate.iniciado = true;
				// Efecto de variación de opacidad 3 veces
				gsap.to('#encimaDiv', {
					opacity: 1,
					repeat: 3,
					yoyo: true,
					duration: 0.4,
					// Cuando se completa el efecto
					onComplete() {
						// Aumentar opacidad al 1 durante 0.4s
						gsap.to('#encimaDiv', {
							opacity: 1,
							duration: 0.4,
							// Cuando se completa el efecto
							onComplete() {
								// Empieza el combate
								inicioCombate()
								animacionCombate()
								// Quitar opacidad para ver el combate
								gsap.to('#encimaDiv', {
									opacity: 0,
									duration: 0.4
								})
							}
						})
					}
				})
				break
			}
		}
	}

	// Movimiento arriba
	if (teclas.w.presionado && ultimaTecla === 'w') {
		// Bucle para las colisiones
		for (let i = 0; i < limites.length; i++) {
			// El personaje se mueve
			personaje.animado = true;
			// Direccion en la que se mueve el personaje
			personaje.imagen = personaje.direccion.arriba
			// Define el perimetro
			const perimetro = limites[i];
			// Si hay colision anular movimiento
			if (conlisionRectangular({
				// Rectangulo del personaje
				rectangulo1: personaje,
				// Rectangulos de las colisiones
				rectangulo2: {
					...perimetro, posicion: {
						x: perimetro.posicion.x,
						y: perimetro.posicion.y + 1.5
					}
				}
			})) {
				// Si choca, para el movimiento
				movimiento = false;
			}
		}
		// Movimiento hacia arriba
		if (movimiento) {
			movibles.forEach(movible => {
				movible.posicion.y += 1.5
			})
		}
	// Movimiento abajo
	} else if (teclas.s.presionado && ultimaTecla === 's') {
		for (let i = 0; i < limites.length; i++) {
			personaje.animado = true;
			personaje.imagen = personaje.direccion.abajo
			const perimetro = limites[i];
			if (conlisionRectangular({
				rectangulo1: personaje,
				rectangulo2: {
					...perimetro, posicion: {
						x: perimetro.posicion.x,
						y: perimetro.posicion.y - 1.5
					}
				}
			})) {
				movimiento = false;
			}
		}
		if (movimiento) {
			movibles.forEach(movible => {
				movible.posicion.y -= 1.5
			})
		}
	// Movimiento izquierda
	} else if (teclas.a.presionado && ultimaTecla === 'a') {
		for (let i = 0; i < limites.length; i++) {
			personaje.animado = true;
			personaje.imagen = personaje.direccion.izquierda
			const perimetro = limites[i];
			if (conlisionRectangular({
				rectangulo1: personaje,
				rectangulo2: {
					...perimetro, posicion: {
						x: perimetro.posicion.x + 1.5,
						y: perimetro.posicion.y
					}
				}
			})) {
				movimiento = false;
			}
		}
		if (movimiento) {
			movibles.forEach(movible => {
				movible.posicion.x += 1.5
			})
		}
	// Movimiento derecha
	} else if (teclas.d.presionado && ultimaTecla === 'd') {
		for (let i = 0; i < limites.length; i++) {
			personaje.animado = true;
			personaje.imagen = personaje.direccion.derecha
			const perimetro = limites[i];
			if (conlisionRectangular({
				rectangulo1: personaje,
				rectangulo2: {
					...perimetro, posicion: {
						x: perimetro.posicion.x - 1.5,
						y: perimetro.posicion.y
					}
				}
			})) {
				movimiento = false;
			}
		}
		if (movimiento) {
			movibles.forEach(movible => {
				movible.posicion.x -= 1.5
			})
		}
	}
}

function volverMapa(){
	gsap.to('#encimaDiv', {
		opacity: 1,
		onComplete: () => {
			cancelAnimationFrame(animacionCombateId)
			animacion()
			document.querySelector('#contenedorCombate').style.display = 'none'
			gsap.to('#encimaDiv', {
				opacity: 0
			})
			combate.iniciado = false
			audio.Mapa.play()
		}

	})
}




// EVENTOS AL PRESIONAR UNA TECLA
let ultimaTecla = '';
window.addEventListener('keydown', (e) => {
	// Segun la tecla presionada
	switch (e.key) {
		// Arriba
		case 'w':
			teclas.w.presionado = true;
			ultimaTecla = 'w';
			break;
		// Abajo
		case 's':
			teclas.s.presionado = true;
			ultimaTecla = 's';
			break;
		// Izquierda
		case 'a':
			teclas.a.presionado = true;
			ultimaTecla = 'a';
			break;
		// Derecha
		case 'd':
			teclas.d.presionado = true;
			ultimaTecla = 'd';
			break;
	}
})

// EVENTOS AL SOLTAR UNA TECLA
window.addEventListener('keyup', (e) => {
	// Segun la tecla soltada
	switch (e.key) {
		// Arriba
		case 'w':
			teclas.w.presionado = false;
			break;
		// Abajo
		case 's':
			teclas.s.presionado = false;
			break;
		// Izquierda
		case 'a':
			teclas.a.presionado = false;
			break;
		// Derecha
		case 'd':
			teclas.d.presionado = false;
			break;
	}
})

let clicked=false
addEventListener('click', ()=>{
	if(!clicked){
		audio.Mapa.play()
		clicked=true
	}
})


