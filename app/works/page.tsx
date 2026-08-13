import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { BranchWorks } from "@/components/branch-works"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SmoothScroll } from "@/components/smooth-scroll"

export const metadata: Metadata = {
  title: "Works — Ilori Ayomide | Machine Learning & Full-Stack Portfolio",
  description:
    "Explore selected machine learning, NLP, computer vision, and full-stack software engineering projects by Ilori Ayomide presented as an interactive organic branch network.",
}

export default function WorksPage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen">
        <BranchWorks />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
