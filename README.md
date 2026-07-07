# LCD Pocket Creature

Prototipo web/PWA exportable a Android con Capacitor en el futuro. No usa assets ni nombres con copyright: todas las criaturas son placeholders dibujadas desde matrices 0/1 en canvas.

## Ejecutar

```bash
npm install
npm run dev
```

Tambien puede abrirse `index.html` mediante un servidor estatico compatible con modulos ES. Para tests:

```bash
npm test
```

## Arquitectura

- `src/core`: simulacion pura, ticks, evolucion y combate.
- `src/data`: especies, matriz battleSlot A-L, items, areas y reglas configurables.
- `src/ui`: render HTML/canvas.
- `src/storage`: guardado local versionado, export/import JSON.
- `src/styles`: estetica LCD monocroma.

## Funciones implementadas

- Pantalla principal con criatura animada por frames placeholder.
- Reloj determinista con tick configurable (`tickMs`) y panel debug.
- Estado completo de criatura y acciones basicas.
- Evolucion por temporizador/requisitos definidos como datos.
- Muerte, memorial persistente y nueva generacion.
- Combate clasico con matriz 12x12 sobre 16 y modificador por boost.
- File Island minima con 3 areas, encuentros, boss y retirada.
- File City minima con tienda, clinica y almacen desbloqueables.
- PWA manifest y estructura apta para empaquetar con Capacitor.

## Proximos pasos

1. Extraer datos a JSON cargable en runtime si se desea edición sin recompilar.
2. Añadir service worker e iconos PWA definitivos.
3. Integrar Capacitor (`npx cap add android`) cuando se quiera generar APK.
4. Sustituir placeholders por sprites originales propios.
5. Ampliar tests con snapshots de guardado y rutas de expedicion.
