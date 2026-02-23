import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Product Description",
      type: 'array',
      of: [
        { type: 'block' }
      ]
    }),
    
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
    }),
    defineField({
      name: "price",
      title: "Price (INR)",
      type: "string",
    }),
    defineField({
      name: "paintingStyle",
      title: "Painting Style",
      type: "string",
      options: {
        list: ["Full Paint", "Half Paint","No Paint"],
      },
    }),
defineField({
  name: "images",
  title: "Product Images",
  type: "array",
  of: [
    {
      type: "image",
      options: { hotspot: true }  // <-- hotspot here inside the image object
    }
  ],
}),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "material",
      title: "Material",
      type: "reference",
      to: [{ type: "Material" }],
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "actual_price",
      title: "Actual Price (INR)",
      type: "number",
    }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "object",
      fields: [
        {
          name: "length",
          title: "Length",
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "number" },
            {
              name: "unit",
              title: "Unit",
              type: "reference",
              to: [{ type: "measurement" }],
            },
          ],
        },
        {
          name: "width",
          title: "Width",
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "number" },
            {
              name: "unit",
              title: "Unit",
              type: "reference",
              to: [{ type: "measurement" }],
            },
          ],
        },
        {
          name: "height",
          title: "Height",
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "number" },
            {
              name: "unit",
              title: "Unit",
              type: "reference",
              to: [{ type: "measurement" }],
            },
          ],
        },
      ],
    }),
    
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      options: {
        timezone: "Asia/Kolkata",
      },
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
      options: {
        timezone: "Asia/Kolkata",
      },
    }),
  ],
});
