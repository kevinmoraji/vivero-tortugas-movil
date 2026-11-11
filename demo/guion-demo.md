# Guion de la demostración en vivo

## Antes 

- [ ] Django encendido: `python manage.py runserver 0.0.0.0:8000`
- [ ] App encendida: `npm start`
- [ ] Celular en la misma red Wi-Fi que la computadora, con la dirección Network abierta
- [ ] `USAR_DATOS_DE_PRUEBA` en `false` si se va a usar Django; en `true` si falla la red
- [ ] Video de respaldo listo por si falla algo

## Recorrido

| Paso | Qué hacer | Qué se demuestra |
| --- | --- | --- |
| 1 | Abrir la app e iniciar sesión como coordinador | Login, Store, navegación |
| 2 | Abrir Voluntarios y buscar un apellido | Listado dinámico desde la API y búsqueda |
| 3 | Tocar un voluntario | Ruta dinámica `/voluntarios/:id/` |
| 4 | Registrar un voluntario con cédula de 5 dígitos | Validación en el celular |
| 5 | Corregir la cédula, guardar y verlo en la lista | `f7.toast`, regreso y recarga de la lista |
| 6 | Cerrar sesión, entrar como consulta e intentar registrar | Error 403 por rol |
| 7 | Abrir F12, pestaña Red, y mostrar la solicitud | `fetch`, encabezado `Authorization: Token` |

