import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Project {
  id: string;
  title: string;
  client: string;
  role: string;
  category: string;
  description: string;
  tags: string;
  status: string;
  liveUrl: string;
}

interface Testimonial {
  id: string;
  name: string;
  company: string;
  role: string;
  quote: string;
  rating: string;
  project: string;
  featured: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  'cat-web': 'Web Design',
  'cat-brand': 'Branding',
  'cat-motion': 'Motion',
  'cat-dev': 'Engineering',
  'cat-ux': 'UX / Mobile',
};

const CATEGORY_COLORS: Record<string, string> = {
  'cat-web': '#6366f1',
  'cat-brand': '#d4891a',
  'cat-motion': '#10b981',
  'cat-dev': '#3b82f6',
  'cat-ux': '#ec4899',
};

const PROJECT_GRADIENTS = [
  'linear-gradient(135deg, #05080f 0%, #0a1628 50%, #05080f 100%)',
  'linear-gradient(135deg, #0a0805 0%, #1e1205 50%, #0a0805 100%)',
  'linear-gradient(135deg, #080f05 0%, #101f08 50%, #080f05 100%)',
  'linear-gradient(135deg, #0f050a 0%, #280a18 50%, #0f050a 100%)',
  'linear-gradient(135deg, #050a0f 0%, #08152a 50%, #050a0f 100%)',
  'linear-gradient(135deg, #0a0508 0%, #200a14 50%, #0a0508 100%)',
];

const PROJECT_SYMBOLS = ['⬡', '◈', '⬟', '◉', '⬢', '◐'];

function useIntersection(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.08, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function MarqueeBar() {
  const items = [
    'React 18+', '·', 'TypeScript', '·', 'Design Systems', '·', 'MCP Tooling', '·',
    'Storybook 8+', '·', 'Nx Monorepo', '·', 'React Native', '·', 'AI-Native Dev', '·',
    'Figma Code Connect', '·', 'Chakra UI', '·', 'Claude Code', '·', 'Cursor AI', '·',
  ];
  return (
    <div className="marquee-outer" style={{
      borderTop: '1px solid rgba(242, 237, 228, 0.06)',
      borderBottom: '1px solid rgba(242, 237, 228, 0.06)',
      padding: '11px 0',
    }}>
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: item === '·' ? 'var(--amber)' : 'var(--ivory-ghost)',
            marginRight: '24px',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, gradient }: { project: Project; index: number; gradient: string }) {
  const { ref, visible } = useIntersection();
  const catColor = CATEGORY_COLORS[project.category] || 'var(--amber)';
  const isLong = index % 3 === 0;

  return (
    <div
      ref={ref}
      className="project-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms`,
        background: gradient,
        borderRadius: '2px',
        border: '1px solid rgba(242, 237, 228, 0.05)',
        height: isLong ? '400px' : '320px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Grid lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(242,237,228,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.025) 1px, transparent 1px)',
        backgroundSize: '44px 44px',
        pointerEvents: 'none',
      }} />

      {/* Large symbol */}
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -60%)',
        fontFamily: 'var(--font-editorial)',
        fontSize: 'clamp(5rem, 12vw, 9rem)',
        color: `${catColor}08`,
        letterSpacing: '-0.02em',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {PROJECT_SYMBOLS[index % PROJECT_SYMBOLS.length]}
      </div>

      {/* Status dot */}
      {project.status === 'stat-live' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'amberpulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#10b981', letterSpacing: '0.1em' }}>LIVE</span>
        </div>
      )}
      {project.status === 'stat-wip' && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--amber)', animation: 'amberpulse 2.5s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--amber)', letterSpacing: '0.1em' }}>BETA</span>
        </div>
      )}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ marginBottom: '10px' }}>
          <span className="tag" style={{
            borderColor: catColor + '35',
            color: catColor,
          }}>
            {CATEGORY_LABELS[project.category] || 'Engineering'}
          </span>
        </div>
        <h3 style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
          fontWeight: 700,
          color: 'var(--ivory)',
          marginBottom: '5px',
          lineHeight: 1.2,
        }}>
          {project.title}
        </h3>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.62rem',
          color: 'var(--ivory-ghost)',
          letterSpacing: '0.06em',
          marginBottom: '12px',
        }}>
          {project.client} {project.role ? `— ${project.role}` : ''}
        </p>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--ivory-dim)',
          lineHeight: 1.6,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {project.description}
        </p>
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }: { testimonial: Testimonial; index: number }) {
  const { ref, visible } = useIntersection();
  const initials = testimonial.name.split(' ').slice(0, 2).map(n => n[0]).join('');

  return (
    <div
      ref={ref}
      className="glass-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${index * 120}ms`,
        borderRadius: '2px',
        padding: '32px',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: '2.2rem',
        color: 'var(--amber)',
        lineHeight: 0.8,
        marginBottom: '18px',
        opacity: 0.5,
      }}>
        "
      </div>
      <p className="testimonial-quote" style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
        {testimonial.quote}
      </p>
      <div className="amber-divider" style={{ marginBottom: '20px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--amber-dim), rgba(155, 74, 30, 0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-editorial)',
          fontSize: '0.75rem',
          color: 'var(--ivory)',
          fontWeight: 700,
          flexShrink: 0,
          letterSpacing: '0.02em',
        }}>
          {initials || '—'}
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--ivory)', fontWeight: 500 }}>{testimonial.name}</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            color: 'var(--ivory-ghost)',
            letterSpacing: '0.05em',
            marginTop: '1px',
          }}>
            {testimonial.role} · {testimonial.company}
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--amber-dim)' }}>★★★★★</span>
        </div>
      </div>
    </div>
  );
}

function SkillPill({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.65rem',
      letterSpacing: '0.08em',
      padding: '5px 10px',
      border: '1px solid var(--mist-2)',
      borderRadius: '2px',
      color: 'var(--ivory-dim)',
      background: 'var(--mist)',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', project_type: '', budget: '', message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');
  const { ref, visible } = useIntersection();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await axios.post('/api/taskade/webhooks/01KNY9WBRSKDPQV7ZBYH7DCM3F/run', form);
      setStatus('success');
      setResponseMsg(res.data?.body?.message || "Thanks — I'll be in touch within 48 hours.");
      setForm({ name: '', email: '', company: '', project_type: '', budget: '', message: '' });
    } catch {
      setStatus('error');
      setResponseMsg('Something went wrong. Email me directly at richtillman@pm.me');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'var(--obsidian-3)',
    border: '1px solid rgba(242, 237, 228, 0.1)',
    color: 'var(--ivory)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font-sans)',
    borderRadius: '2px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.62rem',
    color: 'var(--ivory-ghost)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div ref={ref} id="contact" style={{ scrollMarginTop: '80px' }}>
      <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(24px)', transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)' }}>
        <div style={{ marginBottom: '44px' }}>
          <span className="section-number">04 / Hire Me</span>
          <h2 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            color: 'var(--ivory)',
            marginTop: '10px',
            lineHeight: 1.1,
          }}>
            Let's build something<br />
            <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>worth shipping.</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--ivory-ghost)', marginTop: '12px', lineHeight: 1.7 }}>
            Open to Staff / Principal Engineer and Engineering Manager / Director roles. Also available for contract — design systems, MCP tooling, and frontend architecture.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
            <a href="mailto:richtillman@pm.me" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--amber)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              richtillman@pm.me
            </a>
            <span style={{ color: 'var(--mist-2)' }}>|</span>
            <a href="https://linkedin.com/in/effinrich" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ivory-ghost)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              linkedin.com/in/effinrich
            </a>
            <span style={{ color: 'var(--mist-2)' }}>|</span>
            <a href="https://forgekit.cloud" target="_blank" rel="noreferrer" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--ivory-ghost)', textDecoration: 'none', letterSpacing: '0.06em' }}>
              forgekit.cloud
            </a>
          </div>
        </div>

        {status === 'success' ? (
          <div className="form-success animate-fade-in">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              ✓ Message Sent
            </div>
            <p style={{ color: 'var(--ivory-dim)', fontSize: '0.88rem' }}>{responseMsg}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="portfolio-form" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} placeholder="Your name" required
                  onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'} />
              </div>
              <div>
                <label style={labelStyle}>Email *</label>
                <input style={inputStyle} type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required
                  onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} name="company" value={form.company} onChange={handleChange} placeholder="Your company or studio"
                  onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'} />
              </div>
              <div>
                <label style={labelStyle}>Opportunity Type</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} name="project_type" value={form.project_type} onChange={handleChange}
                  onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'}>
                  <option value="">Select one</option>
                  <option value="Staff / Principal Engineer">Staff / Principal Engineer Role</option>
                  <option value="Engineering Director / Manager">Engineering Director / Manager Role</option>
                  <option value="Contract - Design Systems">Contract — Design Systems</option>
                  <option value="Contract - MCP Tooling">Contract — MCP Tooling / AI Dev</option>
                  <option value="Contract - Frontend Architecture">Contract — Frontend Architecture</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Compensation Range</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} name="budget" value={form.budget} onChange={handleChange}
                onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'}>
                <option value="">Prefer not to say</option>
                <option value="Under $120k">Under $120k</option>
                <option value="$120k – $160k">$120k – $160k</option>
                <option value="$160k – $200k">$160k – $200k</option>
                <option value="$200k – $250k">$200k – $250k</option>
                <option value="$250k+">$250k+</option>
                <option value="Contract / Hourly">Contract / Hourly</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Tell me about the role or project *</label>
              <textarea style={{ ...inputStyle, minHeight: '110px', resize: 'vertical' }} name="message" value={form.message} onChange={handleChange}
                placeholder="What are you building? What problem needs solving? What does the team look like?"
                required
                onFocus={e => e.target.style.borderColor = 'rgba(212,137,26,0.5)'}
                onBlur={e => e.target.style.borderColor = 'rgba(242,237,228,0.1)'} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="submit"
                className="btn-amber"
                disabled={status === 'loading'}
                style={{ opacity: status === 'loading' ? 0.7 : 1, cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
              >
                {status === 'loading' ? 'Sending…' : 'Send Message →'}
              </button>
              {status === 'error' && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#ef4444' }}>{responseMsg}</span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const SKILLS: Record<string, string[]> = {
  'Frontend': ['React 18+', 'TypeScript (Strict)', 'Next.js', 'React Native', 'Expo', 'NestJS', 'TanStack Start'],
  'Design Systems': ['Storybook 8+', 'Chromatic', 'Chakra UI', 'shadcn/ui', 'Ark UI', 'Radix UI', 'Tamagui', 'gluestack-ui'],
  'AI & MCP': ['Model Context Protocol', 'Claude API', 'Claude Code', 'Cursor AI', 'Figma MCP', 'forgekit-figma-mcp', 'forgekit-storybook-mcp'],
  'Monorepo / CI': ['Nx', 'Nx Agents', 'Turborepo', 'pnpm', 'Module Federation', 'GitHub Actions', 'Vercel'],
  'State / Data': ['TanStack Query', 'Zustand', 'Redux', 'Supabase', 'PostgreSQL', 'Firebase', 'gRPC'],
  'Testing': ['Vitest', 'Playwright', 'Jest', 'Storybook a11y', 'Chromatic VR', 'React Testing Library'],
};

const IMPACT_METRICS = [
  { num: '15+', label: 'Years Engineering' },
  { num: '5,703+', label: 'ForgeKit npm Installs' },
  { num: '200+', label: 'Component UI Library' },
  { num: '$400K', label: 'Monthly Revenue Lifted (NARS)' },
];

export function Portfolio() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [projRes, testRes] = await Promise.all([
          axios.get('/api/taskade/projects/RBS7UKDqLhPJnwzq/nodes'),
          axios.get('/api/taskade/projects/FetNZLqBgCe6HU1a/nodes'),
        ]);
        const rawProj = projRes.data?.payload?.nodes || [];
        setProjects(rawProj.filter((n: any) => n.parentId === null).map((n: any) => ({
          id: n.id,
          title: n.fieldValues['/text'] || '',
          client: n.fieldValues['/attributes/@proj1'] || '',
          role: n.fieldValues['/attributes/@proj2'] || '',
          category: n.fieldValues['/attributes/@proj3'] || '',
          description: n.fieldValues['/attributes/@proj9'] || '',
          tags: n.fieldValues['/attributes/@proj8'] || '',
          status: n.fieldValues['/attributes/@proj5'] || '',
          liveUrl: n.fieldValues['/attributes/@proj4'] || '',
        })));
        const rawTest = testRes.data?.payload?.nodes || [];
        setTestimonials(rawTest.filter((n: any) => n.parentId === null).map((n: any) => ({
          id: n.id,
          name: n.fieldValues['/attributes/@test1'] || '',
          company: n.fieldValues['/attributes/@test2'] || '',
          role: n.fieldValues['/attributes/@test3'] || '',
          quote: n.fieldValues['/attributes/@test4'] || '',
          rating: n.fieldValues['/attributes/@test5'] || '',
          project: n.fieldValues['/attributes/@test6'] || '',
          featured: n.fieldValues['/attributes/@test8'] || '',
        })));
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div style={{ position: 'relative', zIndex: 1 }}>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 48px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Ambient glow */}
        <div style={{
          position: 'absolute',
          top: '5%',
          right: '-5%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(212,137,26,0.05) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, transparent 65%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        {/* Side label */}
        <div className="animate-fade-in" style={{
          position: 'absolute',
          top: '110px',
          right: '48px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--ivory-ghost)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          writingMode: 'vertical-rl',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ display: 'block', width: '1px', height: '70px', background: 'var(--mist-2)' }} />
          Atlanta, GA
        </div>

        {/* Location / availability pill */}
        <div className="animate-fade-in delay-200" style={{
          position: 'absolute',
          top: '100px',
          left: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          border: '1px solid rgba(16,185,129,0.25)',
          borderRadius: '100px',
          background: 'rgba(16,185,129,0.05)',
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'amberpulse 2s ease-in-out infinite' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#10b981', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Open to Work
          </span>
        </div>

        <div style={{ maxWidth: '1100px' }}>
          <div className="animate-fade-up" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="section-number">Principal Frontend Engineer</span>
            <span style={{ width: '24px', height: '1px', background: 'var(--amber-dim)' }} />
            <span className="section-number">Engineering Director</span>
          </div>

          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(4rem, 10vw, 9rem)',
            fontWeight: 900,
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            color: 'var(--ivory)',
            marginBottom: '32px',
          }}>
            Rich<br />
            <span style={{
              fontStyle: 'italic',
              WebkitTextStroke: '1px rgba(212,137,26,0.6)',
              color: 'transparent',
            }}>
              Tillman.
            </span>
          </h1>

          <div className="animate-fade-up delay-200" style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '60px',
            flexWrap: 'wrap',
          }}>
            <div style={{ maxWidth: '420px' }}>
              <p style={{ fontSize: '0.92rem', color: 'var(--ivory-ghost)', lineHeight: 1.75 }}>
                15+ years building production-grade React systems, design systems, and AI-native developer tooling. Creator of ForgeKit — MCP servers with 5,703+ npm installs bridging Figma to production React. Double-promoted to Engineering Director at Redesign Health.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '22px', flexWrap: 'wrap', alignItems: 'center' }}>
                <a href="https://forgekit.cloud" target="_blank" rel="noreferrer" className="btn-amber">
                  forgekit.cloud ↗
                </a>
                <a href="#contact" className="btn-ghost">
                  Get in Touch
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
              {IMPACT_METRICS.map(({ num, label }) => (
                <div key={label}>
                  <div style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                    fontWeight: 700,
                    color: 'var(--ivory)',
                    lineHeight: 1,
                  }}>
                    {num}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--ivory-ghost)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginTop: '5px',
                    maxWidth: '100px',
                    lineHeight: 1.4,
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE ─── */}
      <MarqueeBar />

      {/* ─── PROJECTS ─── */}
      <section style={{ padding: '100px 48px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '56px',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <div>
            <span className="section-number">01 / Selected Work</span>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              color: 'var(--ivory)',
              marginTop: '10px',
              lineHeight: 1.1,
            }}>
              Projects & systems<br />
              <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>built to last.</span>
            </h2>
          </div>
          <a
            href="https://linkedin.com/in/effinrich"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--ivory-ghost)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: '1px solid var(--mist-2)',
              paddingBottom: '2px',
              transition: 'color 0.2s',
            }}
          >
            Full history on LinkedIn ↗
          </a>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ height: i % 3 === 0 ? '400px' : '320px', background: 'var(--obsidian-3)', borderRadius: '2px', border: '1px solid rgba(242,237,228,0.04)' }} />
            ))}
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
            gap: '16px',
          }}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} gradient={PROJECT_GRADIENTS[i % PROJECT_GRADIENTS.length]} />
            ))}
          </div>
        )}
      </section>

      {/* ─── ABOUT / PHILOSOPHY ─── */}
      <section style={{
        padding: '100px 48px',
        background: 'var(--obsidian-2)',
        borderTop: '1px solid rgba(242,237,228,0.05)',
        borderBottom: '1px solid rgba(242,237,228,0.05)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '80px', alignItems: 'start' }}>
          <div>
            <span className="section-number">02 / About</span>
            <h2 style={{
              fontFamily: 'var(--font-editorial)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700,
              color: 'var(--ivory)',
              marginTop: '14px',
              lineHeight: 1.2,
              marginBottom: '28px',
            }}>
              Engineering craft<br />
              <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>at the edge of AI.</span>
            </h2>

            {/* Experience timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                { co: 'ForgeKit', role: 'Founder & Principal Engineer', yr: '2026–Present', color: 'var(--amber)' },
                { co: 'Verizon', role: 'Principal Engineer', yr: '2024–2025', color: '#3b82f6' },
                { co: 'Redesign Health', role: 'Engineering Director', yr: '2022–2024', color: '#10b981' },
                { co: 'Pineapple Corp', role: 'Senior FE & Tech Lead', yr: '2022', color: '#6366f1' },
                { co: 'PHC Global', role: 'Founding FE Engineer', yr: '2021–2022', color: '#ec4899' },
                { co: 'Freebird', role: 'Lead Frontend Engineer', yr: '2016–2021', color: 'var(--amber)' },
                { co: 'FaceCake', role: 'Lead Web Developer', yr: '2010–2016', color: '#3b82f6' },
              ].map(({ co, role, yr, color }) => (
                <div key={co} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '12px',
                  padding: '14px 0',
                  borderBottom: '1px solid var(--mist)',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.88rem', color: 'var(--ivory)', fontWeight: 500 }}>{co}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--ivory-ghost)', letterSpacing: '0.05em', marginLeft: '12px', marginTop: '2px' }}>
                      {role}
                    </div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--ivory-ghost)', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    {yr}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.92rem', color: 'var(--ivory-ghost)', lineHeight: 1.8, marginBottom: '24px' }}>
              I've spent 15 years at the frontier of frontend engineering — from building one of the earliest Storybook-backed UI libraries in 2016, to creating the first publicly available MCP servers for Figma-to-React design system workflows in 2025.
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--ivory-ghost)', lineHeight: 1.8, marginBottom: '40px' }}>
              I'm a player-coach: I set architectural direction, train engineers, drive delivery — and I also write the code. At Redesign Health I was double-promoted to Engineering Director managing 3 cross-functional teams of 15+, while also shipping a 50-component design system that cut org-wide dev time by 30%.
            </p>

            {/* Skills matrix */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(SKILLS).map(([cat, skills]) => (
                <div key={cat}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    color: 'var(--amber)',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    {cat}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {skills.map(s => <SkillPill key={s} label={s} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: '100px 48px', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '56px' }}>
          <span className="section-number">03 / What Colleagues Say</span>
          <h2 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            color: 'var(--ivory)',
            marginTop: '10px',
          }}>
            In their words.
          </h2>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(i => <div key={i} style={{ height: '260px', background: 'var(--mist)', borderRadius: '2px' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))', gap: '20px' }}>
            {testimonials.map((t, i) => <TestimonialCard key={t.id} testimonial={t} index={i} />)}
          </div>
        )}
      </section>

      {/* ─── CONTACT ─── */}
      <section style={{
        padding: '100px 48px',
        background: 'var(--obsidian-2)',
        borderTop: '1px solid rgba(242,237,228,0.05)',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <ContactForm />
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer style={{
        padding: '28px 48px',
        borderTop: '1px solid rgba(242,237,228,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--ivory-ghost)', letterSpacing: '0.08em' }}>
          Rich Tillman · richtillman@pm.me · 843-834-0041
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {[
            { label: 'LinkedIn', href: 'https://linkedin.com/in/effinrich' },
            { label: 'ForgeKit', href: 'https://forgekit.cloud' },
            { label: 'npm', href: 'https://npmjs.com/~effinrich' },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--ivory-ghost)',
              textDecoration: 'none',
              letterSpacing: '0.08em',
              transition: 'color 0.2s',
            }}
              onMouseOver={e => (e.target as HTMLAnchorElement).style.color = 'var(--amber)'}
              onMouseOut={e => (e.target as HTMLAnchorElement).style.color = 'var(--ivory-ghost)'}
            >
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
