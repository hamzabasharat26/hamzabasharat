import type { Testimonial } from './types'

// ---------------------------------------------------------------------------
// REAL RECOMMENDATIONS ONLY.
//
// Transcribed verbatim on 2026-08-25 from the LinkedIn recommendations page:
//   https://www.linkedin.com/in/hamzabasharat26/details/recommendations/
//
// Nothing here is written, paraphrased, tightened or "improved". If a quote
// reads awkwardly, that is how the person wrote it, and that is the point —
// real recommendations do not read like marketing copy, and readers can tell.
//
// Rules that still apply to anything added later:
//   1. `quote` is VERBATIM. You may trim with an ellipsis; you may not rewrite.
//   2. `source` is required and must be a URL a stranger can open.
//   3. If this array is empty, the Testimonials section does not render.
//
// `authorOrg` note: LinkedIn shows a headline, not a clean employer field.
// Where the employer was unambiguous it is recorded; where the headline is a
// freelance/positioning statement, `authorOrg` is set to the closest honest
// value rather than inventing a company. Check each one before shipping.
// ---------------------------------------------------------------------------

const SOURCE =
  'https://www.linkedin.com/in/hamzabasharat26/details/recommendations/?detailScreenTabIndex=0'

export const testimonials: Testimonial[] = [
  {
    quote:
      "Hamza works both sides of computer vision, research and production, which most people don't. He's built and deployed real-time detection systems running on edge hardware in live industrial settings, not just in a notebook. He also led an AI-powered measurement platform from prototype through to a live cloud deployment on his own. On top of that, he's comfortable building with modern LLM and retrieval systems too. That range is rare enough to be worth a conversation if you're hiring for computer vision or applied AI.",
    author: 'Nasir Mehmood',
    authorTitle: 'Head of Retail Sales',
    authorOrg: 'Security General Insurance Company Ltd.',
    date: '2026-08-13',
    source: SOURCE,
  },
  {
    quote:
      'I worked with Hamza on a few AI and backend projects during and after university. He’s solid with YOLO-based computer vision work and comfortable building out the backend to actually deploy it, not just get a model working in a notebook. He asks good questions, follows through, and I never had to double-check his work. Good person to have on a project.',
    author: 'Sami Uddin',
    authorTitle: 'AI / Computer Vision Engineer',
    authorOrg: 'Codexia Tech',
    date: '2026-08-10',
    source: SOURCE,
  },
  {
    quote:
      'I highly recommend Hamza for his exceptional work as a Full Stack AI Developer. He demonstrated strong technical knowledge, clear communication, and consistent problem-solving ability throughout our collaboration. He successfully developed and integrated LLM and RAG-based chatbot solutions that were practical, scalable, and built around real user needs. His ability to handle both frontend and backend while delivering intelligent AI features reflects a rare combination of technical depth and product understanding. Hamza is dependable, quick to adapt, and committed to delivering quality results. He is a developer I would confidently engage again on any AI-driven project.',
    author: 'Saira Gillani',
    authorTitle: 'Reliability Analysis · Statistical Modeling · Computer Vision · AI',
    authorOrg: 'Client',
    date: '2026-05-18',
    source: SOURCE,
  },
  {
    quote:
      'I highly recommend Hamza for his exceptional work in developing the platform using AI technologies. Hamza demonstrated strong innovation, technical capability, and problem-solving skills throughout the development process. He successfully leveraged artificial intelligence to create a practical and forward-thinking solution focused on safety, monitoring, and operational efficiency. His ability to combine AI concepts with real-world applications shows both technical expertise and a strong understanding of user needs. Hamza is highly motivated, quick to learn new technologies, and committed to delivering quality results.',
    author: 'Mohammed Faisal Ghayas',
    authorTitle: 'Senior Account Manager — Building Automation (BAS/BMS)',
    authorOrg: 'Client',
    date: '2026-05-10',
    source: SOURCE,
  },
  {
    quote:
      'I had the opportunity to work with Hamza in the AI automation and computer vision space, and I’ve been consistently impressed by his technical skills and problem-solving mindset. He has a strong understanding of AI development, LLM pipelines, and computer vision systems, and he approaches projects with both creativity and attention to detail. Hamza is reliable, quick to learn, and always focused on building practical solutions that create real value. I’d highly recommend him to anyone looking for a skilled and dedicated AI developer.',
    author: 'Haris Ai',
    authorTitle: 'Multi-agent AI systems · OpenClaw + n8n',
    authorOrg: 'Independent',
    date: '2026-05-19',
    source: SOURCE,
  },
]

export const hasTestimonials = testimonials.length > 0

/**
 * ORDERING NOTE
 *
 * Nasir Mehmood is first on purpose. It is the only recommendation that names
 * specific capabilities — edge deployment in live industrial settings, an
 * owned end-to-end cloud deployment, LLM/retrieval work — and it ends with an
 * explicit hiring recommendation. It is the one a recruiter will actually
 * finish reading.
 *
 * Sami Uddin is second because a peer engineer saying "I never had to
 * double-check his work" is the most credible sentence in the whole set.
 *
 * The last three are warm but generic; they read as praise rather than
 * evidence. If the section starts to feel long, cut from the bottom.
 */
