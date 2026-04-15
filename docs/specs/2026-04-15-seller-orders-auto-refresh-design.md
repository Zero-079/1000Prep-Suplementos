# Diseño: Actualización automática de órdenes para Seller

## 1. Problema

Cuando un buyer completa un pedido desde `SupplementCheckoutModal`, el pedido se crea correctamente en el backend. Sin embargo, el seller que tiene abierta la página `/ordenes` no ve el nuevo pedido hasta que recarga manualmente la página.

**Impacto en UX:** El seller debe recordar recargar para ver pedidos nuevos, lo cual es forgettable y genera fricción.

## 2. Solución propuesta

Agregar **polling constante** al hook `useSellerOrders` que re-fetchea las órdenes cada 30 segundos mientras la página esté visible.

## 3. Arquitectura

### 3.1 Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/features/orders/hooks/useSellerOrders.ts` | Agregar polling de 30s con useEffect |

### 3.2 Cambios en el hook

```tsx
// Agregar estado para polling
const [isPollingActive, setIsPollingActive] = useState(true)

// Effect para polling constante - cada 30 segundos
useEffect(() => {
  if (!isPollingActive) return
  
  const intervalId = setInterval(() => {
    fetchOrders()
  }, 30000)

  return () => clearInterval(intervalId)
}, [fetchOrders, isPollingActive])
```

El hook ya tiene la función `fetchOrders` expuesta como `refetch`, así que reutilizamos esa lógica.

## 4. Comportamiento esperado

| Escenario | Resultado |
|-----------|-----------|
| Seller abre `/ordenes` | Fetch inicial al montar + polling cada 30s |
| Llegan nuevos pedidos (de otro buyer) | Se agregan automáticamente a la lista |
| Error en fetch | Silencioso, retry en próximo interval |
| User cierra la página | Se limpia el interval automáticamente |

## 5. UI/UX

No se implementa indicador visual de actualización por ahora (YAGNI). El usuario ve los pedidos aparecer sin acciones.

## 6. Trade-offs

### Pros
- **UX inmediata:** Lista se actualiza sin acciones del usuario
- **Simples:** Solo un useEffect, sin cambios en backend
- **Resiliente:** Si falla un request, el siguiente lo cubre

### Contras
- **Requests constantes:** Un fetch cada 30s por cada seller activo
- **Sin prioridades:** No diferencia pedidos urgentes de normales

## 7. Alternativas consideradas

| Alternativa | Descripción | Descartado por |
|-------------|-------------|----------------|
| Polling inteligente (solo cuando visible) | Usar `document.visibilityState` para pausar polling en tabs ocultas | Más complejo, overkill por ahora |
| WebSockets/SSE | Notificaciones instantáneas desde backend | Requiere cambios en backend, mayor scope |
| Botón "Actualizar" manual | Botón para re-fetch manual | No solve el problema original |

## 8. Testing

- Verificar que el interval se crea al montar
- Verificar que el interval se limpia al desmontar
- Verificar que el fetch se ejecuta cada 30s
- Verificar que errores no rompen el polling

## 9. Métricas de éxito

- [ ] Seller ve nuevos pedidos sin recargar página
- [ ] No hay errores en console durante polling
- [ ] El interval se limpia correctamente al navegar a otra página