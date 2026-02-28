import { defineField, defineType } from "sanity";
import AIGenerateButton from "@/components/AIblog";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",

  fields: [
    defineField({
      name: "aiGenerate",
      title: "Generate with AI",
      type: "string",
      components: {
        input: AIGenerateButton, // <-- scoped to just this one field
      },
      // optional: hide it from the document's published value
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true, // ← allows /products/laxmi-ji
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
                  },
                  {
                    name: "blank",
                    type: "boolean",
                    title: "Open in new tab",
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: { type: "blogCategorySchema" } }],
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    defineField({
      name: "isDraftFromAI",
      title: "AI Draft",
      type: "boolean",
      initialValue: true,
    }),
  ],
});
