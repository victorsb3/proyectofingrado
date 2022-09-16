const criaturas = {
    Aliado: {
        posicion: {
            x: 250,
            y: 250
        },
        imagen: {
            src: './imagenes/aliadoSprite.png'
        },
        frames: {
            max: 4,
            velocidad: 50
        },
        animado: true,
        nombre: 'Mew',
        ataques: [ataques.Placaje, ataques.Ascuas, ataques.Hielo, ataques.Sombra]
    },
    Enemigo: {
        posicion: {
            x: 800,
            y: 100
        },
        imagen: {
            src: './imagenes/enemigoSprite.png'
        },
        frames: {
            max: 4,
            velocidad: 50
        },
        animado: true,
        esEnemigo: true,
        nombre: 'Gastly',
        ataques: [ataques.Placaje, ataques.Sombra]
    }
}

