import { type SchemaTypeDefinition } from 'sanity'
import { product } from './productType'
import { category } from './categorySchema'
import { material } from './MaterialSchema'
import { measurement } from './measurementTypes'
import aiDescriptionSchema from './aiDescriptionSchema'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    category,
    material,
    measurement,
    aiDescriptionSchema
  ],
}
