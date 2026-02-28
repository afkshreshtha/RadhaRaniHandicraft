import { defineType, defineField } from "sanity"

export const blogCategorySchema = defineType({
  name: "blogCategorySchema",
  title: "Blog Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "string",
    }),
  ],
})