---
sidebar_label: 'Recibir webhooks'
sidebar_position: 1
description: 'Los webhooks son notificaciones automáticas enviadas por XGate a su sistema cada vez que cambia el estado de una transacción.'
sidebar_class_name: 'sidebar-method-post'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Recibir webhooks

Los webhooks son notificaciones automáticas enviadas por XGate a su sistema cada vez que cambia el estado de una transacción (por ejemplo, se pagó un depósito Pix, ocurrió un error de liquidación o un retiro pasó a procesamiento).

Esto elimina la necesidad de que su sistema consulte repetidamente la API para saber si un pago se ha liquidado. XGate actúa solo como intermediario: nosotros enviamos la información y su sistema debe estar preparado para recibirla y manejarla.

---

## Configuración en el panel

Es esencial entender que **XGate no proporciona una URL de webhook**. Usted (o su equipo de desarrollo) debe crear una ruta pública en su propio servidor para recibir los datos. Después de crear esta ruta, debe registrarla en el panel de XGate.

Siga los pasos a continuación para configurar la entrega de notificaciones:

1. Acceda al menú lateral **Webhooks** en su panel de XGate.
2. Haga clic en **+ Add Integration** o en **Configure** en un espacio vacío.
3. Complete los campos de destino:
   * **Name:** Un nombre de identificación interno para usted (por ejemplo, "Main Server Webhook").
   * **URL:** La dirección completa del endpoint alojado en su servidor (por ejemplo, `https://your-company.com/api/webhooks/xgate`).

4. **Events:** Seleccione qué notificaciones desea que XGate envíe a esta URL. Los eventos se dividen en:
   * **CRYPTOCURRENCY:** Transacciones en criptomonedas.
   * **CURRENCY:** Transacciones en moneda fiduciaria (Pix, incluyendo aprobación, rechazo, errores y todo el flujo de reembolso y disputa).

:::tip[Consejo de integración]
Nuestra recomendación es que **active todos los eventos disponibles**. Esto garantiza que su base de datos tenga un reflejo perfecto de lo que ocurre en XGate, evitando que las transacciones se queden en estados desactualizados. Sin embargo, la decisión final es suya.
:::

---

## Seguridad: lista de IP permitidas

Para asegurar que su sistema no esté sujeto a ataques falsos de webhook (usuarios malintencionados simulando que un pago fue aprobado), XGate envía todas las notificaciones desde una **IP fija dedicada**.

Recomendamos encarecidamente configurar el firewall de su servidor o agregar una validación en su código para aceptar solo solicitudes `POST` provenientes de la siguiente IP:

**IP oficial de XGate:** `107.23.39.46`

---

## Idempotencia y "externalId"

Al crear órdenes de depósito o retiro, puede enviar el campo `externalId`. Tiene dos funciones vitales:

1. **Prevenir duplicados (idempotencia):** Evita que fallas de red o un doble clic de su cliente final generen múltiples transacciones idénticas en XGate. Si se envían dos solicitudes con el mismo `externalId`, la segunda se ignorará.
2. **Trazabilidad:** Actúa como el código único de pedido en su sistema.

**Nota:** Si envía `externalId` al crear la transacción, XGate lo devolverá dentro del payload del webhook, lo que facilita su búsqueda en su base de datos.

---

## ¿Cómo funciona el flujo?

1. Registra **su URL** en el panel de XGate y selecciona los eventos.
2. Cuando ocurre uno de los eventos seleccionados, XGate realiza una solicitud **POST** a su URL desde la IP `107.23.39.46`.
3. Su sistema recibe el JSON, procesa la lógica de negocio y **confirma la recepción devolviendo un HTTP 200 OK**.

:::warning[Mejor práctica de integración]
Su servidor **DEBE** devolver el estado HTTP `200` (OK) inmediatamente después de recibir el webhook. Esta es la práctica estándar para informar a XGate que su sistema procesó la notificación correctamente, cerrando la conexión adecuadamente y evitando fallas de comunicación (*timeouts*) entre servidores.
:::

---

## Formato y variaciones de la solicitud

El formato del payload varía ligeramente según si la transacción involucra solo Fiat (Pix) o criptomonedas (USDT).

- **Método:** <span className="badge badge--info">POST</span>

### Ejemplos de payload

**1. Transacción estándar (Pix BRL):**
Devuelve el campo `type` que especifica el método.

```json
{
    "id": "676071f1*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "BRL",
    "type": "PIX",
    "amount": 2,
    "operation": "DEPOSIT"
}
```

**2. Retiro (USDT convertido a Pix):**
El campo `type` se omite en operaciones que involucran saldos en criptomonedas.

```json
{
    "id": "676070dc*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.04,
    "operation": "WITHDRAW"
}
```

**3. Depósito (Pix convertido a Cripto):**

```json
{
    "id": "676070*************",
    "customerId": "123456*************",
    "status": "PAID",
    "name": "USDT",
    "amount": 0.332,
    "operation": "DEPOSIT"
}
```

**4. Retiro (Cripto a Cripto)**

```json
{
  "id": "6a3a844fe2**************",
  "status": "PAID",
  "name": "USDT",
  "amount": 1,
  "operation": "WITHDRAW",
  "customerId": "6a1a379e1f**************",
  "txHash": "54vpJgzQ8C2ktDj7************************"
}
```

**5. Depósito (Cripto a Cripto)**

```json
{
  "id": "6a3da45e116****************",
  "status": "PAID",
  "name": "USDT",
  "amount": 4.7,
  "operation": "DEPOSIT",
  "customerId": "6a1a379e1fe****************",
  "txHash": "mtVZznAKV6m1eEjWrWaX****************"
}
```

### Descripción de los campos

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `string` | ID único de la transacción generado por XGate. |
| `status` | `string` | El estado actual de la transacción (por ejemplo, `PAID`, `PROCESSING`). |
| `name` | `string` | La moneda base de la transacción (por ejemplo, `BRL`, `USDT`). |
| `type` | `string` | *(Condicional)* El método utilizado (por ejemplo, `PIX`). Usualmente no aparece en transacciones que involucran saldo en criptomonedas. |
| `amount` | `number` | El valor procesado en la transacción. |
| `operation` | `string` | Define si es una entrada o salida (`DEPOSIT` o `WITHDRAW`). |
| `customerId` | `string` | ID del cliente asociado a la transacción. |
| `externalId` | `string` | *(Opcional)* El ID del pedido en su sistema. Solo se devuelve si usted lo envió al crear la transacción. |
| `txHash` | `string` | *(Condicional)* Hash de la transacción en blockchain. Solo se devuelve en operaciones 100% en cripto. |

---

## Posibles estados

Su sistema debe estar preparado para procesar los estados del flujo normal y los estados del flujo de disputa/reembolso (chargeback).

### Flujo principal de la transacción

| Estado | Significado | Acción recomendada |
| :--- | :--- | :--- |
| <span className="badge badge--secondary">PROCESSING</span> | La transacción está siendo procesada. | Solo registrar el progreso (común en retiros). |
| <span className="badge badge--success">PAID</span> | La transacción se completó y se pagó correctamente. | **Liberar el saldo/producto y confirmar el depósito o retiro.** |
| <span className="badge badge--danger">ERROR</span> | Fallo de la operación (por ejemplo, clave Pix incorrecta en retiros, titular de cuenta inválido). | Notificar al usuario final sobre el fallo y sugerir revisar la información registrada. |
| <span className="badge badge--danger">REJECTED</span> | Rechazado por el socio de compensación/banco. | Evento poco común; tratarlo como un fallo definitivo. |

### Flujo de chargeback y disputa

| Estado | Significado | Acción recomendada |
| :--- | :--- | :--- |
| <span className="badge badge--warning">AWAITING_REFUND_CONTESTION</span> | El cliente final abrió una disputa de reembolso con su banco. El saldo queda retenido. | Congelar preventivamente el saldo/servicio del cliente. |
| <span className="badge badge--warning">AWAITING_BANK_VEREDICT</span> | Se presentó la defensa de la disputa y estamos esperando que el banco la juzgue. | Esperar la resolución. |
| <span className="badge badge--danger">EXPIRED_DISPUTE</span> | El plazo para presentar la evidencia de la disputa ha expirado. | Registrar la disputa como perdida. |
| <span className="badge badge--success">REFUND_CANCELED</span> | El reembolso fue cancelado por el banco (ganó la disputa). | El monto retenido vuelve a su cuenta. |
| <span className="badge badge--danger">REFUND_APPROVED</span> | El reembolso fue aprobado por el banco (perdió la disputa). | El monto se devuelve al cliente final de forma definitiva. |

