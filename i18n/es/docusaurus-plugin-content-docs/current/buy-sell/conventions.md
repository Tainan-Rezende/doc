---
sidebar_label: 'Convenciones'
sidebar_position: 2
description: 'Reglas que aplican a todas las rutas /crypto: autenticación, IPs permitidas, formato de valores, errores, idempotencia y límites.'
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Convenciones de la API de Cripto

Las siguientes reglas aplican a **todas** las rutas `/crypto/*`.

---

## Autenticación

URL base y autenticación iguales al resto de la API:

```bash title="URL base"
https://api.xgateglobal.com
```

| Encabezado        | Valor                | Descripción                                                                                       |
| :---------------- | :------------------- | :------------------------------------------------------------------------------------------------ |
| `Authorization`   | `Bearer <tu_token>` | Token obtenido en el <a href={useBaseUrl('/docs/authentication/login')}>inicio de sesión</a>.     |
| `Accept-Language` | `pt-BR` o `en`       | *(Opcional)* Idioma de los mensajes de error. Predeterminado: `pt-BR`.                            |

La empresa es siempre la del token: no hay parámetro de empresa en las rutas.

---

## IPs permitidas

La empresa debe tener la lista de IPs permitidas registrada en el panel de XGate. La misma lista usada para retiros aplica a toda la API de cripto.

| Situación                              | Respuesta                     |
| :------------------------------------- | :---------------------------- |
| Empresa sin lista de IPs               | `403 ALLOWED_IPS_REQUIRED`    |
| Solicitud desde una IP fuera de la lista | `403 CLIENT_IP_NOT_ALLOWED` |

---

## Valores monetarios

:::warning[El dinero siempre es string decimal]
Todo valor monetario se transmite como **string decimal**, nunca como número: `"amount": "1500.00"`. Enviar un número resulta en `400 AMOUNT_MUST_BE_STRING`.
:::

| Magnitud            | Decimales | Redondeo              |
| :------------------ | :-------: | :-------------------- |
| BRL                 | 2         | Hacia arriba          |
| USDT / USDC         | 6         | Hacia abajo (entrega) |
| `rate` (cotización) | 8         | —                     |

Las fechas siguen ISO 8601 en UTC (ej.: `2026-10-13T14:03:52.114Z`).

---

## Formato de error {#error-format}

Todo error llega en el mismo envoltorio:

```json
{
  "reason": "INSUFFICIENT_BALANCE",
  "message": "Saldo insuficiente para a compra.",
  "traceId": "1-6710b8e4-3c1f2a9b7d5e4f6a8b9c0d1e"
}
```

| Campo     | Descripción                                                                                       |
| :-------- | :------------------------------------------------------------------------------------------------ |
| `reason`  | Código estable del error. **Use este campo en su lógica.**                                        |
| `message` | Texto legible, en pt-BR por defecto o en inglés con `Accept-Language: en`. Puede cambiar.         |
| `traceId` | Protocolo para informar al soporte de XGate.                                                      |

La lista completa está en <a href={useBaseUrl('/docs/buy-sell/errors')}>Códigos de Error</a>.

---

## Idempotencia

La compra es idempotente por el campo `externalId` (no existe el encabezado `Idempotency-Key`). Consulte <a href={useBaseUrl('/docs/buy-sell/purchases/create')}>Comprar Cripto</a>.

---

## Límites

| Situación                                                              | Respuesta                                       |
| :--------------------------------------------------------------------- | :---------------------------------------------- |
| Exceso de llamadas por minuto en cotización, estimación y compra       | `429 RATE_LIMITED` con encabezado `Retry-After` |
| Cuerpo de la solicitud superior a 256 KiB                              | `413 PAYLOAD_TOO_LARGE`                         |
| Servicio sobrecargado                                                  | `503 SERVICE_OVERLOADED` con `Retry-After`      |

Respete el `Retry-After` (en segundos) antes de intentarlo de nuevo.
