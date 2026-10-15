import { notFound } from "next/navigation";
import { Profile } from "@/components/profile";
import { wordmarkVariants, type WordmarkVariant } from "@/components/wordmark";

export function generateStaticParams() {
  return wordmarkVariants.map((v) => ({ id: String(v.id) }));
}

export default async function VariantPage({
  params,
}: PageProps<"/variantes/[id]">) {
  const { id } = await params;
  const variant = wordmarkVariants.find((v) => String(v.id) === id);
  if (!variant) notFound();
  return <Profile variant={variant.id as WordmarkVariant} />;
}
