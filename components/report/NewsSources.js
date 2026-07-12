'use client';

/**
 * NewsSources Component
 * 
 * Separates and displays two distinct collections of news:
 * 1. AI Research Sources (consumed directly by the AI model)
 * 2. Related Reading (supplementary reading materials)
 * 
 * Ref: ANTIGRAVITY_SPEC §10, §12
 * 
 * @param {{
 *   sources: Array<{ title: string, url: string, content?: string }>,
 *   related: Array<{ title: string, url: string, content?: string }>
 * }} props
 */
export default function NewsSources({ sources = [], related = [] }) {
  const hasSources = sources && sources.length > 0;
  const hasRelated = related && related.length > 0;

  if (!hasSources && !hasRelated) {
    return (
      <div className="border border-zinc-800 rounded-2xl bg-zinc-900/30 p-6 text-zinc-500 text-center text-sm">
        No news references available for this report.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* AI Research Sources */}
      <section className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          AI Research Sources
        </h3>
        {hasSources ? (
          <ul className="space-y-4">
            {sources.map((art, idx) => (
              <li key={idx} className="group border-b border-zinc-800/50 last:border-0 pb-4 last:pb-0">
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition-colors mb-1.5"
                >
                  {art.title}
                </a>
                {art.content && (
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {art.content}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500 italic">No direct sources were consumed for this run.</p>
        )}
      </section>

      {/* Related Reading */}
      <section className="bg-zinc-900/10 border border-zinc-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-zinc-400 mb-4 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-600"></span>
          Related Reading
        </h3>
        {hasRelated ? (
          <ul className="space-y-4">
            {related.map((art, idx) => (
              <li key={idx} className="group border-b border-zinc-800/50 last:border-0 pb-4 last:pb-0">
                <a
                  href={art.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm font-semibold text-zinc-100 group-hover:text-zinc-300 transition-colors mb-1.5"
                >
                  {art.title}
                </a>
                {art.content && (
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {art.content}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-zinc-500 italic">No related articles found.</p>
        )}
      </section>
    </div>
  );
}
