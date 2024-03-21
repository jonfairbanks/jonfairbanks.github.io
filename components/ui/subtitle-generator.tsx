"use client";

import { TextGenerateEffect } from "./text-generate-effect";
 
const words = `Architecting Resilience: Transforming Systems for the World of Cloud & DevOps`;
 
export function SubtitleGenerator() {
  return <TextGenerateEffect words={words} />;
}