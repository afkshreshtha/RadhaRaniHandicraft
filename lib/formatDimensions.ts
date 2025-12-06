// lib/formatDimensions.ts

type Dimensions = {
    height: number
    width: number
    length: number
    unit: 'in' | 'cm' | 'ft'
  }
  
  function toFeetInches(value: number) {
    const feet = Math.floor(value / 12)
    const inches = Math.round(value % 12)
    return feet > 0 ? `${feet}'${inches}"` : `${inches}"`
  }
  
  export function formatDimensions(dim: Dimensions) {
    const { height, width, length, unit } = dim
  
    if (unit === 'in') {
      return `Height: ${toFeetInches(height)} × Width: ${toFeetInches(width)} × Depth: ${toFeetInches(length)}`
    }
  
    if (unit === 'cm' || unit === 'ft') {
      return `Height: ${height}${unit} × Width: ${width}${unit} × Depth: ${length}${unit}`
    }
  
    return ''
  }
  