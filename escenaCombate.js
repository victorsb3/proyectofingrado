// Cargar imagen del fondo del combate
const fondoCombateImagen = new Image()
fondoCombateImagen.src = './imagenes/fondoCombate.png'

// FONDO COMBATE
const fondoCombate = new Sprite({
	posicion: {
		x: 0,
		y: 0
	},
	imagen: fondoCombateImagen
})

// Variables
let enemigo
let aliado
let spritesRenderizados
let cola
let animacionCombateId

function inicioCombate() {
	document.querySelector('#contenedorCombate').style.display = 'block'
	document.querySelector('#dialogoCaja').style.display = 'block'
	document.querySelector('#barraVidaEnemiga').style.width = '100%'
	document.querySelector('#barraVidaAliada').style.width = '100%'
	document.querySelector('#ataquesCaja').replaceChildren()

	enemigo = new Criatura(criaturas.Enemigo)
	aliado = new Criatura(criaturas.Aliado)

	// Sprites criaturas
	spritesRenderizados = [enemigo, aliado]
	// Para cada turno
	cola = []

	aliado.ataques.forEach(ataque => {
		const button = document.createElement('button')
		button.innerHTML = ataque.nombre
		document.querySelector('#ataquesCaja').append(button)
	})



	// Eventos de los botones de ataque
	document.querySelectorAll('button').forEach((button) => {
		button.addEventListener('click', (e) => {
			const ataqueSeleccionado = ataques[e.currentTarget.innerHTML]
			aliado.ataque({
				ataque: ataqueSeleccionado,
				receptor: enemigo,
				spritesRenderizados
			})

			if (enemigo.vida <= 0) {
				cola.push(() => {
					enemigo.debilitado()
				})
				cola.push(() => {
					volverMapa()
				})
				$.ajax({
					method: 'post',
					url: 'aumentarVictoria.php',
					data: { nombre: localStorage.usuarioNombre, contra: localStorage.usuarioContra},
					success: function (response) {
						console.log(response);
					}
				});
			}
			// ATAQUE ENEMIGO
			const ataqueAleatorio = enemigo.ataques[Math.floor(Math.random() * enemigo.ataques.length)]
			cola.push(() => {
				enemigo.ataque({
					ataque: ataqueAleatorio,
					receptor: aliado,
					spritesRenderizados
				})
				if (aliado.vida <= 0) {
					cola.push(() => {
						aliado.debilitado()
					})
					cola.push(() => {
						volverMapa()
					})
					$.ajax({
						method: 'post',
						url: 'aumentarDerrota.php',
						data: { nombre: localStorage.usuarioNombre, contra: localStorage.usuarioContra},
						success: function (response) {
							console.log(response);
						}
					});

				}
			})
		})

		// Evento al pasar por encima de los ataques
		button.addEventListener('mouseenter', (e) => {
			// Captar el elemento
			const ataqueMostrado = ataques[e.currentTarget.innerHTML]
			// Cambiar el color y el nombre segun el ataque
			document.querySelector('#tipoAtaque').innerHTML = ataqueMostrado.tipo
			document.querySelector('#tipoAtaque').style.color = ataqueMostrado.color
		})
	})

}


// Fondo y sprites de las criaturas
function animacionCombate() {
	// Fondo
	animacionCombateId = window.requestAnimationFrame(animacionCombate)
	fondoCombate.dibujar()
	// Criaturas
	spritesRenderizados.forEach((sprite) => {
		sprite.dibujar()
	})

}

animacion();
//inicioCombate()
//animacionCombate();


// Al hacer click al dialogo
document.querySelector('#dialogoCaja').addEventListener('click', (e) => {
	// Cola con acciones
	if (cola.length > 0) {
		cola[0]()
		//console.info(cola[0])
		// Para eliminar el primer elemento del array y retornarlo
		cola.shift()
	} else {
		e.currentTarget.style.display = 'none'
	}
})