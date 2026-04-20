import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CaseStudyNode {
  id: string;
  parentId: string | null;
  title: string;
  projectName: string;
  client: string;
  outcome: string;
  challenge: string;
  solution: string;
  results: string;
  tools: string;
}

const OUTCOME_MAP: Record<string, { label: string; color: string }> = {
  'out-great': { label: 'Exceeded Goals', color: '#10b981' },
  'out-met': { label: 'Met Goals', color: '#3b82f6' },
  'out-learning': { label: 'Key Learning', color: '#f59e0b' },
};

function CaseStudyCard({ cs, index }: { cs: CaseStudyNode; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const outcome = OUTCOME_MAP[cs.outcome];

  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${index * 100}ms`,
        border: '1px solid rgba(242, 237, 228, 0.07)',
        borderRadius: '2px',
        overflow: 'hidden',
        transition: 'border-color 0.3s ease',
        borderColor: expanded ? 'rgba(212, 137, 26, 0.2)' : undefined,
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: '32px',
          cursor: 'pointer',
          background: expanded ? 'rgba(212, 137, 26, 0.04)' : 'var(--obsidian-2)',
          transition: 'background 0.3s ease',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'start',
          gap: '20px',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {outcome && (
              <span className="tag" style={{ borderColor: outcome.color + '40', color: outcome.color }}>
                {outcome.label}
              </span>
            )}
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--ivory-ghost)',
              letterSpacing: '0.08em',
            }}>
              {cs.client}
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
            fontWeight: 700,
            color: 'var(--ivory)',
            lineHeight: 1.2,
            marginBottom: '10px',
          }}>
            {cs.projectName || cs.title}
          </h3>
          {!expanded && cs.challenge && (
            <p style={{
              fontSize: '0.85rem',
              color: 'var(--ivory-ghost)',
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {cs.challenge}
            </p>
          )}
        </div>
        <div style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(242, 237, 228, 0.1)',
          borderRadius: '50%',
          flexShrink: 0,
          transition: 'all 0.3s ease',
          background: expanded ? 'rgba(212, 137, 26, 0.1)' : 'transparent',
        }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transition: 'transform 0.3s ease',
              transform: expanded ? 'rotate(180deg)' : 'none',
            }}
          >
            <path d="M2 5l5 5 5-5" stroke="var(--amber)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      <div style={{
        maxHeight: expanded ? '1000px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
      }}>
        <div style={{ padding: '0 32px 32px' }}>
          <div className="amber-divider" style={{ marginBottom: '28px' }} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px', marginBottom: '28px' }}>
            {[
              { label: 'The Challenge', value: cs.challenge },
              { label: 'The Solution', value: cs.solution },
              { label: 'Results', value: cs.results },
            ].map(({ label, value }) => value ? (
              <div key={label}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--amber)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  {label}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--ivory-dim)', lineHeight: 1.7 }}>
                  {value}
                </p>
              </div>
            ) : null)}
          </div>

          {cs.tools && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--ivory-ghost)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Tools:
              </span>
              {cs.tools.split(',').map(t => (
                <span
                  key={t}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: 'var(--ivory-dim)',
                    padding: '3px 8px',
                    border: '1px solid var(--mist-2)',
                    borderRadius: '2px',
                  }}
                >
                  {t.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CaseStudies() {
  const [cases, setCases] = useState<CaseStudyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/taskade/projects/XcQ6BMRjkBTVdyr9/nodes');
        const nodes = res.data?.payload?.nodes || [];
        // Only top-level nodes (actual case study entries)
        const topLevel = nodes
          .filter((n: any) => n.parentId === null)
          .map((n: any) => ({
            id: n.id,
            parentId: n.parentId,
            title: n.fieldValues['/text'] || '',
            projectName: n.fieldValues['/attributes/@cs1'] || '',
            client: n.fieldValues['/attributes/@cs2'] || '',
            outcome: n.fieldValues['/attributes/@cs3'] || '',
            challenge: n.fieldValues['/attributes/@cs4'] || '',
            solution: n.fieldValues['/attributes/@cs5'] || '',
            results: n.fieldValues['/attributes/@cs6'] || '',
            tools: n.fieldValues['/attributes/@cs7'] || '',
          }));
        setCases(topLevel);
      } catch (err) {
        console.error('Failed to fetch case studies', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const outcomes = ['all', 'out-great', 'out-met', 'out-learning'];
  const filtered = filter === 'all' ? cases : cases.filter(c => c.outcome === filter);

  return (
    <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh', paddingTop: '80px' }}>
      {/* Page header */}
      <section style={{
        padding: '80px 40px 60px',
        borderBottom: '1px solid rgba(242, 237, 228, 0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background accent */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 137, 26, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="animate-fade-up" style={{ marginBottom: '16px' }}>
            <span className="section-number">Case Study Library</span>
          </div>
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            color: 'var(--ivory)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
          }}>
            Engineering,<br />
            <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>unpacked.</span>
          </h1>
          <p className="animate-fade-up delay-200" style={{
            fontSize: '0.9rem',
            color: 'var(--ivory-ghost)',
            maxWidth: '480px',
            lineHeight: 1.7,
            marginBottom: '40px',
          }}>
            15 years of hard problems — design system scale, AI tooling from scratch, $400K revenue lifts from browser AR. Here's how it actually happened.
          </p>

          {/* Filter bar */}
          <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {outcomes.map(o => {
              const label = o === 'all' ? 'All Cases' : (OUTCOME_MAP[o]?.label || o);
              const isActive = filter === o;
              return (
                <button
                  key={o}
                  onClick={() => setFilter(o)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    padding: '8px 16px',
                    border: `1px solid ${isActive ? 'var(--amber)' : 'rgba(242, 237, 228, 0.1)'}`,
                    background: isActive ? 'rgba(212, 137, 26, 0.1)' : 'transparent',
                    color: isActive ? 'var(--amber)' : 'var(--ivory-ghost)',
                    borderRadius: '2px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Case Studies list */}
      <section style={{ padding: '60px 40px 100px', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                height: '120px',
                background: 'var(--obsidian-2)',
                borderRadius: '2px',
                border: '1px solid rgba(242, 237, 228, 0.06)',
              }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--ivory-ghost)',
            letterSpacing: '0.08em',
          }}>
            No case studies found for this filter.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filtered.map((cs, i) => (
              <CaseStudyCard key={cs.id} cs={cs} index={i} />
            ))}
          </div>
        )}

        {/* CTA to Narrator */}
        <div style={{
          marginTop: '80px',
          padding: '48px',
          background: 'linear-gradient(135deg, rgba(212, 137, 26, 0.06), rgba(155, 74, 30, 0.04))',
          border: '1px solid rgba(212, 137, 26, 0.15)',
          borderRadius: '2px',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
              AI-Powered Guide
            </div>
            <h3 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--ivory)',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}>
              Questions about Rich's work?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ivory-ghost)', lineHeight: 1.6 }}>
              Portfolio Narrator is trained on Rich's full case history — ForgeKit, design systems, engineering leadership, and real impact metrics. Ask it anything.
            </p>
          </div>
          <button
            onClick={() => navigate('/narrator')}
            className="btn-amber"
          >
            Ask Narrator →
          </button>
        </div>
      </section>
    </div>
  );
}
