import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import './App.css';



const API_ENDPOINT = '/api/chat'

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll automático sempre que messages mudar
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Loga montagem do componente para debug
  useEffect(() => {
    console.log('App montado');
    return () => {
      console.log('App desmontado');
    };
  }, []);



  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);
    
    // Scroll para a mensagem do usuário
    setTimeout(() => scrollToBottom(), 100);
    

    // Se for "fim de chat", não espera resposta
    if (currentMessage.toLowerCase().trim() === "fim de chat") {
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: 'Conversa finalizada e resumida com sucesso!',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      
      // Scroll para mensagem de fim de chat
      setTimeout(() => scrollToBottom(), 100);
      return;
    }

    try {
      console.log('Enviando mensagem para:', API_ENDPOINT);
      console.log('Corpo da requisição:', { message: currentMessage });
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage
        })
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na resposta da API:', response.status, errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      // Tenta primeiro como JSON, se falhar trata como texto
      let responseData;
      try {
        responseData = await response.json();
        console.log('Dados recebidos (JSON):', responseData);
        
        // Se for um objeto com campo 'resposta', extrai o conteúdo
        if (typeof responseData === 'object' && responseData !== null) {
          if (responseData.resposta) {
            responseData = responseData.resposta;
          } else if (responseData.message) {
            responseData = responseData.message;
          } else if (responseData.response) {
            responseData = responseData.response;
          } else {
            // Se não tiver campos conhecidos, converte para string
            responseData = JSON.stringify(responseData);
          }
        }
      } catch (jsonError) {
        // Se não for JSON, lê como texto
        responseData = await response.text();
        console.log('Dados recebidos (texto):', responseData);
      }
      
      // Garante que seja uma string
      const messageContent = typeof responseData === 'string' 
        ? responseData 
        : String(responseData || 'Desculpe, não consegui processar sua mensagem.');
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: messageContent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Scroll para a resposta do bot
      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: `Erro: ${error.message}. Verifique o console para mais detalhes.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Scroll para mensagem de erro
      setTimeout(() => scrollToBottom(), 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const MessageComponent = ({ message }) => {
    const isUser = message.type === 'user';
    
    return (
      <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
        <div className="message-avatar">
          {isUser ? <User size={20} /> : <Bot size={20} />}
        </div>
        <div className="message-content">
          <div className="message-header">
            <span className="message-sender">
              {isUser ? 'Você' : 'Mind'}
            </span>
            <span className="message-time">
              {message.timestamp.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
          <div className="message-text">
            {isUser ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : 'text';
                    
                    return !inline ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={language}
                        PreTag="div"
                        showLineNumbers={false}
                        wrapLines={true}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code 
                        className={className} 
                        style={{
                          background: 'rgba(0,0,0,0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                          fontSize: '0.9em'
                        }}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre: ({ children }) => (
                    <pre style={{ 
                      margin: '12px 0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {children}
                    </pre>
                  ),
                  h1: ({ children }) => <h1 className="markdown-h1">{children}</h1>,
                  h2: ({ children }) => <h2 className="markdown-h2">{children}</h2>,
                  h3: ({ children }) => <h3 className="markdown-h3">{children}</h3>,
                  h4: ({ children }) => <h4 className="markdown-h4">{children}</h4>,
                  h5: ({ children }) => <h5 className="markdown-h5">{children}</h5>,
                  h6: ({ children }) => <h6 className="markdown-h6">{children}</h6>,
                  ul: ({ children }) => <ul className="markdown-ul">{children}</ul>,
                  ol: ({ children }) => <ol className="markdown-ol">{children}</ol>,
                  li: ({ children }) => <li className="markdown-li">{children}</li>,
                  p: ({ children }) => <p className="markdown-p">{children}</p>,
                  strong: ({ children }) => <strong className="markdown-strong">{children}</strong>,
                  em: ({ children }) => <em className="markdown-em">{children}</em>,
                  blockquote: ({ children }) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                  a: ({ children, href }) => <a href={href} className="markdown-link" target="_blank" rel="noopener noreferrer">{children}</a>,
                  table: ({ children }) => (
                    <div style={{ overflowX: 'auto', margin: '12px 0' }}>
                      <table style={{ 
                        width: '100%', 
                        borderCollapse: 'collapse',
                        border: '1px solid #ddd'
                      }}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd',
                      fontWeight: 'bold'
                    }}>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td style={{ 
                      padding: '8px 12px', 
                      border: '1px solid #ddd'
                    }}>
                      {children}
                    </td>
                  )
                }}
              >
                {String(message.content || '')}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Mind</h1>
          <p>Assistente de IA para desenvolvimento</p>
        </div>
        
        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-message">
              <Bot size={48} />
              <h2>Olá! Como posso ajudá-lo hoje?</h2>
              <p>Faça perguntas sobre desenvolvimento, programação ou qualquer outro tópico.</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="message bot-message">
              <div className="message-avatar">
                <Bot size={20} />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">Mind</span>
                </div>
                <div className="message-text">
                  <div className="loading-indicator">
                    <Loader2 size={16} className="spinning" />
                    <span>Pensando...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem aqui... (Enter para enviar, Shift+Enter para nova linha)"
              disabled={isLoading}
              rows={1}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-button"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
