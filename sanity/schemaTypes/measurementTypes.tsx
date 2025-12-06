import { defineField, defineType } from "sanity";

export const measurement = defineType({
    name: 'measurement',
    title: 'Measurement',
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        description: 'e.g., "Inches", "Feet", "Centimeters"'
      }),
      defineField({
        name: 'symbol',
        title: 'Symbol',
        type: 'string',
        description: 'e.g., "in", "ft", "cm"'
      }),
      defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title' }
      })
    ]
  });