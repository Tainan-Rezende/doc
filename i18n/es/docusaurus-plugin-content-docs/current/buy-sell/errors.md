---
sidebar_label: 'Códigos de error'
sidebar_position: 7
description: 'Lista de códigos de error (reason) de la API de cripto y motivos de rechazo de compras.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Códigos de error

Todos los errores de la API de cripto se devuelven en el sobre `{ "reason", "message", "traceId" }` (consulte <a href={useBaseUrl('/docs/buy-sell/conventions#error-format')}>Convenciones</a>). Utilice siempre `reason` en la lógica de su aplicación; `message` tiene únicamente fines informativos.

---

## Reasons por estado HTTP

| HTTP    | Reasons                                                                                                                                                                                                                                                                                                                          |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **400** | `VALIDATION_FAILED`, `AMOUNT_MUST_BE_STRING`, `CONFLICTING_FIELDS`                                                                                                                                                                                                                                                               |
| **401** | `UNAUTHORIZED`                                                                                                                                                                                                                                                                                                                   |
| **403** | `PERMISSION_DENIED`, `COMPANY_MISMATCH`, `COMPANY_BLOCKED`, `ALLOWED_IPS_REQUIRED`, `CLIENT_IP_NOT_ALLOWED`, `CRYPTO_DISABLED`, `CRYPTO_API_DISABLED`, `BUY_DISABLED`                                                                                                                                                            |
| **404** | `PURCHASE_NOT_FOUND`, `SALE_NOT_FOUND`, `QUOTE_NOT_FOUND`, `SAVED_ADDRESS_NOT_FOUND`, `ROUTE_NOT_FOUND`                                                                                                                                                                                                                          |
| **409** | `EXTERNAL_ID_CONFLICT`, `QUOTE_EXPIRED`, `QUOTE_ALREADY_USED`                                                                                                                                                                                                                                                                    |
| **410** | `FEATURE_DISCONTINUED` (rutas antiguas de cripto, a partir del 29/10/2026)                                                                                                                                                                                                                                                         |
| **413** | `PAYLOAD_TOO_LARGE`                                                                                                                                                                                                                                                                                                              |
| **422** | `AMOUNT_BELOW_MIN`, `AMOUNT_ABOVE_MAX`, `AMOUNT_TOO_LOW_FOR_NETWORK_FEE`, `ASSET_NOT_SUPPORTED`, `NETWORK_NOT_SUPPORTED`, `ADDRESS_INVALID_FOR_NETWORK`, `ADDRESS_NOT_SAVED`, `ADDRESS_ON_HOLD`, `ADDRESS_NOT_ALLOWED`, `SAVED_ADDRESS_NETWORK_MISMATCH`, `INSUFFICIENT_BALANCE`, `PRICE_UNSTABLE`, `PAIR_MARGIN_NOT_CONFIGURED` |
| **429** | `RATE_LIMITED`, `DAILY_CAP_EXCEEDED`, `OUTFLOW_HOURLY_CAP_EXCEEDED`                                                                                                                                                                                                                                                              |
| **500** | `INTERNAL_SERVER_ERROR`                                                                                                                                                                                                                                                                                                          |
| **503** | `PRICE_STALE`, `NETWORK_FEE_UNAVAILABLE`, `CRYPTO_TEMPORARILY_UNAVAILABLE`, `CONFIGURATION_UNAVAILABLE`, `PURCHASE_UNAVAILABLE`, `SERVICE_OVERLOADED`, `FEATURE_STATUS_UNAVAILABLE`                                                                                                                                              |

---

## Significado de los principales reasons

| Reason                           | Significado                                                          | Qué hacer                                         |
| :------------------------------- | :------------------------------------------------------------------- | :-------------------------------------------------- |
| `VALIDATION_FAILED`              | Falta un campo o tiene un formato no válido.                                    | Corrija el cuerpo o la consulta.                        |
| `AMOUNT_MUST_BE_STRING`          | El importe monetario se envió como número.                                 | Envíelo como cadena (`"1500.00"`).                   |
| `CONFLICTING_FIELDS`             | Se combinaron campos de modalidades distintas (p. ej., `quoteId` con `amount`). | Utilice una sola modalidad.                             |
| `PERMISSION_DENIED`              | El usuario de la API no tiene acceso a esta operación.                     | Contacte con XGate.                                  |
| `COMPANY_BLOCKED`                | La empresa está bloqueada.                                                   | Contacte con soporte.                                 |
| `ALLOWED_IPS_REQUIRED`           | La empresa no tiene una lista de IP permitidas.                           | Registre las IP en el Dashboard.                            |
| `CLIENT_IP_NOT_ALLOWED`          | La solicitud se realizó desde una IP que no está en la lista.                             | Autorice la IP en el Dashboard.                             |
| `CRYPTO_DISABLED`                | La cripto no está habilitada para la empresa.                             | Contacte con XGate.                                   |
| `CRYPTO_API_DISABLED`            | El acceso a cripto mediante la API no está habilitado para la empresa.                    | Contacte con XGate.                                   |
| `BUY_DISABLED`                   | Las compras no están habilitadas para la empresa.                             | Contacte con XGate.                                   |
| `PURCHASE_NOT_FOUND`             | El ID de compra no existe, tiene un formato no válido o pertenece a otra empresa.       | Compruebe el `id` devuelto al crear la compra.               |
| `SALE_NOT_FOUND`                 | El ID de venta no existe, tiene un formato no válido o pertenece a otra empresa.        | Compruebe el `id` recibido en el webhook.                |
| `QUOTE_NOT_FOUND`                | `quoteId` no existe.                                               | Genere una nueva cotización.                                 |
| `QUOTE_EXPIRED`                  | La cotización superó el valor de `expiresAt`.                                     | Genere una nueva cotización.                                 |
| `QUOTE_ALREADY_USED`             | La cotización ya se utilizó en otra compra.                              | Genere una nueva cotización.                                 |
| `EXTERNAL_ID_CONFLICT`           | `externalId` ya se utilizó con un cuerpo diferente.                               | Utilice otro `externalId`.                            |
| `SAVED_ADDRESS_NOT_FOUND`        | `addressId` no existe.                                             | Compruebe `buy.addresses[]`.                         |
| `SAVED_ADDRESS_NETWORK_MISMATCH` | La dirección guardada pertenece a otra red.                                    | Utilice una dirección de la red de la compra.                    |
| `ADDRESS_INVALID_FOR_NETWORK`    | La dirección no es válida para la red.                                       | Compruebe la dirección.                                |
| `ADDRESS_NOT_SAVED`              | Está habilitada la restricción «solo direcciones guardadas» y la dirección no está guardada.      | Guarde la dirección en el Dashboard o utilice `addressId`.    |
| `ADDRESS_ON_HOLD`                | La dirección guardada aún está dentro del período de espera.                                    | Espere hasta `activeAt`.                            |
| `ASSET_NOT_SUPPORTED`            | El activo no es compatible o no está habilitado.                                 | Consulte `GET /crypto/options`.                     |
| `NETWORK_NOT_SUPPORTED`          | La red no es compatible con el activo.                                     | Consulte `GET /crypto/options`.                     |
| `AMOUNT_BELOW_MIN`               | El importe es inferior a `buy.minAmount`.                                     | Aumente el importe.                                   |
| `AMOUNT_ABOVE_MAX`               | El importe supera `buy.maxAmountPerTx`.                                 | Divídalo en compras más pequeñas.                         |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | El importe no cubre la tarifa y el gas de red.                            | Aumente el importe o elija otra red.            |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                                              | Deposite BRL antes de comprar.                     |
| `PAIR_MARGIN_NOT_CONFIGURED`     | El par no está configurado para la empresa.                           | Contacte con XGate.                                   |
| `PRICE_UNSTABLE`                 | El precio es inestable en este momento. No se debitó ningún importe.                        | Vuelva a intentarlo en unos instantes.                      |
| `PRICE_STALE`                    | El precio de referencia no está disponible.                                    | Vuelva a intentarlo en unos instantes.                      |
| `NETWORK_FEE_UNAVAILABLE`        | No se pudo estimar el gas de red.                              | Vuelva a intentarlo o utilice otra red.                |
| `RATE_LIMITED`                   | Se realizaron demasiadas solicitudes por minuto.                                          | Espere el tiempo indicado en `Retry-After`.                           |
| `DAILY_CAP_EXCEEDED`             | Se alcanzó el límite diario de compras.                                      | Espere hasta el día siguiente o consulte `buy.dailyRemaining`. |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Se alcanzó el límite horario de salida de la tesorería.                        | Vuelva a intentarlo más tarde.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | La cripto no está disponible temporalmente.                                 | Vuelva a intentarlo más tarde.                        |
| `FEATURE_DISCONTINUED`           | Ruta antigua de cripto, deshabilitada el 29/10/2026.                      | Utilice la API de compra y venta de cripto.                     |
| `FEATURE_STATUS_UNAVAILABLE`     | No se pudo verificar el estado de la discontinuación.               | Vuelva a intentarlo.                                   |

---

## Motivos de rechazo de compras {#rejection-reasons}

Cuando una compra finaliza en `REJECTED`, el campo `rejection.reason` contiene uno de los siguientes motivos. En todos los casos, `rejection.refunded = true` significa que el importe íntegro en BRL, incluidas las tarifas, se devolvió al saldo.

| `rejection.reason`               | Significado                                   |
| :------------------------------- | :-------------------------------------------- |
| `INSUFFICIENT_BALANCE`           | Saldo BRL insuficiente.                       |
| `QUOTE_NOT_FOUND`                | La cotización no existe.                          |
| `QUOTE_EXPIRED`                  | La cotización venció.                              |
| `QUOTE_ALREADY_USED`             | La cotización ya se utilizó.                             |
| `PRICE_STALE`                    | El precio de referencia no está disponible.             |
| `PRICE_UNSTABLE`                 | El precio es inestable; no se debitó ningún importe.            |
| `NETWORK_FEE_UNAVAILABLE`        | El gas de red no está disponible.                     |
| `AMOUNT_TOO_LOW_FOR_NETWORK_FEE` | El importe no cubre la tarifa ni el gas.               |
| `DAILY_CAP_EXCEEDED`             | Se alcanzó el límite diario.                         |
| `OUTFLOW_HOURLY_CAP_EXCEEDED`    | Se alcanzó el límite horario de salida de la tesorería. |
| `LIQUIDITY_UNAVAILABLE`          | La liquidez no está disponible.                        |
| `CRYPTO_TEMPORARILY_UNAVAILABLE` | La cripto no está disponible temporalmente.          |
| `APPROVAL_REJECTED`              | Rechazada en la cola de aprobación de XGate.       |
| `PROVIDER_REJECTED`              | Rechazada por el proveedor de custodia.                       |
| `SEND_FAILED`                    | Error en la transferencia; no se envió ningún importe.                     |
