// ===== BLOG APPLICATION - MAIN JAVASCRIPT =====

// ============================================
// NAVIGATION
// ============================================
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.querySelector('.nav-hamburger');
    this.mobileOverlay = document.querySelector('.mobile-nav-overlay');
    this.isOpen = false;

    this.init();
  }

  init() {
    // Scroll effect
    window.addEventListener('scroll', () => this.handleScroll());

    // Mobile menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobile());
    }

    // Close mobile menu on link click
    if (this.mobileOverlay) {
      this.mobileOverlay.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
    }

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeMobile();
    });

    // Set active nav link
    this.setActiveLink();
  }

  handleScroll() {
    if (!this.navbar) return;
    if (window.scrollY > 20) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  toggleMobile() {
    this.isOpen = !this.isOpen;
    this.hamburger.classList.toggle('active');
    if (this.mobileOverlay) {
      this.mobileOverlay.classList.toggle('active');
    }
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
  }

  closeMobile() {
    this.isOpen = false;
    if (this.hamburger) this.hamburger.classList.remove('active');
    if (this.mobileOverlay) this.mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      }
    });
  }
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
class Toast {
  static show(message, type = 'info', duration = 3000) {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${icons[type] || icons.info}</span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 500);
    }, duration);
  }
}

// ============================================
// FORM VALIDATION
// ============================================
class FormValidator {
  static validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  static validatePassword(password) {
    return password.length >= 6;
  }

  static validateRequired(value) {
    return value.trim().length > 0;
  }

  static showError(input, message) {
    const group = input.closest('.form-group');
    const existing = group.querySelector('.form-error');
    if (existing) existing.remove();

    input.style.borderColor = '#f87171';
    const error = document.createElement('span');
    error.className = 'form-error';
    error.style.cssText = 'color: #f87171; font-size: 0.8rem; margin-top: 6px; display: block;';
    error.textContent = message;
    group.appendChild(error);
  }

  static clearError(input) {
    const group = input.closest('.form-group');
    const existing = group.querySelector('.form-error');
    if (existing) existing.remove();
    input.style.borderColor = '';
  }

  static clearAllErrors(form) {
    form.querySelectorAll('.form-error').forEach(e => e.remove());
    form.querySelectorAll('.form-input').forEach(i => i.style.borderColor = '');
  }
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================
class Storage {
  static get(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch {
      return null;
    }
  }

  static set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static remove(key) {
    localStorage.removeItem(key);
  }
}

// ============================================
// AUTH SYSTEM (Frontend Mock)
// ============================================
class Auth {
  static USERS_KEY = 'blog_users';
  static CURRENT_USER_KEY = 'blog_current_user';

  static getUsers() {
    return Storage.get(Auth.USERS_KEY) || [];
  }

  static register(name, email, password) {
    const users = Auth.getUsers();

    // Check if user exists
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const user = {
      id: Date.now().toString(),
      name,
      email,
      password, // Note: In production, never store plain passwords
      avatar: name.charAt(0).toUpperCase(),
      joinDate: new Date().toISOString()
    };

    users.push(user);
    Storage.set(Auth.USERS_KEY, users);
    Storage.set(Auth.CURRENT_USER_KEY, user);

    return { success: true, user };
  }

  static login(email, password) {
    const users = Auth.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    Storage.set(Auth.CURRENT_USER_KEY, user);
    return { success: true, user };
  }

  static logout() {
    Storage.remove(Auth.CURRENT_USER_KEY);
    window.location.href = 'index.html';
  }

  static getCurrentUser() {
    return Storage.get(Auth.CURRENT_USER_KEY);
  }

  static isLoggedIn() {
    return Auth.getCurrentUser() !== null;
  }

  static requireAuth() {
    if (!Auth.isLoggedIn()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
}

// ============================================
// BLOG POST SYSTEM
// ============================================
class BlogManager {
  static POSTS_KEY = 'blog_posts';

  static getDefaultPosts() {
    return [
      {
        id: '1',
        title: 'The Future of AI: How Machine Learning is Reshaping Our World',
        excerpt: 'Artificial intelligence is no longer a distant dream. From healthcare to transportation, AI is transforming every aspect of our lives in unprecedented ways.',
        content: 'Artificial intelligence is no longer a distant dream. It has permeated every aspect of our lives, from the way we shop online to how medical diagnoses are made. Machine learning algorithms are becoming increasingly sophisticated, enabling computers to learn from data and make decisions with minimal human intervention.\n\nThe healthcare industry is one of the most promising areas for AI application. Machine learning models can analyze medical images with remarkable accuracy, often outperforming human radiologists in detecting certain conditions...',
        category: 'Technology',
        author: 'Sarah Mitchell',
        authorAvatar: 'S',
        date: '2026-10-10',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
        tags: ['AI', 'Machine Learning', 'Technology'],
        featured: true
      },
      {
        id: '2',
        title: 'Mastering Modern CSS: A Deep Dive into Container Queries',
        excerpt: 'Container queries are revolutionizing responsive design. Learn how to build truly modular, reusable components that adapt to their container.',
        content: 'Container queries represent one of the most significant advances in CSS in recent years. Unlike media queries, which respond to the viewport size, container queries allow components to respond to the size of their parent container.',
        category: 'Development',
        author: 'Alex Chen',
        authorAvatar: 'A',
        date: '2026-10-08',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
        tags: ['CSS', 'Web Development', 'Frontend'],
        featured: false
      },
      {
        id: '3',
        title: 'Building Sustainable Design Systems for Scale',
        excerpt: 'How top companies are creating design systems that evolve with their products while maintaining consistency across hundreds of components.',
        content: 'Design systems have become essential tools for modern product teams. They provide a shared language between designers and developers, ensure consistency across products, and significantly speed up the design and development process.',
        category: 'Design',
        author: 'Maya Rodriguez',
        authorAvatar: 'M',
        date: '2026-10-05',
        readTime: '10 min read',
        image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
        tags: ['Design Systems', 'UI/UX', 'Design'],
        featured: false
      },
      {
        id: '4',
        title: 'The Rise of Edge Computing: Bringing the Cloud Closer',
        excerpt: 'Edge computing is transforming how we process data. Discover why major tech companies are investing billions in edge infrastructure.',
        content: 'Edge computing represents a paradigm shift in how we think about data processing and delivery. Instead of relying solely on centralized cloud data centers, edge computing brings computation and data storage closer to the sources of data.',
        category: 'Technology',
        author: 'James Parker',
        authorAvatar: 'J',
        date: '2026-10-03',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
        tags: ['Edge Computing', 'Cloud', 'Infrastructure'],
        featured: false
      },
      {
        id: '5',
        title: 'Creative Coding: Turning Art into Algorithms',
        excerpt: 'Explore the fascinating intersection of art and programming, where creativity meets computation to produce mesmerizing digital experiences.',
        content: 'Creative coding is a discipline where programming is used as an expressive medium rather than a purely functional one. It bridges the gap between technology and art, enabling creators to produce interactive installations, generative art, and immersive digital experiences.',
        category: 'Creativity',
        author: 'Luna Kim',
        authorAvatar: 'L',
        date: '2026-09-30',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        tags: ['Creative Coding', 'Art', 'Generative'],
        featured: false
      },
      {
        id: '6',
        title: 'Web Performance: Why Every Millisecond Counts',
        excerpt: 'A comprehensive guide to optimizing your web application\'s performance, from critical rendering path to advanced caching strategies.',
        content: 'Web performance is not just a technical metric—it directly impacts user experience, conversion rates, and even search engine rankings. Studies have shown that a one-second delay in page load time can lead to a 7% reduction in conversions.',
        category: 'Development',
        author: 'Ryan Foster',
        authorAvatar: 'R',
        date: '2026-09-28',
        readTime: '9 min read',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        tags: ['Performance', 'Web Dev', 'Optimization'],
        featured: false
      }
    ];
  }

  static getPosts() {
    let posts = Storage.get(BlogManager.POSTS_KEY);
    if (!posts || posts.length === 0) {
      posts = BlogManager.getDefaultPosts();
      Storage.set(BlogManager.POSTS_KEY, posts);
    }
    return posts;
  }

  static getPost(id) {
    const posts = BlogManager.getPosts();
    return posts.find(p => p.id === id);
  }

  static getUserPosts(userId) {
    const posts = BlogManager.getPosts();
    return posts.filter(p => p.userId === userId);
  }

  static createPost(postData) {
    const user = Auth.getCurrentUser();
    if (!user) return { success: false, message: 'Please login first.' };

    const posts = BlogManager.getPosts();
    const post = {
      id: Date.now().toString(),
      ...postData,
      author: user.name,
      authorAvatar: user.avatar,
      userId: user.id,
      date: new Date().toISOString().split('T')[0],
      readTime: `${Math.max(1, Math.ceil(postData.content.split(' ').length / 200))} min read`,
      featured: false
    };

    posts.unshift(post);
    Storage.set(BlogManager.POSTS_KEY, posts);
    return { success: true, post };
  }

  static deletePost(id) {
    let posts = BlogManager.getPosts();
    posts = posts.filter(p => p.id !== id);
    Storage.set(BlogManager.POSTS_KEY, posts);
    return { success: true };
  }

  static getFeaturedPost() {
    const posts = BlogManager.getPosts();
    return posts.find(p => p.featured) || posts[0];
  }

  static getCategories() {
    const posts = BlogManager.getPosts();
    const categories = [...new Set(posts.map(p => p.category))];
    return ['All', ...categories];
  }

  static filterByCategory(category) {
    const posts = BlogManager.getPosts();
    if (category === 'All') return posts;
    return posts.filter(p => p.category === category);
  }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
class ScrollAnimator {
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
  }

  observe(selector) {
    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      this.observer.observe(el);
    });
  }
}

// ============================================
// PASSWORD TOGGLE
// ============================================
function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
      } else {
        input.type = 'password';
        btn.textContent = '👁';
      }
    });
  });
}

// ============================================
// UPDATE NAV FOR LOGGED IN STATE
// ============================================
function updateNavAuth() {
  const user = Auth.getCurrentUser();
  const navAuth = document.querySelector('.nav-auth');
  const mobileAuth = document.querySelector('.mobile-auth');

  if (user && navAuth) {
    navAuth.innerHTML = `
      <a href="dashboard.html" class="btn-ghost" style="display:flex; align-items:center; gap:8px;">
        <span style="width:30px;height:30px;border-radius:50%;background:var(--gradient-primary);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;color:white;">${user.avatar}</span>
        <span>${user.name.split(' ')[0]}</span>
      </a>
      <button onclick="Auth.logout()" class="btn-ghost" style="color:var(--text-muted);">Logout</button>
    `;
  }

  if (user && mobileAuth) {
    mobileAuth.innerHTML = `
      <a href="dashboard.html" class="btn btn-primary" style="justify-content:center;">Dashboard</a>
      <button onclick="Auth.logout()" class="btn btn-secondary" style="justify-content:center;">Logout</button>
    `;
  }
}

// ============================================
// FORMAT DATE
// ============================================
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize navigation
  new Navigation();

  // Update nav auth state
  updateNavAuth();

  // Initialize password toggles
  initPasswordToggles();

  // Initialize scroll animations
  const animator = new ScrollAnimator();
  animator.observe('[data-animate]');
});
