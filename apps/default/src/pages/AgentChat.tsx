import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { createConversation, createAgentChat } from '@/lib/agent-chat/v2';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { Message, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from '@/components/ai-elements/confirmation';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from '@/components/ai-elements/prompt-input';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { isToolUIPart } from 'ai';
import type { UIMessage } from 'ai';
import { ulid } from 'ulidx';

const AGENT_ID = '01KNY9VMMRC89WD1CGW5WMXNY9';

const STARTERS = [
  { title: 'What is ForgeKit?', prompt: 'Tell me about ForgeKit — what it is, why Rich built it, and what the 5,703+ npm installs actually mean.' },
  { title: 'Design systems depth', prompt: "Walk me through Rich's design systems work — the scale, the results, and his approach." },
  { title: 'Leadership story', prompt: 'Tell me about Rich as an engineering leader — how he was promoted to Engineering Director and what that looked like in practice.' },
  { title: 'Is Rich a fit?', prompt: "I'm hiring for a Staff/Principal Frontend Engineer or Engineering Director. Help me evaluate whether Rich Tillman is a good match." },
];

type AgentChatInstance = ReturnType<typeof createAgentChat>;

function MessageParts({
  message,
  onApprove,
}: {
  message: UIMessage;
  onApprove: ReturnType<typeof useChat>['addToolApprovalResponse'];
}) {
  return (
    <>
      {message.parts.map((part, i) => {
        const key = `${message.id}-${i}`;

        if (part.type === 'text') {
          return message.role === 'user' ? (
            <p key={key} style={{ margin: 0, lineHeight: 1.6, fontSize: '0.9rem' }}>
              {part.text}
            </p>
          ) : (
            <MessageResponse key={key}>{part.text}</MessageResponse>
          );
        }

        if (isToolUIPart(part)) {
          return (
            <Tool key={key}>
              <ToolHeader type={part.type} state={part.state} />
              <ToolContent>
                <ToolInput input={part.input} />
                <Confirmation approval={part.approval} state={part.state}>
                  <ConfirmationRequest>
                    <ConfirmationTitle>Allow this tool to run?</ConfirmationTitle>
                  </ConfirmationRequest>
                  <ConfirmationAccepted>Approved</ConfirmationAccepted>
                  <ConfirmationRejected>Rejected</ConfirmationRejected>
                  <ConfirmationActions>
                    <ConfirmationAction
                      variant="outline"
                      onClick={() =>
                        part.approval != null && onApprove({ id: part.approval.id, approved: false })
                      }
                    >
                      Deny
                    </ConfirmationAction>
                    <ConfirmationAction
                      onClick={() =>
                        part.approval != null && onApprove({ id: part.approval.id, approved: true })
                      }
                    >
                      Approve
                    </ConfirmationAction>
                  </ConfirmationActions>
                </Confirmation>
                <ToolOutput output={part.output} errorText={part.errorText} />
              </ToolContent>
            </Tool>
          );
        }

        return null;
      })}
    </>
  );
}

function ActiveChat({ chat }: { chat: AgentChatInstance }) {
  const { messages, status, addToolApprovalResponse } = useChat({ chat, id: chat.id });
  const isSending = status === 'submitted' || status === 'streaming';
  const hasMessages = messages.length > 0;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    await chat.sendMessage({
      id: ulid(),
      role: 'user',
      parts: [{ type: 'text', text }],
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Conversation>
        <ConversationContent>
          {messages.map((msg) => (
            <Message key={msg.id} from={msg.role}>
              <MessageContent>
                <MessageParts message={msg} onApprove={addToolApprovalResponse} />
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {!hasMessages && (
        <div style={{ padding: '0 20px 16px' }}>
          <Suggestions>
            {STARTERS.map(s => (
              <Suggestion key={s.title} suggestion={s.prompt} onClick={handleSend}>
                {s.title}
              </Suggestion>
            ))}
          </Suggestions>
        </div>
      )}

      <div style={{ padding: '0 0 4px' }}>
        <PromptInput onSubmit={({ text }) => handleSend(text)}>
          <PromptInputTextarea placeholder="Ask about the portfolio, process, or fit..." />
          <PromptInputFooter>
            <PromptInputSubmit status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function ChatStarter({ onStart, loading }: { onStart: () => void; loading: boolean }) {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(212, 137, 26, 0.2), rgba(155, 74, 30, 0.15))',
        border: '1px solid rgba(212, 137, 26, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        animation: 'amberpulse 2s ease-in-out infinite',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7a7 7 0 0 1-7-7 7 7 0 0 1 7-7zm0 2a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5zm-1 9v2h2v-2h-2zm0-8v6h2V5h-2z" fill="var(--amber)" />
        </svg>
      </div>
      <h3 style={{
        fontFamily: 'var(--font-editorial)',
        fontSize: '1.4rem',
        fontWeight: 700,
        color: '#f2ede4',
        marginBottom: '10px',
      }}>
        Portfolio Narrator
      </h3>
      <p style={{
        fontSize: '0.82rem',
        color: '#c8c0b2',
        lineHeight: 1.7,
        maxWidth: '280px',
        marginBottom: '28px',
      }}>
        Trained on Rich's full career. Ask about ForgeKit, design systems, leadership — or whether he's a fit for your role.
      </p>
      <button
        className="btn-amber"
        onClick={onStart}
        disabled={loading}
        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Connecting…' : 'Start Conversation →'}
      </button>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '320px' }}>
        {STARTERS.map(s => (
          <button
            key={s.title}
            onClick={() => onStart()}
            style={{
              padding: '10px 14px',
              border: '1px solid rgba(212, 137, 26, 0.15)',
              borderRadius: '2px',
              cursor: 'pointer',
              fontSize: '0.75rem',
              color: '#c8c0b2',
              textAlign: 'left',
              background: 'rgba(212, 137, 26, 0.05)',
              width: '100%',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212, 137, 26, 0.4)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212, 137, 26, 0.1)';
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212, 137, 26, 0.15)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212, 137, 26, 0.05)';
            }}
          >
            <span style={{ color: '#d4891a', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', display: 'block', marginBottom: '2px', letterSpacing: '0.06em' }}>
              {s.title}
            </span>
            <span style={{ lineHeight: 1.4, color: '#c8c0b2' }}>
              {s.prompt.length > 70 ? s.prompt.slice(0, 70) + '…' : s.prompt}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AgentChat() {
  const [chat, setChat] = useState<AgentChatInstance | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      const { conversationId } = await createConversation(AGENT_ID);
      setChat(createAgentChat(AGENT_ID, conversationId));
    } catch (err) {
      setError('Failed to connect. Please try again.');
    } finally {
      setStarting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '80px',
      display: 'grid',
      gridTemplateColumns: '1fr 480px',
    }}>
      {/* Left panel — info */}
      <div style={{
        padding: '80px 60px',
        borderRight: '1px solid rgba(242, 237, 228, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative element */}
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-20%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(212, 137, 26, 0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
        }} />

        <div>
          <div className="animate-fade-up" style={{ marginBottom: '16px' }}>
            <span className="section-number">AI Portfolio Guide</span>
          </div>
          <h1 className="animate-fade-up delay-100" style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 900,
            color: 'var(--ivory)',
            lineHeight: 1.0,
            letterSpacing: '-0.03em',
            marginBottom: '28px',
          }}>
            Ask the<br />
            <span style={{ fontStyle: 'italic', color: 'var(--amber)' }}>Narrator.</span>
          </h1>
          <p className="animate-fade-up delay-200" style={{
            fontSize: '0.9rem',
            color: 'var(--ivory-ghost)',
            lineHeight: 1.7,
            maxWidth: '440px',
            marginBottom: '48px',
          }}>
            An AI trained on Rich's full career — every case study, every metric, every technical decision. Ask it anything: ForgeKit, design systems, leadership, or whether Rich is a good fit for your role.
          </p>

          {/* Knowledge sources */}
          <div className="animate-fade-up delay-300" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--ivory-ghost)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}>
              Narrator knows:
            </div>
            {[
              { icon: '◆', label: 'ForgeKit MCP — architecture & impact (5,703+ installs)' },
              { icon: '◆', label: 'Design systems at scale — 200+ and 50+ component libraries' },
              { icon: '◆', label: 'Engineering Director experience — 15+ engineers, 3 teams' },
              { icon: '◆', label: 'Real metrics — $400K/mo AR revenue, 30% dev time reduction, 40% rendering lift' },
              { icon: '◆', label: 'Tech stack depth — React, Storybook, Nx, MCP, AI tooling' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: 'var(--amber)', fontSize: '0.5rem', marginTop: '6px', flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--ivory-dim)', lineHeight: 1.5 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom meta */}
        <div className="animate-fade-up delay-400" style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--ivory-ghost)',
          letterSpacing: '0.08em',
          paddingTop: '40px',
          borderTop: '1px solid var(--mist)',
        }}>
          Rich Tillman · Portfolio Narrator · Powered by Taskade AI
        </div>
      </div>

      {/* Right panel — chat */}
      <div style={{
        background: '#181614',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
        borderLeft: '1px solid rgba(212, 137, 26, 0.12)',
      }}>
        {/* Chat header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(212, 137, 26, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexShrink: 0,
          background: '#141210',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: chat ? 'var(--amber)' : 'var(--ivory-ghost)',
            animation: chat ? 'amberpulse 2s ease-in-out infinite' : 'none',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: chat ? 'var(--ivory-dim)' : 'var(--ivory-ghost)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {chat ? 'Narrator · Active' : 'Narrator · Ready'}
          </span>
        </div>

        {/* Chat body */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {chat ? (
            <ActiveChat chat={chat} />
          ) : (
            <ChatStarter onStart={handleStart} loading={starting} />
          )}
          {error && (
            <div style={{
              margin: '12px 20px',
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: '#ef4444',
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
