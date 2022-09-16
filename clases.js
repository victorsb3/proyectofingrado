// Objeto SPRITE
class Sprite {
	constructor({
		posicion,
		imagen,
		frames = { max: 1, velocidad: 10 },
		direccion,
		animado = false,
		rotacion = 0
	}) {
		this.posicion = posicion;
		this.imagen = new Image();
		this.frames = { ...frames, val: 0, secuencia: 0 };
		this.imagen.onload = () => {
			this.width = this.imagen.width / this.frames.max
			this.height = this.imagen.height
		}
		this.imagen.src=imagen.src
		this.animado = animado
		this.direccion = direccion
		this.opacidad = 1
		this.rotacion= rotacion
	}
	dibujar() {

		entorno.save()
	 	entorno.translate(
			this.posicion.x + this.width / 2, 
			this.posicion.y + this.height /2
		)
		entorno.rotate(this. rotacion)
		entorno.translate(
			-this.posicion.x - this.width / 2, 
			-this.posicion.y - this.height /2
		)
		entorno.globalAlpha = this.opacidad

		// DIBUJAR IMAGEN EN EL CANVAS
		entorno.drawImage(
			// Nombre de la imagen
			this.imagen,
			// Coordenada x sobre la imagen (se mueve si tiene frames)
			this.frames.val * this.width,
			// Coordenada y sobre la imagen
			0,
			// Ancho de la imagen teniendo en cuenta sus frames  (Mapa->1 / Entrenador->4)
			this.imagen.width / this.frames.max,
			// Alto de la imagen (no hace falta tener en cuenta sus frames)
			this.imagen.height,
			// Cordenada de inicio x
			this.posicion.x,
			// Coordenada de inicio y
			this.posicion.y,
			// Redimensionar el ancho teniendo en cuenta sus frames
			this.imagen.width / this.frames.max,
			// Redimensionar el alto (no hace falta tener en cuenta sus frames)
			this.imagen.height
		);

		entorno.restore()

		// GENERAR ANIMACION
		// Si se mueve el personaje
		if (this.animado) {
			// Si la imagen tiene frames
			if (this.frames.max > 1) {
				this.frames.secuencia++
			}
			// Si el resto es exacto se muestra el frame
			if (this.frames.secuencia % this.frames.velocidad === 0) {
				// Recorriendo la imagen de izquierda a derecha
				if (this.frames.val < this.frames.max - 1) {
					this.frames.val++
				// Volver al principio de la imagen
				} else {
					this.frames.val = 0
				}
			}
		}
	}
}

// Objeto Criatura hijo de Sprite
class Criatura extends Sprite {
	constructor({
		posicion,
		imagen,
		frames = { max: 1, velocidad: 10 },
		direccion,
		animado = false,
		rotacion = 0,
		esEnemigo = false,
		nombre,
		ataques
	}){
		// Hereda atributos
		super({
			posicion,
			imagen,
			frames,
			direccion,
			animado,
			rotacion 
		})
		this.vida = 100
		this.esEnemigo = esEnemigo
		this.nombre = nombre
		this.ataques = ataques
	}

	// Cuando muere una criatura
	debilitado(){
		// Dialogo
		document.querySelector('#dialogoCaja').innerHTML=this.nombre + ' ha sido debilitado '
		// Movimiento hacia abajo
		gsap.to(this.posicion,{
			y:this.posicion.y + 20
		})
		// Desaparece
		gsap.to(this,{
			opacidad:0,
			onComplete: (()=>{
				document.querySelector('#dialogoCaja').innerHTML=' '	
			}) 
		})
		audio.Combate.stop()
		audio.Victoria.play()
	}

	ataque({ataque, receptor, spritesRenderizados}) {
		// Dialogo de ataque
		document.querySelector('#dialogoCaja').style.display= 'block'
		document.querySelector('#dialogoCaja').innerHTML=this.nombre + ' uso ' + ataque.nombre

		// Vincular barra de vida enemiga
		let barraVida = '#barraVidaEnemiga'
		// Vincular barra de vida aliada si ataca el enemigo
		if(this.esEnemigo) barraVida = '#barraVidaAliada'

		// Definir rotacion para cuando ataque el enemigo
		let rotacion = 1
		if(this.esEnemigo) rotacion = -2.5

		// Disminuir la vida del quien recibe el ataque
		receptor.vida = receptor.vida - ataque.dmg

		// Segun el ataque
		switch(ataque.nombre){
			// ASCUAS
			case 'Ascuas':
				audio.InicioAscuas.play()
				// Cargar imagen del ascuas
				const ascuasImagen = new Image()
				ascuasImagen.src = './imagenes/ascuas.png'
				// Dibujar el sprite
				const ascuas = new Sprite({
					posicion: {
						x: this.posicion.x,
						y: this.posicion.y
					},
					imagen: ascuasImagen,
					frames:{
						max:4,
						velocidad: 20
					},
					animado: true,
					rotacion
				})
				// Para que salga el sprite del fuego detrás del aliado y encima del enemigo  
				spritesRenderizados.splice(1, 0, ascuas)
				// Mover el sprite hacia el receptor
				gsap.to(ascuas.posicion,{
					x:receptor.posicion.x,
					y:receptor.posicion.y,
					onComplete:() => {
						// Cuando el enemigo recibe el golpe
						audio.AscuasGolpe.play()
						// Baja la vida del receptor del golpe
						gsap.to(barraVida ,{
							width: receptor.vida  + '%'
						})
						// Efecto de golpeado al receptor: movimiento
						gsap.to(receptor.posicion, {
							x: receptor.posicion.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})
						// Efecto de golpeado al receptor: opacidad
						gsap.to(receptor,{
							opacidad:0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						}),
						// Desaparecer ascuas
						spritesRenderizados.splice(1, 1)
					}
				})
			break;

			// PLACAJE
			case 'Placaje':
				// Linea del tiempo (funciona similar que gsap)
				const tl = gsap.timeline()
				// Definir cuanto moverse para la izquierda
				let distanciaMovimiento = 100
				// Definir cuanto moverse para la derecha
				if(this.esEnemigo) distanciaMovimiento = -20
				// Moverse un paso para atras
				tl.to(this.posicion,{
					x: this.posicion.x - distanciaMovimiento 
				// Moverse hacia adelante
				}).to(this.posicion,{
					x: this.posicion.x + distanciaMovimiento * 2,
					duration: 0.1,
					onComplete:()=>{
						// Cuando el enemigo recibe el golpe
						audio.PlacajeGolpe.play()
						// Baja la vida del receptor del golpe
						gsap.to(barraVida ,{
							width: receptor.vida  + '%'
						})
						// Efecto de golpeado al receptor: movimiento
						gsap.to(receptor.posicion, {
							x: receptor.posicion.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})
						// Efecto de golpeado al receptor: opacidad
						gsap.to(receptor,{
							opacidad:0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						})
					}
				// Volver a la posicion inicial
				}).to(this.posicion,{
					x: this.posicion.x
				})
			break;

			case 'Hielo':
				audio.InicioAscuas.play()
				const hieloImagen = new Image()
				hieloImagen.src = './imagenes/BolaHielo.png'
				const hielo = new Sprite({
					posicion: {
						x: this.posicion.x,
						y: this.posicion.y
					},
					imagen: hieloImagen,
					frames:{
						max:4,
						velocidad: 20
					},
					animado: true,
					rotacion
				})
				spritesRenderizados.splice(1, 0, hielo)
				
				gsap.to(hielo.posicion,{
					x:receptor.posicion.x,
					y:receptor.posicion.y,
					onComplete:() => {
						// Cuando el enemigo recibe el golpe
						audio.AscuasGolpe.play()
						gsap.to(barraVida ,{
							width: receptor.vida  + '%'
						})
							
		
						gsap.to(receptor.posicion, {
							x: receptor.posicion.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})
		
						gsap.to(receptor,{
							opacidad:0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						}),
						spritesRenderizados.splice(1, 1)
					}
				})
			break;

			case 'Sombra':
				audio.InicioAscuas.play()
				const sombraImagen = new Image()
				sombraImagen.src = './imagenes/BolaSombra.png'
				const sombra = new Sprite({
					posicion: {
						x: this.posicion.x,
						y: this.posicion.y
					},
					imagen: sombraImagen,
					frames:{
						max:4,
						velocidad: 20
					},
					animado: true,
					rotacion
				})
				spritesRenderizados.splice(1, 0, sombra)
				
				gsap.to(sombra.posicion,{
					x:receptor.posicion.x,
					y:receptor.posicion.y,
					onComplete:() => {
						// Cuando el enemigo recibe el golpe
						audio.AscuasGolpe.play()
						gsap.to(barraVida ,{
							width: receptor.vida  + '%'
						})
							
		
						gsap.to(receptor.posicion, {
							x: receptor.posicion.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})
		
						gsap.to(receptor,{
							opacidad:0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						}),
						spritesRenderizados.splice(1, 1)
					}
				})
			break;

		
			
		}
		
	}

}

// Objeto Perimetro
class Perimetro {
	static width = 88;
	static height = 88;
	constructor({ posicion }) {
		this.posicion = posicion;
		this.width = 88;
		this.height = 88;
	}
	dibujar() {
		entorno.fillStyle = 'rgba(255,0,0,0)';
		entorno.fillRect(this.posicion.x, this.posicion.y, this.width, this.height);
	}
}