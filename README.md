# UI Agent Mind - Chatbot Interface

Uma interface de chatbot moderna e responsiva construída com React.js, com formatação avançada para mensagens, códigos e markdown.

## 🚀 Características

- **Interface Responsiva**: Funciona perfeitamente em desktop, tablet e mobile
- **Formatação Avançada**: Suporte completo para Markdown, códigos com syntax highlighting, listas, tópicos
- **Design Moderno**: Interface limpa e intuitiva com gradientes e animações
- **Integração com API**: Conecta com endpoint `http://localhost:3000/api/chat`
- **Tempo Real**: Indicador de carregamento e scroll automático
- **Acessibilidade**: Suporte a teclado e leitores de tela

## 📦 Instalação

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

3. **Abrir no navegador:**
   ```
   http://localhost:3000
   ```

## 🔧 Configuração da API

O chatbot está configurado para consumir a API no endpoint:
```
POST http://localhost:3000/api/chat
```

### Formato da requisição:
```json
{
  "message": "Sua mensagem aqui",
  "history": [array de mensagens anteriores]
}
```

### Formato da resposta esperada:
```json
{
  "message": "Resposta do assistente",
  "response": "Resposta alternativa"
}
```

## 🎨 Funcionalidades

### Formatação de Mensagens
- **Markdown completo**: Títulos, listas, links, formatação de texto
- **Syntax Highlighting**: Códigos com destaque de sintaxe em múltiplas linguagens
- **Tópicos e listas**: Suporte para listas ordenadas e não ordenadas
- **Citações**: Blocos de citação estilizados
- **Links**: Links clicáveis que abrem em nova aba

### Interface
- **Mensagens separadas**: Visual distinto para usuário e assistente
- **Avatares**: Ícones diferenciados para cada tipo de mensagem
- **Timestamps**: Horário de cada mensagem
- **Scroll automático**: Rola automaticamente para a última mensagem
- **Loading state**: Indicador visual durante processamento

### Responsividade
- **Mobile First**: Otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para diferentes tamanhos de tela
- **Touch Friendly**: Botões e áreas de toque otimizadas

## 🛠️ Tecnologias Utilizadas

- **React 18**: Biblioteca principal
- **React Markdown**: Renderização de Markdown
- **React Syntax Highlighter**: Destaque de sintaxe para códigos
- **Lucide React**: Ícones modernos
- **CSS3**: Estilos responsivos e animações

## 📱 Compatibilidade

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Dispositivos móveis (iOS 12+, Android 8+)

## 🎯 Uso

1. Digite sua mensagem no campo de entrada
2. Pressione Enter para enviar ou Shift+Enter para nova linha
3. Aguarde a resposta do assistente
4. As mensagens são formatadas automaticamente

## 🔄 Desenvolvimento

Para modificar o endpoint da API, edite a constante `API_ENDPOINT` no arquivo `src/App.js`:

```javascript
const API_ENDPOINT = 'http://localhost:3000/api/chat';
```

## 📄 Licença

Este projeto está sob a licença MIT.
