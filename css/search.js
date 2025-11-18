
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Desktop search functionality
  const desktopSearchBtn = document.querySelector('.desktop-nav .search-btn');
  const desktopSearchInputContainer = document.querySelector('.desktop-nav .search-input-container');
  const desktopSearchInput = document.querySelector('.desktop-nav .search-input');
  const desktopSearchResults = document.querySelector('.desktop-nav .search-results');
  
  // Mobile search functionality
  const mobileSearchBtn = document.querySelector('.mobile-search .search-btn');
  const mobileSearchInputContainer = document.querySelector('.mobile-search .search-input-container');
  const mobileSearchInput = document.querySelector('.mobile-search .search-input');
  const mobileSearchResults = document.querySelector('.mobile-search .search-results');
  
  // Header mobile search button
  const headerMobileSearchBtn = document.querySelector('.mobile-header-search');
  
  // Toggle desktop search with animation
  if(desktopSearchBtn) {
    desktopSearchBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = desktopSearchInputContainer.classList.contains('active');
      
      if (isActive) {
        desktopSearchInputContainer.classList.remove('active');
        desktopSearchInput.blur();
      } else {
        desktopSearchInputContainer.classList.add('active');
        desktopSearchInput.focus();
      }
    });
  }
  
  // Toggle mobile search with animation
  if(mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isActive = mobileSearchInputContainer.classList.contains('active');
      
      if (isActive) {
        mobileSearchInputContainer.classList.remove('active');
        mobileSearchInput.blur();
      } else {
        mobileSearchInputContainer.classList.add('active');
        mobileSearchInput.focus();
      }
    });
  }
  
  // Toggle mobile search from header button
  if(headerMobileSearchBtn) {
    headerMobileSearchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('mobileNav').classList.add('active');
      document.getElementById('overlay').classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Focus on mobile search
      setTimeout(() => {
        mobileSearchInputContainer.classList.add('active');
        mobileSearchInput.focus();
      }, 300);
    });
  }

  // Common search functionality
  function setupSearch(inputElement, resultsContainer) {
    inputElement.addEventListener('input', function() {
      const searchTerm = this.value.trim().toLowerCase();
      resultsContainer.innerHTML = '';
      
      if (searchTerm.length < 2) {
        return;
      }

      // Find all text nodes in the document
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      const results = [];
      let node;
      
      while (node = walker.nextNode()) {
        if (node.nodeValue.toLowerCase().includes(searchTerm)) {
          const parentElement = node.parentElement;
          
          if (parentElement.offsetParent === null || 
              parentElement.tagName === 'SCRIPT' || 
              parentElement.tagName === 'STYLE') {
            continue;
          }
          
          let section = parentElement.closest('section, .section, [id], h1, h2, h3, h4, h5, h6');
          if (!section) section = parentElement;
          
          if (!results.some(r => r.element === section)) {
            results.push({
              text: node.nodeValue.trim(),
              element: section
            });
          }
        }
      }

      // Display results
      if (results.length > 0) {
        results.slice(0, 15).forEach(result => {
          const resultItem = document.createElement('div');
          resultItem.className = 'search-result-item';
          
          const text = result.text;
          const index = text.toLowerCase().indexOf(searchTerm);
          const start = Math.max(0, index - 30);
          const end = Math.min(text.length, index + searchTerm.length + 30);
          let preview = text.substring(start, end);
          
          if (start > 0) preview = '...' + preview;
          if (end < text.length) preview = preview + '...';
          
          preview = preview.replace(
            new RegExp(searchTerm, 'gi'), 
            match => `<strong style="color:#ff6b00">${match}</strong>`
          );
          
          resultItem.innerHTML = preview;
          
          resultItem.addEventListener('click', function() {
            document.querySelectorAll('.search-highlight').forEach(hl => {
              hl.classList.remove('search-highlight');
            });
            
            // Smooth scroll to element
            result.element.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
            
            // Highlight with animation
            result.element.classList.add('search-highlight');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
              result.element.classList.remove('search-highlight');
            }, 3000);
            
            // Close search
            if(inputElement === desktopSearchInput) {
              desktopSearchInputContainer.classList.remove('active');
              desktopSearchInput.blur();
            } else {
              mobileSearchInputContainer.classList.remove('active');
              mobileSearchInput.blur();
            }
          });
          
          resultsContainer.appendChild(resultItem);
        });
      } else {
        resultsContainer.innerHTML = '<div class="search-result-item">No results found for "' + searchTerm + '"</div>';
      }
    });
  }

  // Initialize search for both desktop and mobile
  if(desktopSearchInput) setupSearch(desktopSearchInput, desktopSearchResults);
  if(mobileSearchInput) setupSearch(mobileSearchInput, mobileSearchResults);

  // Close when clicking outside or pressing ESC
  document.addEventListener('click', function(e) {
    if (desktopSearchInputContainer && !desktopSearchInputContainer.contains(e.target) && 
        (!desktopSearchBtn || !desktopSearchBtn.contains(e.target))) {
      desktopSearchInputContainer.classList.remove('active');
    }
    
    if (mobileSearchInputContainer && !mobileSearchInputContainer.contains(e.target) && 
        (!mobileSearchBtn || !mobileSearchBtn.contains(e.target))) {
      mobileSearchInputContainer.classList.remove('active');
    }
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if(desktopSearchInputContainer) desktopSearchInputContainer.classList.remove('active');
      if(mobileSearchInputContainer) mobileSearchInputContainer.classList.remove('active');
    }
  });
});
</script>