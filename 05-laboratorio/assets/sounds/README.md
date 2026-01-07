# Sistema de Audio del Casino - Blackjack

Este proyecto utiliza **Web Audio API** para generar sonidos sintéticos de casino en tiempo real. No requiere archivos de audio externos.

## Sonidos Implementados

### 1. **playCardDeal()** - Carta siendo repartida
- **Uso**: Cuando el jugador o la computadora recibe una carta
- **Efecto**: Sonido rápido de "swish" simulando una carta deslizándose
- **Frecuencia**: 200Hz → 100Hz
- **Duración**: 0.1 segundos

### 2. **playWin()** - Victoria
- **Uso**: Cuando el jugador gana la partida
- **Efecto**: Melodía ascendente de celebración (Do, Mi, Sol, Do alto)
- **Notas**: 4 notas musicales en escala mayor
- **Duración**: ~0.6 segundos

### 3. **playBlackjack()** - Blackjack (21 puntos)
- **Uso**: Cuando el jugador consigue exactamente 21 puntos
- **Efecto**: Melodía triunfal elaborada + efecto de monedas cayendo
- **Notas**: 6 notas en secuencia especial
- **Extra**: 10 sonidos de monedas cayendo
- **Duración**: ~1.5 segundos

### 4. **playLose()** - Derrota
- **Uso**: Cuando el jugador pierde la partida
- **Efecto**: Melodía descendente triste (Sol, Mi, Do, Sol bajo)
- **Tipo**: Onda sawtooth para sonido más "áspero"
- **Duración**: ~0.8 segundos

### 5. **playBust()** - Te pasaste de 21
- **Uso**: Cuando el jugador se pasa de 21 puntos
- **Efecto**: Sonido descendente dramático
- **Frecuencia**: 600Hz → 100Hz
- **Duración**: 0.5 segundos

### 6. **playTie()** - Empate
- **Uso**: Cuando hay empate entre jugador y crupier
- **Efecto**: Dos tonos iguales consecutivos
- **Frecuencia**: 440Hz (Nota La)
- **Duración**: ~0.3 segundos

### 7. **playCoinDrop()** - Moneda cayendo
- **Uso**: Efecto secundario durante victorias especiales
- **Efecto**: Sonido metálico de moneda
- **Frecuencia**: Aleatoria 800-1000Hz → 400Hz
- **Duración**: 0.05 segundos

### 8. **playButtonClick()** - Click de botón
- **Uso**: Cuando se presiona "Plantarse"
- **Efecto**: Click corto y agudo
- **Frecuencia**: 800Hz
- **Duración**: 0.05 segundos

### 9. **playShuffle()** - Barajar cartas
- **Uso**: Cuando se inicia un nuevo juego
- **Efecto**: Secuencia rápida de 15 sonidos simulando cartas mezclándose
- **Frecuencia**: Aleatoria 100-300Hz
- **Duración**: ~0.45 segundos

## Integración en el Juego

### Eventos con sonido:
- ✅ **Pedir Carta** → `playCardDeal()`
- ✅ **Plantarse** → `playButtonClick()`
- ✅ **Nuevo Juego** → `playShuffle()`
- ✅ **Victoria** → `playWin()`
- ✅ **Blackjack** → `playBlackjack()`
- ✅ **Derrota** → `playLose()`
- ✅ **Te pasaste** → `playBust()`
- ✅ **Empate** → `playTie()`
- ✅ **Cartas del crupier** → `playCardDeal()` con delay de 400ms

## Cómo Agregar Nuevos Sonidos

Para agregar un nuevo sonido al sistema, añade un nuevo método al objeto `audioManager`:

```javascript
audioManager.playNuevoSonido = function() {
    const ctx = this.init();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Configurar frecuencia y tipo de onda
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    oscillator.type = 'sine'; // sine, square, sawtooth, triangle

    // Configurar volumen
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    // Iniciar y detener
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
};
```

## Tipos de Ondas Disponibles

- **sine**: Suave, puro, ideal para tonos musicales
- **square**: Áspero, retro, ideal para efectos 8-bit
- **sawtooth**: Brillante, áspero, ideal para sonidos dramáticos
- **triangle**: Suave pero con armónicos, intermedio

## Ventajas de Web Audio API

✅ **Sin archivos externos**: No requiere descargar archivos MP3/WAV
✅ **Carga instantánea**: Los sonidos se generan en tiempo real
✅ **Ligero**: No aumenta el tamaño del proyecto
✅ **Personalizable**: Fácil modificar frecuencias y duraciones
✅ **Compatible**: Funciona en todos los navegadores modernos

## Compatibilidad

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Navegadores móviles (iOS/Android)

## Alternativa: Usar Archivos de Audio Reales

Si prefieres usar archivos de audio reales (.mp3/.wav), puedes descargarlos de:

### Sitios de Sonidos Gratuitos:
1. **Freesound.org** - https://freesound.org
   - Busca: "card deal", "casino win", "poker chips"

2. **Mixkit.co** - https://mixkit.co/free-sound-effects/casino/
   - Sonidos de casino profesionales gratuitos

3. **Zapsplat.com** - https://www.zapsplat.com
   - Busca: "playing cards", "casino", "slot machine"

### Cómo usar archivos de audio:

```javascript
// Crear objeto Audio
const cardSound = new Audio('./assets/sounds/card-deal.mp3');

// Reproducir
cardSound.play();

// Con manejo de errores
cardSound.play().catch(err => console.log('Audio bloqueado:', err));
```

## Notas Técnicas

- El contexto de audio se inicializa en el primer uso
- Los sonidos se limpian automáticamente al terminar
- El volumen está ajustado para no ser molesto (0.1 - 0.4)
- Los navegadores pueden bloquear audio sin interacción del usuario
