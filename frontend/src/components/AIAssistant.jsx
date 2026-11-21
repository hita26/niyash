import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, X, Send, Bot, RefreshCw, ShoppingBag, 
  ChevronDown, ArrowRight, Check, AlertCircle, Info, Package
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function AIAssistant({ addToCart }) {
  const { t } = useLanguage();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: t('aiAssistant.welcome', 'Hello! I am **Niyansh AI**, your pharmaceutical & stock assistant.\n\nAsk me about medicine availability, active generic compositions (salts), packing, or wholesale pricing!'),
      timestamp: new Date(),
      suggestedProducts: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.body.classList.contains('standalone-pwa')
  );

  // Quick suggestion chips
  const quickChips = [
    t('aiAssistant.chip1', 'Amoxyclav 625 stock?'),
    t('aiAssistant.chip2', 'Find Paracetamol formulations'),
    t('aiAssistant.chip3', 'Antibiotics in stock'),
    t('aiAssistant.chip4', 'How to place bulk order?'),
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare message history for context
      const history = messages
        .filter((m) => m.id !== 'welcome-1')
        .slice(-6)
        .map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const aiMsg = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Here is the information from our catalog.',
        suggestedProducts: data.suggestedProducts || [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          sender: 'assistant',
          text: 'I am momentarily having trouble connecting to the catalog server. Please try again or search directly in the Products section.',
          timestamp: new Date(),
          suggestedProducts: [],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddToCart = (product) => {
    if (typeof addToCart === 'function') {
      const added = addToCart(product, 1);
      if (added === false) return;
      setAddedItemIds((prev) => ({ ...prev, [product._id]: true }));
      setTimeout(() => {
        setAddedItemIds((prev) => ({ ...prev, [product._id]: false }));
      }, 2500);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist you with your medicine requirements today?',
        timestamp: new Date(),
        suggestedProducts: [],
      },
    ]);
  };

  // Basic markdown parser for bold, lists, and linebreaks
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, idx) => {
      // Bold text replacement
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const renderedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} style={{ fontWeight: 600 }}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: '6px', margin: '4px 0', alignItems: 'flex-start' }}>
            <span style={{ color: '#1b75bc', fontWeight: 'bold' }}>•</span>
            <span>{renderedParts}</span>
          </div>
        );
      }

      return (
        <span key={idx} style={{ display: 'block', minHeight: line === '' ? '8px' : 'auto', margin: '2px 0' }}>
          {renderedParts}
        </span>
      );
    });
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Niyansh AI Assistant"
          className="ai-chat-trigger"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9995,
            background: 'linear-gradient(135deg, #0c3d6c 0%, #1b75bc 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50px',
            padding: '12px 20px',
            boxShadow: '0 8px 25px rgba(12, 61, 108, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            letterSpacing: '0.3px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(12, 61, 108, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(12, 61, 108, 0.35)';
          }}
        >
          <span className="b2b-pulse-ring" style={{ borderRadius: '50px', borderColor: 'rgba(56, 189, 248, 0.5)' }} />
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Sparkles size={18} style={{ color: '#38bdf8' }} />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              backgroundColor: '#4ade80',
              borderRadius: '50%',
              border: '2px solid #0c3d6c',
            }} />
          </div>
          <span className="ai-chat-label">{t('aiAssistant.title', 'Ask Niyansh AI')}</span>
        </button>
      )}

      {/* Responsive styles for floating button on mobile - compact FAB so it never covers content */}
      <style>{`
        @media (max-width: 768px) {
          .ai-chat-trigger {
            width: 48px !important;
            height: 48px !important;
            min-width: 48px !important;
            padding: 0 !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            bottom: ${isAdmin ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : (isStandalone ? 'calc(76px + env(safe-area-inset-bottom, 0px))' : 'calc(16px + env(safe-area-inset-bottom, 0px))')} !important;
            right: max(14px, env(safe-area-inset-right, 14px)) !important;
            box-shadow: 0 4px 18px rgba(12, 61, 108, 0.45) !important;
          }
          .ai-chat-trigger .ai-chat-label {
            display: none !important;
          }
          .ai-chat-window {
            bottom: ${isAdmin ? 'calc(16px + env(safe-area-inset-bottom, 0px))' : (isStandalone ? 'calc(76px + env(safe-area-inset-bottom, 0px))' : 'calc(16px + env(safe-area-inset-bottom, 0px))')} !important;
            right: max(10px, env(safe-area-inset-right, 10px)) !important;
            left: max(10px, env(safe-area-inset-left, 10px)) !important;
            width: auto !important;
            max-width: none !important;
            height: min(75vh, 75dvh) !important;
            max-height: 560px !important;
          }
        }
      `}</style>

      {/* Main Chat Window */}
      {isOpen && (
        <div
          className="ai-chat-window"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '390px',
            maxWidth: 'calc(100vw - 32px)',
            height: '580px',
            maxHeight: 'calc(100vh - 100px)',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(12, 61, 108, 0.22), 0 0 0 1px rgba(12, 61, 108, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10000,
            overflow: 'hidden',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            animation: 'aiModalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0c3d6c 0%, #164e63 100%)',
              color: '#ffffff',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Bot size={20} style={{ color: '#38bdf8' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, letterSpacing: '0.2px' }}>
                    {t('aiAssistant.title', 'Niyansh AI')}
                  </h3>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '10px',
                      backgroundColor: 'rgba(74, 222, 128, 0.2)',
                      color: '#4ade80',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                    {t('aiAssistant.online', 'Online')}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '11px', color: '#cbd5e1' }}>
                  {t('aiAssistant.subtitle', 'Wholesale Medicine & Stock Assistant')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={resetChat}
                title="Clear Chat"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <RefreshCw size={15} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              backgroundColor: '#f8fafc',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: msg.sender === 'user' ? '#0c3d6c' : '#ffffff',
                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                    fontSize: '13px',
                    lineHeight: '1.5',
                    boxShadow: msg.sender === 'user' ? '0 2px 8px rgba(12, 61, 108, 0.2)' : '0 2px 6px rgba(0, 0, 0, 0.05)',
                    border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                    wordBreak: 'break-word',
                  }}
                >
                  {formatText(msg.text)}
                </div>

                {/* Suggested Products mini-cards inside Assistant message */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Package size={12} />
                      {t('aiAssistant.matchingProducts', 'Matching Catalog Products:')}
                    </div>
                    {msg.suggestedProducts.map((prod) => (
                      <div
                        key={prod._id || prod.name}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '12px', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {prod.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                            <span>{prod.brand || prod.company}</span>
                            <span>•</span>
                            <span>{prod.packing || prod.form || 'Item'}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <span style={{ fontWeight: 700, fontSize: '12px', color: '#0c3d6c' }}>
                              ₹{prod.price || prod.mrp || 0}
                            </span>
                            <span
                              style={{
                                fontSize: '10px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: prod.inStock ? '#dcfce7' : '#fee2e2',
                                color: prod.inStock ? '#15803d' : '#b91c1c',
                                fontWeight: 600,
                              }}
                            >
                              {prod.inStock ? t('products.inStock', 'In Stock') : t('products.outOfStock', 'Out of Stock')}
                            </span>
                          </div>
                        </div>

                        {addToCart && (
                          <button
                            onClick={() => handleAddToCart(prod)}
                            disabled={!prod.inStock}
                            style={{
                              backgroundColor: addedItemIds[prod._id] ? '#15803d' : '#0c3d6c',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: prod.inStock ? 'pointer' : 'not-allowed',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              opacity: prod.inStock ? 1 : 0.6,
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {addedItemIds[prod._id] ? (
                              <>
                                <Check size={12} />
                                {t('aiAssistant.added', 'Added')}
                              </>
                            ) : (
                              <>
                                <ShoppingBag size={12} />
                                {t('aiAssistant.addCart', '+ Cart')}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <span style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', padding: '0 4px' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px' }}>
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Sparkles size={14} className="animate-spin" style={{ color: '#0c3d6c' }} />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{t('aiAssistant.consulting', 'Consulting pharma catalog...')}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
            }}
          >
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                style={{
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  color: '#334155',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#e2e8f0';
                  e.currentTarget.style.color = '#0c3d6c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.color = '#334155';
                }}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('aiAssistant.inputPlaceholder', 'Ask about medicines, stock, compositions...')}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  fontSize: '13px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#0c3d6c')}
                onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send Message"
                style={{
                  backgroundColor: inputMessage.trim() && !isLoading ? '#0c3d6c' : '#cbd5e1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: inputMessage.trim() && !isLoading ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                }}
              >
                <Send size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Info size={10} style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                {t('aiAssistant.disclaimer', 'For licensed B2B wholesale enquiries. Not direct consumer medical advice.')}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
