document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    setTimeout(() => {
        container.classList.add('show');
        startRainbowBackground(); // Comienza el efecto de arcoíris después de 5 segundos
        startColorChange(); // Comienza el cambio de color de fondo después de 5 segundos
    }, 1000);
});

const surpriseButton = document.querySelector('button');
surpriseButton.addEventListener('click', changeGreeting);

function changeGreeting() {
    const greeting = document.getElementById('greeting');
    const message = document.getElementById('message');
    const surprise = document.getElementById('surprise');

    greeting.innerText = '¡Feliz cumpleaños!';
    message.innerText = '¡Espero que esta sorpresa te haya alegrado el día! Te deseo lo mejor en tu cumpleaños.';
    surprise.style.display = 'block';
    surprise.style.opacity = '1'; // Mostrar la imagen sorpresa

    // Cambiar el botón a "Generar Gatitos"
    surpriseButton.removeEventListener('click', changeGreeting);
    surpriseButton.textContent = 'Generar Gatitos';
    surpriseButton.addEventListener('click', generateCats);

    const surpriseSound = document.getElementById('surpriseSound');
    surpriseSound.play();
}


function generateCats() {

    surpriseButton.classList.add('animate');
    const catTypes = [
        'https://media.giphy.com/media/leuNkvf9pE6loEnjnb/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjFvOTk5cmU2MmsyZmJiOXZoNGUzNnpmZG80OWY5bHZ1bXg2dzVtYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/TjaTrZlziu73ZZzgXj/giphy.gif',
        'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNm82eXYzeDU4aGkxYzNscDlqYmIzeTRndHp3NmptOTg4ZTczZndhayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/x3NWj6iWT6s5xX3gBr/giphy.gif',
        'https://media.tenor.com/nYHPDhmjczsAAAAi/toothlessdance-toothless.gif',
        'https://media.tenor.com/6Vox3eQwVesAAAAi/cat-dancing.gif',
        'https://media.tenor.com/CC1VPnwBVMMAAAAi/gianbortion-cat.gif',
        'https://media.tenor.com/ULt1QoO_tc0AAAAj/cat-vibe-vibe-cat.gif'
    ];
    const catGifs = [];
    const catSpeeds = [];
    const catWidth = 220; // Ancho aproximado de un gatito (ajústalo según el tamaño real del GIF)
    const catHeight = 220; // Alto aproximado de un gatito (ajústalo según el tamaño real del GIF)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const catTypeIndexes = new Set(); // Para almacenar los índices de los tipos de gatos generados

    // Generar solo un gato de cada tipo
    catTypes.forEach((catType, index) => {
        const catGif = document.createElement('img');
        catGif.src = catType;
        catGif.classList.add('cat-gif');
        catGif.style.opacity = '0'; // Inicialmente establece la opacidad en 0
        catGif.style.width = '200px'; // Ajusta el ancho del GIF
        catGif.style.height = '200px'; // Ajusta la altura del GIF
        document.body.appendChild(catGif);
        catGifs.push(catGif);

        // Posiciones aleatorias dentro de la ventana
        let randomX = Math.random() * (windowWidth - catWidth);
        let randomY = Math.random() * (windowHeight - catHeight);

        // Asegúrate de que no se superpongan
        for (let j = 0; j < catGifs.length - 1; j++) {
            const otherCat = catGifs[j];
            const otherX = parseFloat(otherCat.style.left);
            const otherY = parseFloat(otherCat.style.top);
            const minDistance = 150; // Distancia mínima entre gatitos (ajústala según tus preferencias)
            const distance = Math.sqrt((randomX - otherX) ** 2 + (randomY - otherY) ** 2);
            if (distance < minDistance) {
                randomX = Math.random() * (windowWidth - catWidth);
                randomY = Math.random() * (windowHeight - catHeight);
                j = -1; // Revisar desde el principio
            }
        }

        catGif.style.left = `${randomX}px`;
        catGif.style.top = `${randomY}px`;

        // Velocidades aleatorias
        const speedX = (Math.random() * 8) - 4; // Velocidad horizontal entre -4 y 4
        const speedY = (Math.random() * 8) - 4; // Velocidad vertical entre -4 y 4
        catSpeeds.push({ x: speedX, y: speedY });

        catTypeIndexes.add(index); // Agregar el índice del tipo de gato generado
    });

    // Mostrar los GIFs de gatitos después de un retraso
    setTimeout(() => {
        catGifs.forEach(catGif => {
            catGif.style.opacity = '1'; // Mostrar los GIFs de gatitos
        });

        // Mover los GIFs de gatitos después de 10 segundos
        setTimeout(() => {
            const moveInterval = setInterval(() => {
                catGifs.forEach((catGif, index) => {
                    const catSpeed = catSpeeds[index];
                    let newLeft = parseFloat(catGif.style.left) + catSpeed.x;
                    let newTop = parseFloat(catGif.style.top) + catSpeed.y;

                    // Rebote en los bordes de la pantalla
                    if (newLeft < 0 || newLeft + catWidth > windowWidth) {
                        catSpeed.x = -catSpeed.x; // Invertir la velocidad horizontal
                    }
                    if (newTop < 0 || newTop + catHeight > windowHeight) {
                        catSpeed.y = -catSpeed.y; // Invertir la velocidad vertical
                    }

                    // Detección de colisiones entre gatitos
                    catGifs.forEach((otherCat, otherIndex) => {
                        if (index !== otherIndex && catTypeIndexes.has(index) && catTypeIndexes.has(otherIndex)) {
                            const rect1 = catGif.getBoundingClientRect();
                            const rect2 = otherCat.getBoundingClientRect();

                            if (
                                rect1.x < rect2.x + rect2.width &&
                                rect1.x + rect1.width > rect2.x &&
                                rect1.y < rect2.y + rect2.height &&
                                rect1.y + rect1.height > rect2.y
                            ) {
                                // Si hay colisión, invertir las velocidades de ambos gatitos
                                const tempX = catSpeed.x;
                                const tempY = catSpeed.y;
                                catSpeeds[index].x = catSpeeds[otherIndex].x;
                                catSpeeds[index].y = catSpeeds[otherIndex].y;
                                catSpeeds[otherIndex].x = tempX;
                                catSpeeds[otherIndex].y = tempY;
                            }
                        }
                    });

                    catGif.style.left = `${newLeft}px`;
                    catGif.style.top = `${newTop}px`;
                });
            }, 5); // Aprox. 125 frames por segundo (para un movimiento más rápido)
        }, 9000); // Comienza el movimiento después de 10 segundos
    }, 0); // Mostrar los GIFs inmediatamente
}
