import { permanentRedirect } from "next/navigation";

// The blog and the articles archive both render the same Substack feed. The
// /articles page is the aligned, filterable version, so /blog now redirects
// there to avoid a duplicate (and previously off-style) page.
export default function BlogPage() {
  permanentRedirect("/articles");
}
