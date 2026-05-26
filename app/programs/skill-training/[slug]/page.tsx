import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { SkillTrackPage } from "@/components/SkillTrackPage";
import { SKILL_TRACKS } from "@/content/skill-tracks";

export function generateStaticParams() {
  return SKILL_TRACKS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const track = SKILL_TRACKS.find((t) => t.slug === params.slug);
  if (!track) return {};
  return {
    title: track.meta.title,
    description: track.meta.description,
    alternates: { canonical: `/programs/skill-training/${track.slug}` },
  };
}

export default function TrackPage({ params }: { params: { slug: string } }) {
  const track = SKILL_TRACKS.find((t) => t.slug === params.slug);
  if (!track) notFound();
  return (
    <>
      <Nav />
      <SkillTrackPage track={track} />
      <Footer />
    </>
  );
}
