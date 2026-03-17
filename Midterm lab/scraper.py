"""
Xbox Game Pass Live Scraper
Scrapes game information from any Xbox URL provided
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from datetime import datetime

class XboxGamePassLiveScraper:
    """
    Live web scraper for Xbox Game Pass pages
    """
    
    def __init__(self, url):
        """Initialize with target URL"""
        self.base_url = url
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
        }
        self.games_data = []
        
    def scrape(self):
        """
        Main scraping method - collects game data from the provided URL
        
        Returns:
            dict: Scraping results with status and data
        """
        result = {
            'success': False,
            'message': '',
            'games': [],
            'stats': {
                'total': 0,
                'with_release': 0,
                'with_developer': 0,
                'with_publisher': 0
            },
            'scrape_time': None
        }
        
        try:
            print(f"🌐 Scraping URL: {self.base_url}")
            
            # Send HTTP request
            response = requests.get(self.base_url, headers=self.headers, timeout=15)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'lxml')
            
            # Extract platform info
            platform_info = self._extract_platform_info(soup)
            
            # Find game containers
            game_containers = self._find_game_containers(soup)
            
            if not game_containers:
                # Try fallback method
                game_containers = self._fallback_game_extraction(soup)
            
            # Extract data from each game container
            for container in game_containers[:20]:  # Limit to 20 games
                game_info = self._extract_game_data(container, platform_info)
                
                if game_info and game_info['game_title'] != "Not Available":
                    self.games_data.append(game_info)
                    
                    # Update stats
                    if game_info['release_date'] != "Not Available":
                        result['stats']['with_release'] += 1
                    if game_info['developer_information'] != "Not Available":
                        result['stats']['with_developer'] += 1
                    if game_info['publisher_information'] != "Not Available":
                        result['stats']['with_publisher'] += 1
                
                time.sleep(0.3)  # Be respectful
            
            # Update result
            result['success'] = True
            result['games'] = self.games_data
            result['stats']['total'] = len(self.games_data)
            result['scrape_time'] = datetime.now().isoformat()
            result['message'] = f"Successfully scraped {len(self.games_data)} games"
            
            if len(self.games_data) == 0:
                result['message'] = "No games found on the page. The website structure might have changed."
            
        except requests.RequestException as e:
            result['message'] = f"Connection error: {str(e)}"
        except Exception as e:
            result['message'] = f"Scraping error: {str(e)}"
        
        return result
    
    def _find_game_containers(self, soup):
        """Find all game containers on the page"""
        containers = []
        
        # Common Xbox page selectors
        selectors = [
            {'class': 'game-tile'},
            {'class': 'game-card'},
            {'class': 'm-product-card'},
            {'class': 'c-card'},
            {'class': 'product-card'},
            {'data-playful': 'experience'},
            {'class': 'game-listing-item'},
            {'class': 'game-pass-game'},
        ]
        
        for selector in selectors:
            if 'class' in selector:
                found = soup.find_all('div', class_=selector['class'])
            elif 'data-playful' in selector:
                found = soup.find_all('div', attrs={'data-playful': selector['data-playful']})
            else:
                continue
                
            if found:
                containers.extend(found)
        
        return list(set(containers))  # Remove duplicates
    
    def _fallback_game_extraction(self, soup):
        """Fallback method to find games by looking for headings"""
        containers = []
        
        # Look for game-related sections
        game_sections = soup.find_all(['section', 'div'], 
            class_=lambda x: x and any(word in str(x).lower() for word in ['game', 'catalog', 'collection']))
        
        for section in game_sections:
            headings = section.find_all(['h2', 'h3', 'h4'])
            for heading in headings[:10]:  # Limit per section
                if heading.text and len(heading.text.strip()) > 3:
                    # Check if it looks like a game title (not a section header)
                    text = heading.text.lower()
                    if not any(word in text for word in ['play', 'game pass', 'ultimate', 'essential', 'faq']):
                        containers.append({'heading': heading, 'parent': section})
        
        return containers
    
    def _extract_platform_info(self, soup):
        """Extract platform availability information"""
        try:
            # Look for platform text
            platform_keywords = ['xbox', 'console', 'pc', 'cloud', 'play on']
            for keyword in platform_keywords:
                elements = soup.find_all(['p', 'div', 'span'], 
                    string=lambda x: x and keyword.lower() in x.lower())
                if elements:
                    return elements[0].text.strip()[:100]
            
            return "Xbox Console, PC, Cloud Gaming"
        except:
            return "Xbox Console, PC, Cloud Gaming"
    
    def _extract_game_data(self, container, platform_info):
        """Extract required fields from a game container"""
        try:
            # Handle different container types
            if isinstance(container, dict) and 'heading' in container:
                # From fallback method
                title = container['heading'].text.strip()
                
                # Find description near the heading
                description = "Not Available"
                next_elem = container['heading'].find_next(['p', 'div'])
                if next_elem:
                    description = next_elem.text.strip()[:200]
                
                return {
                    'game_title': title,
                    'release_date': 'Not Available',
                    'key_features': description,
                    'platform_availability': platform_info,
                    'developer_information': 'Not Available',
                    'publisher_information': 'Not Available'
                }
            
            # Regular extraction
            title = self._extract_title(container)
            features = self._extract_features(container)
            
            if title != "Not Available":
                return {
                    'game_title': title,
                    'release_date': 'Not Available',
                    'key_features': features,
                    'platform_availability': platform_info,
                    'developer_information': 'Not Available',
                    'publisher_information': 'Not Available'
                }
            
            return None
            
        except Exception as e:
            print(f"Extraction error: {e}")
            return None
    
    def _extract_title(self, container):
        """Extract game title"""
        try:
            # Try headings
            for tag in ['h2', 'h3', 'h4']:
                heading = container.find(tag)
                if heading and heading.text.strip():
                    title = heading.text.strip()
                    if len(title) > 3 and not any(x in title.lower() for x in ['xbox', 'game pass', 'ultimate']):
                        return title
            
            # Try common title classes
            for class_name in ['title', 'game-title', 'product-name', 'card-title']:
                elem = container.find(class_=class_name)
                if elem and elem.text.strip():
                    return elem.text.strip()
            
            return "Not Available"
        except:
            return "Not Available"
    
    def _extract_features(self, container):
        """Extract key features/description"""
        try:
            # Look for paragraphs
            for p in container.find_all('p'):
                if p.text.strip() and len(p.text.strip()) > 20:
                    return p.text.strip()[:200]
            
            # Look for divs with description
            for class_name in ['description', 'features', 'info', 'text']:
                elem = container.find(class_=class_name)
                if elem and elem.text.strip():
                    return elem.text.strip()[:200]
            
            return "Not Available"
        except:
            return "Not Available"
