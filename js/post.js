// post.js — Renderização de post individual via WP REST API

(function initPostPage() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const postContent = document.getElementById('post-content');
  const postBannerTitle = document.getElementById('post-banner-title');
  const recentPostsGrid = document.getElementById('recent-posts-grid');
  const backLink = document.getElementById('back-link');

  if (!postContent) return;

  // Configurar link de voltar
  if (backLink) {
    backLink.href = '/blog/';
    backLink.textContent = '← Voltar para o Blog';
  }

  if (!slug) {
    renderNotFound();
    return;
  }

  loadPost(slug);
  loadRecentPosts();

  async function loadPost(slug) {
    postContent.innerHTML = `
      <div class="post-loading">
        <div class="skeleton-post-image"></div>
        <div class="skeleton-text short" style="margin: 24px 0 8px;"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    `;

    try {
      const response = await fetch(
        `${CONFIG.WP_API_URL}/posts?slug=${encodeURIComponent(slug)}&_embed`
      );

      if (!response.ok) throw new Error('Erro ao carregar post');

      const posts = await response.json();

      if (!posts.length) {
        renderNotFound();
        return;
      }

      const post = posts[0];
      renderPost(post);
    } catch (err) {
      postContent.innerHTML = `
        <div class="posts-message posts-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <p>Não foi possível carregar o post. Tente novamente mais tarde.</p>
          <a href="/blog/" class="btn btn-outline" style="margin-top: 16px;">Voltar para o Blog</a>
        </div>
      `;
    }
  }

  function renderPost(post) {
    const image = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;
    const date = new Date(post.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const title = post.title.rendered;
    const content = post.content.rendered;

    // Atualizar banner com título do post
    if (postBannerTitle) {
      postBannerTitle.textContent = title;
      document.title = `${title} — Wia Sul Contabilidade`;
    }

    postContent.innerHTML = `
      <div class="post-meta-bar">
        <span class="post-meta-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          ${date}
        </span>
      </div>
      ${image ? `<div class="post-featured-image"><img src="${image}" alt="${title}" /></div>` : ''}
      <div class="post-body wp-content">
        ${content}
      </div>
    `;
  }

  function renderNotFound() {
    if (postBannerTitle) postBannerTitle.textContent = 'Post não encontrado';
    document.title = 'Post não encontrado — Wia Sul Contabilidade';

    postContent.innerHTML = `
      <div class="posts-message posts-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <p>Post não encontrado.</p>
        <a href="/blog/" class="btn btn-outline" style="margin-top: 16px;">Voltar para o Blog</a>
      </div>
    `;
  }

  async function loadRecentPosts() {
    if (!recentPostsGrid) return;

    recentPostsGrid.innerHTML = `
      <div class="post-card skeleton"><div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-text short"></div><div class="skeleton-text"></div></div></div>
      <div class="post-card skeleton"><div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-text short"></div><div class="skeleton-text"></div></div></div>
      <div class="post-card skeleton"><div class="skeleton-image"></div><div class="skeleton-content"><div class="skeleton-text short"></div><div class="skeleton-text"></div></div></div>
    `;

    try {
      const response = await fetch(`${CONFIG.WP_API_URL}/posts?per_page=3&_embed`);
      if (!response.ok) throw new Error();
      const posts = await response.json();

      // Excluir o post atual da listagem de recentes
      const filteredPosts = posts.filter(p => p.slug !== slug).slice(0, 3);

      if (filteredPosts.length === 0) {
        recentPostsGrid.innerHTML = '';
        return;
      }

      recentPostsGrid.innerHTML = filteredPosts.map(p => {
        const img = p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'assets/images/placeholder-blog.jpg';
        const date = new Date(p.date).toLocaleDateString('pt-BR');
        const title = p.title.rendered;
        return `
          <a href="/post/?slug=${p.slug}" class="recent-post-item">
            <div class="recent-post-img">
              <img src="${img}" alt="${title}" loading="lazy">
            </div>
            <div class="recent-post-info">
              <span class="recent-post-date">${date}</span>
              <h4 class="recent-post-title">${title}</h4>
            </div>
          </a>
        `;
      }).join('');
    } catch {
      recentPostsGrid.innerHTML = '';
    }
  }
})();
