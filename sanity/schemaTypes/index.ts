import { type SchemaTypeDefinition } from 'sanity'
import { product } from './productType'
import { category } from './categorySchema'
import { material } from './MaterialSchema'
import { measurement } from './measurementTypes'
import aiDescriptionSchema from './aiDescriptionSchema'
import  { blogCategorySchema } from './BlogCategorySchema'
import post from './post'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    product,
    category,
    material,
    measurement,
    post,
    blogCategorySchema,
    aiDescriptionSchema
  ],
}
