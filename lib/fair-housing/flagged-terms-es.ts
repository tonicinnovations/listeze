// v1.12 — Spanish-language Fair Housing flagged terms
// Source: HUD guidance adapted for Spanish MLS descriptions, common idioms in TX/FL/AZ/CA markets
import type { FlaggedTerm } from "./flagged-terms";

export const FLAGGED_TERMS_ES: FlaggedTerm[] = [
  // Familial status / Estado familiar
  { term: "ideal para familias", category: "familial", severity: "high", suggestion: "describir características: patio grande, múltiples habitaciones" },
  { term: "perfecto para niños", category: "familial", severity: "high", suggestion: "mencionar patio cercado, espacio de juego" },
  { term: "vecindario familiar", category: "familial", severity: "high", suggestion: "describir características del vecindario, no el tipo de residente" },
  { term: "para parejas jóvenes", category: "familial", severity: "medium", suggestion: "describir la propiedad, no al comprador" },
  { term: "para solteros", category: "familial", severity: "medium", suggestion: "describir la propiedad, no al comprador" },
  { term: "sin niños", category: "familial", severity: "high", suggestion: "eliminar completamente — ilegal" },
  { term: "solo adultos", category: "familial", severity: "high", suggestion: "eliminar a menos que sea comunidad legal 55+" },
  { term: "para jubilados", category: "familial", severity: "medium", suggestion: "describir accesibilidad y bajo mantenimiento" },
  { term: "nido vacío", category: "familial", severity: "medium", suggestion: "describir un solo nivel, bajo mantenimiento" },

  // Race / Raza / Origen nacional
  { term: "barrio exclusivo", category: "race", severity: "high", suggestion: "describir amenidades específicas" },
  { term: "zona exclusiva", category: "race", severity: "high", suggestion: "describir amenidades específicas" },
  { term: "barrio tranquilo", category: "race", severity: "medium", suggestion: "describir características: calle sin salida, lote grande" },
  { term: "barrio seguro", category: "race", severity: "high", suggestion: "eliminar — implica comparación discriminatoria" },
  { term: "zona segura", category: "race", severity: "high", suggestion: "eliminar — implica comparación discriminatoria" },
  { term: "bajo crimen", category: "race", severity: "high", suggestion: "eliminar — no se puede hacer esta afirmación" },
  { term: "vecindario tradicional", category: "race", severity: "medium", suggestion: "describir la arquitectura o época" },
  { term: "comunidad cerrada", category: "race", severity: "low", suggestion: "describir las características del HOA específicamente" },

  // Religion / Religión
  { term: "cerca de iglesias", category: "religion", severity: "high", suggestion: "nombrar un punto de referencia no religioso" },
  { term: "comunidad cristiana", category: "religion", severity: "high", suggestion: "eliminar" },
  { term: "cerca del templo", category: "religion", severity: "high", suggestion: "eliminar" },
  { term: "cerca de la mezquita", category: "religion", severity: "high", suggestion: "eliminar" },

  // Disability / Discapacidad
  { term: "a poca distancia a pie", category: "disability", severity: "medium", suggestion: "usar 'a X kilómetros de' o 'a 5 minutos en auto'" },
  { term: "para personas sin discapacidad", category: "disability", severity: "high", suggestion: "eliminar" },
  { term: "se requiere buena condición física", category: "disability", severity: "high", suggestion: "reescribir sin requisito de habilidad" },

  // Sex / Sexo / Género
  { term: "dormitorio principal", category: "sex", severity: "low", suggestion: "usar 'suite principal' o 'habitación principal'" },
  { term: "recámara de servicio", category: "sex", severity: "low", suggestion: "usar 'habitación adicional'" },
  { term: "cuarto de hombres", category: "sex", severity: "low", suggestion: "usar 'sala de recreación' o 'cuarto de bonus'" },

  // Schools / Escuelas
  { term: "buenas escuelas", category: "race", severity: "medium", suggestion: "nombrar el distrito escolar" },
  { term: "mejores escuelas", category: "race", severity: "medium", suggestion: "nombrar el distrito escolar por nombre" },
  { term: "escuelas de alto nivel", category: "race", severity: "medium", suggestion: "nombrar el distrito escolar" },
];
