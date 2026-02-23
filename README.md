# 📸 Before-After Capture

Aplicación móvil para capturar fotos "Antes/Después" con validación GPS precisa.

---

## 🚀 Instalación Rápida

### 1. Requisitos
- Node.js 20 o superior
- Android Studio (para Android)
- Un dispositivo Android o iPhone

### 2. Instalar
```bash
# Clonar proyecto
git clone https://github.com/tu-usuario/before-after-capture.git
cd BeforeAfterGuidedCapture

# Instalar dependencias
npm install

# Solo iOS (macOS)
cd ios && pod install && cd ..
```

### 3. Ejecutar en tu móvil

#### Android
```bash
# Conecta tu móvil por USB y activa "Depuración USB"
# (Ajustes → Acerca del teléfono → toca 7 veces "Número de compilación")
# (Ajustes → Opciones de desarrollador → Depuración USB)

npm run android
```

#### iOS
```bash
npm run ios
```

---

## 📱 Cómo Usar la App

1. **Abre la app** → Verás la pantalla de inicio vacía
2. **Toca "+ NUEVA CAPTURA"** → Se abre la cámara
3. **Espera a que el GPS esté listo** → El botón se pondrá verde
4. **Toma la foto ANTES** → Se guarda automáticamente
5. **Vuelve a la pantalla principal** → Verás tu registro

---

## 🛠️ Comandos Útiles
```bash
# Iniciar la app
npm run android    # Para Android
npm run ios        # Para iOS

# Limpiar caché si hay problemas
npm start -- --reset-cache

# Limpiar build de Android
cd android && ./gradlew clean && cd ..
```

---

## ❓ Solución de Problemas

### La app se cierra al abrirla
```bash
# Verifica que Hermes esté activado en android/gradle.properties
hermesEnabled=true

# Limpia y reconstruye
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
npm run android
```

### El GPS tarda mucho

- Sal al exterior o acércate a una ventana
- Activa "Ubicación de alta precisión" en tu móvil
- Espera 10-30 segundos la primera vez

### Error "No se puede conectar al dispositivo"
```bash
# Verifica que tu móvil esté conectado
adb devices

# Si no aparece, revisa:
# - Cable USB conectado
# - Depuración USB activada
# - Permisos aceptados en el móvil
```

---

## 📂 Estructura del Proyecto
```
src/
├── components/     # Componentes visuales
├── constants/      # Configuración y umbrales
├── models/         # Tipos de datos
├── screens/        # Pantallas de la app
├── services/       # Persistencia de datos
└── utils/          # Utilidades (GPS, cálculos)
```

---

## ⚙️ Configuración

Puedes ajustar los umbrales GPS en `src/constants/AppConstants.ts`:
```typescript
GPS_ACCURACY_THRESHOLD: 15,  // Precisión mínima GPS (metros)
MAX_DISTANCE_METERS: 5,      // Distancia máxima entre fotos
MAX_HEADING_DIFF: 15,        // Diferencia de ángulo permitida
```

---

## 📦 Tecnologías Usadas

- React Native 0.83
- TypeScript
- Vision Camera (captura de fotos)
- Geolocation (GPS)
- AsyncStorage (almacenamiento local)

---

## 📄 Licencia

Proyecto privado. Todos los derechos reservados.

---

## 📞 Contacto

¿Problemas o preguntas? Abre un [issue en GitHub](https://github.com/tu-usuario/before-after-capture/issues)

---

**Versión:** 1.0.0  
**Última actualización:** Febrero 2026
