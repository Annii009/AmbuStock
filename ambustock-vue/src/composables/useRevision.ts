// useRevision.ts - Lógica de negocio para la revisión

import type { Zona, Material } from '@/services/api'

export function useRevision() {
  // Contar total de materiales en una zona
  const contarTotalMateriales = (zona: Zona): number => {
    let total = zona.materiales ? zona.materiales.length : 0
    
    if (zona.cajones) {
      zona.cajones.forEach(cajon => {
        total += cajon.materiales ? cajon.materiales.length : 0
      })
    }
    
    return total
  }

  // Contar materiales revisados en una zona
  const contarMaterialesRevisados = (zona: Zona): number => {
    let revisados = 0
    
    if (zona.materiales) {
      revisados += zona.materiales.filter(m => m.cantidadRevisada === m.cantidad).length
    }
    
    if (zona.cajones) {
      zona.cajones.forEach(cajon => {
        if (cajon.materiales) {
          revisados += cajon.materiales.filter(m => m.cantidadRevisada === m.cantidad).length
        }
      })
    }
    
    return revisados
  }

  // Inicializar cantidades revisadas a 0
  const inicializarCantidadesRevisadas = (zonas: Zona[]): void => {
    zonas.forEach(zona => {
      if (zona.materiales) {
        zona.materiales.forEach(material => {
          if (material.cantidadRevisada === undefined) {
            material.cantidadRevisada = 0
          }
        })
      }
      
      if (zona.cajones) {
        zona.cajones.forEach(cajon => {
          if (cajon.materiales) {
            cajon.materiales.forEach(material => {
              if (material.cantidadRevisada === undefined) {
                material.cantidadRevisada = 0
              }
            })
          }
        })
      }
    })
  }

  // Obtener materiales faltantes
  const obtenerMaterialesFaltantes = (zonas: Zona[]) => {
    const materialesFaltantes: any[] = []
    
    zonas.forEach(zona => {
      if (zona.materiales) {
        zona.materiales.forEach(material => {
          const cantidadFaltante = material.cantidad - (material.cantidadRevisada || 0)
          if (cantidadFaltante > 0) {
            materialesFaltantes.push({
              nombreProducto: material.nombreProducto,
              cantidadFaltante: cantidadFaltante,
              nombreZona: zona.nombreZona,
              nombreCajon: null,
              ubicacion: zona.nombreZona
            })
          }
        })
      }
      
      if (zona.cajones) {
        zona.cajones.forEach(cajon => {
          if (cajon.materiales) {
            cajon.materiales.forEach(material => {
              const cantidadFaltante = material.cantidad - (material.cantidadRevisada || 0)
              if (cantidadFaltante > 0) {
                materialesFaltantes.push({
                  nombreProducto: material.nombreProducto,
                  cantidadFaltante: cantidadFaltante,
                  nombreZona: zona.nombreZona,
                  nombreCajon: cajon.nombreCajon,
                  ubicacion: `${cajon.nombreCajon} - ${zona.nombreZona}`
                })
              }
            })
          }
        })
      }
    })
    
    return materialesFaltantes
  }

  return {
    contarTotalMateriales,
    contarMaterialesRevisados,
    inicializarCantidadesRevisadas,
    obtenerMaterialesFaltantes
  }
}
