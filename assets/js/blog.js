// Blog posts manifest - Add your blog posts here
const blogPosts = [
  {
    id: 'example-en-1',
    title: 'Welcome to My Blog',
    date: '2025-01-15',
    lang: 'en',
    filename: 'example-en-1.md'
  },
  {
    id: 'example-zh-1',
    title: '欢迎来到我的博客',
    date: '2025-01-15',
    lang: 'zh',
    filename: 'example-zh-1.md'
  }
];

// Load and render blog posts
async function loadBlogPosts(filterLang = 'all') {
  const container = document.getElementById('blog-posts-container');
  
  if (!container) return;
  
  container.innerHTML = '<p class="loading-message">Loading blog posts...</p>';
  
  try {
    const filteredPosts = filterLang === 'all' 
      ? blogPosts 
      : blogPosts.filter(post => post.lang === filterLang);
    
    if (filteredPosts.length === 0) {
      container.innerHTML = '<p class="no-posts">No blog posts found.</p>';
      return;
    }
    
    // Sort posts by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let html = '';
    
    for (const post of filteredPosts) {
      try {
        const response = await fetch(`posts/${post.filename}`);
        if (!response.ok) continue;
        
        const markdown = await response.text();
        const htmlContent = marked.parse(markdown);
        
        html += `
          <article class="blog-post" data-lang="${post.lang}">
            <header class="blog-post-header">
              <h3 class="blog-post-title">${post.title}</h3>
              <div class="blog-post-meta">
                <time datetime="${post.date}">${formatDate(post.date)}</time>
                <span class="blog-post-lang lang-badge lang-${post.lang}">${post.lang === 'en' ? 'English' : '中文'}</span>
              </div>
            </header>
            <div class="blog-post-content">
              ${htmlContent}
            </div>
          </article>
        `;
      } catch (error) {
        console.error(`Error loading post ${post.filename}:`, error);
      }
    }
    
    container.innerHTML = html || '<p class="no-posts">No blog posts available.</p>';
  } catch (error) {
    console.error('Error loading blog posts:', error);
    container.innerHTML = '<p class="error-message">Error loading blog posts. Please try again later.</p>';
  }
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

// Initialize blog functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Load all posts initially
  loadBlogPosts('all');
  
  // Set up language filter buttons
  const langFilters = document.querySelectorAll('.lang-filter');
  langFilters.forEach(button => {
    button.addEventListener('click', () => {
      // Update active state
      langFilters.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Load filtered posts
      const lang = button.getAttribute('data-lang');
      loadBlogPosts(lang);
    });
  });
});

