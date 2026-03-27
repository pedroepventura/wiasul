// blog.js — Módulo de posts dinâmicos (Blog, Notícias e Home)

/**
 * Busca posts da API WordPress
 * @param {Object} options - { categoryId, perPage, page }
 * @returns {Object} { posts, totalPages }
 */
async function fetchPosts({ categoryId, perPage, page = 1 }) {
  const params = new URLSearchParams({
    per_page: perPage,
    page: page,
    _embed: '',
  });
  if (categoryId) params.append('categories', categoryId);

  const response = await fetch(`${CONFIG.WP_API_URL}/posts?${params}`);

  if (!response.ok) throw new Error('Erro ao carregar posts');

  const posts = await response.json();
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages')) || 1;

  return { posts, totalPages };
}

/**
 * Renderiza um card de post (padrão para blog/noticias e home)
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
        <a href="/post/?slug=${slug}" class="post-card__link">Ler mais →</a>
      </div>
    </article>
  `;
}

/**
 * Renderiza skeleton loading (cards placeholder)
 * @param {HTMLElement} container
 * @param {number} count
 */
function renderSkeletons(container, count = 3) {
  container.innerHTML = Array(count).fill(`
    <div class="post-card skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton-text short"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text"></div>
        <div class="skeleton-text short"></div>
      </div>
    </div>
  `).join('');
}

/**
 * Exibe mensagem de erro com botão de retry
 * @param {HTMLElement} container
 * @param {Function} retryFn
 */
function renderError(container, retryFn) {
  container.innerHTML = `
    <div class="posts-message posts-error">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
      <p>Não foi possível carregar os posts. Tente novamente mais tarde.</p>
      <button class="btn btn-outline retry-btn" onclick="(${retryFn.toString()})()">Tentar novamente</button>
    </div>
  `;
}

/**
 * Exibe mensagem de estado vazio
 * @param {HTMLElement} container
 */
function renderEmpty(container) {
  container.innerHTML = `
    <div class="posts-message posts-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <p>Em breve, novidades por aqui.</p>
    </div>
  `;
}

/**
 * Atualiza estado dos botões de paginação
 * @param {Object} options
 */
function updatePagination({ currentPage, totalPages, prevBtn, nextBtn }) {
  if (!prevBtn || !nextBtn) return;
  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;
  prevBtn.style.display = totalPages <= 1 ? 'none' : '';
  nextBtn.style.display = totalPages <= 1 ? 'none' : '';
}

/* ===== INICIALIZAÇÃO — Blog / Notícias ===== */
(function initPostsGrid() {
  const grid = document.getElementById('posts-grid');
  if (!grid) return;

  const categoryId = grid.dataset.category ? parseInt(grid.dataset.category) : null;
  const prevBtn = document.getElementById('posts-prev');
  const nextBtn = document.getElementById('posts-next');
  let currentPage = 1;
  let currentTotalPages = 1;

  async function loadPosts(page) {
    renderSkeletons(grid, CONFIG.POSTS_PER_PAGE > 6 ? 6 : CONFIG.POSTS_PER_PAGE);

    try {
      const { posts, totalPages } = await fetchPosts({
        categoryId,
        perPage: CONFIG.POSTS_PER_PAGE,
        page,
      });

      currentPage = page;
      currentTotalPages = totalPages;

      if (posts.length === 0) {
        renderEmpty(grid);
      } else {
        grid.innerHTML = posts.map(renderPostCard).join('');
        // Disparar Intersection Observer nos novos elementos
        if (window.observeAnimations) window.observeAnimations();
      }

      updatePagination({
        currentPage,
        totalPages,
        prevBtn,
        nextBtn,
      });
    } catch (err) {
      renderError(grid, () => loadPosts(currentPage));
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        loadPosts(currentPage - 1);
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentPage < currentTotalPages) {
        loadPosts(currentPage + 1);
        grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  loadPosts(1);
})();

/* ===== INICIALIZAÇÃO — Home (últimos posts) ===== */
(function initHomePosts() {
  const homePosts = document.getElementById('home-posts');
  if (!homePosts) return;

  renderSkeletons(homePosts, CONFIG.POSTS_HOME);

  fetchPosts({ perPage: CONFIG.POSTS_HOME })
    .then(({ posts }) => {
      if (posts.length === 0) {
        homePosts.innerHTML = `<div class="posts-message posts-empty"><p>Em breve, novidades por aqui.</p></div>`;
      } else {
        homePosts.innerHTML = posts.map(renderPostCard).join('');
        if (window.observeAnimations) window.observeAnimations();
      }
    })
    .catch(() => {
      homePosts.innerHTML = `<div class="posts-message posts-empty"><p>Em breve, novidades por aqui.</p></div>`;
    });
})();
