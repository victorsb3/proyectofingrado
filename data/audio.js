const audio = {
    Mapa: new Howl({
        src: './audio/mapa.mp3',
        html5: true,
        volume: 0.1,
        loop: true
    }),
    InicioCombate: new Howl({
        src: './audio/inicioCombate.wav',
        html5: true,
        volume: 0.1
    }),
    Combate: new Howl({
        src: './audio/combate.mp3',
        html5: true,
        volume: 0.3,
        loop: true
    }),
    PlacajeGolpe: new Howl({
        src: './audio/placajeGolpe.wav',
        html5: true,
        volume: 0.2
    }),
    InicioAscuas: new Howl({
        src: './audio/inicioAscuas.wav',
        html5: true,
        volume: 0.2
    }),
    AscuasGolpe: new Howl({
        src: './audio/ascuasGolpe.wav',
        html5: true,
        volume: 0.2
    }),
    Victoria: new Howl({
        src: './audio/victoria.wav',
        html5: true
    })
}