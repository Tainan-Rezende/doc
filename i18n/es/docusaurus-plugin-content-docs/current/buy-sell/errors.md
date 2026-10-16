---
sidebar_label: 'Códigos de Error'
sidebar_position: 7
description: 'Lista de códigos de error (reason) de la API de cripto y motivos de rechazo de la compra.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Códigos de Error

Todo error de la API de cripto llega en el envoltorio `{ "reason", "message", "traceId" }` (consulte <a href={useBaseUrl('/docs/buy-sell/conventions#error-format')}>Convenciones</a>). Use siempre el `reason` en su lógica; el `message` es solo informativo.

---

## Mapa de reasons por estado HTTP

| HTTP    | Reasons                                                                                                                                                                                                                                                                              |
| :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                                   |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                                       |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                                |
| **404** | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND`                                                                                                                                                                              |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                        |
| **410** | `FEATURE_DISCONTINUED` (flujos heredados de cripto, a partir del 29/10/2026)                                                                                                                                                                                                         |
| **413** | `PAYLOAD_TOO_LARGE`                                                                                                                                                                                                                                                                  |
| **422** | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                                  |
| **500** | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                              |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED`, `FEATURE_STATUS_UNAVAILABLE`                                                                                                  |

---

## Significado de los principales reasons

| Reason                           | Significado                                                                                     | Qué hacer                                                         |
| :------------------------------- | :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| `VALIDATION_FAILED`              | Campo ausente o con formato incorrecto.                                                         | Corregir el cuerpo o la query.                                    |
| `AMOUNT_MUST_BE_STRING`          | Valor monetario enviado como número.                                                            | Enviarlo como string (`"1500.00"`).                               |
| `CONFLICTING_FIELDS`             | Campos de modalidades diferentes mezclados (ej.: `quoteId` con `amount`).                       | Usar solo una de las modalidades.                                 |
| `PERMISSION_DENIED`              | El usuario de la API no tiene acceso a esta operación.                                          | Hablar con XGate.                                                 |
| `COMPANY_BLOCKED`                | Empresa bloqueada.                                                                              | Contactar con soporte.                                            |
| `ALLOWED_IPS_REQUIRED`           | La empresa no tiene lista de IPs permitidas.                                                    | Registrar IPs en el panel.                                        |
| `CLIENT_IP_NOT_ALLOWED`          | Solicitud realizada desde una IP fuera de la lista.                                             | Habilitar la IP en el panel.                                      |
| `CRYPTO_DISABLED`                | Cripto no está habilitada para la empresa.                                                      | Contactar con XGate.                                              |
| `CRYPTO_API_DISABLED`            | Cripto por la API no está habilitada para la empresa.                                           | Contactar con XGate.                                              |
| `BUY_DISABLED`                   | La compra no está habilitada para la empresa.                                                   | Contactar con XGate.                                              |
| `PURCHASE_NOT_FOUND`             | ID de compra inexistente, con formato inválido o de otra empresa.                               | Verificar el `id` devuelto en la creación.                        |
| `SALE_NOT_FOUND`                 | ID de venta inexistente, con formato inválido o de otra empresa.                                | Verificar el `id` recibido en el webhook.                         |
| `QUOTE_NOT_FOUND`                | `quoteId` inexistente.                                                                          | Generar una nueva cotización.                                     |
| `QUOTE_EXPIRED`                  | La cotización superó `expiresAt`.                                                               | Generar una nueva cotización.                                     |
| `QUOTE_ALREADY_USED`             | La cotización ya se usó en otra compra.                                                         | Generar una nueva cotización.                                     |
| `EXTERNAL_ID_CONFLICT`           | `externalId` ya usado con otro cuerpo.                                                          | Usar otro `externalId`.                                           |
| `SAVED_ADDRESS_NOT_FOUND`        | `addressId` inexistente.                                                                        | Verificar `buy.addresses[]`.                                      |
| `SAVED_ADDRESS_NETWORK_MISMATCH` | La dirección guardada es de otra red.                                                           | Usar una dirección de la red de la compra.                        |
| `ADDRESS_INVALID_FOR_NETWORK`    | Dirección inválida para la red.                                                                 | Verificar la dirección.                                           |
| `ADDRESS_NOT_SAVED`              | Bloqueo "solo direcciones guardadas" activado y la dirección no está guardada.                  | Guardar la dirección en el panel o usar `addressId`.              |
| `ADDRESS_ON_HOLD`                | Dirección guardada aún en período de carencia.                                                  | Esperar hasta `activeAt`.                                         |
| `ASSET_NOT_SUPPORTED`            | Activo no compatible o no habilitado.                                                           | Verificar `GET /crypto/options`.                                  |
| `NETWORK_NOT_SUPPORTED`          | Red no compatible con el activo.                                                                | Verificar `GET /crypto/options`.                                  |
| `AMOUNT_BELOW_MIN`               | Valor inferior a `buy.minAmount`.                                                               | Aumentar el valor.                                                |
| `AMOUNT_ABOVE_MAX`               | Valor superior a `buy.maxAmountPerTx`.                                                          | Dividir en compras más pequeñas.                                  |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | El valor no cubre la tarifa ni el gas de la red.                                                | Aumentar el valor o elegir otra red.                              |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                                                                         | Depositar BRL antes de comprar.                                   |
| `PAIR_MARGIN_NOT_CONFIGURED`     | El par no está configurado para la empresa.                                                     | Contactar con XGate.                                              |
| `PRICE_UNSTABLE`                 | Precio inestable en este momento. No se debitó nada.                                            | Intentar de nuevo en unos instantes.                              |
| `PRICE_STALE`                    | Precio de referencia no disponible.                                                             | Intentar de nuevo en unos instantes.                              |
| `NETWORK_FEE_UNAVAILABLE`        | No fue posible estimar el gas de la red.                                                        | Intentar de nuevo o usar otra red.                                |
| `RATE_LIMITED`                   | Demasiadas llamadas por minuto.                                                                 | Esperar el `Retry-After`.                                         |
| `DAILY_CAP_EXCEEDED`             | Tope diario de compra alcanzado.                                                                | Esperar al día siguiente o consultar `buy.dailyRemaining`.        |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Tope por hora de salida de la tesorería alcanzado.                                              | Intentar de nuevo más tarde.                                      |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Cripto temporalmente no disponible.                                                             | Intentar de nuevo más tarde.                                      |
| `FEATURE_DISCONTINUED`           | Ruta de un flujo heredado de cripto, descontinuado el 29/10/2026.                               | Migrar a la compra de cripto.                                     |
| `FEATURE_STATUS_UNAVAILABLE`     | No fue posible verificar el estado de la descontinuación.                                       | Intentar de nuevo.                                                |

---

## Motivos de rechazo de la compra {#rejection-reasons}

Cuando una compra termina en `REJECTED`, el campo `rejection.reason` trae uno de los motivos siguientes. En todos ellos, `rejection.refunded = true` significa que el BRL volvió íntegramente al saldo, tarifa incluida.

| `rejection.reason`               | Significado                                                       |
| :------------------------------- | :---------------------------------------------------------------- |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                                           |
| `QUOTE_NOT_FOUND`                | Cotización inexistente.                                           |
| `QUOTE_EXPIRED`                  | Cotización vencida.                                               |
| `QUOTE_ALREADY_USED`             | Cotización ya utilizada.                                          |
| `PRICE_STALE`                    | Precio de referencia no disponible.                               |
| `PRICE_UNSTABLE`                 | Precio inestable; no se debitó nada.                              |
| `NETWORK_FEE_UNAVAILABLE`        | Gas de la red no disponible.                                      |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | El valor no cubre la tarifa ni el gas.                            |
| `DAILY_CAP_EXCEEDED`             | Tope diario alcanzado.                                            |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Tope por hora de salida de la tesorería alcanzado.                |
| `LIQUIDITY_UNAVAILABLE`          | Liquidez no disponible.                                           |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | Cripto temporalmente no disponible.                               |
| `APPROVAL_REJECTED`              | Rechazada en la cola de aprobación de XGate.                      |
| `PROVIDER_REJECTED`              | Rechazada por el custodio.                                        |
| `SEND_FAILED`                    | Error en el envío; no salió nada.                                 |
