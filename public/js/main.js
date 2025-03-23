// DOM Elements
const loginForm = document.getElementById('loginForm');
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const userDisplay = document.getElementById('userDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const subscriberForm = document.getElementById('subscriberForm');
const subscriberUsername = document.getElementById('subscriberUsername');
const successMessage = document.getElementById('successMessage');
const leaderboardBody = document.getElementById('leaderboardBody');
const previewLeaderboardBody = document.getElementById('previewLeaderboardBody');

// API endpoints
const API_URL = 'http://localhost:3000/api';

// Event Listeners
loginForm.addEventListener('submit', handleLogin);
logoutBtn.addEventListener('click', handleLogout);
subscriberForm.addEventListener('submit', handleAddSubscriber);

// Initialize the preview leaderboard on page load
document.addEventListener('DOMContentLoaded', function() {
  fetchAndUpdateLeaderboard();
});

// Fetch participants and update leaderboard
async function fetchAndUpdateLeaderboard() {
  try {
    const response = await fetch(`${API_URL}/participants`);
    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }
    
    const participants = await response.json();
    updatePreviewLeaderboard(participants);
    
    // If user is logged in, update the dashboard leaderboard too
    if (currentUser) {
      updateLeaderboard(participants);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Login functionality
async function handleLogin(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value.toLowerCase().trim();
  
  if (username === '') {
    alert("Please enter a username");
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const user = await response.json();
    
    // Store current user info
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    userDisplay.textContent = user.username;
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    // Fetch and update leaderboard
    fetchAndUpdateLeaderboard();
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to log in. Please try again.');
  }
}

// Get current user from local storage
function getCurrentUser() {
  const userJson = localStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
}

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', function() {
  const user = getCurrentUser();
  if (user) {
    userDisplay.textContent = user.username;
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
  }
});

// Logout functionality
function handleLogout() {
  localStorage.removeItem('currentUser');
  loginContainer.style.display = 'block';
  dashboardContainer.style.display = 'none';
  loginForm.reset();
  fetchAndUpdateLeaderboard();
}

// Add subscriber functionality
async function handleAddSubscriber(e) {
  e.preventDefault();
  
  const newSubUsername = subscriberUsername.value.trim();
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    alert('You must be logged in to add subscribers');
    return;
  }
  
  if (newSubUsername === '') {
    alert('Please enter a subscriber username');
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/subscribers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: currentUser.username,
        subscriberUsername: newSubUsername
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add subscriber');
    }
    
    // Show success message
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 3000);
    
    // Reset form and update leaderboard
    subscriberForm.reset();
    fetchAndUpdateLeaderboard();
    
    // Update local storage with new user data
    const updatedUserResponse = await fetch(`${API_URL}/participants/${currentUser.username}`);
    if (updatedUserResponse.ok) {
      const updatedUser = await updatedUserResponse.json();
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  } catch (error) {
    console.error('Error:', error);
    alert(error.message || 'Failed to add subscriber');
  }
}

// Update leaderboard in the dashboard view
function updateLeaderboard(participants) {
  // Sort participants by subscriber count (descending)
  const sortedParticipants = [...participants].sort((a, b) => b.subscribers - a.subscribers);
  const currentUser = getCurrentUser();
  
  // Clear existing leaderboard
  leaderboardBody.innerHTML = '';
  
  // Add participants to leaderboard
  sortedParticipants.forEach((participant, index) => {
    const row = document.createElement('tr');
    
    // Highlight current user's row
    if (currentUser && participant.username === currentUser.username) {
      row.style.backgroundColor = '#e8f5e9';
      row.style.fontWeight = 'bold';
    }
    
    // Create rank cell with special styling for top 3
    const rankCell = document.createElement('td');
    rankCell.className = 'rank';
    if (index === 0) rankCell.classList.add('rank-1');
    if (index === 1) rankCell.classList.add('rank-2');
    if (index === 2) rankCell.classList.add('rank-3');
    rankCell.textContent = index + 1;
    
    // Create username cell
    const usernameCell = document.createElement('td');
    usernameCell.textContent = participant.username;
    
    // Create subscriber count cell
    const subscribersCell = document.createElement('td');
    subscribersCell.className = 'subscriber-count';
    subscribersCell.textContent = participant.subscribers;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(usernameCell);
    row.appendChild(subscribersCell);
    
    // Add row to table
    leaderboardBody.appendChild(row);
  });
}

// Update preview leaderboard in the login view
function updatePreviewLeaderboard(participants) {
  // Sort participants by subscriber count (descending)
  const sortedParticipants = [...participants].sort((a, b) => b.subscribers - a.subscribers);
  
  // Clear existing preview leaderboard
  previewLeaderboardBody.innerHTML = '';
  
  // Add participants to preview leaderboard
  sortedParticipants.forEach((participant, index) => {
    const row = document.createElement('tr');
    
    // Create rank cell with special styling for top 3
    const rankCell = document.createElement('td');
    rankCell.className = 'rank';
    if (index === 0) rankCell.classList.add('rank-1');
    if (index === 1) rankCell.classList.add('rank-2');
    if (index === 2) rankCell.classList.add('rank-3');
    rankCell.textContent = index + 1;
    
    // Create username cell
    const usernameCell = document.createElement('td');
    usernameCell.textContent = participant.username;
    
    // Create subscriber count cell
    const subscribersCell = document.createElement('td');
    subscribersCell.className = 'subscriber-count';
    subscribersCell.textContent = participant.subscribers;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(usernameCell);
    row.appendChild(subscribersCell);
    
    // Add row to table
    previewLeaderboardBody.appendChild(row);
  });
}