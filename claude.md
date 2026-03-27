# Site Institucional — Escritório de Contabilidade

## Visão Geral

Você está construindo um site institucional multi-página para um escritório de contabilidade premium localizado em Blumenau, SC. O site deve transmitir confiança, profissionalismo e sofisticação, com uma estética premium (paleta roxa/cinza) e interatividade moderna.

**Referência visual e estrutural:** https://modelo26.ondatta.com.br/  
**Stack:** HTML5 + CSS3 + JavaScript puro (vanilla). Sem frameworks. Desenvolvido no VSCode com Live Server.  
**Blog/Notícias:** Conteúdo dinâmico via WordPress headless (REST API).  
**Sem área de cliente.** Não implementar login ou portal de acesso.

## Modo de Trabalho

**Trabalhe de forma autônoma.** Não peça confirmação, aprovação ou permissão para prosseguir entre etapas. Ao receber uma tarefa (ex: "crie a página inicial", "implemente o footer"), execute tudo de uma vez — crie arquivos, escreva o código completo, faça ajustes de responsividade e interatividade — e entregue o resultado final pronto. Se houver ambiguidade, tome a decisão que melhor se alinha com este documento e com a referência visual. Só pergunte quando houver uma informação que você genuinamente não consegue inferir (ex: número de telefone real, textos definitivos do cliente).

---

## Arquitetura: Site Estático + WordPress Headless

O site é 100% HTML/CSS/JS estático para máxima performance. O WordPress é usado **apenas como CMS** (painel de gestão) para Blog e Notícias — nenhum visitante acessa o WordPress diretamente.

### Como funciona

```
seudominio.com.br/              → Site estático (HTML/CSS/JS) — hospedado na Hostinger
seudominio.com.br/wp/           → WordPress (só painel admin) — mesma hospedagem
seudominio.com.br/wp/wp-json/   → REST API que o site consome via fetch()
```

### Fluxo de conteúdo

1. O usuário publica um post no painel WordPress (`/wp/wp-admin`)
2. A REST API expõe o post em `/wp/wp-json/wp/v2/posts`
3. As páginas `blog.html` e `noticias.html` fazem `fetch()` na API e renderizam os cards dinamicamente
4. A seção de "Atualidades" na home também puxa os últimos 4 posts via API

### Configuração do WordPress

O WordPress precisa ser configurado com:
- **Permalink** em "Nome do post" (Settings > Permalinks)
- **Duas categorias** criadas: `blog` e `noticias` — usadas para filtrar os posts na API
- **Plugin "Enable CORS"** ou snippet no `functions.php` para liberar requisições cross-origin (necessário apenas se o WP estiver em subdomínio separado)
- **Imagem destacada** habilitada nos posts (já vem por padrão)
- Tema pode ser qualquer um — ninguém verá o front-end do WordPress

### Variável de configuração

No arquivo `js/config.js`, definir a URL base da API para facilitar a manutenção:

```javascript
// js/config.js — Alterar para a URL real após instalar o WordPress
const CONFIG = {
  WP_API_URL: 'https://seudominio.com.br/wp/wp-json/wp/v2',
  POSTS_PER_PAGE: 9,
  POSTS_HOME: 4,
};
```

Todas as chamadas de API devem usar `CONFIG.WP_API_URL` como base.

---

## Estrutura de Páginas

O site possui **7 páginas** com layout consistente (header fixo + footer + WhatsApp flutuante):

```
/
├── index.html          → Página Inicial (Home)
├── sobre-nos.html      → Sobre Nós
├── servicos.html       → Serviços
├── abrir-empresa.html  → Abrir Empresa
├── blog.html           → Blog (listagem dinâmica via WP API)
├── noticias.html       → Notícias (listagem dinâmica via WP API)
├── post.html           → Página de post individual (carrega via query string ?slug=xxx)
├── contato.html        → Contato
├── css/
│   ├── global.css      → Reset, variáveis, tipografia, componentes globais
│   ├── header.css      → Navbar e menu mobile
│   ├── footer.css      → Footer completo
│   └── pages/
│       ├── home.css
│       ├── sobre.css
│       ├── servicos.css
│       ├── abrir-empresa.css
│       ├── blog.css        → Estilos para blog.html, noticias.html e post.html
│       └── contato.css
├── js/
│   ├── config.js       → URL da API WordPress e constantes
│   ├── main.js         → Menu mobile, scroll animations, contadores
│   ├── blog.js         → Fetch de posts da API, renderização de cards, paginação
│   ├── post.js         → Fetch de post individual por slug, renderização do conteúdo
│   └── form.js         → Validação de formulários
├── assets/
│   ├── images/         → Fotos, ícones SVG, decorativos
│   └── fonts/          → Se necessário (webfonts locais)
└── favicon.ico
```

---

## Design System

### Paleta de Cores (CSS Variables)

```css
:root {
  /* Cores principais — tom roxo premium */
  --color-primary: #6A0DAD;         /* Roxo principal */
  --color-primary-dark: #4A0878;    /* Roxo escuro (hover, gradientes) */
  --color-primary-light: #8B3FC7;   /* Roxo claro */
  
  /* Cinzas */
  --color-dark: #1A1A2E;            /* Quase preto — textos, fundos escuros */
  --color-gray-900: #2D2D44;
  --color-gray-700: #4A4A68;
  --color-gray-500: #7A7A96;
  --color-gray-300: #B8B8CC;
  --color-gray-100: #F0F0F5;
  --color-white: #FFFFFF;
  
  /* Acentos */
  --color-accent: #E8B931;          /* Dourado para CTAs de destaque */
  --color-success: #2ECC71;
  --color-whatsapp: #25D366;
  
  /* Gradientes */
  --gradient-hero: linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%);
  --gradient-section: linear-gradient(180deg, var(--color-gray-100) 0%, var(--color-white) 100%);
  
  /* Sombras */
  --shadow-card: 0 8px 30px rgba(106, 13, 173, 0.08);
  --shadow-card-hover: 0 12px 40px rgba(106, 13, 173, 0.15);
  --shadow-nav: 0 2px 20px rgba(0, 0, 0, 0.08);
  
  /* Tipografia */
  --font-heading: 'Playfair Display', Georgia, serif;
  --font-body: 'DM Sans', 'Segoe UI', sans-serif;
  
  /* Espaçamentos */
  --section-padding: 100px 0;
  --container-width: 1200px;
  --border-radius: 12px;
  --transition-default: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Tipografia

Carregar do Google Fonts:
- **Headings:** Playfair Display (400, 700) — sofisticada, serif clássica
- **Body:** DM Sans (400, 500, 700) — limpa, moderna, legível

Hierarquia:
- `h1`: 3.5rem (hero) / 2.8rem (páginas internas)
- `h2`: 2.2rem (títulos de seção)
- `h3`: 1.5rem (cards, subtítulos)
- `h4`: 1.1rem (subtítulos menores, labels de seção tipo "Nossos serviços")
- `p`: 1rem / line-height: 1.75
- Labels de seção (acima dos h2): texto pequeno, uppercase, letter-spacing: 3px, cor primária, peso 500

### Estética Premium — Regras Obrigatórias

1. **Sem estética genérica de IA.** Evitar gradientes roxos batidos sobre branco puro sem textura. Adicionar profundidade com sobreposições, padrões sutis, sombras em camadas.
2. **Elementos decorativos geométricos** — Círculos semi-transparentes, linhas diagonais sutis, formas SVG abstratas em posição absoluta nos cantos das seções, como na referência (círculos sobrepostos, retângulos com cantos arredondados).
3. **Fotos com tratamento** — Imagens com `border-radius`, overlay de gradiente, ou composição com múltiplas fotos sobrepostas (como a seção "Sobre Nós" da referência com 2 retângulos de foto + círculos decorativos).
4. **Cards com hover elevado** — Cards sobem (`translateY(-8px)`), sombra se intensifica, ícone muda de cor suavemente.
5. **Microinterações CSS** — Botões com efeito ripple ou slide de background, links com underline animado, ícones com rotação/escala sutil no hover.
6. **Fundos alternados** — Seções alternam entre fundo branco, fundo cinza-claro (`var(--color-gray-100)`), e fundo escuro (`var(--color-dark)`). Nunca duas seções seguidas com mesmo fundo.

---

## Componentes Globais

### Header / Navbar

- **Fixo no topo** com `position: fixed`, fundo branco, `box-shadow` sutil, `z-index: 1000`
- **Transparente no topo da home** (fundo transparente, texto branco), fica sólido ao scroll (`scrolled` class via JS)
- Logo à esquerda, links de navegação ao centro/direita
- **Menu mobile**: Hamburger animado (3 barras → X), menu fullscreen ou sidebar deslizante da direita com backdrop escuro
- Links: `font-weight: 500`, efeito hover com underline animado de baixo para cima
- **Botão CTA no header**: "Fale Conosco" — botão com borda roxa, fundo transparente, hover preenche com roxo

### Footer

- **Fundo escuro** (`var(--color-dark)`) com texto claro
- 4 colunas responsivas:
  1. Logo (versão clara) + descrição breve do escritório
  2. Menu — links das páginas
  3. Links Úteis — Agenda Tributária, Tabelas Práticas, Certidões Negativas, etc.
  4. Redes Sociais — ícones SVG de Facebook, Instagram, LinkedIn com hover colorido
- Linha fina separadora acima do copyright
- Copyright centralizado na base

### Botão WhatsApp Flutuante

- Canto inferior direito, `position: fixed`, ícone SVG do WhatsApp
- Fundo verde `var(--color-whatsapp)`, circular, `border-radius: 50%`
- Animação de pulso (`pulse`) sutil e contínua para chamar atenção
- Link para `https://wa.me/SEUNUMERO`

### Botões (padrão global)

- **Primário:** Fundo roxo, texto branco, padding `14px 32px`, border-radius `8px`, hover escurece + sobe levemente
- **Secundário / Outline:** Borda roxa, fundo transparente, texto roxo, hover preenche com roxo e texto fica branco
- Ambos com `transition: var(--transition-default)`
- Efeito de hover com `transform: translateY(-2px)` e sombra intensificada

---

## Páginas — Especificações Detalhadas

### 1. Página Inicial (`index.html`)

**Seção Hero**
- Fundo com gradiente roxo escuro (`var(--gradient-hero)`) ou imagem escura com overlay roxo semi-transparente
- Título grande à esquerda (h1), subtítulo (p), botão CTA "Nossos Serviços"
- Elementos decorativos flutuantes (círculos, linhas) em posição absoluta
- Sutil animação de entrada (fade-in + slide-up) nos textos

**Seção Serviços (4 cards)**
- Label "Nossos serviços" acima do h2
- h2: "Soluções ideais para o seu negócio"
- Grid 2×2 (desktop) de cards com: ícone SVG no topo, título (h3), descrição curta
- Cada card com fundo branco, sombra, border-radius, hover com elevação
- Ícone muda de cor (cinza → roxo) no hover
- Serviços: Societário, Contabilidade, Financeiro, Abertura de Empresa
- Botão "Veja todos os Serviços" abaixo do grid

**Seção Sobre Nós**
- Layout 2 colunas: esquerda = composição de 2 fotos retangulares sobrepostas + elemento decorativo SVG (círculos); direita = texto
- Label "Sobre Nós" + h2 "Conheça nossa empresa"
- Parágrafo descritivo
- 2 badges/ícones inline: "Crescimento estratégico" e "Equipe qualificada" (ícone + texto)
- Botão "Saiba Mais"

**Seção Contadores Animados**
- Fundo escuro (`var(--color-dark)`) com texto branco
- Label "Os dados falam por nós" + h2 "Veja o que fazemos"
- 3 contadores animados (countUp) que disparam ao entrar na viewport via Intersection Observer:
  - Clientes satisfeitos: 150+
  - Estados atendidos: 10+
  - Cidades: 30+
- Cada contador com número grande (3rem+), label descritivo abaixo

**Seção Diferenciais (4 cards)**
- h2: "Por que escolher a [Nome do Escritório]"
- 4 cards verticais com ícone, título e descrição:
  - Equipe qualificada
  - Agilidade
  - Crescimento estratégico
  - Inteligência Financeira
- Grid 2×2 ou 4 colunas em telas grandes

**Seção Depoimentos (Carrossel)**
- Carrossel/slider com depoimentos de clientes
- Cada slide: texto do depoimento (em itálico ou com aspas decorativas), nome do cliente, foto circular
- Navegação: setas ou dots, auto-play com pause on hover
- Implementar em JS puro (sem bibliotecas)

**Seção CTA**
- Fundo roxo/gradiente
- Frase motivacional: "Venha agora para a contabilidade que vai elevar sua empresa a um próximo nível!"
- Botão "Fale Conosco" (branco/outline claro)

**Seção Notícias/Blog (4 cards dinâmicos)**
- Label "Atualidades"
- Container `#home-posts` onde o JS injeta os cards dinamicamente
- Ao carregar a página, `blog.js` faz fetch dos últimos 4 posts via API: `CONFIG.WP_API_URL + '/posts?per_page=' + CONFIG.POSTS_HOME + '&_embed'`
- Cada card renderizado com: imagem destacada (de `_embedded['wp:featuredmedia']`), data formatada, título (h3), resumo (`excerpt.rendered` truncado), link "Ler mais" apontando para `post.html?slug=SLUG`
- Grid horizontal de cards: 4 colunas desktop, 2 tablet, 1 mobile
- **Fallback:** Se a API estiver indisponível ou retornar erro, exibir mensagem amigável: "Em breve, novidades por aqui." — sem quebrar o layout
- **Loading state:** Exibir skeleton/placeholder animado enquanto a API responde

**Seção Formulário de Contato**
- Layout 2 colunas: esquerda = imagem decorativa (pessoa/escritório); direita = formulário
- Campos: Nome, E-mail, Assunto, Mensagem (textarea)
- Aviso de LGPD abaixo do formulário
- Botão "Enviar"
- Validação de campos via JS (não pode enviar vazio, formato de email válido)

### 2. Sobre Nós (`sobre-nos.html`)

**Banner topo** (padrão para todas as páginas internas)
- Fundo roxo/gradiente com título da página centralizado
- Breadcrumb sutil: "Início > Sobre Nós"

**Seção Principal**
- 2 colunas: texto à esquerda + composição de foto com elementos decorativos à direita
- Título "Nosso foco é resolver o seu problema"
- Parágrafos descritivos
- Sub-blocos de Missão e Visão com destaque visual (ícone ou bordas)

**Seção Equipe**
- h2: "Profissionais Especializados"
- Grid de cards de membros da equipe (foto, nome, cargo)
- Hover no card: overlay com informações expandidas (formação, especialização)
- Cards com `border-radius`, sombra, foto no topo com `object-fit: cover`

**Seção Depoimentos** (mesma estrutura da home, reutilizar componente)

### 3. Serviços (`servicos.html`)

**Banner topo**

**Grid de Serviços Expandido**
- Mesmos 4 serviços da home, mas com descrições mais longas
- Layout alternado: cada serviço ocupa uma row inteira, alternando imagem esquerda/direita
- Ícone grande + título + descrição detalhada + bullet points dos sub-serviços
- Serviços:
  - **Societário:** Abertura, alteração, encerramento de empresas; registros em juntas comerciais; alvarás e licenças
  - **Contabilidade:** Escrituração contábil; balanços; demonstrações financeiras; SPED Contábil
  - **Financeiro:** BPO Financeiro; conciliação bancária; fluxo de caixa; relatórios gerenciais
  - **Abertura de Empresa:** Planejamento tributário; definição de regime; registro e constituição; obtenção de CNPJ

**Seção Depoimentos**

### 4. Abrir Empresa (`abrir-empresa.html`)

**Banner topo**

**Seção passo a passo**
- Timeline vertical ou horizontal com os passos para abrir uma empresa:
  1. Planejamento e consultoria inicial
  2. Definição do tipo societário
  3. Registro na Junta Comercial
  4. Obtenção de CNPJ e Inscrições
  5. Alvarás e Licenças
  6. Início das atividades
- Cada step com ícone, número, título, breve descrição
- Animação de entrada sequencial (staggered fade-in) ao scroll

**Seção de benefícios** — Por que abrir sua empresa conosco (3-4 cards)

**Seção CTA** — "Pronto para abrir sua empresa?" + formulário compacto (Nome, Telefone, Email, Tipo de empresa desejado) ou botão para WhatsApp

### 5. Blog (`blog.html`)

**Banner topo**

**Listagem dinâmica de posts (via WP REST API)**
- Container `#blog-grid` vazio no HTML — o JS popula dinamicamente
- `blog.js` faz fetch: `CONFIG.WP_API_URL + '/posts?categories=BLOG_CATEGORY_ID&per_page=' + CONFIG.POSTS_PER_PAGE + '&page=X&_embed'`
- Cada card renderizado com: imagem destacada, data formatada (`new Date(post.date).toLocaleDateString('pt-BR')`), título, resumo, link "Ler mais" → `post.html?slug=POST_SLUG`
- Grid 3 colunas desktop, 2 tablet, 1 mobile
- **Paginação:** Botões "Anterior" / "Próximo" baseados no header `X-WP-TotalPages` da resposta da API. Esconder botão quando não há mais páginas.
- **Loading state:** Skeleton cards animados (3 placeholders cinza pulsando) enquanto a API responde
- **Fallback:** Se API falhar, exibir mensagem: "Não foi possível carregar os posts. Tente novamente mais tarde." com botão de retry
- **Estado vazio:** Se não houver posts, exibir: "Em breve, novidades por aqui."

### 6. Notícias (`noticias.html`)

- Mesma estrutura e lógica do Blog, mas filtrando pela categoria de Notícias:
  `CONFIG.WP_API_URL + '/posts?categories=NOTICIAS_CATEGORY_ID&per_page=' + CONFIG.POSTS_PER_PAGE + '&page=X&_embed'`
- Reutilizar as mesmas funções de `blog.js` — a página apenas passa o ID da categoria diferente
- Layout, paginação, loading e fallback idênticos ao blog

### 6.1. Post Individual (`post.html`)

**Banner topo** (título do post dinâmico)

**Conteúdo do post:**
- `post.js` lê o slug da URL: `new URLSearchParams(window.location.search).get('slug')`
- Fetch: `CONFIG.WP_API_URL + '/posts?slug=SLUG&_embed'`
- Renderizar: título (h1), data, imagem destacada (largura total), conteúdo completo (`content.rendered` — HTML direto do WordPress)
- Estilizar o HTML do `content.rendered` com CSS adequado (parágrafos, listas, imagens, headings internos)
- **Sidebar ou seção abaixo:** "Posts recentes" — listar os 3 últimos posts (outra chamada à API)
- **Botão voltar:** "← Voltar para o Blog" ou "← Voltar para Notícias" (baseado em referrer ou parâmetro extra na URL)
- **Fallback:** Se o slug não existir, exibir: "Post não encontrado." com link para voltar ao blog

### Implementação do `blog.js` — Estrutura esperada

```javascript
// blog.js — Módulo de posts dinâmicos

/**
 * Busca posts da API WordPress
 * @param {Object} options - { categoryId, perPage, page }
 * @returns {Object} { posts, totalPages }
 */
async function fetchPosts({ categoryId, perPage, page = 1 }) {
  const params = new URLSearchParams({
    per_page: perPage,
    page: page,
    _embed: '',  // Inclui imagem destacada e autor
  });
  if (categoryId) params.append('categories', categoryId);

  const response = await fetch(`${CONFIG.WP_API_URL}/posts?${params}`);
  
  if (!response.ok) throw new Error('Erro ao carregar posts');
  
  const posts = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;
  
  return { posts, totalPages };
}

/**
 * Renderiza um card de post
 * @param {Object} post - Objeto retornado pela API
 * @returns {string} HTML do card
 */
function renderPostCard(post) {
  const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/images/placeholder-blog.jpg';
  const date = new Date(post.date).toLocaleDateString('pt-BR');
  const title = post.title.rendered;
  const excerpt = post.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 150) + '...';
  const slug = post.slug;

  return `
    <article class="post-card animate-on-scroll">
      <div class="post-card__image">
        <img src="${image}" alt="${title}" loading="lazy">
      </div>
      <div class="post-card__content">
        <span class="post-card__date">${date}</span>
        <h3 class="post-card__title">${title}</h3>
        <p class="post-card__excerpt">${excerpt}</p>
        <a href="post.html?slug=${slug}" class="post-card__link">Ler mais →</a>
      </div>
    </article>
  `;
}

/**
 * Renderiza skeleton loading (cards placeholder)
 */
function renderSkeletons(container, count = 3) {
  container.innerHTML = Array(count).fill(`
    <div class="post-card skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
    </div>
  `).join('');
}

// Inicialização — detecta qual página está ativa e carrega os posts correspondentes
// blog.html passa categoryId do blog; noticias.html passa categoryId de notícias
// O categoryId é definido como data-attribute no container HTML: <div id="posts-grid" data-category="ID">
```

### Configuração de categorias no `config.js`

```javascript
const CONFIG = {
  WP_API_URL: 'https://seudominio.com.br/wp/wp-json/wp/v2',
  POSTS_PER_PAGE: 9,
  POSTS_HOME: 4,
  CATEGORY_BLOG: 2,       // ID da categoria "Blog" no WordPress — ajustar após criar
  CATEGORY_NOTICIAS: 3,   // ID da categoria "Notícias" no WordPress — ajustar após criar
};
```

### 7. Contato (`contato.html`)

**Banner topo**

**Seção principal 2 colunas:**
- Esquerda: Informações de contato (endereço, telefone, email, horário de funcionamento), ícones SVG, mapa embed (iframe do Google Maps com localização em Blumenau)
- Direita: Formulário completo (Nome, Email, Telefone, Assunto, Mensagem)
- Aviso LGPD
- Botão Enviar

---

## Interatividade e Animações (JavaScript)

### Obrigatório implementar:

1. **Menu mobile responsivo** — Toggle do menu hamburger com animação suave, fechar ao clicar em link ou fora do menu, `body` sem scroll quando menu aberto
2. **Scroll suave** — `scroll-behavior: smooth` no CSS + anchor links funcionais
3. **Navbar com transição** — Na home, navbar começa transparente. Ao scrollar 50px+, adiciona classe `scrolled` (fundo branco, sombra, logo muda para versão escura)
4. **Animações ao scroll (Intersection Observer)** — Elementos entram com `fade-in`, `slide-up`, `slide-left`, `slide-right` ao entrarem na viewport. Classe `.animate-on-scroll` + dataset de direção. Disparar apenas uma vez.
5. **Contadores animados** — Na seção de dados da home, contadores que vão de 0 ao número final em ~2 segundos, com easing. Disparam via Intersection Observer.
6. **Carrossel de depoimentos** — Auto-play (5s intervalo), pause on hover, navegação manual com setas/dots, transição suave (slide ou fade)
7. **Validação de formulários** — Campos obrigatórios, validação de email com regex, feedback visual inline (borda vermelha + mensagem), impedir submit vazio. `event.preventDefault()` no submit + feedback de sucesso simulado.
8. **Back to top** — Botão que aparece após scroll de 400px+, leva suavemente ao topo

### Animações CSS recomendadas:

```css
/* Fade in up — aplicar via JS com Intersection Observer */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delay para grids */
.animate-on-scroll:nth-child(2) { transition-delay: 0.1s; }
.animate-on-scroll:nth-child(3) { transition-delay: 0.2s; }
.animate-on-scroll:nth-child(4) { transition-delay: 0.3s; }

/* Pulse para botão WhatsApp */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.5); }
  70% { box-shadow: 0 0 0 15px rgba(37, 211, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
}
```

---

## Responsividade

### Breakpoints:

```css
/* Mobile first, media queries para cima */
/* Tablet */
@media (min-width: 768px) { ... }
/* Desktop */
@media (min-width: 1024px) { ... }
/* Desktop grande */
@media (min-width: 1280px) { ... }
```

### Regras por breakpoint:

- **Mobile (< 768px):** 
  - Menu hamburger, grids colapsam para 1 coluna
  - Hero com texto centralizado, fonte reduzida
  - Footer empilha em 1 coluna
  - Cards ocupam largura total
  - Padding de seções reduzido (`60px 0`)
  - Formulários ocupam 100% da largura
  
- **Tablet (768px - 1023px):**
  - Grids em 2 colunas
  - Navbar pode manter hamburger ou exibir links compactados
  - Footer em 2 colunas × 2 rows
  
- **Desktop (1024px+):**
  - Layout completo conforme design
  - Grids em 3-4 colunas onde aplicável
  - Hover effects ativos (desabilitar hover em touch devices)

---

## SEO e Performance

- Cada página com `<title>` e `<meta description>` únicos
- Headings hierárquicos e semânticos (`h1` único por página)
- Tags semânticas do HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Imagens com `alt` descritivo, `loading="lazy"` para imagens abaixo do fold
- `<link rel="preconnect">` para Google Fonts
- Favicon configurado
- Open Graph tags (`og:title`, `og:description`, `og:image`) em todas as páginas

---

## Conteúdo Placeholder

Use textos fictícios mas realistas para um escritório de contabilidade. O conteúdo da referência serve como base para tom e estrutura, mas **deve ser reescrito** — não copiar textualmente. O tom deve ser profissional, acessível, e transmitir confiança.

Para imagens, use placeholders de alta qualidade:
- `https://images.unsplash.com/photo-XXXXX?w=600` (fotos de escritório, reuniões, equipe)
- Ou simplesmente `<div>` com background sólido e texto indicando "Imagem aqui"

---

## Checklist de Qualidade

Antes de considerar cada página pronta, verificar:

- [ ] Funciona em mobile (320px), tablet (768px) e desktop (1280px)
- [ ] Menu mobile abre/fecha corretamente, sem scroll do body
- [ ] Todas as animações de scroll disparam corretamente
- [ ] Contadores animam apenas uma vez ao entrar na viewport
- [ ] Carrossel de depoimentos funciona com auto-play e navegação manual
- [ ] Formulário valida campos e mostra feedback visual
- [ ] Todos os links internos navegam corretamente entre páginas
- [ ] WhatsApp flutuante aparece em todas as páginas
- [ ] Footer idêntico em todas as páginas
- [ ] Sem erros no console do navegador
- [ ] Fontes carregam corretamente (Playfair Display + DM Sans)
- [ ] Contraste de cores acessível (texto sobre fundos escuros/claros)
- [ ] Blog e Notícias carregam posts da API e renderizam cards corretamente
- [ ] Skeleton loading aparece enquanto API responde
- [ ] Fallback amigável exibido se a API estiver fora do ar
- [ ] Paginação funciona (Anterior/Próximo) e esconde botões quando não há mais páginas
- [ ] Post individual carrega por slug e exibe conteúdo completo
- [ ] Post inexistente mostra mensagem "Post não encontrado" com link de volta
- [ ] Seção "Atualidades" na home puxa os últimos 4 posts automaticamente
