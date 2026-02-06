const API_URL = 'http://localhost:3000/api/v1';
const WS_URL = 'ws://localhost:3001/ws';

const posts = new Map();
let ws = null;

// Initialize
async function init() {
  await fetchPosts();
  connectWebSocket();
}

// Fetch initial posts via REST
async function fetchPosts() {
  try {
    const response = await fetch(`${API_URL}/posts?limit=50`);
    const result = await response.json();
    
    if (result.success) {
      posts.clear();
      result.data.forEach(post => posts.set(post.id, post));
      renderPosts();
      showToast(`Loaded ${posts.size} posts`);
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    showToast('Failed to fetch posts', 'error');
  }
}

// Connect to WebSocket
function connectWebSocket() {
  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    updateWSStatus(true);
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    handleWSMessage(message);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
    updateWSStatus(false);
  };

  ws.onclose = () => {
    updateWSStatus(false);
    console.log('WebSocket disconnected');
    // Reconnect after 3 seconds
    setTimeout(connectWebSocket, 3000);
  };
}

// Handle WebSocket messages
function handleWSMessage(message) {
  console.log('Received:', message);

  switch(message.type) {
    case 'connection.ack':
      showToast('Connected to real-time feed');
      break;

    case 'posts.created':
      posts.set(message.data.post.id, message.data.post);
      renderPosts();
      highlightPost(message.data.post.id);
      showToast('New post created');
      break;

    case 'posts.updated':
      posts.set(message.data.post.id, message.data.post);
      renderPosts();
      highlightPost(message.data.post.id);
      showToast('Post updated');
      break;

    case 'posts.deleted':
      posts.delete(message.data.postId);
      renderPosts();
      showToast('Post deleted');
      break;
  }
}

// Render posts
function renderPosts() {
  const grid = document.getElementById('posts-grid');
  const sortedPosts = Array.from(posts.values())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (sortedPosts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <h2>No posts yet</h2>
        <p>Create your first post via the API</p>
      </div>
    `;
  } else {
    grid.innerHTML = sortedPosts.map(post => `
      <div class="post-card" id="post-${post.id}">
        <div class="post-header">
          <h3 class="post-title">${escapeHtml(post.title)}</h3>
          <span class="status-badge ${post.status}">${post.status}</span>
        </div>
        <p class="post-content">${escapeHtml(post.content.substring(0, 200))}${post.content.length > 200 ? '...' : ''}</p>
        <div class="post-meta">
          <span>Created: ${formatDate(post.createdAt)}</span>
          <span>Updated: ${formatDate(post.updatedAt)}</span>
        </div>
      </div>
    `).join('');
  }

  document.getElementById('post-count').textContent = posts.size;
}

// Highlight post with animation
function highlightPost(postId) {
  const card = document.getElementById(`post-${postId}`);
  if (card) {
    card.classList.add('highlight');
    setTimeout(() => card.classList.remove('highlight'), 1000);
  }
}

// Update WebSocket status
function updateWSStatus(connected) {
  const indicator = document.getElementById('ws-indicator');
  const status = document.getElementById('ws-status');
  
  if (connected) {
    indicator.classList.add('connected');
    status.textContent = 'Connected';
  } else {
    indicator.classList.remove('connected');
    status.textContent = 'Disconnected';
  }
}

// Show toast notification
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

async function refreshPosts() {
  await fetchPosts();
}

// Start the app
init();
