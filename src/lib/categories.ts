import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/lib/constants";

export { CATEGORIES };

export async function seedCategories() {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, order: cat.order, description: cat.description },
      create: cat,
    });
  }
}
