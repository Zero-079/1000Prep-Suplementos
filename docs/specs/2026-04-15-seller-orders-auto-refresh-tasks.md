# Tasks: Seller Orders Auto-Refresh

## Phase 1: Implementación del polling

- [x] 1.1 Modificar `src/features/orders/hooks/useSellerOrders.ts` — agregar useEffect con setInterval(30000) que llama a fetchOrders
- [x] 1.2 Verificar que el interval se limpia correctamente en el cleanup del useEffect
- [x] 1.3 Probar manualmente que el polling funciona: abrir /ordenes como seller, hacer un pedido desde otra cuenta, verificar que aparece en 30s sin recargar

## Phase 2: Testing manual

- [x] 2.1 Verificar que el componente se монтирует correctamente con el nuevo effect
- [x] 2.2 Verificar que no hay errores en consola durante el polling
- [x] 2.3 Verificar que al navegar a otra página el interval se limpia (no hay memory leaks)