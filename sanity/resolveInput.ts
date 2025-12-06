// sanity/resolveInput.ts
import AIProductDescription from '@/components/AiDescriptionInput'
import { InputProps } from 'sanity'


export function resolveInput(props: InputProps) {
  const { schemaType } = props
  
  if (schemaType.name === 'aiDescription') {
    return AIProductDescription
  }
  
  return undefined
}