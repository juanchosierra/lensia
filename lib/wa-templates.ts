// lib/wa-templates.ts — WhatsApp notification templates (Fase 2)

export type WATemplate = {
  key: string;
  estadoN: number;
  label: string;
  enabled: boolean;
  body: string; // with {variables}
};

export const WA_VARIABLES: Array<{ key: string; label: string; example: string }> = [
  { key: "{optica}",        label: "Nombre de la óptica",   example: "Óptica Claridad" },
  { key: "{paciente}",      label: "Nombre del paciente",   example: "María Fernanda" },
  { key: "{pedido}",        label: "# de pedido",           example: "10247" },
  { key: "{eta}",           label: "Fecha estimada",        example: "3 Jun" },
  { key: "{guia}",          label: "# de guía",             example: "0254-11907" },
  { key: "{transportadora}",label: "Transportadora",        example: "Servientrega" },
  { key: "{lab}",           label: "Nombre del laboratorio", example: "Lensia Lab" },
  { key: "{motivo}",        label: "Motivo de la demora",   example: "Pendiente fotocromático" },
];

export const DEFAULT_WA_TEMPLATES: WATemplate[] = [
  {
    key: "wa-recibido", estadoN: 1, label: "Pedido recibido", enabled: true,
    body: "¡Hola {optica}! Confirmamos la recepción del pedido *#{pedido}* — paciente *{paciente}*. Te avisamos en cada paso. — {lab}",
  },
  {
    key: "wa-validacion", estadoN: 2, label: "En validación", enabled: true,
    body: "Pedido *#{pedido}* en validación. Entrega estimada *{eta}*. Si necesitamos algo te escribimos por aquí. — {lab}",
  },
  {
    key: "wa-tratamientos", estadoN: 4, label: "Tratamientos aplicados", enabled: false,
    body: "Pedido *#{pedido}* ya entró a tratamientos. Vamos por buen camino. — {lab}",
  },
  {
    key: "wa-despachado", estadoN: 7, label: "Despachado", enabled: true,
    body: "🚚 Pedido *#{pedido}* despachado por *{transportadora}* (guía *{guia}*). Llega aproximadamente *{eta}*. — {lab}",
  },
  {
    key: "wa-entregado", estadoN: 8, label: "Entregado", enabled: true,
    body: "✅ Pedido *#{pedido}* entregado. Si algo no quedó perfecto, repórtalo desde la app y lo resolvemos. — {lab}",
  },
  {
    key: "wa-excepcion", estadoN: 0, label: "Demora / excepción", enabled: true,
    body: "⚠️ Pedido *#{pedido}* en pausa: {motivo}. Te avisamos apenas reanudemos. — {lab}",
  },
];

const SAMPLE: Record<string, string> = {
  "{optica}": "Óptica Claridad",
  "{paciente}": "María Fernanda Gómez",
  "{pedido}": "10247",
  "{eta}": "3 Jun",
  "{guia}": "0254-11907",
  "{transportadora}": "Servientrega",
  "{lab}": "Lensia Lab",
  "{motivo}": "Pendiente fotocromático",
};

export function renderTemplate(body: string): string {
  return Object.entries(SAMPLE).reduce(
    (acc, [k, v]) => acc.split(k).join(v),
    body,
  );
}
